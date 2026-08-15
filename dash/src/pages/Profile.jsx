import { useParams } from "react-router-dom";

import {
  Building2,
  Mail,
  Phone,
  MapPin,
  Globe,
  CalendarDays,
  BriefcaseBusiness,
  Users,
  Pencil,
  ShieldCheck,
  CheckCircle2,
  Clock3,
  FolderKanban,
  ArrowUpRight,
  AlertCircle,
  DollarSign,
  Wallet,
} from "lucide-react";

import { cn } from "@/lib/utils";

import {
  projects,
  teamMembers,
  tasks,
  staffActivity,
  getClientById,
  getTeamMemberById,
} from "@/data/mockData";

/* ============================================================
   STAFF PAYOUT DATA
============================================================ */

const STAFF_PAYOUTS = {
  "team-001": {
    salary: 45000,
    currency: "INR",
    payCycle: "Monthly",
    nextPayout: "31 Aug 2026",
    lastPayout: "31 Jul 2026",
    lastPayoutAmount: 45000,
    status: "scheduled",
    paymentMethod: "Bank Transfer",
  },

  "team-002": {
    salary: 60000,
    currency: "INR",
    payCycle: "Monthly",
    nextPayout: "31 Aug 2026",
    lastPayout: "31 Jul 2026",
    lastPayoutAmount: 60000,
    status: "scheduled",
    paymentMethod: "Bank Transfer",
  },

  "team-003": {
    salary: 38000,
    currency: "INR",
    payCycle: "Monthly",
    nextPayout: "31 Aug 2026",
    lastPayout: "31 Jul 2026",
    lastPayoutAmount: 38000,
    status: "scheduled",
    paymentMethod: "Bank Transfer",
  },
};

/* ============================================================
   MAIN PROFILE
============================================================ */

