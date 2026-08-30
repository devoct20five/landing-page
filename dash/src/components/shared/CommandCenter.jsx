import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  FolderKanban,
  Users,
  CheckSquare,
  CheckCircle2,
  ArrowUpRight,
  Command,
} from "lucide-react";

import { projects, clients, teamMembers, tasks, approvals } from "@/data/mockData";

import { cn } from "@/lib/utils";

const TYPE_CONFIG = {
  project: {
    label: "Projects",
    icon: FolderKanban,
  },
  client: {
    label: "Clients",
    icon: Users,
  },
  member: {
    label: "Team",
    icon: Users,
  },
  task: {
    label: "Tasks",
    icon: CheckSquare,
  },
  approval: {
    label: "Approvals",
    icon: CheckCircle2,
  },
};

function normalize(value) {
  return String(value || "").toLowerCase();
}

function buildResults(query) {
  const search = normalize(query).trim();

  if (!search) {
    return [];
  }

  const results = [];

  projects.forEach((project) => {
    const haystack = [project.name, project.description, project.clientName, project.status]
      .map(normalize)
      .join(" ");

    if (haystack.includes(search)) {
      results.push({
        id: `project-${project.id}`,
        type: "project",
        title: project.name,
        description: project.clientName || "Project",
        meta: project.status,
        href: `/admin/projects/${project.id}`,
      });
    }
  });

  clients.forEach((client) => {
    const haystack = [client.name, client.shortName, client.email].map(normalize).join(" ");

    if (haystack.includes(search)) {
      results.push({
        id: `client-${client.id}`,
        type: "client",
        title: client.name,
        description: client.shortName || "Client",
        href: `/admin/clients/${client.id}`,
      });
    }
  });

  teamMembers.forEach((member) => {
    const haystack = [member.name, member.email, member.role, member.department]
      .map(normalize)
      .join(" ");

    if (haystack.includes(search)) {
      results.push({
        id: `member-${member.id}`,
        type: "member",
        title: member.name,
        description: member.email || member.role,
        meta: member.role,
        href: `/admin/team`,
      });
    }
  });

  tasks.forEach((task) => {
    const haystack = [task.title, task.description, task.status, task.clientName]
      .map(normalize)
      .join(" ");

    if (haystack.includes(search)) {
      results.push({
        id: `task-${task.id}`,
        type: "task",
        title: task.title,
        description: task.description || "Task",
        meta: task.status,
        href: `/admin/tasks/${task.id}`,
      });
    }
  });

  approvals.forEach((approval) => {
    const haystack = [approval.title, approval.description, approval.status, approval.clientName]
      .map(normalize)
      .join(" ");

    if (haystack.includes(search)) {
      results.push({
        id: `approval-${approval.id}`,
        type: "approval",
        title: approval.title,
        description: approval.description || "Approval",
        meta: approval.status,
        href: `/admin/approvals/${approval.id}`,
      });
    }
  });

  return results.slice(0, 12);
}

function ResultItem({ result, active, onSelect }) {
  const config = TYPE_CONFIG[result.type];
  const Icon = config.icon;

  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        "flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition",
        active ? "bg-brand-orange/10" : "hover:bg-surface-muted/10"
      )}
    >
      <div
        className={cn(
          "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg",
          active ? "bg-brand-orange/15 text-brand-orange" : "bg-surface-muted/10 text-surface-muted"
        )}
      >
        <Icon className="h-4 w-4" />
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p className="truncate text-sm font-semibold text-surface-fg">{result.title}</p>

          {result.meta && (
            <span className="shrink-0 rounded-full bg-surface-muted/10 px-2 py-0.5 text-[0.6rem] font-semibold text-surface-muted">
              {result.meta}
            </span>
          )}
        </div>

        <p className="mt-0.5 truncate text-xs text-surface-muted">{result.description}</p>
      </div>

      <ArrowUpRight
        className={cn("h-4 w-4 shrink-0", active ? "text-brand-orange" : "text-surface-muted")}
      />
    </button>
  );
}

