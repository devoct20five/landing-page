import {
  Activity,
  AlertTriangle,
  ArrowRight,
  BriefcaseBusiness,
  CheckCircle2,
  ChevronRight,
  Clock3,
  FolderKanban,
  ListTodo,
  Plus,
  ShieldAlert,
  TrendingUp,
  UserRound,
  Users,
} from "lucide-react";

import { cn } from "@/lib/utils";
import {
  projects,
  clients,
  teamMembers,
  tasks,
  approvals,
  staffActivity,
  getClientById,
  getTeamMemberById,
} from "@/data/mockData";

const statusConfig = {
  "in-progress": {
    label: "In Progress",
    className:
      "bg-blue-500/10 text-blue-600 border-blue-500/20",
  },
  "client-review": {
    label: "Client Review",
    className:
      "bg-orange-500/10 text-orange-600 border-orange-500/20",
  },
  blocked: {
    label: "Blocked",
    className:
      "bg-red-500/10 text-red-600 border-red-500/20",
  },
  completed: {
    label: "Completed",
    className:
      "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
  },
  planned: {
    label: "Planned",
    className:
      "bg-purple-500/10 text-purple-600 border-purple-500/20",
  },
  "not-started": {
    label: "Not Started",
    className:
      "bg-surface-muted/10 text-surface-muted border-surface-border",
  },
};

function StatusBadge({ status }) {
  const config = statusConfig[status] || statusConfig["not-started"];

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-1 text-[0.68rem] font-semibold",
        config.className
      )}
    >
      {config.label}
    </span>
  );
}

