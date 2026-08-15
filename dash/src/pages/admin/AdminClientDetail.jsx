import { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  ArrowUpRight,
  BriefcaseBusiness,
  CheckCircle2,
  Clock3,
  AlertTriangle,
  ListChecks,
  FolderKanban,
  CreditCard,
  CalendarDays,
  Mail,
  Phone,
} from "lucide-react";

import {
  clients,
  projects,
  tasks,
  approvals,
} from "@/data/mockData";

import { cn } from "@/lib/utils";
import EmptyState from "@/components/shared/EmptyState";

function getProjectStatus(project) {
  if (project.status === "completed") {
    return {
      label: "Completed",
      className: "bg-emerald-500/10 text-emerald-600",
      icon: CheckCircle2,
    };
  }

  if (project.status === "blocked" || project.attentionReason) {
    return {
      label: "At Risk",
      className: "bg-red-500/10 text-red-600",
      icon: AlertTriangle,
    };
  }

  if (project.status === "client-review") {
    return {
      label: "Client Review",
      className: "bg-brand-orange/10 text-brand-orange",
      icon: Clock3,
    };
  }

  return {
    label: "In Progress",
    className: "bg-blue-500/10 text-blue-600",
    icon: Clock3,
  };
}

function StatCard({ icon: Icon, label, value, description }) {
  return (
    <div className="brand-card">
      <div className="flex items-center gap-2 text-surface-muted">
        <Icon className="h-4 w-4" />
        <span className="text-[0.65rem] font-semibold uppercase tracking-[0.14em]">
          {label}
        </span>
      </div>

      <p className="mt-3 font-display text-2xl font-bold text-surface-fg">
        {value}
      </p>

      {description && (
        <p className="mt-1 text-xs text-surface-muted">
          {description}
        </p>
      )}
    </div>
  );
}

function ProjectRow({ project }) {
  const status = getProjectStatus(project);
  const StatusIcon = status.icon;

  return (
    <div className="group flex flex-col gap-4 border-b border-surface-border py-5 last:border-b-0 sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="font-display text-sm font-bold text-surface-fg">
            {project.name}
          </h3>

          <span
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[0.65rem] font-semibold",
              status.className
            )}
          >
            <StatusIcon className="h-3 w-3" />
            {status.label}
          </span>
        </div>

        <p className="mt-1 text-xs text-surface-muted">
          {project.description || "No project description available."}
        </p>

        <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-surface-muted">
          <span className="flex items-center gap-1.5">
            <CalendarDays className="h-3.5 w-3.5" />
            {project.deadline}
          </span>

          <span>
            {project.completedDeliverables}/
            {project.totalDeliverables} deliverables
          </span>
        </div>
      </div>

      <div className="w-full shrink-0 sm:w-[180px]">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-[0.65rem] font-semibold uppercase tracking-wide text-surface-muted">
            Progress
          </span>

          <span className="text-xs font-bold text-surface-fg">
            {project.progress}%
          </span>
        </div>

        <div className="h-1.5 overflow-hidden rounded-full bg-surface-border">
          <div
            className="h-full rounded-full bg-brand-orange transition-all"
            style={{
              width: `${project.progress}%`,
            }}
          />
        </div>
      </div>

      <button
        type="button"
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-surface-border text-surface-muted transition hover:border-brand-orange/30 hover:text-brand-orange"
      >
        <ArrowUpRight className="h-4 w-4" />
      </button>
    </div>
  );
}

function TaskStatus({ status }) {
  const styles = {
    completed: "bg-emerald-500/10 text-emerald-600",
    pending: "bg-brand-orange/10 text-brand-orange",
    "in-progress": "bg-blue-500/10 text-blue-600",
    overdue: "bg-red-500/10 text-red-600",
  };

  return (
    <span
      className={cn(
        "rounded-full px-2.5 py-1 text-[0.65rem] font-semibold capitalize",
        styles[status] || "bg-surface-muted/10 text-surface-muted"
      )}
    >
      {status?.replace("-", " ") || "Pending"}
    </span>
  );
}

