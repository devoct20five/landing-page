import { useMemo, useState } from "react";
import {
  CalendarDays,
  CheckCircle2,
  Clock3,
  Users,
  UserCheck,
  UserX,
  Coffee,
  Search,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
} from "lucide-react";

import { teamMembers } from "@/data/mockData";
import EmptyState from "@/components/shared/EmptyState";
import { cn } from "@/lib/utils";

/* ============================================================
   MOCK ATTENDANCE DATA
   Replace this with API data later.
============================================================ */

const attendanceData = [
  {
    memberId: teamMembers[0]?.id,
    status: "present",
    checkIn: "09:14 AM",
    checkOut: "06:32 PM",
    hours: "9h 18m",
    workMode: "Office",
  },
  {
    memberId: teamMembers[1]?.id,
    status: "present",
    checkIn: "09:42 AM",
    checkOut: "06:18 PM",
    hours: "8h 36m",
    workMode: "Office",
  },
  {
    memberId: teamMembers[2]?.id,
    status: "late",
    checkIn: "10:27 AM",
    checkOut: "—",
    hours: "7h 12m",
    workMode: "Office",
  },
  {
    memberId: teamMembers[3]?.id,
    status: "remote",
    checkIn: "09:08 AM",
    checkOut: "05:56 PM",
    hours: "8h 48m",
    workMode: "Remote",
  },
  {
    memberId: teamMembers[4]?.id,
    status: "leave",
    checkIn: "—",
    checkOut: "—",
    hours: "—",
    workMode: "—",
  },
].filter((item) => item.memberId);

const STATUS_CONFIG = {
  present: {
    label: "Present",
    className: "bg-emerald-500/10 text-emerald-700",
    dot: "bg-emerald-500",
  },

  late: {
    label: "Late",
    className: "bg-brand-orange/10 text-brand-orange",
    dot: "bg-brand-orange",
  },

  remote: {
    label: "Remote",
    className: "bg-blue-500/10 text-blue-700",
    dot: "bg-blue-500",
  },

  leave: {
    label: "On Leave",
    className: "bg-purple-500/10 text-purple-700",
    dot: "bg-purple-500",
  },

  absent: {
    label: "Absent",
    className: "bg-red-500/10 text-red-600",
    dot: "bg-red-500",
  },
};

/* ============================================================
   HELPERS
============================================================ */

function formatDate(date) {
  return new Intl.DateTimeFormat("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

function formatShortDate(date) {
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

function getAttendance(memberId) {
  return (
    attendanceData.find(
      (attendance) => attendance.memberId === memberId
    ) || {
      memberId,
      status: "absent",
      checkIn: "—",
      checkOut: "—",
      hours: "—",
      workMode: "—",
    }
  );
}

/* ============================================================
   STATUS BADGE
============================================================ */

function AttendanceStatus({ status }) {
  const config =
    STATUS_CONFIG[status] || STATUS_CONFIG.absent;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[0.65rem] font-semibold",
        config.className
      )}
    >
      <span
        className={cn(
          "h-1.5 w-1.5 rounded-full",
          config.dot
        )}
      />

      {config.label}
    </span>
  );
}

/* ============================================================
   STAT CARD
============================================================ */

function StatCard({
  icon: Icon,
  label,
  value,
  description,
  warning = false,
}) {
  return (
    <div className="brand-card">
      <div className="flex items-start justify-between gap-4">
        <div
          className={cn(
            "flex h-9 w-9 items-center justify-center rounded-lg",
            warning
              ? "bg-brand-orange/10 text-brand-orange"
              : "bg-brand-orange/10 text-brand-orange"
          )}
        >
          <Icon className="h-4 w-4" />
        </div>
      </div>

      <p className="mt-5 text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-surface-muted">
        {label}
      </p>

      <p
        className={cn(
          "mt-1 font-display text-2xl font-bold tracking-[-0.02em]",
          warning
            ? "text-brand-orange"
            : "text-surface-fg"
        )}
      >
        {value}
      </p>

      <p className="mt-1 text-xs text-surface-muted">
        {description}
      </p>
    </div>
  );
}

/* ============================================================
   ATTENDANCE ROW
============================================================ */

