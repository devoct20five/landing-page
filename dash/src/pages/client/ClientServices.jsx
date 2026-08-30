import {
  CheckCircle2,
  Clock3,
  CreditCard,
  FolderKanban,
  IndianRupee,
  ArrowUpRight,
  Receipt,
  AlertCircle,
  Layers3,
  CalendarDays,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { currentClient, projects } from "@/data/mockData";

export default function ClientServices() {
  const clientProjects = projects.filter((project) => project.clientId === currentClient.id);

  /*
   * ============================================================
   * SERVICES
   * Derived from the services actually being used across
   * the client's projects.
   * ============================================================
   */

  const serviceMap = {};

  clientProjects.forEach((project) => {
    project.services.forEach((service) => {
      if (!serviceMap[service]) {
        serviceMap[service] = {
          name: service,
          projects: [],
        };
      }

      serviceMap[service].projects.push(project);
    });
  });

  const clientServices = Object.values(serviceMap);

  /*
   * ============================================================
   * PAYMENT DATA
   * Mock structure — replace with API data later.
   * ============================================================
   */

  const invoices = [
    {
      id: "INV-2026-001",
      description: "Summer Campaign 2026",
      projectId: "project-001",
      amount: 185000,
      paid: 185000,
      status: "paid",
      issued: "01 Aug 2026",
      due: "10 Aug 2026",
    },
    {
      id: "INV-2026-002",
      description: "Website Redesign",
      projectId: "project-003",
      amount: 240000,
      paid: 120000,
      status: "partial",
      issued: "05 Aug 2026",
      due: "20 Aug 2026",
    },
    {
      id: "INV-2026-003",
      description: "Product Launch",
      projectId: "project-004",
      amount: 150000,
      paid: 0,
      status: "pending",
      issued: "10 Aug 2026",
      due: "25 Aug 2026",
    },
    {
      id: "INV-2026-004",
      description: "Social Content Retainer — August",
      projectId: "project-005",
      amount: 75000,
      paid: 75000,
      status: "paid",
      issued: "01 Aug 2026",
      due: "05 Aug 2026",
    },
  ];

  const totalBilled = invoices.reduce((sum, invoice) => sum + invoice.amount, 0);

  const totalPaid = invoices.reduce((sum, invoice) => sum + invoice.paid, 0);

  const totalPending = totalBilled - totalPaid;

  const pendingInvoices = invoices.filter((invoice) => invoice.status !== "paid");

  return (
    <div className="min-h-full bg-surface-bg">
      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="border-b border-surface-border">
        <div className="mx-auto max-w-7xl px-6 py-8 lg:px-8">
          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <div>
              <h1 className="font-display text-3xl font-bold tracking-[-0.04em] text-surface-fg sm:text-4xl">
                Services & Billing
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-surface-muted">
                See the services you're currently using, the projects they're attached to, and your
                payment history with OCT20FIVE.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* =====================================================
          CONTENT
      ===================================================== */}

      <div className="mx-auto max-w-7xl px-6 py-8 lg:px-8">
        <div className="space-y-6">
          {/* =================================================
              BILLING OVERVIEW
          ================================================= */}

          <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <BillingStat
              icon={Layers3}
              label="Active Services"
              value={clientServices.length}
              description="Currently in use"
            />

            <BillingStat
              icon={FolderKanban}
              label="Active Projects"
              value={clientProjects.filter((project) => project.status !== "completed").length}
              description="Across your account"
            />

            <BillingStat
              icon={CheckCircle2}
              label="Total Paid"
              value={formatCurrency(totalPaid)}
              description="Payments received"
            />

            <BillingStat
              icon={AlertCircle}
              label="Outstanding"
              value={formatCurrency(totalPending)}
              description={totalPending > 0 ? "Payment required" : "Everything is paid"}
              warning={totalPending > 0}
            />
          </section>

          {/* =================================================
              SERVICES IN USE
          ================================================= */}

          <section className="rounded-2xl border border-surface-border bg-surface-card">
            <SectionHeader
              title="Services You're Using"
              description="Services currently being delivered across your projects."
            />

            <div className="grid gap-4 p-6 sm:grid-cols-2 lg:grid-cols-3">
              {clientServices.map((service) => (
                <ServiceCard key={service.name} service={service} />
              ))}
            </div>
          </section>

          {/* =================================================
              PROJECT → SERVICES
          ================================================= */}

          <section className="rounded-2xl border border-surface-border bg-surface-card">
            <SectionHeader
              title="Services by Project"
              description="See exactly which services are being used for each project."
            />

            <div className="divide-y divide-surface-border">
              {clientProjects.map((project) => (
                <ProjectServiceRow key={project.id} project={project} />
              ))}
            </div>
          </section>

          {/* =================================================
              PAYMENT SUMMARY
          ================================================= */}

          <section className="rounded-2xl border border-surface-border bg-surface-card">
            <SectionHeader
              title="Payment Overview"
              description="A summary of your payments and outstanding balance."
            />

            <div className="grid divide-y divide-surface-border sm:grid-cols-3 sm:divide-x sm:divide-y-0">
              <PaymentSummary
                label="Total Billed"
                value={formatCurrency(totalBilled)}
                icon={Receipt}
              />

              <PaymentSummary
                label="Total Paid"
                value={formatCurrency(totalPaid)}
                icon={CheckCircle2}
              />

              <PaymentSummary
                label="Outstanding"
                value={formatCurrency(totalPending)}
                icon={Clock3}
                warning={totalPending > 0}
              />
            </div>
          </section>

          {/* =================================================
              OUTSTANDING PAYMENTS
          ================================================= */}

          {pendingInvoices.length > 0 && (
            <section className="rounded-2xl border border-brand-orange/20 bg-brand-orange/[0.03]">
              <div className="flex flex-col gap-4 border-b border-brand-orange/10 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 text-brand-orange" />

                    <h2 className="font-display text-base font-bold text-surface-fg">
                      Payment Required
                    </h2>
                  </div>

                  <p className="mt-1 text-sm text-surface-muted">
                    The following invoices have an outstanding balance.
                  </p>
                </div>

                <span className="rounded-full bg-brand-orange/10 px-3 py-1 text-xs font-bold text-brand-orange">
                  {formatCurrency(totalPending)} due
                </span>
              </div>

              <div className="divide-y divide-brand-orange/10">
                {pendingInvoices.map((invoice) => (
                  <InvoiceRow
                    key={invoice.id}
                    invoice={invoice}
                    projects={clientProjects}
                    pending
                  />
                ))}
              </div>
            </section>
          )}

          {/* =================================================
              PAYMENT HISTORY
          ================================================= */}

          <section className="rounded-2xl border border-surface-border bg-surface-card">
            <SectionHeader
              title="Payment History"
              description="Your recent invoices and payment activity."
            />

            <div className="divide-y divide-surface-border">
              {invoices.map((invoice) => (
                <InvoiceRow key={invoice.id} invoice={invoice} projects={clientProjects} />
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   BILLING STAT
============================================================ */

function BillingStat({ icon: Icon, label, value, description, warning = false }) {
  return (
    <div className="rounded-2xl border border-surface-border bg-surface-card p-5">
      <div className="flex items-center justify-between">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-orange/10">
          <Icon className="h-4 w-4 text-brand-orange" />
        </div>

        {warning && <span className="h-2 w-2 rounded-full bg-brand-orange" />}
      </div>

      <p className="mt-5 text-xs font-semibold uppercase tracking-[0.1em] text-surface-muted">
        {label}
      </p>

      <p
        className={cn(
          "mt-1 font-display text-2xl font-bold tracking-[-0.04em]",
          warning ? "text-brand-orange" : "text-surface-fg"
        )}
      >
        {value}
      </p>

      <p className="mt-1 text-xs text-surface-muted">{description}</p>
    </div>
  );
}

/* ============================================================
   SERVICE CARD
============================================================ */

function ServiceCard({ service }) {
  const projectCount = service.projects.length;

  return (
    <div className="rounded-xl border border-surface-border bg-surface-bg p-5 transition-all duration-200 hover:border-brand-orange/40">
      <div className="flex items-start justify-between gap-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-orange/10">
          <Layers3 className="h-5 w-5 text-brand-orange" />
        </div>

        <span className="rounded-full border border-surface-border px-2.5 py-1 text-[0.65rem] font-semibold text-surface-muted">
          {projectCount} {projectCount === 1 ? "project" : "projects"}
        </span>
      </div>

      <h3 className="mt-5 font-display text-base font-bold tracking-[-0.02em] text-surface-fg">
        {service.name}
      </h3>

      <p className="mt-1 text-xs leading-5 text-surface-muted">
        Active across {projectCount} {projectCount === 1 ? "project" : "projects"}.
      </p>

      <div className="mt-4 flex flex-wrap gap-1.5">
        {service.projects.map((project) => (
          <span
            key={project.id}
            className="rounded-lg bg-surface-card px-2.5 py-1.5 text-[0.65rem] font-medium text-surface-muted"
          >
            {project.name}
          </span>
        ))}
      </div>
    </div>
  );
}

/* ============================================================
   PROJECT SERVICES
============================================================ */

function ProjectServiceRow({ project }) {
  const statusMap = {
    "in-progress": {
      label: "In Progress",
      className: "bg-blue-500/10 text-blue-600",
    },
    "client-review": {
      label: "Client Review",
      className: "bg-brand-orange/10 text-brand-orange",
    },
    blocked: {
      label: "Blocked",
      className: "bg-red-500/10 text-red-600",
    },
    completed: {
      label: "Completed",
      className: "bg-emerald-500/10 text-emerald-600",
    },
  };

  const status = statusMap[project.status] || {
    label: project.status,
    className: "bg-surface-bg text-surface-muted",
  };

  return (
    <div className="flex flex-col gap-5 px-6 py-5 lg:flex-row lg:items-center lg:justify-between">
      <div className="flex min-w-0 items-center gap-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-surface-bg">
          <FolderKanban className="h-5 w-5 text-surface-muted" />
        </div>

        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-sm font-bold text-surface-fg">{project.name}</h3>

            <span
              className={cn(
                "rounded-full px-2.5 py-1 text-[0.6rem] font-semibold",
                status.className
              )}
            >
              {status.label}
            </span>
          </div>

          <p className="mt-1 text-xs text-surface-muted">
            {project.completedDeliverables} of {project.totalDeliverables} deliverables completed
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 lg:max-w-md lg:justify-end">
        {project.services.map((service) => (
          <span
            key={service}
            className="inline-flex items-center gap-1.5 rounded-lg border border-surface-border bg-surface-bg px-3 py-1.5 text-xs font-semibold text-surface-fg"
          >
            <CheckCircle2 className="h-3.5 w-3.5 text-brand-orange" />
            {service}
          </span>
        ))}
      </div>
    </div>
  );
}

/* ============================================================
   PAYMENT SUMMARY
============================================================ */

function PaymentSummary({ icon: Icon, label, value, warning = false }) {
  return (
    <div className="px-6 py-6">
      <div className="flex items-center gap-2">
        <Icon className={cn("h-4 w-4", warning ? "text-brand-orange" : "text-surface-muted")} />

        <span className="text-xs font-semibold uppercase tracking-[0.08em] text-surface-muted">
          {label}
        </span>
      </div>

      <p
        className={cn(
          "mt-2 font-display text-2xl font-bold tracking-[-0.04em]",
          warning ? "text-brand-orange" : "text-surface-fg"
        )}
      >
        {value}
      </p>
    </div>
  );
}

/* ============================================================
   INVOICE ROW
============================================================ */

function InvoiceRow({ invoice, projects, pending = false }) {
  const project = projects.find((item) => item.id === invoice.projectId);

  const remaining = invoice.amount - invoice.paid;

  return (
    <div className="flex flex-col gap-4 px-6 py-5 lg:flex-row lg:items-center lg:justify-between">
      <div className="flex min-w-0 items-start gap-4">
        <div
          className={cn(
            "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl",
            pending ? "bg-brand-orange/10" : "bg-surface-bg"
          )}
        >
          <CreditCard
            className={cn("h-5 w-5", pending ? "text-brand-orange" : "text-surface-muted")}
          />
        </div>

        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-sm font-bold text-surface-fg">{invoice.description}</h3>

            <span className="text-[0.65rem] font-medium text-surface-muted">{invoice.id}</span>
          </div>

          <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-surface-muted">
            {project && <span>{project.name}</span>}

            <span>Issued {invoice.issued}</span>

            <span>Due {invoice.due}</span>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-5 lg:shrink-0">
        <div>
          <p className="text-[0.65rem] font-semibold uppercase tracking-[0.08em] text-surface-muted">
            Amount
          </p>

          <p className="mt-1 text-sm font-bold text-surface-fg">{formatCurrency(invoice.amount)}</p>
        </div>

        {invoice.paid > 0 && invoice.paid < invoice.amount && (
          <div>
            <p className="text-[0.65rem] font-semibold uppercase tracking-[0.08em] text-surface-muted">
              Paid
            </p>

            <p className="mt-1 text-sm font-semibold text-emerald-600">
              {formatCurrency(invoice.paid)}
            </p>
          </div>
        )}

        {remaining > 0 && (
          <div>
            <p className="text-[0.65rem] font-semibold uppercase tracking-[0.08em] text-surface-muted">
              Due
            </p>

            <p className="mt-1 text-sm font-bold text-brand-orange">{formatCurrency(remaining)}</p>
          </div>
        )}

        <InvoiceStatus status={invoice.status} />

        {remaining > 0 && (
          <button className="inline-flex items-center gap-1.5 rounded-lg bg-brand-orange px-3 py-2 text-xs font-bold text-white transition hover:opacity-90">
            Pay Now
            <ArrowUpRight className="h-3.5 w-3.5" />
          </button>
        )}
      </div>
    </div>
  );
}

/* ============================================================
   INVOICE STATUS
============================================================ */

function InvoiceStatus({ status }) {
  const statusMap = {
    paid: {
      label: "Paid",
      icon: CheckCircle2,
      className: "bg-emerald-500/10 text-emerald-600",
    },

    partial: {
      label: "Partially Paid",
      icon: Clock3,
      className: "bg-amber-500/10 text-amber-600",
    },

    pending: {
      label: "Pending",
      icon: AlertCircle,
      className: "bg-brand-orange/10 text-brand-orange",
    },
  };

  const config = statusMap[status] || statusMap.pending;
  const Icon = config.icon;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-[0.65rem] font-semibold",
        config.className
      )}
    >
      <Icon className="h-3.5 w-3.5" />
      {config.label}
    </span>
  );
}

/* ============================================================
   SECTION HEADER
============================================================ */

function SectionHeader({ title, description }) {
  return (
    <div className="border-b border-surface-border px-6 py-5">
      <h2 className="font-display text-base font-bold tracking-[-0.02em] text-surface-fg">
        {title}
      </h2>

      <p className="mt-1 text-sm text-surface-muted">{description}</p>
    </div>
  );
}

/* ============================================================
   HELPERS
============================================================ */

function formatCurrency(value) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
}
