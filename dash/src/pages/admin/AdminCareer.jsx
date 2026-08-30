import {
  BriefcaseBusiness,
  Users,
  UserPlus,
  CheckCircle2,
  Clock3,
  XCircle,
  Plus,
  ArrowUpRight,
  MoreHorizontal,
  MapPin,
  CalendarDays,
  Search,
  Filter,
  ChevronRight,
} from "lucide-react";

import { cn } from "@/lib/utils";

const jobs = [
  {
    id: "job-001",
    title: "Senior Video Editor",
    department: "Post Production",
    type: "Full-time",
    location: "New Delhi / Hybrid",
    status: "open",
    applicants: 42,
    newApplicants: 8,
    hired: 0,
    posted: "08 Aug 2026",
    deadline: "31 Aug 2026",
  },
  {
    id: "job-002",
    title: "Motion Graphics Designer",
    department: "Design",
    type: "Full-time",
    location: "New Delhi / Hybrid",
    status: "open",
    applicants: 31,
    newApplicants: 5,
    hired: 0,
    posted: "05 Aug 2026",
    deadline: "28 Aug 2026",
  },
  {
    id: "job-003",
    title: "3D Artist",
    department: "3D",
    type: "Full-time",
    location: "Remote",
    status: "open",
    applicants: 27,
    newApplicants: 4,
    hired: 0,
    posted: "01 Aug 2026",
    deadline: "25 Aug 2026",
  },
  {
    id: "job-004",
    title: "Frontend Developer",
    department: "Technology",
    type: "Full-time",
    location: "New Delhi / Hybrid",
    status: "paused",
    applicants: 56,
    newApplicants: 0,
    hired: 0,
    posted: "20 Jul 2026",
    deadline: "Closed",
  },
  {
    id: "job-005",
    title: "Project Manager",
    department: "Operations",
    type: "Full-time",
    location: "New Delhi",
    status: "closed",
    applicants: 74,
    newApplicants: 0,
    hired: 1,
    posted: "15 Jun 2026",
    deadline: "Closed",
  },
];

const candidates = [
  {
    id: "candidate-001",
    name: "Ananya Sharma",
    role: "Senior Video Editor",
    email: "ananya.sharma@gmail.com",
    experience: "5 years",
    stage: "interview",
    applied: "Today",
  },
  {
    id: "candidate-002",
    name: "Rohan Malhotra",
    role: "Frontend Developer",
    email: "rohan.m@gmail.com",
    experience: "3 years",
    stage: "shortlisted",
    applied: "Today",
  },
  {
    id: "candidate-003",
    name: "Meera Kapoor",
    role: "Motion Graphics Designer",
    email: "meera.kapoor@gmail.com",
    experience: "4 years",
    stage: "new",
    applied: "Yesterday",
  },
  {
    id: "candidate-004",
    name: "Aditya Singh",
    role: "3D Artist",
    email: "aditya.singh@gmail.com",
    experience: "2 years",
    stage: "review",
    applied: "Yesterday",
  },
  {
    id: "candidate-005",
    name: "Karan Verma",
    role: "Senior Video Editor",
    email: "karan.v@gmail.com",
    experience: "6 years",
    stage: "rejected",
    applied: "2 days ago",
  },
];

