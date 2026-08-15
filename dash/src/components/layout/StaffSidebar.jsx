import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  FolderKanban,
  ListChecks,
  UserSquare2,
  FolderOpen,
  CheckCircle2,
  Activity,
  Settings,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { currentStaff } from "@/data/mockData";

const primaryNav = [
  {
    label: "Overview",
    to: "/staff",
    icon: LayoutDashboard,
    enabled: true,
    end: true,
  },
  {
    label: "Projects",
    to: "/staff/projects",
    icon: FolderKanban,
    enabled: true,
  },
  {
    label: "Tasks",
    to: "/staff/tasks",
    icon: ListChecks,
    enabled: true,
  },
  {
    label: "Clients",
    to: "/staff/clients",
    icon: UserSquare2,
    enabled: true,
  },
];

const secondaryNav = [
  {
    label: "Files",
    to: "/staff/files",
    icon: FolderOpen,
    enabled: true,
  },
  {
    label: "Approvals",
    to: "/staff/approvals",
    icon: CheckCircle2,
    enabled: true,
  },
  {
    label: "Activity",
    to: "/staff/activity",
    icon: Activity,
     enabled: true,
  },
];

function NavRow({ item, onNavigate }) {
  const Icon = item.icon;

  if (!item.enabled) {
    return (
      <div
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
      to={item.to}
      end={item.end}
      onClick={onNavigate}
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
}

export default function StaffSidebar({ onNavigate }) {
  return (
    <div className="flex h-full min-h-0 flex-col">
      {/* Brand */}
      <div className="mb-8 flex shrink-0 items-center gap-2 px-1">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-orange font-display text-sm font-bold text-white">
          O5
        </div>

        <div>
          <span className="block font-display text-[1.05rem] font-bold tracking-[-0.02em] text-surface-fg">
            OCT20FIVE
          </span>

          <span className="block text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-surface-muted">
            Staff
          </span>
        </div>
      </div>

      {/* Scrollable Navigation */}
      <div
        className="
          min-h-0
          flex-1
          overflow-y-auto
          pr-1
          scrollbar-thin
          scrollbar-track-transparent
          scrollbar-thumb-surface-border
          hover:scrollbar-thumb-surface-muted
        "
      >
        {/* Primary */}
        <nav className="flex flex-col gap-1">
          {primaryNav.map((item) => (
            <NavRow
              key={item.label}
              item={item}
              onNavigate={onNavigate}
            />
          ))}
        </nav>

        <div className="my-4 h-px bg-surface-border" />

        {/* Secondary */}
        <nav className="flex flex-col gap-1">
          {secondaryNav.map((item) => (
            <NavRow
              key={item.label}
              item={item}
              onNavigate={onNavigate}
            />
          ))}
        </nav>
      </div>

      {/* Bottom */}
      <div className="mt-4 flex shrink-0 flex-col gap-1 border-t border-surface-border pt-4">
        <button
          type="button"
          className="flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-left text-[0.9rem] font-medium text-[color-mix(in_srgb,var(--surface-fg)_70%,transparent)] transition-all duration-300 hover:bg-[color-mix(in_srgb,var(--surface-muted)_10%,transparent)] hover:text-surface-fg"
        >
          <Settings
            className="h-[18px] w-[18px]"
            strokeWidth={2}
          />

          Settings
        </button>

        <div className="flex items-center gap-3 rounded-xl px-3.5 py-2.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-brand-orange/10 text-[0.65rem] font-bold text-brand-orange">
            {currentStaff.initials}
          </div>

          <div className="min-w-0">
            <p className="truncate text-[0.85rem] font-semibold text-surface-fg">
              {currentStaff.name}
            </p>

            <p className="truncate text-[0.7rem] text-surface-muted">
              {currentStaff.role}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}