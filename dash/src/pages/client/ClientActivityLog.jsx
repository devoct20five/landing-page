import {
  Activity,
  ArrowDownLeft,
  ArrowUpRight,
  CheckCircle2,
  Clock3,
  Download,
  Eye,
  FileCheck2,
  FileText,
  Filter,
  MessageSquare,
  MoreHorizontal,
  Paperclip,
  Receipt,
  Search,
  Upload,
  User,
  Wallet,
} from "lucide-react";
import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";

/* ============================================================
   MOCK DATA
============================================================ */

const activities = [
  {
    id: "activity-001",
    type: "approval",
    action: "submitted",
    title: "Hero Campaign Film — Final Cut submitted for approval",
    description: "Rahul Mehta submitted version v4.2 of the final campaign film for your review.",
    actor: "Rahul Mehta",
    role: "Editor",
    initials: "RM",
    project: "Summer Campaign 2026",
    timestamp: "Today · 4:32 PM",
    dateGroup: "Today",
    metadata: "Version v4.2",
  },

  {
    id: "activity-002",
    type: "comment",
    action: "commented",
    title: "New comment on Hero Campaign Film",
    description: "The music has been reduced around 00:42 as requested.",
    actor: "Rahul Mehta",
    role: "Editor",
    initials: "RM",
    project: "Summer Campaign 2026",
    timestamp: "Today · 5:36 PM",
    dateGroup: "Today",
    metadata: "Approval · v4.2",
  },

  {
    id: "activity-003",
    type: "file",
    action: "uploaded",
    title: "Homepage Design — Final uploaded",
    description: "Priya Nair uploaded the latest homepage design incorporating your feedback.",
    actor: "Priya Nair",
    role: "Designer",
    initials: "PN",
    project: "Website Redesign",
    timestamp: "Today · 2:18 PM",
    dateGroup: "Today",
    metadata: "homepage-final-v3.1.fig",
  },

  {
    id: "activity-004",
    type: "approval",
    action: "approved",
    title: "August Social Content Batch approved",
    description: "You approved the August social content batch.",
    actor: "You",
    role: "Client",
    initials: "DV",
    project: "Social Content Retainer",
    timestamp: "Yesterday · 6:12 PM",
    dateGroup: "Yesterday",
    metadata: "Version v1.5",
    own: true,
  },

  {
    id: "activity-005",
    type: "billing",
    action: "payment",
    title: "Payment received",
    description: "Payment of ₹95,000 was successfully credited against invoice INV-2026-006.",
    actor: "You",
    role: "Client",
    initials: "DV",
    project: "Website Redesign",
    timestamp: "24 Aug 2026 · 11:24 AM",
    dateGroup: "24 Aug 2026",
    metadata: "₹95,000 · UPI",
    own: true,
  },

  {
    id: "activity-006",
    type: "file",
    action: "uploaded",
    title: "Campaign storyboard uploaded",
    description: "Rahul Mehta uploaded a revised storyboard for your review.",
    actor: "Rahul Mehta",
    role: "Editor",
    initials: "RM",
    project: "Summer Campaign 2026",
    timestamp: "23 Aug 2026 · 3:45 PM",
    dateGroup: "23 Aug 2026",
    metadata: "storyboard-v2.pdf",
  },

  {
    id: "activity-007",
    type: "comment",
    action: "commented",
    title: "You left feedback on Homepage Design",
    description:
      "Please increase the spacing between the hero section and the first content block.",
    actor: "You",
    role: "Client",
    initials: "DV",
    project: "Website Redesign",
    timestamp: "22 Aug 2026 · 10:18 AM",
    dateGroup: "22 Aug 2026",
    metadata: "Design feedback",
    own: true,
  },

  {
    id: "activity-008",
    type: "approval",
    action: "approved",
    title: "Hero Film — Creative Direction approved",
    description: "You approved the creative direction and storyboard.",
    actor: "You",
    role: "Client",
    initials: "DV",
    project: "Summer Campaign 2026",
    timestamp: "21 Aug 2026 · 7:02 PM",
    dateGroup: "21 Aug 2026",
    metadata: "Version v1.0",
    own: true,
  },
];

/* ============================================================
   PAGE
============================================================ */

