import { useCallback, useMemo } from "react";
import { approvalsApi } from "@/api";
import { adaptApproval } from "@/api/adapters/approval";
import { useApiResource } from "./useApiResource";

/** Approvals scoped to a project — drives the "review required" banner and the Approvals tab. */
export function useProjectApprovals(projectId, options = {}) {
  const fetcher = useCallback(
    () => approvalsApi.listApprovals({ projectId, limit: 50 }),
    [projectId],
  );

  const resource = useApiResource(fetcher, [projectId], {
    enabled: Boolean(projectId),
    ...options,
  });

  const approvals = useMemo(
    () => (resource.data?.items ?? []).map(adaptApproval),
    [resource.data],
  );
  const pending = useMemo(
    () => approvals.filter((approval) => approval.status === "pending"),
    [approvals],
  );

  return { ...resource, approvals, pending };
}
