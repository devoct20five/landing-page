import { useState } from "react";
import {
  Folder,
  MessageCircle,
  CheckCircle2,
  Plus,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  Film,
  Box,
  Globe,
  ArrowRight,
  Check,
} from "lucide-react";

// ---------------------------------------------------------------------------
// Mock data — swap this out for your real @/data/mockData when wiring this
// back into the app.
// ---------------------------------------------------------------------------

const stats = [
  { icon: Folder, label: "Active Projects", value: 5, sub: "Currently ongoing" },
  {
    icon: MessageCircle,
    label: "Need Your Input",
    value: 2,
    sub: "Action required from you",
    accent: true,
  },
  { icon: CheckCircle2, label: "Completed Projects", value: 48, sub: "Successfully delivered" },
];

const actionItems = [
  {
    id: "a1",
    title: "First Draft — Brand Film",
    code: "PRJ-2026-0042",
    description: "First draft (Version 01) is ready for your review.",
    cta: "Review Draft",
  },
  {
    id: "a2",
    title: "Brief Approval — Product Animation",
    code: "PRJ-2026-0043",
    description: "Project brief is awaiting your approval.",
    cta: "Review Brief",
  },
];

const activeProjects = [
  {
    id: "p1",
    icon: Film,
    name: "Brand Film — Zenith Foods",
    status: "Client Review",
    statusTone: "review",
    meta: "PRJ-2026-0042 · Editing · Standard",
    elapsed: "1d 6h elapsed",
    steps: [
      "Brief Approved",
      "Brief Confirmed",
      "Brief Locked",
      "Editing",
      "QC",
      "First Draft",
      "First Draft Delivered",
      "Client Review",
      "Final Delivery",
    ],
    currentStep: 7,
    cta: "Review Draft",
  },
  {
    id: "p2",
    icon: Box,
    name: "Luxury Product Render",
    status: "In Production",
    statusTone: "production",
    meta: "PRJ-2026-0083 · 3D CGI · Advanced",
    elapsed: "2d 4h elapsed",
    steps: [
      "Brief Approved",
      "Brief Confirmed",
      "Brief Locked",
      "Production",
      "QC",
      "First Draft",
      "Client Review",
      "Final Delivery",
    ],
    currentStep: 3,
    cta: "Open Project",
  },
  {
    id: "p3",
    icon: Globe,
    name: "Website Redesign",
    status: "Development",
    statusTone: "production",
    meta: "PRJ-2026-0089 · Web Development · Black",
    elapsed: "18h elapsed",
    steps: [
      "Brief Approved",
      "Brief Confirmed",
      "Brief Locked",
      "Design",
      "Design Review",
      "Development",
      "QA",
      "Final Delivery",
    ],
    currentStep: 4,
    cta: "Open Project",
  },
];

const completedProjects = [
  {
    id: "c1",
    title: "Discover Zurich: Your Ultimate App Guide",
    meta: "PRJ-2026-0071 · Editing · Standard",
    time: "Completed in 3d 5h",
    cta: "View Final",
    gradient: "from-teal-500 to-indigo-600",
  },
  {
    id: "c2",
    title: "Zenith Foods Corporate Website",
    meta: "PRJ-2026-0064 · Web Dev · Live",
    time: "Completed in 7d 1h",
    cta: "Access Website",
    gradient: "from-orange-400 to-rose-500",
  },
  {
    id: "c3",
    title: "Product Visualization",
    meta: "PRJ-2026-0065 · 3D CGI · Advanced",
    time: "Completed in 3d 6h",
    cta: "View Final",
    gradient: "from-slate-700 to-slate-900",
  },
];

const activity = [
  {
    id: "act1",
    title: "Brand Film — First Draft Delivered",
    time: "Today, 10:42 AM",
    tone: "bg-rose-500",
  },
  {
    id: "act2",
    title: "Product Animation — Brief Approved",
    time: "Today, 9:15 AM",
    tone: "bg-orange-400",
  },
  {
    id: "act3",
    title: "Website Redesign — Revision Notes Submitted",
    time: "Yesterday, 4:30 PM",
    tone: "bg-sky-500",
  },
  {
    id: "act4",
    title: "Brand Identity Package — Final Files Delivered",
    time: "Yesterday, 2:10 PM",
    tone: "bg-emerald-500",
  },
];

