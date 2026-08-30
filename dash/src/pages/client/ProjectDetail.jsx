import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  Clock3,
  FolderKanban,
  Layers3,
  Users,
  AlertCircle,
  ArrowUpRight,
  CreditCard,
  IndianRupee,
  Receipt,
} from "lucide-react";

import { getProjectById, teamMembers } from "@/data/mockData";
import StatusBadge from "@/components/shared/StatusBadge";
import EmptyState from "@/components/shared/EmptyState";

const STATUS_LABELS = {
  "in-progress": "In Progress",
  "client-review": "Client Review",
  blocked: "Blocked",
  completed: "Completed",
};

function formatStatus(status) {
  return STATUS_LABELS[status] || status;
}

function formatCurrency(value) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
}

function StatCard({ icon: Icon, label, value, description }) {
  return (
    <div className="brand-card">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-surface-muted">
            {label}
          </p>

          <p className="mt-2 font-display text-2xl font-bold tracking-[-0.02em] text-surface-fg">
            {value}
          </p>

          {description && <p className="mt-1 text-xs text-surface-muted">{description}</p>}
        </div>

        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-orange/10 text-brand-orange">
          <Icon className="h-[18px] w-[18px]" strokeWidth={2} />
        </div>
      </div>
    </div>
  );
}

