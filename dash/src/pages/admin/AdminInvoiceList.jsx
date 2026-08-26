import { useMemo, useState } from "react";
import {
  ReceiptText,
  IndianRupee,
  Clock3,
  CheckCircle2,
  AlertCircle,
  Search,
  MoreHorizontal,
  Eye,
  Download,
  Plus,
  FileText,
  CalendarDays,
} from "lucide-react";

import EmptyState from "@/components/shared/EmptyState";
import { cn } from "@/lib/utils";

/* ============================================================
   MOCK INVOICE DATA
   Replace this with API data later.
============================================================ */

const invoiceData = [
  {
    id: "1",
    invoiceNumber: "INV-2026-001",
    client: "Nike India",
    clientInitials: "NI",
    project: "Summer Campaign 2026",
    issueDate: "12 Aug 2026",
    dueDate: "26 Aug 2026",
    amount: 125000,
    status: "paid",
  },
  {
    id: "2",
    invoiceNumber: "INV-2026-002",
    client: "Adidas",
    clientInitials: "AD",
    project: "Streetwear Collection",
    issueDate: "15 Aug 2026",
    dueDate: "29 Aug 2026",
    amount: 85000,
    status: "pending",
  },
  {
    id: "3",
    invoiceNumber: "INV-2026-003",
    client: "Puma",
    clientInitials: "PU",
    project: "Creative Direction",
    issueDate: "01 Aug 2026",
    dueDate: "15 Aug 2026",
    amount: 210000,
    status: "overdue",
  },
  {
    id: "4",
    invoiceNumber: "INV-2026-004",
    client: "Netflix India",
    clientInitials: "NF",
    project: "Launch Campaign",
    issueDate: "18 Aug 2026",
    dueDate: "01 Sep 2026",
    amount: 175000,
    status: "sent",
  },
  {
    id: "5",
    invoiceNumber: "INV-2026-005",
    client: "Spotify",
    clientInitials: "SP",
    project: "Brand Collaboration",
    issueDate: "20 Aug 2026",
    dueDate: "03 Sep 2026",
    amount: 95000,
    status: "draft",
  },
  {
    id: "6",
    invoiceNumber: "INV-2026-006",
    client: "Zomato",
    clientInitials: "ZO",
    project: "Digital Experience",
    issueDate: "05 Aug 2026",
    dueDate: "19 Aug 2026",
    amount: 140000,
    status: "paid",
  },
];

/* ============================================================
   STATUS CONFIG
============================================================ */

const STATUS_CONFIG = {
  paid: {
    label: "Paid",
    className: "bg-emerald-500/10 text-emerald-700",
    dot: "bg-emerald-500",
  },

  pending: {
    label: "Pending",
    className: "bg-brand-orange/10 text-brand-orange",
    dot: "bg-brand-orange",
  },

  overdue: {
    label: "Overdue",
    className: "bg-red-500/10 text-red-600",
    dot: "bg-red-500",
  },

  sent: {
    label: "Sent",
    className: "bg-blue-500/10 text-blue-700",
    dot: "bg-blue-500",
  },

  draft: {
    label: "Draft",
    className: "bg-surface-muted/10 text-surface-muted",
    dot: "bg-surface-muted",
  },
};

/* ============================================================
   HELPERS
============================================================ */

function formatCurrency(amount) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

/* ============================================================
   STATUS BADGE
============================================================ */

function InvoiceStatus({ status }) {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.draft;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[0.65rem] font-semibold",
        config.className
      )}
    >
      <span
        className={cn(
          "h-1.5 w-1.5 rounded-full",
          config.dot
        )}
      />

      {config.label}
    </span>
  );
}

/* ============================================================
   STAT CARD
============================================================ */

function StatCard({
  icon: Icon,
  label,
  value,
  description,
  warning = false,
}) {
  return (
    <div className="brand-card">
      <div
        className={cn(
          "flex h-9 w-9 items-center justify-center rounded-lg",
          warning
            ? "bg-red-500/10 text-red-600"
            : "bg-brand-orange/10 text-brand-orange"
        )}
      >
        <Icon className="h-4 w-4" />
      </div>

      <p className="mt-5 text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-surface-muted">
        {label}
      </p>

      <p
        className={cn(
          "mt-1 font-display text-2xl font-bold tracking-[-0.02em]",
          warning ? "text-red-600" : "text-surface-fg"
        )}
      >
        {value}
      </p>

      <p className="mt-1 text-xs text-surface-muted">
        {description}
      </p>
    </div>
  );
}

