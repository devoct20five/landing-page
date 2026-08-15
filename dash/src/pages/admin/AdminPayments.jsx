import { useMemo, useState } from "react";
import {
  CreditCard,
  Search,
  Filter,
  Download,
  Plus,
  MoreHorizontal,
  CheckCircle2,
  Clock3,
  AlertCircle,
  IndianRupee,
  FolderKanban,
  Building2,
  Receipt,
  CalendarDays,
  ChevronDown,
  X,
  ArrowUpRight,
  WalletCards,
} from "lucide-react";

import {
  projects,
  clients,
} from "@/data/mockData";

import EmptyState from "@/components/shared/EmptyState";
import { cn } from "@/lib/utils";

/* ============================================================
   MOCK PAYMENTS
   ============================================================ */

const payments = [
  {
    id: "payment-001",
    invoiceId: "INV-2026-001",
    clientId: "client-1",
    projectId: "project-1",
    amount: 85000,
    currency: "INR",
    status: "paid",
    method: "Bank Transfer",
    date: "15 Aug 2026",
    dueDate: "15 Aug 2026",
    reference: "TXN-849201",
    description: "Project milestone payment",
  },
  {
    id: "payment-002",
    invoiceId: "INV-2026-002",
    clientId: "client-2",
    projectId: "project-2",
    amount: 125000,
    currency: "INR",
    status: "paid",
    method: "UPI",
    date: "12 Aug 2026",
    dueDate: "12 Aug 2026",
    reference: "UPI-982341",
    description: "Production milestone",
  },
  {
    id: "payment-003",
    invoiceId: "INV-2026-003",
    clientId: "client-1",
    projectId: "project-3",
    amount: 45000,
    currency: "INR",
    status: "pending",
    method: "Bank Transfer",
    date: null,
    dueDate: "20 Aug 2026",
    reference: null,
    description: "Design milestone",
  },
  {
    id: "payment-004",
    invoiceId: "INV-2026-004",
    clientId: "client-3",
    projectId: "project-4",
    amount: 175000,
    currency: "INR",
    status: "paid",
    method: "Bank Transfer",
    date: "08 Aug 2026",
    dueDate: "08 Aug 2026",
    reference: "TXN-738291",
    description: "Development milestone",
  },
  {
    id: "payment-005",
    invoiceId: "INV-2026-005",
    clientId: "client-2",
    projectId: "project-5",
    amount: 65000,
    currency: "INR",
    status: "overdue",
    method: "UPI",
    date: null,
    dueDate: "05 Aug 2026",
    reference: null,
    description: "Editing milestone",
  },
  {
    id: "payment-006",
    invoiceId: "INV-2026-006",
    clientId: "client-4",
    projectId: "project-6",
    amount: 95000,
    currency: "INR",
    status: "paid",
    method: "Card",
    date: "02 Aug 2026",
    dueDate: "02 Aug 2026",
    reference: "CARD-298341",
    description: "3D production payment",
  },
];

/* ============================================================
   STATUS CONFIG
============================================================ */

const STATUS_CONFIG = {
  paid: {
    label: "Paid",
    icon: CheckCircle2,
    className: "bg-emerald-500/10 text-emerald-700",
    dot: "bg-emerald-500",
  },

  pending: {
    label: "Pending",
    icon: Clock3,
    className: "bg-brand-orange/10 text-brand-orange",
    dot: "bg-brand-orange",
  },

  overdue: {
    label: "Overdue",
    icon: AlertCircle,
    className: "bg-red-500/10 text-red-600",
    dot: "bg-red-500",
  },

  refunded: {
    label: "Refunded",
    icon: AlertCircle,
    className: "bg-purple-500/10 text-purple-700",
    dot: "bg-purple-500",
  },
};

/* ============================================================
   HELPERS
============================================================ */

function getClient(clientId) {
  return clients?.find(
    (client) => client.id === clientId
  );
}

function getProject(projectId) {
  return projects?.find(
    (project) => project.id === projectId
  );
}

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

