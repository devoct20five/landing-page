import { ChevronRight } from "lucide-react";
import StatusBadge from "@/components/shared/StatusBadge";
import { Progress } from "@/components/ui/progress";

export default function StaffProjectRow({ project }) {
  return (
    <tr className="group cursor-pointer border-b border-surface-border transition-colors duration-300 last:border-b-0 hover:bg-[color-mix(in_srgb,var(--surface-muted)_5%,transparent)]">
      <td className="py-4 pr-4">
        <p className="font-display text-sm font-bold text-surface-fg">{project.name}</p>
      </td>
      <td className="py-4 pr-4 text-sm text-surface-muted">{project.clientName}</td>
      <td className="py-4 pr-4 text-xs text-surface-muted">{project.services.join(" · ")}</td>
      <td className="py-4 pr-4">
        <div className="flex items-center gap-2">
          <div className="w-20">
            <Progress value={project.progress} />
          </div>
          <span className="text-xs font-semibold text-surface-fg">{project.progress}%</span>
        </div>
      </td>
      <td className="py-4 pr-4">
        <StatusBadge status={project.status} />
      </td>
      <td className="py-4 pr-4 text-sm text-surface-muted">{project.teamSize} members</td>
      <td className="py-4 pr-4 text-sm text-surface-muted">{project.deadline}</td>
      <td className="py-4 pr-4 text-sm text-surface-muted">{project.updatedAt}</td>
      <td className="py-4 pl-2">
        <ChevronRight
          className="h-4 w-4 text-surface-muted transition group-hover:translate-x-0.5 group-hover:text-brand-orange"
          strokeWidth={2}
        />
      </td>
    </tr>
  );
}