/* ============================================================
   INVOICE ROW
============================================================ */

function InvoiceRow({ invoice }) {
  return (
    <tr className="border-b border-surface-border last:border-b-0">
      {/* Invoice */}
      <td className="px-6 py-5">
        <div>
          <p className="font-display text-sm font-bold text-surface-fg">
            {invoice.invoiceNumber}
          </p>

          <p className="mt-0.5 text-xs text-surface-muted">
            {invoice.project}
          </p>
        </div>
      </td>

      {/* Client */}
      <td className="py-5 pr-5">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-orange/10 text-[0.65rem] font-bold text-brand-orange">
            {invoice.clientInitials}
          </div>

          <span className="text-sm font-medium text-surface-fg">
            {invoice.client}
          </span>
        </div>
      </td>

      {/* Issue Date */}
      <td className="py-5 pr-5">
        <div className="flex items-center gap-2">
          <CalendarDays className="h-3.5 w-3.5 text-surface-muted" />

          <span className="text-sm text-surface-muted">
            {invoice.issueDate}
          </span>
        </div>
      </td>

      {/* Due Date */}
      <td className="py-5 pr-5">
        <span
          className={cn(
            "text-sm",
            invoice.status === "overdue"
              ? "font-semibold text-red-600"
              : "text-surface-muted"
          )}
        >
          {invoice.dueDate}
        </span>
      </td>

      {/* Amount */}
      <td className="py-5 pr-5">
        <span className="text-sm font-bold text-surface-fg">
          {formatCurrency(invoice.amount)}
        </span>
      </td>

      {/* Status */}
      <td className="py-5 pr-5">
        <InvoiceStatus status={invoice.status} />
      </td>

      {/* Actions */}
      <td className="py-5 pr-6 text-right">
        <div className="flex items-center justify-end gap-1">
          <button
            type="button"
            title="View invoice"
            className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-surface-muted transition hover:bg-surface-muted/10 hover:text-surface-fg"
          >
            <Eye className="h-4 w-4" />
          </button>

          <button
            type="button"
            title="Download invoice"
            className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-surface-muted transition hover:bg-surface-muted/10 hover:text-surface-fg"
          >
            <Download className="h-4 w-4" />
          </button>

          <button
            type="button"
            title="More options"
            className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-surface-muted transition hover:bg-surface-muted/10 hover:text-surface-fg"
          >
            <MoreHorizontal className="h-4 w-4" />
          </button>
        </div>
      </td>
    </tr>
  );
}

/* ============================================================
   PAGE
============================================================ */

