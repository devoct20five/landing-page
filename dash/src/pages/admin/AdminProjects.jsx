import { useMemo, useState } from "react";
import {
  Search,
  FolderKanban,
  AlertTriangle,
  CheckCircle2,
  Clock3,
  Users,
  ArrowUpRight,
} from "lucide-react";

import {
  projects,
  clients,
  getClientById,
  getTeamMemberById,
} from "@/data/mockData";

import EmptyState from "@/components/shared/EmptyState";
import { cn } from "@/lib/utils";

const STATUS_FILTERS = [
  { id: "all", label: "All Projects" },
  { id: "active", label: "Active" },
  { id: "at-risk", label: "At Risk" },
  { id: "client-review", label: "Client Review" },
  { id: "completed", label: "Completed" },
];

const STATUS_CONFIG = {
  active: {
    label: "Active",
    className: "bg-blue-500/10 text-blue-700",
    dot: "bg-blue-500",
  },
  "in-progress": {
    label: "In Progress",
    className: "bg-blue-500/10 text-blue-700",
    dot: "bg-blue-500",
  },
  blocked: {
    label: "Blocked",
    className: "bg-red-500/10 text-red-600",
    dot: "bg-red-500",
  },
  "at-risk": {
    label: "At Risk",
    className: "bg-red-500/10 text-red-600",
    dot: "bg-red-500",
  },
  "client-review": {
    label: "Client Review",
    className: "bg-brand-orange/10 text-brand-orange",
    dot: "bg-brand-orange",
  },
  completed: {
    label: "Completed",
    className: "bg-emerald-500/10 text-emerald-700",
    dot: "bg-emerald-500",
  },
};

function getProjectStatus(project) {
  if (project.status === "completed") {
    return "completed";
  }

  if (
    project.status === "blocked" ||
    project.attentionReason
  ) {
    return "at-risk";
  }

  if (project.status === "client-review") {
    return "client-review";
  }

  return "active";
}

