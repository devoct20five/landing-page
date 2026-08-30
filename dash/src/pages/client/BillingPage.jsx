import {
  AlertCircle,
  ArrowDownLeft,
  ArrowUpRight,
  CalendarDays,
  Check,
  CheckCircle2,
  Clock3,
  CreditCard,
  Download,
  ExternalLink,
  FileText,
  History,
  IndianRupee,
  Info,
  LockKeyhole,
  MoreHorizontal,
  Receipt,
  ShieldCheck,
  Wallet,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

/* ============================================================
   MOCK DATA
============================================================ */

const billingSummary = {
  outstanding: 185000,
  dueAmount: 120000,
  nextDueDate: "30 Aug 2026",
  gracePeriodEnds: "09 Sep 2026",
  currency: "INR",
  status: "due-soon",
};

const invoices = [
  {
    id: "INV-2026-008",
    title: "Summer Campaign — Final Production",
    project: "Summer Campaign 2026",
    amount: 120000,
    issuedDate: "21 Aug 2026",
    dueDate: "30 Aug 2026",
    status: "due",
  },
  {
    id: "INV-2026-007",
    title: "Summer Campaign — Production Phase",
    project: "Summer Campaign 2026",
    amount: 185000,
    issuedDate: "28 Jul 2026",
    dueDate: "05 Aug 2026",
    status: "overdue",
  },
  {
    id: "INV-2026-006",
    title: "Website Redesign — Design Phase",
    project: "Website Redesign",
    amount: 95000,
    issuedDate: "12 Jul 2026",
    dueDate: "25 Jul 2026",
    status: "paid",
    paidDate: "24 Jul 2026",
  },
];

const payments = [
  {
    id: "PAY-2026-014",
    invoice: "INV-2026-006",
    description: "Website Redesign — Design Phase",
    amount: 95000,
    date: "24 Jul 2026",
    method: "UPI",
    reference: "TXN982341729",
    status: "completed",
  },
  {
    id: "PAY-2026-011",
    invoice: "INV-2026-004",
    description: "Summer Campaign — Pre-production",
    amount: 150000,
    date: "12 Jul 2026",
    method: "Bank Transfer",
    reference: "TXN781239442",
    status: "completed",
  },
  {
    id: "PAY-2026-008",
    invoice: "INV-2026-002",
    description: "Initial Project Advance",
    amount: 200000,
    date: "18 Jun 2026",
    method: "Card",
    reference: "TXN661923871",
    status: "completed",
  },
];

/* ============================================================
   PAGE
============================================================ */

export default function ClientBilling() {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="min-h-full bg-surface-bg">
      {/* ======================================================
          HEADER
      ====================================================== */}

      <div className="border-b border-surface-border">
        <div className="mx-auto max-w-7xl px-6 py-8 lg:px-8">
          <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
            <div>
              <div className="mb-3 flex items-center gap-2">
                <Wallet className="h-4 w-4 text-brand-orange" />

                <span className="text-[0.65rem] font-bold uppercase tracking-[0.16em] text-brand-orange">
                  Client Billing
                </span>
              </div>

              <h1 className="font-display text-3xl font-bold tracking-[-0.04em] text-surface-fg sm:text-4xl">
                Billing
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-surface-muted">
                Manage your outstanding payments, invoices and payment history in one place.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button className="inline-flex items-center gap-2 rounded-xl border border-surface-border bg-surface-card px-4 py-2.5 text-xs font-bold text-surface-fg transition-colors hover:border-brand-orange hover:text-brand-orange">
                <Receipt className="h-4 w-4" />
                View Invoices
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ======================================================
          CONTENT
      ====================================================== */}

      <main className="mx-auto max-w-7xl px-6 py-8 lg:px-8">
        {/* ==================================================
            BILLING SUMMARY
        ================================================== */}

        <BillingSummary />

        {/* ==================================================
            PROJECT HOLD WARNING
        ================================================== */}

        <PaymentPolicyAlert />

        {/* ==================================================
            TABS
        ================================================== */}

        <div className="mt-8 border-b border-surface-border">
          <div className="flex gap-6">
            <BillingTab
              active={activeTab === "overview"}
              onClick={() => setActiveTab("overview")}
              icon={Wallet}
              label="Upcoming Payments"
            />

            <BillingTab
              active={activeTab === "prepayment"}
              onClick={() => setActiveTab("prepayment")}
              icon={CreditCard}
              label="Pre-Payment"
            />

            <BillingTab
              active={activeTab === "history"}
              onClick={() => setActiveTab("history")}
              icon={History}
              label="Payment History"
            />
          </div>
        </div>

        {/* ==================================================
            TAB CONTENT
        ================================================== */}

        <div className="mt-6">
          {activeTab === "overview" && <UpcomingPayments />}

          {activeTab === "prepayment" && <PrePayment />}

          {activeTab === "history" && <PaymentHistory />}
        </div>
      </main>
    </div>
  );
}

