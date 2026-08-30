import { ChevronRight } from "lucide-react";
import StatusBadge from "@/components/shared/StatusBadge";
import { Progress } from "@/components/ui/progress";

export default function StaffProjectCard({ project }) {
  return (
    <div className="brand-card">
      <div className="mb-3 flex items-start justify-between gap-3">
        <div>
          <h3 className="font-display text-base font-bold text-surface-fg">{project.name}</h3>
          <p className="mt-0.5 text-sm text-surface-muted">{project.clientName}</p>
        </div>
        <StatusBadge status={project.status} className="shrink-0" />
      </div>

      <p className="mb-4 text-xs text-surface-muted">{project.services.join(" · ")}</p>

      <div className="mb-4 flex items-center gap-2">
        <div className="flex-1">
          <Progress value={project.progress} />
        </div>
        <span className="text-xs font-semibold text-surface-fg">{project.progress}%</span>
      </div>

      <div className="flex items-center justify-between border-t border-surface-border pt-3 text-xs text-surface-muted">
        <span>{project.teamSize} members</span>
        <span>{project.deadline}</span>
        <ChevronRight className="h-4 w-4 text-surface-muted" strokeWidth={2} />
      </div>
    </div>
  );
}
