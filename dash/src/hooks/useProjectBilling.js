import { useCallback, useMemo } from "react";
import { invoicesApi } from "@/api";
import { adaptInvoice, summarizeInvoices } from "@/api/adapters/invoice";
import { useApiResource } from "./useApiResource";

/** All invoices for a project, rolled into totals/paid/outstanding/transactions. */
export function useProjectBilling(projectId, options = {}) {
  const fetcher = useCallback(
    () => invoicesApi.listInvoicesForProject(projectId),
    [projectId],
  );

  const resource = useApiResource(fetcher, [projectId], {
    enabled: Boolean(projectId),
    ...options,
  });

  const billing = useMemo(() => {
    const raw = Array.isArray(resource.data) ? resource.data : [];
    return summarizeInvoices(raw.map(adaptInvoice));
  }, [resource.data]);

  return { ...resource, billing };
}
