import { cn } from "@/lib/utils";

/** Shape-matched placeholder. Never render fake data while loading. */
export function Skeleton({ className }) {
  return (
    <div
      aria-hidden="true"
      className={cn("animate-pulse rounded-lg bg-surface-muted/10", className)}
    />
  );
}

/** Stacked rows for list/table loading states. */
export function SkeletonList({ rows = 5, className }) {
  return (
    <div className={cn("space-y-3", className)} role="status" aria-label="Loading">
      {Array.from({ length: rows }).map((_, index) => (
        <div
          key={index}
          className="flex items-center gap-4 rounded-card border border-surface-border p-4"
        >
          <Skeleton className="h-9 w-9 shrink-0 rounded-xl" />
          <div className="min-w-0 flex-1 space-y-2">
            <Skeleton className="h-3.5 w-1/3" />
            <Skeleton className="h-3 w-2/3" />
          </div>
          <Skeleton className="h-6 w-20 shrink-0 rounded-full" />
        </div>
      ))}
    </div>
  );
}

export default Skeleton;
