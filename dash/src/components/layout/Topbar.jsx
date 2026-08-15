import { useState } from "react";
import { Menu, Bell, User } from "lucide-react";
import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import Sidebar from "./Sidebar";
import { currentClient } from "@/data/mockData";

export default function Topbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 flex items-center justify-between border-b border-surface-border bg-[color-mix(in_srgb,var(--surface-bg)_85%,transparent)] px-5 py-4 backdrop-blur-md sm:px-8 lg:px-12">
      {/* Brand — mobile only, desktop already shows it in the sidebar */}
      <div className="flex items-center gap-2 lg:hidden">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-orange font-display text-xs font-bold text-white">
          O5
        </div>
        <span className="font-display text-sm font-bold tracking-[-0.02em] text-surface-fg">
          OCT20FIVE
        </span>
      </div>

      {/* Spacer on desktop so notifications/profile sit to the right */}
      <div className="hidden lg:block" />

      <div className="flex items-center gap-2">
        <button
          type="button"
          className="flex h-9 w-9 items-center justify-center rounded-full text-[color-mix(in_srgb,var(--surface-fg)_70%,transparent)] transition hover:bg-[color-mix(in_srgb,var(--surface-muted)_10%,transparent)]"
        >
          <Bell className="h-[18px] w-[18px]" strokeWidth={2} />
        </button>

        <button
          type="button"
          className="flex items-center gap-2 rounded-full px-2 py-1.5 text-left text-[0.85rem] font-medium text-surface-fg transition hover:bg-[color-mix(in_srgb,var(--surface-muted)_10%,transparent)]"
        >
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[color-mix(in_srgb,var(--surface-muted)_15%,transparent)]">
            <User className="h-3.5 w-3.5" strokeWidth={2} />
          </div>
          <span className="hidden sm:block">{currentClient.shortName}</span>
        </button>

        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <button
              type="button"
              className="flex h-9 w-9 items-center justify-center rounded-full text-surface-fg transition hover:bg-[color-mix(in_srgb,var(--surface-muted)_10%,transparent)] lg:hidden"
            >
              <Menu className="h-5 w-5" strokeWidth={2} />
            </button>
          </SheetTrigger>
          <SheetContent>
            <DialogPrimitive.Title className="sr-only">
              Navigation menu
            </DialogPrimitive.Title>
            <Sidebar onNavigate={() => setOpen(false)} />
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}