/* ============================================================
   BILLING SUMMARY
============================================================ */

function BillingSummary() {
  return (
    <section className="grid gap-4 lg:grid-cols-[1.4fr_1fr_1fr]">
      {/* Outstanding */}

      <div className="relative overflow-hidden rounded-2xl border border-brand-orange/20 bg-surface-card p-6 shadow-[0_16px_40px_-24px_rgba(255,90,31,0.25)]">
        <div className="absolute right-0 top-0 h-32 w-32 translate-x-10 -translate-y-10 rounded-full bg-brand-orange/5" />

        <div className="relative">
          <div className="flex items-center gap-2">
            <Wallet className="h-4 w-4 text-brand-orange" />

            <p className="text-[0.65rem] font-bold uppercase tracking-[0.12em] text-surface-muted">
              Outstanding Balance
            </p>
          </div>

          <p className="mt-3 font-display text-3xl font-bold tracking-[-0.04em] text-surface-fg">
            ₹1,85,000
          </p>

          <div className="mt-4 flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-brand-orange" />

            <span className="text-xs font-medium text-surface-muted">₹1,20,000 currently due</span>
          </div>
        </div>
      </div>

      {/* Next payment */}

      <div className="rounded-2xl border border-surface-border bg-surface-card p-6">
        <div className="flex items-center gap-2">
          <CalendarDays className="h-4 w-4 text-surface-muted" />

          <p className="text-[0.65rem] font-bold uppercase tracking-[0.12em] text-surface-muted">
            Next Due Date
          </p>
        </div>

        <p className="mt-3 font-display text-xl font-bold tracking-[-0.03em] text-surface-fg">
          30 Aug 2026
        </p>

        <p className="mt-2 text-xs text-surface-muted">₹1,20,000 due</p>
      </div>

      {/* Grace period */}

      <div className="rounded-2xl border border-surface-border bg-surface-card p-6">
        <div className="flex items-center gap-2">
          <Clock3 className="h-4 w-4 text-brand-orange" />

          <p className="text-[0.65rem] font-bold uppercase tracking-[0.12em] text-surface-muted">
            Grace Period
          </p>
        </div>

        <p className="mt-3 font-display text-xl font-bold tracking-[-0.03em] text-surface-fg">
          10 Days
        </p>

        <p className="mt-2 text-xs text-surface-muted">Until 09 Sep 2026</p>
      </div>
    </section>
  );
}

/* ============================================================
   PAYMENT POLICY ALERT
============================================================ */

function PaymentPolicyAlert() {
  return (
    <section className="mt-5 overflow-hidden rounded-2xl border border-amber-300/40 bg-amber-500/5">
      <div className="flex gap-4 p-5">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-amber-500/10">
          <AlertCircle className="h-4 w-4 text-amber-600" />
        </div>

        <div className="min-w-0">
          <h2 className="text-sm font-bold text-surface-fg">Payment & Project Hold Policy</h2>

          <p className="mt-1 max-w-4xl text-xs leading-5 text-surface-muted">
            Payments are due on the date shown on each invoice. A{" "}
            <strong className="text-surface-fg">10-day grace period</strong> is provided after the
            due date. If the outstanding amount remains unpaid after this period, the associated
            project will be placed on hold indefinitely.
          </p>

          <p className="mt-2 max-w-4xl text-xs leading-5 text-surface-muted">
            Work will resume once the overdue amount and any applicable agreed-upon hold/resumption
            amount have been credited to the account.
          </p>
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   TABS
============================================================ */

function BillingTab({ active, onClick, icon: Icon, label }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "relative inline-flex items-center gap-2 pb-3 text-xs font-bold transition-colors",
        active ? "text-brand-orange" : "text-surface-muted hover:text-surface-fg"
      )}
    >
      <Icon className="h-4 w-4" />

      {label}

      {active && (
        <span className="absolute inset-x-0 bottom-0 h-0.5 rounded-full bg-brand-orange" />
      )}
    </button>
  );
}