export default function CommandCenter({ open, onOpenChange }) {
  const navigate = useNavigate();

  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);

  const inputRef = useRef(null);

  const results = useMemo(() => buildResults(query), [query]);

  const groupedResults = useMemo(() => {
    return results.reduce((groups, result) => {
      if (!groups[result.type]) {
        groups[result.type] = [];
      }

      groups[result.type].push(result);

      return groups;
    }, {});
  }, [results]);

  useEffect(() => {
    if (!open) return;

    setQuery("");
    setActiveIndex(0);

    requestAnimationFrame(() => {
      inputRef.current?.focus();
    });
  }, [open]);

  useEffect(() => {
    if (!open) return;

    function handleKeyDown(event) {
      if (event.key === "Escape") {
        event.preventDefault();
        onOpenChange(false);
        return;
      }

      if (!results.length) return;

      if (event.key === "ArrowDown") {
        event.preventDefault();

        setActiveIndex((current) => (current < results.length - 1 ? current + 1 : 0));
      }

      if (event.key === "ArrowUp") {
        event.preventDefault();

        setActiveIndex((current) => (current > 0 ? current - 1 : results.length - 1));
      }

      if (event.key === "Enter") {
        event.preventDefault();

        const result = results[activeIndex];

        if (result) {
          navigate(result.href);
          onOpenChange(false);
        }
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, results, activeIndex, navigate, onOpenChange]);

  if (!open) {
    return null;
  }

  let resultCounter = 0;

  return (
    <div className="fixed inset-0 z-[100]">
      {/* Backdrop */}
      <button
        type="button"
        aria-label="Close command center"
        onClick={() => onOpenChange(false)}
        className="absolute inset-0 bg-black/20 backdrop-blur-[2px]"
      />

      {/* Command window */}
      <div className="relative mx-auto mt-[10vh] w-[calc(100%-2rem)] max-w-[680px] overflow-hidden rounded-2xl border border-surface-border bg-surface-bg shadow-[0_30px_100px_-20px_rgba(0,0,0,0.3)]">
        {/* Search */}
        <div className="flex items-center gap-3 border-b border-surface-border px-4">
          <Search className="h-5 w-5 shrink-0 text-brand-orange" />

          <input
            ref={inputRef}
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setActiveIndex(0);
            }}
            placeholder="Search projects, clients, team, tasks..."
            className="h-14 min-w-0 flex-1 bg-transparent text-sm text-surface-fg outline-none placeholder:text-surface-muted"
          />

          <kbd className="hidden items-center gap-1 rounded-md border border-surface-border bg-surface-muted/5 px-2 py-1 text-[0.65rem] font-semibold text-surface-muted sm:flex">
            ESC
          </kbd>
        </div>

        {/* Results */}
        <div className="max-h-[60vh] overflow-y-auto p-3">
          {!query.trim() ? (
            <div className="py-10 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-brand-orange/10 text-brand-orange">
                <Command className="h-5 w-5" />
              </div>

              <p className="mt-4 text-sm font-semibold text-surface-fg">Command Center</p>

              <p className="mt-1 text-xs text-surface-muted">
                Search anything across your administration workspace.
              </p>

              <div className="mt-5 flex flex-wrap justify-center gap-2">
                {["Projects", "Clients", "Team", "Tasks", "Approvals"].map((item) => (
                  <span
                    key={item}
                    className="rounded-full bg-surface-muted/10 px-3 py-1.5 text-[0.65rem] font-semibold text-surface-muted"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          ) : results.length === 0 ? (
            <div className="py-12 text-center">
              <Search className="mx-auto h-6 w-6 text-surface-muted" />

              <p className="mt-3 text-sm font-semibold text-surface-fg">No results found</p>

              <p className="mt-1 text-xs text-surface-muted">
                Try searching for a project, client, person, task or approval.
              </p>
            </div>
          ) : (
            Object.entries(groupedResults).map(([type, typeResults]) => {
              const config = TYPE_CONFIG[type];

              return (
                <div key={type} className="mb-4 last:mb-0">
                  <div className="px-3 pb-2 pt-1">
                    <p className="text-[0.6rem] font-bold uppercase tracking-[0.14em] text-surface-muted">
                      {config.label}
                    </p>
                  </div>

                  <div className="space-y-0.5">
                    {typeResults.map((result) => {
                      const index = resultCounter++;

                      return (
                        <ResultItem
                          key={result.id}
                          result={result}
                          active={index === activeIndex}
                          onSelect={() => {
                            navigate(result.href);
                            onOpenChange(false);
                          }}
                        />
                      );
                    })}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        {results.length > 0 && (
          <div className="flex items-center justify-between border-t border-surface-border px-4 py-3">
            <div className="flex items-center gap-3 text-[0.65rem] text-surface-muted">
              <span className="flex items-center gap-1">
                <kbd className="rounded border border-surface-border px-1.5 py-0.5">↑</kbd>
                <kbd className="rounded border border-surface-border px-1.5 py-0.5">↓</kbd>
                Navigate
              </span>

              <span className="hidden sm:flex items-center gap-1">
                <kbd className="rounded border border-surface-border px-1.5 py-0.5">Enter</kbd>
                Open
              </span>
            </div>

            <span className="text-[0.65rem] text-surface-muted">
              {results.length} result
              {results.length !== 1 ? "s" : ""}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
