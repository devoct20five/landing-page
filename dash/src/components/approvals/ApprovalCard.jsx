import { Link } from "react-router-dom";
import {
  Clock,
  MessageSquareWarning,
  CheckCircle2,
  XCircle,
  ExternalLink,
} from "lucide-react";

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
    className: "text-amber-600",
  },
  approved: {
    label: "Approved",
    icon: CheckCircle2,
    className: "text-emerald-700",
  },
  rejected: {
    label: "Rejected",
    icon: XCircle,
    className: "text-red-600",
  },
};

/**
 * Staff/admin approval card — read-only by design. Only the client can
 * approve, request changes, or reject (enforced server-side in
 * approvals.service.ts: "Only the client can review an approval"), so this
 * card shows status and links back to the project rather than exposing
 * review actions that would 403.
 *
 * @param {{ approval: ReturnType<typeof import("@/api/adapters/approval").adaptApproval> }} props
 */
export default function ApprovalCard({ approval }) {
  const config = STATUS_CONFIG[approval.status] || STATUS_CONFIG.pending;
  const Icon = config.icon;

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
              Version {approval.version} · {approval.clientName} · {approval.projectName}
            </p>
          </div>

          <span className="shrink-0 rounded-md bg-surface-muted/10 px-2 py-1 text-[11px] font-semibold text-surface-muted">
            v{approval.version}
          </span>
        </div>

        {/* Status */}
        <div className={`mt-3 flex items-center gap-1.5 text-sm font-medium ${config.className}`}>
          <Icon className="h-4 w-4" strokeWidth={2} />
          {config.label}
          {approval.status === "pending" && approval.waitingSince && (
            <span className="text-surface-muted">— {approval.waitingSince}</span>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap items-center gap-2">
        {approval.projectId ? (
          <Button variant="outline" size="sm" className="gap-1.5" asChild>
            <Link to={`/staff/project/${approval.projectId}`}>
              <ExternalLink size={14} />
              Open Project
            </Link>
          </Button>
        ) : (
          <span className="text-xs text-surface-muted">No linked project</span>
        )}
      </div>
    </div>
  );
}
