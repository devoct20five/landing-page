import { cn } from "@/lib/utils";

export default function StaffStatCard({ label, value, tone = "default" }) {
  return (
    <div className="rounded-card border border-surface-border bg-surface-card px-5 py-4 transition-all duration-500 ease-smooth hover:-translate-y-1 hover:shadow-soft">
      <p className="mb-1.5 text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-surface-muted">
        {label}
      </p>
      <p
        className={cn(
          "font-display text-2xl font-bold tracking-[-0.02em] sm:text-[1.85rem]",
          tone === "warning" && "text-brand-orange",
          tone === "danger" && "text-red-600",
          tone === "default" && "text-surface-fg"
        )}
      >
        {value}
      </p>
    </div>
  );
}