function AttendanceRow({ member }) {
  const attendance = getAttendance(member.id);

  return (
    <tr className="border-b border-surface-border last:border-b-0">
      {/* Member */}
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
              {member.role}
            </p>
          </div>
        </div>
      </td>

      {/* Department */}
      <td className="py-5 pr-5">
        <span className="text-sm text-surface-muted">
          {member.department || "—"}
        </span>
      </td>

      {/* Status */}
      <td className="py-5 pr-5">
        <AttendanceStatus status={attendance.status} />
      </td>

      {/* Check in */}
      <td className="py-5 pr-5">
        <div className="flex items-center gap-2">
          <Clock3 className="h-3.5 w-3.5 text-surface-muted" />

          <span className="text-sm font-medium text-surface-fg">
            {attendance.checkIn}
          </span>
        </div>
      </td>

      {/* Check out */}
      <td className="py-5 pr-5">
        <span className="text-sm text-surface-muted">
          {attendance.checkOut}
        </span>
      </td>

      {/* Hours */}
      <td className="py-5 pr-5">
        <span className="text-sm font-semibold text-surface-fg">
          {attendance.hours}
        </span>
      </td>

      {/* Work mode */}
      <td className="py-5 pr-5">
        <span className="text-xs font-medium text-surface-muted">
          {attendance.workMode}
        </span>
      </td>

      {/* Actions */}
      <td className="py-5 pr-6 text-right">
        <button
          type="button"
          className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-surface-muted transition hover:bg-surface-muted/10 hover:text-surface-fg"
        >
          <MoreHorizontal className="h-4 w-4" />
        </button>
      </td>
    </tr>
  );
}

/* ============================================================
   PAGE
============================================================ */

