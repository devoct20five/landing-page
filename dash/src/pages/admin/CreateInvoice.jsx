import { useMemo, useState } from "react";

import {
  ArrowLeft,
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronDown,
  Download,
  Edit3,
  FileText,
  IndianRupee,
  MoreHorizontal,
  Plus,
  Save,
  Send,
  Trash2,
  X,
} from "lucide-react";

import { cn } from "@/lib/utils";

/* ============================================================
   HELPERS
============================================================ */

function formatCurrency(amount) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount || 0);
}

function createLineItem() {
  return {
    id: crypto.randomUUID(),
    description: "",
    quantity: 1,
    rate: 0,
  };
}

/* ============================================================
   STATUS CONFIG
============================================================ */

const STATUS_CONFIG = {
  draft: {
    label: "Draft",
    className: "bg-surface-muted/10 text-surface-muted",
  },

  sent: {
    label: "Sent",
    className: "bg-blue-500/10 text-blue-700",
  },

  paid: {
    label: "Paid",
    className: "bg-emerald-500/10 text-emerald-700",
  },

  pending: {
    label: "Pending",
    className: "bg-brand-orange/10 text-brand-orange",
  },

  overdue: {
    label: "Overdue",
    className: "bg-red-500/10 text-red-600",
  },
};

/* ============================================================
   EDITABLE FIELD
============================================================ */

function EditableField({
  value,
  onChange,
  editing,
  className,
  placeholder,
  type = "text",
}) {
  if (!editing) {
    return (
      <span
        className={cn(
          "block min-h-[24px]",
          className
        )}
      >
        {value || "—"}
      </span>
    );
  }

  return (
    <input
      type={type}
      value={value}
      onChange={(event) => onChange(event.target.value)}
      placeholder={placeholder}
      className={cn(
        "w-full rounded-lg border border-surface-border bg-surface-card px-3 py-2 outline-none transition focus:border-brand-orange",
        className
      )}
    />
  );
}

/* ============================================================
   INVOICE STATUS
============================================================ */

function InvoiceStatus({ status }) {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.draft;

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-[0.65rem] font-semibold",
        config.className
      )}
    >
      {config.label}
    </span>
  );
}

/* ============================================================
   PAGE
============================================================ */

