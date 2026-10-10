import {
  BadRequestException,
  ForbiddenException,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
  OnModuleDestroy,
  OnModuleInit,
  ServiceUnavailableException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectConnection, InjectModel } from '@nestjs/sequelize';
import { randomBytes } from 'crypto';
import { Op, Transaction, UniqueConstraintError } from 'sequelize';
import { Sequelize } from 'sequelize-typescript';
import { CatalogService } from '../catalog/catalog.service';
import { computeQuote, Quote } from '../catalog/pricing';
import { MailService } from '../mail/mail.service';
import { PAYMENT_PROVIDER } from '../payments/payment-provider';
import type { NormalizedPaymentEvent, PaymentProvider } from '../payments/payment-provider';
import { PaymentTransaction } from '../invoices/models/payment-transaction.model';
import { Invoice } from '../invoices/models/invoice.model';
import { ServiceAddon } from '../services/models/service-addon.model';
import { PromoCode } from '../services/models/promo-code.model';
import { User } from '../users/models/user.model';
import { CreateOrderDto, QuoteDto } from './dto/checkout.dto';
import { Order, OrderStatus } from './models/order.model';
import { OrderPayment } from './models/order-payment.model';
import { PaymentWebhookEvent } from './models/payment-webhook-event.model';
import { isValidOrderToken, orderAccessToken } from './order-token';
import { ProvisioningService } from './provisioning.service';

const NUM = (v: unknown) => Number(v);

@Injectable()
export class OrdersService implements OnModuleInit, OnModuleDestroy {
  private readonly log = new Logger('Orders');
  private sweeper?: NodeJS.Timeout;

  constructor(
    @InjectConnection() private readonly sequelize: Sequelize,
    @InjectModel(Order) private readonly orders: typeof Order,
    @InjectModel(OrderPayment) private readonly payments: typeof OrderPayment,
    @InjectModel(PaymentWebhookEvent) private readonly events: typeof PaymentWebhookEvent,
    @InjectModel(ServiceAddon) private readonly addons: typeof ServiceAddon,
    @InjectModel(PromoCode) private readonly promos: typeof PromoCode,
    @InjectModel(User) private readonly users: typeof User,
    @InjectModel(Invoice) private readonly invoices: typeof Invoice,
    @InjectModel(PaymentTransaction) private readonly transactions: typeof PaymentTransaction,
    @Inject(PAYMENT_PROVIDER) private readonly provider: PaymentProvider,
    private readonly catalog: CatalogService,
    private readonly provisioning: ProvisioningService,
    private readonly mail: MailService,
    private readonly config: ConfigService,
  ) {}

  // ───────────────────────── lifecycle: provisioning retry sweeper ─────────
  onModuleInit() {
    if (this.config.get('ORDER_SWEEPER') === 'off') return;
    this.sweeper = setInterval(() => void this.retryStuckProvisioning(), 60_000);
    this.sweeper.unref();
  }
  onModuleDestroy() {
    if (this.sweeper) clearInterval(this.sweeper);
  }

  /** Paid orders whose provisioning failed or never ran are retried here. */
  async retryStuckProvisioning(): Promise<number> {
    const stuck = await this.orders.findAll({
      where: { status: OrderStatus.PAID, provisioningStatus: 'not_started', paidAt: { [Op.lt]: new Date(Date.now() - 20_000) } },
      limit: 20,
    });
    for (const o of stuck) {
      try {
        await this.provisioning.provision(o.id);
      } catch (e: any) {
        this.log.error(`Provisioning retry failed for ${o.orderNumber}: ${e?.message}`);
      }
    }
    return stuck.length;
  }

  // ───────────────────────── config helpers ────────────────────────────────
  private get tokenSecret() {
    return this.config.get<string>('ORDER_TOKEN_SECRET') || this.config.getOrThrow<string>('JWT_SECRET');
  }
  private get taxRate() {
    const r = Number(this.config.get('GST_RATE') ?? 0.18);
    return Number.isFinite(r) && r >= 0 && r < 1 ? r : 0.18;
  }
  private get workspaceUrl() {
    const w = this.config.get<string>('WORKSPACE_URL');
    if (w) return w.trim().replace(/\/$/, '');
    const site = this.config.get<string>('WEBSITE_URL') ?? this.config.get<string>('FRONTEND_URL') ?? 'http://localhost:3000';
    return `${site.split(',')[0].trim().replace(/\/$/, '')}/agency/account`;
  }
  private tokenFor(orderNumber: string) {
    return orderAccessToken(this.tokenSecret, orderNumber);
  }

