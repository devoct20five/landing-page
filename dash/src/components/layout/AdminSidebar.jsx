import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  FolderKanban,
  UserSquare2,
  Users,
  Layers,
  ListChecks,
  CheckCircle2,
  FolderOpen,
  Activity,
  Settings,
  BriefcaseBusiness,
  CalendarDays,
  MessageSquareQuote,
  Clapperboard,
  UserCircle,
  CreditCard,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { currentStaff } from "@/data/mockData";
import NotificationDropdown from "@/components/shared/NotificationDropdown";

const primaryNav = [
  {
    label: "Overview",
    to: "/admin",
    icon: LayoutDashboard,
    enabled: true,
    end: true,
  },
  {
    label: "Projects",
    to: "/admin/projects",
    icon: FolderKanban,
    enabled: true,
  },
  {
    label: "Clients",
    to: "/admin/clients",
    icon: UserSquare2,
    enabled: true,
  },
  {
    label: "Team",
    to: "/admin/team",
    icon: Users,
    enabled: true,
  },
  {
    label: "Services",
    to: "/admin/services",
    icon: Layers,
    enabled: true,
  },
];

const operationsNav = [
  {
    label: "Tasks",
    to: "/admin/tasks",
    icon: ListChecks,
    enabled: true,
  },
  {
    label: "Approvals",
    to: "/admin/approvals",
    icon: CheckCircle2,
    enabled: true,
  },
  {
    label: "Events",
    to: "/admin/events",
    icon: CalendarDays,
    enabled: true,
  },
  {
    label: "Queries",
    to: "/admin/queries",
    icon: MessageSquareQuote,
    enabled: true,
  },
  {
    label: "Files",
    to: "/admin/files",
    icon: FolderOpen,
       enabled: true,
  },
  {
    label: "Activity",
    to: "/admin/activity",
    icon: Activity,
       enabled: true,
  },
];

const contentNav = [
  {
    label: "Behind the Work",
    to: "/admin/behind-the-work",
    icon: Clapperboard,
    enabled: true,
  },
  {
    label: "Careers",
    to: "/admin/careers",
    icon: BriefcaseBusiness,
    enabled: true,
  },
];

const accountNav = [
  {
    label: "Profile",
    to: "/admin/profile",
    icon: UserCircle,
    enabled: true,
  },
  {
    label: "Payments",
    to: "/admin/payments",
    icon: CreditCard,
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

function NavSection({ label, items, onNavigate }) {
  return (
    <>
      <div className="mb-2 px-3.5">
        <span className="text-[0.6rem] font-bold uppercase tracking-[0.15em] text-surface-muted">
          {label}
        </span>
      </div>

      <nav className="flex flex-col gap-1">
        {items.map((item) => (
          <NavRow
            key={item.label}
            item={item}
            onNavigate={onNavigate}
          />
        ))}
      </nav>
    </>
  );
}

export default function AdminSidebar({ onNavigate }) {
  return (
    <div className="flex h-full min-h-0 flex-col">
      {/* =====================================================
          BRAND
      ===================================================== */}

      <div className="mb-8 flex shrink-0 items-center gap-2 px-1">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-orange font-display text-sm font-bold text-white">
          O5
        </div>

        <div>
          <span className="block font-display text-[1.05rem] font-bold tracking-[-0.02em] text-surface-fg">
            OCT20FIVE
          </span>

          <span className="block text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-surface-muted">
            Admin
          </span>
        </div>
      </div>

      {/* =====================================================
          SCROLLABLE NAVIGATION
      ===================================================== */}

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
        {/* MANAGEMENT */}

        <NavSection
          label="Management"
          items={primaryNav}
          onNavigate={onNavigate}
        />

        <div className="my-4 h-px bg-surface-border" />

        {/* OPERATIONS */}

        <NavSection
          label="Operations"
          items={operationsNav}
          onNavigate={onNavigate}
        />

        <div className="my-4 h-px bg-surface-border" />

        {/* CONTENT */}

        <NavSection
          label="Content"
          items={contentNav}
          onNavigate={onNavigate}
        />

        <div className="my-4 h-px bg-surface-border" />

        {/* ACCOUNT */}

        <NavSection
          label="Account"
          items={accountNav}
          onNavigate={onNavigate}
        />

      
      </div>

      {/* =====================================================
          BOTTOM
      ===================================================== */}

      <div className="mt-4 flex shrink-0 flex-col gap-1 border-t border-surface-border pt-4">
       <NotificationDropdown
            variant="sidebar"
            onNavigate={onNavigate}
          />
        <div className="flex items-center gap-3 rounded-xl px-3.5 py-2.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-brand-orange/10 text-[0.65rem] font-bold text-brand-orange">
            {currentStaff.initials}
          </div>

          <div className="min-w-0">
            <p className="truncate text-[0.85rem] font-semibold text-surface-fg">
              {currentStaff.name}
            </p>

            <p className="truncate text-[0.7rem] text-surface-muted">
              Administrator
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}