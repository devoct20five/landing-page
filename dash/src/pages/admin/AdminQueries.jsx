import {
  Search,
  MessageSquare,
  Clock3,
  CheckCircle2,
  AlertCircle,
  User,
  FolderKanban,
  ArrowUpRight,
  Filter,
  MoreHorizontal,
} from "lucide-react";

import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";

import {
  clients,
  projects,
  teamMembers,
} from "@/data/mockData";

const queries = [
  {
    id: "query-001",
    clientId: "client-001",
    clientName: "Acme Corporation",
    projectId: "project-001",
    projectName: "Summer Campaign 2026",
    subject: "Hero Film — Final Approval",
    message:
      "We have a few questions regarding the latest Hero Film version before approving it.",
    category: "Project",
    priority: "high",
    status: "open",
    assignedTo: "team-005",
    createdAt: "10 minutes ago",
    updatedAt: "10 minutes ago",
    responseTime: null,
  },
  {
    id: "query-002",
    clientId: "client-001",
    clientName: "Acme Corporation",
    projectId: "project-004",
    projectName: "Product Launch",
    subject: "Need clarification on 3D deliverables",
    message:
      "Can you confirm the final dimensions and delivery formats required for the 3D animation?",
    category: "3D",
    priority: "medium",
    status: "in-progress",
    assignedTo: "team-003",
    createdAt: "2 hours ago",
    updatedAt: "35 minutes ago",
    responseTime: "1h 25m",
  },
  {
    id: "query-003",
    clientId: "client-002",
    clientName: "XYZ Digital",
    projectId: "project-007",
    projectName: "Website Redesign",
    subject: "Homepage content update",
    message:
      "We would like to replace the headline and update the CTA copy on the homepage.",
    category: "Web",
    priority: "medium",
    status: "open",
    assignedTo: "team-004",
    createdAt: "3 hours ago",
    updatedAt: "3 hours ago",
    responseTime: null,
  },
  {
    id: "query-004",
    clientId: "client-003",
    clientName: "ABC Studios",
    projectId: "project-008",
    projectName: "Brand Film",
    subject: "Missing footage",
    message:
      "The remaining footage has been uploaded. Please confirm that everything is accessible.",
    category: "Assets",
    priority: "high",
    status: "resolved",
    assignedTo: "team-001",
    createdAt: "Yesterday",
    updatedAt: "Yesterday",
    responseTime: "42m",
  },
  {
    id: "query-005",
    clientId: "client-001",
    clientName: "Acme Corporation",
    projectId: "project-003",
    projectName: "Website Redesign",
    subject: "Website launch timeline",
    message:
      "Could we schedule a call to discuss the expected launch date?",
    category: "Timeline",
    priority: "low",
    status: "open",
    assignedTo: "team-005",
    createdAt: "Yesterday",
    updatedAt: "Yesterday",
    responseTime: null,
  },
  {
    id: "query-006",
    clientId: "client-002",
    clientName: "XYZ Digital",
    projectId: "project-007",
    projectName: "Website Redesign",
    subject: "Invoice clarification",
    message:
      "We need clarification regarding the latest invoice and payment milestone.",
    category: "Billing",
    priority: "high",
    status: "in-progress",
    assignedTo: "team-005",
    createdAt: "2 days ago",
    updatedAt: "4 hours ago",
    responseTime: "3h 12m",
  },
  {
    id: "query-007",
    clientId: "client-003",
    clientName: "ABC Studios",
    projectId: "project-009",
    projectName: "Product Animation",
    subject: "Lighting revision feedback",
    message:
      "We have added feedback to the latest product animation version.",
    category: "Feedback",
    priority: "medium",
    status: "resolved",
    assignedTo: "team-003",
    createdAt: "3 days ago",
    updatedAt: "2 days ago",
    responseTime: "1h 08m",
  },
  {
    id: "query-008",
    clientId: "client-001",
    clientName: "Acme Corporation",
    projectId: null,
    projectName: null,
    subject: "Schedule a project review call",
    message:
      "We would like to schedule a review call with the project team.",
    category: "Meeting",
    priority: "low",
    status: "resolved",
    assignedTo: "team-005",
    createdAt: "4 days ago",
    updatedAt: "3 days ago",
    responseTime: "28m",
  },
];

const statusConfig = {
  open: {
    label: "Open",
    className: "bg-brand-orange/10 text-brand-orange",
    icon: AlertCircle,
  },
  "in-progress": {
    label: "In Progress",
    className: "bg-blue-500/10 text-blue-600",
    icon: Clock3,
  },
  resolved: {
    label: "Resolved",
    className: "bg-emerald-500/10 text-emerald-600",
    icon: CheckCircle2,
  },
};

