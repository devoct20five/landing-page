import { Logger, UnauthorizedException } from '@nestjs/common';
import { createHmac, timingSafeEqual } from 'crypto';
import {
  CreatePaymentInput,
  CreatePaymentResult,
  NormalizedPaymentEvent,
  PaymentProvider,
  ProviderPayment,
} from './payment-provider';

const API = 'https://api.razorpay.com/v1';

function safeEqualHex(a: string, b: string): boolean {
  const x = Buffer.from(a, 'utf8');
  const y = Buffer.from(b, 'utf8');
  return x.length === y.length && timingSafeEqual(x, y);
}

/** Talks to Razorpay over its REST API directly (no SDK dependency). */
export class RazorpayProvider implements PaymentProvider {
  readonly name = 'razorpay';
  private readonly log = new Logger('RazorpayProvider');

  constructor(
    private readonly keyId: string,
    private readonly keySecret: string,
    private readonly webhookSecret: string,
    private readonly merchantName = 'OCT20FIVE',
  ) {}

  private get auth() {
    return (
      'Basic ' +
      Buffer.from(`${this.keyId}:${this.keySecret}`).toString('base64')
    );
  }

  private async call<T>(path: string, init?: RequestInit): Promise<T> {
    const res = await fetch(`${API}${path}`, {
      ...init,
      headers: {
        Authorization: this.auth,
        'Content-Type': 'application/json',
        ...(init?.headers ?? {}),
      },
      signal: AbortSignal.timeout(10_000),
    });
    const text = await res.text();
    if (!res.ok) {
      this.log.error(
        `Razorpay ${path} -> ${res.status}: ${text.slice(0, 300)}`,
      );
      throw new Error(`Payment gateway error (${res.status})`);
    }
    return JSON.parse(text) as T;
  }

  async createPayment(i: CreatePaymentInput): Promise<CreatePaymentResult> {
    const order = await this.call<{ id: string }>('/orders', {
      method: 'POST',
      body: JSON.stringify({
        amount: i.amountMinor,
        currency: i.currency,
        receipt: i.receipt,
        notes: i.notes ?? {},
      }),
    });
    return {
      providerOrderId: order.id,
      clientConfig: {
        provider: 'razorpay',
        keyId: this.keyId, // public key id - safe for the browser
        orderId: order.id,
        amount: i.amountMinor,
        currency: i.currency,
        name: this.merchantName,
      },
    };
  }

  verifyCheckoutSignature(i: {
    providerOrderId: string;
    providerPaymentId: string;
    signature: string;
  }): boolean {
    const expected = createHmac('sha256', this.keySecret)
      .update(`${i.providerOrderId}|${i.providerPaymentId}`)
      .digest('hex');
    return safeEqualHex(expected, i.signature ?? '');
  }

  parseWebhook(
    rawBody: Buffer,
    headers: Record<string, string | string[] | undefined>,
  ): NormalizedPaymentEvent | null {
    const sig = String(headers['x-razorpay-signature'] ?? '');
    const expected = createHmac('sha256', this.webhookSecret)
      .update(rawBody)
      .digest('hex');
    if (!sig || !safeEqualHex(expected, sig))
      throw new UnauthorizedException('Invalid webhook signature');

    const body = JSON.parse(rawBody.toString('utf8'));
    const eventId = String(headers['x-razorpay-event-id'] ?? '');
    if (!eventId) throw new UnauthorizedException('Missing event id');

    const payment = body?.payload?.payment?.entity;
    switch (body?.event) {
      case 'payment.captured':
      case 'order.paid': {
        if (!payment) return null;
        return {
          eventId,
          type: 'payment.captured',
          providerOrderId: payment.order_id,
          providerPaymentId: payment.id,
          amountMinor: Number(payment.amount),
          currency: payment.currency,
          method: payment.method,
        };
      }
      case 'payment.failed':
        return {
          eventId,
          type: 'payment.failed',
          providerOrderId: payment?.order_id,
          providerPaymentId: payment?.id,
          amountMinor: Number(payment?.amount ?? 0),
          currency: payment?.currency ?? 'INR',
          method: payment?.method,
          failureReason: String(
            payment?.error_description ??
              payment?.error_reason ??
              'Payment failed',
          ).slice(0, 255),
        };
      case 'refund.processed': {
        const r = body?.payload?.refund?.entity;
        if (!r?.payment_id) return null;
        return {
          eventId,
          type: 'payment.refunded',
          providerPaymentId: r.payment_id,
          amountMinor: Number(r.amount ?? 0),
          currency: r.currency ?? 'INR',
        };
      }
      default:
        return null;
    }
  }

  async fetchPayment(providerPaymentId: string): Promise<ProviderPayment> {
    const p = await this.call<any>(
      `/payments/${encodeURIComponent(providerPaymentId)}`,
    );
    return {
      providerPaymentId: p.id,
      providerOrderId: p.order_id ?? null,
      status: p.status === 'refunded' ? 'refunded' : p.status,
      amountMinor: Number(p.amount),
      currency: p.currency,
      method: p.method,
    };
  }
}
