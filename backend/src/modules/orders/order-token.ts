import { createHmac, timingSafeEqual } from 'crypto';

/**
 * Capability token that lets the browser which created an order read it, pay
 * it and verify it without an account. HMAC of the order number: unguessable,
 * needs no storage, re-derivable for idempotent retries and retry-payment emails.
 */
export function orderAccessToken(secret: string, orderNumber: string): string {
  return createHmac('sha256', secret).update(`order-access:${orderNumber}`).digest('base64url');
}

export function isValidOrderToken(secret: string, orderNumber: string, token: string | undefined): boolean {
  if (!token) return false;
  const a = Buffer.from(orderAccessToken(secret, orderNumber));
  const b = Buffer.from(token);
  return a.length === b.length && timingSafeEqual(a, b);
}