  // ───────────────────────── pricing (server is the only authority) ────────
  private async price(dto: QuoteDto) {
    const { service, plan } = await this.catalog.resolvePlan(dto.serviceSlug, dto.planSlug);

    let quantity = 1;
    let packDiscount = 0;
    let pack: { id: string; label: string } | null = null;
    if (service.pricingMode === 'packs') {
      const p = (plan.packages ?? []).find((k) => k.id === dto.packId);
      if (!p) throw new BadRequestException('Please choose a pack size');
      quantity = p.quantity;
      packDiscount = NUM(p.discountPercent);
      pack = { id: p.id, label: p.label };
    }

    const codes = [...new Set(dto.addonCodes ?? [])];
    const addons = codes.length ? await this.addons.findAll({ where: { serviceId: service.id, code: { [Op.in]: codes }, isActive: true } }) : [];
    if (addons.length !== codes.length) throw new BadRequestException('One or more add-ons are not available');

    let promo: PromoCode | null = null;
    if (dto.promoCode) {
      promo = await this.promos.findOne({ where: { code: dto.promoCode.trim().toUpperCase(), isActive: true } });
      const bad = !promo || (promo.expiresAt && promo.expiresAt < new Date()) || (promo.maxRedemptions != null && promo.redemptions >= promo.maxRedemptions);
      if (bad) throw new BadRequestException('Invalid or expired promo code');
    }

    const quote: Quote = computeQuote({
      unitPrice: NUM(plan.price),
      quantity,
      packDiscountPercent: packDiscount,
      addonPrices: addons.map((a) => NUM(a.price)),
      promoPercent: promo ? NUM(promo.percentOff) : 0,
      taxRate: this.taxRate,
    });
    return { service, plan, pack, addons, promo, quote };
  }

  async quote(dto: QuoteDto) {
    const { service, plan, pack, addons, promo, quote } = await this.price(dto);
    return {
      service: service.name,
      package: plan.name,
      pack: pack?.label ?? null,
      addons: addons.map((a) => ({ code: a.code, label: a.label, price: NUM(a.price) })),
      promoCode: promo?.code ?? null,
      currency: 'INR',
      ...quote,
    };
  }

  // ───────────────────────── create order + start payment ──────────────────
  async createOrder(dto: CreateOrderDto, idempotencyKey?: string) {
    const key = idempotencyKey?.trim().slice(0, 80) || null;
    if (key) {
      const prior = await this.orders.findOne({ where: { idempotencyKey: key } });
      if (prior) {
        if (prior.buyerEmail !== dto.email) throw new BadRequestException('Idempotency key was already used');
        return this.startPayment(prior); // same request twice -> same order, never a duplicate
      }
    }

    const { service, plan, pack, addons, promo, quote } = await this.price(dto);
    if (quote.totalMinor < 100) throw new BadRequestException('Order total is too low');

    let order: Order | undefined;
    for (let attempt = 0; attempt < 5 && !order; attempt++) {
      try {
        order = await this.orders.create({
          orderNumber: this.newOrderNumber(),
          status: OrderStatus.PENDING,
          buyerName: dto.name,
          buyerEmail: dto.email,
          buyerPhone: dto.phone ?? null,
          buyerCompany: dto.company ?? null,
          buyerGstin: dto.gstin ?? null,
          notes: dto.notes ?? null,
          serviceId: service.id,
          planId: plan.id,
          packId: pack?.id ?? null,
          // ---- frozen commercial snapshot ----
          serviceName: service.name,
          planName: plan.name,
          packLabel: pack?.label ?? null,
          quantity: quote.quantity,
          unitPrice: quote.unitPrice,
          listPrice: quote.listPrice,
          packDiscountPercent: quote.packDiscountPercent,
          packDiscount: quote.packDiscount,
          addons: addons.map((a) => ({ code: a.code, label: a.label, price: NUM(a.price) })),
          addonsTotal: quote.addonsTotal,
          promoCode: promo?.code ?? null,
          promoPercent: quote.promoPercent,
          promoDiscount: quote.promoDiscount,
          subtotal: quote.subtotal,
          taxRate: quote.taxRate,
          taxAmount: quote.taxAmount,
          total: quote.total,
          currency: 'INR',
          featuresSnapshot: (plan.features ?? []).map((f) => f.featureText),
          idempotencyKey: key,
        } as any);
      } catch (e) {
        if (!(e instanceof UniqueConstraintError)) throw e;
        // Either a concurrent request with the same idempotency key won the race
        // (return its order), or the random order number collided (loop & retry).
        if (key) {
          const prior = await this.orders.findOne({ where: { idempotencyKey: key } });
          if (prior) return this.startPayment(prior);
        }
      }
    }
    if (!order) throw new ServiceUnavailableException('Could not create order, please retry');
    return this.startPayment(order);
  }

