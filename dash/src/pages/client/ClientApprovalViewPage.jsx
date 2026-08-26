import {
  ArrowLeft,
  Check,
  CheckCircle2,
  ChevronDown,
  Clock3,
  ExternalLink,
  FileCheck2,
  MessageSquare,
  MoreHorizontal,
  Paperclip,
  Send,
  User,
  X,
  ZoomIn,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Link, useParams } from "react-router-dom";

/* ============================================================
   MOCK DATA
============================================================ */

const approval = {
  id: "approval-001",
  title: "Hero Campaign Film — Final Cut",
  description:
    "Final edited version of the campaign film is ready for your review and approval.",
  project: "Summer Campaign 2026",
  type: "Video",
  submittedBy: "Rahul Mehta",
  submittedRole: "Editor",
  submittedDate: "21 Aug 2026",
  submittedTime: "4:32 PM",
  dueDate: "25 Aug 2026",
  version: "v4.2",
  status: "pending",
  priority: "high",
  previewUrl: "#",
  fileName: "hero-campaign-final-v4.2.mp4",
  duration: "01:24",
  size: "184 MB",
};

const comments = [
  {
    id: "comment-001",
    author: "Rahul Mehta",
    role: "Editor",
    initials: "RM",
    date: "21 Aug 2026",
    time: "4:32 PM",
    message:
      "Final cut uploaded with the revised ending and updated color grade. The previous feedback has been incorporated.",
    own: false,
  },
  {
    id: "comment-002",
    author: "You",
    role: "Client",
    initials: "DV",
    date: "21 Aug 2026",
    time: "5:10 PM",
    message:
      "The overall cut looks great. Can we slightly reduce the music around 00:42? It feels a little loud against the voiceover.",
    own: true,
  },
  {
    id: "comment-003",
    author: "Rahul Mehta",
    role: "Editor",
    initials: "RM",
    date: "21 Aug 2026",
    time: "5:36 PM",
    message:
      "Absolutely. I've adjusted that section and uploaded this version with the music reduced by around 3dB.",
    own: false,
  },
];

/* ============================================================
   PAGE
============================================================ */

