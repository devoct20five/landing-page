import {
  Check,
  Clock,
  MessageSquareWarning,
  MoreHorizontal,
  CheckCircle2,
  ExternalLink,
  RotateCcw,
} from "lucide-react";

import { getProjectById, getClientById } from "@/data/mockData";

import { Button } from "@/components/ui/button";

const STATUS_CONFIG = {
  pending: {
    label: "Waiting for approval",
    icon: Clock,
    className: "text-brand-orange",
  },

  "changes-requested": {
    label: "Changes requested",
    icon: MessageSquareWarning,
    className: "text-red-600",
  },

  approved: {
    label: "Approved",
    icon: CheckCircle2,
    className: "text-emerald-700",
  },
};

export default function ApprovalCard({ approval }) {
  const project = getProjectById(approval.projectId);
  const client = getClientById(approval.clientId);

  const config = STATUS_CONFIG[approval.status] || STATUS_CONFIG.pending;

  const Icon = config.icon;

  const handleApprove = () => {
    console.log("Approve approval:", approval.id);
  };

  const handleRequestChanges = () => {
    console.log("Request changes:", approval.id);
  };

  const handleOpen = () => {
    console.log("Open approval:", approval.id);
  };

  return (
    <div className="brand-card group flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
      {/* Main Information */}
      <div className="min-w-0 flex-1">
        <div className="flex items-start gap-3">
          <div className="min-w-0 flex-1">
            <h3 className="font-display text-base font-bold uppercase tracking-[-0.01em] text-surface-fg">
              {approval.title}
            </h3>

            <p className="mt-0.5 text-sm text-surface-muted">
              Version {approval.version} · {client?.name} · {project?.name}
            </p>
          </div>

          {/* Version */}
          <span className="shrink-0 rounded-md bg-surface-muted/10 px-2 py-1 text-[11px] font-semibold text-surface-muted">
            v{approval.version}
          </span>
        </div>

        {/* Status */}
        <div className={`mt-3 flex items-center gap-1.5 text-sm font-medium ${config.className}`}>
          <Icon className="h-4 w-4" strokeWidth={2} />

          {config.label}

          {approval.status !== "approved" && approval.waitingSince && (
            <span className="text-surface-muted">— {approval.waitingSince}</span>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap items-center gap-2">
        {/* Open */}
        <Button variant="outline" size="sm" onClick={handleOpen} className="gap-1.5">
          <ExternalLink size={14} />
          Open
        </Button>

        {/* Pending Actions */}
        {approval.status === "pending" && (
          <>
            <Button size="sm" onClick={handleApprove} className="gap-1.5">
              <Check size={14} />
              Approve
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={handleRequestChanges}
              className="gap-1.5 text-red-600 hover:text-red-700"
            >
              <MessageSquareWarning size={14} />
              Changes
            </Button>
          </>
        )}

        {/* Changes Requested */}
        {approval.status === "changes-requested" && (
          <Button variant="outline" size="sm" onClick={handleOpen} className="gap-1.5">
            <RotateCcw size={14} />
            Review Changes
          </Button>
        )}

        {/* Approved */}
        {approval.status === "approved" && (
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700">
            <CheckCircle2 size={15} />
            Approved
          </span>
        )}

        {/* More */}
        <button
          type="button"
          className="flex h-8 w-8 items-center justify-center rounded-md text-surface-muted transition hover:bg-surface-muted/10 hover:text-surface-fg"
          aria-label="More approval actions"
        >
          <MoreHorizontal size={17} />
        </button>
      </div>
    </div>
  );
}
