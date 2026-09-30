/**
 * Invoice + payment-transaction adapter.
 *
 * The invoice and payment-transaction models are entirely snake_case
 * (invoice_number, client_id, amount_paid, due_date, paid_at, ...) — the
 * second such model after notifications. Normalised here so nothing else in
 * the app writes `invoice.amount_paid ?? invoice.amountPaid`.
 */

export function adaptTransaction(raw) {
  if (!raw) return null;
  return {
    id: raw.id,
    invoiceId: raw.invoice_id ?? raw.invoiceId ?? null,
    amount: Number(raw.amount ?? 0),
    method: raw.method ?? "—",
    reference: raw.reference ?? null,
    status: raw.status,
    paidAt: raw.paid_at ?? raw.paidAt ?? null,
    createdAt: raw.created_at ?? raw.createdAt ?? null,
  };
}

export function adaptInvoice(raw) {
  if (!raw) return null;

  const total = Number(raw.amount ?? 0);
  const paid = Number(raw.amount_paid ?? raw.amountPaid ?? 0);

  return {
    id: raw.id,
    number: raw.invoice_number ?? raw.invoiceNumber ?? `#${raw.id}`,
    clientId: raw.client_id ?? raw.clientId ?? raw.client?.id ?? null,
    projectId: raw.project_id ?? raw.projectId ?? raw.project?.id ?? null,

    total,
    paid,
    outstanding: Math.max(0, total - paid),
    currency: raw.currency ?? "INR",

    status: raw.status,
    description: raw.description ?? null,

    issueDate: raw.issue_date ?? raw.issueDate ?? null,
    dueDate: raw.due_date ?? raw.dueDate ?? null,

    createdAt: raw.created_at ?? raw.createdAt ?? null,

    transactions: (raw.transactions ?? []).map(adaptTransaction),

    raw,
  };
}

/** Rolls a project's invoices into the summary the billing panel shows. */
export function summarizeInvoices(invoices) {
  const total = invoices.reduce((sum, invoice) => sum + invoice.total, 0);
  const paid = invoices.reduce((sum, invoice) => sum + invoice.paid, 0);

  const transactions = invoices
    .flatMap((invoice) => invoice.transactions.map((tx) => ({ ...tx, invoiceNumber: invoice.number })))
    .sort((a, b) => new Date(b.paidAt ?? b.createdAt) - new Date(a.paidAt ?? a.createdAt));

  return {
    total,
    paid,
    outstanding: Math.max(0, total - paid),
    invoices,
    transactions,
  };
}

export function formatCurrency(value, currency = "INR") {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(value ?? 0);
}
