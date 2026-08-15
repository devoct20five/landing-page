import { useMemo, useState } from "react";

import {
  Activity,
  CheckCircle2,
  Clock3,
  FolderKanban,
  ListChecks,
  MessageSquare,
  Upload,
  Eye,
  Search,
  CalendarDays,
  ArrowUpRight,
} from "lucide-react";

import { cn } from "@/lib/utils";

import {
  staffActivity,
  tasks,
  projects,
  teamMembers,
} from "@/data/mockData";

import EmptyState from "@/components/shared/EmptyState";

/* ============================================================
   ACTIVITY CONFIG
============================================================ */

const ACTIVITY_CONFIG = {
  task: {
    label: "Task",
    icon: ListChecks,
    className: "bg-blue-500/10 text-blue-700",
  },

  completed: {
    label: "Completed",
    icon: CheckCircle2,
    className: "bg-emerald-500/10 text-emerald-700",
  },

  project: {
    label: "Project",
    icon: FolderKanban,
    className: "bg-brand-orange/10 text-brand-orange",
  },

  comment: {
    label: "Comment",
    icon: MessageSquare,
    className: "bg-purple-500/10 text-purple-700",
  },

  upload: {
    label: "Upload",
    icon: Upload,
    className: "bg-cyan-500/10 text-cyan-700",
  },

  review: {
    label: "Review",
    icon: Eye,
    className: "bg-amber-500/10 text-amber-700",
  },

  default: {
    label: "Activity",
    icon: Activity,
    className: "bg-surface-muted/10 text-surface-muted",
  },
};

/* ============================================================
   FILTERS
============================================================ */

const FILTERS = [
  {
    id: "all",
    label: "All Activity",
  },
  {
    id: "tasks",
    label: "Tasks",
  },
  {
    id: "projects",
    label: "Projects",
  },
  {
    id: "comments",
    label: "Comments",
  },
  {
    id: "uploads",
    label: "Uploads",
  },
];

/* ============================================================
   HELPERS
============================================================ */

function getCurrentStaff() {
  /*
   * Replace this later with your auth/session user.
   *
   * For now we use the first staff member from mock data.
   */

  return teamMembers.find(
    (member) =>
      member.role?.toLowerCase().includes("staff")
  ) || teamMembers[0];
}

function getActivityType(item) {
  const type = item.type?.toLowerCase();

  if (type?.includes("complete")) {
    return "completed";
  }

  if (type?.includes("task")) {
    return "task";
  }

  if (type?.includes("project")) {
    return "project";
  }

  if (type?.includes("comment")) {
    return "comment";
  }

  if (type?.includes("upload")) {
    return "upload";
  }

  if (type?.includes("review")) {
    return "review";
  }

  /*
   * Try to infer from activity text.
   */

  const text = item.text?.toLowerCase() || "";

  if (
    text.includes("completed") ||
    text.includes("finished")
  ) {
    return "completed";
  }

  if (
    text.includes("task") ||
    text.includes("assigned")
  ) {
    return "task";
  }

  if (
    text.includes("project") ||
    text.includes("created")
  ) {
    return "project";
  }

  if (
    text.includes("comment") ||
    text.includes("mentioned")
  ) {
    return "comment";
  }

  if (
    text.includes("upload") ||
    text.includes("uploaded")
  ) {
    return "upload";
  }

  if (
    text.includes("review") ||
    text.includes("approved")
  ) {
    return "review";
  }

  return "default";
}

/* ============================================================
   ACTIVITY BADGE
============================================================ */

function ActivityBadge({ type }) {
  const config =
    ACTIVITY_CONFIG[type] || ACTIVITY_CONFIG.default;

  const Icon = config.icon;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1",
        "text-[0.65rem] font-semibold",
        config.className
      )}
    >
      <Icon className="h-3.5 w-3.5" />

      {config.label}
    </span>
  );
}

/* ============================================================
   ACTIVITY ITEM
============================================================ */