function PaymentStatus({ status }) {
  const config =
    STATUS_CONFIG[status] ||
    STATUS_CONFIG.pending;

  const Icon = config.icon;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[0.65rem] font-semibold",
        config.className
      )}
    >
      <Icon className="h-3 w-3" />

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
}) {
  return (
    <div className="brand-card">
      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-orange/10 text-brand-orange">
        <Icon className="h-4 w-4" />
      </div>

      <p className="mt-5 text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-surface-muted">
        {label}
      </p>

      <p className="mt-1 font-display text-2xl font-bold tracking-[-0.02em] text-surface-fg">
        {value}
      </p>

      <p className="mt-1 text-xs text-surface-muted">
        {description}
      </p>
    </div>
  );
}

/* ============================================================
   PAYMENT ROW
============================================================ */

function PaymentRow({ payment }) {
  const client = getClient(payment.clientId);
  const project = getProject(payment.projectId);

  return (
    <tr className="border-b border-surface-border last:border-b-0 transition hover:bg-surface-bg/50">
      {/* Invoice */}
      <td className="px-6 py-5">
        <div>
          <p className="text-sm font-bold text-surface-fg">
            {payment.invoiceId}
          </p>

          <p className="mt-1 text-xs text-surface-muted">
            {payment.description}
          </p>
        </div>
      </td>

      {/* Client */}
      <td className="py-5 pr-5">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-orange/10 text-xs font-bold text-brand-orange">
            {client?.shortName ||
              client?.name
                ?.slice(0, 2)
                .toUpperCase() ||
              "CL"}
          </div>

          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-surface-fg">
              {client?.name || "Unknown Client"}
            </p>
          </div>
        </div>
      </td>

      {/* Project */}
      <td className="py-5 pr-5">
        <div className="flex items-center gap-2">
          <FolderKanban className="h-4 w-4 shrink-0 text-surface-muted" />

          <span className="max-w-[180px] truncate text-sm text-surface-muted">
            {project?.name || "Unknown Project"}
          </span>
        </div>
      </td>

      {/* Amount */}
      <td className="py-5 pr-5">
        <p className="text-sm font-bold text-surface-fg">
          {formatCurrency(payment.amount)}
        </p>
      </td>

      {/* Method */}
      <td className="py-5 pr-5">
        <span className="text-xs font-medium text-surface-muted">
          {payment.method}
        </span>
      </td>

      {/* Status */}
      <td className="py-5 pr-5">
        <PaymentStatus status={payment.status} />
      </td>

      {/* Date */}
      <td className="py-5 pr-5">
        <div className="flex items-center gap-2">
          <CalendarDays className="h-3.5 w-3.5 text-surface-muted" />

          <span className="text-xs text-surface-muted">
            {payment.date || `Due ${payment.dueDate}`}
          </span>
        </div>
      </td>

      {/* Actions */}
      <td className="py-5 pr-6 text-right">
        <button
          type="button"
          className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-surface-muted transition hover:bg-surface-muted/10 hover:text-surface-fg"
        >
          <MoreHorizontal className="h-4 w-4" />
        </button>
      </td>
    </tr>
  );
}

/* ============================================================
   FILTER BAR
============================================================ */