export default function AdminAttendance() {
  const [selectedDate, setSelectedDate] = useState(
    new Date()
  );

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  const filteredMembers = useMemo(() => {
    const query = search.toLowerCase();

    return teamMembers.filter((member) => {
      const attendance = getAttendance(member.id);

      const matchesSearch =
        member.name.toLowerCase().includes(query) ||
        member.role?.toLowerCase().includes(query) ||
        member.department?.toLowerCase().includes(query);

      const matchesFilter =
        filter === "all" ||
        attendance.status === filter;

      return matchesSearch && matchesFilter;
    });
  }, [search, filter]);

  const stats = useMemo(() => {
    const records = teamMembers.map((member) =>
      getAttendance(member.id)
    );

    return {
      total: teamMembers.length,

      present: records.filter(
        (item) =>
          item.status === "present" ||
          item.status === "remote"
      ).length,

      late: records.filter(
        (item) => item.status === "late"
      ).length,

      leave: records.filter(
        (item) => item.status === "leave"
      ).length,

      absent: records.filter(
        (item) => item.status === "absent"
      ).length,
    };
  }, []);

  function changeDate(days) {
    const nextDate = new Date(selectedDate);
    nextDate.setDate(nextDate.getDate() + days);
    setSelectedDate(nextDate);
  }

  return (
    <div className="mx-auto max-w-[1400px] animate-fade-up">
      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <div className="mb-2 flex items-center gap-2 text-[0.65rem] font-bold uppercase tracking-[0.16em] text-brand-orange">
            <CalendarDays className="h-3.5 w-3.5" />
            Administration
          </div>

          <h1 className="font-display text-display-md font-bold tracking-[-0.02em] text-surface-fg">
            Attendance
          </h1>

          <p className="mt-2 max-w-2xl text-lead text-surface-muted">
            Track team attendance, working hours, check-ins,
            and work location across OCT20FIVE.
          </p>
        </div>

        {/* Date Picker */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => changeDate(-1)}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-surface-border text-surface-muted transition hover:bg-surface-muted/10 hover:text-surface-fg"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>

          <button
            type="button"
            className="inline-flex h-10 items-center gap-2 rounded-xl border border-surface-border bg-surface-card px-4 text-sm font-semibold text-surface-fg"
          >
            <CalendarDays className="h-4 w-4 text-brand-orange" />

            {formatShortDate(selectedDate)}
          </button>

          <button
            type="button"
            onClick={() => changeDate(1)}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-surface-border text-surface-muted transition hover:bg-surface-muted/10 hover:text-surface-fg"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* =====================================================
          DATE BANNER
      ===================================================== */}

      <section className="mb-8 rounded-2xl border border-surface-border bg-surface-card px-6 py-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-brand-orange">
              Attendance for
            </p>

            <h2 className="mt-1 font-display text-xl font-bold text-surface-fg">
              {formatDate(selectedDate)}
            </h2>
          </div>

          <div className="flex items-center gap-2 text-xs text-surface-muted">
            <Users className="h-4 w-4" />

            {stats.total} team members
          </div>
        </div>
      </section>

      {/* =====================================================
          STATS
      ===================================================== */}

      <div className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <StatCard
          icon={Users}
          label="Team"
          value={stats.total}
          description="Total team members"
        />

        <StatCard
          icon={UserCheck}
          label="Present"
          value={stats.present}
          description="Working today"
        />

        <StatCard
          icon={Clock3}
          label="Late"
          value={stats.late}
          description="Checked in late"
          warning={stats.late > 0}
        />

        <StatCard
          icon={Coffee}
          label="On Leave"
          value={stats.leave}
          description="Approved leave"
        />

        <StatCard
          icon={UserX}
          label="Absent"
          value={stats.absent}
          description="Not present"
        />
      </div>

      {/* =====================================================
          ATTENDANCE SUMMARY
      ===================================================== */}

      <section className="brand-card mb-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-surface-muted">
              Daily Attendance
            </p>

            <h2 className="mt-1 font-display text-xl font-bold text-surface-fg">
              Team attendance overview
            </h2>
          </div>

          <span className="text-xs font-medium text-surface-muted">
            {stats.present} of {stats.total} working
          </span>
        </div>

        <div className="mt-5 h-3 overflow-hidden rounded-full bg-surface-border">
          <div
            className="h-full rounded-full bg-brand-orange transition-all duration-500"
            style={{
              width: `${
                stats.total
                  ? (stats.present / stats.total) * 100
                  : 0
              }%`,
            }}
          />
        </div>

        <div className="mt-4 flex flex-wrap gap-5 text-xs">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            <span className="text-surface-muted">
              Present {stats.present}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-brand-orange" />
            <span className="text-surface-muted">
              Late {stats.late}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-purple-500" />
            <span className="text-surface-muted">
              Leave {stats.leave}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-red-500" />
            <span className="text-surface-muted">
              Absent {stats.absent}
            </span>
          </div>
        </div>
      </section>

      {/* =====================================================
          TEAM ATTENDANCE
      ===================================================== */}

      <section>
        <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h2 className="font-display text-lg font-bold text-surface-fg">
              Team Attendance
            </h2>

            <p className="mt-1 text-sm text-surface-muted">
              Individual attendance and working hours for the
              selected date.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            {/* Search */}
            <div className="relative w-full sm:w-[260px]">
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

            {/* Filter */}
            <select
              value={filter}
              onChange={(event) =>
                setFilter(event.target.value)
              }
              className="brand-input min-w-[150px]"
            >
              <option value="all">All Status</option>
              <option value="present">Present</option>
              <option value="late">Late</option>
              <option value="remote">Remote</option>
              <option value="leave">On Leave</option>
              <option value="absent">Absent</option>
            </select>
          </div>
        </div>

        {filteredMembers.length === 0 ? (
          <EmptyState
            title="No Attendance Records Found"
            description="Try changing your search or attendance filter."
          />
        ) : (
          <div className="brand-card overflow-x-auto p-0">
            <table className="w-full min-w-[1100px] border-collapse">
              <thead>
                <tr className="border-b border-surface-border text-left text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-surface-muted">
                  <th className="px-6 py-4">
                    Team Member
                  </th>

                  <th className="py-4 pr-5">
                    Department
                  </th>

                  <th className="py-4 pr-5">
                    Status
                  </th>

                  <th className="py-4 pr-5">
                    Check In
                  </th>

                  <th className="py-4 pr-5">
                    Check Out
                  </th>

                  <th className="py-4 pr-5">
                    Hours
                  </th>

                  <th className="py-4 pr-5">
                    Work Mode
                  </th>

                  <th className="py-4 pr-6" />
                </tr>
              </thead>

              <tbody>
                {filteredMembers.map((member) => (
                  <AttendanceRow
                    key={member.id}
                    member={member}
                  />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* =====================================================
          FOOTNOTE
      ===================================================== */}

      <div className="mt-6 flex items-center gap-2 text-xs text-surface-muted">
        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />

        Attendance records are shown for the selected date.
      </div>
    </div>
  );
}