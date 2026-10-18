/** Gateway-agnostic payment contract. Business code depends only on this file. */
export const PAYMENT_PROVIDER = Symbol('PAYMENT_PROVIDER');

export interface CreatePaymentInput {
  receipt: string;
  amountMinor: number;
  currency: string;
  /**
   * Gateway-specific metadata. Cashfree requires:
   * customer_id, customer_phone, return_url.
   * Optional: customer_email, customer_name, notify_url, order_note.
   */
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

  /**
   * Optional: fresh browser config for an already-created gateway order
   * (used when the customer retries payment on the same order).
   * Throws if the gateway order is expired or no longer payable.
   */
  getCheckoutConfig?(providerOrderId: string): Promise<Record<string, unknown>>;

  /**
   * Verifies a browser-side checkout signature. Gateways without one
   * (Cashfree) return false; callers must rely on fetchPayment() instead.
   */
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

  /**
   * Server-to-server confirmation of a payment's real state at the gateway.
   * providerOrderId is optional; gateways that need it (Cashfree) use it
   * instead of relying on a cache.
   */
  fetchPayment(
    providerPaymentId: string,
    providerOrderId?: string,
  ): Promise<ProviderPayment>;
}
