import { useCallback, useMemo } from "react";
import { tasksApi, filesApi, activityApi } from "@/api";
import { adaptTask } from "@/api/adapters/task";
import { adaptFile } from "@/api/adapters/file";
import { adaptActivity } from "@/api/adapters/activity";
import { useApiResource } from "./useApiResource";

/** Tasks scoped to one project — feeds the Tasks tab. */
export function useProjectTasks(projectId, options = {}) {
  const fetcher = useCallback(
    () => tasksApi.listTasks({ projectId, limit: 100 }),
    [projectId],
  );
  const resource = useApiResource(fetcher, [projectId], {
    enabled: Boolean(projectId),
    ...options,
  });
  const tasks = useMemo(() => (resource.data?.items ?? []).map(adaptTask), [resource.data]);
  return { ...resource, tasks };
}

/** Files scoped to one project — feeds the Files tab. */
export function useProjectFiles(projectId, options = {}) {
  const fetcher = useCallback(
    () => filesApi.listFiles({ projectId, limit: 100 }),
    [projectId],
  );
  const resource = useApiResource(fetcher, [projectId], {
    enabled: Boolean(projectId),
    ...options,
  });
  const files = useMemo(() => (resource.data?.items ?? []).map(adaptFile), [resource.data]);
  return { ...resource, files };
}

/** Activity scoped to one project — feeds the Activity tab. */
export function useProjectActivity(projectId, options = {}) {
  const fetcher = useCallback(
    () => activityApi.listActivity({ projectId, limit: 50 }),
    [projectId],
  );
  const resource = useApiResource(fetcher, [projectId], {
    enabled: Boolean(projectId),
    ...options,
  });
  const activity = useMemo(
    () => (resource.data?.items ?? []).map(adaptActivity),
    [resource.data],
  );
  return { ...resource, activity };
}