  /** Creates (or re-uses) the gateway order and returns what the browser needs to pay. */
  async startPayment(order: Order) {
    if (![OrderStatus.PENDING, OrderStatus.PAYMENT_PENDING, OrderStatus.FAILED].includes(order.status)) {
      return { order: this.present(order), payment: null, accessToken: this.tokenFor(order.orderNumber) };
    }

    let attempt = await this.payments.findOne({ where: { orderId: order.id, status: 'created' }, order: [['createdAt', 'DESC']] });
    let clientConfig: Record<string, unknown>;

    if (attempt) {
      // Re-use the open gateway order (a gateway order accepts several payment attempts).
      clientConfig = {
        provider: attempt.provider,
        orderId: attempt.providerOrderId,
        amount: NUM(attempt.amountMinor),
        currency: attempt.currency,
        ...(attempt.provider === 'razorpay' ? { keyId: this.config.get('RAZORPAY_KEY_ID'), name: this.config.get('MERCHANT_NAME') ?? 'OCT20FIVE' } : {}),
      };
    } else {
      let created;
      try {
        created = await this.provider.createPayment({
          receipt: order.orderNumber,
          amountMinor: Math.round(NUM(order.total) * 100),
          currency: order.currency,
          notes: { order_number: order.orderNumber },
        });
      } catch (e: any) {
        this.log.error(`Gateway createPayment failed for ${order.orderNumber}: ${e?.message}`);
        throw new ServiceUnavailableException('Payments are temporarily unavailable. Please try again in a moment.');
      }
      attempt = await this.payments.create({
        orderId: order.id,
        provider: this.provider.name,
        providerOrderId: created.providerOrderId,
        amountMinor: Math.round(NUM(order.total) * 100),
        currency: order.currency,
        status: 'created',
      } as any);
      clientConfig = created.clientConfig;
    }

    if (order.status !== OrderStatus.PAYMENT_PENDING) await order.update({ status: OrderStatus.PAYMENT_PENDING });
    return {
      order: this.present(order),
      accessToken: this.tokenFor(order.orderNumber),
      payment: { ...clientConfig, prefill: { name: order.buyerName, email: order.buyerEmail, contact: order.buyerPhone ?? undefined } },
    };
  }

  // ───────────────────────── anonymous order access (capability token) ─────
  private async loadForBuyer(orderNumber: string, token?: string): Promise<Order> {
    if (!isValidOrderToken(this.tokenSecret, orderNumber, token)) throw new UnauthorizedException('Invalid order link');
    const order = await this.orders.findOne({ where: { orderNumber } });
    if (!order) throw new NotFoundException('Order not found');
    return order;
  }

  async getPublic(orderNumber: string, token?: string) {
    const order = await this.loadForBuyer(orderNumber, token);
    let account: 'none' | 'invited' | 'active' = 'none';
    if (order.userId) {
      const u = await this.users.findByPk(order.userId, { attributes: ['status'] });
      account = u?.status === 'active' ? 'active' : 'invited';
    }
    return { ...this.present(order), account, loginUrl: this.workspaceUrl };
  }

  async retryPayment(orderNumber: string, token?: string) {
    const order = await this.loadForBuyer(orderNumber, token);
    if (order.status === OrderStatus.PAID) throw new BadRequestException('This order is already paid');
    if (order.status === OrderStatus.REFUNDED) throw new BadRequestException('This order was refunded');
    if (order.status === OrderStatus.CANCELLED) await order.update({ status: OrderStatus.PENDING, cancelledAt: null });
    return this.startPayment(order);
  }

