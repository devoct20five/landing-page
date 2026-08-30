import {
  ArrowUpRight,
  BookOpen,
  CheckCircle2,
  ChevronRight,
  ClipboardList,
  FileCheck2,
  FileText,
  HelpCircle,
  Lock,
  MessageSquare,
  Phone,
  Receipt,
  Scale,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { Link } from "react-router-dom";

/* ============================================================
   MOCK DATA
============================================================ */

const documents = [
  {
    id: "terms",
    title: "Terms & Conditions",
    description:
      "The terms governing the use of our services, client responsibilities, project delivery and engagement.",
    icon: Scale,
    category: "Company Policy",
    updated: "Updated 01 Aug 2026",
    href: "#",
  },
  {
    id: "privacy",
    title: "Privacy Policy",
    description:
      "How we collect, use, store and protect information associated with your account and projects.",
    icon: Lock,
    category: "Company Policy",
    updated: "Updated 01 Aug 2026",
    href: "#",
  },
  {
    id: "agreement",
    title: "Client Service Agreement",
    description:
      "Your agreement with the company covering the scope, responsibilities, commercial terms and engagement conditions.",
    icon: FileCheck2,
    category: "Your Agreement",
    updated: "Signed 18 Jun 2026",
    href: "#",
    signed: true,
  },
  {
    id: "brief",
    title: "Client Brief",
    description:
      "The original project brief and requirements submitted for your engagement with the team.",
    icon: ClipboardList,
    category: "Project Document",
    updated: "Updated 20 Jun 2026",
    href: "#",
  },
  {
    id: "refund",
    title: "Refund Policy",
    description:
      "Information about refunds, cancellations, eligible payments and applicable conditions.",
    icon: Receipt,
    category: "Company Policy",
    updated: "Updated 01 Aug 2026",
    href: "#",
  },
];

/* ============================================================
   PAGE
============================================================ */

export default function ClientSupport() {
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
                <HelpCircle className="h-4 w-4 text-brand-orange" />

                <span className="text-[0.65rem] font-bold uppercase tracking-[0.16em] text-brand-orange">
                  Client Support
                </span>
              </div>

              <h1 className="font-display text-3xl font-bold tracking-[-0.04em] text-surface-fg sm:text-4xl">
                Support & Resources
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-surface-muted">
                Find your agreements, project documents, policies and information about your
                engagement with us.
              </p>
            </div>

            <Link
              to="/client/support/contact"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand-orange px-5 py-3 text-xs font-bold text-white shadow-[0_10px_24px_-8px_rgba(255,90,31,0.5)] transition-all hover:-translate-y-px"
            >
              <MessageSquare className="h-4 w-4" />
              Contact Support
            </Link>
          </div>
        </div>
      </div>

      {/* ======================================================
          MAIN CONTENT
      ====================================================== */}

      <main className="mx-auto max-w-7xl px-6 py-8 lg:px-8">
        {/* ==================================================
            SUPPORT BANNER
        ================================================== */}

        <SupportBanner />

        {/* ==================================================
            DOCUMENTS
        ================================================== */}

        <section className="mt-8">
          <div className="mb-5">
            <h2 className="font-display text-lg font-bold tracking-[-0.02em] text-surface-fg">
              Your Documents & Policies
            </h2>

            <p className="mt-1 text-sm text-surface-muted">
              Access important documents associated with your account and engagement.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {documents.map((document) => (
              <DocumentCard key={document.id} document={document} />
            ))}
          </div>
        </section>

        {/* ==================================================
            AGREEMENT STATUS
        ================================================== */}

        <AgreementStatus />

        {/* ==================================================
            NEED HELP
        ================================================== */}

        <NeedHelp />
      </main>
    </div>
  );
}

/* ============================================================
   SUPPORT BANNER
============================================================ */

