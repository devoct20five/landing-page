import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  Clock3,
  FileText,
  FileVideo,
  FileImage,
  Sheet,
  Layers3,
  Users,
} from "lucide-react";

import { useProject } from "@/hooks/useProjects";
import { useProjectBilling } from "@/hooks/useProjectBilling";
import { useProjectApprovals } from "@/hooks/useProjectApprovals";
import { useProjectTasks, useProjectFiles, useProjectActivity } from "@/hooks/useProjectWorkspace";
import { formatCurrency } from "@/api/adapters/invoice";
import { filesApi, FileType } from "@/api";

import StatusBadge from "@/components/shared/StatusBadge";
import PriorityBadge from "@/components/shared/PriorityBadge";
import { Badge } from "@/components/ui/badge";
import EmptyState from "@/components/shared/EmptyState";
import ErrorState from "@/components/shared/ErrorState";
import { Skeleton, SkeletonList } from "@/components/shared/Skeleton";
import ActivityList from "@/components/activity/ActivityList";
import { cn } from "@/lib/utils";

const TYPE_ICON = {
  [FileType.PDF]: FileText,
  [FileType.IMAGE]: FileImage,
  [FileType.VIDEO]: FileVideo,
  [FileType.SPREADSHEET]: Sheet,
  [FileType.DOC]: FileText,
  [FileType.OTHER]: FileText,
};

const APPROVAL_BADGE = {
  pending: "progress",
  approved: "success",
  "changes-requested": "warning",
  rejected: "blocked",
};

function formatSize(bytes) {
  if (!bytes) return "—";
  const units = ["B", "KB", "MB", "GB"];
  let value = bytes;
  let unit = 0;
  while (value >= 1024 && unit < units.length - 1) {
    value /= 1024;
    unit += 1;
  }
  return `${value.toFixed(value < 10 && unit > 0 ? 1 : 0)} ${units[unit]}`;
}

function SectionHead({ eyebrow, title, action }) {
  return (
    <div className="mb-5 flex items-end justify-between gap-4">
      <div>
        {eyebrow && (
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-surface-muted">
            {eyebrow}
          </p>
        )}
        <h2 className="mt-1 font-display text-xl font-bold text-surface-fg">{title}</h2>
      </div>
      {action}
    </div>
  );
}