export default function AdminClientDetail() {
  const { clientId } = useParams();
  const navigate = useNavigate();

  const client = clients.find(
    (item) => String(item.id) === String(clientId)
  );

  const stats = useMemo(() => {
    if (!client) {
      return {
        projects: [],
        tasks: [],
        approvals: [],
        activeProjects: [],
        completedProjects: [],
        atRiskProjects: [],
        pendingApprovals: [],
        overdueTasks: [],
        totalProgress: 0,
      };
    }

    const clientProjects = projects.filter(
      (project) => project.clientId === client.id
    );

    const clientTasks = tasks.filter(
      (task) => task.clientId === client.id
    );

    const clientApprovals = approvals.filter(
      (approval) => approval.clientId === client.id
    );

    const activeProjects = clientProjects.filter(
      (project) => project.status !== "completed"
    );

    const completedProjects = clientProjects.filter(
      (project) => project.status === "completed"
    );

    const atRiskProjects = clientProjects.filter(
      (project) =>
        project.status === "blocked" ||
        Boolean(project.attentionReason)
    );

    const pendingApprovals = clientApprovals.filter(
      (approval) => approval.status === "pending"
    );

    const overdueTasks = clientTasks.filter(
      (task) => task.dueLabel === "Overdue"
    );

    const totalProgress =
      activeProjects.length > 0
        ? Math.round(
            activeProjects.reduce(
              (sum, project) => sum + project.progress,
              0
            ) / activeProjects.length
          )
        : 100;

    return {
      projects: clientProjects,
      tasks: clientTasks,
      approvals: clientApprovals,
      activeProjects,
      completedProjects,
      atRiskProjects,
      pendingApprovals,
      overdueTasks,
      totalProgress,
    };
  }, [client]);

  if (!client) {
    return (
      <div className="mx-auto max-w-[1320px]">
        <EmptyState
          title="Client Not Found"
          description="The client you're looking for does not exist or may have been removed."
        />

        <div className="mt-5 flex justify-center">
          <button
            type="button"
            onClick={() => navigate("/admin/clients")}
            className="inline-flex items-center gap-2 rounded-xl bg-brand-orange px-4 py-2.5 text-sm font-semibold text-white transition hover:opacity-90"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Clients
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1320px] animate-fade-up">
      {/* BACK */}
      <button
        type="button"
        onClick={() => navigate("/admin/clients")}
        className="mb-6 inline-flex items-center gap-2 text-xs font-semibold text-surface-muted transition hover:text-brand-orange"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Clients
      </button>

      {/* CLIENT HEADER */}
      <div className="brand-card mb-7">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex min-w-0 items-start gap-4">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-brand-orange/10 font-display text-lg font-bold text-brand-orange">
              {client.shortName?.slice(0, 2).toUpperCase()}
            </div>

            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="font-display text-display-md font-bold tracking-[-0.02em] text-surface-fg">
                  {client.name}
                </h1>

                <span className="rounded-full bg-emerald-500/10 px-2.5 py-1 text-[0.65rem] font-semibold text-emerald-600">
                  Client
                </span>
              </div>

              <p className="mt-1 text-sm text-surface-muted">
                {client.shortName}
              </p>

              <div className="mt-4 flex flex-wrap gap-4 text-xs text-surface-muted">
                {client.email && (
                  <span className="flex items-center gap-1.5">
                    <Mail className="h-3.5 w-3.5" />
                    {client.email}
                  </span>
                )}

                {client.phone && (
                  <span className="flex items-center gap-1.5">
                    <Phone className="h-3.5 w-3.5" />
                    {client.phone}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              className="rounded-xl border border-surface-border px-4 py-2.5 text-sm font-semibold text-surface-fg transition hover:bg-surface-muted/10"
            >
              Edit Client
            </button>

            <button
              type="button"
              className="rounded-xl bg-brand-orange px-4 py-2.5 text-sm font-semibold text-white shadow-[0_10px_24px_-8px_rgba(255,90,31,0.45)] transition hover:opacity-90"
            >
              Contact Client
            </button>
          </div>
        </div>
      </div>

      {/* STATS */}
      <div className="mb-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <StatCard
          icon={FolderKanban}
          label="Projects"
          value={stats.projects.length}
          description={`${stats.activeProjects.length} currently active`}
        />

        <StatCard
          icon={ListChecks}
          label="Tasks"
          value={stats.tasks.length}
          description={`${stats.overdueTasks.length} overdue`}
        />

        <StatCard
          icon={CheckCircle2}
          label="Completed"
          value={stats.completedProjects.length}
          description="Completed projects"
        />

        <StatCard
          icon={Clock3}
          label="Progress"
          value={`${stats.totalProgress}%`}
          description="Average active progress"
        />

        <StatCard
          icon={AlertTriangle}
          label="Attention"
          value={
            stats.atRiskProjects.length +
            stats.pendingApprovals.length +
            stats.overdueTasks.length
          }
          description="Items requiring attention"
        />
      </div>

      {/* MAIN GRID */}
      <div className="grid gap-7 xl:grid-cols-[minmax(0,1fr)_360px]">
        {/* LEFT */}
        <div className="space-y-7">
          {/* PROJECTS */}
          <section className="brand-card">
            <div className="mb-2 flex items-start justify-between gap-4">
              <div>
                <p className="text-[0.65rem] font-bold uppercase tracking-[0.14em] text-brand-orange">
                  Delivery
                </p>

                <h2 className="mt-1 font-display text-lg font-bold text-surface-fg">
                  Projects
                </h2>

                <p className="mt-1 text-sm text-surface-muted">
                  All projects associated with this client.
                </p>
              </div>

              <button
                type="button"
                className="text-xs font-semibold text-surface-muted transition hover:text-brand-orange"
              >
                View all
              </button>
            </div>

            {stats.projects.length === 0 ? (
              <div className="py-8">
                <EmptyState
                  title="No Projects"
                  description="This client doesn't have any projects yet."
                />
              </div>
            ) : (
              <div className="mt-4">
                {stats.projects.map((project) => (
                  <ProjectRow
                    key={project.id}
                    project={project}
                  />
                ))}
              </div>
            )}
          </section>

          {/* TASKS */}
          <section className="brand-card">
            <div className="mb-4">
              <p className="text-[0.65rem] font-bold uppercase tracking-[0.14em] text-brand-orange">
                Operations
              </p>

              <h2 className="mt-1 font-display text-lg font-bold text-surface-fg">
                Tasks
              </h2>

              <p className="mt-1 text-sm text-surface-muted">
                Work currently assigned across this client's projects.
              </p>
            </div>

            {stats.tasks.length === 0 ? (
              <p className="py-6 text-sm text-surface-muted">
                No tasks available for this client.
              </p>
            ) : (
              <div className="divide-y divide-surface-border">
                {stats.tasks.slice(0, 8).map((task) => (
                  <div
                    key={task.id}
                    className="flex items-center justify-between gap-4 py-4"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-surface-fg">
                        {task.title || task.name}
                      </p>

                      <p className="mt-1 text-xs text-surface-muted">
                        {task.projectName || "Client project"}
                        {task.dueLabel
                          ? ` · ${task.dueLabel}`
                          : ""}
                      </p>
                    </div>

                    <TaskStatus status={task.status} />
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>

        {/* RIGHT */}
        <div className="space-y-7">
          {/* ATTENTION */}
          <section className="brand-card">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-brand-orange" />

              <h2 className="font-display text-base font-bold text-surface-fg">
                Attention
              </h2>
            </div>

            <div className="mt-5 space-y-3">
              <div className="flex items-center justify-between rounded-xl bg-surface-muted/5 p-3">
                <span className="text-xs text-surface-muted">
                  At-risk projects
                </span>

                <span className="font-bold text-surface-fg">
                  {stats.atRiskProjects.length}
                </span>
              </div>

              <div className="flex items-center justify-between rounded-xl bg-surface-muted/5 p-3">
                <span className="text-xs text-surface-muted">
                  Pending approvals
                </span>

                <span className="font-bold text-surface-fg">
                  {stats.pendingApprovals.length}
                </span>
              </div>

              <div className="flex items-center justify-between rounded-xl bg-surface-muted/5 p-3">
                <span className="text-xs text-surface-muted">
                  Overdue tasks
                </span>

                <span className="font-bold text-surface-fg">
                  {stats.overdueTasks.length}
                </span>
              </div>
            </div>
          </section>

          {/* APPROVALS */}
          <section className="brand-card">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-brand-orange" />

              <h2 className="font-display text-base font-bold text-surface-fg">
                Approvals
              </h2>
            </div>

            <div className="mt-5">
              {stats.pendingApprovals.length === 0 ? (
                <p className="text-sm text-surface-muted">
                  No pending approvals.
                </p>
              ) : (
                <div className="space-y-3">
                  {stats.pendingApprovals
                    .slice(0, 5)
                    .map((approval) => (
                      <div
                        key={approval.id}
                        className="rounded-xl border border-surface-border p-3"
                      >
                        <p className="text-sm font-semibold text-surface-fg">
                          {approval.title ||
                            approval.name ||
                            "Approval request"}
                        </p>

                        <p className="mt-1 text-xs text-surface-muted">
                          {approval.projectName ||
                            "Client project"}
                        </p>

                        <span className="mt-3 inline-flex rounded-full bg-brand-orange/10 px-2.5 py-1 text-[0.65rem] font-semibold text-brand-orange">
                          Pending
                        </span>
                      </div>
                    ))}
                </div>
              )}
            </div>
          </section>

          {/* QUICK ACTIONS */}
          <section className="brand-card">
            <p className="text-[0.65rem] font-bold uppercase tracking-[0.14em] text-brand-orange">
              Client Management
            </p>

            <h2 className="mt-1 font-display text-base font-bold text-surface-fg">
              Quick Actions
            </h2>

            <div className="mt-5 space-y-2">
              <button
                type="button"
                className="flex w-full items-center justify-between rounded-xl border border-surface-border px-3.5 py-3 text-left text-sm font-semibold text-surface-fg transition hover:border-brand-orange/30 hover:text-brand-orange"
              >
                <span className="flex items-center gap-3">
                  <BriefcaseBusiness className="h-4 w-4" />
                  Create Project
                </span>

                <ArrowUpRight className="h-4 w-4" />
              </button>

              <button
                type="button"
                className="flex w-full items-center justify-between rounded-xl border border-surface-border px-3.5 py-3 text-left text-sm font-semibold text-surface-fg transition hover:border-brand-orange/30 hover:text-brand-orange"
              >
                <span className="flex items-center gap-3">
                  <CreditCard className="h-4 w-4" />
                  View Payments
                </span>

                <ArrowUpRight className="h-4 w-4" />
              </button>

              <button
                type="button"
                className="flex w-full items-center justify-between rounded-xl border border-surface-border px-3.5 py-3 text-left text-sm font-semibold text-surface-fg transition hover:border-brand-orange/30 hover:text-brand-orange"
              >
                <span className="flex items-center gap-3">
                  <Mail className="h-4 w-4" />
                  Contact Client
                </span>

                <ArrowUpRight className="h-4 w-4" />
              </button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}