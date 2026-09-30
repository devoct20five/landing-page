import { http } from "./http";

/**
 * Payments are always scoped to an invoice — there is no top-level
 * /payments collection on the backend. An "all payments" admin view has to be
 * assembled from invoices, or a backend endpoint has to be added first.
 */

export const listInvoicePayments = (invoiceId) =>
  http.get(`/invoices/${invoiceId}/payments`);

/**
 * Records a transaction against an invoice.
 * @param {{amount: number, method: string, reference?: string,
 *          status?: string, paidAt?: string}} payload
 *
 * Never mark an invoice paid in the UI off the back of this call alone —
 * refetch the invoice and use its returned status.
 */
export const recordPayment = (invoiceId, payload) =>
  http.post(`/invoices/${invoiceId}/payments`, payload);
