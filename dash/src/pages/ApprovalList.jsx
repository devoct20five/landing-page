import { Plus } from "lucide-react";

import ApprovalCard from "@/components/approvals/ApprovalCard";
import EmptyState from "@/components/shared/EmptyState";

export default function ApprovalList({ approvals = [] }) {
  const handleAddApproval = () => {
    // Open Add Approval modal here
    console.log("Add approval");
  };

  if (!approvals || approvals.length === 0) {
    return (
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="font-display text-2xl font-bold text-surface-fg">
              Approvals
            </h1>

            <p className="mt-1 text-sm text-surface-muted">
              Review, manage, and track client approvals.
            </p>
          </div>

          <button
            type="button"
            onClick={handleAddApproval}
            className="inline-flex shrink-0 items-center gap-2 rounded-lg bg-brand-orange px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90"
          >
            <Plus size={16} />
            New Approval
          </button>
        </div>

        <EmptyState
          title="Nothing Here"
          description="Approvals matching this view will appear here."
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-surface-fg">
            Approvals
          </h1>

          <p className="mt-1 text-sm text-surface-muted">
            Review, manage, and track client approvals.
          </p>
        </div>

        <button
          type="button"
          onClick={handleAddApproval}
          className="inline-flex shrink-0 items-center gap-2 rounded-lg bg-brand-orange px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90"
        >
          <Plus size={16} />
          New Approval
        </button>
      </div>

      {/* Approval List */}
      <div className="space-y-3">
        {approvals.map((approval) => (
          <ApprovalCard
            key={approval.id}
            approval={approval}
          />
        ))}
      </div>
    </div>
  );
}