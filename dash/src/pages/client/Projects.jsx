import { useState } from "react";
import { currentClient, projects } from "@/data/mockData";
import ProjectCard from "@/components/project/ProjectCard";
import EmptyState from "@/components/shared/EmptyState";
import { cn } from "@/lib/utils";

const FILTERS = [
  { id: "all", label: "All" },
  { id: "active", label: "Active" },
  { id: "completed", label: "Completed" },
];

export default function Projects() {
  const [filter, setFilter] = useState("all");

  const clientProjects = projects.filter((p) => p.clientId === currentClient.id);

  const filtered = clientProjects.filter((p) => {
    if (filter === "active") return p.status !== "completed";
    if (filter === "completed") return p.status === "completed";
    return true;
  });

  return (
    <div className="mx-auto max-w-[1180px] animate-fade-up">
      <div className="mb-8 flex flex-col gap-6 sm:mb-10 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-display text-display-md font-bold tracking-[-0.02em] text-surface-fg">
            Your Projects
          </h1>
          <p className="mt-2 text-lead text-surface-muted">
            Everything OCT20FIVE is currently working on for you.
          </p>
        </div>

        <div className="flex gap-2">
          {FILTERS.map((f) => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className={cn("pill", filter === f.id && "pill-active")}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          title="No Projects Here Yet"
          description="Projects matching this filter will appear here once work begins."
        />
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      )}
    </div>
  );
}