export default function ClientActivityLog() {
  const [filter, setFilter] = useState("all");
  const [project, setProject] = useState("all");
  const [search, setSearch] = useState("");

  const filteredActivities = useMemo(() => {
    return activities.filter((activity) => {
      const matchesType = filter === "all" || activity.type === filter;

      const matchesProject = project === "all" || activity.project === project;

      const query = search.toLowerCase().trim();

      const matchesSearch =
        !query ||
        activity.title.toLowerCase().includes(query) ||
        activity.description.toLowerCase().includes(query) ||
        activity.actor.toLowerCase().includes(query);

      return matchesType && matchesProject && matchesSearch;
    });
  }, [filter, project, search]);

  const groupedActivities = filteredActivities.reduce((groups, activity) => {
    if (!groups[activity.dateGroup]) {
      groups[activity.dateGroup] = [];
    }

    groups[activity.dateGroup].push(activity);

    return groups;
  }, {});

  return (
    <div className="min-h-full bg-surface-bg">
      {/* ======================================================
          HEADER
      ====================================================== */}

      <div className="border-b border-surface-border">
        <div className="mx-auto max-w-7xl px-6 py-8 lg:px-8">
          <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
            <div>
              <div className="mb-3 flex items-center gap-2">
                <Activity className="h-4 w-4 text-brand-orange" />

                <span className="text-[0.65rem] font-bold uppercase tracking-[0.16em] text-brand-orange">
                  Workspace Activity
                </span>
              </div>

              <h1 className="font-display text-3xl font-bold tracking-[-0.04em] text-surface-fg sm:text-4xl">
                Activity Log
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-surface-muted">
                Follow project updates, deliverables, approvals, comments and billing activity
                across your workspace.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="rounded-xl border border-surface-border bg-surface-card px-4 py-2.5">
                <div className="flex items-center gap-2">
                  <Activity className="h-4 w-4 text-brand-orange" />

                  <div>
                    <p className="text-[0.6rem] font-bold uppercase tracking-[0.1em] text-surface-muted">
                      Total Activity
                    </p>

                    <p className="font-display text-lg font-bold leading-none text-surface-fg">
                      {activities.length}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ======================================================
          CONTENT
      ====================================================== */}

      <main className="mx-auto max-w-7xl px-6 py-8 lg:px-8">
        {/* ==================================================
            FILTER BAR
        ================================================== */}

        <section className="rounded-2xl border border-surface-border bg-surface-card p-4">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            {/* Search */}

            <div className="relative w-full lg:max-w-sm">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-surface-muted" />

              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search activity..."
                className="w-full rounded-xl border border-surface-border bg-surface-bg py-2.5 pl-9 pr-4 text-xs font-medium text-surface-fg outline-none transition-colors placeholder:text-surface-muted focus:border-brand-orange/50"
              />
            </div>

            <div className="flex flex-col gap-2 sm:flex-row">
              {/* Activity filter */}

              <div className="relative">
                <Filter className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-surface-muted" />

                <select
                  value={filter}
                  onChange={(event) => setFilter(event.target.value)}
                  className="appearance-none rounded-xl border border-surface-border bg-surface-bg py-2.5 pl-9 pr-9 text-xs font-semibold text-surface-fg outline-none focus:border-brand-orange/50"
                >
                  <option value="all">All activity</option>
                  <option value="approval">Approvals</option>
                  <option value="comment">Comments</option>
                  <option value="file">Files</option>
                  <option value="billing">Billing</option>
                </select>
              </div>

              {/* Project filter */}

              <select
                value={project}
                onChange={(event) => setProject(event.target.value)}
                className="appearance-none rounded-xl border border-surface-border bg-surface-bg px-4 py-2.5 text-xs font-semibold text-surface-fg outline-none focus:border-brand-orange/50"
              >
                <option value="all">All projects</option>
                <option value="Summer Campaign 2026">Summer Campaign 2026</option>
                <option value="Website Redesign">Website Redesign</option>
                <option value="Social Content Retainer">Social Content Retainer</option>
              </select>
            </div>
          </div>
        </section>

        {/* ==================================================
            ACTIVITY TIMELINE
        ================================================== */}

        <div className="mt-8">
          {Object.keys(groupedActivities).length > 0 ? (
            <div className="space-y-10">
              {Object.entries(groupedActivities).map(([date, items]) => (
                <ActivityGroup key={date} date={date} activities={items} />
              ))}
            </div>
          ) : (
            <EmptyActivityState />
          )}
        </div>
      </main>
    </div>
  );
}

/* ============================================================
   ACTIVITY GROUP
============================================================ */