/* ============================================================
   UPCOMING PAYMENTS
============================================================ */

function UpcomingPayments() {
  const upcoming = invoices.filter(
    (invoice) => invoice.status === "due" || invoice.status === "overdue"
  );

  return (
    <section>
      <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="font-display text-lg font-bold tracking-[-0.02em] text-surface-fg">
            Upcoming Payments
          </h2>

          <p className="mt-1 text-sm text-surface-muted">
            Review your outstanding invoices and make payments before their due dates.
          </p>
        </div>

        <button className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand-orange px-4 py-2.5 text-xs font-bold text-white shadow-[0_10px_24px_-8px_rgba(255,90,31,0.5)] transition-all hover:-translate-y-px">
          <CreditCard className="h-3.5 w-3.5" />
          Pay Outstanding
        </button>
      </div>

      <div className="space-y-3">
        {upcoming.map((invoice) => (
          <InvoiceCard key={invoice.id} invoice={invoice} />
        ))}
      </div>
    </section>
  );
}

/* ============================================================
   INVOICE CARD
============================================================ */

function InvoiceCard({ invoice }) {
  const overdue = invoice.status === "overdue";

  return (
    <article
      className={cn(
        "rounded-2xl border bg-surface-card p-5 transition-colors",
        overdue ? "border-red-300/40" : "border-surface-border hover:border-surface-muted"
      )}
    >
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex min-w-0 gap-4">
          <div
            className={cn(
              "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl",
              overdue ? "bg-red-500/10" : "bg-brand-orange/10"
            )}
          >
            <FileText className={cn("h-5 w-5", overdue ? "text-red-600" : "text-brand-orange")} />
          </div>

          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="truncate text-sm font-bold text-surface-fg">{invoice.title}</h3>

              <InvoiceStatus status={invoice.status} />
            </div>

            <p className="mt-1 text-xs text-surface-muted">{invoice.project}</p>

            <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-[0.65rem] text-surface-muted">
              <span>Invoice {invoice.id}</span>

              <span>Issued {invoice.issuedDate}</span>

              <span className={cn(overdue && "font-bold text-red-600")}>Due {invoice.dueDate}</span>
            </div>
          </div>
        </div>

        <div className="flex shrink-0 items-center justify-between gap-5 lg:justify-end">
          <div className="text-left lg:text-right">
            <p className="text-[0.6rem] font-bold uppercase tracking-[0.1em] text-surface-muted">
              Amount
            </p>

            <p className="mt-1 font-display text-lg font-bold text-surface-fg">
              ₹{invoice.amount.toLocaleString("en-IN")}
            </p>
          </div>

          <button className="inline-flex items-center gap-2 rounded-xl bg-brand-orange px-4 py-2.5 text-xs font-bold text-white transition-all hover:-translate-y-px">
            <CreditCard className="h-3.5 w-3.5" />
            Pay
          </button>
        </div>
      </div>
    </article>
  );
}

/* ============================================================
   PRE PAYMENT
============================================================ */

