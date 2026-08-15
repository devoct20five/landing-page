import {
  CalendarDays,
  Clock3,
  Video,
  ExternalLink,
  Users,
  MapPin,
  Plus,
  CheckCircle2,
  CircleDot,
  MoreHorizontal,
  MessageSquare,
} from "lucide-react";

import { cn } from "@/lib/utils";

const events = [
  {
    id: "event-001",
    title: "Summer Campaign — Final Review",
    description:
      "Final discussion and approval for the Hero Campaign Film before delivery.",
    project: "Summer Campaign 2026",
    date: "18 Aug 2026",
    day: "18",
    month: "AUG",
    time: "11:00 AM",
    duration: "45 min",
    platform: "Google Meet",
    meetingUrl: "https://meet.google.com/abc-defg-hij",
    status: "upcoming",
    organizer: "Sana Iyer",
    organizerRole: "Project Manager",
    attendees: [
      {
        name: "Sana Iyer",
        role: "Project Manager",
        initials: "SI",
        type: "staff",
      },
      {
        name: "Rahul Mehta",
        role: "Editor",
        initials: "RM",
        type: "staff",
      },
      {
        name: "Acme Corporation",
        role: "Client",
        initials: "AC",
        type: "client",
      },
    ],
  },

  {
    id: "event-002",
    title: "Website Redesign — Final QA Discussion",
    description:
      "Walkthrough of the final website QA findings and remaining approval.",
    project: "Website Redesign",
    date: "20 Aug 2026",
    day: "20",
    month: "AUG",
    time: "3:30 PM",
    duration: "30 min",
    platform: "Zoom",
    meetingUrl: "https://zoom.us/j/123456789",
    status: "upcoming",
    organizer: "Dhruv Kapoor",
    organizerRole: "Web Developer",
    attendees: [
      {
        name: "Dhruv Kapoor",
        role: "Web Developer",
        initials: "DK",
        type: "staff",
      },
      {
        name: "Priya Nair",
        role: "Designer",
        initials: "PN",
        type: "staff",
      },
      {
        name: "Acme Corporation",
        role: "Client",
        initials: "AC",
        type: "client",
      },
    ],
  },

  {
    id: "event-003",
    title: "Product Launch — Asset Requirements",
    description:
      "Discussion regarding product photographs, dimensions and brand guidelines.",
    project: "Product Launch",
    date: "22 Aug 2026",
    day: "22",
    month: "AUG",
    time: "12:00 PM",
    duration: "30 min",
    platform: "Google Meet",
    meetingUrl: "https://meet.google.com/product-launch",
    status: "upcoming",
    organizer: "Sana Iyer",
    organizerRole: "Project Manager",
    attendees: [
      {
        name: "Sana Iyer",
        role: "Project Manager",
        initials: "SI",
        type: "staff",
      },
      {
        name: "Arjun Rao",
        role: "3D Artist",
        initials: "AR",
        type: "staff",
      },
      {
        name: "Acme Corporation",
        role: "Client",
        initials: "AC",
        type: "client",
      },
    ],
  },

  {
    id: "event-004",
    title: "August Retainer — Content Planning",
    description:
      "Monthly planning session for the upcoming social content batch.",
    project: "Social Content Retainer",
    date: "05 Aug 2026",
    day: "05",
    month: "AUG",
    time: "4:00 PM",
    duration: "45 min",
    platform: "Google Meet",
    meetingUrl: "https://meet.google.com/retainer-planning",
    status: "completed",
    organizer: "Sana Iyer",
    organizerRole: "Project Manager",
    attendees: [
      {
        name: "Sana Iyer",
        role: "Project Manager",
        initials: "SI",
        type: "staff",
      },
      {
        name: "Acme Corporation",
        role: "Client",
        initials: "AC",
        type: "client",
      },
    ],
  },

  {
    id: "event-005",
    title: "Hero Film — Creative Direction",
    description:
      "Creative direction discussion for the campaign film.",
    project: "Summer Campaign 2026",
    date: "29 Jul 2026",
    day: "29",
    month: "JUL",
    time: "2:00 PM",
    duration: "60 min",
    platform: "Zoom",
    meetingUrl: "https://zoom.us/j/987654321",
    status: "completed",
    organizer: "Rahul Mehta",
    organizerRole: "Editor",
    attendees: [
      {
        name: "Rahul Mehta",
        role: "Editor",
        initials: "RM",
        type: "staff",
      },
      {
        name: "Sana Iyer",
        role: "Project Manager",
        initials: "SI",
        type: "staff",
      },
      {
        name: "Acme Corporation",
        role: "Client",
        initials: "AC",
        type: "client",
      },
    ],
  },
];

