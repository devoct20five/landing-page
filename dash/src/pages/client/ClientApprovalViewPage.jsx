import { useState } from "react";
import {
  ArrowLeft,
  Check,
  CheckCircle2,
  Clock3,
  ExternalLink,
  FileCheck2,
  Loader2,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Link, useParams } from "react-router-dom";

import { approvalsApi, filesApi } from "@/api";
import { adaptApproval } from "@/api/adapters/approval";
import { useApiResource } from "@/hooks/useApiResource";
import { useApprovalReview } from "@/hooks/useApprovalReview";
import ErrorState from "@/components/shared/ErrorState";
import { Skeleton } from "@/components/shared/Skeleton";
import EmptyState from "@/components/shared/EmptyState";

function formatDateTime(value) {
  if (!value) return "—";
  return new Date(value).toLocaleString(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function formatSize(bytes) {
  if (!bytes) return null;
  const units = ["B", "KB", "MB", "GB"];
  let value = bytes;
  let unit = 0;
  while (value >= 1024 && unit < units.length - 1) {
    value /= 1024;
    unit += 1;
  }
  return `${value.toFixed(value < 10 && unit > 0 ? 1 : 0)} ${units[unit]}`;
}

/* ============================================================
   PAGE
============================================================ */

export default function ClientApprovalViewPage() {
  const { id } = useParams();

  const fetcher = () => approvalsApi.getApproval(id);
  const { data, isLoading, error, isForbidden, isNotFound, refetch } = useApiResource(fetcher, [id]);
  const approval = data ? adaptApproval(data) : null;

  const historyFetcher = () =>
    approval?.deliverableId
      ? approvalsApi.getDeliverableApprovalHistory(approval.deliverableId)
      : Promise.resolve([]);
  const { data: historyData } = useApiResource(historyFetcher, [approval?.deliverableId], {
    enabled: Boolean(approval?.deliverableId),
  });
  const history = (Array.isArray(historyData) ? historyData : []).map(adaptApproval);

  if (isLoading) {
    return (
      <div className="mx-auto max-w-7xl px-6 py-8 lg:px-8">
        <Skeleton className="mb-6 h-4 w-40" />
        <Skeleton className="mb-3 h-9 w-2/3" />
        <Skeleton className="h-4 w-1/3" />
      </div>
    );
  }

  if (isNotFound) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-16">
        <EmptyState
          title="Approval not found"
          description="This approval doesn't exist or is no longer available."
        />
        <div className="mt-6 flex justify-center">
          <Link
            to="/client/approvals"
            className="inline-flex items-center gap-2 rounded-xl bg-brand-orange px-4 py-2.5 text-sm font-semibold text-white transition hover:opacity-90"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Approvals
          </Link>
        </div>
      </div>
    );
  }

  if (error || !approval) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-16">
        <ErrorState error={error} resource="This approval" onRetry={isForbidden ? undefined : refetch} />
      </div>
    );
  }

  const isPending = approval.status === "pending";
  const file = approval.raw?.file;

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
                <StatusPill status={approval.status} />

                <span className="rounded-full bg-surface-card px-2.5 py-1 text-[0.6rem] font-semibold text-surface-muted">
                  {approval.projectName}
                </span>

                {approval.deliverableTitle && (
                  <span className="rounded-full bg-surface-card px-2.5 py-1 text-[0.6rem] font-semibold text-surface-muted">
                    {approval.deliverableTitle}
                  </span>
                )}
              </div>

              <h1 className="font-display text-3xl font-bold tracking-[-0.04em] text-surface-fg sm:text-4xl">
                {approval.title}
              </h1>

              <p className="mt-2 text-sm text-surface-muted">Version {approval.version}</p>
            </div>
          </div>
        </div>
      </div>

      {/* ======================================================
          MAIN CONTENT
      ====================================================== */}

      <main className="mx-auto max-w-7xl px-6 py-8 lg:px-8">
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
          {/* LEFT COLUMN */}
          <div className="min-w-0 space-y-6">
            <FilePanel file={file} />

            {approval.feedback && <FeedbackPanel approval={approval} />}
          </div>

          {/* RIGHT SIDEBAR */}
          <aside className="space-y-4 xl:sticky xl:top-6 xl:self-start">
            {isPending ? (
              <ReviewPanel approval={approval} onReviewed={refetch} />
            ) : (
              <ReviewedSummary approval={approval} />
            )}

            <SubmissionDetails approval={approval} />

            {history.length > 1 && <VersionHistory history={history} currentId={approval.id} />}
          </aside>
        </div>
      </main>

      {/* ======================================================
          MOBILE ACTION BAR
      ====================================================== */}

      {isPending && <MobileActionBar approval={approval} onReviewed={refetch} />}
    </div>
  );
}

