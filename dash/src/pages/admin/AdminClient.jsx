import { useMemo, useState } from "react";
import {
  Search,
  ArrowUpRight,
  FolderKanban,
  CheckCircle2,
  ListChecks,
  AlertTriangle,
  Users,
} from "lucide-react";

import {
  clients,
  projects,
  tasks,
  approvals,
} from "@/data/mockData";

import EmptyState from "@/components/shared/EmptyState";
import { cn } from "@/lib/utils";

function getClientStats(clientId) {
  const clientProjects = projects.filter(
    (project) => project.clientId === clientId
  );

  const clientTasks = tasks.filter(
    (task) => task.clientId === clientId
  );

  const clientApprovals = approvals.filter(
    (approval) => approval.clientId === clientId
  );

  const activeProjects = clientProjects.filter(
    (project) => project.status !== "completed"
  );

  const completedProjects = clientProjects.filter(
    (project) => project.status === "completed"
  );

  const atRiskProjects = clientProjects.filter(
    (project) =>
      project.status === "blocked" ||
      Boolean(project.attentionReason)
  );

  const openTasks = clientTasks.filter(
    (task) =>
      task.status !== "completed" &&
      task.status !== "cancelled"
  );

  const overdueTasks = clientTasks.filter(
    (task) => task.dueLabel === "Overdue"
  );

  const pendingApprovals = clientApprovals.filter(
    (approval) => approval.status === "pending"
  );

  const averageProgress =
    activeProjects.length > 0
      ? Math.round(
          activeProjects.reduce(
            (sum, project) => sum + project.progress,
            0
          ) / activeProjects.length
        )
      : completedProjects.length > 0
        ? 100
        : 0;

  return {
    projects: clientProjects,
    activeProjects,
    completedProjects,
    atRiskProjects,
    tasks: clientTasks,
    openTasks,
    overdueTasks,
    approvals: clientApprovals,
    pendingApprovals,
    averageProgress,
  };
}

function getHealth(stats) {
  if (
    stats.atRiskProjects.length > 0 ||
    stats.overdueTasks.length > 0
  ) {
    return {
      label: "Needs Attention",
      className: "bg-red-500/10 text-red-600",
      dotClassName: "bg-red-500",
    };
  }

  if (stats.pendingApprovals.length > 0) {
    return {
      label: "Awaiting Client",
      className: "bg-brand-orange/10 text-brand-orange",
      dotClassName: "bg-brand-orange",
    };
  }

  return {
    label: "Healthy",
    className: "bg-emerald-500/10 text-emerald-700",
    dotClassName: "bg-emerald-500",
  };
}

