import { useCallback, useEffect, useState } from "react";
import { notificationsApi } from "@/api";
import { useAuth } from "@/auth";

/**
 * Real unread badge for the topbars and sidebars. Replaces the hard-coded
 * counters that were sitting in the navigation components.
 *
 * Polls gently; swap for a socket/SSE push later if the backend grows one.
 */
export function useUnreadCount({ pollMs = 60000 } = {}) {
  const { status } = useAuth();
  const [count, setCount] = useState(0);

  const refresh = useCallback(async () => {
    if (status !== "authed") return;
    try {
      setCount(await notificationsApi.getUnreadCount());
    } catch {
      // A failing badge should never break the page it sits on.
    }
  }, [status]);

  useEffect(() => {
    refresh();
    if (!pollMs || status !== "authed") return undefined;
    const timer = setInterval(refresh, pollMs);
    return () => clearInterval(timer);
  }, [refresh, pollMs, status]);

  return { count, refresh };
}
