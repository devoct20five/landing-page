import {
  AlertCircle,
  ArrowUpRight,
  CheckCircle2,
  ChevronRight,
  Clock3,
  FileCheck2,
  FileText,
  HelpCircle,
  MessageSquare,
  Plus,
  Search,
  ShieldAlert,
  XCircle,
} from "lucide-react";
import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";

/* ============================================================
   MOCK DATA
============================================================ */

const queries = [
  {
    id: "query-001",
    reference: "QRY-2026-0041",
    subject: "Revision requested for homepage hero section",
    description:
      "The delivered hero section does not reflect the layout discussed in the latest approved brief.",
    project: "Website Redesign",
    category: "Deliverable",
    status: "open",
    priority: "normal",
    createdAt: "22 Aug 2026 · 10:42 AM",
    updatedAt: "22 Aug 2026 · 2:18 PM",
    replies: 3,
  },
  {
    id: "query-002",
    reference: "QRY-2026-0038",
    subject: "Invoice amount clarification",
    description:
      "Requesting clarification regarding the additional amount included in the August invoice.",
    project: "Summer Campaign 2026",
    category: "Billing",
    status: "awaiting_client",
    priority: "normal",
    createdAt: "19 Aug 2026 · 11:20 AM",
    updatedAt: "20 Aug 2026 · 4:10 PM",
    replies: 2,
  },
  {
    id: "query-003",
    reference: "QRY-2026-0029",
    subject: "Timeline concern for social assets",
    description:
      "Raised a concern regarding the delivery timeline for the remaining social media assets.",
    project: "Product Launch",
    category: "Timeline",
    status: "resolved",
    priority: "high",
    createdAt: "12 Aug 2026 · 9:05 AM",
    updatedAt: "15 Aug 2026 · 5:42 PM",
    replies: 6,
  },
];

/* ============================================================
   PAGE
============================================================ */

export default function ClientQueries() {
  const [activeTab, setActiveTab] = useState("queries");
  const [statusFilter, setStatusFilter] = useState("all");
  const [search, setSearch] = useState("");

  const filteredQueries = useMemo(() => {
    return queries.filter((query) => {
      const matchesStatus = statusFilter === "all" || query.status === statusFilter;

      const searchTerm = search.toLowerCase().trim();

      const matchesSearch =
        !searchTerm ||
        query.subject.toLowerCase().includes(searchTerm) ||
        query.reference.toLowerCase().includes(searchTerm) ||
        query.project.toLowerCase().includes(searchTerm);

      return matchesStatus && matchesSearch;
    });
  }, [statusFilter, search]);

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
                <ShieldAlert className="h-4 w-4 text-brand-orange" />

                <span className="text-[0.65rem] font-bold uppercase tracking-[0.16em] text-brand-orange">
                  Client Resolution
                </span>
              </div>

              <h1 className="font-display text-3xl font-bold tracking-[-0.04em] text-surface-fg sm:text-4xl">
                Queries & Conflicts
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-surface-muted">
                Raise questions, report concerns or formally escalate an issue relating to your
                project, deliverables, billing or agreement.
              </p>
            </div>

            <button
              onClick={() => setActiveTab("raise")}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand-orange px-5 py-3 text-xs font-bold text-white shadow-[0_10px_24px_-8px_rgba(255,90,31,0.5)] transition-all hover:-translate-y-px"
            >
              <Plus className="h-4 w-4" />
              Raise a Query
            </button>
          </div>
        </div>
      </div>

      {/* ======================================================
          CONTENT
      ====================================================== */}

      <main className="mx-auto max-w-7xl px-6 py-8 lg:px-8">
        {/* ==================================================
            INFORMATION BANNER
        ================================================== */}

        <InfoBanner />

        {/* ==================================================
            TABS
        ================================================== */}

        <div className="mt-8 border-b border-surface-border">
          <div className="flex gap-6">
            <Tab
              active={activeTab === "queries"}
              onClick={() => setActiveTab("queries")}
              label="My Queries"
              count={queries.filter((query) => query.status !== "resolved").length}
            />

            <Tab
              active={activeTab === "raise"}
              onClick={() => setActiveTab("raise")}
              label="Raise a Query"
            />
          </div>
        </div>

        {/* ==================================================
            QUERY LIST
        ================================================== */}

        {activeTab === "queries" && (
          <QueriesList
            queries={filteredQueries}
            search={search}
            setSearch={setSearch}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
          />
        )}

        {/* ==================================================
            RAISE QUERY
        ================================================== */}

        {activeTab === "raise" && <RaiseQueryForm onCancel={() => setActiveTab("queries")} />}
      </main>
    </div>
  );
}