function FilterBar({
  search,
  setSearch,
  status,
  setStatus,
  clientId,
  setClientId,
  method,
  setMethod,
}) {
  const [showFilters, setShowFilters] =
    useState(false);

  const hasFilters =
    status !== "all" ||
    clientId !== "all" ||
    method !== "all";

  function clearFilters() {
    setStatus("all");
    setClientId("all");
    setMethod("all");
    setSearch("");
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="relative w-full lg:max-w-md">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-surface-muted" />

          <input
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
            placeholder="Search payments, clients, invoices..."
            className="brand-input w-full pl-9"
          />
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() =>
              setShowFilters((value) => !value)
            }
            className={cn(
              "inline-flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-semibold transition",
              showFilters || hasFilters
                ? "border-brand-orange bg-brand-orange/5 text-brand-orange"
                : "border-surface-border text-surface-fg hover:border-brand-orange hover:text-brand-orange"
            )}
          >
            <Filter className="h-4 w-4" />

            Filters

            {hasFilters && (
              <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-brand-orange px-1 text-[0.65rem] text-white">
                {(status !== "all" ? 1 : 0) +
                  (clientId !== "all" ? 1 : 0) +
                  (method !== "all" ? 1 : 0)}
              </span>
            )}
          </button>

          {hasFilters && (
            <button
              type="button"
              onClick={clearFilters}
              className="inline-flex items-center gap-1.5 px-2 text-xs font-semibold text-surface-muted hover:text-surface-fg"
            >
              <X className="h-3.5 w-3.5" />
              Clear
            </button>
          )}
        </div>
      </div>

      {showFilters && (
        <div className="brand-card grid gap-5 sm:grid-cols-3">
          {/* Status */}
          <div>
            <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.1em] text-surface-muted">
              Status
            </label>

            <div className="relative">
              <select
                value={status}
                onChange={(event) =>
                  setStatus(event.target.value)
                }
                className="brand-input w-full appearance-none pr-9"
              >
                <option value="all">
                  All statuses
                </option>

                <option value="paid">
                  Paid
                </option>

                <option value="pending">
                  Pending
                </option>

                <option value="overdue">
                  Overdue
                </option>

                <option value="refunded">
                  Refunded
                </option>
              </select>

              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-surface-muted" />
            </div>
          </div>

          {/* Client */}
          <div>
            <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.1em] text-surface-muted">
              Client
            </label>

            <div className="relative">
              <select
                value={clientId}
                onChange={(event) =>
                  setClientId(event.target.value)
                }
                className="brand-input w-full appearance-none pr-9"
              >
                <option value="all">
                  All clients
                </option>

                {clients?.map((client) => (
                  <option
                    key={client.id}
                    value={client.id}
                  >
                    {client.name}
                  </option>
                ))}
              </select>

              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-surface-muted" />
            </div>
          </div>

          {/* Method */}
          <div>
            <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.1em] text-surface-muted">
              Payment Method
            </label>

            <div className="relative">
              <select
                value={method}
                onChange={(event) =>
                  setMethod(event.target.value)
                }
                className="brand-input w-full appearance-none pr-9"
              >
                <option value="all">
                  All methods
                </option>

                <option value="Bank Transfer">
                  Bank Transfer
                </option>

                <option value="UPI">
                  UPI
                </option>

                <option value="Card">
                  Card
                </option>

                <option value="Cash">
                  Cash
                </option>
              </select>

              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-surface-muted" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ============================================================
   PAGE
============================================================ */

