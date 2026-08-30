import { cn } from "@/lib/utils";

const PRIORITY_MAP = {
  low: { label: "Low", className: "text-surface-muted" },
  medium: { label: "Medium", className: "text-surface-fg" },
  high: { label: "High", className: "text-brand-orange" },
};

export default function PriorityBadge({ priority }) {
  const config = PRIORITY_MAP[priority] || PRIORITY_MAP.low;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 text-[0.72rem] font-semibold uppercase tracking-[0.1em]",
        config.className
      )}
    >
      <span
        className={cn(
          "h-1.5 w-1.5 rounded-full",
          priority === "high"
            ? "bg-brand-orange"
            : priority === "medium"
              ? "bg-surface-fg"
              : "bg-surface-muted"
        )}
      />
      {config.label}
    </span>
  );
}