// ---------------------------------------------------------------------------
// Small building blocks
// ---------------------------------------------------------------------------

function SectionNav({ eyebrow, title, count }) {
  return (
    <div className="mb-4 flex items-end justify-between">
      <div>
        {eyebrow && <p className="mb-1 text-[11px] font-semibold text-rose-600">{eyebrow}</p>}
        <h2 className="text-[17px] font-semibold text-slate-900">
          {title}
          {typeof count === "number" && (
            <span className="ml-2 text-[13px] font-medium text-slate-400">{count}</span>
          )}
        </h2>
      </div>
      <div className="flex items-center gap-1.5">
        <button className="grid h-7 w-7 place-items-center rounded-md border border-slate-200 text-slate-400 hover:bg-slate-50">
          <ChevronLeft className="h-3.5 w-3.5" />
        </button>
        <button className="grid h-7 w-7 place-items-center rounded-md border border-slate-200 text-slate-400 hover:bg-slate-50">
          <ChevronRight className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, sub, accent }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5">
      <div
        className={
          "mb-4 grid h-9 w-9 place-items-center rounded-lg " +
          (accent ? "bg-rose-50 text-rose-600" : "bg-slate-100 text-slate-500")
        }
      >
        <Icon className="h-4.5 w-4.5" strokeWidth={2} />
      </div>
      <p className="text-[13px] text-slate-500">{label}</p>
      <p className="mt-1 text-[26px] font-semibold leading-none text-slate-900">{value}</p>
      <p className="mt-2 text-[12px] text-slate-400">{sub}</p>
    </div>
  );
}

function ActionRequiredCard({ item }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5">
      <div className="flex items-start gap-3">
        <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-rose-50 text-rose-600">
          <Film className="h-4 w-4" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[11px] font-semibold text-rose-600">ACTION REQUIRED</p>
          <p className="mt-0.5 truncate text-[14.5px] font-semibold text-slate-900">
            {item.title} <span className="font-normal text-slate-400">{item.code}</span>
          </p>
          <p className="mt-1 text-[13px] text-slate-500">{item.description}</p>
          <button className="mt-3 inline-flex items-center gap-1 rounded-full border border-rose-200 px-3.5 py-1.5 text-[12.5px] font-semibold text-rose-600 hover:bg-rose-50">
            {item.cta} <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}

function statusPillClasses(tone) {
  if (tone === "review") return "text-rose-600";
  return "text-orange-500";
}

function Stepper({ steps, currentStep }) {
  return (
    <div className="relative mt-4 flex items-center">
      <div className="absolute left-0 right-0 top-[7px] h-px bg-slate-200" />
      {steps.map((step, i) => {
        const done = i < currentStep;
        const isCurrent = i === currentStep;
        return (
          <div key={step} className="relative z-10 flex flex-1 flex-col items-center">
            <div
              className={
                "grid place-items-center rounded-full border " +
                (done
                  ? "h-3.5 w-3.5 border-emerald-500 bg-emerald-500 text-white"
                  : isCurrent
                    ? "h-4 w-4 border-rose-500 bg-rose-500"
                    : "h-3.5 w-3.5 border-slate-300 bg-white")
              }
            >
              {done && <Check className="h-2 w-2" strokeWidth={4} />}
            </div>
            <span
              className={
                "mt-2 max-w-[72px] text-center text-[10.5px] leading-tight " +
                (isCurrent ? "font-semibold text-slate-900" : "text-slate-400")
              }
            >
              {step}
            </span>
          </div>
        );
      })}
    </div>
  );
}

