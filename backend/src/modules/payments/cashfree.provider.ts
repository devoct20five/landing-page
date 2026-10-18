import {
  BadGatewayException,
  BadRequestException,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { createHmac, timingSafeEqual } from 'node:crypto';

import type {
  CreatePaymentInput,
  CreatePaymentResult,
  NormalizedPaymentEvent,
  PaymentProvider,
  ProviderPayment,
} from './payment-provider';

export type CashfreeEnvironment = 'sandbox' | 'production';

export interface CashfreeCustomer {
  id: string;
  phone: string;
  email?: string;
  name?: string;
}

export interface CashfreeOrder {
  cf_order_id?: number;
  order_id: string;
  order_status: string;
  order_amount: number;
  order_currency: string;
  payment_session_id?: string;
  order_expiry_time?: string;
  [key: string]: unknown;
}

interface CashfreePayment {
  cf_payment_id: string | number;
  order_id: string;
  payment_status: string;
  payment_amount: number;
  payment_currency: string;
  payment_group?: string;
  payment_message?: string;
  [key: string]: unknown;
}

@Injectable()
export class CashfreeProvider implements PaymentProvider {
  readonly name = 'cashfree';

  private readonly logger = new Logger(CashfreeProvider.name);
  private readonly baseUrl: string;
  private readonly apiVersion = '2025-01-01';

  /**
   * Runtime cache only. This is NOT durable storage.
   * Production applications should persist the order/payment mapping.
   */
  private readonly paymentOrderMap = new Map<string, string>();

  constructor(
    private readonly appId: string,
    private readonly secretKey: string,
    private readonly environment: CashfreeEnvironment,
    private readonly webhookSecret: string,
    private readonly merchantName = 'OCT20FIVE',
  ) {
    if (!appId?.trim() || !secretKey?.trim()) {
      throw new Error('Cashfree App ID and Secret Key are required');
    }

    if (!['sandbox', 'production'].includes(environment)) {
      throw new Error('CASHFREE_ENV must be sandbox or production');
    }

    this.baseUrl =
      environment === 'production'
        ? 'https://api.cashfree.com/pg'
        : 'https://sandbox.cashfree.com/pg';
  }

  /**
   * Creates a Cashfree order.
   *
   * amountMinor is in the smallest currency unit:
   * INR 10000 paise = INR 100.00.
   *
   * Required notes:
   * customer_id and customer_phone.
   *
   * Optional notes:
   * customer_email, customer_name, return_url, notify_url.
   */
  async createPayment(input: CreatePaymentInput): Promise<CreatePaymentResult> {
    if (
      !input.receipt ||
      input.receipt.length < 3 ||
      input.receipt.length > 50 ||
      !/^[a-zA-Z0-9_-]+$/.test(input.receipt)
    ) {
      throw new BadRequestException('Invalid payment receipt/order ID');
    }

    if (!Number.isSafeInteger(input.amountMinor) || input.amountMinor <= 0) {
      throw new BadRequestException(
        'Payment amount must be a positive integer in minor currency units',
      );
    }

    const notes = input.notes ?? {};

    const customerId = notes.customer_id?.trim();
    const customerPhone = notes.customer_phone?.trim();

    if (
      !customerId ||
      !customerPhone ||
      !/^\+?[0-9]{8,15}$/.test(customerPhone)
    ) {
      throw new BadRequestException(
        'Cashfree requires customer_id and a valid customer_phone in payment notes',
      );
    }

    if (!/^[A-Z]{3}$/.test(input.currency)) {
      throw new BadRequestException(
        'Currency must be a three-letter ISO currency code',
      );
    }

    const amount = input.amountMinor / 100;

    const returnUrl = notes.return_url?.trim();

    if (!returnUrl || !/^https?:\/\//i.test(returnUrl)) {
      throw new BadRequestException(
        'A valid return_url must be supplied in payment notes',
      );
    }

    const payload = {
      order_id: input.receipt,
      order_amount: amount,
      order_currency: input.currency.toUpperCase(),
      customer_details: {
        customer_id: customerId,
        customer_phone: customerPhone,
        ...(notes.customer_email
          ? { customer_email: notes.customer_email }
          : {}),
        ...(notes.customer_name ? { customer_name: notes.customer_name } : {}),
      },
      order_meta: {
        return_url: returnUrl,
        ...(notes.notify_url ? { notify_url: notes.notify_url } : {}),
      },
      order_note: notes.order_note ?? `Payment to ${this.merchantName}`,
    };

    try {
      const response = await fetch(`${this.baseUrl}/orders`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(15_000),
      });

      if (!response.ok) {
        this.logger.error(
          `Cashfree order creation failed: HTTP ${response.status}`,
        );

        throw new BadGatewayException(
          'Unable to create payment order with Cashfree',
        );
      }

      const order = (await response.json()) as CashfreeOrder;

      if (!order.order_id || !order.payment_session_id) {
        this.logger.error(
          'Cashfree response missing order_id or payment_session_id',
        );

        throw new BadGatewayException(
          'Cashfree did not return a valid payment session',
        );
      }

      return {
        providerOrderId: order.order_id,
        clientConfig: {
          paymentSessionId: order.payment_session_id,
          environment: this.environment,
          mode: this.environment === 'production' ? 'live' : 'sandbox',
        },
      };
    } catch (error) {
      if (error instanceof BadGatewayException) {
        throw error;
      }

      this.logger.error('Cashfree order request failed');

      throw new BadGatewayException('Cashfree payment service is unavailable');
    }
  }

  /**
   * Cashfree does not use the same browser checkout signature
   * scheme as Razorpay.
   *
   * Do not treat a non-empty signature as proof of payment.
   * Confirm checkout results with fetchPayment() instead.
   *
   * Returning false prevents this method from falsely accepting
   * an unsupported signature format.
   */
  verifyCheckoutSignature(input: {
    providerOrderId: string;
    providerPaymentId: string;
    signature: string;
  }): boolean {
    void input;
    return false;
  }

  /**
   * Verifies and normalizes a Cashfree webhook.
   * rawBody must be the exact original HTTP request body.
   */
  parseWebhook(
    rawBody: Buffer,
    headers: Record<string, string | string[] | undefined>,
  ): NormalizedPaymentEvent | null {
    const signature = this.getHeader(headers, 'x-webhook-signature');
    const timestamp = this.getHeader(headers, 'x-webhook-timestamp');

    if (!this.webhookSecret) {
      throw new Error('CASHFREE_WEBHOOK_SECRET is not configured');
    }

    if (!signature || !timestamp || !Buffer.isBuffer(rawBody)) {
      throw new UnauthorizedException(
        'Missing or invalid Cashfree webhook signature headers',
      );
    }

    const expected = createHmac('sha256', this.webhookSecret)
      .update(timestamp, 'utf8')
      .update(rawBody)
      .digest();

    let received: Buffer;

    try {
      received = Buffer.from(signature, 'base64');
    } catch {
      throw new UnauthorizedException('Invalid Cashfree webhook signature');
    }

    if (
      received.length !== expected.length ||
      received.length === 0 ||
      !timingSafeEqual(received, expected)
    ) {
      throw new UnauthorizedException('Invalid Cashfree webhook signature');
    }

    let payload: Record<string, any>;

    try {
      payload = JSON.parse(rawBody.toString('utf8'));
    } catch {
      throw new BadRequestException('Invalid Cashfree webhook JSON');
    }

    const type = String(payload.type ?? '');
    const order = payload.data?.order ?? {};
    const payment = payload.data?.payment ?? {};

    const orderId = String(order.order_id ?? '');
    const paymentId = String(payment.cf_payment_id ?? '');
    const paymentStatus = String(payment.payment_status ?? '').toUpperCase();

    if (!orderId || !paymentId) {
      this.logger.warn('Ignoring Cashfree webhook without order/payment ID');
      return null;
    }

    this.paymentOrderMap.set(paymentId, orderId);

    let eventType: NormalizedPaymentEvent['type'];

    if (type === 'PAYMENT_SUCCESS_WEBHOOK' && paymentStatus === 'SUCCESS') {
      eventType = 'payment.captured';
    } else if (
      type === 'PAYMENT_FAILED_WEBHOOK' ||
      paymentStatus === 'FAILED'
    ) {
      eventType = 'payment.failed';
    } else if (type === 'PAYMENT_USER_DROPPED_WEBHOOK') {
      return null;
    } else {
      // Ignore pending, initiated, and unrecognized event types.
      return null;
    }

    const amount = Number(payment.payment_amount);

    if (!Number.isFinite(amount) || amount < 0) {
      throw new BadRequestException(
        'Invalid payment amount in Cashfree webhook',
      );
    }

    const amountMinor = Math.round(amount * 100);
    const currency = String(
      payment.payment_currency ?? order.order_currency ?? '',
    );

    if (!/^[A-Z]{3}$/i.test(currency)) {
      throw new BadRequestException('Invalid currency in Cashfree webhook');
    }

    const eventId = String(
      payload.cf_event_id ?? `${timestamp}:${paymentId}:${type}`,
    );

    return {
      eventId,
      type: eventType,
      providerOrderId: orderId,
      providerPaymentId: paymentId,
      amountMinor,
      currency: currency.toUpperCase(),
      ...(payment.payment_group
        ? { method: String(payment.payment_group) }
        : {}),
      ...(eventType === 'payment.failed' && payment.payment_message
        ? { failureReason: String(payment.payment_message) }
        : {}),
    };
  }

  /**
   * Fetches the authoritative payment status from Cashfree.
   *
   * Cashfree's payment lookup endpoint requires BOTH the order ID
   * and cf_payment_id. The order ID is obtained from the runtime
   * map populated when a webhook is parsed.
   */
  async fetchPayment(providerPaymentId: string): Promise<ProviderPayment> {
    if (!providerPaymentId?.trim()) {
      throw new BadRequestException('Payment ID is required');
    }

    const orderId = this.paymentOrderMap.get(providerPaymentId);

    if (!orderId) {
      throw new BadRequestException(
        'Cashfree order ID is unknown for this payment. Persist the order/payment mapping and retrieve it before fetching payment status.',
      );
    }

    try {
      const response = await fetch(
        `${this.baseUrl}/orders/${encodeURIComponent(orderId)}/payments/${encodeURIComponent(providerPaymentId)}`,
        {
          method: 'GET',
          headers: this.getHeaders(),
          signal: AbortSignal.timeout(15_000),
        },
      );

      if (!response.ok) {
        this.logger.error(
          `Cashfree payment lookup failed: HTTP ${response.status}`,
        );

        throw new BadGatewayException('Unable to verify payment with Cashfree');
      }

      const payment = (await response.json()) as CashfreePayment;

      const status = this.normalizePaymentStatus(payment.payment_status);

      const amount = Number(payment.payment_amount);

      if (!Number.isFinite(amount) || amount < 0) {
        throw new BadGatewayException(
          'Cashfree returned an invalid payment amount',
        );
      }

      const currency = String(payment.payment_currency ?? '');

      if (!/^[A-Z]{3}$/i.test(currency)) {
        throw new BadGatewayException(
          'Cashfree returned an invalid payment currency',
        );
      }

      return {
        providerPaymentId: String(payment.cf_payment_id),
        providerOrderId: String(payment.order_id ?? orderId),
        status,
        amountMinor: Math.round(amount * 100),
        currency: currency.toUpperCase(),
        ...(payment.payment_group
          ? { method: String(payment.payment_group) }
          : {}),
      };
    } catch (error) {
      if (
        error instanceof BadGatewayException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }

      this.logger.error('Cashfree payment lookup request failed');

      throw new BadGatewayException('Cashfree payment service is unavailable');
    }
  }

  private normalizePaymentStatus(status: string): ProviderPayment['status'] {
    switch (status.toUpperCase()) {
      case 'SUCCESS':
        return 'captured';

      case 'FAILED':
      case 'USER_DROPPED':
        return 'failed';

      case 'PENDING':
      case 'NOT_ATTEMPTED':
        return 'created';

      case 'AUTHORIZED':
        return 'authorized';

      case 'VOID':
        return 'failed';

      case 'REFUNDED':
        return 'refunded';

      default:
        return 'created';
    }
  }

  private getHeader(
    headers: Record<string, string | string[] | undefined>,
    name: string,
  ): string | undefined {
    const value = headers[name] ?? headers[name.toLowerCase()];

    return Array.isArray(value) ? value[0] : value;
  }

  private getHeaders(): Record<string, string> {
    return {
      'x-client-id': this.appId,
      'x-client-secret': this.secretKey,
      'x-api-version': this.apiVersion,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    };
  }
}
