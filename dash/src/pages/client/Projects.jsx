import { useState } from "react";
import {
  Plus,
  MoreHorizontal,
  Video,
  Clock,
  Check,
  Calendar,
  User,
  Pencil,
  ShieldCheck,
  Play,
  Volume2,
  Settings,
  Maximize2,
  X,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import { AiFillInstagram } from "react-icons/ai";
// ---------------------------------------------------------------------------
// Mock data
// ---------------------------------------------------------------------------

const activeProjects = [
  {
    id: "p1",
    status: "Client Review",
    elapsed: "14h elapsed",
    name: "Brand Film – Zenith Foods",
    tags: "Editing · Standard",
    code: "ID: OCTF-26-0891",
    cta: "View First Draft",
    detail: {
      typeIcons: [Video, AiFillInstagram, Clock],
      subline: "Editing · Standard · Project ID: OCTF-26-0891 · Started 31 Aug 2026",
      durationLabel: "60 sec",
      steps: [
        { label: "Brief Approved", date: "30 Aug 2026", time: "11:02 AM", done: true },
        { label: "Project Confirmed", date: "30 Aug 2026", time: "11:45 AM", done: true },
        { label: "Brief Locked", date: "31 Aug 2026", time: "09:15 AM", done: true },
        { label: "Editing", date: "01 Sep 2026", time: "02:30 PM", done: true },
        { label: "QC", date: "02 Sep 2026", time: "10:12 AM", done: true },
        { label: "First Draft Delivered", date: "02 Sep 2026", time: "11:03 AM", done: true },
        { label: "Client Review", date: "Current Stage", time: "", current: true },
        { label: "Final Delivery", date: "", time: "" },
      ],
      currentStageTitle: "Client Review",
      currentStageDesc: "First Draft is ready for your review.",
      deliveredOn: "02 Sep 2026 · 11:03 AM",
      team: [
        { role: "Project Manager", name: "Himashu Dutta", icon: User },
        { role: "Editor", name: "Manisha", icon: Pencil },
        { role: "QC", name: "Sunitra Pola", icon: ShieldCheck },
      ],
      reviewTag: "FIRST DRAFT",
      reviewTitle: "Ready for Review",
      reviewDesc: "Your first draft is ready. Review it below and choose an action.",
      reviewDelivered: "Delivered 02 Sep 2026 · 11:03 AM",
      videoLabel: "ZENITH",
      approveNote:
        "We will move toward final delivery. Once the final version is delivered, you'll be able to download it.",
      rejectNote:
        "We will add your revision notes and we will edit the draft again and deliver the next version for your review.",
    },
  },
  {
    id: "p2",
    status: "In Production",
    elapsed: "2d 4h elapsed",
    name: "Luxury Product Render",
    tags: "3D CGI · Advanced",
    code: "ID: OCTF-26-0883",
    cta: "View Project",
    detail: {
      typeIcons: [Video, Clock],
      subline: "3D CGI · Advanced · Project ID: OCTF-26-0883 · Started 4 Sep 2026",
      durationLabel: "15 sec",
      steps: [
        { label: "Brief Approved", date: "1 Sep 2026", time: "09:00 AM", done: true },
        { label: "Brief Confirmed", date: "1 Sep 2026", time: "09:40 AM", done: true },
        { label: "Brief Locked", date: "2 Sep 2026", time: "10:10 AM", done: true },
        { label: "Production", date: "Current Stage", time: "", current: true },
        { label: "QC", date: "", time: "" },
        { label: "First Draft", date: "", time: "" },
        { label: "Client Review", date: "", time: "" },
        { label: "Final Delivery", date: "", time: "" },
      ],
      currentStageTitle: "Production",
      currentStageDesc: "The 3D render is currently in production.",
      deliveredOn: "—",
      team: [
        { role: "Project Manager", name: "Himashu Dutta", icon: User },
        { role: "3D Artist", name: "Rohan Vats", icon: Pencil },
        { role: "QC", name: "Sunitra Pola", icon: ShieldCheck },
      ],
      reviewTag: null,
    },
  },
  {
    id: "p3",
    status: "In Progress",
    elapsed: "18h elapsed",
    name: "Brand Identity System",
    tags: "Design",
    code: "ID: OCTF-26-0887",
    cta: "View Project",
    detail: {
      typeIcons: [Video],
      subline: "Design · Project ID: OCTF-26-0887 · Started 5 Sep 2026",
      durationLabel: "",
      steps: [
        { label: "Brief Approved", date: "5 Sep 2026", time: "08:30 AM", done: true },
        { label: "Concepting", date: "Current Stage", time: "", current: true },
        { label: "Refinement", date: "", time: "" },
        { label: "Final Delivery", date: "", time: "" },
      ],
      currentStageTitle: "Concepting",
      currentStageDesc: "Initial identity concepts are being developed.",
      deliveredOn: "—",
      team: [
        { role: "Project Manager", name: "Himashu Dutta", icon: User },
        { role: "Designer", name: "Anaya Kapoor", icon: Pencil },
      ],
      reviewTag: null,
    },
  },
  {
    id: "p4",
    status: "Awaiting Confirmation",
    elapsed: "42h elapsed",
    name: "Mobile App UI Design",
    tags: "Design · Standard",
    code: "ID: OCTF-26-0895",
    cta: "View Draft",
    detail: {
      typeIcons: [Video],
      subline: "Design · Standard · Project ID: OCTF-26-0895 · Started 3 Sep 2026",
      durationLabel: "",
      steps: [
        { label: "Brief Submitted", date: "3 Sep 2026", time: "01:00 PM", done: true },
        { label: "Brief Confirmed", date: "Current Stage", time: "", current: true },
        { label: "Design", date: "", time: "" },
        { label: "Final Delivery", date: "", time: "" },
      ],
      currentStageTitle: "Brief Confirmed",
      currentStageDesc: "Waiting on your confirmation of the project brief.",
      deliveredOn: "—",
      team: [{ role: "Project Manager", name: "Himashu Dutta", icon: User }],
      reviewTag: null,
    },
  },
];

const completedProjects = [
  {
    id: "c1",
    completedAt: "Completed today at 3:30 PM",
    name: "Discover Zurich: Your Ultimate App Guide",
    tags: "Editing · Standard",
    code: "ID: OCTF-26-0871",
    cta: "View Final",
  },
  {
    id: "c2",
    completedAt: "Completed 2d ago",
    name: "Zenith Foods Corporate Website",
    tags: "Web Development · Live",
    code: "ID: OCTF-26-0854",
    cta: "Access Website",
  },
];

const TABS = ["Progress", "Project Brief", "Revisions", "Add-ons"];

// ---------------------------------------------------------------------------
// Sidebar
// ---------------------------------------------------------------------------

function SidebarItem({ project, selected, onClick, isCompleted }) {
  return (
    <button
      onClick={onClick}
      className={
        "block w-full rounded-xl border-l-[3px] px-3 py-3 text-left transition-colors " +
        (selected ? "border-l-rose-500 bg-rose-50/60" : "border-l-transparent hover:bg-slate-50")
      }
    >
      <div className="flex items-center justify-between">
        {isCompleted ? (
          <span className="inline-flex items-center gap-1 text-[11.5px] font-semibold text-emerald-600">
            <CheckCircle2 className="h-3.5 w-3.5" /> Completed
          </span>
        ) : (
          <span className="text-[11.5px] font-semibold text-orange-500">{project.status}</span>
        )}
        <span className="text-[11px] text-slate-400">
          {isCompleted ? project.completedAt.replace("Completed ", "") : project.elapsed}
        </span>
      </div>
      <p className="mt-1.5 text-[13.5px] font-semibold leading-snug text-slate-900">
        {project.name}
      </p>
      <p className="mt-0.5 text-[12px] text-slate-400">{project.tags}</p>
      <p className="text-[11.5px] text-slate-300">{project.code}</p>
      <span className="mt-1.5 inline-block text-[12px] font-semibold text-rose-600">
        {project.cta} <ArrowRight className="ml-0.5 inline h-3 w-3" />
      </span>
    </button>
  );
}

// ---------------------------------------------------------------------------
// Detail panel pieces
// ---------------------------------------------------------------------------

function ProgressStepper({ steps }) {
  return (
    <div className="relative mt-6 flex items-start">
      <div className="absolute left-0 right-0 top-[15px] h-px bg-slate-200" />
      {steps.map((step) => (
        <div
          key={step.label}
          className="relative z-10 flex flex-1 flex-col items-center px-1 text-center"
        >
          <div
            className={
              "grid place-items-center rounded-full border " +
              (step.done
                ? "h-[30px] w-[30px] border-emerald-500 bg-emerald-500 text-white"
                : step.current
                  ? "h-[30px] w-[30px] border-orange-500 bg-white text-orange-500"
                  : "h-[30px] w-[30px] border-slate-200 bg-white text-slate-300")
            }
          >
            {step.done ? (
              <Check className="h-3.5 w-3.5" strokeWidth={3} />
            ) : step.current ? (
              <span className="h-2 w-2 rounded-full bg-orange-500" />
            ) : (
              <span className="h-2 w-2 rounded-full bg-slate-200" />
            )}
          </div>
          <p
            className={
              "mt-2 text-[11.5px] font-medium leading-tight " +
              (step.current ? "text-slate-900" : "text-slate-600")
            }
          >
            {step.label}
          </p>
          {step.date && (
            <p
              className={
                "mt-0.5 text-[10.5px] " +
                (step.current ? "font-semibold text-orange-500" : "text-slate-400")
              }
            >
              {step.date}
            </p>
          )}
          {step.time && <p className="text-[10.5px] text-slate-400">{step.time}</p>}
        </div>
      ))}
    </div>
  );
}

function ProjectDetailPanel({ project }) {
  const d = project.detail;
  const [tab, setTab] = useState("Progress");

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6">
      {/* Title row */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-[22px] font-bold text-slate-900">{project.name}</h1>
          <div className="mt-1.5 flex flex-wrap items-center gap-3 text-[12.5px] text-slate-400">
            <span>{d.subline}</span>
          </div>
          <div className="mt-2 flex items-center gap-4 text-[12px] text-slate-400">
            {d.typeIcons.map((Icon, i) => (
              <span key={i} className="inline-flex items-center gap-1">
                <Icon className="h-3.5 w-3.5" />
                {i === d.typeIcons.length - 1 && d.durationLabel ? d.durationLabel : null}
              </span>
            ))}
          </div>
        </div>
        <button className="grid h-8 w-8 shrink-0 place-items-center rounded-md text-slate-400 hover:bg-slate-50">
          <MoreHorizontal className="h-5 w-5" />
        </button>
      </div>

      {/* Tabs */}
      <div className="mt-5 flex gap-6 border-b border-slate-200">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={
              "pb-2.5 text-[13px] font-semibold " +
              (tab === t
                ? "border-b-2 border-orange-500 text-orange-500"
                : "text-slate-400 hover:text-slate-600")
            }
          >
            {t}
          </button>
        ))}
      </div>

      {tab !== "Progress" ? (
        <div className="py-14 text-center text-[13px] text-slate-400">
          Nothing here yet for {tab}.
        </div>
      ) : (
        <>
          {/* Progress */}
          <section className="mt-6">
            <h2 className="text-[14.5px] font-semibold text-slate-900">Project Progress</h2>
            <ProgressStepper steps={d.steps} />
          </section>

          {/* Current stage banner */}
          <section className="mt-6 flex flex-col gap-4 rounded-xl bg-slate-50 p-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              <div className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-violet-100 text-violet-600">
                <User className="h-4 w-4" />
              </div>
              <div>
                <p className="text-[11px] font-semibold text-violet-600">CURRENT STAGE</p>
                <p className="text-[14px] font-semibold text-slate-900">{d.currentStageTitle}</p>
                <p className="text-[12.5px] text-slate-500">{d.currentStageDesc}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-[12.5px] text-slate-500">
              <Calendar className="h-4 w-4 text-slate-400" />
              <span>Delivered on {d.deliveredOn}</span>
            </div>
          </section>

          {/* Project team */}
          <section className="mt-6">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-[14.5px] font-semibold text-slate-900">Project Team</h2>
              <span className="text-[12.5px] font-semibold text-rose-600">
                Need to contact the team? Contact Support
              </span>
            </div>
            <div className="flex flex-wrap gap-8">
              {d.team.map((member) => (
                <div key={member.role} className="flex items-center gap-2.5">
                  <div className="grid h-8 w-8 place-items-center rounded-full bg-slate-100 text-slate-500">
                    <member.icon className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-[11.5px] text-slate-400">{member.role}</p>
                    <p className="text-[13px] font-medium text-slate-900">{member.name}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Ready for review */}
          {d.reviewTag && (
            <section className="mt-6 rounded-xl border border-slate-200 p-4">
              <p className="text-[10.5px] font-semibold tracking-wide text-slate-400">
                {d.reviewTag}
              </p>
              <div className="mt-3 grid gap-5 lg:grid-cols-[1.1fr_1fr]">
                <div>
                  <h3 className="text-[16px] font-semibold text-slate-900">{d.reviewTitle}</h3>
                  <p className="mt-1 text-[13px] text-slate-500">{d.reviewDesc}</p>
                  <p className="mt-2 flex items-center gap-1.5 text-[12px] text-slate-400">
                    <Calendar className="h-3.5 w-3.5" /> {d.reviewDelivered}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2.5">
                    <button className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500 px-4 py-2 text-[13px] font-semibold text-white hover:bg-emerald-600">
                      <Check className="h-4 w-4" /> Approve
                    </button>
                    <button className="inline-flex items-center gap-1.5 rounded-full border border-rose-200 px-4 py-2 text-[13px] font-semibold text-rose-600 hover:bg-rose-50">
                      <X className="h-4 w-4" /> Reject &amp; Add revision notes
                    </button>
                  </div>
                </div>

                {/* video preview */}
                <div className="relative overflow-hidden rounded-xl bg-slate-900">
                  <div className="grid h-full min-h-[150px] place-items-center">
                    <p className="text-[22px] font-bold tracking-[0.25em] text-white/90">
                      {d.videoLabel}
                    </p>
                  </div>
                  <button className="absolute left-1/2 top-1/2 grid h-11 w-11 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-white/15 text-white backdrop-blur hover:bg-white/25">
                    <Play className="h-5 w-5" />
                  </button>
                  <div className="absolute inset-x-0 bottom-0 flex items-center justify-between bg-gradient-to-t from-black/60 to-transparent px-3 py-2 text-[11px] text-white">
                    <span>00:00 / 01:00</span>
                    <div className="flex items-center gap-2">
                      <Volume2 className="h-3.5 w-3.5" />
                      <Settings className="h-3.5 w-3.5" />
                      <Maximize2 className="h-3.5 w-3.5" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <div className="flex items-start gap-2.5 rounded-lg bg-emerald-50 p-3">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                  <div>
                    <p className="text-[12.5px] font-semibold text-emerald-700">If you approve</p>
                    <p className="text-[12px] text-emerald-700/80">{d.approveNote}</p>
                  </div>
                </div>
                <div className="flex items-start gap-2.5 rounded-lg bg-rose-50 p-3">
                  <X className="mt-0.5 h-4 w-4 shrink-0 text-rose-600" />
                  <div>
                    <p className="text-[12.5px] font-semibold text-rose-700">
                      If you request changes
                    </p>
                    <p className="text-[12px] text-rose-700/80">{d.rejectNote}</p>
                  </div>
                </div>
              </div>
            </section>
          )}
        </>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function ProjectDetail() {
  const [selectedId, setSelectedId] = useState(activeProjects[0].id);
  const selected =
    activeProjects.find((p) => p.id === selectedId) ||
    completedProjects.find((p) => p.id === selectedId);

  return (
    <div className="min-h-screen bg-slate-50 px-6 py-8">
      <div className="mx-auto max-w-[1180px]">
        <div className="mb-6 flex items-center justify-end">
          <button className="inline-flex items-center gap-1.5 rounded-full bg-rose-600 px-4 py-2 text-[13px] font-semibold text-white hover:bg-rose-700">
            <Plus className="h-4 w-4" /> New Project
          </button>
        </div>

        <div className="grid gap-6 lg:grid-cols-[300px_1fr]">
          {/* Sidebar */}
          <aside className="space-y-6">
            <div>
              <h2 className="mb-3 flex items-center gap-2 text-[14px] font-semibold text-slate-900">
                Active Projects
                <span className="grid h-4.5 min-w-[18px] place-items-center rounded-full bg-rose-100 px-1 text-[11px] font-semibold text-rose-600">
                  {activeProjects.length}
                </span>
              </h2>
              <div className="space-y-1.5">
                {activeProjects.map((p) => (
                  <SidebarItem
                    key={p.id}
                    project={p}
                    selected={selectedId === p.id}
                    onClick={() => setSelectedId(p.id)}
                  />
                ))}
              </div>
            </div>

            <div>
              <h2 className="mb-3 flex items-center gap-2 text-[14px] font-semibold text-slate-900">
                Completed Projects
                <span className="grid h-4.5 min-w-[18px] place-items-center rounded-full bg-emerald-100 px-1 text-[11px] font-semibold text-emerald-600">
                  {completedProjects.length}
                </span>
              </h2>
              <div className="space-y-1.5">
                {completedProjects.map((p) => (
                  <SidebarItem
                    key={p.id}
                    project={p}
                    isCompleted
                    selected={false}
                    onClick={() => {}}
                  />
                ))}
              </div>
              <button className="mt-2 text-[12.5px] font-semibold text-slate-400 hover:text-slate-600">
                View all completed projects
              </button>
            </div>
          </aside>

          {/* Detail */}
          <main>{selected && <ProjectDetailPanel project={selected} />}</main>
        </div>
      </div>
    </div>
  );
}
