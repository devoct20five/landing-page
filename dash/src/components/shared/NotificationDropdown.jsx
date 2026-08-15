import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
  Bell,
  Check,
  CheckCheck,
  Clock3,
  MessageSquare,
  FileCheck2,
  AlertCircle,
  X,
} from "lucide-react";

import { cn } from "@/lib/utils";

const MOCK_NOTIFICATIONS = [
  {
    id: 1,
    type: "approval",
    title: "Approval required",
    description: "Brand Film v3 is waiting for your approval.",
    time: "5 min ago",
    unread: true,
  },
  {
    id: 2,
    type: "task",
    title: "Task completed",
    description: "Rohan completed the colour grading task.",
    time: "28 min ago",
    unread: true,
  },
  {
    id: 3,
    type: "message",
    title: "New client query",
    description: "Acme Corp sent a new project query.",
    time: "1 hour ago",
    unread: true,
  },
  {
    id: 4,
    type: "deadline",
    title: "Deadline approaching",
    description: "Social Campaign is due tomorrow.",
    time: "3 hours ago",
    unread: false,
  },
  {
    id: 5,
    type: "system",
    title: "New file uploaded",
    description: "Final assets were uploaded to Project Alpha.",
    time: "Yesterday",
    unread: false,
  },
];

const TYPE_CONFIG = {
  approval: {
    icon: FileCheck2,
    className: "bg-brand-orange/10 text-brand-orange",
  },

  task: {
    icon: Check,
    className: "bg-emerald-500/10 text-emerald-700",
  },

  message: {
    icon: MessageSquare,
    className: "bg-blue-500/10 text-blue-700",
  },

  deadline: {
    icon: Clock3,
    className: "bg-red-500/10 text-red-600",
  },

  system: {
    icon: Bell,
    className: "bg-surface-muted/10 text-surface-muted",
  },
};