  async cancel(orderNumber: string, token?: string) {
    const order = await this.loadForBuyer(orderNumber, token);
    if (![OrderStatus.PENDING, OrderStatus.PAYMENT_PENDING, OrderStatus.FAILED].includes(order.status)) {
      throw new BadRequestException('This order can no longer be cancelled');
    }
    await order.update({ status: OrderStatus.CANCELLED, cancelledAt: new Date() });
    return this.present(order);
  }

  /**
   * The browser reports "I paid". That is a CLAIM, not proof. We:
   *  1) verify the gateway's signature over (order_id|payment_id);
   *  2) ask the gateway server-to-server what really happened;
   *  3) check order match (amount/currency are checked again at settlement);
   * and only then settle - through the same code path as the webhook.
   */
  async verifyFromBrowser(orderNumber: string, token: string | undefined, body: { providerPaymentId: string; signature: string }) {
    const order = await this.loadForBuyer(orderNumber, token);
    const attempt = await this.payments.findOne({ where: { orderId: order.id }, order: [['createdAt', 'DESC']] });
    if (!attempt) throw new BadRequestException('No payment was started for this order');

    const ok = this.provider.verifyCheckoutSignature({
      providerOrderId: attempt.providerOrderId,
      providerPaymentId: body.providerPaymentId,
      signature: body.signature,
    });
    if (!ok) throw new BadRequestException('Payment signature is invalid');

    let remote;
    try {
      remote = await this.provider.fetchPayment(body.providerPaymentId);
    } catch (e: any) {
      this.log.error(`fetchPayment failed for ${orderNumber}: ${e?.message}`);
      return this.getPublic(orderNumber, token); // signature was valid; webhook will settle it
    }
    if (remote.providerOrderId !== attempt.providerOrderId) throw new BadRequestException('Payment does not belong to this order');

    if (remote.status === 'captured') {
      await this.applyEvent({
        eventId: `verify:${remote.providerPaymentId}`,
        type: 'payment.captured',
        providerOrderId: remote.providerOrderId ?? undefined,
        providerPaymentId: remote.providerPaymentId,
        amountMinor: remote.amountMinor,
        currency: remote.currency,
        method: remote.method,
      });
    } else if (remote.status === 'failed') {
      await this.applyEvent({
        eventId: `verify:${remote.providerPaymentId}`,
        type: 'payment.failed',
        providerOrderId: remote.providerOrderId ?? undefined,
        providerPaymentId: remote.providerPaymentId,
        amountMinor: remote.amountMinor,
        currency: remote.currency,
        failureReason: 'Payment failed at the gateway',
      });
    }
    return this.getPublic(orderNumber, token);
  }

  // ───────────────────────── webhook entry point ───────────────────────────
  async handleWebhook(providerName: string, rawBody: Buffer | undefined, headers: Record<string, any>) {
    if (providerName !== this.provider.name) throw new NotFoundException();
    if (!rawBody) throw new BadRequestException('Missing body');
    const evt = this.provider.parseWebhook(rawBody, headers); // throws 401 on a bad signature
    if (!evt) return { received: true, ignored: true };
    return this.applyEvent(evt);
  }

