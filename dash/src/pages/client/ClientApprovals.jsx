import {
  Check,
  CheckCircle2,
  Clock3,
  FileCheck2,
  ExternalLink,
  Eye,
  MessageSquare,
  MoreHorizontal,
  X,
  AlertCircle,
} from "lucide-react";

import { cn } from "@/lib/utils";

const approvals = [
  {
    id: "approval-001",
    title: "Hero Campaign Film — Final Cut",
    description: "Final edited version of the campaign film is ready for your review and approval.",
    project: "Summer Campaign 2026",
    type: "Video",
    submittedBy: "Rahul Mehta",
    submittedRole: "Editor",
    submittedDate: "21 Aug 2026",
    dueDate: "25 Aug 2026",
    version: "v4.2",
    status: "pending",
    priority: "high",
    comments: 3,
    previewUrl: "#",
  },
  {
    id: "approval-002",
    title: "Homepage Design — Final",
    description: "Final homepage design incorporating the latest feedback and content updates.",
    project: "Website Redesign",
    type: "Design",
    submittedBy: "Priya Nair",
    submittedRole: "Designer",
    submittedDate: "20 Aug 2026",
    dueDate: "24 Aug 2026",
    version: "v3.1",
    status: "pending",
    priority: "normal",
    comments: 5,
    previewUrl: "#",
  },
  {
    id: "approval-003",
    title: "Product Launch Social Assets",
    description: "Social media creatives prepared for the upcoming product launch campaign.",
    project: "Product Launch",
    type: "Creative",
    submittedBy: "Arjun Rao",
    submittedRole: "3D Artist",
    submittedDate: "19 Aug 2026",
    dueDate: "23 Aug 2026",
    version: "v2.0",
    status: "pending",
    priority: "normal",
    comments: 2,
    previewUrl: "#",
  },
  {
    id: "approval-004",
    title: "August Social Content Batch",
    description: "Monthly social content batch approved for publishing.",
    project: "Social Content Retainer",
    type: "Content",
    submittedBy: "Sana Iyer",
    submittedRole: "Project Manager",
    submittedDate: "12 Aug 2026",
    dueDate: "15 Aug 2026",
    version: "v1.5",
    status: "approved",
    priority: "normal",
    comments: 4,
    previewUrl: "#",
  },
  {
    id: "approval-005",
    title: "Hero Film — Creative Direction",
    description: "Creative direction and storyboard previously submitted for review.",
    project: "Summer Campaign 2026",
    type: "Video",
    submittedBy: "Rahul Mehta",
    submittedRole: "Editor",
    submittedDate: "28 Jul 2026",
    dueDate: "30 Jul 2026",
    version: "v1.0",
    status: "approved",
    priority: "normal",
    comments: 6,
    previewUrl: "#",
  },
];

