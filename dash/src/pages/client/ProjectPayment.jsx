import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  CreditCard,
  LockKeyhole,
  Receipt,
  ShieldCheck,
  WalletCards,
  AlertCircle,
} from "lucide-react";

import { Link, useParams } from "react-router-dom";
import { cn } from "@/lib/utils";

import { currentClient, projects } from "@/data/mockData";

export default function ProjectPayment() {
  const { projectId } = useParams();

  const project = projects.find(
    (item) => item.id === projectId && item.clientId === currentClient.id
  );

  /*
   * ============================================================
   * PROJECT NOT FOUND
   * ============================================================
   */

  if (!project) {
    return (
      <div className="flex min-h-full items-center justify-center bg-surface-bg px-6">
        <div className="w-full max-w-md rounded-2xl border border-surface-border bg-surface-card p-8 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-red-500/10">
            <AlertCircle className="h-6 w-6 text-red-500" />
          </div>

          <h1 className="mt-5 font-display text-xl font-bold text-surface-fg">Project not found</h1>

          <p className="mt-2 text-sm leading-6 text-surface-muted">
            We couldn't find this project or you don't have access to it.
          </p>

          <Link
            to="/projects"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-brand-orange px-4 py-2.5 text-sm font-bold text-white hover:opacity-90"
          >
            Back to Projects
          </Link>
        </div>
      </div>
    );
  }

  /*
   * ============================================================
   * MOCK PAYMENT / INVOICE DATA
   *
   * Replace this with API data later.
   * ============================================================
   */

  const invoices = {
    "project-001": {
      invoiceId: "INV-2026-001",
      total: 185000,
      paid: 100000,
      dueDate: "25 Aug 2026",
    },

    "project-002": {
      invoiceId: "INV-2026-005",
      total: 120000,
      paid: 60000,
      dueDate: "30 Aug 2026",
    },

    "project-003": {
      invoiceId: "INV-2026-002",
      total: 240000,
      paid: 120000,
      dueDate: "20 Aug 2026",
    },

    "project-004": {
      invoiceId: "INV-2026-003",
      total: 150000,
      paid: 0,
      dueDate: "25 Aug 2026",
    },

    "project-005": {
      invoiceId: "INV-2026-004",
      total: 75000,
      paid: 45000,
      dueDate: "31 Aug 2026",
    },

    "project-006": {
      invoiceId: "INV-2026-006",
      total: 90000,
      paid: 90000,
      dueDate: "28 Jul 2026",
    },
  };

  const invoice = invoices[project.id] || {
    invoiceId: `INV-${project.id}`,
    total: 0,
    paid: 0,
    dueDate: "—",
  };

  const remaining = Math.max(invoice.total - invoice.paid, 0);

  const paymentPercentage =
    invoice.total > 0 ? Math.min(Math.round((invoice.paid / invoice.total) * 100), 100) : 0;

  /*
   * If nothing is left to pay.
   */

  if (remaining === 0) {
    return (
      <div className="min-h-full bg-surface-bg">
        <PageHeader project={project} />

        <div className="mx-auto max-w-3xl px-6 py-10 lg:px-8">
          <div className="rounded-2xl border border-emerald-500/20 bg-surface-card p-8 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500/10">
              <CheckCircle2 className="h-8 w-8 text-emerald-600" />
            </div>

            <h2 className="mt-6 font-display text-2xl font-bold tracking-[-0.03em] text-surface-fg">
              No payment due
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-surface-muted">
              This project has been fully paid. There is no outstanding balance at the moment.
            </p>

            <div className="mx-auto mt-8 max-w-sm rounded-xl border border-surface-border bg-surface-bg p-5">
              <div className="flex items-center justify-between text-sm">
                <span className="text-surface-muted">Total project amount</span>

                <span className="font-bold text-surface-fg">{formatCurrency(invoice.total)}</span>
              </div>

              <div className="mt-3 flex items-center justify-between text-sm">
                <span className="text-surface-muted">Amount paid</span>

                <span className="font-bold text-emerald-600">{formatCurrency(invoice.paid)}</span>
              </div>
            </div>

            <Link
              to={`/project/${project.id}`}
              className="mt-7 inline-flex items-center gap-2 rounded-xl border border-surface-border bg-surface-card px-4 py-2.5 text-sm font-bold text-surface-fg hover:border-brand-orange hover:text-brand-orange"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Project
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-full bg-surface-bg">
      {/* =====================================================
          HEADER
      ===================================================== */}

      <PageHeader project={project} />

      {/* =====================================================
          CONTENT
      ===================================================== */}

      <div className="mx-auto max-w-6xl px-6 py-8 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
          {/* =================================================
              LEFT — PAYMENT
          ================================================= */}

          <main className="space-y-6">
            {/* Payment amount */}

            <section className="rounded-2xl border border-surface-border bg-surface-card">
              <SectionHeader
                icon={WalletCards}
                title="Make a Payment"
                description="Pay the outstanding balance for this project."
              />

              <div className="p-6">
                <div className="rounded-2xl bg-surface-bg p-6">
                  <p className="text-xs font-semibold uppercase tracking-[0.12em] text-surface-muted">
                    Amount Due
                  </p>

                  <div className="mt-2 flex flex-wrap items-end justify-between gap-4">
                    <div>
                      <p className="font-display text-4xl font-bold tracking-[-0.05em] text-brand-orange">
                        {formatCurrency(remaining)}
                      </p>

                      <p className="mt-1 text-sm text-surface-muted">Remaining balance</p>
                    </div>

                    <span className="rounded-full bg-brand-orange/10 px-3 py-1.5 text-xs font-bold text-brand-orange">
                      Due {invoice.dueDate}
                    </span>
                  </div>
                </div>

                {/* Amount breakdown */}

                <div className="mt-6 space-y-4">
                  <PaymentLine label="Project Total" value={formatCurrency(invoice.total)} />

                  <PaymentLine label="Already Paid" value={formatCurrency(invoice.paid)} positive />

                  <div className="h-px bg-surface-border" />

                  <PaymentLine label="Remaining" value={formatCurrency(remaining)} strong />
                </div>
              </div>
            </section>

            {/* Payment method */}

            <section className="rounded-2xl border border-surface-border bg-surface-card">
              <SectionHeader
                icon={CreditCard}
                title="Payment Method"
                description="Choose how you'd like to complete your payment."
              />

              <div className="p-6">
                <button
                  type="button"
                  className="flex w-full items-center justify-between rounded-xl border-2 border-brand-orange bg-brand-orange/[0.04] p-4 text-left"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-orange/10">
                      <CreditCard className="h-5 w-5 text-brand-orange" />
                    </div>

                    <div>
                      <p className="text-sm font-bold text-surface-fg">Card / UPI</p>

                      <p className="mt-1 text-xs text-surface-muted">
                        Secure payment via payment gateway
                      </p>
                    </div>
                  </div>

                  <div className="flex h-5 w-5 items-center justify-center rounded-full border-2 border-brand-orange">
                    <div className="h-2.5 w-2.5 rounded-full bg-brand-orange" />
                  </div>
                </button>

                <button
                  type="button"
                  className="mt-3 flex w-full items-center gap-4 rounded-xl border border-surface-border bg-surface-bg p-4 text-left transition hover:border-surface-muted"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-surface-card">
                    <Receipt className="h-5 w-5 text-surface-muted" />
                  </div>

                  <div>
                    <p className="text-sm font-bold text-surface-fg">Bank Transfer</p>

                    <p className="mt-1 text-xs text-surface-muted">View OCT20FIVE bank details</p>
                  </div>
                </button>
              </div>
            </section>

            {/* Secure payment */}

            <div className="flex items-start gap-3 rounded-xl border border-surface-border bg-surface-card px-5 py-4">
              <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />

              <div>
                <p className="text-sm font-semibold text-surface-fg">Secure payment</p>

                <p className="mt-1 text-xs leading-5 text-surface-muted">
                  Your payment will be processed securely. OCT20FIVE does not store your card
                  details.
                </p>
              </div>

              <LockKeyhole className="ml-auto mt-0.5 h-4 w-4 shrink-0 text-surface-muted" />
            </div>
          </main>

          {/* =================================================
              RIGHT — SUMMARY
          ================================================= */}

          <aside className="h-fit space-y-6 lg:sticky lg:top-6">
            <section className="overflow-hidden rounded-2xl border border-surface-border bg-surface-card">
              <div className="border-b border-surface-border px-6 py-5">
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-brand-orange">
                  Payment Summary
                </p>

                <h2 className="mt-2 font-display text-xl font-bold tracking-[-0.03em] text-surface-fg">
                  {project.name}
                </h2>

                <p className="mt-1 text-xs text-surface-muted">{invoice.invoiceId}</p>
              </div>

              <div className="p-6">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-surface-muted">Project total</span>

                  <span className="text-sm font-bold text-surface-fg">
                    {formatCurrency(invoice.total)}
                  </span>
                </div>

                <div className="mt-4 flex items-center justify-between">
                  <span className="text-sm text-surface-muted">Paid</span>

                  <span className="text-sm font-semibold text-emerald-600">
                    {formatCurrency(invoice.paid)}
                  </span>
                </div>

                <div className="mt-4 h-2 overflow-hidden rounded-full bg-surface-bg">
                  <div
                    className="h-full rounded-full bg-emerald-500 transition-all"
                    style={{
                      width: `${paymentPercentage}%`,
                    }}
                  />
                </div>

                <p className="mt-2 text-right text-xs text-surface-muted">
                  {paymentPercentage}% paid
                </p>

                <div className="my-6 h-px bg-surface-border" />

                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.1em] text-surface-muted">
                    Pay Now
                  </p>

                  <p className="mt-1 font-display text-3xl font-bold tracking-[-0.04em] text-brand-orange">
                    {formatCurrency(remaining)}
                  </p>
                </div>

                {/* Main CTA */}

                <button
                  type="button"
                  className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-brand-orange px-5 py-3.5 text-sm font-bold text-white shadow-[0_12px_30px_-10px_rgba(255,90,31,0.5)] transition-all duration-200 hover:translate-y-[-1px] hover:opacity-95"
                >
                  Pay {formatCurrency(remaining)}
                  <ArrowRight className="h-4 w-4" />
                </button>

                <p className="mt-3 text-center text-[0.65rem] leading-4 text-surface-muted">
                  You will be redirected to our secure payment gateway.
                </p>
              </div>
            </section>

            {/* Invoice */}

            <section className="rounded-2xl border border-surface-border bg-surface-card p-5">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-surface-bg">
                  <Receipt className="h-4 w-4 text-surface-muted" />
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.08em] text-surface-muted">
                    Invoice
                  </p>

                  <p className="mt-0.5 text-sm font-bold text-surface-fg">{invoice.invoiceId}</p>
                </div>
              </div>

              <div className="mt-5 space-y-3">
                <InfoRow label="Issued for" value={currentClient.name} />

                <InfoRow label="Due date" value={invoice.dueDate} />

                <InfoRow label="Status" value="Payment due" warning />
              </div>
            </section>

            <Link
              to={`/project/${project.id}`}
              className="flex items-center justify-center gap-2 text-sm font-semibold text-surface-muted hover:text-surface-fg"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to project
            </Link>
          </aside>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   HEADER
============================================================ */

function PageHeader({ project }) {
  return (
    <div className="border-b border-surface-border">
      <div className="mx-auto max-w-6xl px-6 py-7 lg:px-8">
        <Link
          to={`/project/${project.id}`}
          className="inline-flex items-center gap-2 text-xs font-semibold text-surface-muted transition hover:text-brand-orange"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to {project.name}
        </Link>

        <div className="mt-5">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-orange">
            Project Payment
          </p>

          <h1 className="mt-2 font-display text-3xl font-bold tracking-[-0.04em] text-surface-fg sm:text-4xl">
            Complete Your Payment
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-surface-muted">
            Make a secure payment toward your{" "}
            <span className="font-semibold text-surface-fg">{project.name}</span> project.
          </p>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   SECTION HEADER
============================================================ */

function SectionHeader({ icon: Icon, title, description }) {
  return (
    <div className="flex items-start gap-3 border-b border-surface-border px-6 py-5">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand-orange/10">
        <Icon className="h-4 w-4 text-brand-orange" />
      </div>

      <div>
        <h2 className="font-display text-base font-bold tracking-[-0.02em] text-surface-fg">
          {title}
        </h2>

        <p className="mt-1 text-sm text-surface-muted">{description}</p>
      </div>
    </div>
  );
}

/* ============================================================
   PAYMENT LINE
============================================================ */

function PaymentLine({ label, value, positive = false, strong = false }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className={cn("text-sm", strong ? "font-bold text-surface-fg" : "text-surface-muted")}>
        {label}
      </span>

      <span
        className={cn(
          "text-sm font-bold",
          positive ? "text-emerald-600" : strong ? "text-brand-orange" : "text-surface-fg"
        )}
      >
        {value}
      </span>
    </div>
  );
}

/* ============================================================
   INFO ROW
============================================================ */

function InfoRow({ label, value, warning = false }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-xs text-surface-muted">{label}</span>

      <span
        className={cn("text-xs font-semibold", warning ? "text-brand-orange" : "text-surface-fg")}
      >
        {value}
      </span>
    </div>
  );
}

/* ============================================================
   CURRENCY
============================================================ */

function formatCurrency(value) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
}