export default function NotificationDropdown({
  variant = "topbar",
  onNavigate,
}) {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState(
    MOCK_NOTIFICATIONS
  );

  const triggerRef = useRef(null);
  const panelRef = useRef(null);

  const unreadCount = notifications.filter(
    (notification) => notification.unread
  ).length;

  /*
   * ---------------------------------------------------------
   * CLOSE WHEN CLICKING OUTSIDE
   * ---------------------------------------------------------
   */

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        triggerRef.current &&
        !triggerRef.current.contains(event.target) &&
        panelRef.current &&
        !panelRef.current.contains(event.target)
      ) {
        setOpen(false);
      }
    }

    if (open) {
      document.addEventListener(
        "mousedown",
        handleClickOutside
      );
    }

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, [open]);

  /*
   * ---------------------------------------------------------
   * ESC TO CLOSE
   * ---------------------------------------------------------
   */

  useEffect(() => {
    function handleKeyDown(event) {
      if (event.key === "Escape") {
        setOpen(false);
      }
    }

    if (open) {
      document.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  /*
   * ---------------------------------------------------------
   * MARK ALL READ
   * ---------------------------------------------------------
   */

  function markAllRead() {
    setNotifications((current) =>
      current.map((notification) => ({
        ...notification,
        unread: false,
      }))
    );
  }

  /*
   * ---------------------------------------------------------
   * MARK SINGLE READ
   * ---------------------------------------------------------
   */

  function markAsRead(id) {
    setNotifications((current) =>
      current.map((notification) =>
        notification.id === id
          ? {
              ...notification,
              unread: false,
            }
          : notification
      )
    );
  }

  /*
   * ---------------------------------------------------------
   * SIDEBAR TRIGGER
   * ---------------------------------------------------------
   */

  if (variant === "sidebar") {
    return (
      <div className="relative">
        <button
          ref={triggerRef}
          type="button"
          onClick={() => setOpen((current) => !current)}
          className={cn(
            "flex w-full items-center justify-between rounded-xl px-3.5 py-2.5",
            "text-[0.9rem] font-medium transition-all duration-300",
            open
              ? "bg-[color-mix(in_srgb,var(--surface-muted)_10%,transparent)] text-surface-fg"
              : "text-[color-mix(in_srgb,var(--surface-fg)_70%,transparent)] hover:bg-[color-mix(in_srgb,var(--surface-muted)_10%,transparent)] hover:text-surface-fg"
          )}
        >
          <span className="flex items-center gap-3">
            <Bell
              className="h-[18px] w-[18px]"
              strokeWidth={2}
            />

            Notifications
          </span>

          {unreadCount > 0 && (
            <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-brand-orange px-1.5 text-[0.6rem] font-bold text-white">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </button>

        {open && (
          <NotificationPanel
            variant={variant}
            triggerRef={triggerRef}
            panelRef={panelRef}
            notifications={notifications}
            unreadCount={unreadCount}
            markAllRead={markAllRead}
            markAsRead={markAsRead}
            onClose={() => setOpen(false)}
            onNavigate={onNavigate}
          />
        )}
      </div>
    );
  }

  /*
   * ---------------------------------------------------------
   * TOPBAR / DEFAULT TRIGGER
   * ---------------------------------------------------------
   */

  return (
    <div className="relative">
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen((current) => !current)}
        aria-label="Notifications"
        className={cn(
          "relative flex h-9 w-9 items-center justify-center rounded-full sm:h-10 sm:w-10",
          "text-[color-mix(in_srgb,var(--surface-fg)_70%,transparent)] transition",
          "hover:bg-[color-mix(in_srgb,var(--surface-muted)_10%,transparent)] hover:text-surface-fg",
          open &&
            "bg-[color-mix(in_srgb,var(--surface-muted)_10%,transparent)] text-surface-fg"
        )}
      >
        <Bell
          className="h-[18px] w-[18px]"
          strokeWidth={2}
        />

        {unreadCount > 0 && (
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-brand-orange ring-2 ring-surface-card" />
        )}
      </button>

      {open && (
        <NotificationPanel
          variant={variant}
          triggerRef={triggerRef}
          panelRef={panelRef}
          notifications={notifications}
          unreadCount={unreadCount}
          markAllRead={markAllRead}
          markAsRead={markAsRead}
          onClose={() => setOpen(false)}
          onNavigate={onNavigate}
        />
      )}
    </div>
  );
}

/* ============================================================
   NOTIFICATION PANEL
   Rendered via portal into document.body so its `fixed`
   positioning is always relative to the viewport — not to
   any ancestor with a filter/backdrop-filter/transform
   (like the topbar's backdrop-blur), which would otherwise
   create a new containing block and throw off the math.
============================================================ */

function NotificationPanel({
  variant,
  triggerRef,
  panelRef,
  notifications,
  unreadCount,
  markAllRead,
  markAsRead,
  onClose,
  onNavigate,
}) {
  const [position, setPosition] = useState(null);

  useEffect(() => {
    function updatePosition() {
      if (!triggerRef.current) return;

      const rect = triggerRef.current.getBoundingClientRect();

      const panelWidth = 380;
      const gap = 10;
      const edgePadding = 16;

      let left;
      let top;

      if (variant === "sidebar") {
        /*
         * Sidebar: open panel to the RIGHT of the trigger,
         * vertically aligned with it.
         */
        left = rect.right + gap;
        top = Math.max(
          edgePadding,
          Math.min(rect.top, window.innerHeight - 600)
        );
      } else {
        /*
         * Topbar: open panel BELOW the trigger, right-aligned
         * to the trigger's right edge (standard dropdown).
         */
        left = rect.right - panelWidth;
        top = rect.bottom + gap;
      }

      /*
       * Keep panel inside the viewport horizontally.
       */
      if (left + panelWidth > window.innerWidth - edgePadding) {
        left = window.innerWidth - panelWidth - edgePadding;
      }

      if (left < edgePadding) {
        left = edgePadding;
      }

      /*
       * Keep panel inside the viewport vertically.
       */
      const maxTop = window.innerHeight - edgePadding - 200;

      if (top > maxTop) {
        top = Math.max(edgePadding, maxTop);
      }

      setPosition({ top, left });
    }

    updatePosition();

    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition, true);

    return () => {
      window.removeEventListener(
        "resize",
        updatePosition
      );

      window.removeEventListener(
        "scroll",
        updatePosition,
        true
      );
    };
  }, [triggerRef, variant]);

  /*
   * Don't render (or portal) until we've measured the trigger,
   * otherwise it briefly flashes at (0,0).
   */
  if (!position) return null;

  return createPortal(
    <div
      ref={panelRef}
      className="
        fixed
        z-[9999]
        w-[380px]
        max-w-[calc(100vw-2rem)]
        overflow-hidden
        rounded-2xl
        border
        border-surface-border
        bg-surface-card
        shadow-[0_24px_70px_-20px_rgba(0,0,0,0.35)]
      "
      style={{
        top: position.top,
        left: position.left,
      }}
    >
      {/* HEADER */}

      <div className="flex items-center justify-between border-b border-surface-border px-5 py-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-display text-base font-bold text-surface-fg">
              Notifications
            </h3>

            {unreadCount > 0 && (
              <span className="rounded-full bg-brand-orange/10 px-2 py-0.5 text-[0.6rem] font-bold text-brand-orange">
                {unreadCount} new
              </span>
            )}
          </div>

          <p className="mt-0.5 text-xs text-surface-muted">
            Recent updates across OCT20FIVE
          </p>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="flex h-8 w-8 items-center justify-center rounded-lg text-surface-muted hover:bg-surface-bg hover:text-surface-fg"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* ACTIONS */}

      {unreadCount > 0 && (
        <div className="flex items-center justify-end border-b border-surface-border px-5 py-2.5">
          <button
            type="button"
            onClick={markAllRead}
            className="flex items-center gap-1.5 text-xs font-semibold text-brand-orange hover:underline"
          >
            <CheckCheck className="h-3.5 w-3.5" />

            Mark all as read
          </button>
        </div>
      )}

      {/* NOTIFICATIONS */}

      <div className="max-h-[460px] overflow-y-auto">
        {notifications.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl bg-surface-bg">
              <Bell className="h-5 w-5 text-surface-muted" />
            </div>

            <p className="mt-4 text-sm font-semibold text-surface-fg">
              You're all caught up
            </p>

            <p className="mt-1 text-xs text-surface-muted">
              No new notifications.
            </p>
          </div>
        ) : (
          notifications.map((notification) => (
            <NotificationItem
              key={notification.id}
              notification={notification}
              onRead={() =>
                markAsRead(notification.id)
              }
            />
          ))
        )}
      </div>

      {/* FOOTER */}

      <div className="border-t border-surface-border px-5 py-3">
        <button
          type="button"
          onClick={() => {
            onClose?.();
            onNavigate?.("/admin/notifications");
          }}
          className="flex w-full items-center justify-center text-xs font-semibold text-brand-orange hover:underline"
        >
          View all notifications
        </button>
      </div>
    </div>,
    document.body
  );
}

/* ============================================================
   NOTIFICATION ITEM
============================================================ */

function NotificationItem({
  notification,
  onRead,
}) {
  const config =
    TYPE_CONFIG[notification.type] ||
    TYPE_CONFIG.system;

  const Icon = config.icon;

  return (
    <button
      type="button"
      onClick={onRead}
      className={cn(
        "flex w-full gap-3 border-b border-surface-border px-5 py-4 text-left transition hover:bg-surface-bg",
        notification.unread && "bg-brand-orange/[0.025]"
      )}
    >
      {/* ICON */}

      <div
        className={cn(
          "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl",
          config.className
        )}
      >
        <Icon className="h-4 w-4" />
      </div>

      {/* CONTENT */}

      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-3">
          <p
            className={cn(
              "text-sm text-surface-fg",
              notification.unread
                ? "font-bold"
                : "font-semibold"
            )}
          >
            {notification.title}
          </p>

          {notification.unread && (
            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-orange" />
          )}
        </div>

        <p className="mt-1 text-xs leading-5 text-surface-muted">
          {notification.description}
        </p>

        <p className="mt-2 text-[0.65rem] font-medium text-surface-muted">
          {notification.time}
        </p>
      </div>
    </button>
  );
}