function StatusBadge({ project }) {
  const status = getProjectStatus(project);
  const config =
    STATUS_CONFIG[status] || STATUS_CONFIG.active;

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

function StatCard({
  icon: Icon,
  label,
  value,
  description,
  alert = false,
}) {
  return (
    <div className="brand-card">
      <div
        className={cn(
          "flex h-9 w-9 items-center justify-center rounded-lg",
          alert
            ? "bg-red-500/10 text-red-600"
            : "bg-brand-orange/10 text-brand-orange"
        )}
      >
        <Icon className="h-4 w-4" strokeWidth={2} />
      </div>

      <p className="mt-5 text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-surface-muted">
        {label}
      </p>

      <p
        className={cn(
          "mt-1 font-display text-2xl font-bold tracking-[-0.02em]",
          alert
            ? "text-red-600"
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

function ProjectRow({ project }) {
  const client = getClientById(project.clientId);

  const owner = project.ownerId
    ? getTeamMemberById(project.ownerId)
    : project.assigneeId
      ? getTeamMemberById(project.assigneeId)
      : null;

  const status = getProjectStatus(project);

  return (
    <tr className="group border-b border-surface-border last:border-b-0">
      {/* Project */}
      <td className="px-6 py-5">
        <div className="min-w-[230px]">
          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-orange/10 text-brand-orange">
              <FolderKanban
                className="h-4 w-4"
                strokeWidth={2}
              />
            </div>

            <div className="min-w-0">
              <p className="font-display text-sm font-bold text-surface-fg">
                {project.name}
              </p>

              {project.description && (
                <p className="mt-0.5 max-w-[280px] truncate text-xs text-surface-muted">
                  {project.description}
                </p>
              )}
            </div>
          </div>
        </div>
      </td>

      {/* Client */}
      <td className="py-5 pr-5">
        <div className="min-w-[130px]">
          <p className="text-sm font-semibold text-surface-fg">
            {client?.name || "—"}
          </p>

          {client?.shortName && (
            <p className="mt-0.5 text-xs text-surface-muted">
              {client.shortName}
            </p>
          )}
        </div>
      </td>

      {/* Progress */}
      <td className="py-5 pr-5">
        <div className="min-w-[140px]">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-xs text-surface-muted">
              Progress
            </span>

            <span className="text-xs font-bold text-surface-fg">
              {project.progress ?? 0}%
            </span>
          </div>

          <div className="h-1.5 overflow-hidden rounded-full bg-surface-border">
            <div
              className="h-full rounded-full bg-brand-orange transition-all"
              style={{
                width: `${Math.min(
                  100,
                  Math.max(0, project.progress ?? 0)
                )}%`,
              }}
            />
          </div>
        </div>
      </td>

      {/* Owner */}
      <td className="py-5 pr-5">
        {owner ? (
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-brand-orange/10 text-[0.6rem] font-bold text-brand-orange">
              {owner.initials}
            </div>

            <span className="text-xs font-medium text-surface-fg">
              {owner.name}
            </span>
          </div>
        ) : (
          <span className="text-xs text-surface-muted">
            Unassigned
          </span>
        )}
      </td>

      {/* Status */}
      <td className="py-5 pr-5">
        <StatusBadge project={project} />
      </td>

      {/* Deadline */}
      <td className="py-5 pr-5">
        <span
          className={cn(
            "text-xs font-semibold",
            project.deadlineStatus === "overdue"
              ? "text-red-600"
              : "text-surface-muted"
          )}
        >
          {project.deadline ||
            project.deadlineLabel ||
            project.dueLabel ||
            "—"}
        </span>
      </td>

      {/* Attention */}
      <td className="py-5 pr-5">
        {project.attentionReason ? (
          <div className="flex max-w-[180px] items-start gap-1.5 text-xs text-red-600">
            <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" />

            <span className="line-clamp-2">
              {project.attentionReason}
            </span>
          </div>
        ) : (
          <span className="text-xs text-surface-muted">
            —
          </span>
        )}
      </td>

      {/* Action */}
      <td className="py-5 pr-6 text-right">
        <button
          type="button"
          className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-surface-muted transition hover:bg-surface-muted/10 hover:text-surface-fg"
          aria-label={`Open ${project.name}`}
        >
          <ArrowUpRight className="h-4 w-4" />
        </button>
      </td>
    </tr>
  );
}

export default function AdminProjects() {
  const [statusFilter, setStatusFilter] = useState("all");
  const [clientFilter, setClientFilter] = useState("all");
  const [search, setSearch] = useState("");

  const portfolioStats = useMemo(() => {
    const active = projects.filter(
      (project) =>
        getProjectStatus(project) === "active"
    );

    const atRisk = projects.filter(
      (project) =>
        getProjectStatus(project) === "at-risk"
    );

    const clientReview = projects.filter(
      (project) =>
        getProjectStatus(project) === "client-review"
    );

    const completed = projects.filter(
      (project) =>
        getProjectStatus(project) === "completed"
    );

    const progressProjects = projects.filter(
      (project) =>
        getProjectStatus(project) !== "completed"
    );

    const averageProgress =
      progressProjects.length > 0
        ? Math.round(
            progressProjects.reduce(
              (sum, project) =>
                sum + (project.progress ?? 0),
              0
            ) / progressProjects.length
          )
        : 0;

    return {
      active: active.length,
      atRisk: atRisk.length,
      clientReview: clientReview.length,
      completed: completed.length,
      averageProgress,
    };
  }, []);

  const filteredProjects = useMemo(() => {
    const query = search.toLowerCase();

    return projects.filter((project) => {
      const client = getClientById(project.clientId);
      const status = getProjectStatus(project);

      const matchesSearch =
        project.name
          ?.toLowerCase()
          .includes(query) ||
        client?.name
          ?.toLowerCase()
          .includes(query);

      const matchesStatus =
        statusFilter === "all"
          ? true
          : statusFilter === statusFilter;

      const matchesClient =
        clientFilter === "all"
          ? true
          : project.clientId === clientFilter;

      return (
        matchesSearch &&
        matchesStatus &&
        matchesClient
      );
    });
  }, [
    search,
    statusFilter,
    clientFilter,
  ]);

  return (
    <div className="mx-auto max-w-[1500px] animate-fade-up">
      {/* Header */}
      <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
       

          <h1 className="font-display text-display-md font-bold tracking-[-0.02em] text-surface-fg">
            Projects
          </h1>

          <p className="mt-2 max-w-2xl text-lead text-surface-muted">
            Monitor the entire project portfolio, delivery health,
            ownership, and areas requiring management attention.
          </p>
        </div>

        <div className="text-sm text-surface-muted">
          <span className="font-semibold text-surface-fg">
            {projects.length}
          </span>{" "}
          projects in portfolio
        </div>
      </div>

      {/* Portfolio Stats */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <StatCard
          icon={FolderKanban}
          label="Total Projects"
          value={projects.length}
          description="Across all clients"
        />

        <StatCard
          icon={Clock3}
          label="Active"
          value={portfolioStats.active}
          description="Currently in delivery"
        />

        <StatCard
          icon={AlertTriangle}
          label="At Risk"
          value={portfolioStats.atRisk}
          description="Require intervention"
          alert={portfolioStats.atRisk > 0}
        />

        <StatCard
          icon={Users}
          label="Client Review"
          value={portfolioStats.clientReview}
          description="Waiting on client"
        />

        <StatCard
          icon={CheckCircle2}
          label="Completed"
          value={portfolioStats.completed}
          description={`${portfolioStats.averageProgress}% avg. active progress`}
        />
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-col gap-4">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          {/* Status */}
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
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="relative w-full lg:w-[280px]">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-surface-muted" />

            <input
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              placeholder="Search projects..."
              className="brand-input w-full pl-9"
            />
          </div>
        </div>

        {/* Client Filter */}
        <div className="flex items-center justify-between">
          <select
            value={clientFilter}
            onChange={(event) =>
              setClientFilter(event.target.value)
            }
            className="brand-input w-auto min-w-[190px] py-2.5 text-sm"
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

          <span className="text-xs text-surface-muted">
            Showing{" "}
            <span className="font-semibold text-surface-fg">
              {filteredProjects.length}
            </span>{" "}
            projects
          </span>
        </div>
      </div>

      {/* Projects */}
      {filteredProjects.length === 0 ? (
        <EmptyState
          title="No Projects Found"
          description="Try changing your search or project filters."
        />
      ) : (
        <div className="brand-card overflow-x-auto p-0">
          <table className="w-full min-w-[1200px] border-collapse">
            <thead>
              <tr className="border-b border-surface-border text-left text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-surface-muted">
                <th className="px-6 py-4">
                  Project
                </th>

                <th className="py-4 pr-5">
                  Client
                </th>

                <th className="py-4 pr-5">
                  Progress
                </th>

                <th className="py-4 pr-5">
                  Owner
                </th>

                <th className="py-4 pr-5">
                  Status
                </th>

                <th className="py-4 pr-5">
                  Deadline
                </th>

                <th className="py-4 pr-5">
                  Attention
                </th>

                <th className="py-4 pr-6" />
              </tr>
            </thead>

            <tbody>
              {filteredProjects.map((project) => (
                <ProjectRow
                  key={project.id}
                  project={project}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}