import { useMemo, useState } from "react";
import {
  Activity,
  Search,
  Filter,
  Users,
  FolderKanban,
  CheckCircle2,
  AlertCircle,
  Clock3,
  UserPlus,
  UserRoundCog,
  FileCheck2,
  MessageSquare,
  Settings2,
  ShieldCheck,
  ChevronDown,
  X,
  ArrowUpRight,
  RefreshCw,
} from "lucide-react";

import {
  staffActivity,
  teamMembers,
  projects,
  getProjectById,
  getTeamMemberById,
} from "@/data/mockData";

import EmptyState from "@/components/shared/EmptyState";
import { cn } from "@/lib/utils";

/* ============================================================
   CONFIG
============================================================ */

const ACTIVITY_TYPES = [
  { id: "all", label: "All Activity" },
  { id: "task", label: "Tasks" },
  { id: "project", label: "Projects" },
  { id: "approval", label: "Approvals" },
  { id: "user", label: "Users" },
  { id: "file", label: "Files" },
  { id: "comment", label: "Comments" },
  { id: "system", label: "System" },
];

const TYPE_CONFIG = {
  task: {
    label: "Task",
    icon: CheckCircle2,
    className: "bg-blue-500/10 text-blue-700",
  },

  project: {
    label: "Project",
    icon: FolderKanban,
    className: "bg-brand-orange/10 text-brand-orange",
  },

  approval: {
    label: "Approval",
    icon: FileCheck2,
    className: "bg-emerald-500/10 text-emerald-700",
  },

  user: {
    label: "User",
    icon: UserPlus,
    className: "bg-violet-500/10 text-violet-700",
  },

  file: {
    label: "File",
    icon: Activity,
    className: "bg-cyan-500/10 text-cyan-700",
  },

  comment: {
    label: "Comment",
    icon: MessageSquare,
    className: "bg-pink-500/10 text-pink-700",
  },

  system: {
    label: "System",
    icon: Settings2,
    className: "bg-surface-muted/10 text-surface-muted",
  },
};

/* ============================================================
   HELPERS
============================================================ */

function inferActivityType(item) {
  if (item.type) {
    return item.type.toLowerCase();
  }

  const text = item.text?.toLowerCase() || "";

  if (
    text.includes("task") ||
    text.includes("completed") ||
    text.includes("assigned")
  ) {
    return "task";
  }

  if (
    text.includes("project") ||
    text.includes("created project") ||
    text.includes("updated project")
  ) {
    return "project";
  }

  if (
    text.includes("approval") ||
    text.includes("approved") ||
    text.includes("review")
  ) {
    return "approval";
  }

  if (
    text.includes("user") ||
    text.includes("member") ||
    text.includes("invited") ||
    text.includes("joined")
  ) {
    return "user";
  }

  if (
    text.includes("file") ||
    text.includes("upload") ||
    text.includes("uploaded")
  ) {
    return "file";
  }

  if (
    text.includes("comment") ||
    text.includes("message") ||
    text.includes("mentioned")
  ) {
    return "comment";
  }

  return "system";
}

function getActivityUser(item) {
  if (item.userId) {
    return getTeamMemberById(item.userId);
  }

  if (item.actorId) {
    return getTeamMemberById(item.actorId);
  }

  if (item.staffId) {
    return getTeamMemberById(item.staffId);
  }

  return null;
}

function getActivityProject(item) {
  if (item.projectId) {
    return getProjectById(item.projectId);
  }

  return null;
}

function formatActivityDate(timestamp) {
  if (!timestamp) {
    return "Recently";
  }

  return timestamp;
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
   TYPE BADGE
============================================================ */

function ActivityTypeBadge({ type }) {
  const config =
    TYPE_CONFIG[type] || TYPE_CONFIG.system;

  const Icon = config.icon;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[0.65rem] font-semibold",
        config.className
      )}
    >
      <Icon className="h-3 w-3" />
      {config.label}
    </span>
  );
}

/* ============================================================
   USER AVATAR
============================================================ */

function UserAvatar({ user }) {
  if (!user) {
    return (
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-surface-bg text-surface-muted">
        <Users className="h-4 w-4" />
      </div>
    );
  }

  return (
    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-orange/10 text-xs font-bold text-brand-orange">
      {user.initials}
    </div>
  );
}

/* ============================================================
   ACTIVITY ROW
============================================================ */

