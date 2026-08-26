import { useMemo, useState } from "react";
import {
  CalendarDays,
  CheckCircle2,
  Clock3,
  LogIn,
  LogOut,
  Coffee,
  UserCheck,
  UserX,
  MapPin,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import { currentStaff } from "@/data/mockData";
import { cn } from "@/lib/utils";

/* ============================================================
   MOCK ATTENDANCE
   Replace this with authenticated user's attendance API later.
============================================================ */

const attendanceRecords = [
  {
    id: "att-001",
    staffId: currentStaff.id,
    date: "15 Aug 2026",
    day: "Saturday",
    status: "present",
    checkIn: "09:18 AM",
    checkOut: null,
    hours: "8h 42m",
    workMode: "Office",
  },
  {
    id: "att-002",
    staffId: currentStaff.id,
    date: "14 Aug 2026",
    day: "Friday",
    status: "present",
    checkIn: "09:11 AM",
    checkOut: "06:21 PM",
    hours: "9h 10m",
    workMode: "Office",
  },
  {
    id: "att-003",
    staffId: currentStaff.id,
    date: "13 Aug 2026",
    day: "Thursday",
    status: "late",
    checkIn: "10:04 AM",
    checkOut: "06:30 PM",
    hours: "8h 26m",
    workMode: "Office",
  },
  {
    id: "att-004",
    staffId: currentStaff.id,
    date: "12 Aug 2026",
    day: "Wednesday",
    status: "present",
    checkIn: "09:06 AM",
    checkOut: "06:14 PM",
    hours: "9h 08m",
    workMode: "Office",
  },
  {
    id: "att-005",
    staffId: currentStaff.id,
    date: "11 Aug 2026",
    day: "Tuesday",
    status: "remote",
    checkIn: "09:02 AM",
    checkOut: "05:55 PM",
    hours: "8h 53m",
    workMode: "Remote",
  },
  {
    id: "att-006",
    staffId: currentStaff.id,
    date: "10 Aug 2026",
    day: "Monday",
    status: "present",
    checkIn: "09:16 AM",
    checkOut: "06:08 PM",
    hours: "8h 52m",
    workMode: "Office",
  },
  {
    id: "att-007",
    staffId: currentStaff.id,
    date: "08 Aug 2026",
    day: "Saturday",
    status: "leave",
    checkIn: null,
    checkOut: null,
    hours: "—",
    workMode: "—",
  },
  {
    id: "att-008",
    staffId: currentStaff.id,
    date: "07 Aug 2026",
    day: "Friday",
    status: "present",
    checkIn: "09:09 AM",
    checkOut: "06:17 PM",
    hours: "9h 08m",
    workMode: "Office",
  },
];

/* ============================================================
   STATUS CONFIG
============================================================ */

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

/* ============================================================
   ATTENDANCE ROW
============================================================ */

function AttendanceRow({ record }) {
  return (
    <div className="grid gap-4 border-b border-surface-border px-6 py-5 last:border-b-0 lg:grid-cols-[1.4fr_1fr_1fr_1fr_0.8fr] lg:items-center">
      {/* Date */}
      <div>
        <p className="text-sm font-bold text-surface-fg">
          {record.date}
        </p>

        <p className="mt-0.5 text-xs text-surface-muted">
          {record.day}
        </p>
      </div>

      {/* Status */}
      <div>
        <AttendanceStatus status={record.status} />
      </div>

      {/* Check in */}
      <div>
        <p className="text-[0.65rem] font-semibold uppercase tracking-[0.08em] text-surface-muted">
          Check In
        </p>

        <div className="mt-1 flex items-center gap-1.5">
          <LogIn className="h-3.5 w-3.5 text-emerald-600" />

          <span className="text-sm font-medium text-surface-fg">
            {record.checkIn || "—"}
          </span>
        </div>
      </div>

      {/* Check out */}
      <div>
        <p className="text-[0.65rem] font-semibold uppercase tracking-[0.08em] text-surface-muted">
          Check Out
        </p>

        <div className="mt-1 flex items-center gap-1.5">
          <LogOut className="h-3.5 w-3.5 text-surface-muted" />

          <span className="text-sm font-medium text-surface-fg">
            {record.checkOut || "—"}
          </span>
        </div>
      </div>

      {/* Hours */}
      <div>
        <p className="text-[0.65rem] font-semibold uppercase tracking-[0.08em] text-surface-muted">
          Hours
        </p>

        <p className="mt-1 text-sm font-bold text-surface-fg">
          {record.hours}
        </p>

        <p className="mt-0.5 text-[0.65rem] text-surface-muted">
          {record.workMode}
        </p>
      </div>
    </div>
  );
}

/* ============================================================
   PAGE
============================================================ */

export default function StaffAttendance() {
  const [selectedMonth, setSelectedMonth] = useState(
    "August 2026"
  );

  const currentAttendance =
    attendanceRecords[0];

  const monthlyStats = useMemo(() => {
    return {
      present: attendanceRecords.filter(
        (record) =>
          record.status === "present" ||
          record.status === "remote"
      ).length,

      late: attendanceRecords.filter(
        (record) => record.status === "late"
      ).length,

      leave: attendanceRecords.filter(
        (record) => record.status === "leave"
      ).length,

      absent: attendanceRecords.filter(
        (record) => record.status === "absent"
      ).length,
    };
  }, []);

  function changeMonth(direction) {
    setSelectedMonth(
      direction > 0
        ? "September 2026"
        : "July 2026"
    );
  }

  return (
    <div className="mx-auto max-w-[1180px] animate-fade-up">
      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <div className="mb-2 flex items-center gap-2 text-[0.65rem] font-bold uppercase tracking-[0.16em] text-brand-orange">
            <CalendarDays className="h-3.5 w-3.5" />
            My Attendance
          </div>

          <h1 className="font-display text-display-md font-bold tracking-[-0.02em] text-surface-fg">
            Attendance
          </h1>

          <p className="mt-2 max-w-2xl text-lead text-surface-muted">
            View your attendance, working hours, check-ins,
            and monthly attendance history.
          </p>
        </div>

        {/* Month selector */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => changeMonth(-1)}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-surface-border text-surface-muted transition hover:bg-surface-muted/10 hover:text-surface-fg"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>

          <div className="flex h-10 items-center gap-2 rounded-xl border border-surface-border bg-surface-card px-4">
            <CalendarDays className="h-4 w-4 text-brand-orange" />

            <span className="text-sm font-semibold text-surface-fg">
              {selectedMonth}
            </span>
          </div>

          <button
            type="button"
            onClick={() => changeMonth(1)}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-surface-border text-surface-muted transition hover:bg-surface-muted/10 hover:text-surface-fg"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* =====================================================
          TODAY
      ===================================================== */}

      <section className="mb-8 rounded-2xl border border-surface-border bg-surface-card">
        <div className="border-b border-surface-border px-6 py-5">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-brand-orange">
            Today
          </p>

          <h2 className="mt-1 font-display text-xl font-bold text-surface-fg">
            Your attendance
          </h2>
        </div>

        <div className="grid divide-y divide-surface-border sm:grid-cols-2 sm:divide-x sm:divide-y-0 lg:grid-cols-4">
          {/* Status */}
          <div className="px-6 py-6">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />

              <span className="text-xs font-semibold uppercase tracking-[0.08em] text-surface-muted">
                Status
              </span>
            </div>

            <div className="mt-3">
              <AttendanceStatus
                status={currentAttendance.status}
              />
            </div>
          </div>

          {/* Check In */}
          <div className="px-6 py-6">
            <div className="flex items-center gap-2">
              <LogIn className="h-4 w-4 text-emerald-600" />

              <span className="text-xs font-semibold uppercase tracking-[0.08em] text-surface-muted">
                Check In
              </span>
            </div>

            <p className="mt-2 font-display text-2xl font-bold text-surface-fg">
              {currentAttendance.checkIn || "—"}
            </p>
          </div>

          {/* Check Out */}
          <div className="px-6 py-6">
            <div className="flex items-center gap-2">
              <LogOut className="h-4 w-4 text-surface-muted" />

              <span className="text-xs font-semibold uppercase tracking-[0.08em] text-surface-muted">
                Check Out
              </span>
            </div>

            <p className="mt-2 font-display text-2xl font-bold text-surface-fg">
              {currentAttendance.checkOut || "Working"}
            </p>
          </div>

          {/* Hours */}
          <div className="px-6 py-6">
            <div className="flex items-center gap-2">
              <Clock3 className="h-4 w-4 text-brand-orange" />

              <span className="text-xs font-semibold uppercase tracking-[0.08em] text-surface-muted">
                Hours
              </span>
            </div>

            <p className="mt-2 font-display text-2xl font-bold text-surface-fg">
              {currentAttendance.hours}
            </p>

            <div className="mt-1 flex items-center gap-1.5 text-xs text-surface-muted">
              <MapPin className="h-3 w-3" />

              {currentAttendance.workMode}
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          MONTHLY STATS
      ===================================================== */}

      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={UserCheck}
          label="Present"
          value={monthlyStats.present}
          description="Days worked"
        />

        <StatCard
          icon={Clock3}
          label="Late"
          value={monthlyStats.late}
          description="Late arrivals"
        />

        <StatCard
          icon={Coffee}
          label="Leave"
          value={monthlyStats.leave}
          description="Days on leave"
        />

        <StatCard
          icon={UserX}
          label="Absent"
          value={monthlyStats.absent}
          description="Absent days"
        />
      </div>

      {/* =====================================================
          MONTHLY ATTENDANCE
      ===================================================== */}

      <section className="brand-card overflow-hidden p-0">
        <div className="border-b border-surface-border px-6 py-5">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-surface-muted">
            Attendance History
          </p>

          <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="font-display text-xl font-bold text-surface-fg">
              {selectedMonth}
            </h2>

            <span className="text-xs text-surface-muted">
              {attendanceRecords.length} recorded days
            </span>
          </div>
        </div>

        {/* Desktop headings */}
        <div className="hidden grid-cols-[1.4fr_1fr_1fr_1fr_0.8fr] border-b border-surface-border bg-surface-bg px-6 py-3 text-[0.65rem] font-semibold uppercase tracking-[0.12em] text-surface-muted lg:grid">
          <span>Date</span>
          <span>Status</span>
          <span>Check In</span>
          <span>Check Out</span>
          <span>Hours</span>
        </div>

        <div>
          {attendanceRecords.map((record) => (
            <AttendanceRow
              key={record.id}
              record={record}
            />
          ))}
        </div>
      </section>

      {/* =====================================================
          INFO
      ===================================================== */}

      <div className="mt-6 flex items-start gap-3 rounded-xl border border-surface-border bg-surface-card px-5 py-4">
        <Clock3 className="mt-0.5 h-4 w-4 shrink-0 text-surface-muted" />

        <p className="text-xs leading-5 text-surface-muted">
          Attendance records are maintained by OCT20FIVE.
          If you notice an incorrect check-in, check-out,
          leave status, or work mode, please contact your
          manager or administrator.
        </p>
      </div>
    </div>
  );
}