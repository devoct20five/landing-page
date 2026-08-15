import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  FolderKanban,
  BriefcaseBusiness,
  Activity,
  FolderOpen,
  Bell,
  User,
  Settings, MessageSquareText
} from "lucide-react";
import { cn } from "@/lib/utils";
import { currentClient } from "@/data/mockData";

const navItems = [
  {
    label: "Dashboard",
    to: "/dashboard",
    icon: LayoutDashboard,
    enabled: true,
  },
  {
    label: "Projects",
    to: "/projects",
    icon: FolderKanban,
    enabled: true,
  },
  {
    label: "Services",
    to: "/client/services",
    icon: BriefcaseBusiness,
    enabled: true,
  },
    {
    label: "Events",
    to: "/client/Events",
    icon: MessageSquareText,
    enabled: true,
  },
    {
    label: "Settings",
    to: "/client/settings",
    icon: Settings,
    enabled: true,
  },

];

export default function Sidebar({ onNavigate }) {
  return (
    <div className="flex h-full flex-col">
      {/* Brand */}
      <div className="mb-10 flex items-center gap-2 px-1">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-orange font-display text-sm font-bold text-white">
          O5
        </div>

        <span className="font-display text-[1.05rem] font-bold tracking-[-0.02em] text-surface-fg">
          OCT20FIVE
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex flex-1 flex-col gap-1">
        {navItems.map((item) => {
          const Icon = item.icon;

          if (!item.enabled) {
            return (
              <div
                key={item.label}
                className="flex cursor-not-allowed items-center justify-between rounded-xl px-3.5 py-2.5 text-[0.9rem] font-medium text-[color-mix(in_srgb,var(--surface-muted)_50%,transparent)]"
                title="Coming soon"
              >
                <span className="flex items-center gap-3">
                  <Icon
                    className="h-[18px] w-[18px]"
                    strokeWidth={2}
                  />

                  {item.label}
                </span>

                <span className="rounded-full border border-surface-border px-2 py-0.5 text-[0.6rem] font-semibold uppercase tracking-[0.1em] text-[color-mix(in_srgb,var(--surface-muted)_60%,transparent)]">
                  Soon
                </span>
              </div>
            );
          }

          return (
            <NavLink
              key={item.label}
              to={item.to}
              onClick={onNavigate}
              end={item.to === "/dashboard"}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-[0.9rem] font-medium transition-all duration-300 ease-smooth",
                  isActive
                    ? "bg-brand-orange text-white shadow-[0_10px_24px_-8px_rgba(255,90,31,0.55)]"
                    : "text-[color-mix(in_srgb,var(--surface-fg)_70%,transparent)] hover:bg-[color-mix(in_srgb,var(--surface-muted)_10%,transparent)] hover:text-surface-fg"
                )
              }
            >
              <Icon
                className="h-[18px] w-[18px]"
                strokeWidth={2}
              />

              {item.label}
            </NavLink>
          );
        })}
      </nav>

      {/* Bottom navigation */}
      <div className="mt-auto flex flex-col gap-1 border-t border-surface-border pt-4">
        <button
          type="button"
          className="flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-left text-[0.9rem] font-medium text-[color-mix(in_srgb,var(--surface-fg)_70%,transparent)] transition-all duration-300 hover:bg-[color-mix(in_srgb,var(--surface-muted)_10%,transparent)] hover:text-surface-fg"
        >
          <Bell
            className="h-[18px] w-[18px]"
            strokeWidth={2}
          />

          Notifications
        </button>

        <button
          type="button"
          className="flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-left text-[0.9rem] font-medium text-[color-mix(in_srgb,var(--surface-fg)_70%,transparent)] transition-all duration-300 hover:bg-[color-mix(in_srgb,var(--surface-muted)_10%,transparent)] hover:text-surface-fg"
        >
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[color-mix(in_srgb,var(--surface-muted)_15%,transparent)]">
            <User
              className="h-3.5 w-3.5"
              strokeWidth={2}
            />
          </div>

          {currentClient.shortName}
        </button>
      </div>
    </div>
  );
}