export default function ClientApprovalViewPage() {
  const { id } = useParams();

  return (
    <div className="min-h-full bg-surface-bg">
      {/* ======================================================
          HEADER
      ====================================================== */}

      <div className="border-b border-surface-border bg-surface-bg">
        <div className="mx-auto max-w-7xl px-6 py-5 lg:px-8">
          <Link
            to="/client/approvals"
            className="inline-flex items-center gap-2 text-xs font-semibold text-surface-muted transition-colors hover:text-surface-fg"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Approvals
          </Link>

          <div className="mt-6 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="min-w-0">
              <div className="mb-3 flex flex-wrap items-center gap-2">
                <span className="flex items-center gap-1.5 rounded-full bg-brand-orange/10 px-2.5 py-1 text-[0.6rem] font-bold uppercase tracking-[0.1em] text-brand-orange">
                  <Clock3 className="h-3 w-3" />
                  Awaiting Review
                </span>

                <span className="rounded-full bg-surface-card px-2.5 py-1 text-[0.6rem] font-semibold text-surface-muted">
                  {approval.project}
                </span>

                <span className="rounded-full bg-surface-card px-2.5 py-1 text-[0.6rem] font-semibold text-surface-muted">
                  {approval.type}
                </span>

                {approval.priority === "high" && (
                  <span className="rounded-full bg-red-500/10 px-2.5 py-1 text-[0.6rem] font-semibold text-red-600">
                    High Priority
                  </span>
                )}
              </div>

              <h1 className="font-display text-3xl font-bold tracking-[-0.04em] text-surface-fg sm:text-4xl">
                {approval.title}
              </h1>

              <p className="mt-2 max-w-3xl text-sm leading-6 text-surface-muted">
                {approval.description}
              </p>
            </div>

            <div className="flex shrink-0 items-center gap-2">
              <button className="inline-flex items-center gap-2 rounded-xl border border-surface-border bg-surface-card px-4 py-2.5 text-xs font-bold text-surface-fg transition-colors hover:border-brand-orange hover:text-brand-orange">
                <ExternalLink className="h-3.5 w-3.5" />
                Open Full Preview
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ======================================================
          MAIN CONTENT
      ====================================================== */}

      <main className="mx-auto max-w-7xl px-6 py-8 lg:px-8">
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
          {/* ==================================================
              LEFT COLUMN
          ================================================== */}

          <div className="min-w-0 space-y-6">
            <ApprovalPreview />

            <CommentsSection />
          </div>

          {/* ==================================================
              RIGHT SIDEBAR
          ================================================== */}

          <aside className="space-y-4 xl:sticky xl:top-6 xl:self-start">
            <ReviewPanel />

            <SubmissionDetails />

            <VersionHistory />
          </aside>
        </div>
      </main>

      {/* ======================================================
          MOBILE ACTION BAR
      ====================================================== */}

      <div className="sticky bottom-0 z-20 border-t border-surface-border bg-surface-card/95 p-3 backdrop-blur xl:hidden">
        <div className="mx-auto flex max-w-7xl gap-2">
          <button className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-500/5 px-4 py-3 text-xs font-bold text-red-600 transition-colors hover:bg-red-500/10">
            <X className="h-4 w-4" />
            Request Changes
          </button>

          <button className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 text-xs font-bold text-white shadow-[0_10px_24px_-8px_rgba(16,185,129,0.5)] transition-all hover:-translate-y-px">
            <Check className="h-4 w-4" />
            Approve
          </button>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   APPROVAL PREVIEW
============================================================ */

function ApprovalPreview() {
  return (
    <section className="overflow-hidden rounded-2xl border border-surface-border bg-surface-card">
      {/* Preview header */}

      <div className="flex flex-col gap-3 border-b border-surface-border px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <FileCheck2 className="h-4 w-4 text-brand-orange" />

            <h2 className="text-sm font-bold text-surface-fg">
              Approval Content
            </h2>
          </div>

          <p className="mt-1 text-xs text-surface-muted">
            Review the submitted deliverable before approving.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="rounded-lg bg-surface-bg px-2.5 py-1.5 text-[0.65rem] font-bold text-surface-muted">
            v4.2
          </span>

          <button className="rounded-lg p-2 text-surface-muted transition-colors hover:bg-surface-bg hover:text-surface-fg">
            <ZoomIn className="h-4 w-4" />
          </button>

          <button className="rounded-lg p-2 text-surface-muted transition-colors hover:bg-surface-bg hover:text-surface-fg">
            <MoreHorizontal className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Video preview */}

      <div className="relative aspect-video bg-black">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative h-full w-full">
            {/* Fake cinematic preview */}

            <div className="absolute inset-0 bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-950" />

            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-white/20 bg-white/10 backdrop-blur-sm">
                  <svg
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="ml-1 h-7 w-7 text-white"
                  >
                    <path d="M8 5.14v13.72c0 .79.87 1.27 1.54.84l10.03-6.86a1 1 0 0 0 0-1.68L9.54 4.3A1 1 0 0 0 8 5.14Z" />
                  </svg>
                </div>

                <p className="mt-4 text-xs font-semibold text-white/70">
                  Hero Campaign Film — Final Cut
                </p>

                <p className="mt-1 text-[0.65rem] text-white/40">
                  Click to play preview
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Video controls */}

        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent px-5 pb-4 pt-12">
          <div className="mb-3 h-1 rounded-full bg-white/20">
            <div className="h-full w-[32%] rounded-full bg-brand-orange" />
          </div>

          <div className="flex items-center justify-between text-[0.65rem] font-medium text-white/70">
            <span>00:27</span>
            <span>01:24</span>
          </div>
        </div>
      </div>

      {/* File information */}

      <div className="flex flex-col gap-4 border-t border-surface-border px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-orange/10">
            <FileCheck2 className="h-4 w-4 text-brand-orange" />
          </div>

          <div>
            <p className="text-xs font-bold text-surface-fg">
              hero-campaign-final-v4.2.mp4
            </p>

            <p className="mt-0.5 text-[0.65rem] text-surface-muted">
              Video · 184 MB · 01:24
            </p>
          </div>
        </div>

        <button className="inline-flex items-center justify-center gap-2 rounded-lg border border-surface-border px-3 py-2 text-xs font-semibold text-surface-fg transition-colors hover:border-brand-orange hover:text-brand-orange">
          <ExternalLink className="h-3.5 w-3.5" />
          Open Preview
        </button>
      </div>
    </section>
  );
}

