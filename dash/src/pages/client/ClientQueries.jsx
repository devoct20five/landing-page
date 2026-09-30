import {
  AlertCircle,
  ArrowUpRight,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock3,
  FileCheck2,
  FileText,
  HelpCircle,
  Mail,
  MessageSquare,
  Search,
  ShieldAlert,
  Star,
  Upload,
  User,
  Users,
} from "lucide-react";
import { useMemo, useState } from "react";

function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

/* ============================================================
   MOCK DATA
============================================================ */

const queries = [
  {
    id: "query-001",
    reference: "QRY-2026-0041",
    subject: "Revision requested for homepage hero section",
    project: "Website Redesign",
    category: "Deliverable",
    status: "open",
    updatedAt: "22 Aug 2026 · 2:18 PM",
    replies: 3,
  },
  {
    id: "query-002",
    reference: "QRY-2026-0038",
    subject: "Invoice amount clarification",
    project: "Summer Campaign",
    category: "Billing",
    status: "awaiting_client",
    updatedAt: "20 Aug 2026 · 4:10 PM",
    replies: 2,
  },
  {
    id: "query-003",
    reference: "QRY-2026-0035",
    subject: "Timeline extension request",
    project: "Brand Campaign",
    category: "Timeline",
    status: "open",
    updatedAt: "18 Aug 2026 · 11:32 AM",
    replies: 4,
  },
  {
    id: "query-004",
    reference: "QRY-2026-0031",
    subject: "Clarification on content guidelines",
    project: "Content Marketing",
    category: "Agreement",
    status: "resolved",
    updatedAt: "15 Aug 2026 · 6:05 PM",
    replies: 2,
  },
  {
    id: "query-005",
    reference: "QRY-2026-0029",
    subject: "Request to arrange a strategy meeting",
    project: "Website Redesign",
    category: "Meeting",
    status: "open",
    updatedAt: "12 Aug 2026 · 10:15 AM",
    replies: 1,
  },
];

const QUERY_TYPES = [
  { id: "deliverable", label: "Deliverable", icon: FileCheck2 },
  { id: "timeline", label: "Timeline", icon: Clock3 },
  { id: "billing", label: "Billing / Payment", icon: FileText },
  { id: "agreement", label: "Agreement", icon: ShieldAlert },
  { id: "meeting", label: "Meeting", icon: Users },
  { id: "other", label: "Other", icon: HelpCircle },
];

/* ============================================================
   PAGE
============================================================ */

