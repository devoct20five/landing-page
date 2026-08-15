import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  Clock3,
  FolderKanban,
  ListTodo,
  MoreHorizontal,
  UserRound,
  Users,
} from "lucide-react";
import { Link } from "react-router-dom";

import { cn } from "@/lib/utils";
import {
  currentStaff,
  projects,
  tasks,
  approvals,
  staffActivity,
  staffStats,
  getProjectById,
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
      "bg-purple-500/10 text-purple-600 border-purple-500/20",
  },
  blocked: {
    label: "Blocked",
    className:
      "bg-red-500/10 text-red-600 border-red-500/20",
  },
  planned: {
    label: "Planned",
    className:
      "bg-surface-muted/10 text-surface-muted border-surface-border",
  },
  "not-started": {
    label: "Not Started",
    className:
      "bg-surface-muted/10 text-surface-muted border-surface-border",
  },
};

const priorityConfig = {
  high: "text-red-500",
  medium: "text-amber-500",
  low: "text-surface-muted",
};

function StatCard({ label, value, icon: Icon, description, urgent }) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-surface-border bg-surface-bg p-5",
        "transition-all duration-300 hover:-translate-y-0.5 hover:shadow-sm",
        urgent && "border-brand-orange/30"
      )}
    >
      <div className="flex items-start justify-between">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-surface-muted/10">
          <Icon className="h-5 w-5 text-surface-muted" strokeWidth={2} />
        </div>

        {urgent && (
          <span className="rounded-full bg-brand-orange/10 px-2 py-1 text-[0.65rem] font-semibold uppercase tracking-wide text-brand-orange">
            Attention
          </span>
        )}
      </div>

      <div className="mt-5">
        <p className="font-display text-2xl font-bold tracking-tight text-surface-fg">
          {value}
        </p>

        <p className="mt-1 text-sm font-medium text-surface-fg">
          {label}
        </p>

        {description && (
          <p className="mt-1 text-xs text-surface-muted">
            {description}
          </p>
        )}
      </div>
    </div>
  );
}

function StatusBadge({ status }) {
  const config = statusConfig[status] || statusConfig["not-started"];

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-1",
        "text-[0.65rem] font-semibold",
        config.className
      )}
    >
      {config.label}
    </span>
  );
}

function PriorityDot({ priority }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 text-xs font-medium capitalize",
        priorityConfig[priority]
      )}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {priority}
    </span>
  );
}

function ProgressBar({ value }) {
  return (
    <div className="h-1.5 w-full overflow-hidden rounded-full bg-surface-muted/10">
      <div
        className="h-full rounded-full bg-brand-orange transition-all"
        style={{ width: `${value}%` }}
      />
    </div>
  );
}

