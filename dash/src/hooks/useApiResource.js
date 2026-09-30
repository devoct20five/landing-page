import { useCallback, useEffect, useRef, useState } from "react";
import { ApiError } from "@/api";

/**
 * Minimal async-resource hook so pages get loading / error / empty / forbidden
 * states without another dependency.
 *
 *   const { data, isLoading, error, refetch } = useApiResource(
 *     () => projectsApi.listProjects({ status }),
 *     [status],
 *   );
 *
 * If the project later adopts TanStack Query, replace this file — the .api
 * modules stay exactly as they are, because they only do transport.
 */
export function useApiResource(fetcher, deps = [], { enabled = true } = {}) {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(enabled);
  const requestId = useRef(0);

  const run = useCallback(async () => {
    const id = ++requestId.current;
    setIsLoading(true);
    setError(null);

    try {
      const result = await fetcher();
      if (id === requestId.current) setData(result);
    } catch (err) {
      if (err?.name === "AbortError") return;
      if (id === requestId.current) {
        setError(err instanceof ApiError ? err : new ApiError(err?.message ?? "Something went wrong."));
      }
    } finally {
      if (id === requestId.current) setIsLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  useEffect(() => {
    if (!enabled) {
      setIsLoading(false);
      return;
    }
    run();
  }, [run, enabled]);

  return {
    data,
    error,
    isLoading,
    isForbidden: error?.status === 403,
    isNotFound: error?.status === 404,
    /** True once loaded with nothing to show — drives the empty state. */
    isEmpty:
      !isLoading &&
      !error &&
      (Array.isArray(data?.items) ? data.items.length === 0 : data == null),
    refetch: run,
  };
}

/**
 * Mutation counterpart: idle -> submitting -> success | error.
 *
 *   const { mutate, isSubmitting, error } = useApiMutation(
 *     (payload) => tasksApi.createTask(payload),
 *     { onSuccess: refetch },
 *   );
 */
export function useApiMutation(mutator, { onSuccess, onError } = {}) {
  const [state, setState] = useState("idle");
  const [error, setError] = useState(null);

  const mutate = useCallback(
    async (...args) => {
      setState("submitting");
      setError(null);
      try {
        const result = await mutator(...args);
        setState("success");
        onSuccess?.(result);
        return result;
      } catch (err) {
        const normalized =
          err instanceof ApiError ? err : new ApiError(err?.message ?? "Something went wrong.");
        setState("error");
        setError(normalized);
        onError?.(normalized);
        throw normalized;
      }
    },
    [mutator, onSuccess, onError],
  );

  return {
    mutate,
    state,
    error,
    isSubmitting: state === "submitting",
    isSuccess: state === "success",
    reset: () => {
      setState("idle");
      setError(null);
    },
  };
}
