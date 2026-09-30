import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Check,
  CheckCircle2,
  Clock3,
  FileCheck2,
  ExternalLink,
  Loader2,
  X,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { approvalsApi, filesApi } from "@/api";
import { adaptApproval } from "@/api/adapters/approval";
import { useApiResource } from "@/hooks/useApiResource";
import { useApprovalReview } from "@/hooks/useApprovalReview";
import ErrorState from "@/components/shared/ErrorState";
import { SkeletonList } from "@/components/shared/Skeleton";

export default function ClientApprovals() {
  const fetcher = () => approvalsApi.listApprovals({ limit: 100 });
  const { data, isLoading, error, refetch } = useApiResource(fetcher, []);

  const approvals = (data?.items ?? []).map(adaptApproval);
  const pendingApprovals = approvals.filter((approval) => approval.status === "pending");
  const reviewedApprovals = approvals.filter((approval) => approval.status !== "pending");

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
                <ApprovalCard
                  key={approval.id}
                  approval={approval}
                  featured={index === 0}
                  onReviewed={refetch}
                />
              ))}
            </div>
          </section>
        )}

        {/* ===================================================
            COMPLETED APPROVALS
        =================================================== */}
        {reviewedApprovals.length > 0 && (
          <section>
            <div className="mb-4">
              <h2 className="font-display text-lg font-bold tracking-[-0.02em] text-surface-fg">
                Approval History
              </h2>

              <p className="mt-1 text-sm text-surface-muted">
                Deliverables you have previously reviewed.
              </p>
            </div>

            <div className="overflow-hidden rounded-2xl border border-surface-border bg-surface-card">
              {reviewedApprovals.map((approval) => (
                <CompletedApprovalRow key={approval.id} approval={approval} />
              ))}
            </div>
          </section>
        )}

        {/* ===================================================
            EMPTY STATE
        =================================================== */}
        {isLoading && <SkeletonList rows={4} />}

        {!isLoading && error && (
          <ErrorState error={error} resource="Approvals" onRetry={refetch} />
        )}

        {!isLoading && !error && approvals.length === 0 && (
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

function ApprovalCard({ approval, featured = false, onReviewed }) {
  const [mode, setMode] = useState("idle"); // idle | changes | reject
  const [feedback, setFeedback] = useState("");
  const [downloading, setDownloading] = useState(false);

  const { approve, requestChanges, reject, isApproving, isRequestingChanges, isRejecting, error } =
    useApprovalReview(approval.id, { onSuccess: onReviewed });

  const busy = isApproving || isRequestingChanges || isRejecting;
  const fileId = approval.raw?.file?.id ?? approval.raw?.fileId;
  const fileName = approval.raw?.file?.name;

  const handlePreview = async () => {
    if (!fileId) return;
    setDownloading(true);
    try {
      await filesApi.downloadFile(fileId, fileName);
    } finally {
      setDownloading(false);
    }
  };

  const submitFeedback = async () => {
    if (!feedback.trim()) return;
    if (mode === "changes") await requestChanges(feedback.trim());
    if (mode === "reject") await reject(feedback.trim());
    setMode("idle");
    setFeedback("");
  };

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
                {approval.projectName}
              </span>

              {approval.deliverableTitle && (
                <span className="rounded-full bg-surface-bg px-2.5 py-1 text-[0.6rem] font-semibold text-surface-muted">
                  {approval.deliverableTitle}
                </span>
              )}
            </div>

            <h3 className="font-display text-xl font-bold tracking-[-0.03em] text-surface-fg">
              {approval.title}
            </h3>

            {/* META */}
            <div className="mt-5 flex flex-wrap gap-x-5 gap-y-3">
              <Meta icon={FileCheck2} text={`Version ${approval.version}`} />

              {approval.waitingSince && (
                <Meta icon={Clock3} text={`Waiting ${approval.waitingSince}`} />
              )}
            </div>
          </div>

          {/* ACTIONS */}
          <div className="flex shrink-0 flex-col gap-2 sm:flex-row xl:flex-col">
            {fileId && (
              <button
                type="button"
                onClick={handlePreview}
                disabled={downloading}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-surface-border bg-surface-bg px-5 py-3 text-sm font-semibold text-surface-fg transition-colors hover:border-brand-orange hover:text-brand-orange disabled:opacity-50"
              >
                {downloading ? "Opening…" : "Preview"}
                <ExternalLink className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* REVIEWER / SUBMISSION INFO */}
        <div className="mt-6 flex flex-col gap-4 border-t border-surface-border pt-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-surface-bg text-xs font-bold text-surface-fg">
              {approval.requesterName ? getInitials(approval.requesterName) : "—"}
            </div>

            <div>
              <p className="text-[0.65rem] font-semibold uppercase tracking-[0.1em] text-surface-muted">
                Requested by
              </p>

              <p className="mt-0.5 text-sm font-semibold text-surface-fg">
                {approval.requesterName ?? "—"}
              </p>
            </div>
          </div>

          {/* QUICK ACTIONS */}
          {mode === "idle" ? (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setMode("changes")}
                disabled={busy}
                className="inline-flex items-center gap-2 rounded-xl border border-surface-border px-4 py-2.5 text-xs font-bold text-surface-fg transition-colors hover:border-red-300 hover:bg-red-500/5 hover:text-red-600 disabled:opacity-50"
              >
                <X className="h-3.5 w-3.5" />
                Request Changes
              </button>

              <button
                onClick={() => approve()}
                disabled={busy}
                className="inline-flex items-center gap-2 rounded-xl bg-emerald-500/10 px-4 py-2.5 text-xs font-bold text-emerald-600 transition-colors hover:bg-emerald-500/15 disabled:opacity-50"
              >
                {isApproving ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <Check className="h-3.5 w-3.5" />
                )}
                Approve
              </button>
            </div>
          ) : null}
        </div>

        {mode !== "idle" && (
          <div className="mt-4 border-t border-surface-border pt-5">
            <label className="mb-2 block text-xs font-semibold text-surface-fg">
              What needs to change?
            </label>
            <textarea
              value={feedback}
              onChange={(event) => setFeedback(event.target.value)}
              rows={3}
              autoFocus
              placeholder="Tell the team what to adjust before you can approve this…"
              className="brand-input w-full resize-none"
            />
            {error && (
              <p role="alert" className="mt-2 text-xs font-medium text-red-600">
                {error.message}
              </p>
            )}
            <div className="mt-3 flex items-center gap-2">
              <button
                type="button"
                onClick={submitFeedback}
                disabled={!feedback.trim() || busy}
                className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-xs font-bold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {busy && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                Send Feedback
              </button>
              <button
                type="button"
                onClick={() => {
                  setMode("idle");
                  setFeedback("");
                }}
                disabled={busy}
                className="rounded-xl px-4 py-2.5 text-xs font-semibold text-surface-muted transition hover:text-surface-fg"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </article>
  );
}

/* ============================================================
   COMPLETED APPROVAL
============================================================ */

function CompletedApprovalRow({ approval }) {
  const isApproved = approval.status === "approved";
  const isRejected = approval.status === "rejected";

  const badgeClass = isApproved
    ? "bg-emerald-500/10 text-emerald-600"
    : isRejected
      ? "bg-red-500/10 text-red-600"
      : "bg-amber-500/10 text-amber-600";

  const badgeLabel = isApproved
    ? "Approved"
    : isRejected
      ? "Rejected"
      : "Changes Requested";

  return (
    <div className="group flex flex-col gap-4 border-b border-surface-border px-6 py-5 last:border-b-0 sm:flex-row sm:items-center">
      {/* ICON */}
      <div className="flex shrink-0 items-center">
        <div
          className={cn(
            "flex h-10 w-10 items-center justify-center rounded-xl",
            isApproved ? "bg-emerald-500/10" : isRejected ? "bg-red-500/10" : "bg-amber-500/10"
          )}
        >
          {isApproved ? (
            <CheckCircle2 className="h-5 w-5 text-emerald-600" />
          ) : (
            <X className={cn("h-5 w-5", isRejected ? "text-red-600" : "text-amber-600")} />
          )}
        </div>
      </div>

      {/* CONTENT */}
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="truncate text-sm font-bold text-surface-fg">{approval.title}</h3>

          <span className={cn("rounded-full px-2 py-0.5 text-[0.6rem] font-semibold", badgeClass)}>
            {badgeLabel}
          </span>
        </div>

        <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-xs text-surface-muted">
          <span>{approval.projectName}</span>
          <span className="hidden sm:inline">v{approval.version}</span>
          {approval.reviewedAt && (
            <span>
              Reviewed{" "}
              {new Date(approval.reviewedAt).toLocaleDateString(undefined, {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </span>
          )}
        </div>

        {approval.feedback && (
          <p className="mt-2 max-w-2xl text-xs leading-5 text-surface-muted">
            &ldquo;{approval.feedback}&rdquo;
          </p>
        )}
      </div>

      <Link
        to={`/approval/${approval.id}`}
        className="shrink-0 rounded-lg p-2 text-surface-muted transition-colors hover:bg-surface-bg hover:text-surface-fg"
        aria-label={`View ${approval.title}`}
      >
        <ExternalLink className="h-4 w-4" />
      </Link>
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