export default function ClientApprovals() {
  const pendingApprovals = approvals.filter((approval) => approval.status === "pending");

  const completedApprovals = approvals.filter((approval) => approval.status === "approved");

  return (
    <div className="min-h-full bg-surface-bg">
      {/* =====================================================
          HEADER
      ===================================================== */}
      <div className="border-b border-surface-border">
        <div className="mx-auto max-w-7xl px-6 py-8 lg:px-8">
          <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
            <div>
              <div className="mb-3 flex items-center gap-2">
                <FileCheck2 className="h-4 w-4 text-brand-orange" />

                <span className="text-[0.65rem] font-bold uppercase tracking-[0.16em] text-brand-orange">
                  Client Review
                </span>
              </div>

              <h1 className="font-display text-3xl font-bold tracking-[-0.04em] text-surface-fg sm:text-4xl">
                Approvals
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-surface-muted">
                Review submitted work, leave feedback and approve deliverables before they move to
                the next stage.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="rounded-xl border border-surface-border bg-surface-card px-4 py-2.5">
                <div className="flex items-center gap-2">
                  <Clock3 className="h-4 w-4 text-brand-orange" />

                  <div>
                    <p className="text-[0.6rem] font-bold uppercase tracking-[0.1em] text-surface-muted">
                      Awaiting Review
                    </p>

                    <p className="font-display text-lg font-bold leading-none text-surface-fg">
                      {pendingApprovals.length}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* =====================================================
          CONTENT
      ===================================================== */}
      <div className="mx-auto max-w-7xl px-6 py-8 lg:px-8">
        {/* ===================================================
            PENDING APPROVALS
        =================================================== */}
        {pendingApprovals.length > 0 && (
          <section className="mb-10">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="font-display text-lg font-bold tracking-[-0.02em] text-surface-fg">
                  Awaiting Your Approval
                </h2>

                <p className="mt-1 text-sm text-surface-muted">
                  Review these deliverables and let the team know how to proceed.
                </p>
              </div>

              <div className="hidden items-center gap-2 text-xs font-medium text-surface-muted sm:flex">
                <span className="flex h-2 w-2 rounded-full bg-brand-orange" />
                {pendingApprovals.length} pending
              </div>
            </div>

            <div className="space-y-4">
              {pendingApprovals.map((approval, index) => (
                <ApprovalCard key={approval.id} approval={approval} featured={index === 0} />
              ))}
            </div>
          </section>
        )}

        {/* ===================================================
            COMPLETED APPROVALS
        =================================================== */}
        {completedApprovals.length > 0 && (
          <section>
            <div className="mb-4">
              <h2 className="font-display text-lg font-bold tracking-[-0.02em] text-surface-fg">
                Approval History
              </h2>

              <p className="mt-1 text-sm text-surface-muted">
                Deliverables you have previously reviewed and approved.
              </p>
            </div>

            <div className="overflow-hidden rounded-2xl border border-surface-border bg-surface-card">
              {completedApprovals.map((approval) => (
                <CompletedApprovalRow key={approval.id} approval={approval} />
              ))}
            </div>
          </section>
        )}

        {/* ===================================================
            EMPTY STATE
        =================================================== */}
        {approvals.length === 0 && (
          <div className="rounded-2xl border border-dashed border-surface-border bg-surface-card px-6 py-16 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-surface-bg">
              <FileCheck2 className="h-5 w-5 text-surface-muted" />
            </div>

            <h2 className="mt-4 font-display text-lg font-bold text-surface-fg">
              Nothing needs your approval
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-surface-muted">
              There are currently no deliverables waiting for your review.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

/* ============================================================
   APPROVAL CARD
============================================================ */

function ApprovalCard({ approval, featured = false }) {
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
      <div className="p-6">
        {/* TOP */}
        <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
          <div className="min-w-0">
            <div className="mb-2 flex flex-wrap items-center gap-2">
              {featured && (
                <span className="rounded-full bg-brand-orange px-2.5 py-1 text-[0.6rem] font-bold uppercase tracking-[0.1em] text-white">
                  Needs Review
                </span>
              )}

              <span className="rounded-full bg-surface-bg px-2.5 py-1 text-[0.6rem] font-semibold text-surface-muted">
                {approval.project}
              </span>

              <span className="rounded-full bg-surface-bg px-2.5 py-1 text-[0.6rem] font-semibold text-surface-muted">
                {approval.type}
              </span>

              {approval.priority === "high" && (
                <span className="flex items-center gap-1 rounded-full bg-red-500/10 px-2.5 py-1 text-[0.6rem] font-semibold text-red-600">
                  <AlertCircle className="h-3 w-3" />
                  High Priority
                </span>
              )}
            </div>

            <h3 className="font-display text-xl font-bold tracking-[-0.03em] text-surface-fg">
              {approval.title}
            </h3>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-surface-muted">
              {approval.description}
            </p>

            {/* META */}
            <div className="mt-5 flex flex-wrap gap-x-5 gap-y-3">
              <Meta icon={FileCheck2} text={`Version ${approval.version}`} />

              <Meta icon={Clock3} text={`Due ${approval.dueDate}`} />

              <Meta icon={MessageSquare} text={`${approval.comments} comments`} />
            </div>
          </div>

          {/* ACTIONS */}
          <div className="flex shrink-0 flex-col gap-2 sm:flex-row xl:flex-col">
            <button
              className={cn(
                "inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3",
                "bg-brand-orange text-sm font-bold text-white",
                "shadow-[0_10px_24px_-8px_rgba(255,90,31,0.5)]",
                "transition-all duration-200 hover:translate-y-[-1px]"
              )}
            >
              <Eye className="h-4 w-4" />
              Review
            </button>

            <a
              href={approval.previewUrl}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-surface-border bg-surface-bg px-5 py-3 text-sm font-semibold text-surface-fg transition-colors hover:border-brand-orange hover:text-brand-orange"
            >
              Preview
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>

        {/* REVIEWER / SUBMISSION INFO */}
        <div className="mt-6 flex flex-col gap-4 border-t border-surface-border pt-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-surface-bg text-xs font-bold text-surface-fg">
              {getInitials(approval.submittedBy)}
            </div>

            <div>
              <p className="text-[0.65rem] font-semibold uppercase tracking-[0.1em] text-surface-muted">
                Submitted by
              </p>

              <p className="mt-0.5 text-sm font-semibold text-surface-fg">{approval.submittedBy}</p>

              <p className="text-[0.65rem] text-surface-muted">
                {approval.submittedRole} · {approval.submittedDate}
              </p>
            </div>
          </div>

          {/* QUICK ACTIONS */}
          <div className="flex items-center gap-2">
            <button className="inline-flex items-center gap-2 rounded-xl border border-surface-border px-4 py-2.5 text-xs font-bold text-surface-fg transition-colors hover:border-red-300 hover:bg-red-500/5 hover:text-red-600">
              <X className="h-3.5 w-3.5" />
              Request Changes
            </button>

            <button className="inline-flex items-center gap-2 rounded-xl bg-emerald-500/10 px-4 py-2.5 text-xs font-bold text-emerald-600 transition-colors hover:bg-emerald-500/15">
              <Check className="h-3.5 w-3.5" />
              Approve
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}

/* ============================================================
   COMPLETED APPROVAL
============================================================ */

function CompletedApprovalRow({ approval }) {
  return (
    <div className="group flex flex-col gap-4 border-b border-surface-border px-6 py-5 last:border-b-0 sm:flex-row sm:items-center">
      {/* ICON */}
      <div className="flex shrink-0 items-center">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10">
          <CheckCircle2 className="h-5 w-5 text-emerald-600" />
        </div>
      </div>

      {/* CONTENT */}
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="truncate text-sm font-bold text-surface-fg">{approval.title}</h3>

          <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[0.6rem] font-semibold text-emerald-600">
            Approved
          </span>
        </div>

        <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-xs text-surface-muted">
          <span>{approval.project}</span>

          <span className="hidden sm:inline">
            {approval.type} · {approval.version}
          </span>

          <span>Reviewed {approval.submittedDate}</span>
        </div>
      </div>

      {/* ACTIONS */}
      <div className="flex items-center gap-2">
        <button className="rounded-lg p-2 text-surface-muted transition-colors hover:bg-surface-bg hover:text-surface-fg">
          <Eye className="h-4 w-4" />
        </button>

        <button className="rounded-lg p-2 text-surface-muted transition-colors hover:bg-surface-bg hover:text-surface-fg">
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

function getInitials(name) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}