function PrePayment() {
  const [amount, setAmount] = useState("50000");

  const outstanding = billingSummary.outstanding;
  const paymentAmount = Number(amount) || 0;
  const remaining = Math.max(outstanding - paymentAmount, 0);

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
      {/* Information */}

      <section className="rounded-2xl border border-surface-border bg-surface-card p-6">
        <div className="flex items-center gap-2">
          <CreditCard className="h-4 w-4 text-brand-orange" />

          <span className="text-[0.65rem] font-bold uppercase tracking-[0.12em] text-brand-orange">
            Pre-Payment
          </span>
        </div>

        <h2 className="mt-3 font-display text-2xl font-bold tracking-[-0.03em] text-surface-fg">
          Pay ahead of your due date
        </h2>

        <p className="mt-2 max-w-2xl text-sm leading-6 text-surface-muted">
          You can make a partial or full payment toward your outstanding balance at any time.
          Pre-paying reduces your outstanding amount without waiting for the next invoice due date.
        </p>

        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          <InfoCard label="Outstanding" value="₹1,85,000" />

          <InfoCard label="Next Due" value="₹1,20,000" />

          <InfoCard label="Due Date" value="30 Aug" />
        </div>

        <div className="mt-6 rounded-xl bg-surface-bg p-4">
          <div className="flex gap-3">
            <Info className="mt-0.5 h-4 w-4 shrink-0 text-surface-muted" />

            <p className="text-xs leading-5 text-surface-muted">
              Pre-payment does not change the original invoice due dates. It simply reduces the
              balance that remains payable against your account.
            </p>
          </div>
        </div>
      </section>

      {/* Payment calculator */}

      <section className="rounded-2xl border border-brand-orange/20 bg-surface-card p-6 shadow-[0_16px_40px_-24px_rgba(255,90,31,0.3)]">
        <div className="flex items-center gap-2">
          <Wallet className="h-4 w-4 text-brand-orange" />

          <h2 className="text-sm font-bold text-surface-fg">Make a Payment</h2>
        </div>

        <label className="mt-5 block">
          <span className="text-[0.65rem] font-bold uppercase tracking-[0.1em] text-surface-muted">
            Payment Amount
          </span>

          <div className="mt-2 flex items-center rounded-xl border border-surface-border bg-surface-bg px-4 focus-within:border-brand-orange">
            <IndianRupee className="h-4 w-4 text-surface-muted" />

            <input
              type="number"
              min="1"
              max={outstanding}
              value={amount}
              onChange={(event) => setAmount(event.target.value)}
              className="w-full bg-transparent px-2 py-3 text-lg font-bold text-surface-fg outline-none"
            />
          </div>
        </label>

        <div className="mt-5 space-y-3 rounded-xl bg-surface-bg p-4">
          <SummaryRow
            label="Current outstanding"
            value={`₹${outstanding.toLocaleString("en-IN")}`}
          />

          <SummaryRow label="This payment" value={`₹${paymentAmount.toLocaleString("en-IN")}`} />

          <div className="border-t border-surface-border pt-3">
            <SummaryRow
              label="Remaining balance"
              value={`₹${remaining.toLocaleString("en-IN")}`}
              strong
            />
          </div>
        </div>

        <button className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-brand-orange px-4 py-3.5 text-sm font-bold text-white shadow-[0_10px_24px_-8px_rgba(255,90,31,0.5)] transition-all hover:-translate-y-px">
          <CreditCard className="h-4 w-4" />
          Continue to Payment
        </button>

        <div className="mt-4 flex items-center justify-center gap-2 text-[0.6rem] font-medium text-surface-muted">
          <ShieldCheck className="h-3.5 w-3.5" />
          Secure payment processing
        </div>
      </section>
    </div>
  );
}

/* ============================================================
   PAYMENT HISTORY
============================================================ */

function PaymentHistory() {
  return (
    <section>
      <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="font-display text-lg font-bold tracking-[-0.02em] text-surface-fg">
            Payment History
          </h2>

          <p className="mt-1 text-sm text-surface-muted">
            View all completed payments and transaction details.
          </p>
        </div>

        <button className="inline-flex items-center gap-2 rounded-xl border border-surface-border bg-surface-card px-4 py-2.5 text-xs font-bold text-surface-fg transition-colors hover:border-brand-orange hover:text-brand-orange">
          <Download className="h-3.5 w-3.5" />
          Export History
        </button>
      </div>

      <div className="overflow-hidden rounded-2xl border border-surface-border bg-surface-card">
        <div className="hidden grid-cols-[1fr_150px_130px_120px_40px] gap-4 border-b border-surface-border px-5 py-3 sm:grid">
          <HeaderCell>Payment</HeaderCell>
          <HeaderCell>Date</HeaderCell>
          <HeaderCell>Method</HeaderCell>
          <HeaderCell>Amount</HeaderCell>
          <span />
        </div>

        {payments.map((payment) => (
          <PaymentRow key={payment.id} payment={payment} />
        ))}
      </div>
    </section>
  );
}