function StatCard({
  icon: Icon,
  label,
  value,
  description,
}) {
  return (
    <div className="brand-card">
      <div className="flex items-center justify-between">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-orange/10 text-brand-orange">
          <Icon className="h-4 w-4" strokeWidth={2} />
        </div>
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

function ClientRow({ client }) {
  const stats = getClientStats(client.id);
  const health = getHealth(stats);

  return (
    <tr className="group border-b border-surface-border last:border-b-0">
      {/* Client */}
      <td className="px-6 py-5">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-orange/10 font-display text-xs font-bold text-brand-orange">
            {client.shortName?.slice(0, 2).toUpperCase()}
          </div>

          <div className="min-w-0">
            <p className="font-display text-sm font-bold text-surface-fg">
              {client.name}
            </p>

            <p className="mt-0.5 text-xs text-surface-muted">
              {client.shortName}
            </p>
          </div>
        </div>
      </td>

      {/* Projects */}
      <td className="py-5 pr-5">
        <div>
          <p className="text-sm font-semibold text-surface-fg">
            {stats.activeProjects.length}
          </p>

          <p className="mt-0.5 text-xs text-surface-muted">
            active
          </p>
        </div>
      </td>

      {/* Progress */}
      <td className="py-5 pr-5 min-w-[150px]">
        <div className="mb-2 flex items-center justify-between gap-3">
          <span className="text-xs text-surface-muted">
            Progress
          </span>

          <span className="text-xs font-semibold text-surface-fg">
            {stats.averageProgress}%
          </span>
        </div>

        <div className="h-1.5 overflow-hidden rounded-full bg-surface-border">
          <div
            className="h-full rounded-full bg-brand-orange"
            style={{
              width: `${stats.averageProgress}%`,
            }}
          />
        </div>
      </td>

      {/* Tasks */}
      <td className="py-5 pr-5">
        <div>
          <p className="text-sm font-semibold text-surface-fg">
            {stats.openTasks.length}
          </p>

          <p className="mt-0.5 text-xs text-surface-muted">
            open
          </p>
        </div>
      </td>

      {/* Approvals */}
      <td className="py-5 pr-5">
        <div>
          <p
            className={cn(
              "text-sm font-semibold",
              stats.pendingApprovals.length > 0
                ? "text-brand-orange"
                : "text-surface-fg"
            )}
          >
            {stats.pendingApprovals.length}
          </p>

          <p className="mt-0.5 text-xs text-surface-muted">
            pending
          </p>
        </div>
      </td>

      {/* Health */}
      <td className="py-5 pr-5">
        <span
          className={cn(
            "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[0.65rem] font-semibold",
            health.className
          )}
        >
          <span
            className={cn(
              "h-1.5 w-1.5 rounded-full",
              health.dotClassName
            )}
          />

          {health.label}
        </span>
      </td>

      {/* Action */}
      <td className="py-5 pr-6 text-right">
        <button
          type="button"
          className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-surface-muted transition hover:bg-surface-muted/10 hover:text-surface-fg"
          aria-label={`Open ${client.name}`}
        >
          <ArrowUpRight className="h-4 w-4" />
        </button>
      </td>
    </tr>
  );
}

export default function AdminClients() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  const portfolioStats = useMemo(() => {
    const stats = clients.map((client) =>
      getClientStats(client.id)
    );

    return {
      activeProjects: stats.reduce(
        (sum, item) => sum + item.activeProjects.length,
        0
      ),

      completedProjects: stats.reduce(
        (sum, item) => sum + item.completedProjects.length,
        0
      ),

      openTasks: stats.reduce(
        (sum, item) => sum + item.openTasks.length,
        0
      ),

      pendingApprovals: stats.reduce(
        (sum, item) => sum + item.pendingApprovals.length,
        0
      ),

      atRisk: stats.filter(
        (item) =>
          item.atRiskProjects.length > 0 ||
          item.overdueTasks.length > 0
      ).length,
    };
  }, []);

  const filteredClients = useMemo(() => {
    return clients.filter((client) => {
      const stats = getClientStats(client.id);

      const searchValue = search.toLowerCase();

      const matchesSearch =
        client.name.toLowerCase().includes(searchValue) ||
        client.shortName.toLowerCase().includes(searchValue);

      const matchesFilter =
        filter === "all"
          ? true
          : filter === "active"
            ? stats.activeProjects.length > 0
            : filter === "attention"
              ? stats.atRiskProjects.length > 0 ||
                stats.overdueTasks.length > 0
              : filter === "awaiting"
                ? stats.pendingApprovals.length > 0
                : true;

      return matchesSearch && matchesFilter;
    });
  }, [search, filter]);

  return (
    <div className="mx-auto max-w-[1400px] animate-fade-up">
      {/* Header */}
      <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
      

          <h1 className="font-display text-display-md font-bold tracking-[-0.02em] text-surface-fg">
            Clients
          </h1>

          <p className="mt-2 max-w-2xl text-lead text-surface-muted">
            Manage the client portfolio, monitor delivery health,
            and identify relationships that need attention.
          </p>
        </div>

        <div className="text-sm text-surface-muted">
          <span className="font-semibold text-surface-fg">
            {clients.length}
          </span>{" "}
          clients in portfolio
        </div>
      </div>

      {/* Portfolio Summary */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <StatCard
          icon={Users}
          label="Clients"
          value={clients.length}
          description="Total client accounts"
        />

        <StatCard
          icon={FolderKanban}
          label="Active Projects"
          value={portfolioStats.activeProjects}
          description="Currently in delivery"
        />

        <StatCard
          icon={ListChecks}
          label="Open Tasks"
          value={portfolioStats.openTasks}
          description="Across all clients"
        />

        <StatCard
          icon={CheckCircle2}
          label="Pending Approvals"
          value={portfolioStats.pendingApprovals}
          description="Waiting for decisions"
        />

        <StatCard
          icon={AlertTriangle}
          label="Needs Attention"
          value={portfolioStats.atRisk}
          description="Clients with active issues"
        />
      </div>

      {/* Controls */}
      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap gap-2">
          {[
            {
              id: "all",
              label: "All Clients",
            },
            {
              id: "active",
              label: "Active",
            },
            {
              id: "attention",
              label: "Needs Attention",
            },
            {
              id: "awaiting",
              label: "Awaiting Approval",
            },
          ].map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setFilter(item.id)}
              className={cn(
                "pill",
                filter === item.id && "pill-active"
              )}
            >
              {item.label}
            </button>
          ))}
        </div>

        <div className="relative w-full lg:w-[280px]">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-surface-muted" />

          <input
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
            placeholder="Search clients..."
            className="brand-input w-full pl-9"
          />
        </div>
      </div>

      {/* Client Table */}
      {filteredClients.length === 0 ? (
        <EmptyState
          title="No Clients Found"
          description="Try changing your search or client filter."
        />
      ) : (
        <div className="brand-card overflow-x-auto p-0">
          <table className="w-full min-w-[950px] border-collapse">
            <thead>
              <tr className="border-b border-surface-border text-left text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-surface-muted">
                <th className="px-6 py-4 font-semibold">
                  Client
                </th>

                <th className="py-4 pr-5 font-semibold">
                  Projects
                </th>

                <th className="py-4 pr-5 font-semibold">
                  Delivery
                </th>

                <th className="py-4 pr-5 font-semibold">
                  Tasks
                </th>

                <th className="py-4 pr-5 font-semibold">
                  Approvals
                </th>

                <th className="py-4 pr-5 font-semibold">
                  Health
                </th>

                <th className="py-4 pr-6" />
              </tr>
            </thead>

            <tbody>
              {filteredClients.map((client) => (
                <ClientRow
                  key={client.id}
                  client={client}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}