/* ============================================================
   INFORMATION BANNER
============================================================ */

function InfoBanner() {
  return (
    <div className="rounded-2xl border border-brand-orange/20 bg-brand-orange/[0.04] p-5">
      <div className="flex gap-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-orange/10">
          <HelpCircle className="h-5 w-5 text-brand-orange" />
        </div>

        <div>
          <h2 className="text-sm font-bold text-surface-fg">Need help with something?</h2>

          <p className="mt-1 max-w-3xl text-xs leading-5 text-surface-muted">
            For general questions, use Support. Use this section when you need an issue formally
            recorded, require clarification about project work or want to raise a dispute regarding
            a deliverable, payment, timeline or agreement.
          </p>

          <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-[0.6rem] font-semibold text-surface-muted">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
              Every query gets a reference number
            </span>

            <span className="flex items-center gap-1.5">
              <Clock3 className="h-3.5 w-3.5 text-brand-orange" />
              Track responses in one place
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   TAB
============================================================ */

function Tab({ active, onClick, label, count }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "relative pb-3 text-xs font-bold transition-colors",
        active ? "text-brand-orange" : "text-surface-muted hover:text-surface-fg"
      )}
    >
      <span className="flex items-center gap-2">
        {label}

        {count !== undefined && (
          <span
            className={cn(
              "rounded-full px-1.5 py-0.5 text-[0.55rem]",
              active ? "bg-brand-orange/10 text-brand-orange" : "bg-surface-bg text-surface-muted"
            )}
          >
            {count}
          </span>
        )}
      </span>

      {active && (
        <span className="absolute bottom-[-1px] left-0 right-0 h-0.5 rounded-full bg-brand-orange" />
      )}
    </button>
  );
}

/* ============================================================
   QUERIES LIST
============================================================ */

function QueriesList({ queries, search, setSearch, statusFilter, setStatusFilter }) {
  return (
    <section className="pt-6">
      {/* FILTER BAR */}

      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-surface-muted" />

          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search queries..."
            className="w-full rounded-xl border border-surface-border bg-surface-card py-2.5 pl-9 pr-4 text-xs font-medium text-surface-fg outline-none placeholder:text-surface-muted focus:border-brand-orange/50"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(event) => setStatusFilter(event.target.value)}
          className="rounded-xl border border-surface-border bg-surface-card px-4 py-2.5 text-xs font-semibold text-surface-fg outline-none focus:border-brand-orange/50"
        >
          <option value="all">All statuses</option>
          <option value="open">Open</option>
          <option value="awaiting_client">Awaiting your response</option>
          <option value="resolved">Resolved</option>
        </select>
      </div>

      {/* LIST */}

      {queries.length > 0 ? (
        <div className="overflow-hidden rounded-2xl border border-surface-border bg-surface-card">
          {queries.map((query) => (
            <QueryRow key={query.id} query={query} />
          ))}
        </div>
      ) : (
        <EmptyQueries />
      )}
    </section>
  );
}

/* ============================================================
   QUERY ROW
============================================================ */

function QueryRow({ query }) {
  const status = getStatusConfig(query.status);

  return (
    <button className="group block w-full border-b border-surface-border px-5 py-5 text-left last:border-b-0 transition-colors hover:bg-surface-bg/50 sm:px-6">
      <div className="flex gap-4">
        {/* ICON */}

        <div className="hidden shrink-0 sm:block">
          <div
            className={cn(
              "flex h-10 w-10 items-center justify-center rounded-xl",
              status.iconBackground
            )}
          >
            <status.icon className={cn("h-5 w-5", status.iconColor)} />
          </div>
        </div>

        {/* CONTENT */}

        <div className="min-w-0 flex-1">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[0.6rem] font-bold uppercase tracking-[0.08em] text-surface-muted">
                  {query.reference}
                </span>

                <span
                  className={cn(
                    "rounded-full px-2 py-1 text-[0.55rem] font-bold",
                    status.badgeBackground,
                    status.badgeColor
                  )}
                >
                  {status.label}
                </span>

                {query.priority === "high" && (
                  <span className="rounded-full bg-red-500/10 px-2 py-1 text-[0.55rem] font-bold text-red-600">
                    High Priority
                  </span>
                )}
              </div>

              <h3 className="mt-2 text-sm font-bold text-surface-fg">{query.subject}</h3>

              <p className="mt-1 max-w-3xl text-xs leading-5 text-surface-muted">
                {query.description}
              </p>
            </div>

            <ChevronRight className="hidden h-4 w-4 shrink-0 text-surface-muted transition-transform group-hover:translate-x-0.5 group-hover:text-brand-orange sm:block" />
          </div>

          {/* META */}

          <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2">
            <span className="text-[0.6rem] font-semibold text-surface-muted">{query.project}</span>

            <span className="rounded-md bg-surface-bg px-2 py-1 text-[0.55rem] font-semibold text-surface-muted">
              {query.category}
            </span>

            <span className="flex items-center gap-1.5 text-[0.6rem] text-surface-muted">
              <MessageSquare className="h-3 w-3" />
              {query.replies} replies
            </span>

            <span className="text-[0.6rem] text-surface-muted">Updated {query.updatedAt}</span>
          </div>
        </div>
      </div>
    </button>
  );
}