const priorityConfig = {
  high: {
    label: "High",
    className: "bg-red-500/10 text-red-600",
  },
  medium: {
    label: "Medium",
    className: "bg-amber-500/10 text-amber-600",
  },
  low: {
    label: "Low",
    className: "bg-surface-bg text-surface-muted",
  },
};

export default function AdminQueries() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [clientFilter, setClientFilter] = useState("all");

  const filteredQueries = useMemo(() => {
    const query = search.toLowerCase().trim();

    return queries.filter((item) => {
      const matchesSearch =
        !query ||
        item.subject.toLowerCase().includes(query) ||
        item.clientName.toLowerCase().includes(query) ||
        item.projectName?.toLowerCase().includes(query) ||
        item.category.toLowerCase().includes(query);

      const matchesStatus =
        statusFilter === "all" || item.status === statusFilter;

      const matchesPriority =
        priorityFilter === "all" ||
        item.priority === priorityFilter;

      const matchesClient =
        clientFilter === "all" ||
        item.clientId === clientFilter;

      return (
        matchesSearch &&
        matchesStatus &&
        matchesPriority &&
        matchesClient
      );
    });
  }, [
    search,
    statusFilter,
    priorityFilter,
    clientFilter,
  ]);

  const openCount = queries.filter(
    (item) => item.status === "open"
  ).length;

  const inProgressCount = queries.filter(
    (item) => item.status === "in-progress"
  ).length;

  const resolvedCount = queries.filter(
    (item) => item.status === "resolved"
  ).length;

  const highPriorityCount = queries.filter(
    (item) => item.priority === "high" && item.status !== "resolved"
  ).length;

  return (
    <div className="min-h-full bg-surface-bg">
      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="border-b border-surface-border">
        <div className="mx-auto max-w-7xl px-6 py-8 lg:px-8">
          <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
            <div>
        

              <h1 className="font-display text-3xl font-bold tracking-[-0.04em] text-surface-fg sm:text-4xl">
                Queries
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-surface-muted">
                Monitor client questions, requests and issues across
                all active projects.
              </p>
            </div>

    
          </div>
        </div>
      </div>

      {/* =====================================================
          CONTENT
      ===================================================== */}

      <div className="mx-auto max-w-7xl space-y-6 px-6 py-8 lg:px-8">
        {/* ===================================================
            STATS
        =================================================== */}

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            icon={MessageSquare}
            label="Open Queries"
            value={openCount}
            description="Waiting for response"
          />

          <StatCard
            icon={Clock3}
            label="In Progress"
            value={inProgressCount}
            description="Currently being handled"
          />

          <StatCard
            icon={CheckCircle2}
            label="Resolved"
            value={resolvedCount}
            description="Successfully closed"
          />

          <StatCard
            icon={AlertCircle}
            label="High Priority"
            value={highPriorityCount}
            description="Needs attention"
            danger
          />
        </div>

        {/* ===================================================
            FILTERS
        =================================================== */}

        <section className="rounded-2xl border border-surface-border bg-surface-card">
          <div className="flex flex-col gap-4 p-4 lg:flex-row lg:items-center">
            {/* Search */}

            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-surface-muted" />

              <input
                type="text"
                placeholder="Search queries, clients or projects..."
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
                className={cn(
                  "h-10 w-full rounded-xl border border-surface-border",
                  "bg-surface-bg pl-10 pr-4",
                  "text-sm text-surface-fg",
                  "outline-none placeholder:text-surface-muted",
                  "focus:border-brand-orange"
                )}
              />
            </div>

            {/* Filters */}

            <div className="flex flex-wrap items-center gap-2">
              <Filter className="mr-1 h-4 w-4 text-surface-muted" />

              <FilterSelect
                value={statusFilter}
                onChange={setStatusFilter}
                options={[
                  ["all", "All Status"],
                  ["open", "Open"],
                  ["in-progress", "In Progress"],
                  ["resolved", "Resolved"],
                ]}
              />

              <FilterSelect
                value={priorityFilter}
                onChange={setPriorityFilter}
                options={[
                  ["all", "All Priority"],
                  ["high", "High"],
                  ["medium", "Medium"],
                  ["low", "Low"],
                ]}
              />

              <FilterSelect
                value={clientFilter}
                onChange={setClientFilter}
                options={[
                  ["all", "All Clients"],
                  ...clients.map((client) => [
                    client.id,
                    client.shortName,
                  ]),
                ]}
              />
            </div>
          </div>
        </section>

        {/* ===================================================
            QUERY LIST
        =================================================== */}

        <section className="overflow-hidden rounded-2xl border border-surface-border bg-surface-card">
          {/* Header */}

          <div className="flex items-center justify-between border-b border-surface-border px-6 py-5">
            <div>
              <h2 className="font-display text-base font-bold tracking-[-0.02em] text-surface-fg">
                Client Queries
              </h2>

              <p className="mt-1 text-sm text-surface-muted">
                {filteredQueries.length} queries matching the
                current filters.
              </p>
            </div>
          </div>

          {/* Desktop table */}

          <div className="hidden overflow-x-auto lg:block">
            <table className="w-full">
              <thead>
                <tr className="border-b border-surface-border bg-surface-bg/50">
                  <TableHead>Query</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Project</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Assigned To</TableHead>
                  <TableHead>Updated</TableHead>
                  <TableHead />
                </tr>
              </thead>

              <tbody className="divide-y divide-surface-border">
                {filteredQueries.map((item) => (
                  <QueryTableRow
                    key={item.id}
                    query={item}
                  />
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile / tablet cards */}

          <div className="divide-y divide-surface-border lg:hidden">
            {filteredQueries.map((item) => (
              <QueryCard
                key={item.id}
                query={item}
              />
            ))}
          </div>

          {filteredQueries.length === 0 && (
            <EmptyState />
          )}
        </section>
      </div>
    </div>
  );
}

/* ============================================================
   TABLE ROW
============================================================ */

function QueryTableRow({ query }) {
  const assignedMember = teamMembers.find(
    (member) => member.id === query.assignedTo
  );

  const status = statusConfig[query.status];
  const priority = priorityConfig[query.priority];

  const StatusIcon = status.icon;

  return (
    <tr className="group transition-colors hover:bg-surface-bg/60">
      {/* Query */}

      <td className="px-6 py-5">
        <div className="flex min-w-[260px] items-start gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand-orange/10">
            <MessageSquare className="h-4 w-4 text-brand-orange" />
          </div>

          <div>
            <p className="text-sm font-bold text-surface-fg">
              {query.subject}
            </p>

            <p className="mt-1 line-clamp-1 max-w-[300px] text-xs text-surface-muted">
              {query.message}
            </p>

            <span className="mt-2 inline-block rounded-full bg-surface-bg px-2 py-1 text-[0.6rem] font-semibold text-surface-muted">
              {query.category}
            </span>
          </div>
        </div>
      </td>

      {/* Client */}

      <td className="px-6 py-5">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-surface-bg text-xs font-bold text-surface-muted">
            {query.clientName
              .slice(0, 2)
              .toUpperCase()}
          </div>

          <span className="whitespace-nowrap text-sm font-semibold text-surface-fg">
            {query.clientName}
          </span>
        </div>
      </td>

      {/* Project */}

      <td className="px-6 py-5">
        {query.projectName ? (
          <div className="flex items-center gap-2">
            <FolderKanban className="h-4 w-4 text-surface-muted" />

            <span className="max-w-[150px] truncate text-sm text-surface-fg">
              {query.projectName}
            </span>
          </div>
        ) : (
          <span className="text-xs text-surface-muted">
            General
          </span>
        )}
      </td>

      {/* Priority */}

      <td className="px-6 py-5">
        <span
          className={cn(
            "rounded-full px-2.5 py-1 text-[0.65rem] font-semibold",
            priority.className
          )}
        >
          {priority.label}
        </span>
      </td>

      {/* Status */}

      <td className="px-6 py-5">
        <span
          className={cn(
            "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[0.65rem] font-semibold",
            status.className
          )}
        >
          <StatusIcon className="h-3 w-3" />
          {status.label}
        </span>
      </td>

      {/* Assigned */}

      <td className="px-6 py-5">
        {assignedMember ? (
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-surface-bg text-[0.6rem] font-bold text-surface-muted">
              {assignedMember.initials}
            </div>

            <span className="whitespace-nowrap text-xs font-medium text-surface-fg">
              {assignedMember.name}
            </span>
          </div>
        ) : (
          <span className="text-xs text-surface-muted">
            Unassigned
          </span>
        )}
      </td>

      {/* Updated */}

      <td className="px-6 py-5">
        <span className="whitespace-nowrap text-xs text-surface-muted">
          {query.updatedAt}
        </span>
      </td>

      {/* Action */}

      <td className="px-6 py-5">
        <button className="flex h-8 w-8 items-center justify-center rounded-lg text-surface-muted transition hover:bg-surface-bg hover:text-surface-fg">
          <ArrowUpRight className="h-4 w-4" />
        </button>
      </td>
    </tr>
  );
}

/* ============================================================
   MOBILE QUERY CARD
============================================================ */

function QueryCard({ query }) {
  const assignedMember = teamMembers.find(
    (member) => member.id === query.assignedTo
  );

  const status = statusConfig[query.status];
  const priority = priorityConfig[query.priority];

  const StatusIcon = status.icon;

  return (
    <div className="space-y-4 p-5">
      <div className="flex items-start justify-between gap-4">
        <div className="flex gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand-orange/10">
            <MessageSquare className="h-4 w-4 text-brand-orange" />
          </div>

          <div>
            <h3 className="text-sm font-bold text-surface-fg">
              {query.subject}
            </h3>

            <p className="mt-1 text-xs text-surface-muted">
              {query.clientName}
            </p>
          </div>
        </div>

        <button className="text-surface-muted">
          <MoreHorizontal className="h-5 w-5" />
        </button>
      </div>

      <p className="text-sm leading-6 text-surface-muted">
        {query.message}
      </p>

      <div className="flex flex-wrap gap-2">
        <span
          className={cn(
            "rounded-full px-2.5 py-1 text-[0.65rem] font-semibold",
            priority.className
          )}
        >
          {priority.label} Priority
        </span>

        <span
          className={cn(
            "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[0.65rem] font-semibold",
            status.className
          )}
        >
          <StatusIcon className="h-3 w-3" />
          {status.label}
        </span>

        <span className="rounded-full bg-surface-bg px-2.5 py-1 text-[0.65rem] font-semibold text-surface-muted">
          {query.category}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-4 border-t border-surface-border pt-4">
        <div>
          <p className="text-[0.6rem] font-semibold uppercase tracking-[0.1em] text-surface-muted">
            Project
          </p>

          <p className="mt-1 truncate text-xs font-semibold text-surface-fg">
            {query.projectName || "General"}
          </p>
        </div>

        <div>
          <p className="text-[0.6rem] font-semibold uppercase tracking-[0.1em] text-surface-muted">
            Assigned To
          </p>

          <p className="mt-1 text-xs font-semibold text-surface-fg">
            {assignedMember?.name || "Unassigned"}
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <span className="text-xs text-surface-muted">
          Updated {query.updatedAt}
        </span>

        <button className="inline-flex items-center gap-1 text-xs font-semibold text-brand-orange hover:underline">
          Open Query
          <ArrowUpRight className="h-3 w-3" />
        </button>
      </div>
    </div>
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
  danger = false,
}) {
  return (
    <div className="rounded-2xl border border-surface-border bg-surface-card p-5">
      <div className="flex items-center justify-between">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-surface-bg">
          <Icon
            className={cn(
              "h-4 w-4",
              danger
                ? "text-red-500"
                : "text-brand-orange"
            )}
          />
        </div>

        {danger && (
          <span className="h-2 w-2 rounded-full bg-red-500" />
        )}
      </div>

      <p className="mt-4 text-xs font-medium text-surface-muted">
        {label}
      </p>

      <p className="mt-1 font-display text-2xl font-bold tracking-[-0.04em] text-surface-fg">
        {value}
      </p>

      <p className="mt-1 text-xs text-surface-muted">
        {description}
      </p>
    </div>
  );
}

/* ============================================================
   FILTER SELECT
============================================================ */

function FilterSelect({
  value,
  onChange,
  options,
}) {
  return (
    <select
      value={value}
      onChange={(event) =>
        onChange(event.target.value)
      }
      className={cn(
        "h-10 rounded-xl border border-surface-border",
        "bg-surface-bg px-3",
        "text-xs font-semibold text-surface-fg",
        "outline-none",
        "focus:border-brand-orange"
      )}
    >
      {options.map(([optionValue, label]) => (
        <option
          key={optionValue}
          value={optionValue}
        >
          {label}
        </option>
      ))}
    </select>
  );
}

/* ============================================================
   TABLE HEAD
============================================================ */

function TableHead({ children }) {
  return (
    <th className="px-6 py-3 text-left text-[0.65rem] font-semibold uppercase tracking-[0.1em] text-surface-muted">
      {children}
    </th>
  );
}

/* ============================================================
   EMPTY STATE
============================================================ */

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-surface-bg">
        <MessageSquare className="h-5 w-5 text-surface-muted" />
      </div>

      <h3 className="mt-4 text-sm font-bold text-surface-fg">
        No queries found
      </h3>

      <p className="mt-1 max-w-sm text-xs leading-5 text-surface-muted">
        Try changing your search or filters to find
        the query you're looking for.
      </p>
    </div>
  );
}