import { Injectable, Logger } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/sequelize';
import * as bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';
import { Sequelize } from 'sequelize-typescript';
import { Client } from '../clients/models/client.model';
import { ClientContact } from '../clients/models/client-contact.model';
import { Invoice } from '../invoices/models/invoice.model';
import { PaymentTransaction } from '../invoices/models/payment-transaction.model';
import { MailService } from '../mail/mail.service';
import { Project } from '../projects/models/project.model';
import { ProjectService } from '../projects/models/project-service.model';
import { Role } from '../roles/models/role.model';
import { User } from '../users/models/user.model';
import { ClientStatus, ProjectStatus, UserType } from '@/common/enums/index.enum';
import { UserStatus } from '@/common/enums/user-status.enum';
import { Order, OrderStatus } from './models/order.model';
import { OrderPayment } from './models/order-payment.model';

/**
 * Turns a PAID order into a workspace:
 *   Order(paid) -> User(client) -> ClientContact -> Client -> Project
 *                                       \-> Invoice(paid) + PaymentTransaction
 * Reuses the platform's existing identity chain and finance tables.
 *
 * Idempotent: guarded by an order row lock + provisioning_status, so webhook
 * replays, the browser verify call and the retry sweeper can all call it safely.
 */
@Injectable()
export class ProvisioningService {
  private readonly log = new Logger('Provisioning');

  constructor(
    @InjectConnection() private readonly sequelize: Sequelize,
    @InjectModel(Order) private readonly orders: typeof Order,
    @InjectModel(OrderPayment) private readonly orderPayments: typeof OrderPayment,
    @InjectModel(User) private readonly users: typeof User,
    @InjectModel(Role) private readonly roles: typeof Role,
    @InjectModel(Client) private readonly clients: typeof Client,
    @InjectModel(ClientContact) private readonly contacts: typeof ClientContact,
    @InjectModel(Project) private readonly projects: typeof Project,
    @InjectModel(ProjectService) private readonly projectServices: typeof ProjectService,
    @InjectModel(Invoice) private readonly invoices: typeof Invoice,
    @InjectModel(PaymentTransaction) private readonly transactions: typeof PaymentTransaction,
    private readonly mail: MailService,
  ) {}

