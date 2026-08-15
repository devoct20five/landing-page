import { useMemo, useState } from "react";
import {
  Search,
  Users,
  UserPlus,
  ShieldCheck,
  Clock3,
  MoreHorizontal,
  Mail,
  CheckCircle2,
  UserRoundCog,
  Wallet,
  DollarSign,
  CalendarDays,
  AlertCircle,
  User,
  Pencil,
  KeyRound,
  Trash2,
  Eye,
  CreditCard,
} from "lucide-react";

import { teamMembers } from "@/data/mockData";
import EmptyState from "@/components/shared/EmptyState";
import { cn } from "@/lib/utils";

const TABS = [
  {
    id: "team",
    label: "Team",
    icon: Users,
  },
  {
    id: "users",
    label: "Users",
    icon: UserRoundCog,
  },
  {
    id: "roles",
    label: "Roles",
    icon: ShieldCheck,
  },
  {
    id: "onboarding",
    label: "Onboarding",
    icon: UserPlus,
  },
  {
    id: "payouts",
    label: "Salary & Payouts",
    icon: Wallet,
  },
];

const ROLE_CONFIG = {
  admin: {
    label: "Administrator",
    className: "bg-red-500/10 text-red-600",
  },
  manager: {
    label: "Manager",
    className: "bg-brand-orange/10 text-brand-orange",
  },
  staff: {
    label: "Staff",
    className: "bg-blue-500/10 text-blue-700",
  },
  member: {
    label: "Member",
    className: "bg-surface-muted/10 text-surface-muted",
  },
};

const STATUS_CONFIG = {
  active: {
    label: "Active",
    className: "bg-emerald-500/10 text-emerald-700",
    dot: "bg-emerald-500",
  },
  invited: {
    label: "Invited",
    className: "bg-brand-orange/10 text-brand-orange",
    dot: "bg-brand-orange",
  },
  suspended: {
    label: "Suspended",
    className: "bg-red-500/10 text-red-600",
    dot: "bg-red-500",
  },
};

const PAYOUT_CONFIG = {
  paid: {
    label: "Paid",
    className: "bg-emerald-500/10 text-emerald-700",
  },
  pending: {
    label: "Pending",
    className: "bg-brand-orange/10 text-brand-orange",
  },
  overdue: {
    label: "Overdue",
    className: "bg-red-500/10 text-red-600",
  },
};

function getRole(member) {
  const role = member.role?.toLowerCase();

  if (role?.includes("admin")) return "admin";
  if (role?.includes("manager")) return "manager";

  return "staff";
}

function getStatus(member) {
  if (member.status) {
    return member.status.toLowerCase();
  }

  return "active";
}

function RoleBadge({ role }) {
  const config = ROLE_CONFIG[role] || ROLE_CONFIG.member;

  return (
    <span
      className={cn(
        "inline-flex rounded-full px-2.5 py-1 text-[0.65rem] font-semibold",
        config.className,
      )}
    >
      {config.label}
    </span>
  );
}

function StatusBadge({ status }) {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.active;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[0.65rem] font-semibold",
        config.className,
      )}
    >
      <span
        className={cn(
          "h-1.5 w-1.5 rounded-full",
          config.dot,
        )}
      />

      {config.label}
    </span>
  );
}

function PayoutBadge({ status }) {
  const config =
    PAYOUT_CONFIG[status] || PAYOUT_CONFIG.pending;

  return (
    <span
      className={cn(
        "inline-flex rounded-full px-2.5 py-1 text-[0.65rem] font-semibold",
        config.className,
      )}
    >
      {config.label}
    </span>
  );
}