export default function ProjectDetail() {
  const { projectId } = useParams();

  const project = getProjectById(projectId);

  if (!project) {
    return (
      <div className="mx-auto max-w-[1180px]">
        <EmptyState
          title="Project Not Found"
          description="The project you're looking for doesn't exist or is no longer available."
        />

        <div className="mt-6 flex justify-center">
          <Link
            to="/projects"
            className="inline-flex items-center gap-2 rounded-xl bg-brand-orange px-4 py-2.5 text-sm font-semibold text-white transition hover:opacity-90"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Projects
          </Link>
        </div>
      </div>
    );
  }

  const projectTeam = teamMembers.slice(0, project.teamSize);

  const isBlocked = project.status === "blocked";
  const isCompleted = project.status === "completed";
  const isClientReview = project.status === "client-review";

  /*
   * ============================================================
   * PAYMENT DATA
   * Replace this with API data later.
   * ============================================================
   */

  const paymentData = {
    total: 240000,
    paid: 120000,
    transactions: [
      {
        id: "PAY-2026-001",
        date: "05 Aug 2026",
        amount: 75000,
        method: "Bank Transfer",
        status: "paid",
      },
      {
        id: "PAY-2026-002",
        date: "10 Aug 2026",
        amount: 45000,
        method: "UPI",
        status: "paid",
      },
    ],
  };

  const outstanding = paymentData.total - paymentData.paid;

  const paymentProgress =
    paymentData.total > 0 ? Math.round((paymentData.paid / paymentData.total) * 100) : 0;

  return (
    <div className="mx-auto max-w-[1180px] animate-fade-up">
      {/* Back */}
      <div className="mb-6">
        <Link
          to="/projects"
          className="inline-flex items-center gap-2 text-sm font-medium text-surface-muted transition hover:text-surface-fg"
        >
          <ArrowLeft className="h-4 w-4" />
          All Projects
        </Link>
      </div>

      {/* Header */}
      <section className="mb-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="min-w-0">
            <div className="mb-3 flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-surface-muted/10 px-3 py-1 text-xs font-semibold text-surface-muted">
                {project.clientName}
              </span>

              <span className="text-surface-muted">·</span>

              <span className="text-xs font-medium text-surface-muted">Project</span>
            </div>

            <h1 className="font-display text-display-md font-bold tracking-[-0.025em] text-surface-fg">
              {project.name}
            </h1>

            <p className="mt-3 max-w-2xl text-lead text-surface-muted">{project.description}</p>

            <div className="mt-5 flex flex-wrap items-center gap-3">
              <StatusBadge status={project.status} />

              {project.attentionReason && (
                <div
                  className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${
                    isBlocked
                      ? "bg-red-500/10 text-red-600"
                      : "bg-brand-orange/10 text-brand-orange"
                  }`}
                >
                  {isBlocked ? (
                    <AlertCircle className="h-3.5 w-3.5" />
                  ) : (
                    <Clock3 className="h-3.5 w-3.5" />
                  )}

                  {project.attentionReason}
                </div>
              )}
            </div>
          </div>

          {/* Deadline */}
          <div className="shrink-0 rounded-2xl border border-surface-border bg-surface-bg px-5 py-4 lg:min-w-[210px]">
            <div className="flex items-center gap-2 text-surface-muted">
              <CalendarDays className="h-4 w-4" />

              <span className="text-xs font-semibold uppercase tracking-[0.1em]">Deadline</span>
            </div>

            <p className="mt-2 font-display text-lg font-bold text-surface-fg">
              {project.deadline}
            </p>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={FolderKanban}
          label="Progress"
          value={`${project.progress}%`}
          description="Overall project completion"
        />

        <StatCard
          icon={CheckCircle2}
          label="Deliverables"
          value={`${project.completedDeliverables}/${project.totalDeliverables}`}
          description="Completed deliverables"
        />

        <StatCard
          icon={Layers3}
          label="Services"
          value={project.services.length}
          description="Services in this project"
        />

        <StatCard
          icon={Users}
          label="Team"
          value={project.teamSize}
          description="OCT20FIVE members"
        />
      </section>

      {/* Progress */}
      <section className="brand-card mb-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-surface-muted">
              Project Progress
            </p>

            <h2 className="mt-1 font-display text-xl font-bold text-surface-fg">
              {project.progress}% complete
            </h2>
          </div>

          <span className="text-xs font-medium text-surface-muted">
            {project.completedDeliverables} of {project.totalDeliverables} deliverables completed
          </span>
        </div>

        <div className="mt-5 h-3 overflow-hidden rounded-full bg-surface-border">
          <div
            className="h-full rounded-full bg-brand-orange transition-all duration-700"
            style={{ width: `${project.progress}%` }}
          />
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-[1.35fr_0.65fr]">
        {/* Main */}
        <div className="space-y-6">
          {/* Current Work */}
          <section className="brand-card">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-surface-muted">
                  Current Work
                </p>

                <h2 className="mt-1 font-display text-xl font-bold text-surface-fg">
                  {project.currentWork.title}
                </h2>
              </div>

              <span className="rounded-full bg-brand-orange/10 px-3 py-1 text-xs font-semibold text-brand-orange">
                {project.currentWork.service}
              </span>
            </div>

            <p className="mt-4 text-sm leading-6 text-surface-muted">
              {project.currentWork.description}
            </p>

            {isClientReview && (
              <div className="mt-5 flex flex-col gap-3 rounded-xl border border-brand-orange/20 bg-brand-orange/5 p-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm font-semibold text-surface-fg">Your review is required</p>

                  <p className="mt-1 text-xs text-surface-muted">
                    A deliverable is waiting for your approval.
                  </p>
                </div>

                <button className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand-orange px-4 py-2.5 text-xs font-semibold text-white transition hover:opacity-90">
                  Review
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </button>
              </div>
            )}

            {isBlocked && (
              <div className="mt-5 rounded-xl border border-red-500/20 bg-red-500/5 p-4">
                <div className="flex gap-3">
                  <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-600" />

                  <div>
                    <p className="text-sm font-semibold text-surface-fg">
                      Project currently blocked
                    </p>

                    <p className="mt-1 text-xs leading-5 text-surface-muted">
                      {project.attentionReason}. Please provide the required information or assets
                      so the team can continue.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </section>

          {/* Services */}
          <section className="brand-card">
            <div className="mb-5">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-surface-muted">
                Services
              </p>

              <h2 className="mt-1 font-display text-xl font-bold text-surface-fg">
                What's included
              </h2>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {project.services.map((service) => (
                <div
                  key={service}
                  className="flex items-center gap-3 rounded-xl border border-surface-border p-4"
                >
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-orange/10 text-brand-orange">
                    <Layers3 className="h-4 w-4" />
                  </div>

                  <span className="text-sm font-semibold text-surface-fg">{service}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Deliverables */}
          <section className="brand-card">
            <div className="mb-5 flex items-end justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-surface-muted">
                  Deliverables
                </p>

                <h2 className="mt-1 font-display text-xl font-bold text-surface-fg">
                  Project output
                </h2>
              </div>

              <span className="text-xs font-semibold text-surface-muted">
                {project.completedDeliverables}/{project.totalDeliverables}
              </span>
            </div>

            <div className="space-y-3">
              {Array.from({ length: project.totalDeliverables }).map((_, index) => {
                const completed = index < project.completedDeliverables;

                return (
                  <div
                    key={index}
                    className="flex items-center gap-3 rounded-xl border border-surface-border px-4 py-3"
                  >
                    <CheckCircle2
                      className={`h-4 w-4 ${
                        completed ? "text-emerald-600" : "text-surface-border"
                      }`}
                    />

                    <span
                      className={`text-sm ${
                        completed ? "font-medium text-surface-fg" : "text-surface-muted"
                      }`}
                    >
                      Deliverable {String(index + 1).padStart(2, "0")}
                    </span>

                    <span className="ml-auto text-[0.65rem] font-semibold uppercase tracking-[0.08em] text-surface-muted">
                      {completed ? "Completed" : "In progress"}
                    </span>
                  </div>
                );
              })}
            </div>
          </section>

          {/* =====================================================
              PROJECT PAYMENTS
          ===================================================== */}

          <section className="brand-card">
            <div className="flex flex-col gap-4 border-b border-surface-border pb-5 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-surface-muted">
                  Payments
                </p>

                <h2 className="mt-1 font-display text-xl font-bold text-surface-fg">
                  Project billing
                </h2>

                <p className="mt-1 text-sm text-surface-muted">
                  Track payments made towards this project and any remaining balance.
                </p>
              </div>

              {outstanding > 0 && (
                <Link
                  to={`/project/${project.id}/pay`}
                  className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-brand-orange px-4 py-2.5 text-sm font-semibold text-white transition hover:opacity-90"
                >
                  Pay Outstanding
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              )}
            </div>

            {/* Payment Summary */}

            <div className="grid divide-y divide-surface-border sm:grid-cols-3 sm:divide-x sm:divide-y-0">
              <div className="px-1 py-5 sm:px-5">
                <div className="flex items-center gap-2">
                  <Receipt className="h-4 w-4 text-surface-muted" />

                  <span className="text-xs font-semibold uppercase tracking-[0.08em] text-surface-muted">
                    Project Total
                  </span>
                </div>

                <p className="mt-2 font-display text-xl font-bold text-surface-fg">
                  {formatCurrency(paymentData.total)}
                </p>
              </div>

              <div className="px-1 py-5 sm:px-5">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />

                  <span className="text-xs font-semibold uppercase tracking-[0.08em] text-surface-muted">
                    Paid
                  </span>
                </div>

                <p className="mt-2 font-display text-xl font-bold text-emerald-600">
                  {formatCurrency(paymentData.paid)}
                </p>
              </div>

              <div className="px-1 py-5 sm:px-5">
                <div className="flex items-center gap-2">
                  <Clock3
                    className={`h-4 w-4 ${
                      outstanding > 0 ? "text-brand-orange" : "text-emerald-600"
                    }`}
                  />

                  <span className="text-xs font-semibold uppercase tracking-[0.08em] text-surface-muted">
                    Outstanding
                  </span>
                </div>

                <p
                  className={`mt-2 font-display text-xl font-bold ${
                    outstanding > 0 ? "text-brand-orange" : "text-emerald-600"
                  }`}
                >
                  {formatCurrency(outstanding)}
                </p>
              </div>
            </div>

            {/* Payment Progress */}

            <div className="border-t border-surface-border pt-5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-surface-muted">Payment Progress</span>

                <span className="text-xs font-bold text-surface-fg">{paymentProgress}%</span>
              </div>

              <div className="mt-2 h-2 overflow-hidden rounded-full bg-surface-border">
                <div
                  className="h-full rounded-full bg-brand-orange transition-all duration-700"
                  style={{
                    width: `${paymentProgress}%`,
                  }}
                />
              </div>

              <p className="mt-2 text-xs text-surface-muted">
                {formatCurrency(paymentData.paid)} of {formatCurrency(paymentData.total)} paid
              </p>
            </div>

            {/* Payment History */}

            <div className="mt-6">
              <div className="mb-3 flex items-center justify-between">
                <h3 className="text-sm font-bold text-surface-fg">Payment History</h3>

                <span className="text-xs text-surface-muted">
                  {paymentData.transactions.length} payments
                </span>
              </div>

              <div className="divide-y divide-surface-border rounded-xl border border-surface-border">
                {paymentData.transactions.map((payment) => (
                  <div
                    key={payment.id}
                    className="flex flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10">
                        <CreditCard className="h-4 w-4 text-emerald-600" />
                      </div>

                      <div>
                        <p className="text-sm font-semibold text-surface-fg">{payment.id}</p>

                        <p className="mt-0.5 text-xs text-surface-muted">
                          {payment.date} · {payment.method}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <span className="text-sm font-bold text-surface-fg">
                        {formatCurrency(payment.amount)}
                      </span>

                      <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-1 text-[0.65rem] font-semibold text-emerald-600">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        Paid
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Outstanding Notice */}

            {outstanding > 0 && (
              <div className="mt-5 flex flex-col gap-4 rounded-xl border border-brand-orange/20 bg-brand-orange/5 p-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-orange/10">
                    <IndianRupee className="h-4 w-4 text-brand-orange" />
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-surface-fg">
                      {formatCurrency(outstanding)} remaining
                    </p>

                    <p className="mt-1 text-xs leading-5 text-surface-muted">
                      Complete your remaining payment to settle this project.
                    </p>
                  </div>
                </div>

                <Link
                  to={`/project/${project.id}/pay`}
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-brand-orange px-4 py-2.5 text-xs font-bold text-white transition hover:opacity-90"
                >
                  Make Payment
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            )}

            {outstanding === 0 && (
              <div className="mt-5 flex items-center gap-3 rounded-xl border border-emerald-600/20 bg-emerald-600/5 p-4">
                <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-600" />

                <div>
                  <p className="text-sm font-bold text-surface-fg">Project fully paid</p>

                  <p className="mt-1 text-xs text-surface-muted">
                    There are no outstanding payments for this project.
                  </p>
                </div>
              </div>
            )}
          </section>
        </div>

        {/* Sidebar */}
        <aside className="space-y-6">
          {/* Team */}
          <section className="brand-card">
            <div className="mb-5">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-surface-muted">
                Project Team
              </p>

              <h2 className="mt-1 font-display text-xl font-bold text-surface-fg">
                Who's working on it
              </h2>
            </div>

            <div className="space-y-3">
              {projectTeam.map((member) => (
                <div key={member.id} className="flex items-center gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-orange/10 text-xs font-bold text-brand-orange">
                    {member.initials}
                  </div>

                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-surface-fg">{member.name}</p>

                    <p className="truncate text-xs text-surface-muted">{member.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Project Information */}
          <section className="brand-card">
            <div className="mb-5">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-surface-muted">
                Information
              </p>

              <h2 className="mt-1 font-display text-xl font-bold text-surface-fg">
                Project details
              </h2>
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-xs text-surface-muted">Status</p>

                <p className="mt-1 text-sm font-semibold text-surface-fg">
                  {formatStatus(project.status)}
                </p>
              </div>

              <div>
                <p className="text-xs text-surface-muted">Last updated</p>

                <p className="mt-1 text-sm font-semibold text-surface-fg">{project.updatedAt}</p>
              </div>

              <div>
                <p className="text-xs text-surface-muted">Deadline</p>

                <p className="mt-1 text-sm font-semibold text-surface-fg">{project.deadline}</p>
              </div>
            </div>
          </section>

          {/* Completed */}
          {isCompleted && (
            <div className="rounded-2xl border border-emerald-600/20 bg-emerald-600/5 p-5">
              <div className="flex gap-3">
                <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-600" />

                <div>
                  <p className="text-sm font-bold text-surface-fg">Project completed</p>

                  <p className="mt-1 text-xs leading-5 text-surface-muted">
                    All deliverables have been completed and approved.
                  </p>
                </div>
              </div>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