function ActivityGroup({ date, activities }) {
  return (
    <section>
      <div className="mb-5 flex items-center gap-3">
        <h2 className="font-display text-sm font-bold text-surface-fg">{date}</h2>

        <div className="h-px flex-1 bg-surface-border" />

        <span className="text-[0.6rem] font-medium text-surface-muted">
          {activities.length} {activities.length === 1 ? "activity" : "activities"}
        </span>
      </div>

      <div className="relative">
        {/* Vertical line */}

        <div className="absolute bottom-5 left-[20px] top-5 w-px bg-surface-border" />

        <div className="space-y-3">
          {activities.map((activity) => (
            <ActivityItem key={activity.id} activity={activity} />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   ACTIVITY ITEM
============================================================ */

function ActivityItem({ activity }) {
  const config = getActivityConfig(activity.type);

  const Icon = config.icon;

  return (
    <article className="group relative flex gap-4">
      {/* Timeline icon */}

      <div className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-surface-border bg-surface-card">
        <div
          className={cn(
            "flex h-7 w-7 items-center justify-center rounded-lg",
            config.iconBackground
          )}
        >
          <Icon className={cn("h-3.5 w-3.5", config.iconColor)} />
        </div>
      </div>

      {/* Activity card */}

      <div className="min-w-0 flex-1 rounded-2xl border border-surface-border bg-surface-card p-5 transition-colors hover:border-surface-muted">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            {/* Top metadata */}

            <div className="flex flex-wrap items-center gap-2">
              <span
                className={cn(
                  "rounded-full px-2 py-1 text-[0.55rem] font-bold uppercase tracking-[0.08em]",
                  config.badgeBackground,
                  config.badgeColor
                )}
              >
                {config.label}
              </span>

              <span className="text-[0.6rem] text-surface-muted">{activity.timestamp}</span>
            </div>

            {/* Title */}

            <h3 className="mt-2 text-sm font-bold leading-5 text-surface-fg">{activity.title}</h3>

            {/* Description */}

            <p className="mt-1.5 max-w-3xl text-xs leading-5 text-surface-muted">
              {activity.description}
            </p>

            {/* Metadata */}

            <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2">
              <div className="flex items-center gap-2">
                <div
                  className={cn(
                    "flex h-6 w-6 items-center justify-center rounded-full text-[0.5rem] font-bold",
                    activity.own ? "bg-brand-orange text-white" : "bg-surface-bg text-surface-fg"
                  )}
                >
                  {activity.initials}
                </div>

                <span className="text-[0.65rem] font-semibold text-surface-fg">
                  {activity.actor}
                </span>

                <span className="text-[0.6rem] text-surface-muted">· {activity.role}</span>
              </div>

              <span className="text-[0.6rem] text-surface-muted">{activity.project}</span>

              <span className="rounded-md bg-surface-bg px-2 py-1 text-[0.55rem] font-semibold text-surface-muted">
                {activity.metadata}
              </span>
            </div>
          </div>

          {/* Action */}

          <button className="shrink-0 self-start rounded-lg p-2 text-surface-muted opacity-100 transition-colors hover:bg-surface-bg hover:text-surface-fg sm:opacity-0 sm:group-hover:opacity-100">
            <MoreHorizontal className="h-4 w-4" />
          </button>
        </div>

        {/* Context action */}

        <ActivityAction type={activity.type} />
      </div>
    </article>
  );
}

/* ============================================================
   ACTIVITY ACTION
============================================================ */

function ActivityAction({ type }) {
  if (type === "approval") {
    return (
      <div className="mt-4 border-t border-surface-border pt-3">
        <button className="inline-flex items-center gap-2 text-[0.65rem] font-bold text-surface-muted transition-colors hover:text-brand-orange">
          <Eye className="h-3.5 w-3.5" />
          View Approval
        </button>
      </div>
    );
  }

  if (type === "file") {
    return (
      <div className="mt-4 border-t border-surface-border pt-3">
        <button className="inline-flex items-center gap-2 text-[0.65rem] font-bold text-surface-muted transition-colors hover:text-brand-orange">
          <Download className="h-3.5 w-3.5" />
          View File
        </button>
      </div>
    );
  }

  if (type === "comment") {
    return (
      <div className="mt-4 border-t border-surface-border pt-3">
        <button className="inline-flex items-center gap-2 text-[0.65rem] font-bold text-surface-muted transition-colors hover:text-brand-orange">
          <MessageSquare className="h-3.5 w-3.5" />
          View Conversation
        </button>
      </div>
    );
  }

  if (type === "billing") {
    return (
      <div className="mt-4 border-t border-surface-border pt-3">
        <button className="inline-flex items-center gap-2 text-[0.65rem] font-bold text-surface-muted transition-colors hover:text-brand-orange">
          <Receipt className="h-3.5 w-3.5" />
          View Payment
        </button>
      </div>
    );
  }

  return null;
}

/* ============================================================
   ACTIVITY CONFIG
============================================================ */

function getActivityConfig(type) {
  const config = {
    approval: {
      icon: FileCheck2,
      label: "Approval",
      iconBackground: "bg-brand-orange/10",
      iconColor: "text-brand-orange",
      badgeBackground: "bg-brand-orange/10",
      badgeColor: "text-brand-orange",
    },

    comment: {
      icon: MessageSquare,
      label: "Comment",
      iconBackground: "bg-blue-500/10",
      iconColor: "text-blue-600",
      badgeBackground: "bg-blue-500/10",
      badgeColor: "text-blue-600",
    },

    file: {
      icon: Upload,
      label: "File",
      iconBackground: "bg-violet-500/10",
      iconColor: "text-violet-600",
      badgeBackground: "bg-violet-500/10",
      badgeColor: "text-violet-600",
    },

    billing: {
      icon: Wallet,
      label: "Billing",
      iconBackground: "bg-emerald-500/10",
      iconColor: "text-emerald-600",
      badgeBackground: "bg-emerald-500/10",
      badgeColor: "text-emerald-600",
    },
  };

  return config[type] || config.file;
}

/* ============================================================
   EMPTY STATE
============================================================ */

function EmptyActivityState() {
  return (
    <div className="rounded-2xl border border-dashed border-surface-border bg-surface-card px-6 py-16 text-center">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-surface-bg">
        <Activity className="h-5 w-5 text-surface-muted" />
      </div>

      <h2 className="mt-4 font-display text-lg font-bold text-surface-fg">No activity found</h2>

      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-surface-muted">
        Try changing your filters or search terms to find the activity you're looking for.
      </p>
    </div>
  );
}
