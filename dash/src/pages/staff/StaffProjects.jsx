import { useMemo, useState } from "react";
import {
  Search,
  List,
  LayoutGrid,
  GanttChart,
  CalendarDays,
  ArrowRight,
  CheckCircle2,
  Clock3,
  AlertTriangle,
} from "lucide-react";

import { projects, clients } from "@/data/mockData";
import StaffProjectRow from "@/components/project/StaffProjectRow";
import StaffProjectCard from "@/components/project/StaffProjectCard";
import EmptyState from "@/components/shared/EmptyState";
import { cn } from "@/lib/utils";

const STATUS_FILTERS = [
  { id: "all", label: "All" },
  { id: "active", label: "Active" },
  { id: "at-risk", label: "At Risk" },
  { id: "client-review", label: "Client Review" },
  { id: "completed", label: "Completed" },
];

const VIEW_MODES = [
  {
    id: "table",
    label: "Table",
    icon: List,
  },
  {
    id: "cards",
    label: "Cards",
    icon: LayoutGrid,
  },
  {
    id: "timeline",
    label: "Timeline",
    icon: GanttChart,
  },
];

function getProjectStatus(project) {
  if (project.status === "completed") {
    return {
      label: "Completed",
      className: "bg-emerald-500/10 text-emerald-600",
      icon: CheckCircle2,
    };
  }

  if (project.status === "blocked" || project.attentionReason) {
    return {
      label: "At Risk",
      className: "bg-red-500/10 text-red-600",
      icon: AlertTriangle,
    };
  }

  if (project.status === "client-review") {
    return {
      label: "Client Review",
      className: "bg-brand-orange/10 text-brand-orange",
      icon: Clock3,
    };
  }

  return {
    label: "In Progress",
    className: "bg-blue-500/10 text-blue-600",
    icon: Clock3,
  };
}

