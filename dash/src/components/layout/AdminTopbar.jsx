import { useEffect, useState } from "react";
import {
  Menu,
  ShieldCheck,
  Search,
  User,
  Settings,
  LogOut,
  ChevronDown,
} from "lucide-react";

import {
  Sheet,
  SheetTrigger,
  SheetContent,
} from "@/components/ui/sheet";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import * as DialogPrimitive from "@radix-ui/react-dialog";

import AdminSidebar from "./AdminSidebar";
import NotificationDropdown from "@/components/shared/NotificationDropdown";
import CommandCenter from "@/components/shared/CommandCenter";

import { currentStaff } from "@/data/mockData";

export default function AdminTopbar() {
  const [open, setOpen] = useState(false);
  const [commandOpen, setCommandOpen] = useState(false);

  // ⌘ K / Ctrl K
  useEffect(() => {
    function handleShortcut(event) {
      if (
        (event.metaKey || event.ctrlKey) &&
        event.key.toLowerCase() === "k"
      ) {
        event.preventDefault();
        setCommandOpen(true);
      }
    }

    window.addEventListener("keydown", handleShortcut);

    return () => {
      window.removeEventListener("keydown", handleShortcut);
    };
  }, []);

  const handleProfile = () => {
    console.log("Navigate to profile");
    // navigate("/admin/profile");
  };

  const handleSettings = () => {
    console.log("Navigate to settings");
    // navigate("/admin/settings");
  };

  const handleLogout = () => {
    console.log("Logout");
    // logout();
  };

  return (
    <>
      <header className="sticky top-0 z-40 flex items-center justify-between border-b border-surface-border bg-[color-mix(in_srgb,var(--surface-bg)_85%,transparent)] px-5 py-4 backdrop-blur-md sm:px-8 lg:px-10">

        {/* Brand — mobile only */}
        <div className="flex items-center gap-2 lg:hidden">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-orange font-display text-xs font-bold text-white">
            O5
          </div>

          <div>
            <span className="block font-display text-sm font-bold tracking-[-0.02em] text-surface-fg">
              OCT20FIVE
            </span>

            <span className="flex items-center gap-1 text-[0.6rem] font-semibold uppercase tracking-[0.14em] text-surface-muted">
              <ShieldCheck className="h-3 w-3" />
              Admin
            </span>
          </div>
        </div>

        {/* Command Center Search — desktop */}
        <button
          type="button"
          onClick={() => setCommandOpen(true)}
          className="hidden w-full max-w-[420px] items-center gap-3 rounded-xl border border-surface-border bg-surface-bg px-3.5 py-2.5 text-left transition hover:border-brand-orange/30 hover:bg-surface-muted/5 lg:flex"
        >
          <Search className="h-4 w-4 shrink-0 text-surface-muted" />

          <span className="flex-1 truncate text-sm text-surface-muted">
            Search projects, clients, team...
          </span>

          <kbd className="flex items-center gap-1 rounded-md border border-surface-border bg-surface-muted/5 px-2 py-1 text-[0.6rem] font-semibold text-surface-muted">
            <span>⌘</span>
            K
          </kbd>
        </button>

        {/* Right side */}
        <div className="ml-auto flex items-center gap-2">

          {/* Search — mobile */}
          <button
            type="button"
            onClick={() => setCommandOpen(true)}
            className="flex h-9 w-9 items-center justify-center rounded-full text-surface-muted transition hover:bg-surface-muted/10 hover:text-surface-fg lg:hidden"
            aria-label="Open Command Center"
          >
            <Search className="h-4 w-4" />
          </button>

          {/* Notifications */}
          <NotificationDropdown variant="topbar" />

          {/* Admin Profile Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                className="flex items-center gap-2 rounded-full pl-2 outline-none transition hover:bg-surface-muted/10 focus-visible:ring-2 focus-visible:ring-brand-orange/40"
              >
                {/* Avatar */}
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-orange/10 text-[0.65rem] font-bold text-brand-orange">
                  {currentStaff.initials}
                </div>

                {/* User information */}
                <div className="hidden min-w-0 text-left sm:block">
                  <p className="max-w-[140px] truncate text-[0.8rem] font-semibold leading-tight text-surface-fg">
                    {currentStaff.name}
                  </p>

                  <p className="truncate text-[0.65rem] leading-tight text-surface-muted">
                    Administrator
                  </p>
                </div>

                {/* Chevron */}
                <ChevronDown className="hidden h-3.5 w-3.5 text-surface-muted sm:block" />
              </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              align="end"
              sideOffset={8}
              className="w-56 rounded-xl border-surface-border bg-surface-bg p-1.5 shadow-lg"
            >
              {/* Account Header */}
              <div className="px-2.5 py-2.5">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-orange/10 text-xs font-bold text-brand-orange">
                    {currentStaff.initials}
                  </div>

                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-surface-fg">
                      {currentStaff.name}
                    </p>

                    <p className="truncate text-xs text-surface-muted">
                      Administrator
                    </p>
                  </div>
                </div>
              </div>

              <DropdownMenuSeparator className="bg-surface-border" />

              {/* Profile */}
              <DropdownMenuItem
                onClick={handleProfile}
                className="cursor-pointer gap-2.5 rounded-lg px-2.5 py-2 text-sm text-surface-fg outline-none focus:bg-surface-muted/10"
              >
                <User className="h-4 w-4 text-surface-muted" />

                <span>Profile</span>
              </DropdownMenuItem>

              {/* Settings */}
              <DropdownMenuItem
                onClick={handleSettings}
                className="cursor-pointer gap-2.5 rounded-lg px-2.5 py-2 text-sm text-surface-fg outline-none focus:bg-surface-muted/10"
              >
                <Settings className="h-4 w-4 text-surface-muted" />

                <span>Settings</span>
              </DropdownMenuItem>

              <DropdownMenuSeparator className="bg-surface-border" />

              {/* Logout */}
              <DropdownMenuItem
                onClick={handleLogout}
                className="cursor-pointer gap-2.5 rounded-lg px-2.5 py-2 text-sm text-red-500 outline-none focus:bg-red-500/10 focus:text-red-500"
              >
                <LogOut className="h-4 w-4" />

                <span>Logout</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Mobile navigation */}
          <Sheet
            open={open}
            onOpenChange={setOpen}
          >
            <SheetTrigger asChild>
              <button
                type="button"
                className="flex h-9 w-9 items-center justify-center rounded-full text-surface-fg transition hover:bg-[color-mix(in_srgb,var(--surface-muted)_10%,transparent)] lg:hidden"
                aria-label="Open navigation menu"
              >
                <Menu
                  className="h-5 w-5"
                  strokeWidth={2}
                />
              </button>
            </SheetTrigger>

            <SheetContent>
              <DialogPrimitive.Title className="sr-only">
                Admin navigation menu
              </DialogPrimitive.Title>

              <AdminSidebar
                onNavigate={() => setOpen(false)}
              />
            </SheetContent>
          </Sheet>
        </div>
      </header>

      {/* Command Center */}
      <CommandCenter
        open={commandOpen}
        onOpenChange={setCommandOpen}
      />
    </>
  );
}