function ActivityRow({ item }) {
  const type = inferActivityType(item);
  const user = getActivityUser(item);
  const project = getActivityProject(item);

  return (
    <div className="group flex gap-4 px-6 py-5 transition hover:bg-surface-bg/50">
      {/* Timeline */}
      <div className="relative flex flex-col items-center">
        <UserAvatar user={user} />

        <div className="absolute left-1/2 top-11 h-[calc(100%+20px)] w-px -translate-x-1/2 bg-surface-border group-last:hidden" />
      </div>

      {/* Content */}
      <div className="min-w-0 flex-1">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <p className="text-sm font-semibold text-surface-fg">
                {user?.name || "System"}
              </p>

              <ActivityTypeBadge type={type} />
            </div>

            <p className="mt-1 text-sm leading-6 text-surface-fg">
              {item.text || "Activity recorded in the system."}
            </p>
          </div>

          <span className="shrink-0 text-xs text-surface-muted">
            {formatActivityDate(item.timestamp)}
          </span>
        </div>

        {/* Context */}
        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2">
          {project && (
            <div className="flex items-center gap-1.5 text-xs text-surface-muted">
              <FolderKanban className="h-3.5 w-3.5" />

              <span>{project.name}</span>
            </div>
          )}

          {user?.role && (
            <div className="flex items-center gap-1.5 text-xs text-surface-muted">
              <UserRoundCog className="h-3.5 w-3.5" />

              <span>{user.role}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   FILTER BAR
============================================================ */

function FilterBar({
  search,
  setSearch,
  activeType,
  setActiveType,
  activeUser,
  setActiveUser,
}) {
  const [showFilters, setShowFilters] = useState(false);

  const hasFilters =
    activeType !== "all" ||
    activeUser !== "all";

  function clearFilters() {
    setActiveType("all");
    setActiveUser("all");
    setSearch("");
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        {/* Search */}
        <div className="relative w-full lg:max-w-md">
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

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() =>
              setShowFilters((value) => !value)
            }
            className={cn(
              "inline-flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-semibold transition",
              showFilters || hasFilters
                ? "border-brand-orange bg-brand-orange/5 text-brand-orange"
                : "border-surface-border text-surface-fg hover:border-brand-orange hover:text-brand-orange"
            )}
          >
            <Filter className="h-4 w-4" />
            Filters

            {hasFilters && (
              <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-brand-orange px-1 text-[0.65rem] text-white">
                {(activeType !== "all" ? 1 : 0) +
                  (activeUser !== "all" ? 1 : 0)}
              </span>
            )}
          </button>

          {hasFilters && (
            <button
              type="button"
              onClick={clearFilters}
              className="inline-flex items-center gap-1.5 px-2 text-xs font-semibold text-surface-muted hover:text-surface-fg"
            >
              <X className="h-3.5 w-3.5" />
              Clear
            </button>
          )}
        </div>
      </div>

      {showFilters && (
        <div className="brand-card grid gap-5 sm:grid-cols-2">
          {/* Activity Type */}
          <div>
            <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.1em] text-surface-muted">
              Activity Type
            </label>

            <div className="relative">
              <select
                value={activeType}
                onChange={(event) =>
                  setActiveType(event.target.value)
                }
                className="brand-input w-full appearance-none pr-9"
              >
                {ACTIVITY_TYPES.map((type) => (
                  <option
                    key={type.id}
                    value={type.id}
                  >
                    {type.label}
                  </option>
                ))}
              </select>

              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-surface-muted" />
            </div>
          </div>

          {/* User */}
          <div>
            <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.1em] text-surface-muted">
              Team Member
            </label>

            <div className="relative">
              <select
                value={activeUser}
                onChange={(event) =>
                  setActiveUser(event.target.value)
                }
                className="brand-input w-full appearance-none pr-9"
              >
                <option value="all">
                  Everyone
                </option>

                {teamMembers.map((member) => (
                  <option
                    key={member.id}
                    value={member.id}
                  >
                    {member.name}
                  </option>
                ))}
              </select>

              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-surface-muted" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ============================================================
   PAGE
============================================================ */

export default function AdminActivity() {
  const [search, setSearch] = useState("");
  const [activeType, setActiveType] = useState("all");
  const [activeUser, setActiveUser] = useState("all");
  const [visibleCount, setVisibleCount] = useState(15);

  /*
   * Normalize the existing mock activity data.
   */
  const activity = useMemo(() => {
    return [...(staffActivity || [])].map(
      (item, index) => ({
        ...item,
        _id:
          item.id ||
          `activity-${index}`,
        _type: inferActivityType(item),
        _user: getActivityUser(item),
        _project: getActivityProject(item),
      })
    );
  }, []);

  /*
   * Filtering
   */
  const filteredActivity = useMemo(() => {
    const query = search.trim().toLowerCase();

    return activity.filter((item) => {
      const matchesSearch =
        !query ||
        item.text?.toLowerCase().includes(query) ||
        item._user?.name
          ?.toLowerCase()
          .includes(query) ||
        item._project?.name
          ?.toLowerCase()
          .includes(query);

      const matchesType =
        activeType === "all" ||
        item._type === activeType;

      const matchesUser =
        activeUser === "all" ||
        item._user?.id === activeUser;

      return (
        matchesSearch &&
        matchesType &&
        matchesUser
      );
    });
  }, [
    activity,
    search,
    activeType,
    activeUser,
  ]);

  const visibleActivity =
    filteredActivity.slice(0, visibleCount);

  /* ============================================================
     STATS
  ============================================================ */

  const totalActivity = activity.length;

  const taskActivity = activity.filter(
    (item) => item._type === "task"
  ).length;

  const projectActivity = activity.filter(
    (item) => item._type === "project"
  ).length;

  const userActivity = activity.filter(
    (item) => item._type === "user"
  ).length;

  const activePeople = new Set(
    activity
      .map((item) => item._user?.id)
      .filter(Boolean)
  ).size;

  return (
    <div className="mx-auto max-w-[1400px] animate-fade-up">
      {/* ======================================================
          HEADER
      ====================================================== */}

      <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
        

          <h1 className="font-display text-display-md font-bold tracking-[-0.02em] text-surface-fg">
            Activity
          </h1>

          <p className="mt-2 max-w-2xl text-lead text-surface-muted">
            Monitor activity across the OCT20FIVE
            workspace, including projects, tasks,
            users, approvals and files.
          </p>
        </div>

        <button
          type="button"
          onClick={() => window.location.reload()}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-surface-border bg-surface-card px-4 py-2.5 text-sm font-semibold text-surface-fg transition hover:border-brand-orange hover:text-brand-orange"
        >
          <RefreshCw className="h-4 w-4" />
          Refresh Activity
        </button>
      </div>

      {/* ======================================================
          STATS
      ====================================================== */}

      <div className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          icon={Activity}
          label="Total Activity"
          value={totalActivity}
          description="Recorded workspace events"
        />

        <StatCard
          icon={CheckCircle2}
          label="Task Activity"
          value={taskActivity}
          description="Task related events"
        />

        <StatCard
          icon={FolderKanban}
          label="Project Activity"
          value={projectActivity}
          description="Project related events"
        />

        <StatCard
          icon={Users}
          label="Active People"
          value={activePeople}
          description="People generating activity"
        />
      </div>

      {/* ======================================================
          ACTIVITY SECTION
      ====================================================== */}

      <section>
        <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="font-display text-lg font-bold text-surface-fg">
              Workspace Activity
            </h2>

            <p className="mt-1 text-sm text-surface-muted">
              Everything happening across the
              organisation.
            </p>
          </div>

          <span className="text-xs font-medium text-surface-muted">
            {filteredActivity.length}{" "}
            {filteredActivity.length === 1
              ? "event"
              : "events"}
          </span>
        </div>

        {/* Filters */}
        <div className="mb-5">
          <FilterBar
            search={search}
            setSearch={setSearch}
            activeType={activeType}
            setActiveType={setActiveType}
            activeUser={activeUser}
            setActiveUser={setActiveUser}
          />
        </div>

        {/* Activity List */}
        {visibleActivity.length === 0 ? (
          <EmptyState
            title="No Activity Found"
            description="There are no activity events matching the current filters."
          />
        ) : (
          <>
            <div className="brand-card overflow-hidden p-0">
              {visibleActivity.map((item) => (
                <ActivityRow
                  key={item._id}
                  item={item}
                />
              ))}
            </div>

            {/* Load more */}
            {visibleCount <
              filteredActivity.length && (
              <div className="mt-5 flex justify-center">
                <button
                  type="button"
                  onClick={() =>
                    setVisibleCount(
                      (count) => count + 15
                    )
                  }
                  className="inline-flex items-center gap-2 rounded-xl border border-surface-border bg-surface-card px-5 py-2.5 text-sm font-semibold text-surface-fg transition hover:border-brand-orange hover:text-brand-orange"
                >
                  Load More
                  <ArrowUpRight className="h-4 w-4" />
                </button>
              </div>
            )}
          </>
        )}
      </section>

      {/* ======================================================
          ADMIN NOTE
      ====================================================== */}

      <div className="mt-8 rounded-2xl border border-brand-orange/20 bg-brand-orange/5 p-5">
        <div className="flex gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand-orange/10 text-brand-orange">
            <ShieldCheck className="h-4 w-4" />
          </div>

          <div>
            <p className="text-sm font-semibold text-surface-fg">
              Administrator activity log
            </p>

            <p className="mt-1 text-xs leading-5 text-surface-muted">
              This view is intended for administrators
              and provides organisation-wide visibility.
              Individual staff members should use their
              own activity page for personal activity.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}