  async provision(orderId: string): Promise<'done' | 'already_done' | 'manual_review' | 'skipped'> {
    const result = await this.sequelize.transaction(async (t) => {
      const order = await this.orders.findByPk(orderId, { transaction: t, lock: t.LOCK.UPDATE });
      if (!order || order.status !== OrderStatus.PAID) return 'skipped' as const;
      if (order.provisioningStatus === 'done') return 'already_done' as const;
      if (order.provisioningStatus === 'manual_review') return 'manual_review' as const;

      const email = order.buyerEmail.trim().toLowerCase();
      const now = new Date();

      // ---- 1. identity: find or create the User ---------------------------
      let user = await this.users.findOne({ where: { email }, transaction: t, lock: t.LOCK.UPDATE });
      let needsPasswordSetup = false;

      if (user) {
        // Never silently convert a staff/admin account (or revive a suspended one)
        // into a customer. Park it for a human; the order stays PAID.
        if (user.userType !== UserType.CLIENT || user.status === UserStatus.SUSPENDED) {
          await order.update(
            {
              provisioningStatus: 'manual_review',
              provisioningNote: user.userType !== UserType.CLIENT ? 'Buyer email belongs to a staff/admin account' : 'Buyer account is suspended',
            },
            { transaction: t },
          );
          this.log.warn(`Order ${order.orderNumber} needs manual review: ${order.provisioningNote}`);
          return 'manual_review' as const;
        }
        needsPasswordSetup = user.status === UserStatus.INVITED; // bought before, never logged in
      } else {
        const role = await this.roles.findOne({ where: { slug: 'client' }, transaction: t });
        if (!role) throw new Error("System role 'client' is missing - run the role seeders");

        const [first, ...rest] = order.buyerName.trim().split(/\s+/);
        user = await this.users.create(
          {
            userType: UserType.CLIENT,
            roleId: role.id,
            firstName: first.slice(0, 80),
            lastName: rest.join(' ').slice(0, 80) || null,
            initials: [first, ...rest].map((w) => w[0]?.toUpperCase() ?? '').join('').slice(0, 4) || null,
            email,
            phone: order.buyerPhone,
            // password_hash is NOT NULL. Store the hash of 48 random bytes nobody knows: the
            // account cannot be logged into until the buyer sets a password via the emailed link.
            passwordHash: await bcrypt.hash(randomBytes(48).toString('hex'), 12),
            status: UserStatus.INVITED,
            // The User model declares these as plain NOT NULL columns (no auto-fill).
            createdAt: now,
            updatedAt: now,
          } as any,
          { transaction: t },
        );
        needsPasswordSetup = true;
      }

      // ---- 2. client organisation: reuse the buyer's, else create ----------
      const existingContact = await this.contacts.findOne({ where: { userId: user.id }, transaction: t });
      let clientId = existingContact?.clientId;
      if (!clientId) {
        const client = await this.clients.create(
          {
            name: (order.buyerCompany || order.buyerName).slice(0, 150),
            email,
            phone: order.buyerPhone,
            status: ClientStatus.ACTIVE,
            createdBy: user.id, // clients.created_by is NOT NULL; the buyer is the creator for self-serve signups
          } as any,
          { transaction: t },
        );
        clientId = client.id;
        await this.contacts.create(
          { clientId, userId: user.id, isPrimary: true, designation: order.buyerCompany ? 'Purchaser' : null, createdAt: now } as any,
          { transaction: t },
        );
      }

      // ---- 3. the project that fulfils this order --------------------------
      const projectName = `${order.serviceName} · ${order.planName}${order.packLabel ? ` (${order.packLabel})` : ''}`;
      const project = await this.projects.create(
        {
          clientId,
          name: projectName.slice(0, 150),
          description: [
            `Purchased via oct20five.com — order ${order.orderNumber}.`,
            order.featuresSnapshot?.length ? `Includes: ${order.featuresSnapshot.join('; ')}.` : '',
            order.addons?.length ? `Add-ons: ${order.addons.map((a) => a.label).join(', ')}.` : '',
            order.notes ? `Client notes: ${order.notes}` : '',
          ].filter(Boolean).join('\n'),
          status: ProjectStatus.NOT_STARTED,
          progressPercent: 0,
          currentWorkTitle: 'Onboarding & kickoff',
          currentWorkServiceId: order.serviceId,
          currentWorkDescription: 'Your team is reviewing your order and will reach out to schedule kickoff.',
          createdBy: user.id,
        } as any,
        { transaction: t },
      );
      if (order.serviceId) {
        await this.projectServices.create({ projectId: project.id, serviceId: order.serviceId } as any, { transaction: t });
      }

      // ---- 4. finance records so Workspace > Finance sees the same money ----
      const payment = await this.orderPayments.findOne({ where: { orderId: order.id, status: 'captured' }, transaction: t });
      const today = now.toISOString().slice(0, 10);
      const invoice = await this.invoices.create(
        {
          invoice_number: `INV-${order.orderNumber}`,
          client_id: clientId,
          project_id: project.id,
          amount: order.total,
          amount_paid: order.total,
          currency: order.currency,
          status: 'paid',
          description: `${projectName} — order ${order.orderNumber}`.slice(0, 255),
          issue_date: today,
          due_date: today,
          created_by: user.id,
          created_at: now,
          updated_at: now,
        } as any,
        { transaction: t },
      );
      await this.transactions.create(
        {
          invoice_id: invoice.id,
          amount: order.total,
          method: payment?.method ?? payment?.provider ?? null,
          reference: payment?.providerPaymentId ?? null,
          paid_at: order.paidAt ?? now,
          status: 'success',
          created_at: now,
        } as any,
        { transaction: t },
      );

      // ---- 5. link everything to the order, mark done -----------------------
      await order.update(
        { clientId, userId: user.id, projectId: project.id, invoiceId: invoice.id, provisioningStatus: 'done', provisioningNote: null },
        { transaction: t },
      );

      // ---- 6. access email (queued in this transaction; deduped per order) --
      const base = {
        name: order.buyerName.split(/\s+/)[0],
        orderNumber: order.orderNumber,
        serviceName: order.serviceName,
        planName: order.planName,
        packLabel: order.packLabel,
        total: Number(order.total),
        currency: order.currency,
        paidAt: order.paidAt?.toISOString() ?? null,
      };
      await this.mail.enqueue(
        needsPasswordSetup
          ? { dedupeKey: `access:${order.id}`, template: 'workspace_invitation', to: email, data: { ...base, userId: user.id } }
          : { dedupeKey: `access:${order.id}`, template: 'order_added', to: email, data: base },
        t,
      );
      return 'done' as const;
    });

    if (result === 'done') this.mail.kick();
    return result;
  }
}