/* ============================================================
   RAISE QUERY FORM
============================================================ */

function RaiseQueryForm({ onCancel }) {
  const [queryType, setQueryType] = useState("question");
  const [priority, setPriority] = useState("normal");

  return (
    <section className="mx-auto max-w-4xl pt-8">
      <div className="mb-6">
        <h2 className="font-display text-xl font-bold tracking-[-0.03em] text-surface-fg">
          Raise a Query or Conflict
        </h2>

        <p className="mt-1 text-sm leading-6 text-surface-muted">
          Provide enough information for our team to understand and resolve the issue without
          unnecessary back-and-forth.
        </p>
      </div>

      <div className="rounded-2xl border border-surface-border bg-surface-card">
        {/* FORM HEADER */}

        <div className="border-b border-surface-border px-6 py-5">
          <div className="flex gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand-orange/10">
              <ShieldAlert className="h-4 w-4 text-brand-orange" />
            </div>

            <div>
              <h3 className="text-sm font-bold text-surface-fg">Issue details</h3>

              <p className="mt-1 text-xs text-surface-muted">
                This submission will create a formal query with a unique reference number.
              </p>
            </div>
          </div>
        </div>

        {/* FORM */}

        <div className="space-y-6 p-6">
          {/* PROJECT */}

          <Field label="Project" required>
            <select className="form-input">
              <option value="">Select project</option>
              <option>Summer Campaign 2026</option>
              <option>Website Redesign</option>
              <option>Product Launch</option>
              <option>Social Content Retainer</option>
            </select>
          </Field>

          {/* QUERY TYPE */}

          <Field label="What is this regarding?" required>
            <div className="grid gap-3 sm:grid-cols-2">
              <TypeCard
                selected={queryType === "question"}
                onClick={() => setQueryType("question")}
                icon={HelpCircle}
                title="General Query"
                description="I need clarification or assistance."
              />

              <TypeCard
                selected={queryType === "deliverable"}
                onClick={() => setQueryType("deliverable")}
                icon={FileCheck2}
                title="Deliverable Issue"
                description="Something is incorrect or doesn't match the agreed scope."
              />

              <TypeCard
                selected={queryType === "billing"}
                onClick={() => setQueryType("billing")}
                icon={FileText}
                title="Billing / Payment"
                description="I have a concern about an invoice or payment."
              />

              <TypeCard
                selected={queryType === "conflict"}
                onClick={() => setQueryType("conflict")}
                icon={AlertCircle}
                title="Formal Conflict"
                description="I want to formally dispute an issue."
              />
            </div>
          </Field>

          {/* PRIORITY */}

          <Field label="Priority">
            <div className="flex flex-wrap gap-2">
              {["low", "normal", "high"].map((level) => (
                <button
                  key={level}
                  type="button"
                  onClick={() => setPriority(level)}
                  className={cn(
                    "rounded-xl border px-4 py-2.5 text-xs font-bold capitalize transition-colors",
                    priority === level
                      ? "border-brand-orange bg-brand-orange/10 text-brand-orange"
                      : "border-surface-border text-surface-muted hover:border-surface-muted"
                  )}
                >
                  {level}
                </button>
              ))}
            </div>
          </Field>

          {/* SUBJECT */}

          <Field label="Subject" required>
            <input placeholder="Briefly describe the issue" className="form-input" />
          </Field>

          {/* DESCRIPTION */}

          <Field
            label="Describe the issue"
            required
            description="Include relevant dates, deliverables, invoice numbers or previous discussions where applicable."
          >
            <textarea
              rows={7}
              placeholder="Explain what happened and what you would like us to review..."
              className="form-input resize-none"
            />
          </Field>

          {/* REFERENCE */}

          <Field
            label="Related reference"
            description="Optional — approval, invoice, task or file reference."
          >
            <input placeholder="e.g. INV-2026-006 or approval-001" className="form-input" />
          </Field>

          {/* ATTACHMENT */}

          <Field
            label="Supporting documents"
            description="Optional — attach screenshots, documents or other evidence relevant to your query."
          >
            <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-surface-border bg-surface-bg px-6 py-8 text-center transition-colors hover:border-brand-orange/50">
              <FileText className="h-5 w-5 text-surface-muted" />

              <p className="mt-2 text-xs font-bold text-surface-fg">Attach supporting files</p>

              <p className="mt-1 text-[0.6rem] text-surface-muted">
                PDF, JPG, PNG or common document formats
              </p>

              <input type="file" multiple className="hidden" />
            </label>
          </Field>

          {/* FORM NOTICE */}

          {queryType === "conflict" && (
            <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4">
              <div className="flex gap-3">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />

                <div>
                  <p className="text-xs font-bold text-surface-fg">Formal conflict submission</p>

                  <p className="mt-1 text-[0.65rem] leading-5 text-surface-muted">
                    Formal conflicts are recorded against your account and may be reviewed against
                    the applicable project brief, agreement, approvals, invoices and communication
                    history.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* ACTIONS */}

          <div className="flex flex-col-reverse gap-3 border-t border-surface-border pt-5 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onCancel}
              className="rounded-xl border border-surface-border px-5 py-3 text-xs font-bold text-surface-fg transition-colors hover:bg-surface-bg"
            >
              Cancel
            </button>

            <button
              type="button"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand-orange px-5 py-3 text-xs font-bold text-white shadow-[0_10px_24px_-8px_rgba(255,90,31,0.5)]"
            >
              Submit Query
              <ArrowUpRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   TYPE CARD
============================================================ */

function TypeCard({ selected, onClick, icon: Icon, title, description }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-xl border p-4 text-left transition-all",
        selected
          ? "border-brand-orange bg-brand-orange/[0.04]"
          : "border-surface-border hover:border-surface-muted"
      )}
    >
      <div className="flex gap-3">
        <div
          className={cn(
            "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg",
            selected ? "bg-brand-orange/10" : "bg-surface-bg"
          )}
        >
          <Icon className={cn("h-4 w-4", selected ? "text-brand-orange" : "text-surface-muted")} />
        </div>

        <div>
          <p className="text-xs font-bold text-surface-fg">{title}</p>

          <p className="mt-1 text-[0.6rem] leading-4 text-surface-muted">{description}</p>
        </div>
      </div>
    </button>
  );
}

