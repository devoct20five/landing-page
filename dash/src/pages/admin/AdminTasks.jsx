import {
  CheckCircle2,
  Clock3,
  AlertTriangle,
  CircleDot,
  Users,
  TrendingUp,
  TrendingDown,
  Filter,
  Search,
  ArrowUpRight,
  MoreHorizontal,
} from "lucide-react";

import { cn } from "@/lib/utils";
import {
  tasks,
  projects,
  teamMembers,
  clients,
  getProjectById,
  getTeamMemberById,
  getClientById,
} from "@/data/mockData";

const statusConfig = {
  "in-progress": {
    label: "In Progress",
    className:
      "bg-blue-500/10 text-blue-600 dark:text-blue-400",
  },
  "client-review": {
    label: "Client Review",
    className:
      "bg-purple-500/10 text-purple-600 dark:text-purple-400",
  },
  blocked: {
    label: "Blocked",
    className:
      "bg-red-500/10 text-red-600 dark:text-red-400",
  },
  planned: {
    label: "Planned",
    className:
      "bg-slate-500/10 text-slate-600 dark:text-slate-400",
  },
  "not-started": {
    label: "Not Started",
    className:
      "bg-slate-500/10 text-slate-600 dark:text-slate-400",
  },
};

const priorityConfig = {
  high: {
    label: "High",
    className: "text-red-500",
  },
  medium: {
    label: "Medium",
    className: "text-amber-500",
  },
  low: {
    label: "Low",
    className: "text-slate-400",
  },
};