export default function StaffDashboard() {
  const myTasks = tasks.filter(
    (task) => task.assigneeId === currentStaff.id
  );

  const urgentTasks = tasks.filter(
    (task) =>
      task.status === "blocked" ||
      task.dueLabel === "Overdue" ||
      task.priority === "high"
  );

  const activeProjects = projects.filter(
    (project) => project.status !== "completed"
  );

  const pendingApprovals = approvals.filter(
    (approval) => approval.status === "pending"
  );

  return (
    <div className="space-y-8 pb-10">
      {/* =====================================================
          HEADER
      ====================================================== */}
      <section className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
        <div>
      

          <h1 className="font-display text-3xl font-bold tracking-[-0.03em] text-surface-fg md:text-4xl">
            Good morning, {currentStaff.name.split(" ")[0]}.
          </h1>

          <p className="mt-2 max-w-xl text-sm leading-6 text-surface-muted">
            Here&apos;s what needs your attention across the agency today.
          </p>
        </div>

        <Link
          to="/tasks"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand-orange px-4 py-2.5 text-sm font-semibold text-white shadow-[0_10px_24px_-8px_rgba(255,90,31,0.45)] transition-all hover:-translate-y-0.5"
        >
          View all tasks
          <ArrowRight className="h-4 w-4" />
        </Link>
      </section>

      {/* =====================================================
          STATS
      ====================================================== */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Active Projects"
          value={staffStats.activeProjects}
          icon={FolderKanban}
          description="Currently being worked on"
        />

        <StatCard
          label="Tasks In Progress"
          value={staffStats.tasksInProgress}
          icon={ListTodo}
          description="Across all projects"
        />

        <StatCard
          label="Due Today"
          value={staffStats.dueToday}
          icon={Clock3}
          description="Tasks requiring action"
          urgent={staffStats.dueToday > 0}
        />

        <StatCard
          label="Blocked"
          value={staffStats.blocked}
          icon={AlertCircle}
          description="Projects and tasks"
          urgent={staffStats.blocked > 0}
        />
      </section>

      {/* =====================================================
          MAIN GRID
      ====================================================== */}
      <section className="grid grid-cols-1 gap-6 xl:grid-cols-[1.4fr_0.8fr]">
        {/* ===================================================
            MY WORK
        ==================================================== */}
        <div className="rounded-2xl border border-surface-border bg-surface-bg">
          <div className="flex items-center justify-between border-b border-surface-border px-5 py-4">
            <div>
              <h2 className="font-display text-base font-bold text-surface-fg">
                My Work
              </h2>

              <p className="mt-0.5 text-xs text-surface-muted">
                Tasks assigned to you
              </p>
            </div>

            <Link
              to="/tasks"
              className="text-xs font-semibold text-brand-orange hover:underline"
            >
              View all
            </Link>
          </div>

          <div className="divide-y divide-surface-border">
            {myTasks.length === 0 ? (
              <div className="px-5 py-10 text-center">
                <CheckCircle2 className="mx-auto h-8 w-8 text-green-500" />

                <p className="mt-3 text-sm font-semibold text-surface-fg">
                  All caught up
                </p>

                <p className="mt-1 text-xs text-surface-muted">
                  You have no assigned tasks.
                </p>
              </div>
            ) : (
              myTasks.slice(0, 5).map((task) => {
                const project = getProjectById(task.projectId);

                return (
                  <div
                    key={task.id}
                    className="group flex items-center gap-4 px-5 py-4 transition-colors hover:bg-surface-muted/5"
                  >
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-surface-muted/10">
                      <ListTodo
                        className="h-4 w-4 text-surface-muted"
                        strokeWidth={2}
                      />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <p className="truncate text-sm font-semibold text-surface-fg">
                          {task.title}
                        </p>

                        <PriorityDot priority={task.priority} />
                      </div>

                      <div className="mt-1 flex items-center gap-2 text-xs text-surface-muted">
                        <span>{project?.name}</span>
                        <span>•</span>
                        <span>{task.service}</span>
                      </div>
                    </div>

                    <div className="hidden shrink-0 sm:block">
                      <StatusBadge status={task.status} />
                    </div>

                    <div className="hidden text-right sm:block">
                      <p
                        className={cn(
                          "text-xs font-semibold",
                          task.dueLabel === "Overdue"
                            ? "text-red-500"
                            : task.dueLabel === "Due Today"
                              ? "text-brand-orange"
                              : "text-surface-muted"
                        )}
                      >
                        {task.dueLabel}
                      </p>

                      <p className="mt-0.5 text-[0.65rem] text-surface-muted">
                        {task.dueDate}
                      </p>
                    </div>

                    <MoreHorizontal className="h-4 w-4 text-surface-muted opacity-0 transition-opacity group-hover:opacity-100" />
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* ===================================================
            PENDING APPROVALS
        ==================================================== */}
        <div className="rounded-2xl border border-surface-border bg-surface-bg">
          <div className="flex items-center justify-between border-b border-surface-border px-5 py-4">
            <div>
              <h2 className="font-display text-base font-bold text-surface-fg">
                Pending Approvals
              </h2>

              <p className="mt-0.5 text-xs text-surface-muted">
                Waiting on clients
              </p>
            </div>

            <span className="flex h-7 min-w-7 items-center justify-center rounded-full bg-brand-orange/10 px-2 text-xs font-bold text-brand-orange">
              {pendingApprovals.length}
            </span>
          </div>

          <div className="divide-y divide-surface-border">
            {pendingApprovals.slice(0, 4).map((approval) => {
              const project = getProjectById(approval.projectId);

              return (
                <div
                  key={approval.id}
                  className="px-5 py-4 transition-colors hover:bg-surface-muted/5"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-surface-fg">
                        {approval.title}
                      </p>

                      <p className="mt-1 text-xs text-surface-muted">
                        {project?.clientName} · V{approval.version}
                      </p>
                    </div>

                    <Clock3 className="h-4 w-4 shrink-0 text-amber-500" />
                  </div>

                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-[0.7rem] text-surface-muted">
                      Waiting {approval.waitingSince}
                    </span>

                    <button className="text-xs font-semibold text-brand-orange hover:underline">
                      Open
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* =====================================================
          ATTENTION + ACTIVITY
      ====================================================== */}
      <section className="grid grid-cols-1 gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        {/* ===================================================
            NEEDS ATTENTION
        ==================================================== */}
        <div className="rounded-2xl border border-surface-border bg-surface-bg">
          <div className="border-b border-surface-border px-5 py-4">
            <h2 className="font-display text-base font-bold text-surface-fg">
              Needs Attention
            </h2>

            <p className="mt-0.5 text-xs text-surface-muted">
              Items that may need immediate action
            </p>
          </div>

          <div className="divide-y divide-surface-border">
            {urgentTasks.slice(0, 5).map((task) => {
              const project = getProjectById(task.projectId);

              return (
                <div
                  key={task.id}
                  className="flex items-start gap-3 px-5 py-4"
                >
                  <div
                    className={cn(
                      "mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg",
                      task.status === "blocked"
                        ? "bg-red-500/10"
                        : "bg-brand-orange/10"
                    )}
                  >
                    <AlertCircle
                      className={cn(
                        "h-4 w-4",
                        task.status === "blocked"
                          ? "text-red-500"
                          : "text-brand-orange"
                      )}
                    />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-surface-fg">
                      {task.title}
                    </p>

                    <p className="mt-1 truncate text-xs text-surface-muted">
                      {project?.name} · {project?.clientName}
                    </p>

                    <div className="mt-2 flex items-center gap-2">
                      <StatusBadge status={task.status} />

                      {task.dueLabel === "Overdue" && (
                        <span className="text-[0.65rem] font-semibold text-red-500">
                          Overdue
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ===================================================
            RECENT ACTIVITY
        ==================================================== */}
        <div className="rounded-2xl border border-surface-border bg-surface-bg">
          <div className="flex items-center justify-between border-b border-surface-border px-5 py-4">
            <div>
              <h2 className="font-display text-base font-bold text-surface-fg">
                Recent Activity
              </h2>

              <p className="mt-0.5 text-xs text-surface-muted">
                Latest agency activity
              </p>
            </div>

            <Link
              to="/activity"
              className="text-xs font-semibold text-brand-orange hover:underline"
            >
              View activity
            </Link>
          </div>

          <div className="divide-y divide-surface-border">
            {staffActivity.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-4 px-5 py-4"
              >
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-surface-muted/10">
                  <ActivityIcon text={item.text} />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="text-sm text-surface-fg">
                    {item.text}
                  </p>

                  <p className="mt-1 text-[0.7rem] text-surface-muted">
                    {item.timestamp}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =====================================================
          ACTIVE PROJECTS
      ====================================================== */}
      <section className="rounded-2xl border border-surface-border bg-surface-bg">
        <div className="flex items-center justify-between border-b border-surface-border px-5 py-4">
          <div>
            <h2 className="font-display text-base font-bold text-surface-fg">
              Active Projects
            </h2>

            <p className="mt-0.5 text-xs text-surface-muted">
              Current project workload across the agency
            </p>
          </div>

          <Link
            to="/projects"
            className="text-xs font-semibold text-brand-orange hover:underline"
          >
            View projects
          </Link>
        </div>

        <div className="divide-y divide-surface-border">
          {activeProjects.slice(0, 6).map((project) => (
            <div
              key={project.id}
              className="grid grid-cols-1 gap-4 px-5 py-4 md:grid-cols-[1.5fr_0.8fr_1fr_80px] md:items-center"
            >
              {/* Project */}
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-surface-fg">
                  {project.name}
                </p>

                <p className="mt-1 truncate text-xs text-surface-muted">
                  {project.clientName}
                </p>
              </div>

              {/* Team */}
              <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-surface-muted/10">
                  <Users className="h-3.5 w-3.5 text-surface-muted" />
                </div>

                <span className="text-xs text-surface-muted">
                  {project.teamSize} people
                </span>
              </div>

              {/* Progress */}
              <div>
                <div className="mb-1.5 flex items-center justify-between">
                  <span className="text-[0.65rem] text-surface-muted">
                    Progress
                  </span>

                  <span className="text-[0.7rem] font-semibold text-surface-fg">
                    {project.progress}%
                  </span>
                </div>

                <ProgressBar value={project.progress} />
              </div>

              {/* Status */}
              <div className="md:text-right">
                <StatusBadge status={project.status} />
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function ActivityIcon({ text }) {
  if (text.toLowerCase().includes("approved")) {
    return (
      <CheckCircle2
        className="h-4 w-4 text-green-500"
        strokeWidth={2}
      />
    );
  }

  if (
    text.toLowerCase().includes("created") ||
    text.toLowerCase().includes("updated")
  ) {
    return (
      <ListTodo
        className="h-4 w-4 text-brand-orange"
        strokeWidth={2}
      />
    );
  }

  return (
    <FolderKanban
      className="h-4 w-4 text-surface-muted"
      strokeWidth={2}
    />
  );
}