export default function Profile() {
  const { id } = useParams();

  /*
   * ----------------------------------------------------------
   * RESOLVE PROFILE FROM /u/:id
   * ----------------------------------------------------------
   */

  const isClient = id?.startsWith("client-");
  const isStaff = id?.startsWith("team-");

  const client = isClient ? getClientById(id) : null;
  const staff = isStaff ? getTeamMemberById(id) : null;

  /*
   * Unknown profile
   */

  if (!client && !staff) {
    return <ProfileNotFound />;
  }

  const profile = client || staff;

  /*
   * ----------------------------------------------------------
   * CLIENT DATA
   * ----------------------------------------------------------
   */

  const clientProjects = client
    ? projects.filter((project) => project.clientId === client.id)
    : [];

  const activeProjects = clientProjects.filter(
    (project) => project.status !== "completed"
  );

  const completedProjects = clientProjects.filter(
    (project) => project.status === "completed"
  );

  /*
   * ----------------------------------------------------------
   * STAFF DATA
   * ----------------------------------------------------------
   */

  const staffTasks = staff
    ? tasks.filter((task) => task.assigneeId === staff.id)
    : [];

  const staffPayout = staff
    ? STAFF_PAYOUTS[staff.id]
    : null;

  return (
    <div className="min-h-full bg-surface-bg">
      {/* ==================================================
          HEADER
      ================================================== */}

      <div className="border-b border-surface-border">
        <div className="mx-auto max-w-7xl px-6 py-8 lg:px-8">
          <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-brand-orange">
                {isClient ? "Client Account" : "Team Member"}
              </p>

              <h1 className="font-display text-3xl font-bold tracking-[-0.04em] text-surface-fg sm:text-4xl">
                Profile
              </h1>

              <p className="mt-2 max-w-xl text-sm leading-6 text-surface-muted">
                {isClient
                  ? "Manage company information, projects and account details."
                  : "View team member information, responsibilities and activity."}
              </p>
            </div>

            <button
              type="button"
              className={cn(
                "inline-flex items-center justify-center gap-2 rounded-xl",
                "border border-surface-border bg-surface-card px-4 py-2.5",
                "text-sm font-semibold text-surface-fg",
                "transition-all duration-200",
                "hover:border-brand-orange hover:text-brand-orange"
              )}
            >
              <Pencil className="h-4 w-4" strokeWidth={2} />
              Edit Profile
            </button>
          </div>
        </div>
      </div>

      {/* ==================================================
          CONTENT
      ================================================== */}

      <div className="mx-auto max-w-7xl px-6 py-8 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-[300px_1fr]">
          {/* ==================================================
              PROFILE SIDEBAR
          ================================================== */}

          <aside className="h-fit rounded-2xl border border-surface-border bg-surface-card p-6">
            <div className="flex flex-col items-center text-center">
              {/* Avatar */}

              <div className="flex h-24 w-24 items-center justify-center rounded-3xl bg-brand-orange font-display text-2xl font-bold text-white shadow-[0_16px_40px_-12px_rgba(255,90,31,0.45)]">
                {isClient
                  ? client.shortName?.slice(0, 2).toUpperCase()
                  : staff.initials}
              </div>

              <h2 className="mt-5 font-display text-xl font-bold tracking-[-0.03em] text-surface-fg">
                {profile.name}
              </h2>

              <p className="mt-1 text-sm text-surface-muted">
                {isClient ? "Client Account" : staff.role}
              </p>

              <div className="mt-4 inline-flex items-center gap-1.5 rounded-full border border-surface-border bg-surface-bg px-3 py-1.5 text-xs font-semibold text-surface-muted">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                Active account
              </div>
            </div>

            <div className="my-6 h-px bg-surface-border" />

            {/* ==================================================
                CLIENT META
            ================================================== */}

            {isClient && (
              <div className="space-y-4">
                <ProfileMeta
                  icon={Mail}
                  label="Email"
                  value="contact@acmecorp.com"
                />

                <ProfileMeta
                  icon={Phone}
                  label="Phone"
                  value="+91 98765 43210"
                />

                <ProfileMeta
                  icon={MapPin}
                  label="Location"
                  value="New Delhi, India"
                />

                <ProfileMeta
                  icon={Globe}
                  label="Website"
                  value="acmecorp.com"
                />
              </div>
            )}

            {/* ==================================================
                STAFF META
            ================================================== */}

            {isStaff && (
              <div className="space-y-4">
                <ProfileMeta
                  icon={Mail}
                  label="Email"
                  value={`${staff.name
                    .toLowerCase()
                    .replaceAll(" ", ".")}@oct20five.com`}
                />

                <ProfileMeta
                  icon={Phone}
                  label="Phone"
                  value="+91 98765 43210"
                />

                <ProfileMeta
                  icon={BriefcaseBusiness}
                  label="Department"
                  value={staff.role}
                />
              </div>
            )}
          </aside>

          {/* ==================================================
              MAIN CONTENT
          ================================================== */}

          <main className="space-y-6">
            {/* ==================================================
                BASIC INFORMATION
            ================================================== */}

            <section className="rounded-2xl border border-surface-border bg-surface-card">
              <SectionHeader
                title="Basic Information"
                description={
                  isClient
                    ? "Information associated with this client account."
                    : "Personal and professional information."
                }
              />

              <div className="grid gap-x-8 gap-y-6 p-6 sm:grid-cols-2">
                <InfoField
                  label={isClient ? "Company Name" : "Full Name"}
                  value={profile.name}
                />

                <InfoField
                  label={isClient ? "Account Type" : "Role"}
                  value={isClient ? "Client" : staff.role}
                />

                <InfoField
                  label="Email Address"
                  value={
                    isClient
                      ? "contact@acmecorp.com"
                      : `${staff.name
                          .toLowerCase()
                          .replaceAll(" ", ".")}@oct20five.com`
                  }
                />

                <InfoField
                  label="Phone Number"
                  value="+91 98765 43210"
                />

                {isClient && (
                  <>
                    <InfoField
                      label="Location"
                      value="New Delhi, India"
                    />

                    <InfoField
                      label="Website"
                      value="www.acmecorp.com"
                    />
                  </>
                )}
              </div>
            </section>

            {/* ==================================================
                CLIENT PROFILE
            ================================================== */}

            {isClient && (
              <>
                {/* ACCOUNT OVERVIEW */}

                <section className="rounded-2xl border border-surface-border bg-surface-card">
                  <SectionHeader
                    title="Account Overview"
                    description="A quick look at this client's engagement with OCT20FIVE."
                  />

                  <div className="grid grid-cols-2 divide-x divide-surface-border sm:grid-cols-4">
                    <Stat
                      icon={FolderKanban}
                      label="Active Projects"
                      value={activeProjects.length}
                    />

                    <Stat
                      icon={CheckCircle2}
                      label="Completed"
                      value={completedProjects.length}
                    />

                    <Stat
                      icon={Users}
                      label="Team"
                      value={teamMembers.length}
                    />

                    <Stat
                      icon={CalendarDays}
                      label="Member Since"
                      value="2026"
                    />
                  </div>
                </section>

                {/* SERVICES */}

                <section className="rounded-2xl border border-surface-border bg-surface-card">
                  <SectionHeader
                    title="Services"
                    description="Services currently being delivered for this account."
                  />

                  <div className="grid gap-3 p-6 sm:grid-cols-2 lg:grid-cols-3">
                    {[
                      "Editing",
                      "Design",
                      "3D",
                      "Web Development",
                    ].map((service) => (
                      <div
                        key={service}
                        className="flex items-center gap-3 rounded-xl border border-surface-border bg-surface-bg px-4 py-3"
                      >
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-orange/10">
                          <CheckCircle2 className="h-4 w-4 text-brand-orange" />
                        </div>

                        <span className="text-sm font-semibold text-surface-fg">
                          {service}
                        </span>
                      </div>
                    ))}
                  </div>
                </section>

                {/* PROJECTS */}

                <section className="rounded-2xl border border-surface-border bg-surface-card">
                  <SectionHeader
                    title="Projects"
                    description="Projects associated with this client."
                  />

                  <div className="divide-y divide-surface-border">
                    {clientProjects.slice(0, 5).map((project) => (
                      <ProjectRow
                        key={project.id}
                        project={project}
                      />
                    ))}
                  </div>

                  {clientProjects.length > 5 && (
                    <div className="border-t border-surface-border p-4">
                      <button
                        type="button"
                        className="flex w-full items-center justify-center gap-2 text-sm font-semibold text-brand-orange hover:underline"
                      >
                        View all projects
                        <ArrowUpRight className="h-4 w-4" />
                      </button>
                    </div>
                  )}
                </section>
              </>
            )}

            {/* ==================================================
                STAFF PROFILE
            ================================================== */}

            {isStaff && (
              <>
                {/* WORK INFORMATION */}

                <section className="rounded-2xl border border-surface-border bg-surface-card">
                  <SectionHeader
                    title="Work Information"
                    description="Role, responsibilities and employment information."
                  />

                  <div className="grid gap-6 p-6 sm:grid-cols-2">
                    <InfoField
                      label="Employee ID"
                      value={staff.id}
                    />

                    <InfoField
                      label="Role"
                      value={staff.role}
                    />

                    <InfoField
                      label="Current Status"
                      value="Active"
                    />

                    <InfoField
                      label="Joined OCT20FIVE"
                      value="January 2026"
                    />

                    <InfoField
                      label="Assigned Tasks"
                      value={staffTasks.length}
                    />

                    <InfoField
                      label="Department"
                      value={staff.department || staff.role}
                    />
                  </div>
                </section>

                {/* ==================================================
                    SALARY & PAYOUT
                ================================================== */}

                <section className="rounded-2xl border border-surface-border bg-surface-card">
                  <SectionHeader
                    title="Salary & Payout"
                    description="Compensation and payout information for this team member."
                  />

                  {staffPayout ? (
                    <>
                      {/* PAYOUT STATS */}

                      <div className="grid grid-cols-2 divide-x divide-surface-border sm:grid-cols-4">
                        <Stat
                          icon={DollarSign}
                          label="Monthly Salary"
                          value={`₹${staffPayout.salary.toLocaleString(
                            "en-IN"
                          )}`}
                        />

                        <Stat
                          icon={CalendarDays}
                          label="Pay Cycle"
                          value={staffPayout.payCycle}
                        />

                        <Stat
                          icon={Clock3}
                          label="Next Payout"
                          value={staffPayout.nextPayout}
                        />

                        <Stat
                          icon={CheckCircle2}
                          label="Status"
                          value="Scheduled"
                        />
                      </div>

                      {/* PAYOUT DETAILS */}

                      <div className="border-t border-surface-border">
                        <div className="grid gap-6 p-6 sm:grid-cols-2">
                          <InfoField
                            label="Last Payout"
                            value={staffPayout.lastPayout}
                          />

                          <InfoField
                            label="Last Payout Amount"
                            value={`₹${staffPayout.lastPayoutAmount.toLocaleString(
                              "en-IN"
                            )}`}
                          />

                          <InfoField
                            label="Payment Method"
                            value={staffPayout.paymentMethod}
                          />

                          <InfoField
                            label="Currency"
                            value={staffPayout.currency}
                          />
                        </div>
                      </div>

                      {/* MANAGE PAYOUT */}

                      <div className="flex flex-col gap-4 border-t border-surface-border px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <p className="text-sm font-semibold text-surface-fg">
                            Manage compensation
                          </p>

                          <p className="mt-0.5 text-xs text-surface-muted">
                            Update salary, payout schedule or payment
                            details.
                          </p>
                        </div>

                        <button
                          type="button"
                          className="inline-flex items-center justify-center gap-2 rounded-lg border border-surface-border px-3 py-2 text-xs font-semibold text-surface-fg transition hover:border-brand-orange hover:text-brand-orange"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                          Manage
                        </button>
                      </div>
                    </>
                  ) : (
                    /* NO PAYOUT DATA */

                    <div className="p-6">
                      <div className="rounded-xl border border-dashed border-surface-border bg-surface-bg p-8 text-center">
                        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-brand-orange/10">
                          <Wallet className="h-5 w-5 text-brand-orange" />
                        </div>

                        <p className="mt-4 text-sm font-semibold text-surface-fg">
                          No payout information
                        </p>

                        <p className="mx-auto mt-1 max-w-md text-xs leading-5 text-surface-muted">
                          Salary and payout details have not been
                          configured for this team member.
                        </p>

                        <button
                          type="button"
                          className="mt-5 inline-flex items-center gap-2 rounded-lg bg-brand-orange px-3.5 py-2.5 text-xs font-semibold text-white shadow-[0_8px_20px_-8px_rgba(255,90,31,0.55)] transition hover:opacity-90"
                        >
                          <DollarSign className="h-3.5 w-3.5" />
                          Configure Salary
                        </button>
                      </div>
                    </div>
                  )}
                </section>

                {/* ==================================================
                    RECENT ACTIVITY
                ================================================== */}

                <section className="rounded-2xl border border-surface-border bg-surface-card">
                  <SectionHeader
                    title="Recent Activity"
                    description="Recent activity across the agency."
                  />

                  <div className="divide-y divide-surface-border">
                    {staffActivity.slice(0, 5).map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between gap-4 px-6 py-4"
                      >
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-surface-bg">
                            <Clock3 className="h-4 w-4 text-brand-orange" />
                          </div>

                          <span className="text-sm font-medium text-surface-fg">
                            {item.text}
                          </span>
                        </div>

                        <span className="shrink-0 text-xs text-surface-muted">
                          {item.timestamp}
                        </span>
                      </div>
                    ))}
                  </div>
                </section>

                {/* ==================================================
                    SECURITY
                ================================================== */}

                <section className="rounded-2xl border border-surface-border bg-surface-card">
                  <SectionHeader
                    title="Security"
                    description="Manage account security and notification preferences."
                  />

                  <div className="divide-y divide-surface-border">
                    <SettingsRow
                      icon={ShieldCheck}
                      title="Password"
                      description="Last changed 30 days ago"
                      action="Change"
                    />

                    <SettingsRow
                      icon={Mail}
                      title="Email Notifications"
                      description="Receive important project updates"
                      action="Manage"
                    />
                  </div>
                </section>
              </>
            )}

            {/* ==================================================
                CLIENT SECURITY
            ================================================== */}

            {isClient && (
              <section className="rounded-2xl border border-surface-border bg-surface-card">
                <SectionHeader
                  title="Security"
                  description="Manage account security and notification preferences."
                />

                <div className="divide-y divide-surface-border">
                  <SettingsRow
                    icon={ShieldCheck}
                    title="Password"
                    description="Last changed 30 days ago"
                    action="Change"
                  />

                  <SettingsRow
                    icon={Mail}
                    title="Email Notifications"
                    description="Receive important project updates"
                    action="Manage"
                  />
                </div>
              </section>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   SECTION HEADER
============================================================ */

function SectionHeader({ title, description }) {
  return (
    <div className="border-b border-surface-border px-6 py-5">
      <h2 className="font-display text-base font-bold tracking-[-0.02em] text-surface-fg">
        {title}
      </h2>

      <p className="mt-1 text-sm text-surface-muted">
        {description}
      </p>
    </div>
  );
}

/* ============================================================
   PROFILE META
============================================================ */

function ProfileMeta({ icon: Icon, label, value }) {
  return (
    <div className="flex gap-3">
      <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-surface-bg">
        <Icon
          className="h-4 w-4 text-surface-muted"
          strokeWidth={2}
        />
      </div>

      <div className="min-w-0">
        <p className="text-[0.65rem] font-semibold uppercase tracking-[0.12em] text-surface-muted">
          {label}
        </p>

        <p className="mt-0.5 truncate text-sm font-medium text-surface-fg">
          {value}
        </p>
      </div>
    </div>
  );
}

/* ============================================================
   INFO FIELD
============================================================ */

function InfoField({ label, value }) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-[0.1em] text-surface-muted">
        {label}
      </p>

      <p className="mt-2 text-sm font-semibold text-surface-fg">
        {value}
      </p>
    </div>
  );
}

