import { ArrowRight, CalendarDays, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import { Progress } from "@/components/ui/progress";
import StatusBadge from "@/components/shared/StatusBadge";

export default function ProjectCard({ project }) {
  return (
    <div className="brand-card group flex h-full flex-col">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <h3 className="font-display text-xl font-bold text-surface-fg sm:text-[1.4rem]">
            {project.name}
          </h3>
          <p className="mt-1.5 text-sm leading-relaxed text-surface-muted">{project.description}</p>
        </div>
        <StatusBadge status={project.status} className="shrink-0" />
      </div>

      <div className="mb-5 flex flex-wrap gap-1.5">
        {project.services.map((service) => (
          <span
            key={service}
            className="rounded-pill border border-surface-border px-2.5 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.1em] text-surface-muted"
          >
            {service}
          </span>
        ))}
      </div>

      <div className="mb-5">
        <div className="mb-2 flex items-center justify-between">
          <span className="font-display text-sm font-bold text-surface-fg">
            {project.progress}%
          </span>
          <span className="text-xs text-surface-muted">
            {project.completedDeliverables} / {project.totalDeliverables} completed
          </span>
        </div>
        <Progress value={project.progress} />
      </div>

      <div className="mb-6 rounded-xl bg-[color-mix(in_srgb,var(--surface-muted)_6%,transparent)] px-4 py-3">
        <p className="mb-0.5 text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-surface-muted">
          Currently
        </p>
        <p className="text-sm font-medium text-surface-fg">
          {project.currentWork.title} — {project.currentWork.service}
        </p>
      </div>

      <div className="mt-auto flex items-center justify-between border-t border-surface-border pt-4">
        <div className="flex flex-col gap-1 text-xs text-surface-muted">
          <span className="flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5" strokeWidth={2} />
            Updated {project.updatedAt}
          </span>
          <span className="flex items-center gap-1.5">
            <CalendarDays className="h-3.5 w-3.5" strokeWidth={2} />
            {project.deadline}
          </span>
        </div>

        <Link to={`/project/${project.id}`} className="link-arrow shrink-0">
          View Project
          <ArrowRight className="arrow h-4 w-4" strokeWidth={2.25} />
        </Link>
      </div>
    </div>
  );
}