/* ============================================================
   COMMENTS
============================================================ */

function CommentsSection() {
  return (
    <section className="overflow-hidden rounded-2xl border border-surface-border bg-surface-card">
      {/* Header */}

      <div className="flex items-center justify-between border-b border-surface-border px-5 py-4">
        <div>
          <div className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4 text-brand-orange" />

            <h2 className="text-sm font-bold text-surface-fg">Comments</h2>

            <span className="rounded-full bg-surface-bg px-2 py-0.5 text-[0.6rem] font-bold text-surface-muted">
              {comments.length}
            </span>
          </div>

          <p className="mt-1 text-xs text-surface-muted">
            Discuss feedback with the project team.
          </p>
        </div>
      </div>

      {/* Comment list */}

      <div className="divide-y divide-surface-border">
        {comments.map((comment) => (
          <Comment key={comment.id} comment={comment} />
        ))}
      </div>

      {/* Composer */}

      <CommentComposer />
    </section>
  );
}

/* ============================================================
   COMMENT
============================================================ */

function Comment({ comment }) {
  return (
    <div className="px-5 py-5">
      <div className="flex gap-3">
        <div
          className={cn(
            "flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[0.65rem] font-bold",
            comment.own
              ? "bg-brand-orange text-white"
              : "bg-surface-bg text-surface-fg"
          )}
        >
          {comment.initials}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <span className="text-xs font-bold text-surface-fg">
              {comment.author}
            </span>

            <span className="rounded-full bg-surface-bg px-2 py-0.5 text-[0.55rem] font-semibold text-surface-muted">
              {comment.role}
            </span>

            <span className="text-[0.6rem] text-surface-muted">
              {comment.date} · {comment.time}
            </span>
          </div>

          <p className="mt-2 max-w-3xl text-sm leading-6 text-surface-muted">
            {comment.message}
          </p>

          {comment.author !== "You" && (
            <button className="mt-2 text-[0.65rem] font-bold text-surface-muted transition-colors hover:text-brand-orange">
              Reply
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   COMMENT COMPOSER
============================================================ */

function CommentComposer() {
  return (
    <div className="border-t border-surface-border bg-surface-bg/50 p-4">
      <div className="rounded-xl border border-surface-border bg-surface-card transition-colors focus-within:border-brand-orange/50">
        <textarea
          rows={3}
          placeholder="Write a comment or leave feedback..."
          className="w-full resize-none bg-transparent px-4 py-3 text-sm text-surface-fg outline-none placeholder:text-surface-muted"
        />

        <div className="flex items-center justify-between border-t border-surface-border px-3 py-2">
          <button className="rounded-lg p-2 text-surface-muted transition-colors hover:bg-surface-bg hover:text-surface-fg">
            <Paperclip className="h-4 w-4" />
          </button>

          <button className="inline-flex items-center gap-2 rounded-lg bg-brand-orange px-3.5 py-2 text-xs font-bold text-white shadow-[0_8px_20px_-8px_rgba(255,90,31,0.5)] transition-all hover:-translate-y-px">
            <Send className="h-3.5 w-3.5" />
            Send Comment
          </button>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   REVIEW PANEL
============================================================ */

function ReviewPanel() {
  return (
    <section className="rounded-2xl border border-surface-border bg-surface-card p-5">
      <div className="flex items-center gap-2">
        <FileCheck2 className="h-4 w-4 text-brand-orange" />

        <h2 className="text-sm font-bold text-surface-fg">
          Your Review
        </h2>
      </div>

      <p className="mt-2 text-xs leading-5 text-surface-muted">
        Once you're happy with this deliverable, approve it to move the
        project forward.
      </p>

      <div className="mt-5 space-y-2">
        <button className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 text-xs font-bold text-white shadow-[0_10px_24px_-8px_rgba(16,185,129,0.5)] transition-all hover:-translate-y-px">
          <Check className="h-4 w-4" />
          Approve Deliverable
        </button>

        <button className="flex w-full items-center justify-center gap-2 rounded-xl border border-surface-border bg-surface-bg px-4 py-3 text-xs font-bold text-red-600 transition-colors hover:border-red-200 hover:bg-red-500/5">
          <X className="h-4 w-4" />
          Request Changes
        </button>
      </div>

      <div className="mt-4 flex items-start gap-2 rounded-xl bg-surface-bg p-3">
        <Clock3 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand-orange" />

        <p className="text-[0.65rem] leading-5 text-surface-muted">
          Review requested by <strong className="text-surface-fg">25 Aug 2026</strong>.
        </p>
      </div>
    </section>
  );
}

/* ============================================================
   SUBMISSION DETAILS
============================================================ */

function SubmissionDetails() {
  return (
    <section className="rounded-2xl border border-surface-border bg-surface-card p-5">
      <h2 className="text-sm font-bold text-surface-fg">
        Submission Details
      </h2>

      <div className="mt-5 space-y-4">
        <DetailRow label="Submitted by">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-surface-bg text-[0.55rem] font-bold text-surface-fg">
              RM
            </div>

            <div>
              <p className="text-xs font-semibold text-surface-fg">
                Rahul Mehta
              </p>

              <p className="text-[0.6rem] text-surface-muted">
                Editor
              </p>
            </div>
          </div>
        </DetailRow>

        <DetailRow label="Submitted">
          <span>21 Aug 2026 · 4:32 PM</span>
        </DetailRow>

        <DetailRow label="Version">
          <span className="rounded-md bg-surface-bg px-2 py-1 font-bold">
            v4.2
          </span>
        </DetailRow>

        <DetailRow label="Due date">
          <span className="text-brand-orange">25 Aug 2026</span>
        </DetailRow>

        <DetailRow label="Comments">
          <span>3</span>
        </DetailRow>
      </div>
    </section>
  );
}

/* ============================================================
   VERSION HISTORY
============================================================ */

function VersionHistory() {
  const versions = [
    {
      version: "v4.2",
      date: "21 Aug 2026",
      current: true,
    },
    {
      version: "v4.1",
      date: "20 Aug 2026",
      current: false,
    },
    {
      version: "v4.0",
      date: "18 Aug 2026",
      current: false,
    },
  ];

  return (
    <section className="rounded-2xl border border-surface-border bg-surface-card p-5">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-bold text-surface-fg">
          Version History
        </h2>

        <button className="text-surface-muted hover:text-surface-fg">
          <ChevronDown className="h-4 w-4" />
        </button>
      </div>

      <div className="mt-4 space-y-1">
        {versions.map((version) => (
          <button
            key={version.version}
            className={cn(
              "flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition-colors",
              version.current
                ? "bg-brand-orange/5"
                : "hover:bg-surface-bg"
            )}
          >
            <div
              className={cn(
                "flex h-8 w-8 items-center justify-center rounded-lg",
                version.current
                  ? "bg-brand-orange/10"
                  : "bg-surface-bg"
              )}
            >
              {version.current ? (
                <CheckCircle2 className="h-4 w-4 text-brand-orange" />
              ) : (
                <FileCheck2 className="h-4 w-4 text-surface-muted" />
              )}
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <p className="text-xs font-bold text-surface-fg">
                  {version.version}
                </p>

                {version.current && (
                  <span className="rounded-full bg-brand-orange/10 px-1.5 py-0.5 text-[0.5rem] font-bold uppercase text-brand-orange">
                    Current
                  </span>
                )}
              </div>

              <p className="mt-0.5 text-[0.6rem] text-surface-muted">
                {version.date}
              </p>
            </div>
          </button>
        ))}
      </div>
    </section>
  );
}

/* ============================================================
   DETAIL ROW
============================================================ */

function DetailRow({ label, children }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <span className="text-[0.65rem] font-semibold uppercase tracking-[0.06em] text-surface-muted">
        {label}
      </span>

      <div className="text-right text-xs font-semibold text-surface-fg">
        {children}
      </div>
    </div>
  );
}