/* ============================================================
   PAYMENT ROW
============================================================ */

function PaymentRow({ payment }) {
  return (
    <div className="grid gap-4 border-b border-surface-border px-5 py-5 last:border-b-0 sm:grid-cols-[1fr_150px_130px_120px_40px] sm:items-center">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10">
          <ArrowDownLeft className="h-4 w-4 text-emerald-600" />
        </div>

        <div className="min-w-0">
          <p className="truncate text-xs font-bold text-surface-fg">{payment.description}</p>

          <p className="mt-1 text-[0.6rem] text-surface-muted">
            {payment.id} · {payment.reference}
          </p>
        </div>
      </div>

      <div>
        <p className="text-[0.6rem] font-bold uppercase tracking-[0.06em] text-surface-muted sm:hidden">
          Date
        </p>

        <p className="mt-1 text-xs font-medium text-surface-fg sm:mt-0">{payment.date}</p>
      </div>

      <div>
        <p className="text-[0.6rem] font-bold uppercase tracking-[0.06em] text-surface-muted sm:hidden">
          Method
        </p>

        <p className="mt-1 text-xs font-medium text-surface-fg sm:mt-0">{payment.method}</p>
      </div>

      <div>
        <p className="text-[0.6rem] font-bold uppercase tracking-[0.06em] text-surface-muted sm:hidden">
          Amount
        </p>

        <p className="mt-1 text-sm font-bold text-surface-fg sm:mt-0">
          ₹{payment.amount.toLocaleString("en-IN")}
        </p>
      </div>

      <button className="hidden rounded-lg p-2 text-surface-muted transition-colors hover:bg-surface-bg hover:text-surface-fg sm:block">
        <MoreHorizontal className="h-4 w-4" />
      </button>
    </div>
  );
}

/* ============================================================
   INVOICE STATUS
============================================================ */

function InvoiceStatus({ status }) {
  const config = {
    due: {
      label: "Due Soon",
      className: "bg-amber-500/10 text-amber-600",
      icon: Clock3,
    },
    overdue: {
      label: "Overdue",
      className: "bg-red-500/10 text-red-600",
      icon: AlertCircle,
    },
    paid: {
      label: "Paid",
      className: "bg-emerald-500/10 text-emerald-600",
      icon: CheckCircle2,
    },
  };

  const current = config[status];

  if (!current) return null;

  const Icon = current.icon;

  return (
    <span
      className={cn(
        "flex items-center gap-1 rounded-full px-2 py-1 text-[0.55rem] font-bold",
        current.className
      )}
    >
      <Icon className="h-3 w-3" />
      {current.label}
    </span>
  );
}

/* ============================================================
   INFO CARD
============================================================ */

function InfoCard({ label, value }) {
  return (
    <div className="rounded-xl bg-surface-bg p-4">
      <p className="text-[0.6rem] font-bold uppercase tracking-[0.08em] text-surface-muted">
        {label}
      </p>

      <p className="mt-2 text-sm font-bold text-surface-fg">{value}</p>
    </div>
  );
}

/* ============================================================
   SUMMARY ROW
============================================================ */

function SummaryRow({ label, value, strong = false }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-xs text-surface-muted">{label}</span>

      <span className={cn("text-xs text-surface-fg", strong && "font-bold")}>{value}</span>
    </div>
  );
}

/* ============================================================
   HEADER CELL
============================================================ */

function HeaderCell({ children }) {
  return (
    <span className="text-[0.6rem] font-bold uppercase tracking-[0.1em] text-surface-muted">
      {children}
    </span>
  );
}
