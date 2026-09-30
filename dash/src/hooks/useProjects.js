import { useCallback, useMemo } from "react";
import { projectsApi, clientsApi } from "@/api";
import { adaptProject } from "@/api/adapters/project";
import { useApiResource } from "./useApiResource";

/**
 * Project list. Filters the backend supports (search, status, clientId,
 * staffId, page, limit) are sent to the server; anything else stays in the page.
 *
 * @param {{search?, status?, clientId?, staffId?, page?, limit?}} params
 */
export function useProjects(params = {}, options = {}) {
  const { search, status, clientId, staffId, page = 1, limit = 20 } = params;

  const fetcher = useCallback(
    () =>
      projectsApi.listProjects({
        search: search || undefined,
        status: status || undefined,
        clientId: clientId || undefined,
        staffId: staffId || undefined,
        page,
        limit,
      }),
    [search, status, clientId, staffId, page, limit],
  );

  const resource = useApiResource(
    fetcher,
    [search, status, clientId, staffId, page, limit],
    options,
  );

  const projects = useMemo(
    () => (resource.data?.items ?? []).map(adaptProject),
    [resource.data],
  );

  return { ...resource, projects, meta: resource.data?.meta ?? null };
}

/** Single project, including deliverables, services and team. */
export function useProject(id, options = {}) {
  const fetcher = useCallback(() => projectsApi.getProject(id), [id]);

  const resource = useApiResource(fetcher, [id], {
    enabled: Boolean(id),
    ...options,
  });

  return { ...resource, project: resource.data ? adaptProject(resource.data) : null };
}

/** Projects the backend has flagged with an attentionReason. */
export function useProjectsNeedingAttention(options = {}) {
  const fetcher = useCallback(() => projectsApi.listProjectsNeedingAttention(), []);
  const resource = useApiResource(fetcher, [], options);

  const projects = useMemo(() => {
    const raw = Array.isArray(resource.data) ? resource.data : (resource.data?.data ?? []);
    return raw.map(adaptProject);
  }, [resource.data]);

  return { ...resource, projects };
}

/** Client options for filter dropdowns. Fails quietly — a filter is not a page. */
export function useClientOptions() {
  const fetcher = useCallback(() => clientsApi.listClients({ limit: 100 }), []);
  const { data, isLoading } = useApiResource(fetcher, []);

  const clients = useMemo(
    () => (data?.items ?? []).map((client) => ({ id: client.id, name: client.name })),
    [data],
  );

  return { clients, isLoading };
}
