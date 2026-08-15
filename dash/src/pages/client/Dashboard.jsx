import { ArrowRight, ArrowUpRight } from "lucide-react";
import { currentClient, projects, actionItems, activity, upcoming, summaryStats } from "@/data/mockData";
import StatCard from "@/components/shared/StatCard";
import SectionHeader from "@/components/shared/SectionHeader";
import ActionRequiredCard from "@/components/project/ActionRequiredCard";
import ProjectCard from "@/components/project/ProjectCard";
import CurrentWorkCard from "@/components/project/CurrentWorkCard";
import ActivityList from "@/components/activity/ActivityList";

export default function Dashboard() {
  const clientProjects = projects.filter((p) => p.clientId === currentClient.id);
  const activeProjects = clientProjects.filter((p) => p.status !== "completed").slice(0, 4);
  const featuredWork = clientProjects.find((p) => p.id === "project-001").currentWork;
  const featuredUpdatedAt = clientProjects.find((p) => p.id === "project-001").updatedAt;

  return (
    <div className="mx-auto max-w-[1180px] animate-fade-up">
      {/* Header */}
      <div className="mb-10">
        <h1 className="font-display text-display-md font-bold tracking-[-0.02em] text-surface-fg">
          Good morning, {currentClient.shortName}.
        </h1>
        <p className="mt-2 text-lead text-surface-muted">
          Here&rsquo;s what&rsquo;s happening with your projects.
        </p>
      </div>

      {/* Summary */}
      <div className="mb-12 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        <StatCard label="Active Projects" value={summaryStats.activeProjects} />
        <StatCard label="In Progress" value={summaryStats.inProgress} />
        <StatCard label="Needs Your Input" value={summaryStats.needsInput} accent />
        <StatCard label="Completed" value={summaryStats.completed} />
      </div>

      {/* Action Required */}
      <section className="mb-12">
        <SectionHeader eyebrow="Needs Attention" title="Action Required" />
        <div className="grid gap-4 md:grid-cols-2">
          {actionItems.map((item) => (
            <ActionRequiredCard key={item.id} item={item} />
          ))}
        </div>
      </section>

      {/* Currently Working On */}
      <section className="mb-12">
        <CurrentWorkCard work={featuredWork} updatedAt={featuredUpdatedAt} />
      </section>

      {/* Active Projects */}
      <section className="mb-12">
        <SectionHeader
          eyebrow="Your Work"
          title="Active Projects"
          action={
            <button className="link-arrow hidden sm:inline-flex">
              View all
              <ArrowRight className="arrow h-4 w-4" strokeWidth={2.25} />
            </button>
          }
        />
        <div className="grid gap-5 sm:grid-cols-2">
          {activeProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </section>

      {/* Recent Activity + Up Next */}
      <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr]">
        <section>
          <SectionHeader eyebrow="Timeline" title="Recent Activity" />
          <div className="brand-card">
            <ActivityList items={activity.slice(0, 4)} />
          </div>
        </section>

        <section>
          <SectionHeader eyebrow="Ahead" title="Up Next" />
          <div className="brand-card space-y-1">
            {upcoming.map((item, i) => (
              <div
                key={item.id}
                className={
                  "flex items-center justify-between py-3.5" +
                  (i !== upcoming.length - 1 ? " border-b border-surface-border" : "")
                }
              >
                <span className="text-sm font-medium text-surface-fg">
                  {item.title}
                </span>
                <ArrowUpRight
                  className="h-4 w-4 shrink-0 text-surface-muted"
                  strokeWidth={2}
                />
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}