import { useEffect, useState } from "react";
import {
  Menu,
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

import StaffSidebar from "./StaffSidebar";
import NotificationDropdown from "@/components/shared/NotificationDropdown";
import CommandCenter from "@/components/shared/CommandCenter";

import { currentStaff } from "@/data/mockData";

export default function StaffTopbar() {
  const [open, setOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [commandOpen, setCommandOpen] = useState(false);

  // Command Center shortcut
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (
        (event.metaKey || event.ctrlKey) &&
        event.key.toLowerCase() === "k"
      ) {
        event.preventDefault();
        setCommandOpen(true);
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const handleProfile = () => {
    console.log("Navigate to profile");
    // navigate("/staff/profile");
  };

  const handleSettings = () => {
    console.log("Navigate to settings");
    // navigate("/staff/settings");
  };

  const handleLogout = () => {
    console.log("Logout");
    // logout();
  };

  return (
    <>
      <header
        className="
          sticky top-0 z-40
          flex items-center justify-between
          border-b border-surface-border
          bg-[color-mix(in_srgb,var(--surface-bg)_85%,transparent)]
          px-5 py-4
          backdrop-blur-md
          sm:px-8
          lg:px-10
        "
      >
        {/* BRAND — mobile only */}
        <div className="flex items-center gap-2 lg:hidden">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-orange font-display text-xs font-bold text-white">
            O5
          </div>

          <div>
            <span className="block font-display text-sm font-bold tracking-[-0.02em] text-surface-fg">
              OCT20FIVE
            </span>

            <span className="block text-[0.6rem] font-semibold uppercase tracking-[0.14em] text-surface-muted">
              Staff
            </span>
          </div>
        </div>

        {/* COMMAND CENTER — desktop */}
        <button
          type="button"
          onClick={() => setCommandOpen(true)}
          className="
            hidden lg:flex
            h-10 w-[320px]
            items-center gap-3
            rounded-xl
            border border-surface-border
            bg-surface-muted/5
            px-3
            text-left
            transition
            hover:border-brand-orange/30
            hover:bg-surface-muted/10
          "
        >
          <Search className="h-4 w-4 shrink-0 text-surface-muted" />

          <span className="flex-1 text-xs text-surface-muted">
            Search anything...
          </span>

          <kbd className="rounded-md border border-surface-border px-2 py-1 text-[0.6rem] font-semibold text-surface-muted">
            ⌘ K
          </kbd>
        </button>

        {/* RIGHT SIDE ACTIONS */}
        <div className="ml-auto flex items-center gap-1">

          {/* NOTIFICATIONS */}
          <NotificationDropdown
            open={notificationsOpen}
            onClose={() => setNotificationsOpen(false)}
          />

          {/* PROFILE DROPDOWN */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                className="
                  flex items-center gap-2
                  rounded-full
                  py-1.5 pl-2 pr-2
                  text-left
                  text-[0.85rem]
                  font-medium
                  text-surface-fg
                  outline-none
                  transition
                  hover:bg-[color-mix(in_srgb,var(--surface-muted)_10%,transparent)]
                  focus-visible:ring-2
                  focus-visible:ring-brand-orange/40
                "
                aria-label="Open profile menu"
              >
                {/* Avatar */}
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-orange/10 text-[0.65rem] font-bold text-brand-orange">
                  {currentStaff.initials}
                </div>

                {/* User information */}
                <div className="hidden min-w-0 sm:block">
                  <p className="max-w-[140px] truncate text-[0.8rem] font-semibold leading-tight text-surface-fg">
                    {currentStaff.name}
                  </p>

                  <p className="truncate text-[0.65rem] leading-tight text-surface-muted">
                    {currentStaff.role}
                  </p>
                </div>

                {/* Chevron */}
                <ChevronDown className="hidden h-3.5 w-3.5 text-surface-muted sm:block" />
              </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              align="end"
              sideOffset={8}
              className="
                w-56
                rounded-xl
                border-surface-border
                bg-surface-bg
                p-1.5
                shadow-lg
              "
            >
              {/* ACCOUNT HEADER */}
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
                      {currentStaff.role}
                    </p>
                  </div>
                </div>
              </div>

              <DropdownMenuSeparator className="bg-surface-border" />

              {/* PROFILE */}
              <DropdownMenuItem
                onClick={handleProfile}
                className="
                  cursor-pointer
                  gap-2.5
                  rounded-lg
                  px-2.5
                  py-2
                  text-sm
                  text-surface-fg
                  outline-none
                  focus:bg-surface-muted/10
                "
              >
                <User className="h-4 w-4 text-surface-muted" />

                <span>Profile</span>
              </DropdownMenuItem>

              {/* SETTINGS */}
              <DropdownMenuItem
                onClick={handleSettings}
                className="
                  cursor-pointer
                  gap-2.5
                  rounded-lg
                  px-2.5
                  py-2
                  text-sm
                  text-surface-fg
                  outline-none
                  focus:bg-surface-muted/10
                "
              >
                <Settings className="h-4 w-4 text-surface-muted" />

                <span>Settings</span>
              </DropdownMenuItem>

              <DropdownMenuSeparator className="bg-surface-border" />

              {/* LOGOUT */}
              <DropdownMenuItem
                onClick={handleLogout}
                className="
                  cursor-pointer
                  gap-2.5
                  rounded-lg
                  px-2.5
                  py-2
                  text-sm
                  text-red-500
                  outline-none
                  focus:bg-red-500/10
                  focus:text-red-500
                "
              >
                <LogOut className="h-4 w-4" />

                <span>Logout</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* MENU — mobile only */}
          <Sheet
            open={open}
            onOpenChange={setOpen}
          >
            <SheetTrigger asChild>
              <button
                type="button"
                className="
                  flex h-10 w-10
                  items-center justify-center
                  rounded-full
                  text-surface-fg
                  transition
                  hover:bg-[color-mix(in_srgb,var(--surface-muted)_10%,transparent)]
                  lg:hidden
                "
                aria-label="Open navigation"
              >
                <Menu
                  className="h-5 w-5"
                  strokeWidth={2}
                />
              </button>
            </SheetTrigger>

            <SheetContent
              side="left"
              className="w-[280px] p-5"
            >
              <DialogPrimitive.Title className="sr-only">
                Staff navigation menu
              </DialogPrimitive.Title>

              <StaffSidebar
                onNavigate={() => setOpen(false)}
              />
            </SheetContent>
          </Sheet>
        </div>
      </header>

      {/* COMMAND CENTER */}
      <CommandCenter
        open={commandOpen}
        onClose={() => setCommandOpen(false)}
      />
    </>
  );
}