function TimelineProject({ project, index }) {
  const status = getProjectStatus(project);
  const StatusIcon = status.icon;

  return (
    <div className="relative flex gap-5">
      {/* Timeline line */}
      <div className="relative flex w-10 shrink-0 justify-center">
        {index !== 0 && <div className="absolute bottom-1/2 top-0 w-px bg-surface-border" />}

        {index !== 0 && <div className="absolute bottom-0 top-1/2 w-px bg-surface-border" />}

        <div
          className={cn(
            "relative z-10 mt-1 flex h-10 w-10 items-center justify-center rounded-full border-4 border-surface-bg",
            project.status === "completed"
              ? "bg-emerald-500/10 text-emerald-600"
              : "bg-brand-orange/10 text-brand-orange"
          )}
        >
          <CalendarDays className="h-4 w-4" />
        </div>
      </div>

      {/* Project */}
      <div className="mb-5 min-w-0 flex-1">
        <div className="brand-card transition-all duration-200 hover:border-brand-orange/30">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="font-display text-base font-bold text-surface-fg">{project.name}</h3>

                <span
                  className={cn(
                    "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[0.65rem] font-semibold",
                    status.className
                  )}
                >
                  <StatusIcon className="h-3 w-3" />
                  {status.label}
                </span>
              </div>

              <p className="mt-1 text-xs text-surface-muted">{project.clientName}</p>

              {project.description && (
                <p className="mt-3 max-w-2xl text-sm leading-6 text-surface-muted">
                  {project.description}
                </p>
              )}
            </div>

            <div className="shrink-0">
              <p className="text-[0.65rem] font-semibold uppercase tracking-[0.12em] text-surface-muted">
                Deadline
              </p>

              <p className="mt-1 flex items-center gap-1.5 text-sm font-bold text-surface-fg">
                <CalendarDays className="h-3.5 w-3.5 text-brand-orange" />
                {project.deadline}
              </p>
            </div>
          </div>

          {/* Progress */}
          <div className="mt-6">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-[0.65rem] font-semibold uppercase tracking-[0.12em] text-surface-muted">
                Progress
              </span>

              <span className="text-sm font-bold text-surface-fg">{project.progress}%</span>
            </div>

            <div className="h-2 overflow-hidden rounded-full bg-surface-border">
              <div
                className="h-full rounded-full bg-brand-orange transition-all duration-500"
                style={{
                  width: `${project.progress}%`,
                }}
              />
            </div>
          </div>

          {/* Bottom information */}
          <div className="mt-5 flex flex-col gap-4 border-t border-surface-border pt-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap gap-2">
              {project.services?.map((service) => (
                <span
                  key={service}
                  className="rounded-lg bg-surface-muted/5 px-2.5 py-1.5 text-[0.65rem] font-semibold text-surface-muted"
                >
                  {service}
                </span>
              ))}
            </div>

            <div className="flex items-center gap-4 text-xs text-surface-muted">
              <span>
                {project.completedDeliverables}/{project.totalDeliverables} deliverables
              </span>

              <ArrowRight className="h-3.5 w-3.5" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function TimelineView({ projects }) {
  const sortedProjects = [...projects].sort((a, b) => {
    if (a.status === "completed" && b.status !== "completed") {
      return 1;
    }

    if (a.status !== "completed" && b.status === "completed") {
      return -1;
    }

    return b.progress - a.progress;
  });

  return (
    <div className="rounded-2xl border border-surface-border bg-surface-card p-5 sm:p-6">
      <div className="mb-7">
        <p className="text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-brand-orange">
          Project Timeline
        </p>

        <h2 className="mt-1 font-display text-lg font-bold text-surface-fg">
          Current delivery timeline
        </h2>

        <p className="mt-1 text-sm text-surface-muted">
          Follow the progress and deadlines of all projects currently being worked on.
        </p>
      </div>

      <div>
        {sortedProjects.map((project, index) => (
          <TimelineProject key={project.id} project={project} index={index} />
        ))}
      </div>
    </div>
  );
}

function ViewToggle({ view, setView }) {
  return (
    <div className="inline-flex rounded-xl border border-surface-border bg-surface-bg p-1">
      {VIEW_MODES.map((mode) => {
        const Icon = mode.icon;
        const active = view === mode.id;

        return (
          <button
            key={mode.id}
            type="button"
            onClick={() => setView(mode.id)}
            className={cn(
              "inline-flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold transition-all",
              active
                ? "bg-surface-card text-surface-fg shadow-sm"
                : "text-surface-muted hover:text-surface-fg"
            )}
          >
            <Icon className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">{mode.label}</span>
          </button>
        );
      })}
    </div>
  );
}

export default function StaffProjects() {
  const [statusFilter, setStatusFilter] = useState("all");
  const [clientFilter, setClientFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [view, setView] = useState("table");

  const filtered = useMemo(() => {
    return projects.filter((project) => {
      const matchesStatus =
        statusFilter === "all"
          ? true
          : statusFilter === "active"
            ? project.status !== "completed"
            : statusFilter === "at-risk"
              ? project.status === "blocked" || Boolean(project.attentionReason)
              : project.status === statusFilter;

      const matchesClient = clientFilter === "all" ? true : project.clientId === clientFilter;

      const query = search.toLowerCase();

      const matchesSearch =
        !query ||
        project.name?.toLowerCase().includes(query) ||
        project.clientName?.toLowerCase().includes(query) ||
        project.services?.some((service) => service.toLowerCase().includes(query));

      return matchesStatus && matchesClient && matchesSearch;
    });
  }, [statusFilter, clientFilter, search]);

  return (
    <div className="mx-auto max-w-[1320px] animate-fade-up">
      {/* Header */}
      <div className="mb-8 flex flex-col gap-6 sm:mb-9 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="font-display text-display-md font-bold tracking-[-0.02em] text-surface-fg">
            Projects
          </h1>

          <p className="mt-2 text-lead text-surface-muted">
            Everything currently being worked on by OCT20FIVE.
          </p>
        </div>

        <ViewToggle view={view} setView={setView} />
      </div>

      {/* Filters */}
      <div className="mb-7 flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex flex-wrap gap-2">
          {STATUS_FILTERS.map((filter) => (
            <button
              key={filter.id}
              type="button"
              onClick={() => setStatusFilter(filter.id)}
              className={cn("pill", statusFilter === filter.id && "pill-active")}
            >
              {filter.label}
            </button>
          ))}
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          {/* Search */}
          <div className="relative w-full sm:w-[240px]">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-surface-muted" />

            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search projects..."
              className="brand-input w-full pl-9"
            />
          </div>

          {/* Client */}
          <select
            value={clientFilter}
            onChange={(event) => setClientFilter(event.target.value)}
            className="brand-input w-full min-w-[180px] py-2.5 text-sm sm:w-auto"
          >
            <option value="all">All Clients</option>

            {clients.map((client) => (
              <option key={client.id} value={client.id}>
                {client.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Result count */}
      <div className="mb-4 flex items-center justify-between">
        <p className="text-xs text-surface-muted">
          Showing <span className="font-semibold text-surface-fg">{filtered.length}</span>{" "}
          {filtered.length === 1 ? "project" : "projects"}
        </p>
      </div>

      {/* Empty */}
      {filtered.length === 0 ? (
        <EmptyState
          title="No Projects Match These Filters"
          description="Try a different status, client, or search term."
        />
      ) : (
        <>
          {/* TABLE */}
          {view === "table" && (
            <div className="brand-card overflow-x-auto p-0">
              <table className="w-full min-w-[900px] border-collapse">
                <thead>
                  <tr className="border-b border-surface-border text-left text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-surface-muted">
                    <th className="px-6 py-4">Project</th>

                    <th className="py-4 pr-4">Client</th>

                    <th className="py-4 pr-4">Services</th>

                    <th className="py-4 pr-4">Progress</th>

                    <th className="py-4 pr-4">Status</th>

                    <th className="py-4 pr-4">Team</th>

                    <th className="py-4 pr-4">Deadline</th>

                    <th className="py-4 pr-4">Last Update</th>

                    <th className="py-4 pl-2" />
                  </tr>
                </thead>

                <tbody>
                  {filtered.map((project) => (
                    <StaffProjectRow key={project.id} project={project} />
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* CARDS */}
          {view === "cards" && (
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {filtered.map((project) => (
                <StaffProjectCard key={project.id} project={project} />
              ))}
            </div>
          )}

          {/* TIMELINE */}
          {view === "timeline" && <TimelineView projects={filtered} />}
        </>
      )}
    </div>
  );
}