function ActivityItem({ activity }) {
  const type = getActivityType(activity);

  const config =
    ACTIVITY_CONFIG[type] || ACTIVITY_CONFIG.default;

  const Icon = config.icon;

  return (
    <div className="group flex gap-4 px-6 py-5 transition hover:bg-surface-bg/60">
      {/* Timeline */}

      <div className="relative flex shrink-0 flex-col items-center">
        <div
          className={cn(
            "flex h-10 w-10 items-center justify-center rounded-xl",
            config.className
          )}
        >
          <Icon className="h-4.5 w-4.5" />
        </div>

        <div className="absolute top-12 bottom-[-20px] w-px bg-surface-border group-last:hidden" />
      </div>

      {/* Content */}

      <div className="min-w-0 flex-1">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <p className="text-sm font-semibold leading-6 text-surface-fg">
              {activity.text}
            </p>

            {activity.description && (
              <p className="mt-1 text-xs leading-5 text-surface-muted">
                {activity.description}
              </p>
            )}
          </div>

          <span className="shrink-0 text-xs text-surface-muted">
            {activity.timestamp}
          </span>
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-2">
          <ActivityBadge type={type} />

          {activity.projectName && (
            <span className="inline-flex items-center gap-1 rounded-full bg-surface-bg px-2.5 py-1 text-[0.65rem] font-medium text-surface-muted">
              <FolderKanban className="h-3 w-3" />
              {activity.projectName}
            </span>
          )}

          {activity.taskName && (
            <span className="inline-flex items-center gap-1 rounded-full bg-surface-bg px-2.5 py-1 text-[0.65rem] font-medium text-surface-muted">
              <ListChecks className="h-3 w-3" />
              {activity.taskName}
            </span>
          )}
        </div>
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
}) {
  return (
    <div className="brand-card">
      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-orange/10 text-brand-orange">
        <Icon className="h-4 w-4" />
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

/* ============================================================
   QUICK PROJECT
============================================================ */

function ProjectActivityRow({ project }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-surface-border px-5 py-4 last:border-b-0">
      <div className="flex min-w-0 items-center gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-surface-bg">
          <FolderKanban className="h-4 w-4 text-surface-muted" />
        </div>

        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-surface-fg">
            {project.name}
          </p>

          <p className="mt-0.5 text-xs text-surface-muted">
            {project.progress}% complete
          </p>
        </div>
      </div>

      <span
        className={cn(
          "shrink-0 rounded-full px-2.5 py-1 text-[0.65rem] font-semibold",
          project.status === "completed"
            ? "bg-emerald-500/10 text-emerald-700"
            : project.status === "blocked"
              ? "bg-red-500/10 text-red-600"
              : "bg-blue-500/10 text-blue-700"
        )}
      >
        {project.status === "completed"
          ? "Completed"
          : project.status === "blocked"
            ? "Blocked"
            : "Active"}
      </span>
    </div>
  );
}

/* ============================================================
   MAIN PAGE
============================================================ */

export default function StaffActivity() {
  const [activeFilter, setActiveFilter] = useState("all");
  const [search, setSearch] = useState("");

  const currentStaff = getCurrentStaff();

  /*
   * ----------------------------------------------------------
   * STAFF TASKS
   * ----------------------------------------------------------
   */

  const myTasks = useMemo(() => {
    if (!currentStaff) return [];

    return tasks.filter(
      (task) => task.assigneeId === currentStaff.id
    );
  }, [currentStaff]);

  /*
   * ----------------------------------------------------------
   * MY PROJECTS
   * ----------------------------------------------------------
   */

  const myProjectIds = useMemo(() => {
    return [
      ...new Set(
        myTasks
          .map((task) => task.projectId)
          .filter(Boolean)
      ),
    ];
  }, [myTasks]);

  const myProjects = useMemo(() => {
    return projects.filter((project) =>
      myProjectIds.includes(project.id)
    );
  }, [myProjectIds]);

  /*
   * ----------------------------------------------------------
   * ACTIVITY FILTERING
   * ----------------------------------------------------------
   */

  const filteredActivity = useMemo(() => {
    const query = search.toLowerCase().trim();

    return staffActivity.filter((activity) => {
      const type = getActivityType(activity);

      let matchesFilter = true;

      if (activeFilter === "tasks") {
        matchesFilter =
          type === "task" || type === "completed";
      }

      if (activeFilter === "projects") {
        matchesFilter = type === "project";
      }

      if (activeFilter === "comments") {
        matchesFilter = type === "comment";
      }

      if (activeFilter === "uploads") {
        matchesFilter = type === "upload";
      }

      const matchesSearch =
        !query ||
        activity.text
          ?.toLowerCase()
          .includes(query) ||
        activity.description
          ?.toLowerCase()
          .includes(query) ||
        activity.projectName
          ?.toLowerCase()
          .includes(query) ||
        activity.taskName
          ?.toLowerCase()
          .includes(query);

      return matchesFilter && matchesSearch;
    });
  }, [activeFilter, search]);

  /*
   * ----------------------------------------------------------
   * STATS
   * ----------------------------------------------------------
   */

  const completedTasks = myTasks.filter(
    (task) => task.status === "completed"
  ).length;

  const pendingTasks = myTasks.filter(
    (task) => task.status !== "completed"
  ).length;

  return (
    <div className="mx-auto max-w-[1400px] animate-fade-up">
      {/* ==================================================
          HEADER
      ================================================== */}

      <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <div className="mb-2 flex items-center gap-2 text-[0.65rem] font-bold uppercase tracking-[0.16em] text-brand-orange">
            <Activity className="h-3.5 w-3.5" />
            My Workspace
          </div>

          <h1 className="font-display text-display-md font-bold tracking-[-0.02em] text-surface-fg">
            My Activity
          </h1>

          <p className="mt-2 max-w-2xl text-lead text-surface-muted">
            Keep track of your recent work, task updates,
            project activity and contributions across OCT20FIVE.
          </p>
        </div>

        <div className="flex items-center gap-2 rounded-xl border border-surface-border bg-surface-card px-3 py-2.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-brand-orange/10 text-[0.6rem] font-bold text-brand-orange">
            {currentStaff?.initials}
          </div>

          <div>
            <p className="text-xs font-semibold text-surface-fg">
              {currentStaff?.name}
            </p>

            <p className="text-[0.65rem] text-surface-muted">
              {currentStaff?.role}
            </p>
          </div>
        </div>
      </div>

      {/* ==================================================
          STATS
      ================================================== */}

      <div className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          icon={Activity}
          label="Total Activity"
          value={staffActivity.length}
          description="Recorded activity"
        />

        <StatCard
          icon={ListChecks}
          label="My Tasks"
          value={myTasks.length}
          description="Tasks assigned to you"
        />

        <StatCard
          icon={CheckCircle2}
          label="Completed"
          value={completedTasks}
          description="Tasks completed"
        />

        <StatCard
          icon={Clock3}
          label="In Progress"
          value={pendingTasks}
          description="Tasks still requiring work"
        />
      </div>

      {/* ==================================================
          MAIN GRID
      ================================================== */}

      <div className="grid gap-6 xl:grid-cols-[1fr_340px]">
        {/* ==================================================
            ACTIVITY
        ================================================== */}

        <section className="min-w-0">
          {/* Header */}

          <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="font-display text-lg font-bold text-surface-fg">
                Activity Timeline
              </h2>

              <p className="mt-1 text-sm text-surface-muted">
                A record of your recent actions and updates.
              </p>
            </div>

            <div className="relative w-full sm:w-[260px]">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-surface-muted" />

              <input
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
                placeholder="Search activity..."
                className="brand-input w-full pl-9"
              />
            </div>
          </div>

          {/* Filters */}

          <div className="mb-5 flex gap-1 overflow-x-auto border-b border-surface-border">
            {FILTERS.map((filter) => (
              <button
                key={filter.id}
                type="button"
                onClick={() =>
                  setActiveFilter(filter.id)
                }
                className={cn(
                  "shrink-0 border-b-2 px-4 py-3 text-sm font-medium transition",
                  activeFilter === filter.id
                    ? "border-brand-orange text-brand-orange"
                    : "border-transparent text-surface-muted hover:text-surface-fg"
                )}
              >
                {filter.label}
              </button>
            ))}
          </div>

          {/* Timeline */}

          {filteredActivity.length === 0 ? (
            <EmptyState
              title="No Activity Found"
              description="There is no activity matching this view."
            />
          ) : (
            <div className="brand-card overflow-hidden p-0">
              {filteredActivity.map((activity) => (
                <ActivityItem
                  key={activity.id}
                  activity={activity}
                />
              ))}
            </div>
          )}
        </section>

        {/* ==================================================
            SIDEBAR
        ================================================== */}

        <aside className="space-y-6">
          {/* MY WORK */}

          <section className="brand-card p-0">
            <div className="border-b border-surface-border px-5 py-5">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-display text-base font-bold text-surface-fg">
                    My Work
                  </h2>

                  <p className="mt-1 text-xs text-surface-muted">
                    Projects you're currently contributing to.
                  </p>
                </div>

                <FolderKanban className="h-4 w-4 text-brand-orange" />
              </div>
            </div>

            {myProjects.length === 0 ? (
              <div className="p-5">
                <p className="text-sm text-surface-muted">
                  No projects assigned yet.
                </p>
              </div>
            ) : (
              <div>
                {myProjects.slice(0, 5).map((project) => (
                  <ProjectActivityRow
                    key={project.id}
                    project={project}
                  />
                ))}
              </div>
            )}

            {myProjects.length > 5 && (
              <div className="border-t border-surface-border p-4">
                <button
                  type="button"
                  className="flex w-full items-center justify-center gap-2 text-xs font-semibold text-brand-orange hover:underline"
                >
                  View all projects
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </button>
              </div>
            )}
          </section>

          {/* TASK SUMMARY */}

          <section className="brand-card">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-display text-base font-bold text-surface-fg">
                  Task Summary
                </h2>

                <p className="mt-1 text-xs text-surface-muted">
                  Your current task workload.
                </p>
              </div>

              <ListChecks className="h-4 w-4 text-brand-orange" />
            </div>

            <div className="mt-6 space-y-4">
              <SummaryRow
                label="Total Tasks"
                value={myTasks.length}
              />

              <SummaryRow
                label="Completed"
                value={completedTasks}
                valueClass="text-emerald-700"
              />

              <SummaryRow
                label="In Progress"
                value={pendingTasks}
                valueClass="text-brand-orange"
              />
            </div>
          </section>

          {/* ACTIVITY INFO */}

          <section className="brand-card">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-orange/10">
                <CalendarDays className="h-4 w-4 text-brand-orange" />
              </div>

              <div>
                <p className="text-sm font-semibold text-surface-fg">
                  Activity tracking
                </p>

                <p className="mt-0.5 text-xs text-surface-muted">
                  Your actions are automatically recorded.
                </p>
              </div>
            </div>

            <p className="mt-4 text-xs leading-5 text-surface-muted">
              Task updates, project changes, comments, uploads
              and other important actions will appear in this
              timeline.
            </p>
          </section>
        </aside>
      </div>
    </div>
  );
}

/* ============================================================
   SUMMARY ROW
============================================================ */

function SummaryRow({
  label,
  value,
  valueClass = "text-surface-fg",
}) {
  return (
    <div className="flex items-center justify-between border-b border-surface-border pb-3 last:border-b-0 last:pb-0">
      <span className="text-xs text-surface-muted">
        {label}
      </span>

      <span
        className={cn(
          "text-sm font-bold",
          valueClass
        )}
      >
        {value}
      </span>
    </div>
  );
}