export default function AdminCareer() {
  const openJobs = jobs.filter((job) => job.status === "open");

  const totalApplicants = jobs.reduce((sum, job) => sum + job.applicants, 0);

  const newApplicants = candidates.filter((candidate) => candidate.stage === "new").length;

  const interviews = candidates.filter((candidate) => candidate.stage === "interview").length;

  const hired = jobs.reduce((sum, job) => sum + job.hired, 0);

  return (
    <div className="min-h-full bg-surface-bg">
      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="border-b border-surface-border">
        <div className="mx-auto max-w-7xl px-6 py-8 lg:px-8">
          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <div>
              <h1 className="font-display text-3xl font-bold tracking-[-0.04em] text-surface-fg sm:text-4xl">
                Careers
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-surface-muted">
                Manage open positions, applications and the OCT20FIVE hiring pipeline.
              </p>
            </div>

            <button className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand-orange px-4 py-2.5 text-sm font-bold text-white shadow-[0_10px_24px_-8px_rgba(255,90,31,0.45)] transition hover:opacity-90">
              <Plus className="h-4 w-4" />
              Create Position
            </button>
          </div>
        </div>
      </div>

      {/* =====================================================
          CONTENT
      ===================================================== */}

      <div className="mx-auto max-w-7xl px-6 py-8 lg:px-8">
        <div className="space-y-6">
          {/* =================================================
              OVERVIEW
          ================================================= */}

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <CareerStat
              icon={BriefcaseBusiness}
              label="Open Positions"
              value={openJobs.length}
              description="Currently hiring"
            />

            <CareerStat
              icon={Users}
              label="Total Applicants"
              value={totalApplicants}
              description="Across all positions"
            />

            <CareerStat
              icon={UserPlus}
              label="New Applications"
              value={newApplicants}
              description="Awaiting review"
              highlight
            />

            <CareerStat
              icon={CheckCircle2}
              label="Hired"
              value={hired}
              description="Successful hires"
            />
          </div>

          {/* =================================================
              PIPELINE
          ================================================= */}

          <section className="rounded-2xl border border-surface-border bg-surface-card">
            <SectionHeader
              title="Hiring Pipeline"
              description="Current candidate movement across the recruitment process."
            />

            <div className="grid grid-cols-2 divide-x divide-y divide-surface-border sm:grid-cols-3 lg:grid-cols-6 lg:divide-y-0">
              <PipelineStat label="New" value={8} icon={UserPlus} />

              <PipelineStat label="Under Review" value={14} icon={Search} />

              <PipelineStat label="Shortlisted" value={9} icon={CheckCircle2} />

              <PipelineStat label="Interview" value={6} icon={CalendarDays} />

              <PipelineStat label="Offer" value={2} icon={BriefcaseBusiness} />

              <PipelineStat label="Hired" value={1} icon={CheckCircle2} />
            </div>
          </section>

          {/* =================================================
              OPEN POSITIONS
          ================================================= */}

          <section className="rounded-2xl border border-surface-border bg-surface-card">
            <SectionHeader
              title="Open Positions"
              description="Positions currently available at OCT20FIVE."
              action={
                <button className="text-xs font-semibold text-brand-orange hover:underline">
                  Manage positions
                </button>
              }
            />

            <div className="divide-y divide-surface-border">
              {jobs
                .filter((job) => job.status === "open")
                .map((job) => (
                  <JobRow key={job.id} job={job} />
                ))}
            </div>
          </section>

          {/* =================================================
              RECENT APPLICATIONS
          ================================================= */}

          <section className="rounded-2xl border border-surface-border bg-surface-card">
            <SectionHeader
              title="Recent Applications"
              description="Latest candidates who applied to your open positions."
              action={
                <button className="text-xs font-semibold text-brand-orange hover:underline">
                  View all applications
                </button>
              }
            />

            {/* Filters */}

            <div className="flex flex-col gap-3 border-b border-surface-border p-4 sm:flex-row">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-surface-muted" />

                <input
                  type="text"
                  placeholder="Search candidates..."
                  className="h-10 w-full rounded-xl border border-surface-border bg-surface-bg pl-9 pr-4 text-sm text-surface-fg outline-none transition placeholder:text-surface-muted focus:border-brand-orange"
                />
              </div>

              <button className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-surface-border bg-surface-bg px-4 text-xs font-semibold text-surface-fg hover:border-brand-orange">
                <Filter className="h-3.5 w-3.5" />
                Filter
              </button>
            </div>

            <div className="divide-y divide-surface-border">
              {candidates.map((candidate) => (
                <CandidateRow key={candidate.id} candidate={candidate} />
              ))}
            </div>
          </section>

          {/* =================================================
              ALL POSITIONS
          ================================================= */}

          <section className="rounded-2xl border border-surface-border bg-surface-card">
            <SectionHeader
              title="All Positions"
              description="Overview of your current and previous job openings."
            />

            <div className="divide-y divide-surface-border">
              {jobs.map((job) => (
                <AllJobRow key={job.id} job={job} />
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   CAREER STAT
============================================================ */

function CareerStat({ icon: Icon, label, value, description, highlight = false }) {
  return (
    <div className="rounded-2xl border border-surface-border bg-surface-card p-5">
      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-orange/10">
        <Icon className="h-4 w-4 text-brand-orange" />
      </div>

      <p className="mt-5 text-xs font-semibold uppercase tracking-[0.1em] text-surface-muted">
        {label}
      </p>

      <p
        className={cn(
          "mt-1 font-display text-2xl font-bold tracking-[-0.04em]",
          highlight ? "text-brand-orange" : "text-surface-fg"
        )}
      >
        {value}
      </p>

      <p className="mt-1 text-xs text-surface-muted">{description}</p>
    </div>
  );
}

/* ============================================================
   PIPELINE STAT
============================================================ */

function PipelineStat({ label, value, icon: Icon }) {
  return (
    <div className="px-5 py-5">
      <div className="flex items-center gap-2">
        <Icon className="h-4 w-4 text-surface-muted" />

        <span className="text-xs font-medium text-surface-muted">{label}</span>
      </div>

      <p className="mt-2 font-display text-2xl font-bold tracking-[-0.04em] text-surface-fg">
        {value}
      </p>
    </div>
  );
}

/* ============================================================
   JOB ROW
============================================================ */

function JobRow({ job }) {
  return (
    <div className="flex flex-col gap-5 px-6 py-5 lg:flex-row lg:items-center lg:justify-between">
      <div className="flex min-w-0 items-center gap-4">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-orange/10">
          <BriefcaseBusiness className="h-5 w-5 text-brand-orange" />
        </div>

        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-sm font-bold text-surface-fg">{job.title}</h3>

            <span className="rounded-full bg-emerald-500/10 px-2.5 py-1 text-[0.6rem] font-semibold text-emerald-600">
              Hiring
            </span>
          </div>

          <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-surface-muted">
            <span>{job.department}</span>

            <span>•</span>

            <span>{job.type}</span>

            <span>•</span>

            <span className="inline-flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              {job.location}
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-6 lg:shrink-0">
        <div>
          <p className="text-[0.65rem] uppercase tracking-[0.08em] text-surface-muted">
            Applicants
          </p>

          <p className="mt-1 text-sm font-bold text-surface-fg">{job.applicants}</p>
        </div>

        <div>
          <p className="text-[0.65rem] uppercase tracking-[0.08em] text-surface-muted">New</p>

          <p className="mt-1 text-sm font-bold text-brand-orange">{job.newApplicants}</p>
        </div>

        <div className="hidden sm:block">
          <p className="text-[0.65rem] uppercase tracking-[0.08em] text-surface-muted">Deadline</p>

          <p className="mt-1 text-sm font-semibold text-surface-fg">{job.deadline}</p>
        </div>

        <button className="flex h-9 w-9 items-center justify-center rounded-lg border border-surface-border text-surface-muted transition hover:border-brand-orange hover:text-brand-orange">
          <ArrowUpRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

/* ============================================================
   CANDIDATE ROW
============================================================ */

function CandidateRow({ candidate }) {
  const stageMap = {
    new: {
      label: "New",
      className: "bg-brand-orange/10 text-brand-orange",
    },
    review: {
      label: "Under Review",
      className: "bg-blue-500/10 text-blue-600",
    },
    shortlisted: {
      label: "Shortlisted",
      className: "bg-emerald-500/10 text-emerald-600",
    },
    interview: {
      label: "Interview",
      className: "bg-purple-500/10 text-purple-600",
    },
    rejected: {
      label: "Rejected",
      className: "bg-red-500/10 text-red-600",
    },
  };

  const stage = stageMap[candidate.stage] || stageMap.new;

  const initials = candidate.name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2);

  return (
    <div className="flex flex-col gap-4 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex min-w-0 items-center gap-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-surface-bg text-xs font-bold text-surface-fg">
          {initials}
        </div>

        <div className="min-w-0">
          <h3 className="text-sm font-bold text-surface-fg">{candidate.name}</h3>

          <p className="mt-1 text-xs text-surface-muted">
            {candidate.role} · {candidate.experience}
          </p>

          <p className="mt-0.5 truncate text-xs text-surface-muted">{candidate.email}</p>
        </div>
      </div>

      <div className="flex items-center gap-4 sm:shrink-0">
        <div className="hidden text-right md:block">
          <p className="text-[0.65rem] uppercase tracking-[0.08em] text-surface-muted">Applied</p>

          <p className="mt-1 text-xs font-medium text-surface-fg">{candidate.applied}</p>
        </div>

        <span
          className={cn("rounded-full px-3 py-1.5 text-[0.65rem] font-semibold", stage.className)}
        >
          {stage.label}
        </span>

        <button className="flex h-8 w-8 items-center justify-center rounded-lg text-surface-muted hover:bg-surface-bg hover:text-surface-fg">
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

/* ============================================================
   ALL JOB ROW
============================================================ */

function AllJobRow({ job }) {
  const statusMap = {
    open: {
      label: "Open",
      className: "bg-emerald-500/10 text-emerald-600",
    },
    paused: {
      label: "Paused",
      className: "bg-amber-500/10 text-amber-600",
    },
    closed: {
      label: "Closed",
      className: "bg-surface-bg text-surface-muted",
    },
  };

  const status = statusMap[job.status] || statusMap.closed;

  return (
    <div className="flex flex-col gap-4 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-surface-bg">
          <BriefcaseBusiness className="h-4 w-4 text-surface-muted" />
        </div>

        <div>
          <p className="text-sm font-semibold text-surface-fg">{job.title}</p>

          <p className="mt-0.5 text-xs text-surface-muted">
            {job.department} · Posted {job.posted}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-5">
        <div className="hidden sm:block">
          <p className="text-[0.6rem] uppercase tracking-[0.08em] text-surface-muted">Applicants</p>

          <p className="mt-1 text-xs font-bold text-surface-fg">{job.applicants}</p>
        </div>

        {job.hired > 0 && (
          <div className="hidden sm:block">
            <p className="text-[0.6rem] uppercase tracking-[0.08em] text-surface-muted">Hired</p>

            <p className="mt-1 text-xs font-bold text-emerald-600">{job.hired}</p>
          </div>
        )}

        <span
          className={cn("rounded-full px-3 py-1.5 text-[0.65rem] font-semibold", status.className)}
        >
          {status.label}
        </span>

        <button className="text-surface-muted hover:text-surface-fg">
          <MoreHorizontal className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

/* ============================================================
   SECTION HEADER
============================================================ */

function SectionHeader({ title, description, action }) {
  return (
    <div className="flex flex-col gap-3 border-b border-surface-border px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h2 className="font-display text-base font-bold tracking-[-0.02em] text-surface-fg">
          {title}
        </h2>

        <p className="mt-1 text-sm text-surface-muted">{description}</p>
      </div>

      {action}
    </div>
  );
}