function StatCard({ icon: Icon, label, value, description }) {
  return (
    <div className="brand-card">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-surface-muted">
            {label}
          </p>
          <p className="mt-2 font-display text-2xl font-bold tracking-[-0.02em] text-surface-fg">
            {value}
          </p>
          {description && <p className="mt-1 text-xs text-surface-muted">{description}</p>}
        </div>
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-orange/10 text-brand-orange">
          <Icon className="h-[18px] w-[18px]" strokeWidth={2} />
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------- */
/* Tabs                                                                  */
/* -------------------------------------------------------------------- */

function OverviewTab({ project, pendingApprovals, tasks, activity, activityLoading }) {
  return (
    <div className="grid gap-6 lg:grid-cols-[1.35fr_0.65fr]">
      <div className="space-y-6">
        <section className="brand-card">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-surface-muted">
                Current Work
              </p>
              <h2 className="mt-1 font-display text-xl font-bold text-surface-fg">
                {project.currentWork.title ?? "Nothing in progress right now"}
              </h2>
            </div>
            {project.currentWork.service && (
              <span className="shrink-0 rounded-full bg-brand-orange/10 px-3 py-1 text-xs font-semibold text-brand-orange">
                {project.currentWork.service}
              </span>
            )}
          </div>
          {project.currentWork.description && (
            <p className="mt-4 text-sm leading-6 text-surface-muted">
              {project.currentWork.description}
            </p>
          )}
        </section>

        {pendingApprovals.length > 0 && (
          <section className="brand-card border-brand-orange/20 bg-brand-orange/5">
            <p className="text-sm font-semibold text-surface-fg">
              {pendingApprovals.length} approval{pendingApprovals.length === 1 ? "" : "s"} waiting
              on the client
            </p>
            <p className="mt-1 text-xs text-surface-muted">
              {pendingApprovals[0].title}
              {pendingApprovals.length > 1 && ` and ${pendingApprovals.length - 1} more`}
            </p>
          </section>
        )}

        <section className="brand-card">
          <SectionHead eyebrow="Delivery" title="Open tasks" />
          {tasks.length === 0 ? (
            <p className="text-sm text-surface-muted">No open tasks on this project.</p>
          ) : (
            <ul className="space-y-2">
              {tasks.slice(0, 5).map((task) => (
                <li
                  key={task.id}
                  className="flex items-center justify-between gap-3 rounded-xl border border-surface-border px-4 py-3"
                >
                  <span className="min-w-0 truncate text-sm font-medium text-surface-fg">
                    {task.title}
                  </span>
                  <div className="flex shrink-0 items-center gap-3">
                    <PriorityBadge priority={task.priority} />
                    <StatusBadge status={task.status} />
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      <aside className="space-y-6">
        <section className="brand-card">
          <SectionHead eyebrow="Team" title="Who's working on it" />
          {project.teamMembers.length === 0 ? (
            <p className="text-sm text-surface-muted">No team members assigned yet.</p>
          ) : (
            <div className="space-y-3">
              {project.teamMembers.map((member) => (
                <div key={member.id} className="flex items-center gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-orange/10 text-xs font-bold text-brand-orange">
                    {member.initials}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-surface-fg">{member.name}</p>
                    {member.role && (
                      <p className="truncate text-xs text-surface-muted">{member.role}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="brand-card">
          <SectionHead eyebrow="Recent" title="Activity" />
          {activityLoading ? (
            <SkeletonList rows={3} />
          ) : (
            <ActivityList items={activity.slice(0, 6)} />
          )}
        </section>
      </aside>
    </div>
  );
}

function TasksTab({ tasks, isLoading, error, refetch }) {
  if (isLoading) return <SkeletonList rows={5} />;
  if (error) return <ErrorState error={error} resource="Tasks" onRetry={refetch} />;
  if (tasks.length === 0) {
    return (
      <EmptyState
        title="No tasks on this project"
        description="Tasks created for this project will show up here."
      />
    );
  }

  return (
    <div className="brand-card divide-y divide-surface-border p-0">
      {tasks.map((task) => (
        <div
          key={task.id}
          className="flex flex-col gap-3 px-6 py-4 sm:flex-row sm:items-center sm:justify-between"
        >
          <div className="min-w-0">
            <p className="font-display text-sm font-bold text-surface-fg">{task.title}</p>
            <p className="mt-0.5 text-xs text-surface-muted">
              {task.assignee?.name ?? "Unassigned"}
              {task.dueDate && ` · Due ${task.dueDate}`}
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-3">
            <PriorityBadge priority={task.priority} />
            <StatusBadge status={task.status} />
            {task.isOverdue && <span className="text-xs font-semibold text-red-600">Overdue</span>}
          </div>
        </div>
      ))}
    </div>
  );
}

function DeliverablesTab({ project }) {
  const deliverables = project.deliverables ?? [];
  if (deliverables.length === 0) {
    return (
      <EmptyState
        title="No deliverables yet"
        description="Deliverables added to this project will appear here, linked to services and approvals."
      />
    );
  }

  return (
    <div className="space-y-3">
      {deliverables.map((deliverable) => {
        const completed = deliverable.status === "approved" || deliverable.status === "delivered";
        return (
          <div
            key={deliverable.id}
            className="flex items-center gap-3 rounded-xl border border-surface-border px-4 py-3"
          >
            <CheckCircle2
              className={cn(
                "h-4 w-4 shrink-0",
                completed ? "text-emerald-600" : "text-surface-border"
              )}
            />
            <div className="min-w-0 flex-1">
              <span
                className={cn(
                  "block truncate text-sm",
                  completed ? "font-medium text-surface-fg" : "text-surface-muted"
                )}
              >
                {deliverable.title}
              </span>
              {deliverable.serviceName && (
                <span className="text-xs text-surface-muted">{deliverable.serviceName}</span>
              )}
            </div>
            {deliverable.dueDate && (
              <span className="shrink-0 text-xs text-surface-muted">Due {deliverable.dueDate}</span>
            )}
            <StatusBadge status={deliverable.status} className="shrink-0" />
          </div>
        );
      })}
    </div>
  );
}

function ApprovalsTab({ approvals, isLoading, error, refetch }) {
  if (isLoading) return <SkeletonList rows={4} />;
  if (error) return <ErrorState error={error} resource="Approvals" onRetry={refetch} />;
  if (approvals.length === 0) {
    return (
      <EmptyState
        title="No approvals requested yet"
        description="Approval requests raised against this project's deliverables will appear here."
      />
    );
  }

  return (
    <div className="space-y-3">
      {approvals.map((approval) => (
        <div
          key={approval.id}
          className="brand-card flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"
        >
          <div className="min-w-0">
            <p className="font-display text-sm font-bold text-surface-fg">{approval.title}</p>
            <p className="mt-0.5 text-xs text-surface-muted">
              v{approval.version}
              {approval.deliverableTitle && ` · ${approval.deliverableTitle}`}
              {approval.waitingSince && ` · waiting ${approval.waitingSince}`}
            </p>
          </div>
          <Badge variant={APPROVAL_BADGE[approval.status] ?? "neutral"} className="shrink-0">
            {approval.status.replace("-", " ")}
          </Badge>
        </div>
      ))}
    </div>
  );
}

function FilesTab({ files, isLoading, error, refetch }) {
  const [downloadingId, setDownloadingId] = useState(null);
  const [downloadError, setDownloadError] = useState(null);

  const handleDownload = async (file) => {
    setDownloadingId(file.id);
    setDownloadError(null);
    try {
      await filesApi.downloadFile(file.id, file.name);
    } catch (err) {
      setDownloadError(err?.message ?? "That file couldn't be downloaded.");
    } finally {
      setDownloadingId(null);
    }
  };

  if (isLoading) return <SkeletonList rows={5} />;
  if (error) return <ErrorState error={error} resource="Files" onRetry={refetch} />;
  if (files.length === 0) {
    return (
      <EmptyState
        title="No files yet"
        description="Files uploaded to this project will appear here."
      />
    );
  }

  return (
    <div className="space-y-2.5">
      {downloadError && (
        <p role="alert" className="text-sm font-medium text-red-600">
          {downloadError}
        </p>
      )}
      {files.map((file) => {
        const Icon = TYPE_ICON[file.fileType] ?? FileText;
        return (
          <div
            key={file.id}
            className="flex items-center gap-4 rounded-card border border-surface-border p-4"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-surface-muted/10 text-surface-muted">
              <Icon className="h-5 w-5" aria-hidden="true" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate font-display text-sm font-bold text-surface-fg">{file.name}</p>
              <p className="mt-1 truncate text-xs text-surface-muted">
                {[
                  formatSize(file.sizeBytes),
                  file.uploaderName,
                  file.version ? `v${file.version}` : null,
                ]
                  .filter(Boolean)
                  .join(" · ")}
              </p>
            </div>
            <button
              type="button"
              onClick={() => handleDownload(file)}
              disabled={downloadingId === file.id}
              className="shrink-0 rounded-xl border border-surface-border px-3.5 py-2 text-xs font-semibold text-surface-fg transition hover:border-brand-orange/40 hover:text-brand-orange disabled:opacity-50"
            >
              {downloadingId === file.id ? "Preparing…" : "Download"}
            </button>
          </div>
        );
      })}
    </div>
  );
}

function TeamTab({ project }) {
  if (project.teamMembers.length === 0) {
    return (
      <EmptyState
        title="No team members assigned"
        description="Staff added to this project will appear here."
      />
    );
  }
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {project.teamMembers.map((member) => (
        <div key={member.id} className="brand-card flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-orange/10 text-sm font-bold text-brand-orange">
            {member.initials}
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-surface-fg">{member.name}</p>
            {member.role && <p className="truncate text-xs text-surface-muted">{member.role}</p>}
          </div>
        </div>
      ))}
    </div>
  );
}

function BillingTab({ billing, isLoading }) {
  if (isLoading) return <SkeletonList rows={3} />;

  if (billing.invoices.length === 0) {
    return (
      <EmptyState
        title="No invoices for this project"
        description="Invoices raised against this project will appear here."
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard icon={Layers3} label="Total" value={formatCurrency(billing.total)} />
        <StatCard icon={CheckCircle2} label="Paid" value={formatCurrency(billing.paid)} />
        <StatCard icon={Clock3} label="Outstanding" value={formatCurrency(billing.outstanding)} />
      </div>

      <div className="brand-card divide-y divide-surface-border p-0">
        {billing.invoices.map((invoice) => (
          <div
            key={invoice.id}
            className="flex flex-col gap-2 px-6 py-4 sm:flex-row sm:items-center sm:justify-between"
          >
            <div>
              <p className="font-display text-sm font-bold text-surface-fg">{invoice.number}</p>
              <p className="mt-0.5 text-xs text-surface-muted">
                {invoice.dueDate ? `Due ${invoice.dueDate}` : "No due date"}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm font-semibold text-surface-fg">
                {formatCurrency(invoice.total)}
              </span>
              <StatusBadge status={invoice.status} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ActivityTab({ activity, isLoading, error, refetch }) {
  if (isLoading) return <SkeletonList rows={5} />;
  if (error) return <ErrorState error={error} resource="Activity" onRetry={refetch} />;
  return <ActivityList items={activity} />;
}

/* -------------------------------------------------------------------- */
/* Workspace                                                             */
/* -------------------------------------------------------------------- */

/**
 * Shared project workspace for staff and admin. Client has its own
 * ProjectDetail page (a different information architecture, per
 * 03_UI_UX_IMPROVEMENT.md — client is presentation-friendly, this is
 * operational and denser).
 *
 * @param {{ backTo: string, role: 'staff'|'admin' }} props
 */
export default function ProjectWorkspace({ backTo, role }) {
  const { projectId } = useParams();

  const { project, isLoading, error, isForbidden, isNotFound, refetch } = useProject(projectId);
  const {
    tasks,
    isLoading: tasksLoading,
    error: tasksError,
    refetch: refetchTasks,
  } = useProjectTasks(projectId);
  const {
    approvals,
    pending,
    isLoading: approvalsLoading,
    error: approvalsError,
    refetch: refetchApprovals,
  } = useProjectApprovals(projectId);
  const {
    files,
    isLoading: filesLoading,
    error: filesError,
    refetch: refetchFiles,
  } = useProjectFiles(projectId);
  const {
    activity,
    isLoading: activityLoading,
    error: activityError,
    refetch: refetchActivity,
  } = useProjectActivity(projectId);
  const { billing, isLoading: billingLoading } = useProjectBilling(projectId, {
    enabled: role === "admin",
  });

  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "work", label: "Work" },
    { id: "tasks", label: "Tasks" },
    { id: "deliverables", label: "Deliverables" },
    { id: "approvals", label: "Approvals" },
    { id: "files", label: "Files" },
    { id: "team", label: "Team" },
    { id: "activity", label: "Activity" },
    ...(role === "admin" ? [{ id: "billing", label: "Billing" }] : []),
  ];

  const [tab, setTab] = useState("overview");

  if (isLoading) {
    return (
      <div className="mx-auto max-w-[1320px]">
        <Skeleton className="mb-4 h-10 w-2/3" />
        <Skeleton className="mb-8 h-4 w-1/3" />
        <SkeletonList rows={5} />
      </div>
    );
  }

  if (isNotFound) {
    return (
      <div className="mx-auto max-w-[1320px]">
        <EmptyState
          title="Project not found"
          description="This project doesn't exist or is no longer available."
        />
        <div className="mt-6 flex justify-center">
          <Link
            to={backTo}
            className="inline-flex items-center gap-2 rounded-xl bg-brand-orange px-4 py-2.5 text-sm font-semibold text-white transition hover:opacity-90"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Projects
          </Link>
        </div>
      </div>
    );
  }

  if (isForbidden || error || !project) {
    return (
      <div className="mx-auto max-w-[1320px]">
        <BackLink to={backTo} />
        <ErrorState
          error={error}
          resource="This project"
          onRetry={isForbidden ? undefined : refetch}
        />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1320px] animate-fade-up">
      <BackLink to={backTo} />

      {/* Header */}
      <section className="mb-7">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="min-w-0">
            <div className="mb-3 flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-surface-muted/10 px-3 py-1 text-xs font-semibold text-surface-muted">
                {project.clientName}
              </span>
            </div>
            <h1 className="font-display text-display-md font-bold tracking-[-0.025em] text-surface-fg">
              {project.name}
            </h1>
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <StatusBadge status={project.status} />
              {project.attentionReason && (
                <span className="rounded-full bg-red-500/10 px-3 py-1 text-xs font-semibold text-red-600">
                  {project.attentionReason}
                </span>
              )}
            </div>
          </div>

          <div className="shrink-0 rounded-2xl border border-surface-border bg-surface-bg px-5 py-4 lg:min-w-[210px]">
            <div className="flex items-center gap-2 text-surface-muted">
              <CalendarDays className="h-4 w-4" />
              <span className="text-xs font-semibold uppercase tracking-[0.1em]">Deadline</span>
            </div>
            <p className="mt-2 font-display text-lg font-bold text-surface-fg">
              {project.deadline}
            </p>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={Layers3} label="Progress" value={`${project.progress}%`} />
        <StatCard
          icon={CheckCircle2}
          label="Deliverables"
          value={
            project.totalDeliverables !== null
              ? `${project.completedDeliverables}/${project.totalDeliverables}`
              : "—"
          }
        />
        <StatCard
          icon={Clock3}
          label="Open Tasks"
          value={
            tasksLoading
              ? "—"
              : tasks.filter((t) => t.status !== "completed" && t.status !== "cancelled").length
          }
        />
        <StatCard icon={Users} label="Team" value={project.teamSize} />
      </section>

      {/* Tabs */}
      <div className="mb-6 flex gap-1 overflow-x-auto border-b border-surface-border">
        {tabs.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setTab(item.id)}
            className={cn(
              "-mb-px shrink-0 border-b-2 px-4 py-2.5 text-sm font-semibold transition",
              tab === item.id
                ? "border-brand-orange text-brand-orange"
                : "border-transparent text-surface-muted hover:text-surface-fg"
            )}
          >
            {item.label}
          </button>
        ))}
      </div>

      {tab === "overview" && (
        <OverviewTab
          project={project}
          pendingApprovals={pending}
          tasks={tasks}
          activity={activity}
          activityLoading={activityLoading}
        />
      )}
      {tab === "work" && (
        <section className="brand-card max-w-2xl">
          <SectionHead
            eyebrow="Currently"
            title={project.currentWork.title ?? "Nothing in progress"}
          />
          {project.currentWork.description && (
            <p className="text-sm leading-6 text-surface-muted">
              {project.currentWork.description}
            </p>
          )}
          {project.services.length > 0 && (
            <div className="mt-5 flex flex-wrap gap-2">
              {project.services.map((service) => (
                <span
                  key={service}
                  className="rounded-lg bg-surface-muted/5 px-2.5 py-1.5 text-xs font-semibold text-surface-muted"
                >
                  {service}
                </span>
              ))}
            </div>
          )}
        </section>
      )}
      {tab === "tasks" && (
        <TasksTab
          tasks={tasks}
          isLoading={tasksLoading}
          error={tasksError}
          refetch={refetchTasks}
        />
      )}
      {tab === "deliverables" && <DeliverablesTab project={project} />}
      {tab === "approvals" && (
        <ApprovalsTab
          approvals={approvals}
          isLoading={approvalsLoading}
          error={approvalsError}
          refetch={refetchApprovals}
        />
      )}
      {tab === "files" && (
        <FilesTab
          files={files}
          isLoading={filesLoading}
          error={filesError}
          refetch={refetchFiles}
        />
      )}
      {tab === "team" && <TeamTab project={project} />}
      {tab === "activity" && (
        <ActivityTab
          activity={activity}
          isLoading={activityLoading}
          error={activityError}
          refetch={refetchActivity}
        />
      )}
      {tab === "billing" && role === "admin" && (
        <BillingTab billing={billing} isLoading={billingLoading} />
      )}
    </div>
  );
}

function BackLink({ to }) {
  return (
    <div className="mb-6">
      <Link
        to={to}
        className="inline-flex items-center gap-2 text-sm font-medium text-surface-muted transition hover:text-surface-fg"
      >
        <ArrowLeft className="h-4 w-4" />
        All Projects
      </Link>
    </div>
  );
}
