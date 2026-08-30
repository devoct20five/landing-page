import { useMemo, useState } from "react";
import {
  Search,
  ArrowUpRight,
  FolderKanban,
  CheckCircle2,
  Clock3,
  AlertTriangle,
} from "lucide-react";

import { clients, projects, tasks, approvals } from "@/data/mockData";

import EmptyState from "@/components/shared/EmptyState";
import { cn } from "@/lib/utils";

function getClientStats(clientId) {
  const clientProjects = projects.filter((project) => project.clientId === clientId);

  const clientTasks = tasks.filter((task) => task.clientId === clientId);

  const clientApprovals = approvals.filter((approval) => approval.clientId === clientId);

  const activeProjects = clientProjects.filter((project) => project.status !== "completed");

  const completedProjects = clientProjects.filter((project) => project.status === "completed");

  const blockedProjects = clientProjects.filter(
    (project) => project.status === "blocked" || Boolean(project.attentionReason)
  );

  const pendingApprovals = clientApprovals.filter((approval) => approval.status === "pending");

  const overdueTasks = clientTasks.filter((task) => task.dueLabel === "Overdue");

  return {
    projects: clientProjects,
    tasks: clientTasks,
    approvals: clientApprovals,
    activeProjects,
    completedProjects,
    blockedProjects,
    pendingApprovals,
    overdueTasks,
  };
}