  /**
   * THE single place payment state changes. Idempotency is enforced three ways:
   *   1. (provider, event_id) unique ledger row, inserted in the same transaction
   *      as the state change (a failed attempt rolls it back, so the gateway's
   *      retry is processed, not skipped);
   *   2. order row lock + status check;
   *   3. unique (provider, provider_payment_id).
   */
  async applyEvent(evt: NormalizedPaymentEvent): Promise<{ received: true; duplicate?: boolean; outcome?: string }> {
    let outcome = 'noop';
    let settledOrderId: string | null = null;

    try {
      await this.sequelize.transaction(async (t) => {
        await this.events.create({ provider: this.provider.name, eventId: evt.eventId, eventType: evt.type } as any, { transaction: t });

        const attempt = await this.findAttempt(evt, t);
        if (!attempt) {
          outcome = 'ignored: unknown payment';
          this.log.warn(`Webhook ${evt.eventId}: no order for ${evt.providerOrderId ?? evt.providerPaymentId}`);
          return;
        }
        const order = await this.orders.findByPk(attempt.orderId, { transaction: t, lock: t.LOCK.UPDATE });
        if (!order) return;

        if (evt.type === 'payment.captured') {
          outcome = await this.onCaptured(order, attempt, evt, t);
          if (outcome === 'paid') settledOrderId = order.id;
        } else if (evt.type === 'payment.failed') {
          outcome = await this.onFailed(order, attempt, evt, t);
        } else if (evt.type === 'payment.refunded') {
          outcome = await this.onRefunded(order, attempt, t);
        }
        await this.events.update({ outcome, processedAt: new Date() }, { where: { provider: this.provider.name, eventId: evt.eventId }, transaction: t });
      });
    } catch (e) {
      if (e instanceof UniqueConstraintError) return { received: true, duplicate: true }; // already handled
      throw e; // 5xx -> the gateway redelivers; nothing was committed
    }

    this.mail.kick();
    if (settledOrderId) {
      // Provisioning is a SEPARATE transaction: money is already safely recorded
      // as PAID even if provisioning has a problem; the sweeper retries.
      try {
        await this.provisioning.provision(settledOrderId);
      } catch (e: any) {
        this.log.error(`Provisioning failed for order ${settledOrderId} (sweeper will retry): ${e?.stack ?? e}`);
      }
    }
    return { received: true, outcome };
  }

  private async findAttempt(evt: NormalizedPaymentEvent, t: Transaction) {
    const provider = this.provider.name;
    if (evt.providerOrderId) {
      const a = await this.payments.findOne({ where: { provider, providerOrderId: evt.providerOrderId }, transaction: t, lock: t.LOCK.UPDATE });
      if (a) return a;
    }
    if (evt.providerPaymentId) {
      return this.payments.findOne({ where: { provider, providerPaymentId: evt.providerPaymentId }, transaction: t, lock: t.LOCK.UPDATE });
    }
    return null;
  }

  private async onCaptured(order: Order, attempt: OrderPayment, evt: NormalizedPaymentEvent, t: Transaction): Promise<string> {
    if (order.status === OrderStatus.PAID || order.status === OrderStatus.REFUNDED) return 'already_settled';

    // Never trust amounts blindly: a captured payment must match what we asked for.
    if (NUM(attempt.amountMinor) !== evt.amountMinor || attempt.currency.toUpperCase() !== evt.currency.toUpperCase()) {
      await order.update(
        { provisioningStatus: 'manual_review', provisioningNote: `Amount mismatch: expected ${attempt.amountMinor} ${attempt.currency}, gateway reported ${evt.amountMinor} ${evt.currency}` },
        { transaction: t },
      );
      this.log.error(`AMOUNT MISMATCH on ${order.orderNumber}; order NOT marked paid`);
      return 'amount_mismatch';
    }

    await attempt.update({ status: 'captured', providerPaymentId: evt.providerPaymentId, method: evt.method ?? null }, { transaction: t });
    // A capture always wins - even over failed/cancelled - because the customer's money has arrived.
    await order.update({ status: OrderStatus.PAID, paidAt: new Date(), failureReason: null }, { transaction: t });

    if (order.promoCode) {
      await this.promos.increment('redemptions', { by: 1, where: { code: order.promoCode }, transaction: t });
    }
    await this.mail.enqueue(
      {
        dedupeKey: `order_confirmation:${order.id}`,
        template: 'order_confirmation',
        to: order.buyerEmail,
        data: {
          name: order.buyerName.split(/\s+/)[0],
          orderNumber: order.orderNumber,
          serviceName: order.serviceName,
          planName: order.planName,
          packLabel: order.packLabel,
          total: NUM(order.total),
          currency: order.currency,
          paidAt: new Date().toISOString(),
        },
      },
      t,
    );
    return 'paid';
  }

  private async onFailed(order: Order, attempt: OrderPayment, evt: NormalizedPaymentEvent, t: Transaction): Promise<string> {
    if (order.status === OrderStatus.PAID || order.status === OrderStatus.REFUNDED) return 'already_settled';
    // The gateway order stays open (the customer can retry inside the same checkout),
    // so the attempt stays 'created'; we only record why it failed.
    await attempt.update({ failureReason: evt.failureReason ?? null }, { transaction: t });
    await order.update({ status: OrderStatus.FAILED, failedAt: new Date(), failureReason: (evt.failureReason ?? 'Payment failed').slice(0, 255) }, { transaction: t });
    await this.mail.enqueue(
      {
        dedupeKey: `payment_failed:${order.id}`, // once per order, not once per attempt
        template: 'payment_failed',
        to: order.buyerEmail,
        data: {
          name: order.buyerName.split(/\s+/)[0],
          orderNumber: order.orderNumber,
          serviceName: order.serviceName,
          planName: order.planName,
          packLabel: order.packLabel,
          total: NUM(order.total),
          currency: order.currency,
        },
      },
      t,
    );
    return 'failed';
  }

