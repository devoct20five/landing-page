import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-pill font-semibold text-sm leading-none transition-all duration-300 ease-smooth disabled:opacity-40 disabled:pointer-events-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange focus-visible:ring-offset-2 focus-visible:ring-offset-surface-bg",
  {
    variants: {
      variant: {
        primary:
          "bg-brand-orange text-white shadow-[0_12px_30px_-10px_rgba(255,90,31,0.6)] hover:bg-brand-orangeHover hover:shadow-[0_18px_48px_-12px_rgba(255,90,31,0.75)] hover:-translate-y-0.5",
        secondary:
          "bg-surface-fg text-surface-bg hover:-translate-y-0.5",
        ghost:
          "bg-transparent text-brand-orange border-[1.5px] border-brand-orange hover:bg-brand-orange hover:text-white hover:-translate-y-0.5",
        outline:
          "bg-transparent text-surface-fg border-[1.5px] border-surface-fg hover:bg-surface-fg hover:text-surface-bg",
        subtle:
          "bg-[color-mix(in_srgb,var(--surface-muted)_10%,transparent)] text-surface-fg border border-surface-border hover:border-brand-orange hover:text-brand-orange",
      },
      size: {
        default: "px-6 py-[0.9rem]",
        sm: "px-4 py-2 text-[0.85rem]",
        lg: "px-8 py-4 text-base",
        icon: "h-11 w-11 rounded-full p-0",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  }
);

const Button = React.forwardRef(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