export default function ClientQueries() {
  const [statusFilter, setStatusFilter] = useState("all");
  const [search, setSearch] = useState("");

  const filteredQueries = useMemo(() => {
    return queries.filter((query) => {
      const matchesStatus = statusFilter === "all" || query.status === statusFilter;
      const term = search.toLowerCase().trim();
      const matchesSearch =
        !term ||
        query.subject.toLowerCase().includes(term) ||
        query.reference.toLowerCase().includes(term) ||
        query.project.toLowerCase().includes(term);
      return matchesStatus && matchesSearch;
    });
  }, [statusFilter, search]);

  return (
    <div className="min-h-screen bg-slate-50 px-6 py-8">
      <div className="mx-auto max-w-[1180px]">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-[24px] font-bold tracking-[-0.01em] text-slate-900">
            Queries &amp; Conflicts
          </h1>
          <p className="mt-1.5 max-w-2xl text-[13px] leading-5 text-slate-500">
            Raise questions, concerns or issues related to your work with OCT2OFIVE — including
            projects, deliverables, timelines, billing and agreements.
          </p>
        </div>

        {/* Two-pane layout */}
        <div className="grid gap-6 lg:grid-cols-[1.1fr_1fr]">
          <QueriesList
            queries={filteredQueries}
            search={search}
            setSearch={setSearch}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
          />
          <RaiseQueryForm />
        </div>

        {/* Help footer */}
        <div className="mt-6 flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-5">
          <div className="flex items-start gap-3">
            <Star className="mt-0.5 h-4 w-4 text-amber-400" fill="currentColor" strokeWidth={0} />
            <div>
              <p className="text-[13px] font-semibold text-slate-900">Help us improve</p>
              <p className="text-[12.5px] text-slate-500">
                Have feedback about how Queries work? We&rsquo;d love to hear it.
              </p>
            </div>
          </div>
          <button className="shrink-0 text-[12.5px] font-semibold text-rose-600 hover:text-rose-700">
            Give Feedback <ArrowUpRight className="ml-0.5 inline h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   QUERIES LIST
============================================================ */

function QueriesList({ queries, search, setSearch, statusFilter, setStatusFilter }) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5">
      <h2 className="mb-4 text-[15px] font-semibold text-slate-900">Your Queries</h2>

      {/* Filter bar */}
      <div className="mb-4 flex flex-col gap-2.5 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search conversations..."
            className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-8 pr-3 text-[12.5px] text-slate-700 outline-none placeholder:text-slate-400 focus:border-rose-300"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-[12.5px] font-medium text-slate-600 outline-none focus:border-rose-300"
        >
          <option value="all">All Statuses</option>
          <option value="open">Open</option>
          <option value="awaiting_client">Awaiting Your Response</option>
          <option value="resolved">Resolved</option>
        </select>
      </div>

      {/* Rows */}
      <div className="divide-y divide-slate-100">
        {queries.length > 0 ? (
          queries.map((q) => <QueryRow key={q.id} query={q} />)
        ) : (
          <div className="py-14 text-center text-[13px] text-slate-400">
            No queries match the selected filters.
          </div>
        )}
      </div>

      {/* Pagination */}
      <div className="mt-4 flex items-center justify-between">
        <span className="text-[12px] text-slate-400">1–5 of 12 conversations</span>
        <div className="flex items-center gap-1">
          <button className="grid h-7 w-7 place-items-center rounded-md text-slate-300">
            <ChevronLeft className="h-3.5 w-3.5" />
          </button>
          {[1, 2, 3].map((n) => (
            <button
              key={n}
              className={cn(
                "grid h-7 w-7 place-items-center rounded-md text-[12px] font-semibold",
                n === 1 ? "bg-rose-50 text-rose-600" : "text-slate-500 hover:bg-slate-50"
              )}
            >
              {n}
            </button>
          ))}
          <button className="grid h-7 w-7 place-items-center rounded-md text-slate-400 hover:bg-slate-50">
            <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </section>
  );
}

const CATEGORY_ICON = {
  Deliverable: Mail,
  Timeline: Mail,
  Billing: MessageSquare,
  Agreement: CheckCircle2,
  Meeting: User,
};

function getStatusConfig(status) {
  const config = {
    open: { label: "Open", tint: "text-orange-500", bg: "bg-orange-50" },
    awaiting_client: { label: "Awaiting Your Response", tint: "text-sky-600", bg: "bg-sky-50" },
    resolved: { label: "Resolved", tint: "text-emerald-600", bg: "bg-emerald-50" },
  };
  return config[status] || config.open;
}

function QueryRow({ query }) {
  const status = getStatusConfig(query.status);
  const Icon = query.status === "resolved" ? CheckCircle2 : CATEGORY_ICON[query.category] || Mail;

  return (
    <button className="group flex w-full items-start gap-3 py-3.5 text-left">
      <div className={cn("mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-lg", status.bg)}>
        <Icon className={cn("h-4 w-4", status.tint)} />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[11px] font-semibold text-slate-400">{query.reference}</span>
          <span className={cn("text-[11px] font-semibold", status.tint)}>{status.label}</span>
        </div>
        <p className="mt-1 text-[13.5px] font-semibold leading-snug text-slate-900">
          {query.subject}
        </p>
        <p className="mt-0.5 text-[11.5px] text-slate-400">
          {query.project} · {query.category} · {query.replies}{" "}
          {query.replies === 1 ? "reply" : "replies"}
        </p>
        <p className="text-[11px] text-slate-300">Updated {query.updatedAt}</p>
      </div>
      <ChevronRight className="mt-1 hidden h-4 w-4 shrink-0 text-slate-300 group-hover:text-rose-500 sm:block" />
    </button>
  );
}

/* ============================================================
   RAISE QUERY FORM
============================================================ */

