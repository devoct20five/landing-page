import * as React from "react";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-pill px-3 py-1 text-[0.7rem] font-semibold uppercase tracking-[0.12em] leading-none",
  {
    variants: {
      variant: {
        neutral: "bg-[color-mix(in_srgb,var(--surface-muted)_10%,transparent)] text-surface-muted border border-surface-border",
        progress: "bg-brand-orange/10 text-brand-orange border border-brand-orange/25",
        success: "bg-emerald-600/10 text-emerald-700 border border-emerald-600/20",
        warning: "bg-amber-500/10 text-amber-700 border border-amber-500/25",
        blocked: "bg-red-600/10 text-red-700 border border-red-600/20",
        dark: "bg-surface-fg text-surface-bg",
      },
    },
    defaultVariants: {
      variant: "neutral",
    },
  }
);

function Badge({ className, variant, ...props }) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