function ProjectRow({ project }) {
  const Icon = project.icon;
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5">
      <div className="flex items-start justify-between gap-4">
        <div className="flex min-w-0 items-start gap-3">
          <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-slate-100 text-slate-500">
            <Icon className="h-4 w-4" />
          </div>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <p className="truncate text-[14.5px] font-semibold text-slate-900">{project.name}</p>
              <span
                className={"text-[12px] font-semibold " + statusPillClasses(project.statusTone)}
              >
                {project.status}
              </span>
            </div>
            <p className="mt-0.5 text-[12.5px] text-slate-400">{project.meta}</p>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-3">
          <span className="hidden text-[12px] text-slate-400 sm:inline">{project.elapsed}</span>
          <button className="rounded-full border border-rose-200 px-4 py-1.5 text-[12.5px] font-semibold text-rose-600 hover:bg-rose-50">
            {project.cta} <ArrowRight className="ml-1 inline h-3.5 w-3.5" />
          </button>
          <button className="grid h-7 w-7 place-items-center rounded-md text-slate-400 hover:bg-slate-50">
            <MoreHorizontal className="h-4 w-4" />
          </button>
        </div>
      </div>

      <Stepper steps={project.steps} currentStep={project.currentStep} />
    </div>
  );
}

function CompletedCard({ item }) {
  return (
    <div className="min-w-[220px] flex-1 rounded-2xl border border-slate-200 bg-white p-3">
      <div className={"h-24 w-full rounded-xl bg-gradient-to-br " + item.gradient} />
      <p className="mt-3 line-clamp-2 text-[13.5px] font-semibold leading-snug text-slate-900">
        {item.title}
      </p>
      <p className="mt-1 text-[11.5px] text-slate-400">{item.meta}</p>
      <p className="mt-2 text-[11.5px] text-slate-400">{item.time}</p>
      <button className="mt-2 text-[12.5px] font-semibold text-rose-600">
        {item.cta} <ArrowRight className="ml-1 inline h-3 w-3" />
      </button>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Dashboard
// ---------------------------------------------------------------------------

export default function Dashboard() {
  const [clientName] = useState("Acme");

  return (
    <div className="min-h-screen bg-slate-50 px-6 py-8">
      <div className="mx-auto max-w-[1180px]">
        {/* Header */}
        <div className="mb-8 flex items-start justify-between">
          <div>
            <h1 className="text-[26px] font-bold tracking-[-0.01em] text-slate-900">
              Good morning, {clientName}.
            </h1>
            <p className="mt-1 text-[14px] text-slate-500">
              Here&rsquo;s what&rsquo;s happening with your projects.
            </p>
          </div>
          <button className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-rose-600 px-4 py-2 text-[13px] font-semibold text-white hover:bg-rose-700">
            <Plus className="h-4 w-4" /> New Project
          </button>
        </div>

        {/* Stats */}
        <div className="mb-10 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {stats.map((s) => (
            <StatCard key={s.label} {...s} />
          ))}
        </div>

        {/* Action Required */}
        <section className="mb-10">
          <SectionNav eyebrow="NEEDS YOUR ATTENTION" title="Action Required" />
          <div className="grid gap-4 md:grid-cols-2">
            {actionItems.map((item) => (
              <ActionRequiredCard key={item.id} item={item} />
            ))}
          </div>
        </section>

        {/* Active Projects */}
        <section className="mb-10">
          <SectionNav title="Active Projects" count={activeProjects.length} />
          <div className="space-y-4">
            {activeProjects.map((project) => (
              <ProjectRow key={project.id} project={project} />
            ))}
          </div>
          <div className="mt-4 text-center">
            <button className="text-[13px] font-semibold text-rose-600 hover:text-rose-700">
              View all active projects in Projects{" "}
              <ArrowRight className="ml-1 inline h-3.5 w-3.5" />
            </button>
          </div>
        </section>

        {/* Completed + Activity */}
        <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
          <section>
            <SectionNav title="Completed Projects" count={48} />
            <div className="flex gap-4 overflow-x-auto pb-1">
              {completedProjects.map((item) => (
                <CompletedCard key={item.id} item={item} />
              ))}
            </div>
          </section>

          <section>
            <h2 className="mb-4 text-[17px] font-semibold text-slate-900">Recent Activity</h2>
            <div className="rounded-2xl border border-slate-200 bg-white p-2">
              {activity.map((item, i) => (
                <div
                  key={item.id}
                  className={
                    "flex items-center gap-3 px-3 py-3" +
                    (i !== activity.length - 1 ? " border-b border-slate-100" : "")
                  }
                >
                  <span className={"h-2 w-2 shrink-0 rounded-full " + item.tone} />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[13px] font-medium text-slate-800">{item.title}</p>
                  </div>
                  <span className="shrink-0 text-[11.5px] text-slate-400">{item.time}</span>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
