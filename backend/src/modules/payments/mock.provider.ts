import { UnauthorizedException } from '@nestjs/common';
import { createHmac, randomBytes, timingSafeEqual } from 'crypto';
import {
  CreatePaymentInput,
  CreatePaymentResult,
  NormalizedPaymentEvent,
  PaymentProvider,
  ProviderPayment,
} from './payment-provider';

/**
 * DEV / TEST ONLY. Lets the whole purchase flow run with no gateway account.
 * PaymentsModule refuses to boot with this provider when NODE_ENV=production.
 * It signs and verifies exactly like a real gateway (HMAC), so the settlement
 * code path under test is the production one.
 */
export class MockPaymentProvider implements PaymentProvider {
  readonly name = 'mock';
  private readonly orders = new Map<
    string,
    { amountMinor: number; currency: string }
  >();
  private readonly payments = new Map<string, ProviderPayment>();

  constructor(private readonly secret: string) {}

  sign(data: string): string {
    return createHmac('sha256', this.secret).update(data).digest('hex');
  }

  async createPayment(i: CreatePaymentInput): Promise<CreatePaymentResult> {
    const providerOrderId = `mock_order_${randomBytes(8).toString('hex')}`;
    this.orders.set(providerOrderId, {
      amountMinor: i.amountMinor,
      currency: i.currency,
    });
    return {
      providerOrderId,
      clientConfig: {
        provider: 'mock',
        orderId: providerOrderId,
        amount: i.amountMinor,
        currency: i.currency,
      },
    };
  }

  /** Test helper: simulate the customer paying (or failing to pay). */
  simulate(providerOrderId: string, outcome: 'captured' | 'failed') {
    const o = this.orders.get(providerOrderId);
    if (!o) throw new Error('Unknown mock order');
    const providerPaymentId = `mock_pay_${randomBytes(8).toString('hex')}`;
    const payment: ProviderPayment = {
      providerPaymentId,
      providerOrderId,
      status: outcome,
      amountMinor: o.amountMinor,
      currency: o.currency,
      method: 'mock',
    };
    this.payments.set(providerPaymentId, payment);
    return {
      payment,
      signature: this.sign(`${providerOrderId}|${providerPaymentId}`),
    };
  }

  verifyCheckoutSignature(i: {
    providerOrderId: string;
    providerPaymentId: string;
    signature: string;
  }): boolean {
    const expected = Buffer.from(
      this.sign(`${i.providerOrderId}|${i.providerPaymentId}`),
    );
    const got = Buffer.from(i.signature ?? '');
    return expected.length === got.length && timingSafeEqual(expected, got);
  }

  parseWebhook(
    rawBody: Buffer,
    headers: Record<string, string | string[] | undefined>,
  ): NormalizedPaymentEvent | null {
    const sig = Buffer.from(String(headers['x-mock-signature'] ?? ''));
    const expected = Buffer.from(this.sign(rawBody.toString('utf8')));
    if (sig.length !== expected.length || !timingSafeEqual(sig, expected)) {
      throw new UnauthorizedException('Invalid webhook signature');
    }
    const b = JSON.parse(rawBody.toString('utf8'));
    return {
      eventId: String(b.eventId),
      type: b.type,
      providerOrderId: b.providerOrderId,
      providerPaymentId: b.providerPaymentId,
      amountMinor: Number(b.amountMinor),
      currency: b.currency ?? 'INR',
      method: 'mock',
      failureReason: b.failureReason,
    };
  }

  async fetchPayment(providerPaymentId: string): Promise<ProviderPayment> {
    const p = this.payments.get(providerPaymentId);
    if (!p) throw new Error('Unknown mock payment');
    return p;
  }
}