function UserActions({ member }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-surface-muted transition hover:bg-surface-muted/10 hover:text-surface-fg"
      >
        <MoreHorizontal className="h-4 w-4" />
      </button>

      {open && (
        <div className="absolute right-0 top-10 z-30 w-48 rounded-xl border border-surface-border bg-surface-card p-1.5 shadow-xl">
          <button
            type="button"
            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium text-surface-fg hover:bg-surface-muted/10"
          >
            <Eye className="h-3.5 w-3.5" />
            Check Profile
          </button>

          <button
            type="button"
            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium text-surface-fg hover:bg-surface-muted/10"
          >
            <Pencil className="h-3.5 w-3.5" />
            Edit User
          </button>

          <button
            type="button"
            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium text-surface-fg hover:bg-surface-muted/10"
          >
            <KeyRound className="h-3.5 w-3.5" />
            Manage Access
          </button>

          <button
            type="button"
            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium text-surface-fg hover:bg-surface-muted/10"
          >
            <Wallet className="h-3.5 w-3.5" />
            Salary & Payout
          </button>

          <div className="my-1 border-t border-surface-border" />

          <button
            type="button"
            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium text-red-600 hover:bg-red-50"
          >
            <Trash2 className="h-3.5 w-3.5" />
            Delete User
          </button>
        </div>
      )}
    </div>
  );
}

function TeamRow({ member }) {
  const role = getRole(member);
  const status = getStatus(member);

  return (
    <tr className="border-b border-surface-border last:border-b-0">
      <td className="px-6 py-5">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-orange/10 text-xs font-bold text-brand-orange">
            {member.initials}
          </div>

          <div className="min-w-0">
            <p className="font-display text-sm font-bold text-surface-fg">
              {member.name}
            </p>

            <p className="mt-0.5 truncate text-xs text-surface-muted">
              {member.email || member.role}
            </p>
          </div>
        </div>
      </td>

      <td className="py-5 pr-5">
        <RoleBadge role={role} />
      </td>

      <td className="py-5 pr-5">
        <span className="text-sm text-surface-muted">
          {member.department || "—"}
        </span>
      </td>

      <td className="py-5 pr-5">
        <StatusBadge status={status} />
      </td>

      <td className="py-5 pr-5">
        <span className="text-xs text-surface-muted">
          {member.lastActive || "Recently"}
        </span>
      </td>

      <td className="py-5 pr-6 text-right">
        <UserActions member={member} />
      </td>
    </tr>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  description,
}) {
  return (
    <div className="brand-card">
      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-orange/10 text-brand-orange">
        <Icon className="h-4 w-4" />
      </div>

      <p className="mt-5 text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-surface-muted">
        {label}
      </p>

      <p className="mt-1 font-display text-2xl font-bold tracking-[-0.02em] text-surface-fg">
        {value}
      </p>

      <p className="mt-1 text-xs text-surface-muted">
        {description}
      </p>
    </div>
  );
}

