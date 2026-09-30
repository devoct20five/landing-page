import { NavLink } from "react-router-dom";
import {
  CaretDown,
  Gear,
  Receipt,
  FileText,
  SquaresFour,
  FolderSimple,
  CalendarBlank,
  Bell,
  ChatCircle,
  Headphones,
  ArrowClockwise,
  SignOut,
  Hexagon,
  UserCircle,
} from "@phosphor-icons/react";

import { cn } from "@/lib/utils";
import { useUnreadCount } from "@/hooks/useUnreadCount";

const accountItems = [
  {
    label: "Account Settings",
    to: "/account/settings",
    icon: Gear,
  },
  {
    label: "Billing & Invoices",
    to: "/billing",
    icon: Receipt,
  },
  {
    label: "Documents",
    to: "/documents",
    icon: FileText,
  },
];

const mainItems = [
  {
    label: "Dashboard",
    to: "/dashboard",
    icon: SquaresFour,
  },
  {
    label: "Projects",
    to: "/projects",
    icon: FolderSimple,
  },
  {
    label: "Events",
    to: "/client/events",
    icon: CalendarBlank,
  },
  {
    label: "Notifications",
    to: "/notifications",
    icon: Bell,
    // badge comes from the live unread count, not a hard-coded number
    badgeKey: "notifications",
  },
];

const secondaryItems = [
  {
    label: "Queries",
    to: "/queries",
    icon: ChatCircle,
  },
  {
    label: "Support",
    to: "/support",
    icon: Headphones,
  },
];

function SidebarItem({ item, onNavigate, compact = false, badge }) {
  const Icon = item.icon;
  const count = badge ?? item.badge;

  return (
    <NavLink
      to={item.to}
      onClick={onNavigate}
      end={item.to === "/dashboard"}
      className={({ isActive }) =>
        cn(
          "group flex items-center justify-between rounded-xl",
          "transition-all duration-150",
          "focus-visible:outline-none focus-visible:ring-2",
          "focus-visible:ring-brand-orange/30",
          compact ? "px-2.5 py-2" : "px-3 py-2.5",
          isActive
            ? "bg-brand-orange/10 text-brand-orange"
            : ["text-surface-fg", "hover:bg-surface-muted/10"]
        )
      }
    >
      {({ isActive }) => (
        <>
          <span className="flex min-w-0 items-center gap-3">
            <span
              className={cn(
                "flex shrink-0 items-center justify-center",
                "transition-colors duration-150"
              )}
            >
              <Icon
                size={18}
                weight={isActive ? "fill" : "regular"}
                className={cn(
                  isActive ? "text-brand-orange" : "text-surface-muted group-hover:text-surface-fg"
                )}
              />
            </span>

            <span
              className={cn(
                "truncate text-[0.76rem] font-semibold",
                isActive ? "text-brand-orange" : "text-surface-fg"
              )}
            >
              {item.label}
            </span>
          </span>

          {count > 0 && (
            <span
              className={cn(
                "ml-3 flex h-5 min-w-5 shrink-0",
                "items-center justify-center",
                "rounded-full px-1.5",
                "bg-brand-orange",
                "text-[0.58rem] font-bold text-white"
              )}
            >
              {count > 99 ? "99+" : count}
            </span>
          )}
        </>
      )}
    </NavLink>
  );
}

function SectionLabel({ children }) {
  return (
    <p className="mb-2 px-3 text-[0.59rem] font-bold uppercase tracking-[0.1em] text-surface-muted">
      {children}
    </p>
  );
}

function Divider() {
  return <div className="my-4 h-px bg-surface-border" />;
}

