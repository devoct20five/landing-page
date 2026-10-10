/** Gateway-agnostic payment contract. Business code depends only on this file. */
export const PAYMENT_PROVIDER = Symbol('PAYMENT_PROVIDER');

export interface CreatePaymentInput {
  receipt: string;
  amountMinor: number;
  currency: string;
  notes?: Record<string, string>;
}

export interface CreatePaymentResult {
  providerOrderId: string;
  /** Opaque, non-secret data the browser SDK needs to open the payment UI. */
  clientConfig: Record<string, unknown>;
}

export interface ProviderPayment {
  providerPaymentId: string;
  providerOrderId: string | null;
  status: 'captured' | 'authorized' | 'failed' | 'created' | 'refunded';
  amountMinor: number;
  currency: string;
  method?: string;
}

export type PaymentEventType =
  'payment.captured' | 'payment.failed' | 'payment.refunded';

/** A webhook, after signature verification, in gateway-neutral form. */
export interface NormalizedPaymentEvent {
  eventId: string;
  type: PaymentEventType;
  providerOrderId?: string;
  providerPaymentId: string;
  amountMinor: number;
  currency: string;
  method?: string;
  failureReason?: string;
}

export interface PaymentProvider {
  readonly name: string;
  createPayment(input: CreatePaymentInput): Promise<CreatePaymentResult>;
  verifyCheckoutSignature(i: {
    providerOrderId: string;
    providerPaymentId: string;
    signature: string;
  }): boolean;
  /** Verifies the signature over the RAW body; null for events we ignore; throws if invalid. */
  parseWebhook(
    rawBody: Buffer,
    headers: Record<string, string | string[] | undefined>,
  ): NormalizedPaymentEvent | null;
  /** Server-to-server confirmation of a payment's real state at the gateway. */
  fetchPayment(providerPaymentId: string): Promise<ProviderPayment>;
}