/* ============================================================
   STAT
============================================================ */

function Stat({ icon: Icon, label, value }) {
  return (
    <div className="px-5 py-5 first:pl-6">
      <div className="flex items-center gap-2">
        <Icon className="h-4 w-4 text-brand-orange" />

        <span className="text-xs font-medium text-surface-muted">
          {label}
        </span>
      </div>

      <p className="mt-2 font-display text-2xl font-bold tracking-[-0.04em] text-surface-fg">
        {value}
      </p>
    </div>
  );
}

/* ============================================================
   PROJECT ROW
============================================================ */

function ProjectRow({ project }) {
  const statusMap = {
    "in-progress": {
      label: "In Progress",
      className: "bg-blue-500/10 text-blue-600",
    },

    "client-review": {
      label: "Client Review",
      className: "bg-brand-orange/10 text-brand-orange",
    },

    blocked: {
      label: "Blocked",
      className: "bg-red-500/10 text-red-600",
    },

    completed: {
      label: "Completed",
      className: "bg-emerald-500/10 text-emerald-600",
    },
  };

  const status = statusMap[project.status] || {
    label: project.status,
    className: "bg-surface-bg text-surface-muted",
  };

  return (
    <div className="flex flex-col gap-4 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex min-w-0 items-center gap-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-surface-bg">
          <FolderKanban className="h-5 w-5 text-surface-muted" />
        </div>

        <div className="min-w-0">
          <h3 className="truncate text-sm font-bold text-surface-fg">
            {project.name}
          </h3>

          <p className="mt-1 truncate text-xs text-surface-muted">
            {project.services.join(" · ")}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-4 sm:shrink-0">
        <div className="hidden w-24 sm:block">
          <div className="mb-1 flex justify-between">
            <span className="text-[0.65rem] text-surface-muted">
              Progress
            </span>

            <span className="text-[0.65rem] font-semibold text-surface-fg">
              {project.progress}%
            </span>
          </div>

          <div className="h-1.5 overflow-hidden rounded-full bg-surface-bg">
            <div
              className="h-full rounded-full bg-brand-orange"
              style={{ width: `${project.progress}%` }}
            />
          </div>
        </div>

        <span
          className={cn(
            "rounded-full px-2.5 py-1 text-[0.65rem] font-semibold",
            status.className
          )}
        >
          {status.label}
        </span>
      </div>
    </div>
  );
}

/* ============================================================
   SETTINGS ROW
============================================================ */

function SettingsRow({
  icon: Icon,
  title,
  description,
  action,
}) {
  return (
    <div className="flex items-center justify-between gap-4 px-6 py-5">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-surface-bg">
          <Icon className="h-4 w-4 text-surface-muted" />
        </div>

        <div>
          <p className="text-sm font-semibold text-surface-fg">
            {title}
          </p>

          <p className="mt-0.5 text-xs text-surface-muted">
            {description}
          </p>
        </div>
      </div>

      <button
        type="button"
        className="text-xs font-semibold text-brand-orange hover:underline"
      >
        {action}
      </button>
    </div>
  );
}

/* ============================================================
   PROFILE NOT FOUND
============================================================ */

function ProfileNotFound() {
  return (
    <div className="flex min-h-full items-center justify-center bg-surface-bg p-6">
      <div className="max-w-md text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-500/10">
          <AlertCircle className="h-6 w-6 text-red-500" />
        </div>

        <h1 className="mt-5 font-display text-xl font-bold text-surface-fg">
          Profile not found
        </h1>

        <p className="mt-2 text-sm leading-6 text-surface-muted">
          The user or client associated with this profile could not
          be found.
        </p>
      </div>
    </div>
  );
}