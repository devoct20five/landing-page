import { useState } from "react";
import { Menu, ShieldCheck } from "lucide-react";

import {
  Sheet,
  SheetTrigger,
  SheetContent,
} from "@/components/ui/sheet";

import * as DialogPrimitive from "@radix-ui/react-dialog";

import AdminSidebar from "./AdminSidebar";
import NotificationDropdown from "@/components/shared/NotificationDropdown";
import { currentStaff } from "@/data/mockData";

export default function AdminTopbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 flex items-center justify-between border-b border-surface-border bg-[color-mix(in_srgb,var(--surface-bg)_85%,transparent)] px-5 py-4 backdrop-blur-md sm:px-8 lg:px-10">
      {/* Brand — mobile only, desktop already shows it in the sidebar */}
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

      {/* Spacer on desktop so notifications/profile sit to the right */}
      <div className="hidden lg:block" />

      <div className="flex items-center gap-2">
        <NotificationDropdown variant="topbar" />

        <div className="flex items-center gap-2 rounded-full pl-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-orange/10 text-[0.65rem] font-bold text-brand-orange">
            {currentStaff.initials}
          </div>

          <div className="hidden min-w-0 sm:block">
            <p className="truncate text-[0.8rem] font-semibold leading-tight text-surface-fg">
              {currentStaff.name}
            </p>
            <p className="truncate text-[0.65rem] leading-tight text-surface-muted">
              Administrator
            </p>
          </div>
        </div>

        {/* Mobile nav trigger — desktop sidebar covers this already */}
        <Sheet
          open={open}
          onOpenChange={setOpen}
        >
          <SheetTrigger asChild>
            <button
              type="button"
              className="flex h-9 w-9 items-center justify-center rounded-full text-surface-fg transition hover:bg-[color-mix(in_srgb,var(--surface-muted)_10%,transparent)] lg:hidden"
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

            <AdminSidebar onNavigate={() => setOpen(false)} />
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}