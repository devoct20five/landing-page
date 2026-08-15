import { useMemo, useState } from "react";
import {
  Search,
  CalendarDays,
  Clock3,
  MapPin,
  Users,
  Video,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import { events, clients, projects } from "@/data/mockData";
import EmptyState from "@/components/shared/EmptyState";
import { cn } from "@/lib/utils";

const EVENT_FILTERS = [
  { id: "all", label: "All Events" },
  { id: "meeting", label: "Meetings" },
  { id: "review", label: "Reviews" },
  { id: "deadline", label: "Deadlines" },
  { id: "internal", label: "Internal" },
];

function getEventType(event) {
  const type = event.type?.toLowerCase();

  if (type === "meeting") {
    return {
      label: "Meeting",
      className: "bg-blue-500/10 text-blue-600",
    };
  }

  if (type === "review") {
    return {
      label: "Review",
      className: "bg-brand-orange/10 text-brand-orange",
    };
  }

  if (type === "deadline") {
    return {
      label: "Deadline",
      className: "bg-red-500/10 text-red-600",
    };
  }

  return {
    label: "Internal",
    className: "bg-surface-muted/10 text-surface-muted",
  };
}

function EventCard({ event }) {
  const type = getEventType(event);

  return (
    <div className="brand-card transition-all duration-200 hover:-translate-y-0.5 hover:border-brand-orange/30">
      <div className="flex items-start gap-4">
        {/* Date */}
        <div className="flex h-12 w-12 shrink-0 flex-col items-center justify-center rounded-xl bg-brand-orange/10 text-brand-orange">
          <span className="text-[0.6rem] font-bold uppercase tracking-wide">
            {event.month || "AUG"}
          </span>

          <span className="font-display text-lg font-bold leading-none">
            {event.day || "15"}
          </span>
        </div>

        {/* Main */}
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-display text-base font-bold text-surface-fg">
              {event.title}
            </h3>

            <span
              className={cn(
                "rounded-full px-2.5 py-1 text-[0.6rem] font-semibold",
                type.className
              )}
            >
              {type.label}
            </span>
          </div>

          {event.description && (
            <p className="mt-1 text-sm leading-6 text-surface-muted">
              {event.description}
            </p>
          )}

          {/* Meta */}
          <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-xs text-surface-muted">
            {event.time && (
              <span className="flex items-center gap-1.5">
                <Clock3 className="h-3.5 w-3.5" />
                {event.time}
              </span>
            )}

            {event.location && (
              <span className="flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5" />
                {event.location}
              </span>
            )}

            {event.attendees && (
              <span className="flex items-center gap-1.5">
                <Users className="h-3.5 w-3.5" />
                {event.attendees} attendees
              </span>
            )}

            {event.meetingLink && (
              <span className="flex items-center gap-1.5 text-brand-orange">
                <Video className="h-3.5 w-3.5" />
                Online
              </span>
            )}
          </div>

          {/* Project / Client */}
          {(event.clientName || event.projectName) && (
            <div className="mt-4 border-t border-surface-border pt-3">
              <div className="flex flex-wrap gap-2">
                {event.clientName && (
                  <span className="rounded-lg bg-surface-muted/5 px-2.5 py-1.5 text-[0.65rem] font-semibold text-surface-muted">
                    {event.clientName}
                  </span>
                )}

                {event.projectName && (
                  <span className="rounded-lg bg-surface-muted/5 px-2.5 py-1.5 text-[0.65rem] font-semibold text-surface-muted">
                    {event.projectName}
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function AdminEvents() {
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [viewDate, setViewDate] = useState(new Date());

  const filteredEvents = useMemo(() => {
    const query = search.toLowerCase().trim();

    return events.filter((event) => {
      const matchesFilter =
        filter === "all"
          ? true
          : event.type?.toLowerCase() === filter;

      const matchesSearch =
        !query ||
        event.title?.toLowerCase().includes(query) ||
        event.description?.toLowerCase().includes(query) ||
        event.clientName?.toLowerCase().includes(query) ||
        event.projectName?.toLowerCase().includes(query) ||
        event.location?.toLowerCase().includes(query);

      return matchesFilter && matchesSearch;
    });
  }, [filter, search]);

  const monthLabel = viewDate.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  return (
    <div className="mx-auto max-w-[1320px] animate-fade-up">
      {/* Header */}
      <div className="mb-8 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div>
       
          <h1 className="font-display text-display-md font-bold tracking-[-0.02em] text-surface-fg">
            Events
          </h1>

          <p className="mt-2 max-w-2xl text-lead text-surface-muted">
            Manage and monitor all events, meetings, reviews, deadlines, and
            internal activities across OCT20FIVE.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() =>
              setViewDate(
                new Date(
                  viewDate.getFullYear(),
                  viewDate.getMonth() - 1,
                  1
                )
              )
            }
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-surface-border text-surface-muted transition hover:bg-surface-muted/10 hover:text-surface-fg"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>

          <div className="min-w-[150px] text-center font-display text-sm font-bold text-surface-fg">
            {monthLabel}
          </div>

          <button
            type="button"
            onClick={() =>
              setViewDate(
                new Date(
                  viewDate.getFullYear(),
                  viewDate.getMonth() + 1,
                  1
                )
              )
            }
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-surface-border text-surface-muted transition hover:bg-surface-muted/10 hover:text-surface-fg"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Summary */}
      <div className="mb-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="brand-card">
          <div className="flex items-center gap-2 text-surface-muted">
            <CalendarDays className="h-4 w-4" />
            <span className="text-[0.65rem] font-semibold uppercase tracking-[0.12em]">
              Total Events
            </span>
          </div>

          <p className="mt-3 font-display text-2xl font-bold text-surface-fg">
            {events.length}
          </p>
        </div>

        <div className="brand-card">
          <div className="flex items-center gap-2 text-surface-muted">
            <Users className="h-4 w-4" />
            <span className="text-[0.65rem] font-semibold uppercase tracking-[0.12em]">
              Client Events
            </span>
          </div>

          <p className="mt-3 font-display text-2xl font-bold text-surface-fg">
            {
              events.filter(
                (event) => event.clientId || event.clientName
              ).length
            }
          </p>
        </div>

        <div className="brand-card">
          <div className="flex items-center gap-2 text-surface-muted">
            <Clock3 className="h-4 w-4" />
            <span className="text-[0.65rem] font-semibold uppercase tracking-[0.12em]">
              Meetings
            </span>
          </div>

          <p className="mt-3 font-display text-2xl font-bold text-surface-fg">
            {
              events.filter(
                (event) => event.type?.toLowerCase() === "meeting"
              ).length
            }
          </p>
        </div>

        <div className="brand-card">
          <div className="flex items-center gap-2 text-surface-muted">
            <CalendarDays className="h-4 w-4" />
            <span className="text-[0.65rem] font-semibold uppercase tracking-[0.12em]">
              Deadlines
            </span>
          </div>

          <p className="mt-3 font-display text-2xl font-bold text-brand-orange">
            {
              events.filter(
                (event) => event.type?.toLowerCase() === "deadline"
              ).length
            }
          </p>
        </div>
      </div>

      {/* Controls */}
      <div className="mb-7 flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex flex-wrap gap-2">
          {EVENT_FILTERS.map((item) => (
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

        <div className="relative w-full xl:w-[280px]">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-surface-muted" />

          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search events..."
            className="brand-input w-full pl-9"
          />
        </div>
      </div>

      {/* Result count */}
      <div className="mb-4 flex items-center justify-between">
        <p className="text-xs text-surface-muted">
          Showing{" "}
          <span className="font-semibold text-surface-fg">
            {filteredEvents.length}
          </span>{" "}
          {filteredEvents.length === 1 ? "event" : "events"}
        </p>
      </div>

      {/* Events */}
      {filteredEvents.length === 0 ? (
        <EmptyState
          title="No Events Found"
          description="There are no events matching your current filters or search."
        />
      ) : (
        <div className="grid gap-5 lg:grid-cols-2">
          {filteredEvents.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      )}
    </div>
  );
}