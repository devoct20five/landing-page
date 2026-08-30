import { useState } from "react";
import {
  Check,
  ChevronDown,
  Clock3,
  MessageSquare,
  MoreHorizontal,
  Pencil,
  RotateCcw,
  Trash2,
} from "lucide-react";

import { getProjectById, getClientById, getTeamMemberById } from "@/data/mockData";

import StatusBadge from "@/components/shared/StatusBadge";
import PriorityBadge from "@/components/shared/PriorityBadge";

const STATUS_OPTIONS = ["Todo", "In Progress", "Review", "Completed"];

const PRIORITY_OPTIONS = ["Low", "Medium", "High", "Urgent"];

export default function TaskRow({ task }) {
  const project = getProjectById(task.projectId);
  const client = getClientById(task.clientId);
  const assignee = getTeamMemberById(task.assigneeId);

  const [status, setStatus] = useState(task.status);
  const [priority, setPriority] = useState(task.priority);
  const [menuOpen, setMenuOpen] = useState(false);

  const isCompleted = status === "Completed";
  const isOverdue = task.dueLabel === "Overdue" && !isCompleted;

  const handleComplete = () => {
    setStatus(isCompleted ? "Todo" : "Completed");
  };

  return (
    <div
      className={[
        "group flex flex-col gap-4 border-b border-surface-border py-4",
        "last:border-b-0 sm:flex-row sm:items-center sm:justify-between",
        isCompleted ? "opacity-70" : "",
      ].join(" ")}
    >
      {/* Task Information */}
      <div className="flex min-w-0 flex-1 items-start gap-3">
        {/* Complete Button */}
        <button
          type="button"
          onClick={handleComplete}
          title={isCompleted ? "Reopen task" : "Mark as completed"}
          className={[
            "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full",
            "border transition",
            isCompleted
              ? "border-green-500 bg-green-500 text-white"
              : "border-surface-border text-transparent hover:border-brand-orange hover:text-brand-orange",
          ].join(" ")}
        >
          <Check size={12} strokeWidth={3} />
        </button>

        <div className="min-w-0">
          <p
            className={[
              "font-display text-sm font-bold text-surface-fg",
              isCompleted ? "line-through" : "",
            ].join(" ")}
          >
            {task.title}
          </p>

          <p className="mt-0.5 truncate text-xs text-surface-muted">
            {project?.name} · {client?.shortName} · {task.service}
          </p>

          {/* Optional metadata */}
          <div className="mt-2 flex flex-wrap items-center gap-3 text-[11px] text-surface-muted">
            {task.commentsCount !== undefined && (
              <span className="flex items-center gap-1">
                <MessageSquare size={12} />
                {task.commentsCount}
              </span>
            )}

            {task.estimatedHours !== undefined && (
              <span className="flex items-center gap-1">
                <Clock3 size={12} />
                {task.estimatedHours}h
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Actions / Metadata */}
      <div className="flex flex-wrap items-center gap-3 sm:gap-5">
        {/* Assignee */}
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-orange/10 text-[0.6rem] font-bold text-brand-orange">
            {assignee?.initials}
          </div>

          <span className="hidden text-xs text-surface-muted md:inline">{assignee?.name}</span>
        </div>

        {/* Priority */}
        <div className="relative">
          <button
            type="button"
            onClick={() => {
              const index = PRIORITY_OPTIONS.indexOf(priority);
              const next = PRIORITY_OPTIONS[(index + 1) % PRIORITY_OPTIONS.length];

              setPriority(next);
            }}
            title="Change priority"
            className="cursor-pointer"
          >
            <PriorityBadge priority={priority} />
          </button>
        </div>

        {/* Status */}
        <div className="relative">
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="cursor-pointer appearance-none bg-transparent pr-5 text-xs font-semibold outline-none"
            aria-label="Change task status"
          >
            {STATUS_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>

          <ChevronDown
            size={12}
            className="pointer-events-none absolute right-1 top-1/2 -translate-y-1/2 text-surface-muted"
          />
        </div>

        {/* Due Date */}
        <span
          className={[
            "shrink-0 text-xs font-semibold",
            isOverdue ? "text-red-600" : "text-surface-muted",
            isCompleted ? "line-through" : "",
          ].join(" ")}
        >
          {task.dueLabel}
        </span>

        {/* More Actions */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setMenuOpen((value) => !value)}
            className="flex h-8 w-8 items-center justify-center rounded-md text-surface-muted opacity-100 transition hover:bg-surface-muted/10 hover:text-surface-fg sm:opacity-0 sm:group-hover:opacity-100"
            aria-label="Task actions"
          >
            <MoreHorizontal size={17} />
          </button>

          {menuOpen && (
            <div className="absolute right-0 top-9 z-20 w-40 rounded-lg border border-surface-border bg-surface-card p-1 shadow-lg">
              <button
                type="button"
                className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-xs text-surface-fg hover:bg-surface-muted/10"
              >
                <Pencil size={13} />
                Edit task
              </button>

              <button
                type="button"
                onClick={handleComplete}
                className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-xs text-surface-fg hover:bg-surface-muted/10"
              >
                {isCompleted ? (
                  <>
                    <RotateCcw size={13} />
                    Reopen task
                  </>
                ) : (
                  <>
                    <Check size={13} />
                    Complete task
                  </>
                )}
              </button>

              <button
                type="button"
                className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-xs text-red-600 hover:bg-red-50"
              >
                <Trash2 size={13} />
                Delete task
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