function ProgressBar({ progress }) {
  return (
    <div className="h-1.5 w-full overflow-hidden rounded-full bg-surface-muted/10">
      <div
        className={cn(
          "h-full rounded-full transition-all",
          progress >= 90
            ? "bg-emerald-500"
            : progress >= 60
              ? "bg-brand-orange"
              : progress >= 40
                ? "bg-blue-500"
                : "bg-red-400"
        )}
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}

function StatCard({
  label,
  value,
  description,
  icon: Icon,
  tone = "default",
}) {
  const tones = {
    default: "bg-surface-muted/10 text-surface-fg",
    orange: "bg-brand-orange/10 text-brand-orange",
    red: "bg-red-500/10 text-red-600",
    green: "bg-emerald-500/10 text-emerald-600",
    blue: "bg-blue-500/10 text-blue-600",
  };

  return (
    <div className="rounded-2xl border border-surface-border bg-surface-bg p-5 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[0.72rem] font-semibold uppercase tracking-[0.1em] text-surface-muted">
            {label}
          </p>

          <p className="mt-2 font-display text-3xl font-bold tracking-[-0.04em] text-surface-fg">
            {value}
          </p>

          <p className="mt-1 text-xs text-surface-muted">
            {description}
          </p>
        </div>

        <div
          className={cn(
            "flex h-10 w-10 items-center justify-center rounded-xl",
            tones[tone]
          )}
        >
          <Icon className="h-5 w-5" strokeWidth={2} />
        </div>
      </div>
    </div>
  );
}

function SectionHeader({ title, description, action }) {
  return (
    <div className="mb-4 flex items-end justify-between gap-4">
      <div>
        <h2 className="font-display text-[1rem] font-bold tracking-[-0.02em] text-surface-fg">
          {title}
        </h2>

        {description && (
          <p className="mt-1 text-xs text-surface-muted">
            {description}
          </p>
        )}
      </div>

      {action && (
        <button className="flex items-center gap-1 text-xs font-semibold text-brand-orange transition-colors hover:text-brand-orange/80">
          {action}
          <ArrowRight className="h-3.5 w-3.5" />
        </button>
      )}
    </div>
  );
}

export default function AdminDashboard() {
  const activeProjects = projects.filter(
    (project) => project.status !== "completed"
  );

  const inProgressTasks = tasks.filter(
    (task) => task.status === "in-progress"
  );

  const dueToday = tasks.filter(
    (task) => task.dueLabel === "Due Today"
  );

  const blockedProjects = projects.filter(
    (project) => project.status === "blocked"
  );

  const blockedTasks = tasks.filter(
    (task) => task.status === "blocked"
  );

  const pendingApprovals = approvals.filter(
    (approval) => approval.status === "pending"
  );

  const overdueTasks = tasks.filter(
    (task) => task.dueLabel === "Overdue"
  );

  const atRiskProjects = projects
    .filter(
      (project) =>
        project.status === "blocked" ||
        project.attentionReason ||
        project.progress < 35
    )
    .slice(0, 5);

  const projectHealth = activeProjects
    .sort((a, b) => a.progress - b.progress)
    .slice(0, 5);

  const teamWorkload = teamMembers.map((member) => {
    const assignedTasks = tasks.filter(
      (task) => task.assigneeId === member.id
    );

    const activeTasks = assignedTasks.filter(
      (task) =>
        task.status !== "completed" &&
        task.status !== "not-started"
    );

    const overdue = assignedTasks.filter(
      (task) => task.dueLabel === "Overdue"
    );

    return {
      ...member,
      assigned: assignedTasks.length,
      active: activeTasks.length,
      overdue: overdue.length,
    };
  });

  const maxWorkload = Math.max(
    ...teamWorkload.map((member) => member.active),
    1
  );

  return (
    <div className="space-y-8 pb-10">
      {/* =====================================================
          HEADER
      ====================================================== */}

      <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
        <div>
          <div className="mb-2 flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-brand-orange" />

            <span className="text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-brand-orange">
              Admin Overview
            </span>
          </div>

          <h1 className="font-display text-3xl font-bold tracking-[-0.04em] text-surface-fg sm:text-4xl">
            Agency at a glance.
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-surface-muted">
            Monitor projects, team workload, client activity and
            anything that needs attention across OCT20FIVE.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button className="inline-flex items-center gap-2 rounded-xl border border-surface-border bg-surface-bg px-4 py-2.5 text-xs font-semibold text-surface-fg transition-all hover:bg-surface-muted/10">
            <Activity className="h-4 w-4" />
            Activity
          </button>

          <button className="inline-flex items-center gap-2 rounded-xl bg-brand-orange px-4 py-2.5 text-xs font-semibold text-white shadow-[0_10px_24px_-8px_rgba(255,90,31,0.5)] transition-all hover:translate-y-[-1px]">
            <Plus className="h-4 w-4" />
            New Project
          </button>
        </div>
      </div>

      {/* =====================================================
          KPI CARDS
      ====================================================== */}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <StatCard
          label="Active Projects"
          value={activeProjects.length}
          description={`${clients.length} active clients`}
          icon={BriefcaseBusiness}
          tone="orange"
        />

        <StatCard
          label="Tasks In Progress"
          value={inProgressTasks.length}
          description={`${tasks.length} total tasks`}
          icon={ListTodo}
          tone="blue"
        />

        <StatCard
          label="Due Today"
          value={dueToday.length}
          description={
            dueToday.length
              ? "Requires attention today"
              : "Nothing due today"
          }
          icon={Clock3}
          tone={dueToday.length ? "orange" : "green"}
        />

        <StatCard
          label="Blocked"
          value={blockedProjects.length + blockedTasks.length}
          description={`${blockedProjects.length} projects · ${blockedTasks.length} tasks`}
          icon={ShieldAlert}
          tone={
            blockedProjects.length + blockedTasks.length
              ? "red"
              : "green"
          }
        />

        <StatCard
          label="Pending Approvals"
          value={pendingApprovals.length}
          description="Waiting on clients"
          icon={CheckCircle2}
          tone={
            pendingApprovals.length ? "orange" : "green"
          }
        />
      </div>

      {/* =====================================================
          MAIN GRID
      ====================================================== */}

      <div className="grid gap-6 xl:grid-cols-[1.55fr_1fr]">
        {/* PROJECT HEALTH */}

        <section className="rounded-2xl border border-surface-border bg-surface-bg p-5">
          <SectionHeader
            title="Project health"
            description="Projects requiring the closest operational attention."
            action="View all projects"
          />

          <div className="divide-y divide-surface-border">
            {projectHealth.map((project) => (
              <div
                key={project.id}
                className="group flex flex-col gap-4 py-4 first:pt-1 last:pb-1 sm:flex-row sm:items-center"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="truncate text-sm font-semibold text-surface-fg">
                      {project.name}
                    </h3>

                    {project.status === "blocked" && (
                      <AlertTriangle className="h-3.5 w-3.5 shrink-0 text-red-500" />
                    )}
                  </div>

                  <p className="mt-1 text-xs text-surface-muted">
                    {project.clientName}
                  </p>

                  <div className="mt-3 flex items-center gap-3">
                    <ProgressBar progress={project.progress} />

                    <span className="w-8 text-right text-xs font-semibold text-surface-fg">
                      {project.progress}%
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="hidden text-right sm:block">
                    <p className="text-[0.65rem] uppercase tracking-wider text-surface-muted">
                      Deadline
                    </p>
                    <p className="mt-1 text-xs font-medium text-surface-fg">
                      {project.deadline}
                    </p>
                  </div>

                  <StatusBadge status={project.status} />

                  <ChevronRight className="h-4 w-4 text-surface-muted transition-transform group-hover:translate-x-0.5" />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* TEAM WORKLOAD */}

        <section className="rounded-2xl border border-surface-border bg-surface-bg p-5">
          <SectionHeader
            title="Team workload"
            description="Current active task distribution."
            action="Manage team"
          />

          <div className="space-y-5">
            {teamWorkload.map((member) => {
              const percentage =
                (member.active / maxWorkload) * 100;

              return (
                <div key={member.id}>
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-surface-muted/10 text-[0.65rem] font-bold text-surface-fg">
                        {member.initials}
                      </div>

                      <div className="min-w-0">
                        <p className="truncate text-xs font-semibold text-surface-fg">
                          {member.name}
                        </p>

                        <p className="truncate text-[0.68rem] text-surface-muted">
                          {member.role}
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="text-xs font-semibold text-surface-fg">
                        {member.active}
                      </p>

                      <p className="text-[0.62rem] text-surface-muted">
                        active
                      </p>
                    </div>
                  </div>

                  <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-surface-muted/10">
                    <div
                      className={cn(
                        "h-full rounded-full transition-all",
                        member.active >= 3
                          ? "bg-brand-orange"
                          : "bg-surface-fg/40"
                      )}
                      style={{
                        width: `${percentage}%`,
                      }}
                    />
                  </div>

                  {member.overdue > 0 && (
                    <p className="mt-1.5 text-[0.65rem] font-medium text-red-500">
                      {member.overdue} overdue
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      </div>

      {/* =====================================================
          AT RISK + APPROVALS
      ====================================================== */}

      <div className="grid gap-6 lg:grid-cols-2">
        {/* AT RISK */}

        <section className="rounded-2xl border border-surface-border bg-surface-bg p-5">
          <SectionHeader
            title="Needs attention"
            description="Projects with blockers, risks or unusual progress."
          />

          <div className="space-y-2">
            {atRiskProjects.map((project) => (
              <div
                key={project.id}
                className="flex items-center gap-4 rounded-xl border border-surface-border p-3.5 transition-colors hover:bg-surface-muted/5"
              >
                <div
                  className={cn(
                    "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg",
                    project.status === "blocked"
                      ? "bg-red-500/10 text-red-500"
                      : "bg-orange-500/10 text-brand-orange"
                  )}
                >
                  <AlertTriangle className="h-4 w-4" />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="truncate text-xs font-semibold text-surface-fg">
                      {project.name}
                    </p>

                    <span className="shrink-0 text-[0.65rem] font-semibold text-surface-muted">
                      {project.progress}%
                    </span>
                  </div>

                  <p className="mt-1 truncate text-[0.68rem] text-surface-muted">
                    {project.attentionReason ||
                      "Project progress requires review"}
                  </p>
                </div>

                <ChevronRight className="h-4 w-4 shrink-0 text-surface-muted" />
              </div>
            ))}

            {!atRiskProjects.length && (
              <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-surface-border py-10 text-center">
                <CheckCircle2 className="h-7 w-7 text-emerald-500" />

                <p className="mt-3 text-sm font-semibold text-surface-fg">
                  Everything looks healthy
                </p>

                <p className="mt-1 text-xs text-surface-muted">
                  No projects currently require attention.
                </p>
              </div>
            )}
          </div>
        </section>

        {/* APPROVALS */}

        <section className="rounded-2xl border border-surface-border bg-surface-bg p-5">
          <SectionHeader
            title="Pending approvals"
            description="Deliverables currently waiting on clients."
            action="View approvals"
          />

          <div className="space-y-2">
            {pendingApprovals.map((approval) => {
              const client = getClientById(approval.clientId);

              return (
                <div
                  key={approval.id}
                  className="flex items-center gap-4 rounded-xl border border-surface-border p-3.5"
                >
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-orange/10 text-brand-orange">
                    <CheckCircle2 className="h-4 w-4" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="truncate text-xs font-semibold text-surface-fg">
                        {approval.title}
                      </p>

                      <span className="shrink-0 rounded-md bg-surface-muted/10 px-1.5 py-0.5 text-[0.6rem] font-semibold text-surface-muted">
                        V{approval.version}
                      </span>
                    </div>

                    <p className="mt-1 text-[0.68rem] text-surface-muted">
                      {client?.name} · waiting {approval.waitingSince}
                    </p>
                  </div>

                  <button className="hidden rounded-lg border border-surface-border px-3 py-1.5 text-[0.65rem] font-semibold text-surface-fg hover:bg-surface-muted/10 sm:block">
                    Open
                  </button>
                </div>
              );
            })}
          </div>
        </section>
      </div>

      {/* =====================================================
          CLIENT OVERVIEW
      ====================================================== */}

      <section className="rounded-2xl border border-surface-border bg-surface-bg p-5">
        <SectionHeader
          title="Client overview"
          description="Current project health across your client base."
          action="View all clients"
        />

        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] border-collapse">
            <thead>
              <tr className="border-b border-surface-border text-left">
                <th className="pb-3 text-[0.65rem] font-semibold uppercase tracking-wider text-surface-muted">
                  Client
                </th>

                <th className="pb-3 text-[0.65rem] font-semibold uppercase tracking-wider text-surface-muted">
                  Projects
                </th>

                <th className="pb-3 text-[0.65rem] font-semibold uppercase tracking-wider text-surface-muted">
                  Progress
                </th>

                <th className="pb-3 text-[0.65rem] font-semibold uppercase tracking-wider text-surface-muted">
                  Approvals
                </th>

                <th className="pb-3 text-[0.65rem] font-semibold uppercase tracking-wider text-surface-muted">
                  Issues
                </th>

                <th className="pb-3 text-right text-[0.65rem] font-semibold uppercase tracking-wider text-surface-muted">
                  Health
                </th>
              </tr>
            </thead>

            <tbody>
              {clients.map((client) => {
                const clientProjects = projects.filter(
                  (project) => project.clientId === client.id
                );

                const clientApprovals = approvals.filter(
                  (approval) =>
                    approval.clientId === client.id &&
                    approval.status === "pending"
                );

                const clientIssues = clientProjects.filter(
                  (project) =>
                    project.status === "blocked" ||
                    project.attentionReason
                );

                const averageProgress = Math.round(
                  clientProjects.reduce(
                    (sum, project) => sum + project.progress,
                    0
                  ) / Math.max(clientProjects.length, 1)
                );

                const isHealthy =
                  clientIssues.length === 0;

                return (
                  <tr
                    key={client.id}
                    className="border-b border-surface-border last:border-0"
                  >
                    <td className="py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-surface-muted/10 text-[0.65rem] font-bold text-surface-fg">
                          {client.shortName.slice(0, 2)}
                        </div>

                        <div>
                          <p className="text-xs font-semibold text-surface-fg">
                            {client.name}
                          </p>

                          <p className="mt-0.5 text-[0.65rem] text-surface-muted">
                            {clientProjects.length} projects
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 text-xs font-medium text-surface-fg">
                      {clientProjects.length}
                    </td>

                    <td className="py-4">
                      <div className="flex w-32 items-center gap-2">
                        <ProgressBar progress={averageProgress} />

                        <span className="text-[0.65rem] font-semibold text-surface-fg">
                          {averageProgress}%
                        </span>
                      </div>
                    </td>

                    <td className="py-4 text-xs font-medium text-surface-fg">
                      {clientApprovals.length || "—"}
                    </td>

                    <td className="py-4">
                      {clientIssues.length > 0 ? (
                        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-red-500">
                          <AlertTriangle className="h-3.5 w-3.5" />
                          {clientIssues.length}
                        </span>
                      ) : (
                        <span className="text-xs text-surface-muted">
                          —
                        </span>
                      )}
                    </td>

                    <td className="py-4 text-right">
                      <span
                        className={cn(
                          "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[0.65rem] font-semibold",
                          isHealthy
                            ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-600"
                            : "border-orange-500/20 bg-orange-500/10 text-orange-600"
                        )}
                      >
                        <span className="h-1.5 w-1.5 rounded-full bg-current" />
                        {isHealthy ? "Healthy" : "Attention"}
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
          RECENT ACTIVITY + DEADLINES
      ====================================================== */}

      <div className="grid gap-6 xl:grid-cols-[1.25fr_0.75fr]">
        {/* ACTIVITY */}

        <section className="rounded-2xl border border-surface-border bg-surface-bg p-5">
          <SectionHeader
            title="Recent activity"
            description="The latest actions across the agency."
            action="View activity"
          />

          <div className="space-y-1">
            {staffActivity.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-3 rounded-xl px-2 py-3 transition-colors hover:bg-surface-muted/5"
              >
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-surface-muted/10">
                  <Activity className="h-3.5 w-3.5 text-surface-muted" />
                </div>

                <p className="min-w-0 flex-1 text-xs text-surface-fg">
                  {item.text}
                </p>

                <span className="shrink-0 text-[0.65rem] text-surface-muted">
                  {item.timestamp}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* UPCOMING / OVERDUE */}

        <section className="rounded-2xl border border-surface-border bg-surface-bg p-5">
          <SectionHeader
            title="Deadline watch"
            description="Tasks approaching or past their deadline."
          />

          <div className="space-y-2">
            {[...overdueTasks, ...dueToday].slice(0, 5).map((task) => {
              const assignee = getTeamMemberById(
                task.assigneeId
              );

              return (
                <div
                  key={task.id}
                  className="flex items-center gap-3 rounded-xl border border-surface-border p-3"
                >
                  <div
                    className={cn(
                      "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg",
                      task.dueLabel === "Overdue"
                        ? "bg-red-500/10 text-red-500"
                        : "bg-orange-500/10 text-brand-orange"
                    )}
                  >
                    <Clock3 className="h-3.5 w-3.5" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs font-semibold text-surface-fg">
                      {task.title}
                    </p>

                    <p className="mt-1 truncate text-[0.65rem] text-surface-muted">
                      {assignee?.name}
                    </p>
                  </div>

                  <span
                    className={cn(
                      "shrink-0 text-[0.65rem] font-semibold",
                      task.dueLabel === "Overdue"
                        ? "text-red-500"
                        : "text-brand-orange"
                    )}
                  >
                    {task.dueLabel}
                  </span>
                </div>
              );
            })}

            {!overdueTasks.length && !dueToday.length && (
              <div className="py-8 text-center">
                <CheckCircle2 className="mx-auto h-7 w-7 text-emerald-500" />

                <p className="mt-2 text-xs font-semibold text-surface-fg">
                  No deadline issues
                </p>
              </div>
            )}
          </div>
        </section>
      </div>

      {/* =====================================================
          QUICK ACTIONS
      ====================================================== */}

      <section>
        <SectionHeader
          title="Quick actions"
          description="Common administrative actions."
        />

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              label: "Create project",
              description: "Start a new client project",
              icon: FolderKanban,
            },
            {
              label: "Add client",
              description: "Create a new client account",
              icon: Users,
            },
            {
              label: "Assign task",
              description: "Assign work to a team member",
              icon: ListTodo,
            },
            {
              label: "Manage team",
              description: "View team and workload",
              icon: UserRound,
            },
          ].map((action) => {
            const Icon = action.icon;

            return (
              <button
                key={action.label}
                className="group flex items-center gap-4 rounded-2xl border border-surface-border bg-surface-bg p-4 text-left transition-all duration-300 hover:-translate-y-0.5 hover:border-brand-orange/30 hover:shadow-sm"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-surface-muted/10 text-surface-fg transition-colors group-hover:bg-brand-orange/10 group-hover:text-brand-orange">
                  <Icon className="h-4.5 w-4.5" />
                </div>

                <div className="min-w-0">
                  <p className="text-xs font-semibold text-surface-fg">
                    {action.label}
                  </p>

                  <p className="mt-1 text-[0.65rem] text-surface-muted">
                    {action.description}
                  </p>
                </div>

                <ArrowRight className="ml-auto h-4 w-4 shrink-0 text-surface-muted transition-transform group-hover:translate-x-1 group-hover:text-brand-orange" />
              </button>
            );
          })}
        </div>
      </section>
    </div>
  );
}