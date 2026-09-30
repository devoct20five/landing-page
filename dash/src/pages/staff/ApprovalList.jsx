import { useState } from "react";

import { approvalsApi } from "@/api";
import { adaptApproval } from "@/api/adapters/approval";
import { useApiResource } from "@/hooks/useApiResource";

import ApprovalCard from "@/components/approvals/ApprovalCard";
import EmptyState from "@/components/shared/EmptyState";
import ErrorState from "@/components/shared/ErrorState";
import { SkeletonList } from "@/components/shared/Skeleton";
import { cn } from "@/lib/utils";

const STATUS_FILTERS = [
  { id: "", label: "All" },
  { id: "pending", label: "Pending" },
  { id: "changes-requested", label: "Changes Requested" },
  { id: "approved", label: "Approved" },
  { id: "rejected", label: "Rejected" },
];

/**
 * Agency-wide approval visibility for staff. Read-only — see
 * components/approvals/ApprovalCard.jsx for why: only the client can review
 * an approval, so there's nothing to action here beyond "Create Approval
 * Request", which belongs to the project workspace it's requested from
 * rather than this list.
 */
export default function ApprovalList() {
  const [status, setStatus] = useState("");

  const fetcher = () => approvalsApi.listApprovals({ status: status || undefined, limit: 100 });
  const { data, isLoading, error, refetch } = useApiResource(fetcher, [status]);
  const approvals = (data?.items ?? []).map(adaptApproval);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="font-display text-2xl font-bold text-surface-fg">Approvals</h1>
        <p className="mt-1 text-sm text-surface-muted">
          Track client approvals across every project.
        </p>
      </div>

      {/* Status filter */}
      <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by status">
        {STATUS_FILTERS.map((filter) => (
          <button
            key={filter.id || "all"}
            type="button"
            onClick={() => setStatus(filter.id)}
            className={cn("pill", status === filter.id && "pill-active")}
          >
            {filter.label}
          </button>
        ))}
      </div>

      {isLoading && <SkeletonList rows={5} />}

      {!isLoading && error && (
        <ErrorState error={error} resource="Approvals" onRetry={refetch} />
      )}

      {!isLoading && !error && approvals.length === 0 && (
        <EmptyState
          title="Nothing here"
          description="Approvals matching this view will appear here."
        />
      )}

      {!isLoading && !error && approvals.length > 0 && (
        <div className="space-y-3">
          {approvals.map((approval) => (
            <ApprovalCard key={approval.id} approval={approval} />
          ))}
        </div>
      )}
    </div>
  );
}