export default function ClientEvents() {
  const upcomingEvents = events.filter(
    (event) => event.status === "upcoming"
  );

  const pastEvents = events.filter(
    (event) => event.status === "completed"
  );

  return (
    <div className="min-h-full bg-surface-bg">
      {/* =====================================================
          HEADER
      ===================================================== */}
      <div className="border-b border-surface-border">
        <div className="mx-auto max-w-7xl px-6 py-8 lg:px-8">
          <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
            <div>
           

              <h1 className="font-display text-3xl font-bold tracking-[-0.04em] text-surface-fg sm:text-4xl">
                Events & Meetings
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-surface-muted">
                Join scheduled discussions with the OCT20FIVE team, review
                project progress and stay aligned on upcoming deliverables.
              </p>
            </div>

            <button
              className={cn(
                "inline-flex items-center justify-center gap-2 rounded-xl",
                "bg-brand-orange px-4 py-2.5 text-sm font-semibold text-white",
                "shadow-[0_10px_24px_-8px_rgba(255,90,31,0.45)]",
                "transition-all duration-200 hover:translate-y-[-1px]"
              )}
            >
              <Plus className="h-4 w-4" />
              Request a Meeting
            </button>
          </div>
        </div>
      </div>

      {/* =====================================================
          CONTENT
      ===================================================== */}
      <div className="mx-auto max-w-7xl px-6 py-8 lg:px-8">
        {/* ===================================================
            NEXT MEETING
        =================================================== */}
        {upcomingEvents.length > 0 && (
          <section className="mb-10">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="font-display text-lg font-bold tracking-[-0.02em] text-surface-fg">
                  Upcoming Meetings
                </h2>

                <p className="mt-1 text-sm text-surface-muted">
                  Your next scheduled discussions with the team.
                </p>
              </div>

              <div className="hidden items-center gap-2 text-xs font-medium text-surface-muted sm:flex">
                <CircleDot className="h-3.5 w-3.5 text-brand-orange" />
                {upcomingEvents.length} scheduled
              </div>
            </div>

            <div className="space-y-4">
              {upcomingEvents.map((event, index) => (
                <EventCard
                  key={event.id}
                  event={event}
                  featured={index === 0}
                />
              ))}
            </div>
          </section>
        )}

        {/* ===================================================
            PAST MEETINGS
        =================================================== */}
        {pastEvents.length > 0 && (
          <section>
            <div className="mb-4">
              <h2 className="font-display text-lg font-bold tracking-[-0.02em] text-surface-fg">
                Previous Meetings
              </h2>

              <p className="mt-1 text-sm text-surface-muted">
                Discussions and meetings previously held for your projects.
              </p>
            </div>

            <div className="overflow-hidden rounded-2xl border border-surface-border bg-surface-card">
              {pastEvents.map((event) => (
                <PastEventRow
                  key={event.id}
                  event={event}
                />
              ))}
            </div>
          </section>
        )}

        {/* ===================================================
            EMPTY STATE
        =================================================== */}
        {events.length === 0 && (
          <div className="rounded-2xl border border-dashed border-surface-border bg-surface-card px-6 py-16 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-surface-bg">
              <CalendarDays className="h-5 w-5 text-surface-muted" />
            </div>

            <h2 className="mt-4 font-display text-lg font-bold text-surface-fg">
              No meetings scheduled
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-surface-muted">
              There are currently no meetings scheduled for your account.
            </p>

            <button className="mt-5 text-sm font-semibold text-brand-orange hover:underline">
              Request a meeting
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

/* ============================================================
   EVENT CARD
============================================================ */

function EventCard({ event, featured = false }) {
  return (
    <article
      className={cn(
        "group overflow-hidden rounded-2xl border bg-surface-card",
        "transition-all duration-200",
        featured
          ? "border-brand-orange/30 shadow-[0_16px_40px_-24px_rgba(255,90,31,0.35)]"
          : "border-surface-border hover:border-surface-muted"
      )}
    >
      <div className="flex flex-col lg:flex-row">
        {/* DATE */}
        <div
          className={cn(
            "flex shrink-0 items-center gap-4 border-b px-6 py-5 lg:w-36 lg:flex-col lg:justify-center lg:border-b-0 lg:border-r",
            featured
              ? "border-brand-orange/20 bg-brand-orange/[0.04]"
              : "border-surface-border bg-surface-bg/40"
          )}
        >
          <div className="text-center">
            <p className="text-[0.65rem] font-bold uppercase tracking-[0.16em] text-brand-orange">
              {event.month}
            </p>

            <p className="mt-0.5 font-display text-3xl font-bold tracking-[-0.06em] text-surface-fg">
              {event.day}
            </p>
          </div>

          <div className="h-px flex-1 bg-surface-border lg:h-px lg:w-10 lg:flex-none" />

          <div className="text-left lg:text-center">
            <p className="text-xs font-semibold text-surface-fg">
              {event.time}
            </p>

            <p className="mt-0.5 text-[0.65rem] text-surface-muted">
              {event.duration}
            </p>
          </div>
        </div>

        {/* MAIN CONTENT */}
        <div className="min-w-0 flex-1 p-6">
          <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
            <div className="min-w-0">
              <div className="mb-2 flex flex-wrap items-center gap-2">
                {featured && (
                  <span className="rounded-full bg-brand-orange px-2.5 py-1 text-[0.6rem] font-bold uppercase tracking-[0.1em] text-white">
                    Next Meeting
                  </span>
                )}

                <span className="rounded-full bg-surface-bg px-2.5 py-1 text-[0.6rem] font-semibold text-surface-muted">
                  {event.project}
                </span>
              </div>

              <h3 className="font-display text-xl font-bold tracking-[-0.03em] text-surface-fg">
                {event.title}
              </h3>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-surface-muted">
                {event.description}
              </p>

              {/* MEETING META */}
              <div className="mt-5 flex flex-wrap gap-x-5 gap-y-3">
                <Meta
                  icon={CalendarDays}
                  text={event.date}
                />

                <Meta
                  icon={Clock3}
                  text={`${event.time} · ${event.duration}`}
                />

                <Meta
                  icon={Video}
                  text={event.platform}
                />
              </div>
            </div>

            {/* JOIN */}
            <div className="shrink-0 xl:pt-2">
              <a
                href={event.meetingUrl}
                target="_blank"
                rel="noreferrer"
                className={cn(
                  "inline-flex w-full items-center justify-center gap-2 rounded-xl px-5 py-3",
                  "text-sm font-bold transition-all duration-200 xl:w-auto",
                  featured
                    ? "bg-brand-orange text-white shadow-[0_10px_24px_-8px_rgba(255,90,31,0.5)] hover:translate-y-[-1px]"
                    : "border border-surface-border bg-surface-bg text-surface-fg hover:border-brand-orange hover:text-brand-orange"
                )}
              >
                <Video className="h-4 w-4" />
                Join Meeting
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>

          {/* ATTENDEES */}
          <div className="mt-6 flex flex-col gap-4 border-t border-surface-border pt-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="mb-2 flex items-center gap-2">
                <Users className="h-3.5 w-3.5 text-surface-muted" />

                <span className="text-[0.65rem] font-semibold uppercase tracking-[0.1em] text-surface-muted">
                  Attendees
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {event.attendees.map((attendee) => (
                  <Attendee
                    key={`${event.id}-${attendee.name}`}
                    attendee={attendee}
                  />
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs text-surface-muted">
              <span>Organized by</span>

              <span className="font-semibold text-surface-fg">
                {event.organizer}
              </span>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}

/* ============================================================
   PAST EVENT
============================================================ */

function PastEventRow({ event }) {
  return (
    <div className="group flex flex-col gap-4 border-b border-surface-border px-6 py-5 last:border-b-0 sm:flex-row sm:items-center">
      {/* DATE */}
      <div className="flex w-full shrink-0 items-center gap-3 sm:w-28">
        <div className="flex h-10 w-10 flex-col items-center justify-center rounded-xl bg-surface-bg">
          <span className="text-[0.55rem] font-bold uppercase text-surface-muted">
            {event.month}
          </span>

          <span className="font-display text-sm font-bold text-surface-fg">
            {event.day}
          </span>
        </div>

        <div className="sm:hidden">
          <p className="text-sm font-semibold text-surface-fg">
            {event.date}
          </p>

          <p className="text-xs text-surface-muted">
            {event.time}
          </p>
        </div>
      </div>

      {/* CONTENT */}
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="truncate text-sm font-bold text-surface-fg">
            {event.title}
          </h3>

          <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[0.6rem] font-semibold text-emerald-600">
            Completed
          </span>
        </div>

        <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-xs text-surface-muted">
          <span>{event.project}</span>

          <span className="hidden sm:inline">
            {event.date} · {event.time}
          </span>

          <span>{event.platform}</span>
        </div>
      </div>

      {/* ATTENDEES */}
      <div className="flex items-center gap-2">
        <div className="flex -space-x-2">
          {event.attendees.slice(0, 3).map((attendee) => (
            <div
              key={`${event.id}-${attendee.name}`}
              title={attendee.name}
              className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-surface-card bg-surface-bg text-[0.55rem] font-bold text-surface-fg"
            >
              {attendee.initials}
            </div>
          ))}
        </div>

        <button className="ml-2 rounded-lg p-2 text-surface-muted transition-colors hover:bg-surface-bg hover:text-surface-fg">
          <MoreHorizontal className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

/* ============================================================
   SMALL COMPONENTS
============================================================ */

function Meta({ icon: Icon, text }) {
  return (
    <div className="flex items-center gap-2 text-xs font-medium text-surface-muted">
      <Icon className="h-3.5 w-3.5" />

      <span>{text}</span>
    </div>
  );
}

function Attendee({ attendee }) {
  return (
    <div className="flex items-center gap-2 rounded-lg bg-surface-bg px-2.5 py-1.5">
      <div
        className={cn(
          "flex h-6 w-6 items-center justify-center rounded-full text-[0.55rem] font-bold",
          attendee.type === "client"
            ? "bg-brand-orange/10 text-brand-orange"
            : "bg-surface-card text-surface-fg"
        )}
      >
        {attendee.initials}
      </div>

      <div>
        <p className="text-[0.65rem] font-semibold leading-none text-surface-fg">
          {attendee.name}
        </p>

        <p className="mt-0.5 text-[0.55rem] leading-none text-surface-muted">
          {attendee.role}
        </p>
      </div>
    </div>
  );
}