/* ============================================================
   STATUS PILL
============================================================ */

function StatusPill({ status }) {
  const config = {
    pending: { label: "Awaiting Review", className: "bg-brand-orange/10 text-brand-orange", icon: Clock3 },
    approved: { label: "Approved", className: "bg-emerald-500/10 text-emerald-600", icon: CheckCircle2 },
    "changes-requested": { label: "Changes Requested", className: "bg-amber-500/10 text-amber-600", icon: X },
    rejected: { label: "Rejected", className: "bg-red-500/10 text-red-600", icon: X },
  }[status] ?? { label: status, className: "bg-surface-muted/10 text-surface-muted", icon: Clock3 };

  const Icon = config.icon;

  return (
    <span
      className={cn(
        "flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[0.6rem] font-bold uppercase tracking-[0.1em]",
        config.className,
      )}
    >
      <Icon className="h-3 w-3" />
      {config.label}
    </span>
  );
}

/* ============================================================
   FILE PANEL
============================================================ */

function FilePanel({ file }) {
  const [downloading, setDownloading] = useState(false);

  const handleOpen = async () => {
    if (!file) return;
    setDownloading(true);
    try {
      await filesApi.downloadFile(file.id, file.name);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <section className="overflow-hidden rounded-2xl border border-surface-border bg-surface-card">
      <div className="flex items-center gap-2 border-b border-surface-border px-5 py-4">
        <FileCheck2 className="h-4 w-4 text-brand-orange" />
        <h2 className="text-sm font-bold text-surface-fg">Submitted File</h2>
      </div>

      {file ? (
        <div className="flex flex-col gap-4 px-5 py-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-orange/10">
              <FileCheck2 className="h-4 w-4 text-brand-orange" />
            </div>
            <div>
              <p className="text-sm font-bold text-surface-fg">{file.name}</p>
              <p className="mt-0.5 text-xs text-surface-muted">
                {[file.fileType, formatSize(file.sizeBytes), file.version ? `v${file.version}` : null]
                  .filter(Boolean)
                  .join(" · ")}
              </p>
            </div>
          </div>

          <button
            onClick={handleOpen}
            disabled={downloading}
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-surface-border px-4 py-2.5 text-xs font-semibold text-surface-fg transition-colors hover:border-brand-orange hover:text-brand-orange disabled:opacity-50"
          >
            {downloading ? "Opening…" : "Open File"}
            <ExternalLink className="h-3.5 w-3.5" />
          </button>
        </div>
      ) : (
        <p className="px-5 py-6 text-sm text-surface-muted">No file was attached to this approval.</p>
      )}
    </section>
  );
}

/* ============================================================
   FEEDBACK
============================================================ */

function FeedbackPanel({ approval }) {
  return (
    <section className="rounded-2xl border border-surface-border bg-surface-card p-5">
      <h2 className="text-sm font-bold text-surface-fg">
        {approval.status === "approved" ? "Your note" : "Feedback sent"}
      </h2>
      <p className="mt-3 text-sm leading-6 text-surface-muted">&ldquo;{approval.feedback}&rdquo;</p>
      {approval.reviewedAt && (
        <p className="mt-3 text-xs text-surface-muted">{formatDateTime(approval.reviewedAt)}</p>
      )}
    </section>
  );
}

/* ============================================================
   REVIEW PANEL (pending)
============================================================ */

function ReviewPanel({ approval, onReviewed }) {
  const [mode, setMode] = useState("idle"); // idle | changes | reject
  const [feedback, setFeedback] = useState("");

  const { approve, requestChanges, reject, isApproving, isBusy, error } = useApprovalReview(approval.id, {
    onSuccess: onReviewed,
  });

  const submit = async () => {
    if (!feedback.trim()) return;
    if (mode === "changes") await requestChanges(feedback.trim());
    if (mode === "reject") await reject(feedback.trim());
    setMode("idle");
    setFeedback("");
  };

  return (
    <section className="rounded-2xl border border-surface-border bg-surface-card p-5">
      <div className="flex items-center gap-2">
        <FileCheck2 className="h-4 w-4 text-brand-orange" />
        <h2 className="text-sm font-bold text-surface-fg">Your Review</h2>
      </div>

      <p className="mt-2 text-xs leading-5 text-surface-muted">
        Once you're happy with this deliverable, approve it to move the project forward.
      </p>

      {mode === "idle" ? (
        <div className="mt-5 space-y-2">
          <button
            onClick={() => approve()}
            disabled={isBusy}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 text-xs font-bold text-white shadow-[0_10px_24px_-8px_rgba(16,185,129,0.5)] transition-all hover:-translate-y-px disabled:opacity-50"
          >
            {isApproving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
            Approve Deliverable
          </button>

          <button
            onClick={() => setMode("changes")}
            disabled={isBusy}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-surface-border bg-surface-bg px-4 py-3 text-xs font-bold text-red-600 transition-colors hover:border-red-200 hover:bg-red-500/5 disabled:opacity-50"
          >
            <X className="h-4 w-4" />
            Request Changes
          </button>
        </div>
      ) : (
        <div className="mt-5">
          <label className="mb-2 block text-xs font-semibold text-surface-fg">
            What needs to change?
          </label>
          <textarea
            value={feedback}
            onChange={(event) => setFeedback(event.target.value)}
            rows={4}
            autoFocus
            placeholder="Tell the team what to adjust…"
            className="brand-input w-full resize-none"
          />
          {error && (
            <p role="alert" className="mt-2 text-xs font-medium text-red-600">
              {error.message}
            </p>
          )}
          <div className="mt-3 flex items-center gap-2">
            <button
              onClick={submit}
              disabled={!feedback.trim() || isBusy}
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-xs font-bold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isBusy && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
              Send
            </button>
            <button
              onClick={() => {
                setMode("idle");
                setFeedback("");
              }}
              disabled={isBusy}
              className="rounded-xl px-4 py-2.5 text-xs font-semibold text-surface-muted transition hover:text-surface-fg"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {approval.waitingSince && (
        <div className="mt-4 flex items-start gap-2 rounded-xl bg-surface-bg p-3">
          <Clock3 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand-orange" />
          <p className="text-[0.65rem] leading-5 text-surface-muted">
            Waiting on you for <strong className="text-surface-fg">{approval.waitingSince}</strong>.
          </p>
        </div>
      )}
    </section>
  );
}

/* ============================================================
   REVIEWED SUMMARY (already actioned)
============================================================ */

function ReviewedSummary({ approval }) {
  return (
    <section className="rounded-2xl border border-surface-border bg-surface-card p-5">
      <div className="flex items-center gap-2">
        <StatusPill status={approval.status} />
      </div>
      <p className="mt-3 text-xs leading-5 text-surface-muted">
        {approval.status === "approved"
          ? "You approved this deliverable."
          : "You sent this back for changes."}
        {approval.reviewedAt && ` ${formatDateTime(approval.reviewedAt)}`}
      </p>
    </section>
  );
}

/* ============================================================
   MOBILE ACTION BAR
============================================================ */

function MobileActionBar({ approval, onReviewed }) {
  const [busyAction, setBusyAction] = useState(null);
  const { approve, requestChanges } = useApprovalReview(approval.id, { onSuccess: onReviewed });

  const handleApprove = async () => {
    setBusyAction("approve");
    try {
      await approve();
    } finally {
      setBusyAction(null);
    }
  };

  const handleChanges = () => {
    const feedback = window.prompt("What needs to change?");
    if (!feedback?.trim()) return;
    setBusyAction("changes");
    requestChanges(feedback.trim()).finally(() => setBusyAction(null));
  };

  return (
    <div className="sticky bottom-0 z-20 border-t border-surface-border bg-surface-card/95 p-3 backdrop-blur xl:hidden">
      <div className="mx-auto flex max-w-7xl gap-2">
        <button
          onClick={handleChanges}
          disabled={Boolean(busyAction)}
          className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-500/5 px-4 py-3 text-xs font-bold text-red-600 transition-colors hover:bg-red-500/10 disabled:opacity-50"
        >
          <X className="h-4 w-4" />
          Request Changes
        </button>

        <button
          onClick={handleApprove}
          disabled={Boolean(busyAction)}
          className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 text-xs font-bold text-white shadow-[0_10px_24px_-8px_rgba(16,185,129,0.5)] transition-all hover:-translate-y-px disabled:opacity-50"
        >
          {busyAction === "approve" ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Check className="h-4 w-4" />
          )}
          Approve
        </button>
      </div>
    </div>
  );
}

/* ============================================================
   SUBMISSION DETAILS
============================================================ */

function SubmissionDetails({ approval }) {
  return (
    <section className="rounded-2xl border border-surface-border bg-surface-card p-5">
      <h2 className="text-sm font-bold text-surface-fg">Submission Details</h2>

      <div className="mt-5 space-y-4">
        <DetailRow label="Requested by">
          <span>{approval.requesterName ?? "—"}</span>
        </DetailRow>

        <DetailRow label="Requested">
          <span>{formatDateTime(approval.requestedAt)}</span>
        </DetailRow>

        <DetailRow label="Version">
          <span className="rounded-md bg-surface-bg px-2 py-1 font-bold">v{approval.version}</span>
        </DetailRow>
      </div>
    </section>
  );
}

/* ============================================================
   VERSION HISTORY
============================================================ */

function VersionHistory({ history, currentId }) {
  return (
    <section className="rounded-2xl border border-surface-border bg-surface-card p-5">
      <h2 className="text-sm font-bold text-surface-fg">Version History</h2>

      <div className="mt-4 space-y-1">
        {history.map((round) => {
          const isCurrent = round.id === currentId;
          return (
            <Link
              key={round.id}
              to={`/approval/${round.id}`}
              className={cn(
                "flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition-colors",
                isCurrent ? "bg-brand-orange/5" : "hover:bg-surface-bg",
              )}
            >
              <div
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-lg",
                  isCurrent ? "bg-brand-orange/10" : "bg-surface-bg",
                )}
              >
                {isCurrent ? (
                  <CheckCircle2 className="h-4 w-4 text-brand-orange" />
                ) : (
                  <FileCheck2 className="h-4 w-4 text-surface-muted" />
                )}
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="text-xs font-bold text-surface-fg">v{round.version}</p>
                  {isCurrent && (
                    <span className="rounded-full bg-brand-orange/10 px-1.5 py-0.5 text-[0.5rem] font-bold uppercase text-brand-orange">
                      This one
                    </span>
                  )}
                </div>
                <p className="mt-0.5 text-[0.6rem] text-surface-muted">
                  {formatDateTime(round.requestedAt)}
                </p>
              </div>
            </Link>
          );
        })}
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
      <div className="text-right text-xs font-semibold text-surface-fg">{children}</div>
    </div>
  );
}