function RaiseQueryForm() {
  const [queryType, setQueryType] = useState("deliverable");
  const [description, setDescription] = useState("");

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5">
      <div className="mb-5 flex items-start gap-3">
        <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-rose-50">
          <HelpCircle className="h-4.5 w-4.5 text-rose-600" />
        </div>
        <div>
          <h2 className="text-[15px] font-semibold text-slate-900">Raise a Query</h2>
          <p className="mt-0.5 text-[12.5px] text-slate-500">
            Tell us what you need regarding your OCT2OFIVE engagement.
          </p>
        </div>
      </div>

      <div className="space-y-5">
        <Field label="Project" required>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
            <input
              placeholder="Search your projects..."
              className="w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-8 pr-3 text-[12.5px] text-slate-700 outline-none placeholder:text-slate-400 focus:border-rose-300"
            />
          </div>
        </Field>

        <Field label="What is this regarding?" required>
          <div className="grid grid-cols-2 gap-2">
            {QUERY_TYPES.map((t) => (
              <TypeButton
                key={t.id}
                icon={t.icon}
                label={t.label}
                selected={queryType === t.id}
                onClick={() => setQueryType(t.id)}
              />
            ))}
          </div>
          <button
            onClick={() => setQueryType("conflict")}
            className={cn(
              "mt-2 flex w-full items-center gap-2 rounded-lg border px-3 py-2.5 text-left text-[12.5px] font-semibold transition-colors",
              queryType === "conflict"
                ? "border-rose-300 bg-rose-50 text-rose-600"
                : "border-slate-200 text-slate-600 hover:border-slate-300"
            )}
          >
            <AlertCircle className="h-4 w-4" />
            Formal Conflict
          </button>
        </Field>

        <Field label="What do you need?" required>
          <div className="relative">
            <textarea
              rows={4}
              maxLength={2000}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Explain what happened or what you would like us to address..."
              className="w-full resize-none rounded-lg border border-slate-200 bg-white p-3 text-[12.5px] text-slate-700 outline-none placeholder:text-slate-400 focus:border-rose-300"
            />
            <span className="pointer-events-none absolute bottom-2 right-3 text-[10.5px] text-slate-300">
              {description.length}/2000
            </span>
          </div>
        </Field>

        <Field label="Add supporting files" optional>
          <label className="flex cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed border-slate-200 bg-slate-50 px-4 py-6 text-center hover:border-rose-300">
            <Upload className="h-4.5 w-4.5 text-slate-400" />
            <p className="mt-1.5 text-[12px] text-slate-500">
              <span className="font-semibold text-slate-700">Click to upload</span> or drag and drop
            </p>
            <p className="mt-0.5 text-[10.5px] text-slate-400">PDF, JPG, PNG up to 10MB</p>
            <input type="file" multiple className="hidden" />
          </label>
        </Field>

        <div className="flex items-center justify-between border-t border-slate-100 pt-4">
          <p className="text-[11.5px] text-slate-400">
            Can&rsquo;t find what you&rsquo;re looking for?
          </p>
          <button className="text-[12px] font-semibold text-rose-600 hover:text-rose-700">
            Contact Us <ArrowUpRight className="ml-0.5 inline h-3.5 w-3.5" />
          </button>
        </div>

        <div className="flex justify-end gap-2.5">
          <button className="rounded-lg border border-slate-200 px-4 py-2.5 text-[12.5px] font-semibold text-slate-600 hover:bg-slate-50">
            Cancel
          </button>
          <button className="inline-flex items-center gap-1.5 rounded-lg bg-rose-600 px-4 py-2.5 text-[12.5px] font-semibold text-white hover:bg-rose-700">
            Submit Query
          </button>
        </div>
      </div>
    </section>
  );
}

function TypeButton({ icon: Icon, label, selected, onClick }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex items-center gap-2 rounded-lg border px-3 py-2.5 text-left text-[12px] font-semibold transition-colors",
        selected
          ? "border-rose-300 bg-rose-50 text-rose-600"
          : "border-slate-200 text-slate-600 hover:border-slate-300"
      )}
    >
      <Icon className="h-4 w-4 shrink-0" />
      <span className="truncate">{label}</span>
    </button>
  );
}

function Field({ label, required, optional, children }) {
  return (
    <div>
      <label className="mb-1.5 block text-[12.5px] font-semibold text-slate-800">
        {label}
        {required && <span className="ml-1 text-rose-500">*</span>}
        {optional && <span className="ml-1 font-normal text-slate-400">(Optional)</span>}
      </label>
      {children}
    </div>
  );
}