export default function AdminInvoiceList() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  const filteredInvoices = useMemo(() => {
    const query = search.toLowerCase().trim();

    return invoiceData.filter((invoice) => {
      const matchesSearch =
        invoice.invoiceNumber.toLowerCase().includes(query) ||
        invoice.client.toLowerCase().includes(query) ||
        invoice.project.toLowerCase().includes(query);

      const matchesFilter =
        filter === "all" ||
        invoice.status === filter;

      return matchesSearch && matchesFilter;
    });
  }, [search, filter]);

  const stats = useMemo(() => {
    const paid = invoiceData
      .filter((invoice) => invoice.status === "paid")
      .reduce((total, invoice) => total + invoice.amount, 0);

    const pending = invoiceData
      .filter(
        (invoice) =>
          invoice.status === "pending" ||
          invoice.status === "sent"
      )
      .reduce((total, invoice) => total + invoice.amount, 0);

    const overdue = invoiceData
      .filter((invoice) => invoice.status === "overdue")
      .reduce((total, invoice) => total + invoice.amount, 0);

    return {
      total: invoiceData.length,
      paid,
      pending,
      overdue,
    };
  }, []);

  return (
    <div className="mx-auto max-w-[1400px] animate-fade-up">
      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <div className="mb-2 flex items-center gap-2 text-[0.65rem] font-bold uppercase tracking-[0.16em] text-brand-orange">
            <ReceiptText className="h-3.5 w-3.5" />
            Administration
          </div>

          <h1 className="font-display text-display-md font-bold tracking-[-0.02em] text-surface-fg">
            Invoices
          </h1>

          <p className="mt-2 max-w-2xl text-lead text-surface-muted">
            Manage invoices, track payments, and monitor outstanding
            client balances across OCT20FIVE.
          </p>
        </div>

        <button
          type="button"
          className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-brand-orange px-5 text-sm font-semibold text-white transition hover:opacity-90"
        >
          <Plus className="h-4 w-4" />
          Create Invoice
        </button>
      </div>

      {/* =====================================================
          STATS
      ===================================================== */}

      <div className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          icon={FileText}
          label="Total Invoices"
          value={stats.total}
          description="All invoice records"
        />

        <StatCard
          icon={CheckCircle2}
          label="Paid"
          value={formatCurrency(stats.paid)}
          description="Successfully collected"
        />

        <StatCard
          icon={Clock3}
          label="Outstanding"
          value={formatCurrency(stats.pending)}
          description="Awaiting payment"
        />

        <StatCard
          icon={AlertCircle}
          label="Overdue"
          value={formatCurrency(stats.overdue)}
          description="Requires attention"
          warning={stats.overdue > 0}
        />
      </div>

      {/* =====================================================
          INVOICE SUMMARY
      ===================================================== */}

      <section className="brand-card mb-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-brand-orange">
              Invoice Overview
            </p>

            <h2 className="mt-1 font-display text-xl font-bold text-surface-fg">
              Payment collection status
            </h2>
          </div>

          <div className="flex items-center gap-2 text-xs text-surface-muted">
            <ReceiptText className="h-4 w-4" />
            {stats.total} invoices generated
          </div>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <div className="rounded-xl border border-surface-border p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.1em] text-surface-muted">
              Collected
            </p>

            <div className="mt-2 flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />

              <p className="font-display text-lg font-bold text-surface-fg">
                {formatCurrency(stats.paid)}
              </p>
            </div>
          </div>

          <div className="rounded-xl border border-surface-border p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.1em] text-surface-muted">
              Awaiting Payment
            </p>

            <div className="mt-2 flex items-center gap-2">
              <Clock3 className="h-4 w-4 text-brand-orange" />

              <p className="font-display text-lg font-bold text-surface-fg">
                {formatCurrency(stats.pending)}
              </p>
            </div>
          </div>

          <div className="rounded-xl border border-surface-border p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.1em] text-surface-muted">
              Overdue
            </p>

            <div className="mt-2 flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-red-600" />

              <p className="font-display text-lg font-bold text-red-600">
                {formatCurrency(stats.overdue)}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          INVOICE LIST
      ===================================================== */}

      <section>
        <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h2 className="font-display text-lg font-bold text-surface-fg">
              All Invoices
            </h2>

            <p className="mt-1 text-sm text-surface-muted">
              View and manage invoices issued to your clients.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            {/* Search */}

            <div className="relative w-full sm:w-[280px]">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-surface-muted" />

              <input
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
                placeholder="Search invoices..."
                className="brand-input w-full pl-9"
              />
            </div>

            {/* Filter */}

            <select
              value={filter}
              onChange={(event) =>
                setFilter(event.target.value)
              }
              className="brand-input min-w-[150px]"
            >
              <option value="all">All Status</option>
              <option value="paid">Paid</option>
              <option value="pending">Pending</option>
              <option value="sent">Sent</option>
              <option value="overdue">Overdue</option>
              <option value="draft">Draft</option>
            </select>
          </div>
        </div>

        {filteredInvoices.length === 0 ? (
          <EmptyState
            title="No Invoices Found"
            description="Try changing your search or invoice status filter."
          />
        ) : (
          <div className="brand-card overflow-x-auto p-0">
            <table className="w-full min-w-[1100px] border-collapse">
              <thead>
                <tr className="border-b border-surface-border text-left text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-surface-muted">
                  <th className="px-6 py-4">
                    Invoice
                  </th>

                  <th className="py-4 pr-5">
                    Client
                  </th>

                  <th className="py-4 pr-5">
                    Issue Date
                  </th>

                  <th className="py-4 pr-5">
                    Due Date
                  </th>

                  <th className="py-4 pr-5">
                    Amount
                  </th>

                  <th className="py-4 pr-5">
                    Status
                  </th>

                  <th className="py-4 pr-6" />
                </tr>
              </thead>

              <tbody>
                {filteredInvoices.map((invoice) => (
                  <InvoiceRow
                    key={invoice.id}
                    invoice={invoice}
                  />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* =====================================================
          FOOTNOTE
      ===================================================== */}

      <div className="mt-6 flex items-center gap-2 text-xs text-surface-muted">
        <IndianRupee className="h-3.5 w-3.5 text-brand-orange" />

        Invoice totals are based on the currently available records.
      </div>
    </div>
  );
}