function ClientCard({ client }) {
  const stats = getClientStats(client.id);

  const attentionCount =
    stats.blockedProjects.length + stats.pendingApprovals.length + stats.overdueTasks.length;

  const averageProgress =
    stats.activeProjects.length > 0
      ? Math.round(
          stats.activeProjects.reduce((sum, project) => sum + project.progress, 0) /
            stats.activeProjects.length
        )
      : 100;

  return (
    <div className="brand-card group transition-all duration-200 hover:-translate-y-0.5">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-orange/10 font-display text-sm font-bold text-brand-orange">
            {client.shortName?.slice(0, 2).toUpperCase()}
          </div>

          <div className="min-w-0">
            <h2 className="truncate font-display text-base font-bold tracking-[-0.01em] text-surface-fg">
              {client.name}
            </h2>

            <p className="mt-0.5 text-xs text-surface-muted">{client.shortName} · Client</p>
          </div>
        </div>

        <button
          type="button"
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-surface-border text-surface-muted transition-colors hover:bg-surface-muted/10 hover:text-surface-fg"
          aria-label={`Open ${client.name}`}
        >
          <ArrowUpRight className="h-4 w-4" />
        </button>
      </div>

      {/* Progress */}
      <div className="mt-6">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-surface-muted">
            Active Work
          </span>

          <span className="text-sm font-bold text-surface-fg">{averageProgress}%</span>
        </div>

        <div className="h-1.5 overflow-hidden rounded-full bg-surface-border">
          <div
            className="h-full rounded-full bg-brand-orange transition-all"
            style={{ width: `${averageProgress}%` }}
          />
        </div>
      </div>

      {/* Stats */}
      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="rounded-lg bg-surface-muted/5 p-3">
          <div className="flex items-center gap-1.5 text-surface-muted">
            <FolderKanban className="h-3.5 w-3.5" />
            <span className="text-[0.65rem] uppercase tracking-wide">Projects</span>
          </div>

          <p className="mt-1 text-lg font-bold text-surface-fg">{stats.activeProjects.length}</p>
        </div>

        <div className="rounded-lg bg-surface-muted/5 p-3">
          <div className="flex items-center gap-1.5 text-surface-muted">
            <Clock3 className="h-3.5 w-3.5" />
            <span className="text-[0.65rem] uppercase tracking-wide">Tasks</span>
          </div>

          <p className="mt-1 text-lg font-bold text-surface-fg">{stats.tasks.length}</p>
        </div>

        <div className="rounded-lg bg-surface-muted/5 p-3">
          <div className="flex items-center gap-1.5 text-surface-muted">
            <CheckCircle2 className="h-3.5 w-3.5" />
            <span className="text-[0.65rem] uppercase tracking-wide">Done</span>
          </div>

          <p className="mt-1 text-lg font-bold text-surface-fg">{stats.completedProjects.length}</p>
        </div>

        <div
          className={cn(
            "rounded-lg p-3",
            attentionCount > 0 ? "bg-brand-orange/5" : "bg-surface-muted/5"
          )}
        >
          <div className="flex items-center gap-1.5 text-surface-muted">
            <AlertTriangle className="h-3.5 w-3.5" />
            <span className="text-[0.65rem] uppercase tracking-wide">Attention</span>
          </div>

          <p
            className={cn(
              "mt-1 text-lg font-bold",
              attentionCount > 0 ? "text-brand-orange" : "text-surface-fg"
            )}
          >
            {attentionCount}
          </p>
        </div>
      </div>

      {/* Attention */}
      {attentionCount > 0 && (
        <div className="mt-5 border-t border-surface-border pt-4">
          <div className="flex items-center gap-2 text-xs font-semibold text-brand-orange">
            <AlertTriangle className="h-3.5 w-3.5" />
            Requires attention
          </div>

          <div className="mt-2 flex flex-wrap gap-2">
            {stats.blockedProjects.length > 0 && (
              <span className="rounded-full bg-red-500/10 px-2.5 py-1 text-[0.65rem] font-semibold text-red-600">
                {stats.blockedProjects.length} project
                {stats.blockedProjects.length !== 1 ? "s" : ""} at risk
              </span>
            )}

            {stats.pendingApprovals.length > 0 && (
              <span className="rounded-full bg-brand-orange/10 px-2.5 py-1 text-[0.65rem] font-semibold text-brand-orange">
                {stats.pendingApprovals.length} pending approval
                {stats.pendingApprovals.length !== 1 ? "s" : ""}
              </span>
            )}

            {stats.overdueTasks.length > 0 && (
              <span className="rounded-full bg-red-500/10 px-2.5 py-1 text-[0.65rem] font-semibold text-red-600">
                {stats.overdueTasks.length} overdue task
                {stats.overdueTasks.length !== 1 ? "s" : ""}
              </span>
            )}
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="mt-5 flex items-center justify-between border-t border-surface-border pt-4">
        <span className="text-xs text-surface-muted">
          {stats.projects.length} total project
          {stats.projects.length !== 1 ? "s" : ""}
        </span>

        <button
          type="button"
          className="text-xs font-semibold text-surface-fg transition-colors hover:text-brand-orange"
        >
          View client
        </button>
      </div>
    </div>
  );
}

export default function ClientList() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  const filteredClients = useMemo(() => {
    return clients.filter((client) => {
      const stats = getClientStats(client.id);

      const matchesSearch =
        client.name.toLowerCase().includes(search.toLowerCase()) ||
        client.shortName.toLowerCase().includes(search.toLowerCase());

      const matchesFilter =
        filter === "all"
          ? true
          : filter === "active"
            ? stats.activeProjects.length > 0
            : filter === "attention"
              ? stats.blockedProjects.length > 0 ||
                stats.pendingApprovals.length > 0 ||
                stats.overdueTasks.length > 0
              : filter === "completed"
                ? stats.activeProjects.length === 0 && stats.completedProjects.length > 0
                : true;

      return matchesSearch && matchesFilter;
    });
  }, [search, filter]);

  return (
    <div className="mx-auto max-w-[1320px] animate-fade-up">
      {/* Header */}
      <div className="mb-8 flex flex-col gap-6 sm:mb-9 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-display text-display-md font-bold tracking-[-0.02em] text-surface-fg">
            Clients
          </h1>

          <p className="mt-2 text-lead text-surface-muted">
            Manage client relationships and see everything currently being delivered for them.
          </p>
        </div>

        <div className="text-sm text-surface-muted">
          <span className="font-semibold text-surface-fg">{clients.length}</span> clients
        </div>
      </div>

      {/* Controls */}
      <div className="mb-7 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap gap-2">
          {[
            { id: "all", label: "All" },
            { id: "active", label: "Active" },
            { id: "attention", label: "Needs Attention" },
            { id: "completed", label: "Completed" },
          ].map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setFilter(item.id)}
              className={cn("pill", filter === item.id && "pill-active")}
            >
              {item.label}
            </button>
          ))}
        </div>

        <div className="relative w-full lg:w-[280px]">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-surface-muted" />

          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search clients..."
            className="brand-input w-full pl-9"
          />
        </div>
      </div>

      {/* Client Grid */}
      {filteredClients.length === 0 ? (
        <EmptyState
          title="No Clients Found"
          description="Try changing your search or client filter."
        />
      ) : (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {filteredClients.map((client) => (
            <ClientCard key={client.id} client={client} />
          ))}
        </div>
      )}
    </div>
  );
}