  private async onRefunded(order: Order, attempt: OrderPayment, t: Transaction): Promise<string> {
    if (order.status === OrderStatus.REFUNDED) return 'already_settled';
    await attempt.update({ status: 'refunded' }, { transaction: t });
    await order.update({ status: OrderStatus.REFUNDED }, { transaction: t });
    if (order.invoiceId) {
      await this.transactions.update({ status: 'refunded' }, { where: { invoice_id: order.invoiceId }, transaction: t });
      await this.invoices.update({ status: 'cancelled' }, { where: { id: order.invoiceId }, transaction: t });
    }
    return 'refunded';
  }

  // ───────────────────────── read models ───────────────────────────────────
  private newOrderNumber(): string {
    const d = new Date();
    const yymm = `${String(d.getFullYear()).slice(2)}${String(d.getMonth() + 1).padStart(2, '0')}`;
    const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // no 0/O/1/I
    const suffix = Array.from(randomBytes(6), (b) => alphabet[b % alphabet.length]).join('');
    return `OCT-${yymm}-${suffix}`;
  }

  /** Safe-to-expose projection. */
  present(o: Order) {
    return {
      orderNumber: o.orderNumber,
      status: o.status,
      serviceName: o.serviceName,
      planName: o.planName,
      packLabel: o.packLabel,
      quantity: o.quantity,
      addons: o.addons ?? [],
      promoCode: o.promoCode,
      subtotal: NUM(o.subtotal),
      promoDiscount: NUM(o.promoDiscount),
      taxAmount: NUM(o.taxAmount),
      total: NUM(o.total),
      currency: o.currency,
      paidAt: o.paidAt,
      createdAt: (o as any).createdAt,
      workspaceReady: o.provisioningStatus === 'done',
      failureReason: o.status === OrderStatus.FAILED ? o.failureReason : null,
    };
  }

  /** Staff/admin only: gated by the orders.view permission at the route. */
  async adminList(page = 1, limit = 25, status?: string) {
    const where: any = {};
    if (status) where.status = status;
    const { rows, count } = await this.orders.findAndCountAll({ where, order: [['createdAt', 'DESC']], limit, offset: (page - 1) * limit });
    return {
      data: rows.map((o) => ({
        ...this.present(o),
        id: o.id,
        buyerName: o.buyerName,
        buyerEmail: o.buyerEmail,
        clientId: o.clientId,
        projectId: o.projectId,
        invoiceId: o.invoiceId,
        provisioningStatus: o.provisioningStatus,
        provisioningNote: o.provisioningNote,
      })),
      meta: { total: count, page, limit, totalPages: Math.ceil(count / limit) },
    };
  }

  /** The signed-in client's own orders (scoped by clientId from their JWT). */
  async mine(clientId: string | undefined) {
    if (!clientId) return [];
    const rows = await this.orders.findAll({
      where: { clientId },
      order: [['createdAt', 'DESC']],
      include: [
        { association: 'project', attributes: ['id', 'name', 'status', 'progressPercent', 'currentWorkTitle', 'currentWorkDescription'] },
        { association: 'invoice', attributes: ['id', 'invoice_number', 'status'] },
      ],
    });
    return rows.map((o) => ({
      ...this.present(o),
      project: o.project
        ? { id: o.project.id, name: o.project.name, status: o.project.status, progressPercent: o.project.progressPercent, currentWork: o.project.currentWorkTitle, nextStep: o.project.currentWorkDescription }
        : null,
      invoice: o.invoice ? { id: o.invoice.id, number: o.invoice.invoice_number, status: o.invoice.status } : null,
    }));
  }

  assertClient(requester: { userType: string; clientId?: string }) {
    if (requester.userType !== 'client' || !requester.clientId) throw new ForbiddenException('Client account required');
  }
}