export default function AdminPayments() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [clientId, setClientId] = useState("all");
  const [method, setMethod] = useState("all");

  const filteredPayments = useMemo(() => {
    const query = search
      .trim()
      .toLowerCase();

    return payments.filter((payment) => {
      const client = getClient(
        payment.clientId
      );

      const project = getProject(
        payment.projectId
      );

      const matchesSearch =
        !query ||
        payment.invoiceId
          ?.toLowerCase()
          .includes(query) ||
        payment.reference
          ?.toLowerCase()
          .includes(query) ||
        client?.name
          ?.toLowerCase()
          .includes(query) ||
        project?.name
          ?.toLowerCase()
          .includes(query);

      const matchesStatus =
        status === "all" ||
        payment.status === status;

      const matchesClient =
        clientId === "all" ||
        payment.clientId === clientId;

      const matchesMethod =
        method === "all" ||
        payment.method === method;

      return (
        matchesSearch &&
        matchesStatus &&
        matchesClient &&
        matchesMethod
      );
    });
  }, [
    search,
    status,
    clientId,
    method,
  ]);

  /* ============================================================
     FINANCIAL STATS
  ============================================================ */

  const totalReceived = payments
    .filter((payment) => payment.status === "paid")
    .reduce(
      (total, payment) =>
        total + payment.amount,
      0
    );

  const pendingAmount = payments
    .filter(
      (payment) => payment.status === "pending"
    )
    .reduce(
      (total, payment) =>
        total + payment.amount,
      0
    );

  const overdueAmount = payments
    .filter(
      (payment) => payment.status === "overdue"
    )
    .reduce(
      (total, payment) =>
        total + payment.amount,
      0
    );

  const thisMonthReceived = payments
    .filter(
      (payment) =>
        payment.status === "paid" &&
        payment.date?.includes("Aug 2026")
    )
    .reduce(
      (total, payment) =>
        total + payment.amount,
      0
    );

  return (
    <div className="mx-auto max-w-[1400px] animate-fade-up">
      {/* ======================================================
          HEADER
      ====================================================== */}

      <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <div className="mb-2 flex items-center gap-2 text-[0.65rem] font-bold uppercase tracking-[0.16em] text-brand-orange">
            <WalletCards className="h-3.5 w-3.5" />
            Administration
          </div>

          <h1 className="font-display text-display-md font-bold tracking-[-0.02em] text-surface-fg">
            Payments
          </h1>

          <p className="mt-2 max-w-2xl text-lead text-surface-muted">
            Track payments received from clients
            across all OCT20FIVE projects.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-surface-border bg-surface-card px-4 py-2.5 text-sm font-semibold text-surface-fg transition hover:border-brand-orange hover:text-brand-orange"
          >
            <Download className="h-4 w-4" />
            Export
          </button>

          <button
            type="button"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand-orange px-4 py-2.5 text-sm font-semibold text-white shadow-[0_10px_24px_-8px_rgba(255,90,31,0.55)]"
          >
            <Plus className="h-4 w-4" />
            Record Payment
          </button>
        </div>
      </div>

      {/* ======================================================
          STATS
      ====================================================== */}

      <div className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          icon={IndianRupee}
          label="Total Received"
          value={formatCurrency(totalReceived)}
          description="All successfully received payments"
        />

        <StatCard
          icon={Clock3}
          label="Pending"
          value={formatCurrency(pendingAmount)}
          description="Payments awaiting receipt"
        />

        <StatCard
          icon={AlertCircle}
          label="Overdue"
          value={formatCurrency(overdueAmount)}
          description="Payments past their due date"
        />

        <StatCard
          icon={CalendarDays}
          label="This Month"
          value={formatCurrency(
            thisMonthReceived
          )}
          description="Payments received in August"
        />
      </div>

      {/* ======================================================
          FILTERS
      ====================================================== */}

      <div className="mb-5">
        <FilterBar
          search={search}
          setSearch={setSearch}
          status={status}
          setStatus={setStatus}
          clientId={clientId}
          setClientId={setClientId}
          method={method}
          setMethod={setMethod}
        />
      </div>

      {/* ======================================================
          TABLE HEADER
      ====================================================== */}

      <div className="mb-5 flex items-center justify-between">
        <div>
          <h2 className="font-display text-lg font-bold text-surface-fg">
            Payment Ledger
          </h2>

          <p className="mt-1 text-sm text-surface-muted">
            Client payments across all projects.
          </p>
        </div>

        <span className="text-xs font-medium text-surface-muted">
          {filteredPayments.length}{" "}
          {filteredPayments.length === 1
            ? "payment"
            : "payments"}
        </span>
      </div>

      {/* ======================================================
          TABLE
      ====================================================== */}

      {filteredPayments.length === 0 ? (
        <EmptyState
          title="No Payments Found"
          description="No payments match the current search or filters."
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
                  Project
                </th>

                <th className="py-4 pr-5">
                  Amount
                </th>

                <th className="py-4 pr-5">
                  Method
                </th>

                <th className="py-4 pr-5">
                  Status
                </th>

                <th className="py-4 pr-5">
                  Date
                </th>

                <th className="py-4 pr-6" />
              </tr>
            </thead>

            <tbody>
              {filteredPayments.map(
                (payment) => (
                  <PaymentRow
                    key={payment.id}
                    payment={payment}
                  />
                )
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* ======================================================
          SUMMARY
      ====================================================== */}

      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        <div className="brand-card">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-700">
              <CheckCircle2 className="h-4 w-4" />
            </div>

            <div>
              <p className="text-xs text-surface-muted">
                Paid Transactions
              </p>

              <p className="mt-0.5 text-sm font-bold text-surface-fg">
                {
                  payments.filter(
                    (payment) =>
                      payment.status ===
                      "paid"
                  ).length
                }{" "}
                payments
              </p>
            </div>
          </div>
        </div>

        <div className="brand-card">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-orange/10 text-brand-orange">
              <Receipt className="h-4 w-4" />
            </div>

            <div>
              <p className="text-xs text-surface-muted">
                Outstanding
              </p>

              <p className="mt-0.5 text-sm font-bold text-surface-fg">
                {formatCurrency(
                  pendingAmount +
                    overdueAmount
                )}
              </p>
            </div>
          </div>
        </div>

        <div className="brand-card">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-500/10 text-blue-700">
              <Building2 className="h-4 w-4" />
            </div>

            <div>
              <p className="text-xs text-surface-muted">
                Paying Clients
              </p>

              <p className="mt-0.5 text-sm font-bold text-surface-fg">
                {
                  new Set(
                    payments.map(
                      (payment) =>
                        payment.clientId
                    )
                  ).size
                }{" "}
                clients
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}