function RolesView() {
  const roles = [
    {
      name: "Administrator",
      description:
        "Full access to the OCT20FIVE administration system.",
      users: teamMembers.filter(
        (member) => getRole(member) === "admin",
      ).length,
      permissions: "Full access",
    },
    {
      name: "Manager",
      description:
        "Manage projects, clients, tasks and team delivery.",
      users: teamMembers.filter(
        (member) => getRole(member) === "manager",
      ).length,
      permissions: "Management",
    },
    {
      name: "Staff",
      description:
        "Work on assigned projects and operational tasks.",
      users: teamMembers.filter(
        (member) => getRole(member) === "staff",
      ).length,
      permissions: "Operational",
    },
  ];

  return (
    <div className="grid gap-4 lg:grid-cols-3">
      {roles.map((role) => (
        <div
          key={role.name}
          className="brand-card"
        >
          <div className="flex items-start justify-between">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-orange/10 text-brand-orange">
              <ShieldCheck className="h-5 w-5" />
            </div>

            <button
              type="button"
              className="text-surface-muted hover:text-surface-fg"
            >
              <MoreHorizontal className="h-4 w-4" />
            </button>
          </div>

          <h3 className="mt-5 font-display text-lg font-bold text-surface-fg">
            {role.name}
          </h3>

          <p className="mt-1 text-sm leading-6 text-surface-muted">
            {role.description}
          </p>

          <div className="mt-6 flex items-center justify-between border-t border-surface-border pt-4">
            <span className="text-xs text-surface-muted">
              Users
            </span>

            <span className="text-sm font-bold text-surface-fg">
              {role.users}
            </span>
          </div>

          <div className="mt-2 flex items-center justify-between">
            <span className="text-xs text-surface-muted">
              Access level
            </span>

            <span className="text-xs font-semibold text-surface-fg">
              {role.permissions}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

function OnboardingView() {
  const invited = teamMembers.filter(
    (member) => getStatus(member) === "invited",
  );

  return (
    <div>
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h2 className="font-display text-lg font-bold text-surface-fg">
            Pending Onboarding
          </h2>

          <p className="mt-1 text-sm text-surface-muted">
            People who have been invited but have not completed setup.
          </p>
        </div>

        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-xl bg-brand-orange px-4 py-2.5 text-sm font-semibold text-white"
        >
          <UserPlus className="h-4 w-4" />
          Invite User
        </button>
      </div>

      {invited.length === 0 ? (
        <EmptyState
          title="No Pending Invitations"
          description="Everyone invited to OCT20FIVE has completed onboarding."
        />
      ) : (
        <div className="space-y-3">
          {invited.map((member) => (
            <div
              key={member.id}
              className="brand-card flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-orange/10 text-xs font-bold text-brand-orange">
                  {member.initials}
                </div>

                <div>
                  <p className="font-display text-sm font-bold text-surface-fg">
                    {member.name}
                  </p>

                  <p className="mt-0.5 text-xs text-surface-muted">
                    {member.email || "Invitation pending"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Clock3 className="h-4 w-4 text-brand-orange" />

                <span className="text-xs text-surface-muted">
                  Invitation pending
                </span>

                <button
                  type="button"
                  className="inline-flex items-center gap-2 rounded-lg border border-surface-border px-3 py-2 text-xs font-semibold text-surface-fg hover:bg-surface-muted/10"
                >
                  <Mail className="h-3.5 w-3.5" />
                  Resend
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function UsersView() {
  return (
    <div className="brand-card overflow-x-auto p-0">
      <table className="w-full min-w-[850px] border-collapse">
        <thead>
          <tr className="border-b border-surface-border text-left text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-surface-muted">
            <th className="px-6 py-4">User</th>
            <th className="py-4 pr-5">Role</th>
            <th className="py-4 pr-5">Status</th>
            <th className="py-4 pr-5">Access</th>
            <th className="py-4 pr-6" />
          </tr>
        </thead>

        <tbody>
          {teamMembers.map((member) => {
            const role = getRole(member);
            const status = getStatus(member);

            return (
              <tr
                key={member.id}
                className="border-b border-surface-border last:border-b-0"
              >
                <td className="px-6 py-5">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-orange/10 text-xs font-bold text-brand-orange">
                      {member.initials}
                    </div>

                    <div>
                      <p className="text-sm font-semibold text-surface-fg">
                        {member.name}
                      </p>

                      <p className="text-xs text-surface-muted">
                        {member.email || "Internal user"}
                      </p>
                    </div>
                  </div>
                </td>

                <td className="py-5 pr-5">
                  <RoleBadge role={role} />
                </td>

                <td className="py-5 pr-5">
                  <StatusBadge status={status} />
                </td>

                <td className="py-5 pr-5">
                  <span className="text-xs font-medium text-surface-muted">
                    {role === "admin"
                      ? "Full"
                      : role === "manager"
                        ? "Management"
                        : "Standard"}
                  </span>
                </td>

                <td className="py-5 pr-6 text-right">
                  <UserActions member={member} />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

/* -----------------------------
   Salary & Payouts
----------------------------- */

const PAYOUTS = teamMembers.map((member, index) => ({
  ...member,
  salary:
    member.salary ||
    [65000, 52000, 42000, 38000, 35000][index % 5],
  payout:
    index === 2
      ? "pending"
      : index === 4
        ? "overdue"
        : "paid",
  payoutDate:
    index === 2
      ? "Aug 31, 2026"
      : index === 4
        ? "Aug 28, 2026"
        : "Aug 31, 2026",
}));

function PayoutsView() {
  const totalPayroll = PAYOUTS.reduce(
    (sum, member) => sum + member.salary,
    0,
  );

  const paidCount = PAYOUTS.filter(
    (member) => member.payout === "paid",
  ).length;

  const pendingCount = PAYOUTS.filter(
    (member) => member.payout === "pending",
  ).length;

  const overdueCount = PAYOUTS.filter(
    (member) => member.payout === "overdue",
  ).length;

  return (
    <div className="space-y-6">
      {/* Payout Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="font-display text-lg font-bold text-surface-fg">
            Salary & Payouts
          </h2>

          <p className="mt-1 text-sm text-surface-muted">
            Manage staff compensation and monthly payouts.
          </p>
        </div>

        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-xl bg-brand-orange px-4 py-2.5 text-sm font-semibold text-white"
        >
          <CreditCard className="h-4 w-4" />
          Process Payouts
        </button>
      </div>

      {/* Payout Stats */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          icon={DollarSign}
          label="Monthly Payroll"
          value={`₹${totalPayroll.toLocaleString("en-IN")}`}
          description="Current monthly salary commitment"
        />

        <StatCard
          icon={CheckCircle2}
          label="Paid"
          value={paidCount}
          description="Payouts completed this month"
        />

        <StatCard
          icon={Clock3}
          label="Pending"
          value={pendingCount}
          description="Awaiting payout"
        />

        <StatCard
          icon={AlertCircle}
          label="Overdue"
          value={overdueCount}
          description="Payouts requiring attention"
        />
      </div>

      {/* Payroll Table */}
      <div className="brand-card overflow-x-auto p-0">
        <table className="w-full min-w-[950px] border-collapse">
          <thead>
            <tr className="border-b border-surface-border text-left text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-surface-muted">
              <th className="px-6 py-4">
                Staff Member
              </th>

              <th className="py-4 pr-5">
                Role
              </th>

              <th className="py-4 pr-5">
                Monthly Salary
              </th>

              <th className="py-4 pr-5">
                Next Payout
              </th>

              <th className="py-4 pr-5">
                Status
              </th>

              <th className="py-4 pr-6 text-right">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {PAYOUTS.map((member) => {
              const role = getRole(member);

              return (
                <tr
                  key={member.id}
                  className="border-b border-surface-border last:border-b-0"
                >
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-orange/10 text-xs font-bold text-brand-orange">
                        {member.initials}
                      </div>

                      <div>
                        <p className="text-sm font-semibold text-surface-fg">
                          {member.name}
                        </p>

                        <p className="text-xs text-surface-muted">
                          {member.email}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="py-5 pr-5">
                    <RoleBadge role={role} />
                  </td>

                  <td className="py-5 pr-5">
                    <span className="font-display text-sm font-bold text-surface-fg">
                      ₹{member.salary.toLocaleString("en-IN")}
                    </span>
                  </td>

                  <td className="py-5 pr-5">
                    <div className="flex items-center gap-2 text-xs text-surface-muted">
                      <CalendarDays className="h-3.5 w-3.5" />
                      {member.payoutDate}
                    </div>
                  </td>

                  <td className="py-5 pr-5">
                    <PayoutBadge status={member.payout} />
                  </td>

                  <td className="py-5 pr-6 text-right">
                    <button
                      type="button"
                      className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-surface-muted hover:bg-surface-muted/10 hover:text-surface-fg"
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function AdminTeam() {
  const [activeTab, setActiveTab] = useState("team");
  const [search, setSearch] = useState("");

  const filteredMembers = useMemo(() => {
    const query = search.toLowerCase();

    return teamMembers.filter((member) => {
      return (
        member.name.toLowerCase().includes(query) ||
        member.role?.toLowerCase().includes(query) ||
        member.email?.toLowerCase().includes(query)
      );
    });
  }, [search]);

  const activeCount = teamMembers.filter(
    (member) => getStatus(member) === "active",
  ).length;

  const invitedCount = teamMembers.filter(
    (member) => getStatus(member) === "invited",
  ).length;

  const adminCount = teamMembers.filter(
    (member) => getRole(member) === "admin",
  ).length;

  return (
    <div className="mx-auto max-w-[1400px] animate-fade-up">
      {/* Header */}
      <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
      

          <h1 className="font-display text-display-md font-bold tracking-[-0.02em] text-surface-fg">
            Team
          </h1>

          <p className="mt-2 max-w-2xl text-lead text-surface-muted">
            Manage people, user access, roles, onboarding, and
            staff compensation across OCT20FIVE.
          </p>
        </div>

        <button
          type="button"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand-orange px-4 py-2.5 text-sm font-semibold text-white"
        >
          <UserPlus className="h-4 w-4" />
          Add User
        </button>
      </div>

      {/* Stats */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          icon={Users}
          label="Team Members"
          value={teamMembers.length}
          description="People in the organisation"
        />

        <StatCard
          icon={CheckCircle2}
          label="Active Users"
          value={activeCount}
          description="Currently active accounts"
        />

        <StatCard
          icon={Clock3}
          label="Pending Onboarding"
          value={invitedCount}
          description="Invitations awaiting setup"
        />

        <StatCard
          icon={ShieldCheck}
          label="Administrators"
          value={adminCount}
          description="Users with admin access"
        />
      </div>

      {/* Tabs */}
      <div className="mb-6 border-b border-surface-border">
        <div className="flex gap-1 overflow-x-auto">
          {TABS.map((tab) => {
            const Icon = tab.icon;

            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex shrink-0 items-center gap-2 border-b-2 px-4 py-3 text-sm font-medium transition",
                  activeTab === tab.id
                    ? "border-brand-orange text-brand-orange"
                    : "border-transparent text-surface-muted hover:text-surface-fg",
                )}
              >
                <Icon className="h-4 w-4" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Team */}
      {activeTab === "team" && (
        <>
          <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="font-display text-lg font-bold text-surface-fg">
                Team Members
              </h2>

              <p className="mt-1 text-sm text-surface-muted">
                Internal people working across OCT20FIVE.
              </p>
            </div>

            <div className="relative w-full sm:w-[280px]">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-surface-muted" />

              <input
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
                placeholder="Search team..."
                className="brand-input w-full pl-9"
              />
            </div>
          </div>

          {filteredMembers.length === 0 ? (
            <EmptyState
              title="No Team Members Found"
              description="Try changing your search."
            />
          ) : (
            <div className="brand-card overflow-x-auto p-0">
              <table className="w-full min-w-[900px] border-collapse">
                <thead>
                  <tr className="border-b border-surface-border text-left text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-surface-muted">
                    <th className="px-6 py-4">
                      Team Member
                    </th>

                    <th className="py-4 pr-5">
                      Role
                    </th>

                    <th className="py-4 pr-5">
                      Department
                    </th>

                    <th className="py-4 pr-5">
                      Status
                    </th>

                    <th className="py-4 pr-5">
                      Last Active
                    </th>

                    <th className="py-4 pr-6" />
                  </tr>
                </thead>

                <tbody>
                  {filteredMembers.map((member) => (
                    <TeamRow
                      key={member.id}
                      member={member}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}

      {/* Users */}
      {activeTab === "users" && <UsersView />}

      {/* Roles */}
      {activeTab === "roles" && <RolesView />}

      {/* Onboarding */}
      {activeTab === "onboarding" && <OnboardingView />}

      {/* Salary & Payouts */}
      {activeTab === "payouts" && <PayoutsView />}
    </div>
  );
}