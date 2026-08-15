import { useState } from "react";
import { Menu, Bell, ShieldCheck } from "lucide-react";

import {
  Sheet,
  SheetTrigger,
  SheetContent,
} from "@/components/ui/sheet";

import * as DialogPrimitive from "@radix-ui/react-dialog";

import AdminSidebar from "./AdminSidebar";

export default function AdminTopbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 flex items-center justify-between border-b border-surface-border bg-[color-mix(in_srgb,var(--surface-bg)_85%,transparent)] px-5 py-4 backdrop-blur-md lg:hidden">
      <div className="flex items-center gap-2">
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

      <div className="flex items-center gap-2">
        <button
          type="button"
          className="flex h-9 w-9 items-center justify-center rounded-full text-[color-mix(in_srgb,var(--surface-fg)_70%,transparent)] transition hover:bg-[color-mix(in_srgb,var(--surface-muted)_10%,transparent)]"
        >
          <Bell
            className="h-[18px] w-[18px]"
            strokeWidth={2}
          />
        </button>

        <Sheet
          open={open}
          onOpenChange={setOpen}
        >
          <SheetTrigger asChild>
            <button
              type="button"
              className="flex h-9 w-9 items-center justify-center rounded-full text-surface-fg transition hover:bg-[color-mix(in_srgb,var(--surface-muted)_10%,transparent)]"
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
  );
}