export default function Sidebar({ onNavigate, onLogout }) {
  const { count: unreadCount } = useUnreadCount();

  return (
    <aside className="flex h-full w-full flex-col bg-white text-surface-fg">
      {/* =========================================================
          BRAND
      ========================================================= */}
      <div className="px-6 pt-6 pb-5">
        <div className="flex items-center">
          <div className="font-display text-[1.45rem] font-extrabold leading-none tracking-[-0.055em]">
            <span className="text-black">OCT20</span>
            <span className="text-brand-orange">FIVE</span>
          </div>
        </div>
      </div>

      {/* =========================================================
          WORKSPACE
      ========================================================= */}
      <div className="px-5">
        <button
          type="button"
          className={cn(
            "group flex w-full items-center justify-between",
            "rounded-xl border border-surface-border",
            "bg-white px-3.5 py-3",
            "text-left shadow-[0_2px_10px_rgba(0,0,0,0.03)]",
            "transition-all duration-150",
            "hover:border-surface-muted/40",
            "hover:shadow-[0_4px_14px_rgba(0,0,0,0.05)]",
            "focus-visible:outline-none",
            "focus-visible:ring-2",
            "focus-visible:ring-brand-orange/20"
          )}
        >
          <div className="flex min-w-0 items-center gap-3">
            {/* Workspace avatar */}
            <div
              className={cn(
                "flex h-9 w-9 shrink-0 items-center justify-center",
                "rounded-lg bg-black",
                "text-[0.68rem] font-bold text-white"
              )}
            >
              AC
            </div>

            <div className="min-w-0">
              <p className="truncate text-[0.74rem] font-bold text-surface-fg">Acme</p>

              <p className="mt-0.5 truncate text-[0.61rem] font-medium text-surface-muted">
                Acme Studios Pvt. Ltd.
              </p>
            </div>
          </div>

          <CaretDown
            size={15}
            weight="bold"
            className="ml-3 shrink-0 text-surface-muted transition-transform duration-150 group-hover:text-surface-fg"
          />
        </button>
      </div>

      {/* =========================================================
          NAVIGATION
      ========================================================= */}
      <nav className="mt-6 flex min-h-0 flex-1 flex-col overflow-y-auto px-5 pb-4">
        {/* Main */}
        <div>
          <SectionLabel>Workspace</SectionLabel>

          <div className="space-y-0.5">
            {mainItems.map((item) => (
              <SidebarItem
                key={item.label}
                item={item}
                onNavigate={onNavigate}
                badge={item.badgeKey === "notifications" ? unreadCount : undefined}
              />
            ))}
          </div>
        </div>

        <Divider />

        {/* Account */}
        <div>
          <SectionLabel>Account</SectionLabel>

          <div className="space-y-0.5">
            {accountItems.map((item) => (
              <SidebarItem key={item.label} item={item} onNavigate={onNavigate} />
            ))}
          </div>
        </div>

        <Divider />

        {/* Help */}
        <div>
          <SectionLabel>Help & Support</SectionLabel>

          <div className="space-y-0.5">
            {secondaryItems.map((item) => (
              <SidebarItem key={item.label} item={item} onNavigate={onNavigate} />
            ))}
          </div>
        </div>

        {/* Spacer */}
        <div className="flex-1" />

        <Divider />

        {/* Utilities */}
        <div className="space-y-0.5">
          <button
            type="button"
            onClick={() => window.location.reload()}
            className={cn(
              "group flex w-full items-center gap-3",
              "rounded-xl px-3 py-2.5",
              "text-left transition-colors",
              "hover:bg-surface-muted/10",
              "focus-visible:outline-none",
              "focus-visible:ring-2",
              "focus-visible:ring-brand-orange/20"
            )}
          >
            <ArrowClockwise
              size={18}
              weight="regular"
              className="shrink-0 text-surface-muted transition-colors group-hover:text-surface-fg"
            />

            <span className="text-[0.76rem] font-semibold">Refresh</span>
          </button>

          <button
            type="button"
            onClick={onLogout}
            className={cn(
              "group flex w-full items-center gap-3",
              "rounded-xl px-3 py-2.5",
              "text-left transition-colors",
              "hover:bg-red-50",
              "focus-visible:outline-none",
              "focus-visible:ring-2",
              "focus-visible:ring-red-200"
            )}
          >
            <SignOut
              size={18}
              weight="regular"
              className="shrink-0 text-surface-muted transition-colors group-hover:text-red-500"
            />

            <span className="text-[0.76rem] font-semibold group-hover:text-red-600">Log Out</span>
          </button>
        </div>

        {/* =======================================================
            BUY TOKENS
        ======================================================= */}
        <button
          type="button"
          className={cn(
            "mt-5 flex h-10 w-full items-center justify-center gap-2",
            "rounded-xl border border-brand-orange",
            "bg-white px-3",
            "text-[0.72rem] font-bold text-brand-orange",
            "transition-all duration-150",
            "hover:bg-brand-orange hover:text-white",
            "active:scale-[0.98]",
            "focus-visible:outline-none",
            "focus-visible:ring-2",
            "focus-visible:ring-brand-orange/30"
          )}
        >
          <Hexagon size={17} weight="bold" />

          <span>Buy More Tokens</span>
        </button>
      </nav>

      {/* =========================================================
          USER FOOTER
      ========================================================= */}
      <div className="border-t border-surface-border px-5 py-4">
        <div className="flex items-center gap-3">
          <UserCircle size={34} weight="duotone" className="shrink-0 text-surface-muted" />

          <div className="min-w-0 flex-1">
            <p className="truncate text-[0.72rem] font-bold text-surface-fg">Account User</p>

            <p className="truncate text-[0.59rem] font-medium text-surface-muted">Administrator</p>
          </div>

          <button
            type="button"
            className="rounded-lg p-1.5 text-surface-muted transition-colors hover:bg-surface-muted/10 hover:text-surface-fg"
            aria-label="Account settings"
          >
            <Gear size={17} />
          </button>
        </div>

        <p className="mt-3 px-1 text-[0.55rem] font-medium text-surface-muted">
          © OCT20FIVE 2026 · All rights reserved.
        </p>
      </div>
    </aside>
  );
}
