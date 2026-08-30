import { ArrowUpRight } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import StatusBadge from "@/components/shared/StatusBadge";

export default function ProjectAttentionCard({ project }) {
  return (
    <div className="brand-card flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0 flex-1">
        <div className="mb-2 flex flex-wrap items-center gap-2">
          <h3 className="font-display text-base font-bold text-surface-fg">{project.name}</h3>
          <StatusBadge status={project.status} />
        </div>
        <p className="text-sm text-surface-muted">{project.clientName}</p>
        {project.attentionReason && (
          <p className="mt-1.5 text-sm font-medium text-brand-orange">{project.attentionReason}</p>
        )}
      </div>

      <div className="flex items-center gap-4 sm:w-48 sm:shrink-0">
        <div className="flex-1">
          <div className="mb-1.5 flex items-center justify-between text-xs">
            <span className="font-display font-bold text-surface-fg">{project.progress}%</span>
          </div>
          <Progress value={project.progress} />
        </div>
        <button className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-surface-border text-surface-muted transition hover:border-brand-orange hover:text-brand-orange">
          <ArrowUpRight className="h-4 w-4" strokeWidth={2} />
        </button>
      </div>
    </div>
  );
}
