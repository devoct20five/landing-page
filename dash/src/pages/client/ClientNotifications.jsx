import { useCallback, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, CheckCircle, Trash } from "@phosphor-icons/react";

import { notificationsApi } from "@/api";
import { useApiResource } from "@/hooks/useApiResource";
import { cn } from "@/lib/utils";
import EmptyState from "@/components/shared/EmptyState";
import ErrorState from "@/components/shared/ErrorState";
import { SkeletonList } from "@/components/shared/Skeleton";

const TABS = [
  { id: "all", label: "All" },
  { id: "unread", label: "Unread" },
];

function timeAgo(value) {
  if (!value) return "";
  const diff = Date.now() - new Date(value).getTime();
  const minutes = Math.round(diff / 60000);
  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.round(hours / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(value).toLocaleDateString(undefined, {
    day: "numeric",
    month: "short",
  });
}

/**
 * Notification centre. The sidebar has linked to /notifications since before
 * the route existed; this is that route, wired to the real backend.
 */
export default function ClientNotifications() {
  const navigate = useNavigate();
  const [tab, setTab] = useState("all");
  const [busyId, setBusyId] = useState(null);

  const fetcher = useCallback(
    () => notificationsApi.listNotifications({ unread: tab === "unread" ? true : undefined }),
    [tab],
  );

  const { data, isLoading, error, refetch } = useApiResource(fetcher, [tab]);

  const items = useMemo(() => data?.items ?? [], [data]);
  const unreadCount = items.filter((item) => !item.isRead).length;

  const open = async (notification) => {
    if (!notification.isRead) {
      try {
        await notificationsApi.markRead(notification.id);
      } catch {
        /* navigation matters more than the read flag */
      }
    }
    if (notification.linkUrl) navigate(notification.linkUrl);
    else refetch();
  };

  const handleMarkAllRead = async () => {
    setBusyId("all");
    try {
      await notificationsApi.markAllRead();
      await refetch();
    } finally {
      setBusyId(null);
    }
  };

  const handleDelete = async (id) => {
    setBusyId(id);
    try {
      await notificationsApi.deleteNotification(id);
      await refetch();
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="mx-auto w-full max-w-4xl">
      <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-[-0.03em] text-surface-fg">
            Notifications
          </h1>
          <p className="mt-1 text-sm text-surface-muted">
            Approvals, project updates and billing activity that need your attention.
          </p>
        </div>

        <button
          type="button"
          onClick={handleMarkAllRead}
          disabled={busyId === "all" || unreadCount === 0}
          className="inline-flex items-center gap-2 rounded-xl border border-surface-border px-4 py-2 text-sm font-semibold text-surface-fg transition hover:border-brand-orange/40 hover:text-brand-orange disabled:cursor-not-allowed disabled:opacity-50"
        >
          <CheckCircle className="h-4 w-4" aria-hidden="true" />
          Mark all read
        </button>
      </div>

      <div className="mb-5 flex gap-1 border-b border-surface-border" role="tablist">
        {TABS.map((item) => (
          <button
            key={item.id}
            type="button"
            role="tab"
            aria-selected={tab === item.id}
            onClick={() => setTab(item.id)}
            className={cn(
              "-mb-px border-b-2 px-4 py-2.5 text-sm font-semibold transition",
              tab === item.id
                ? "border-brand-orange text-brand-orange"
                : "border-transparent text-surface-muted hover:text-surface-fg",
            )}
          >
            {item.label}
          </button>
        ))}
      </div>

      {isLoading && <SkeletonList rows={5} />}

      {!isLoading && error && (
        <ErrorState error={error} resource="Notifications" onRetry={refetch} />
      )}

      {!isLoading && !error && items.length === 0 && (
        <EmptyState
          title={tab === "unread" ? "You're all caught up." : "No notifications yet."}
          description={
            tab === "unread"
              ? "Anything new will show up here as soon as it needs you."
              : "Approval requests, project updates and invoices will appear here."
          }
        />
      )}

      {!isLoading && !error && items.length > 0 && (
        <ul className="space-y-2.5">
          {items.map((notification) => (
            <li key={notification.id}>
              <div
                className={cn(
                  "flex items-start gap-4 rounded-card border p-4 transition",
                  notification.isRead
                    ? "border-surface-border"
                    : "border-brand-orange/30 bg-brand-orange/[0.04]",
                )}
              >
                <div
                  className={cn(
                    "mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl",
                    notification.isRead
                      ? "bg-surface-muted/10 text-surface-muted"
                      : "bg-brand-orange text-white",
                  )}
                >
                  <Bell className="h-4 w-4" aria-hidden="true" />
                </div>

                <button
                  type="button"
                  onClick={() => open(notification)}
                  className="min-w-0 flex-1 text-left"
                >
                  <p className="font-display text-sm font-bold text-surface-fg">
                    {notification.title}
                    {!notification.isRead && (
                      <span className="sr-only"> (unread)</span>
                    )}
                  </p>

                  {notification.message && (
                    <p className="mt-1 text-sm leading-6 text-surface-muted">
                      {notification.message}
                    </p>
                  )}

                  <p className="mt-1.5 text-xs text-surface-muted">
                    {timeAgo(notification.createdAt)}
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => handleDelete(notification.id)}
                  disabled={busyId === notification.id}
                  aria-label={`Dismiss notification: ${notification.title}`}
                  className="shrink-0 rounded-lg p-2 text-surface-muted transition hover:bg-surface-muted/10 hover:text-surface-fg disabled:opacity-50"
                >
                  <Trash className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
