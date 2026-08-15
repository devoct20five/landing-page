import { useState } from "react";
import { Menu, Bell } from "lucide-react";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
} from "@/components/ui/sheet";
import * as DialogPrimitive from "@radix-ui/react-dialog";

import StaffSidebar from "./StaffSidebar";
import NotificationDropdown from "@/components/shared/NotificationDropdown";

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
          lg:hidden
        "
      >
        {/* BRAND */}
        <div className="flex items-center gap-2">
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

        {/* RIGHT SIDE ACTIONS */}
        <div className="ml-auto flex items-center gap-1">
          {/* NOTIFICATIONS */}
          <button
            type="button"
            onClick={() =>
              setNotificationsOpen((value) => !value)
            }
            className="
              relative
              flex h-10 w-10
              items-center justify-center
              rounded-full
              text-[color-mix(in_srgb,var(--surface-fg)_70%,transparent)]
              transition
              hover:bg-[color-mix(in_srgb,var(--surface-muted)_10%,transparent)]
              hover:text-surface-fg
            "
            aria-label="Notifications"
          >
            <Bell
              className="h-[19px] w-[19px]"
              strokeWidth={2}
            />

            {/* Unread indicator */}
            <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-brand-orange" />
          </button>

          {/* MENU */}
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

      {/* NOTIFICATION DROPDOWN */}
      <NotificationDropdown
        open={notificationsOpen}
        onClose={() => setNotificationsOpen(false)}
      />
    </>
  );
}