/* ============================================================
   FIELD
============================================================ */

function Field({ label, required, description, children }) {
  return (
    <div>
      <label className="mb-2 block text-xs font-bold text-surface-fg">
        {label}

        {required && <span className="ml-1 text-brand-orange">*</span>}
      </label>

      {description && (
        <p className="mb-2 text-[0.6rem] leading-4 text-surface-muted">{description}</p>
      )}

      {children}
    </div>
  );
}

/* ============================================================
   EMPTY STATE
============================================================ */

function EmptyQueries() {
  return (
    <div className="rounded-2xl border border-dashed border-surface-border bg-surface-card px-6 py-16 text-center">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-surface-bg">
        <MessageSquare className="h-5 w-5 text-surface-muted" />
      </div>

      <h2 className="mt-4 font-display text-lg font-bold text-surface-fg">No queries found</h2>

      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-surface-muted">
        You don't have any queries matching the selected filters.
      </p>
    </div>
  );
}

/* ============================================================
   STATUS CONFIG
============================================================ */

function getStatusConfig(status) {
  const config = {
    open: {
      label: "Open",
      icon: Clock3,
      iconBackground: "bg-brand-orange/10",
      iconColor: "text-brand-orange",
      badgeBackground: "bg-brand-orange/10",
      badgeColor: "text-brand-orange",
    },

    awaiting_client: {
      label: "Awaiting Your Response",
      icon: MessageSquare,
      iconBackground: "bg-blue-500/10",
      iconColor: "text-blue-600",
      badgeBackground: "bg-blue-500/10",
      badgeColor: "text-blue-600",
    },

    resolved: {
      label: "Resolved",
      icon: CheckCircle2,
      iconBackground: "bg-emerald-500/10",
      iconColor: "text-emerald-600",
      badgeBackground: "bg-emerald-500/10",
      badgeColor: "text-emerald-600",
    },

    rejected: {
      label: "Closed",
      icon: XCircle,
      iconBackground: "bg-red-500/10",
      iconColor: "text-red-600",
      badgeBackground: "bg-red-500/10",
      badgeColor: "text-red-600",
    },
  };

  return config[status] || config.open;
}
