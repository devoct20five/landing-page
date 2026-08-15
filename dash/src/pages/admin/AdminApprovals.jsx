import { useMemo, useState } from "react";
import {
  Search,
  CheckCircle2,
  Clock3,
  XCircle,
  AlertTriangle,
  ArrowUpRight,
  UserCircle2,
  FolderKanban,
} from "lucide-react";

import {
  approvals,
  projects,
  clients,
} from "@/data/mockData";

import EmptyState from "@/components/shared/EmptyState";
import { cn } from "@/lib/utils";

const STATUS_FILTERS = [
  {
    id: "all",
    label: "All",
  },
  {
    id: "pending",
    label: "Pending",
  },
  {
    id: "approved",
    label: "Approved",
  },
  {
    id: "rejected",
    label: "Rejected",
  },
];

function getApprovalStatus(approval) {
  if (approval.status === "approved") {
    return {
      label: "Approved",
      className: "bg-emerald-500/10 text-emerald-600",
      icon: CheckCircle2,
    };
  }

  if (approval.status === "rejected") {
    return {
      label: "Rejected",
      className: "bg-red-500/10 text-red-600",
      icon: XCircle,
    };
  }

  return {
    label: "Pending",
    className: "bg-brand-orange/10 text-brand-orange",
    icon: Clock3,
  };
}