function SupportBanner() {
  return (
    <section className="relative overflow-hidden rounded-2xl border border-brand-orange/20 bg-surface-card">
      <div className="absolute right-0 top-0 h-48 w-48 translate-x-16 -translate-y-16 rounded-full bg-brand-orange/5" />

      <div className="relative flex flex-col gap-6 p-6 sm:p-7 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex gap-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-orange/10">
            <Sparkles className="h-5 w-5 text-brand-orange" />
          </div>

          <div>
            <p className="text-[0.6rem] font-bold uppercase tracking-[0.12em] text-brand-orange">
              Need assistance?
            </p>

            <h2 className="mt-1 font-display text-xl font-bold tracking-[-0.03em] text-surface-fg">
              We're here to help.
            </h2>

            <p className="mt-1 max-w-2xl text-sm leading-6 text-surface-muted">
              If you have questions about your project, billing, agreements or anything else in your
              workspace, reach out to our team.
            </p>
          </div>
        </div>

        <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
          <Link
            to="/client/support/contact"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand-orange px-4 py-2.5 text-xs font-bold text-white"
          >
            <MessageSquare className="h-3.5 w-3.5" />
            Start a Conversation
          </Link>

          <a
            href="mailto:support@example.com"
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-surface-border bg-surface-bg px-4 py-2.5 text-xs font-bold text-surface-fg transition-colors hover:border-brand-orange hover:text-brand-orange"
          >
            <MailIcon />
            Email Support
          </a>
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   DOCUMENT CARD
============================================================ */

function DocumentCard({ document }) {
  const Icon = document.icon;

  return (
    <a
      href={document.href}
      className="group rounded-2xl border border-surface-border bg-surface-card p-5 transition-all duration-200 hover:-translate-y-px hover:border-surface-muted hover:shadow-[0_12px_30px_-24px_rgba(0,0,0,0.35)]"
    >
      <div className="flex gap-4">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-surface-bg transition-colors group-hover:bg-brand-orange/10">
          <Icon className="h-5 w-5 text-surface-muted transition-colors group-hover:text-brand-orange" />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-sm font-bold text-surface-fg">{document.title}</h3>

                {document.signed && (
                  <span className="flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-1 text-[0.5rem] font-bold text-emerald-600">
                    <CheckCircle2 className="h-3 w-3" />
                    Signed
                  </span>
                )}
              </div>

              <span className="mt-1 inline-block text-[0.6rem] font-semibold uppercase tracking-[0.06em] text-surface-muted">
                {document.category}
              </span>
            </div>

            <ArrowUpRight className="h-4 w-4 shrink-0 text-surface-muted transition-colors group-hover:text-brand-orange" />
          </div>

          <p className="mt-3 text-xs leading-5 text-surface-muted">{document.description}</p>

          <div className="mt-4 flex items-center justify-between">
            <span className="text-[0.6rem] font-medium text-surface-muted">{document.updated}</span>

            <span className="inline-flex items-center gap-1 text-[0.6rem] font-bold text-surface-muted group-hover:text-brand-orange">
              View Document
              <ChevronRight className="h-3 w-3" />
            </span>
          </div>
        </div>
      </div>
    </a>
  );
}

/* ============================================================
   AGREEMENT STATUS
============================================================ */

function AgreementStatus() {
  return (
    <section className="mt-10">
      <div className="mb-5">
        <h2 className="font-display text-lg font-bold tracking-[-0.02em] text-surface-fg">
          Engagement Status
        </h2>

        <p className="mt-1 text-sm text-surface-muted">
          Current status of your agreement and project documentation.
        </p>
      </div>

      <div className="overflow-hidden rounded-2xl border border-surface-border bg-surface-card">
        <div className="grid gap-0 md:grid-cols-3">
          <StatusItem
            icon={FileCheck2}
            label="Service Agreement"
            value="Signed"
            description="18 Jun 2026"
            status="success"
          />

          <StatusItem
            icon={ClipboardList}
            label="Client Brief"
            value="Confirmed"
            description="20 Jun 2026"
            status="success"
          />

          <StatusItem
            icon={ShieldCheck}
            label="Account Status"
            value="Active"
            description="No restrictions"
            status="success"
          />
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   STATUS ITEM
============================================================ */

function StatusItem({ icon: Icon, label, value, description, status }) {
  return (
    <div className="border-b border-surface-border p-5 last:border-b-0 md:border-b-0 md:border-r md:last:border-r-0">
      <div className="flex items-start gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10">
          <Icon className="h-4 w-4 text-emerald-600" />
        </div>

        <div>
          <p className="text-[0.6rem] font-bold uppercase tracking-[0.08em] text-surface-muted">
            {label}
          </p>

          <p className="mt-1 text-sm font-bold text-surface-fg">{value}</p>

          <p className="mt-0.5 text-[0.65rem] text-surface-muted">{description}</p>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   NEED HELP
============================================================ */

function NeedHelp() {
  return (
    <section className="mt-10 rounded-2xl border border-surface-border bg-surface-card p-6">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex gap-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-surface-bg">
            <HelpCircle className="h-5 w-5 text-surface-muted" />
          </div>

          <div>
            <h2 className="text-sm font-bold text-surface-fg">
              Can't find what you're looking for?
            </h2>

            <p className="mt-1 text-xs leading-5 text-surface-muted">
              Contact our support team for questions about your project, payments, agreements or
              account.
            </p>
          </div>
        </div>

        <Link
          to="/client/support/contact"
          className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl border border-surface-border px-4 py-2.5 text-xs font-bold text-surface-fg transition-colors hover:border-brand-orange hover:text-brand-orange"
        >
          Contact Support
          <ArrowUpRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </section>
  );
}

/* ============================================================
   MAIL ICON
============================================================ */

function MailIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className="h-3.5 w-3.5"
    >
      <rect width="20" height="16" x="2" y="4" rx="2" />

      <path d="m22 7-8.97 5.7a2 2 0 0 1-2.06 0L2 7" />
    </svg>
  );
}
