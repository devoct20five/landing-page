import { useState } from "react";
import { Menu, Bell, Settings } from "lucide-react";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
} from "@/components/ui/sheet";
import * as DialogPrimitive from "@radix-ui/react-dialog";

import StaffSidebar from "./StaffSidebar";
import NotificationDropdown from "@/components/shared/NotificationDropdown";
import { currentStaff } from "@/data/mockData";

export default function StaffTopbar() {
  const [open, setOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

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
        {/* BRAND — mobile only, desktop already shows it in the sidebar */}
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

        {/* Spacer on desktop so actions sit to the right */}
        <div className="hidden lg:block" />

        {/* RIGHT SIDE ACTIONS */}
        <div className="ml-auto flex items-center gap-1">
       {/* NOTIFICATION DROPDOWN */}
      <NotificationDropdown
        open={notificationsOpen}
        onClose={() => setNotificationsOpen(false)}
      />
          {/* SETTINGS */}
          <button
            type="button"
            className="
              flex h-10 w-10
              items-center justify-center
              rounded-full
              text-[color-mix(in_srgb,var(--surface-fg)_70%,transparent)]
              transition
              hover:bg-[color-mix(in_srgb,var(--surface-muted)_10%,transparent)]
              hover:text-surface-fg
            "
            aria-label="Settings"
          >
            <Settings
              className="h-[18px] w-[18px]"
              strokeWidth={2}
            />
          </button>

          {/* PROFILE */}
          <button
            type="button"
            className="
              flex items-center gap-2
              rounded-full
              py-1.5 pl-2 pr-3
              text-left text-[0.85rem] font-medium text-surface-fg
              transition
              hover:bg-[color-mix(in_srgb,var(--surface-muted)_10%,transparent)]
            "
          >
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-brand-orange/10 text-[0.65rem] font-bold text-brand-orange">
              {currentStaff.initials}
            </div>

            <div className="hidden min-w-0 sm:block">
              <p className="truncate text-[0.8rem] font-semibold leading-tight text-surface-fg">
                {currentStaff.name}
              </p>
              <p className="truncate text-[0.65rem] leading-tight text-surface-muted">
                {currentStaff.role}
              </p>
            </div>
          </button>

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

              <StaffSidebar onNavigate={() => setOpen(false)} />
            </SheetContent>
          </Sheet>
        </div>
      </header>

     
    </>
  );
}