function ApprovalCard({ approval }) {
  const status = getApprovalStatus(approval);
  const StatusIcon = status.icon;

  return (
    <div className="brand-card transition-all duration-200 hover:-translate-y-0.5 hover:border-brand-orange/30">
      {/* HEADER */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex min-w-0 gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-orange/10 text-brand-orange">
            <CheckCircle2 className="h-5 w-5" />
          </div>

          <div className="min-w-0">
            <h2 className="truncate font-display text-base font-bold text-surface-fg">
              {approval.title ||
                approval.name ||
                "Approval Request"}
            </h2>

            <p className="mt-1 text-xs text-surface-muted">
              {approval.description ||
                "A new approval requires your attention."}
            </p>
          </div>
        </div>

        <span
          className={cn(
            "inline-flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 text-[0.65rem] font-semibold",
            status.className
          )}
        >
          <StatusIcon className="h-3 w-3" />
          {status.label}
        </span>
      </div>

      {/* PROJECT / CLIENT */}
      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <div className="rounded-xl bg-surface-muted/5 p-3">
          <div className="flex items-center gap-2 text-surface-muted">
            <FolderKanban className="h-3.5 w-3.5" />

            <span className="text-[0.65rem] font-semibold uppercase tracking-wide">
              Project
            </span>
          </div>

          <p className="mt-1.5 truncate text-sm font-semibold text-surface-fg">
            {approval.projectName || "Project"}
          </p>
        </div>

        <div className="rounded-xl bg-surface-muted/5 p-3">
          <div className="flex items-center gap-2 text-surface-muted">
            <UserCircle2 className="h-3.5 w-3.5" />

            <span className="text-[0.65rem] font-semibold uppercase tracking-wide">
              Client
            </span>
          </div>

          <p className="mt-1.5 truncate text-sm font-semibold text-surface-fg">
            {approval.clientName || "Client"}
          </p>
        </div>
      </div>

      {/* DETAILS */}
      <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-xs text-surface-muted">
        {approval.requestedBy && (
          <span>
            Requested by{" "}
            <strong className="font-semibold text-surface-fg">
              {approval.requestedBy}
            </strong>
          </span>
        )}

        {approval.createdAt && (
          <span>
            {approval.createdAt}
          </span>
        )}

        {approval.dueLabel && (
          <span
            className={cn(
              approval.dueLabel === "Overdue" &&
                "font-semibold text-red-600"
            )}
          >
            {approval.dueLabel}
          </span>
        )}
      </div>

      {/* FOOTER */}
      <div className="mt-5 flex items-center justify-between border-t border-surface-border pt-4">
        <div className="flex items-center gap-2">
          {approval.priority === "high" && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-red-500/10 px-2.5 py-1 text-[0.65rem] font-semibold text-red-600">
              <AlertTriangle className="h-3 w-3" />
              High Priority
            </span>
          )}
        </div>

        <button
          type="button"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-surface-fg transition hover:text-brand-orange"
        >
          Review
          <ArrowUpRight className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  description,
  attention = false,
}) {
  return (
    <div className="brand-card">
      <div className="flex items-center gap-2 text-surface-muted">
        <Icon
          className={cn(
            "h-4 w-4",
            attention && "text-brand-orange"
          )}
        />

        <span className="text-[0.65rem] font-semibold uppercase tracking-[0.14em]">
          {label}
        </span>
      </div>

      <p
        className={cn(
          "mt-3 font-display text-2xl font-bold",
          attention
            ? "text-brand-orange"
            : "text-surface-fg"
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

export default function AdminApprovals() {
  const [statusFilter, setStatusFilter] = useState("all");
  const [clientFilter, setClientFilter] = useState("all");
  const [projectFilter, setProjectFilter] = useState("all");
  const [search, setSearch] = useState("");

  const stats = useMemo(() => {
    const pending = approvals.filter(
      (approval) => approval.status === "pending"
    );

    const approved = approvals.filter(
      (approval) => approval.status === "approved"
    );

    const rejected = approvals.filter(
      (approval) => approval.status === "rejected"
    );

    return {
      total: approvals.length,
      pending: pending.length,
      approved: approved.length,
      rejected: rejected.length,
    };
  }, []);

  const filteredApprovals = useMemo(() => {
    const query = search.toLowerCase().trim();

    return approvals.filter((approval) => {
      const matchesStatus =
        statusFilter === "all" ||
        approval.status === statusFilter;

      const matchesClient =
        clientFilter === "all" ||
        approval.clientId === clientFilter;

      const matchesProject =
        projectFilter === "all" ||
        approval.projectId === projectFilter;

      const matchesSearch =
        !query ||
        approval.title
          ?.toLowerCase()
          .includes(query) ||
        approval.name
          ?.toLowerCase()
          .includes(query) ||
        approval.clientName
          ?.toLowerCase()
          .includes(query) ||
        approval.projectName
          ?.toLowerCase()
          .includes(query) ||
        approval.description
          ?.toLowerCase()
          .includes(query);

      return (
        matchesStatus &&
        matchesClient &&
        matchesProject &&
        matchesSearch
      );
    });
  }, [
    statusFilter,
    clientFilter,
    projectFilter,
    search,
  ]);

  return (
    <div className="mx-auto max-w-[1320px] animate-fade-up">
      {/* HEADER */}
      <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
      

          <h1 className="font-display text-display-md font-bold tracking-[-0.02em] text-surface-fg">
            Approvals
          </h1>

          <p className="mt-2 text-lead text-surface-muted">
            Review and manage approval requests across all clients
            and projects.
          </p>
        </div>

        <div className="text-sm text-surface-muted">
          <span className="font-semibold text-surface-fg">
            {stats.pending}
          </span>{" "}
          pending approval
          {stats.pending !== 1 ? "s" : ""}
        </div>
      </div>

      {/* STATS */}
      <div className="mb-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          icon={CheckCircle2}
          label="Total"
          value={stats.total}
          description="All approval requests"
        />

        <StatCard
          icon={Clock3}
          label="Pending"
          value={stats.pending}
          description="Waiting for review"
          attention
        />

        <StatCard
          icon={CheckCircle2}
          label="Approved"
          value={stats.approved}
          description="Successfully approved"
        />

        <StatCard
          icon={XCircle}
          label="Rejected"
          value={stats.rejected}
          description="Rejected requests"
        />
      </div>

      {/* FILTERS */}
      <div className="mb-7 flex flex-col gap-4">
        <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
          {/* STATUS */}
          <div className="flex flex-wrap gap-2">
            {STATUS_FILTERS.map((filter) => (
              <button
                key={filter.id}
                type="button"
                onClick={() =>
                  setStatusFilter(filter.id)
                }
                className={cn(
                  "pill",
                  statusFilter === filter.id &&
                    "pill-active"
                )}
              >
                {filter.label}

                {filter.id === "pending" &&
                  stats.pending > 0 && (
                    <span className="ml-1 rounded-full bg-brand-orange/10 px-1.5 py-0.5 text-[0.6rem]">
                      {stats.pending}
                    </span>
                  )}
              </button>
            ))}
          </div>

          {/* SEARCH */}
          <div className="relative w-full xl:w-[280px]">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-surface-muted" />

            <input
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              placeholder="Search approvals..."
              className="brand-input w-full pl-9"
            />
          </div>
        </div>

        {/* DROPDOWNS */}
        <div className="flex flex-col gap-3 sm:flex-row">
          <select
            value={clientFilter}
            onChange={(event) =>
              setClientFilter(event.target.value)
            }
            className="brand-input w-full py-2.5 text-sm sm:w-[220px]"
          >
            <option value="all">
              All Clients
            </option>

            {clients.map((client) => (
              <option
                key={client.id}
                value={client.id}
              >
                {client.name}
              </option>
            ))}
          </select>

          <select
            value={projectFilter}
            onChange={(event) =>
              setProjectFilter(event.target.value)
            }
            className="brand-input w-full py-2.5 text-sm sm:w-[240px]"
          >
            <option value="all">
              All Projects
            </option>

            {projects.map((project) => (
              <option
                key={project.id}
                value={project.id}
              >
                {project.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* RESULT COUNT */}
      <div className="mb-4 flex items-center justify-between">
        <p className="text-xs text-surface-muted">
          Showing{" "}
          <span className="font-semibold text-surface-fg">
            {filteredApprovals.length}
          </span>{" "}
          {filteredApprovals.length === 1
            ? "approval"
            : "approvals"}
        </p>
      </div>

      {/* CONTENT */}
      {filteredApprovals.length === 0 ? (
        <EmptyState
          title="No Approvals Found"
          description="Try changing the status, client, project, or search filter."
        />
      ) : (
        <div className="grid gap-5 lg:grid-cols-2">
          {filteredApprovals.map((approval) => (
            <ApprovalCard
              key={approval.id}
              approval={approval}
            />
          ))}
        </div>
      )}
    </div>
  );
}