export default function CreateInvoice() {
  const [editing, setEditing] = useState(true);

  const [status, setStatus] = useState("draft");

  const [invoice, setInvoice] = useState({
    invoiceNumber: "INV-2026-007",

    issueDate: "2026-08-26",

    dueDate: "2026-09-09",

    company: {
      name: "OCT20FIVE",
      email: "hello@oct20five.com",
      address: "New Delhi, India",
      gst: "GSTIN: 07XXXXX0000X1Z5",
    },

    client: {
      name: "",
      email: "",
      address: "",
      gst: "",
    },

    notes:
      "Thank you for working with OCT20FIVE. Please make the payment before the due date.",

    taxRate: 18,
  });

  const [items, setItems] = useState([
    {
      id: crypto.randomUUID(),
      description: "Creative Direction & Design",
      quantity: 1,
      rate: 85000,
    },

    {
      id: crypto.randomUUID(),
      description: "Campaign Development",
      quantity: 1,
      rate: 40000,
    },
  ]);

  /* ============================================================
     CALCULATIONS
  ============================================================ */

  const calculations = useMemo(() => {
    const subtotal = items.reduce((total, item) => {
      return (
        total +
        Number(item.quantity || 0) *
          Number(item.rate || 0)
      );
    }, 0);

    const tax =
      subtotal * (Number(invoice.taxRate || 0) / 100);

    const total = subtotal + tax;

    return {
      subtotal,
      tax,
      total,
    };
  }, [items, invoice.taxRate]);

  /* ============================================================
     INVOICE UPDATES
  ============================================================ */

  function updateInvoice(field, value) {
    setInvoice((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function updateCompany(field, value) {
    setInvoice((current) => ({
      ...current,
      company: {
        ...current.company,
        [field]: value,
      },
    }));
  }

  function updateClient(field, value) {
    setInvoice((current) => ({
      ...current,
      client: {
        ...current.client,
        [field]: value,
      },
    }));
  }

  /* ============================================================
     LINE ITEMS
  ============================================================ */

  function addItem() {
    setItems((current) => [
      ...current,
      createLineItem(),
    ]);
  }

  function updateItem(id, field, value) {
    setItems((current) =>
      current.map((item) =>
        item.id === id
          ? {
              ...item,
              [field]: value,
            }
          : item
      )
    );
  }

  function deleteItem(id) {
    setItems((current) =>
      current.filter((item) => item.id !== id)
    );
  }

  /* ============================================================
     ACTIONS
  ============================================================ */

  function handleSave() {
    console.log({
      invoice,
      items,
      calculations,
      status,
    });

    setEditing(false);
  }

  function handleDelete() {
    console.log("Delete invoice");

    // Add confirmation modal/API call here
  }

  function handleDownload() {
    console.log("Download invoice PDF");

    // Generate/download PDF here
  }

  function handleSend() {
    setStatus("sent");

    console.log("Send invoice");
  }

  /* ============================================================
     RENDER
  ============================================================ */

  return (
    <div className="mx-auto max-w-[1400px] animate-fade-up">
      {/* =====================================================
          TOP HEADER
      ===================================================== */}

      <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-start gap-4">
          <button
            type="button"
            className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-surface-border text-surface-muted transition hover:bg-surface-muted/10 hover:text-surface-fg"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>

          <div>
            <div className="mb-2 flex items-center gap-2 text-[0.65rem] font-bold uppercase tracking-[0.16em] text-brand-orange">
              <FileText className="h-3.5 w-3.5" />
              Administration
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <h1 className="font-display text-display-md font-bold tracking-[-0.02em] text-surface-fg">
                Invoice
              </h1>

              <InvoiceStatus status={status} />
            </div>

            <p className="mt-2 text-sm text-surface-muted">
              {editing
                ? "Create and edit your invoice details."
                : "Review your invoice details and payment information."}
            </p>
          </div>
        </div>

        {/* ACTIONS */}

        <div className="flex flex-wrap items-center gap-2">
          {!editing && (
            <button
              type="button"
              onClick={() => setEditing(true)}
              className="inline-flex h-10 items-center gap-2 rounded-xl border border-surface-border px-4 text-sm font-semibold text-surface-fg transition hover:bg-surface-muted/10"
            >
              <Edit3 className="h-4 w-4" />
              Edit
            </button>
          )}

          <button
            type="button"
            onClick={handleDownload}
            className="inline-flex h-10 items-center gap-2 rounded-xl border border-surface-border px-4 text-sm font-semibold text-surface-fg transition hover:bg-surface-muted/10"
          >
            <Download className="h-4 w-4" />
            Download
          </button>

          <button
            type="button"
            onClick={handleDelete}
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-red-500/20 text-red-600 transition hover:bg-red-500/10"
          >
            <Trash2 className="h-4 w-4" />
          </button>

          {editing ? (
            <button
              type="button"
              onClick={handleSave}
              className="inline-flex h-10 items-center gap-2 rounded-xl bg-brand-orange px-5 text-sm font-semibold text-white transition hover:opacity-90"
            >
              <Save className="h-4 w-4" />
              Save Invoice
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSend}
              className="inline-flex h-10 items-center gap-2 rounded-xl bg-brand-orange px-5 text-sm font-semibold text-white transition hover:opacity-90"
            >
              <Send className="h-4 w-4" />
              Send Invoice
            </button>
          )}
        </div>
      </div>

      {/* =====================================================
          INVOICE DOCUMENT
      ===================================================== */}

      <div className="overflow-hidden rounded-2xl border border-surface-border bg-surface-card shadow-sm">
        {/* ===================================================
            INVOICE TOP
        =================================================== */}

        <div className="border-b border-surface-border px-6 py-8 md:px-10 md:py-10">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
            {/* COMPANY */}

            <div className="max-w-md">
              <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-brand-orange text-sm font-bold text-white">
                O5
              </div>

              <EditableField
                editing={editing}
                value={invoice.company.name}
                onChange={(value) =>
                  updateCompany("name", value)
                }
                className="font-display text-2xl font-bold text-surface-fg"
              />

              <div className="mt-3 space-y-1 text-sm text-surface-muted">
                <EditableField
                  editing={editing}
                  value={invoice.company.email}
                  onChange={(value) =>
                    updateCompany("email", value)
                  }
                />

                <EditableField
                  editing={editing}
                  value={invoice.company.address}
                  onChange={(value) =>
                    updateCompany("address", value)
                  }
                />

                <EditableField
                  editing={editing}
                  value={invoice.company.gst}
                  onChange={(value) =>
                    updateCompany("gst", value)
                  }
                />
              </div>
            </div>

            {/* INVOICE META */}

            <div className="w-full max-w-md lg:text-right">
              <p className="font-display text-4xl font-bold tracking-[-0.03em] text-surface-fg">
                INVOICE
              </p>

              <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:text-left">
                <div>
                  <p className="text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-surface-muted">
                    Invoice Number
                  </p>

                  <div className="mt-1">
                    <EditableField
                      editing={editing}
                      value={invoice.invoiceNumber}
                      onChange={(value) =>
                        updateInvoice(
                          "invoiceNumber",
                          value
                        )
                      }
                      className="text-sm font-bold text-surface-fg"
                    />
                  </div>
                </div>

                <div>
                  <p className="text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-surface-muted">
                    Status
                  </p>

                  <div className="mt-2">
                    {editing ? (
                      <select
                        value={status}
                        onChange={(event) =>
                          setStatus(event.target.value)
                        }
                        className="brand-input h-9 w-full"
                      >
                        <option value="draft">
                          Draft
                        </option>

                        <option value="sent">
                          Sent
                        </option>

                        <option value="pending">
                          Pending
                        </option>

                        <option value="paid">
                          Paid
                        </option>

                        <option value="overdue">
                          Overdue
                        </option>
                      </select>
                    ) : (
                      <InvoiceStatus status={status} />
                    )}
                  </div>
                </div>

                <div>
                  <p className="text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-surface-muted">
                    Issue Date
                  </p>

                  <div className="mt-1">
                    {editing ? (
                      <input
                        type="date"
                        value={invoice.issueDate}
                        onChange={(event) =>
                          updateInvoice(
                            "issueDate",
                            event.target.value
                          )
                        }
                        className="brand-input h-9 w-full"
                      />
                    ) : (
                      <p className="text-sm font-semibold text-surface-fg">
                        {invoice.issueDate}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <p className="text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-surface-muted">
                    Due Date
                  </p>

                  <div className="mt-1">
                    {editing ? (
                      <input
                        type="date"
                        value={invoice.dueDate}
                        onChange={(event) =>
                          updateInvoice(
                            "dueDate",
                            event.target.value
                          )
                        }
                        className="brand-input h-9 w-full"
                      />
                    ) : (
                      <p className="text-sm font-semibold text-surface-fg">
                        {invoice.dueDate}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ===================================================
            BILL TO
        =================================================== */}

        <div className="border-b border-surface-border px-6 py-8 md:px-10">
          <div className="max-w-md">
            <p className="text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-brand-orange">
              Bill To
            </p>

            <div className="mt-4">
              <EditableField
                editing={editing}
                value={invoice.client.name}
                onChange={(value) =>
                  updateClient("name", value)
                }
                placeholder="Client or company name"
                className="font-display text-xl font-bold text-surface-fg"
              />
            </div>

            <div className="mt-3 space-y-2 text-sm text-surface-muted">
              <EditableField
                editing={editing}
                value={invoice.client.email}
                onChange={(value) =>
                  updateClient("email", value)
                }
                placeholder="Client email"
              />

              <EditableField
                editing={editing}
                value={invoice.client.address}
                onChange={(value) =>
                  updateClient("address", value)
                }
                placeholder="Client address"
              />

              <EditableField
                editing={editing}
                value={invoice.client.gst}
                onChange={(value) =>
                  updateClient("gst", value)
                }
                placeholder="GSTIN"
              />
            </div>
          </div>
        </div>

        {/* ===================================================
            LINE ITEMS
        =================================================== */}

        <div className="px-6 py-8 md:px-10">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h2 className="font-display text-lg font-bold text-surface-fg">
                Invoice Items
              </h2>

              <p className="mt-1 text-sm text-surface-muted">
                Services and deliverables included in this invoice.
              </p>
            </div>

            {editing && (
              <button
                type="button"
                onClick={addItem}
                className="inline-flex h-9 items-center gap-2 rounded-lg border border-surface-border px-3 text-xs font-semibold text-surface-fg transition hover:bg-surface-muted/10"
              >
                <Plus className="h-3.5 w-3.5" />
                Add Item
              </button>
            )}
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px]">
              <thead>
                <tr className="border-b border-surface-border text-left text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-surface-muted">
                  <th className="pb-4 pr-4">
                    Description
                  </th>

                  <th className="w-[120px] pb-4 pr-4">
                    Qty
                  </th>

                  <th className="w-[160px] pb-4 pr-4">
                    Rate
                  </th>

                  <th className="w-[160px] pb-4 text-right">
                    Amount
                  </th>

                  {editing && (
                    <th className="w-[60px] pb-4" />
                  )}
                </tr>
              </thead>

              <tbody>
                {items.map((item) => {
                  const amount =
                    Number(item.quantity || 0) *
                    Number(item.rate || 0);

                  return (
                    <tr
                      key={item.id}
                      className="border-b border-surface-border last:border-b-0"
                    >
                      {/* DESCRIPTION */}

                      <td className="py-4 pr-4">
                        {editing ? (
                          <input
                            value={item.description}
                            onChange={(event) =>
                              updateItem(
                                item.id,
                                "description",
                                event.target.value
                              )
                            }
                            placeholder="Service or deliverable"
                            className="brand-input w-full"
                          />
                        ) : (
                          <p className="text-sm font-medium text-surface-fg">
                            {item.description || "—"}
                          </p>
                        )}
                      </td>

                      {/* QUANTITY */}

                      <td className="py-4 pr-4">
                        {editing ? (
                          <input
                            type="number"
                            min="1"
                            value={item.quantity}
                            onChange={(event) =>
                              updateItem(
                                item.id,
                                "quantity",
                                event.target.value
                              )
                            }
                            className="brand-input w-full"
                          />
                        ) : (
                          <span className="text-sm text-surface-muted">
                            {item.quantity}
                          </span>
                        )}
                      </td>

                      {/* RATE */}

                      <td className="py-4 pr-4">
                        {editing ? (
                          <input
                            type="number"
                            min="0"
                            value={item.rate}
                            onChange={(event) =>
                              updateItem(
                                item.id,
                                "rate",
                                event.target.value
                              )
                            }
                            className="brand-input w-full"
                          />
                        ) : (
                          <span className="text-sm text-surface-muted">
                            {formatCurrency(item.rate)}
                          </span>
                        )}
                      </td>

                      {/* AMOUNT */}

                      <td className="py-4 text-right">
                        <span className="text-sm font-bold text-surface-fg">
                          {formatCurrency(amount)}
                        </span>
                      </td>

                      {/* DELETE */}

                      {editing && (
                        <td className="py-4 pl-3 text-right">
                          <button
                            type="button"
                            onClick={() =>
                              deleteItem(item.id)
                            }
                            className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-surface-muted transition hover:bg-red-500/10 hover:text-red-600"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </td>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* =================================================
              TOTALS
          ================================================= */}

          <div className="ml-auto mt-8 max-w-md">
            <div className="space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-surface-muted">
                  Subtotal
                </span>

                <span className="font-semibold text-surface-fg">
                  {formatCurrency(
                    calculations.subtotal
                  )}
                </span>
              </div>

              <div className="flex items-center justify-between gap-5 text-sm">
                <span className="text-surface-muted">
                  Tax
                </span>

                <div className="flex items-center gap-3">
                  {editing ? (
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={invoice.taxRate}
                        onChange={(event) =>
                          updateInvoice(
                            "taxRate",
                            event.target.value
                          )
                        }
                        className="brand-input h-8 w-20 text-right"
                      />

                      <span className="text-xs text-surface-muted">
                        %
                      </span>
                    </div>
                  ) : (
                    <span className="text-surface-muted">
                      {invoice.taxRate}%
                    </span>
                  )}

                  <span className="w-[120px] text-right font-semibold text-surface-fg">
                    {formatCurrency(
                      calculations.tax
                    )}
                  </span>
                </div>
              </div>

              <div className="border-t border-surface-border pt-5">
                <div className="flex items-center justify-between">
                  <span className="font-display text-lg font-bold text-surface-fg">
                    Total
                  </span>

                  <span className="font-display text-2xl font-bold text-brand-orange">
                    {formatCurrency(
                      calculations.total
                    )}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ===================================================
            NOTES
        =================================================== */}

        <div className="border-t border-surface-border px-6 py-8 md:px-10">
          <p className="text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-surface-muted">
            Notes & Payment Terms
          </p>

          <div className="mt-3 max-w-3xl">
            {editing ? (
              <textarea
                value={invoice.notes}
                onChange={(event) =>
                  updateInvoice(
                    "notes",
                    event.target.value
                  )
                }
                rows={4}
                className="brand-input w-full resize-none"
              />
            ) : (
              <p className="whitespace-pre-line text-sm leading-6 text-surface-muted">
                {invoice.notes}
              </p>
            )}
          </div>
        </div>

        {/* ===================================================
            INVOICE FOOTER
        =================================================== */}

        <div className="border-t border-surface-border bg-surface-muted/[0.03] px-6 py-5 md:px-10">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2 text-xs text-surface-muted">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />

              Invoice managed securely through OCT20FIVE.
            </div>

            <div className="text-xs text-surface-muted">
              {invoice.invoiceNumber}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}