function StatCard({
  label,
  value,
  description,
  icon: Icon,
  trend,
  trendUp,
}) {
  return (
    <div className="rounded-2xl border border-surface-border bg-surface p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-surface-muted">
            {label}
          </p>

          <p className="mt-2 font-display text-3xl font-bold tracking-tight text-surface-fg">
            {value}
          </p>

          <div className="mt-2 flex items-center gap-2 text-xs">
            {trend && (
              <span
                className={cn(
                  "flex items-center gap-1 font-semibold",
                  trendUp ? "text-emerald-500" : "text-red-500"
                )}
              >
                {trendUp ? (
                  <TrendingUp className="h-3.5 w-3.5" />
                ) : (
                  <TrendingDown className="h-3.5 w-3.5" />
                )}
                {trend}
              </span>
            )}

            <span className="text-surface-muted">
              {description}
            </span>
          </div>
        </div>

        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-orange/10 text-brand-orange">
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
}

function Avatar({ member }) {
  return (
    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-surface-muted/15 text-xs font-semibold text-surface-fg">
      {member?.initials || "?"}
    </div>
  );
}

function getTaskPerformance(memberId) {
  const memberTasks = tasks.filter(
    (task) => task.assigneeId === memberId
  );

  const completed = memberTasks.filter(
    (task) =>
      task.status === "completed" ||
      task.status === "client-review"
  ).length;

  const overdue = memberTasks.filter(
    (task) => task.dueLabel === "Overdue"
  ).length;

  const blocked = memberTasks.filter(
    (task) => task.status === "blocked"
  ).length;

  const active = memberTasks.filter(
    (task) =>
      task.status === "in-progress" ||
      task.status === "planned" ||
      task.status === "not-started"
  ).length;

  // Mock performance calculation until actual completion timestamps exist.
  const completionRate =
    memberTasks.length > 0
      ? Math.round(
          ((memberTasks.length - overdue) / memberTasks.length) * 100
        )
      : 100;

  return {
    total: memberTasks.length,
    completed,
    overdue,
    blocked,
    active,
    completionRate,
  };
}

export default function AdminTasks() {
  const totalTasks = tasks.length;

  const activeTasks = tasks.filter(
    (task) =>
      task.status === "in-progress" ||
      task.status === "planned" ||
      task.status === "not-started"
  ).length;

  const overdueTasks = tasks.filter(
    (task) => task.dueLabel === "Overdue"
  );

  const blockedTasks = tasks.filter(
    (task) => task.status === "blocked"
  );

  const reviewTasks = tasks.filter(
    (task) => task.status === "client-review"
  );

  const dueToday = tasks.filter(
    (task) => task.dueLabel === "Due Today"
  ).length;

  const teamPerformance = teamMembers
    .map((member) => ({
      member,
      ...getTaskPerformance(member.id),
    }))
    .sort((a, b) => b.total - a.total);

  return (
    <div className="space-y-8 pb-10">

      {/* =====================================================
          HEADER
      ====================================================== */}

      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
       

          <h1 className="font-display text-3xl font-bold tracking-tight text-surface-fg">
            Tasks
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-surface-muted">
            Monitor workload, completion performance and delays
            across the entire team.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 rounded-xl border border-surface-border bg-surface px-4 py-2.5 text-sm font-medium text-surface-fg transition hover:bg-surface-muted/10">
            <Filter className="h-4 w-4" />
            Filters
          </button>

          <button className="flex items-center gap-2 rounded-xl bg-brand-orange px-4 py-2.5 text-sm font-semibold text-white shadow-[0_10px_24px_-8px_rgba(255,90,31,0.45)]">
            View all tasks
            <ArrowUpRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* =====================================================
          OVERVIEW
      ====================================================== */}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">

        <StatCard
          label="Total Tasks"
          value={totalTasks}
          description="across all projects"
          icon={CircleDot}
        />

        <StatCard
          label="Active Tasks"
          value={activeTasks}
          description="currently being worked on"
          icon={Clock3}
          trend="+8%"
          trendUp
        />

        <StatCard
          label="Due Today"
          value={dueToday}
          description="need attention today"
          icon={AlertTriangle}
        />

        <StatCard
          label="Overdue"
          value={overdueTasks.length}
          description="past their due date"
          icon={AlertTriangle}
          trend="+2"
          trendUp={false}
        />
      </div>

      {/* =====================================================
          TEAM PERFORMANCE
      ====================================================== */}

      <section className="rounded-2xl border border-surface-border bg-surface">

        <div className="flex flex-col gap-3 border-b border-surface-border p-5 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="font-display text-lg font-bold text-surface-fg">
              Team Performance
            </h2>

            <p className="mt-1 text-sm text-surface-muted">
              Task ownership and completion health by team member.
            </p>
          </div>

          <div className="flex items-center gap-2 rounded-lg bg-surface-muted/10 px-3 py-2 text-xs font-medium text-surface-muted">
            <Users className="h-3.5 w-3.5" />
            {teamMembers.length} team members
          </div>
        </div>

        <div className="divide-y divide-surface-border">

          {teamPerformance.map(
            ({
              member,
              total,
              completed,
              overdue,
              blocked,
              active,
              completionRate,
            }) => (
              <div
                key={member.id}
                className="grid gap-5 p-5 transition hover:bg-surface-muted/5 lg:grid-cols-[2fr_1fr_1fr_1fr_1fr]"
              >

                {/* Person */}

                <div className="flex items-center gap-3">
                  <Avatar member={member} />

                  <div>
                    <p className="text-sm font-semibold text-surface-fg">
                      {member.name}
                    </p>

                    <p className="mt-0.5 text-xs text-surface-muted">
                      {member.role}
                    </p>
                  </div>
                </div>

                {/* Assigned */}

                <div>
                  <p className="text-xs text-surface-muted">
                    Assigned
                  </p>

                  <p className="mt-1 text-sm font-semibold text-surface-fg">
                    {total}
                  </p>
                </div>

                {/* Active */}

                <div>
                  <p className="text-xs text-surface-muted">
                    Active
                  </p>

                  <p className="mt-1 text-sm font-semibold text-surface-fg">
                    {active}
                  </p>
                </div>

                {/* Delayed */}

                <div>
                  <p className="text-xs text-surface-muted">
                    Delayed
                  </p>

                  <div className="mt-1 flex items-center gap-2">
                    <span
                      className={cn(
                        "text-sm font-semibold",
                        overdue > 0
                          ? "text-red-500"
                          : "text-surface-fg"
                      )}
                    >
                      {overdue}
                    </span>

                    {blocked > 0 && (
                      <span className="rounded-full bg-red-500/10 px-2 py-0.5 text-[10px] font-semibold text-red-500">
                        {blocked} blocked
                      </span>
                    )}
                  </div>
                </div>

                {/* Completion */}

                <div>
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-surface-muted">
                      On-time
                    </p>

                    <span
                      className={cn(
                        "text-xs font-bold",
                        completionRate >= 80
                          ? "text-emerald-500"
                          : completionRate >= 60
                            ? "text-amber-500"
                            : "text-red-500"
                      )}
                    >
                      {completionRate}%
                    </span>
                  </div>

                  <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-surface-muted/15">
                    <div
                      className="h-full rounded-full bg-brand-orange transition-all"
                      style={{
                        width: `${completionRate}%`,
                      }}
                    />
                  </div>
                </div>
              </div>
            )
          )}

        </div>
      </section>

      {/* =====================================================
          DELAYS + WORKLOAD
      ====================================================== */}

      <div className="grid gap-6 xl:grid-cols-2">

        {/* Delayed Tasks */}

        <section className="rounded-2xl border border-surface-border bg-surface">

          <div className="flex items-center justify-between border-b border-surface-border p-5">
            <div>
              <h2 className="font-display text-lg font-bold text-surface-fg">
                Delayed Tasks
              </h2>

              <p className="mt-1 text-sm text-surface-muted">
                Tasks currently affecting delivery timelines.
              </p>
            </div>

            <span className="rounded-full bg-red-500/10 px-2.5 py-1 text-xs font-semibold text-red-500">
              {overdueTasks.length}
            </span>
          </div>

          <div className="divide-y divide-surface-border">

            {overdueTasks.length === 0 ? (
              <div className="p-8 text-center">
                <CheckCircle2 className="mx-auto h-8 w-8 text-emerald-500" />
                <p className="mt-3 text-sm font-semibold text-surface-fg">
                  Nothing overdue
                </p>
              </div>
            ) : (
              overdueTasks.map((task) => {
                const member = getTeamMemberById(task.assigneeId);
                const project = getProjectById(task.projectId);
                const client = getClientById(task.clientId);

                return (
                  <div
                    key={task.id}
                    className="p-5 transition hover:bg-surface-muted/5"
                  >
                    <div className="flex items-start justify-between gap-4">

                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <AlertTriangle className="h-4 w-4 shrink-0 text-red-500" />

                          <p className="truncate text-sm font-semibold text-surface-fg">
                            {task.title}
                          </p>
                        </div>

                        <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-surface-muted">
                          <span>{project?.name}</span>
                          <span>•</span>
                          <span>{client?.name}</span>
                        </div>
                      </div>

                      <button className="shrink-0 text-surface-muted hover:text-surface-fg">
                        <MoreHorizontal className="h-4 w-4" />
                      </button>
                    </div>

                    <div className="mt-4 flex items-center justify-between">

                      <div className="flex items-center gap-2">
                        <Avatar member={member} />

                        <div>
                          <p className="text-xs font-medium text-surface-fg">
                            {member?.name}
                          </p>

                          <p className="text-[11px] text-surface-muted">
                            {task.service}
                          </p>
                        </div>
                      </div>

                      <span className="rounded-full bg-red-500/10 px-2.5 py-1 text-[11px] font-semibold text-red-500">
                        {task.dueLabel}
                      </span>

                    </div>
                  </div>
                );
              })
            )}

          </div>
        </section>

        {/* Workload */}

        <section className="rounded-2xl border border-surface-border bg-surface">

          <div className="border-b border-surface-border p-5">
            <h2 className="font-display text-lg font-bold text-surface-fg">
              Current Workload
            </h2>

            <p className="mt-1 text-sm text-surface-muted">
              Active task distribution across the team.
            </p>
          </div>

          <div className="space-y-5 p-5">

            {teamPerformance.map(
              ({ member, total, active, overdue }) => {

                const maxTasks = Math.max(
                  ...teamPerformance.map((item) => item.total),
                  1
                );

                const percentage = Math.round(
                  (total / maxTasks) * 100
                );

                return (
                  <div key={member.id}>

                    <div className="flex items-center justify-between">

                      <div className="flex items-center gap-3">
                        <Avatar member={member} />

                        <div>
                          <p className="text-sm font-medium text-surface-fg">
                            {member.name}
                          </p>

                          <p className="text-xs text-surface-muted">
                            {active} active
                          </p>
                        </div>
                      </div>

                      <div className="text-right">
                        <p className="text-sm font-bold text-surface-fg">
                          {total}
                        </p>

                        <p className="text-[11px] text-surface-muted">
                          tasks
                        </p>
                      </div>

                    </div>

                    <div className="mt-3 h-2 overflow-hidden rounded-full bg-surface-muted/10">
                      <div
                        className="h-full rounded-full bg-brand-orange"
                        style={{
                          width: `${percentage}%`,
                        }}
                      />
                    </div>

                    {overdue > 0 && (
                      <div className="mt-2 flex items-center gap-1 text-[11px] font-medium text-red-500">
                        <AlertTriangle className="h-3 w-3" />
                        {overdue} overdue
                      </div>
                    )}

                  </div>
                );
              }
            )}

          </div>
        </section>
      </div>

      {/* =====================================================
          ALL TASKS
      ====================================================== */}

      <section className="rounded-2xl border border-surface-border bg-surface">

        <div className="flex flex-col gap-4 border-b border-surface-border p-5 md:flex-row md:items-center md:justify-between">

          <div>
            <h2 className="font-display text-lg font-bold text-surface-fg">
              Task Overview
            </h2>

            <p className="mt-1 text-sm text-surface-muted">
              Every task currently tracked by the agency.
            </p>
          </div>

          <div className="flex items-center gap-2 rounded-xl border border-surface-border px-3 py-2">
            <Search className="h-4 w-4 text-surface-muted" />

            <input
              placeholder="Search tasks..."
              className="w-40 bg-transparent text-sm outline-none placeholder:text-surface-muted"
            />
          </div>

        </div>

        <div className="overflow-x-auto">

          <table className="w-full min-w-[900px]">

            <thead>
              <tr className="border-b border-surface-border text-left">

                <th className="px-5 py-3 text-[11px] font-semibold uppercase tracking-wider text-surface-muted">
                  Task
                </th>

                <th className="px-5 py-3 text-[11px] font-semibold uppercase tracking-wider text-surface-muted">
                  Project
                </th>

                <th className="px-5 py-3 text-[11px] font-semibold uppercase tracking-wider text-surface-muted">
                  Assignee
                </th>

                <th className="px-5 py-3 text-[11px] font-semibold uppercase tracking-wider text-surface-muted">
                  Priority
                </th>

                <th className="px-5 py-3 text-[11px] font-semibold uppercase tracking-wider text-surface-muted">
                  Status
                </th>

                <th className="px-5 py-3 text-[11px] font-semibold uppercase tracking-wider text-surface-muted">
                  Due
                </th>

              </tr>
            </thead>

            <tbody className="divide-y divide-surface-border">

              {tasks.map((task) => {
                const member = getTeamMemberById(task.assigneeId);
                const project = getProjectById(task.projectId);

                const status =
                  statusConfig[task.status] ||
                  statusConfig["not-started"];

                const priority =
                  priorityConfig[task.priority];

                return (
                  <tr
                    key={task.id}
                    className="transition hover:bg-surface-muted/5"
                  >

                    <td className="px-5 py-4">
                      <div>
                        <p className="text-sm font-medium text-surface-fg">
                          {task.title}
                        </p>

                        <p className="mt-1 text-xs text-surface-muted">
                          {task.service}
                        </p>
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <p className="text-sm text-surface-fg">
                        {project?.name}
                      </p>
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <Avatar member={member} />

                        <span className="text-sm text-surface-fg">
                          {member?.name}
                        </span>
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={cn(
                          "text-xs font-semibold",
                          priority?.className
                        )}
                      >
                        {priority?.label}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={cn(
                          "rounded-full px-2.5 py-1 text-[11px] font-semibold",
                          status.className
                        )}
                      >
                        {status.label}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={cn(
                          "text-xs font-medium",
                          task.dueLabel === "Overdue"
                            ? "text-red-500"
                            : task.dueLabel === "Due Today"
                              ? "text-amber-500"
                              : "text-surface-muted"
                        )}
                      >
                        {task.dueLabel}
                      </span>
                    </td>

                  </tr>
                );
              })}

            </tbody>
          </table>

        </div>
      </section>

      {/* =====================================================
          BOTTLENECK SUMMARY
      ====================================================== */}

      <section className="rounded-2xl border border-surface-border bg-surface">

        <div className="border-b border-surface-border p-5">
          <h2 className="font-display text-lg font-bold text-surface-fg">
            Delivery Bottlenecks
          </h2>

          <p className="mt-1 text-sm text-surface-muted">
            Areas currently most likely to affect project delivery.
          </p>
        </div>

        <div className="grid gap-4 p-5 md:grid-cols-3">

          <div className="rounded-xl bg-red-500/5 p-4">
            <div className="flex items-center gap-2 text-red-500">
              <AlertTriangle className="h-4 w-4" />
              <span className="text-xs font-semibold uppercase tracking-wider">
                Blocked
              </span>
            </div>

            <p className="mt-3 text-2xl font-bold text-surface-fg">
              {blockedTasks.length}
            </p>

            <p className="mt-1 text-xs leading-5 text-surface-muted">
              tasks cannot progress until a dependency is resolved.
            </p>
          </div>

          <div className="rounded-xl bg-purple-500/5 p-4">
            <div className="flex items-center gap-2 text-purple-500">
              <Clock3 className="h-4 w-4" />
              <span className="text-xs font-semibold uppercase tracking-wider">
                Client Review
              </span>
            </div>

            <p className="mt-3 text-2xl font-bold text-surface-fg">
              {reviewTasks.length}
            </p>

            <p className="mt-1 text-xs leading-5 text-surface-muted">
              tasks are waiting for client feedback or approval.
            </p>
          </div>

          <div className="rounded-xl bg-amber-500/5 p-4">
            <div className="flex items-center gap-2 text-amber-500">
              <Users className="h-4 w-4" />
              <span className="text-xs font-semibold uppercase tracking-wider">
                Workload Risk
              </span>
            </div>

            <p className="mt-3 text-2xl font-bold text-surface-fg">
              {teamPerformance.filter(
                (member) => member.total >= 3
              ).length}
            </p>

            <p className="mt-1 text-xs leading-5 text-surface-muted">
              team members carrying a relatively high task load.
            </p>
          </div>

        </div>

      </section>
    </div>
  );
}