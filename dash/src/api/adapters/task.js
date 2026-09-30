/**
 * Task adapter. The model is camelCase already, so this mostly resolves
 * relations (assignee, project, client) into display-ready fields rather than
 * renaming attributes.
 */
import { formatDate } from "./project";

export function adaptTask(raw) {
  if (!raw) return null;

  const assignee = raw.assignee
    ? {
        id: raw.assignee.id,
        name: [raw.assignee.firstName, raw.assignee.lastName].filter(Boolean).join(" "),
        initials:
          raw.assignee.initials ??
          [raw.assignee.firstName, raw.assignee.lastName]
            .filter(Boolean)
            .map((p) => p[0])
            .join("")
            .toUpperCase(),
      }
    : null;

  return {
    id: raw.id,
    title: raw.title,
    description: raw.description ?? "",
    projectId: raw.projectId,
    projectName: raw.project?.name ?? null,
    clientId: raw.clientId,
    clientName: raw.client?.name ?? null,
    serviceName: raw.service?.name ?? null,
    status: raw.status,
    priority: raw.priority,
    assignee,
    dueDate: formatDate(raw.dueDate),
    dueDateISO: raw.dueDate ?? null,
    isOverdue:
      raw.dueDate && raw.status !== "completed" && raw.status !== "cancelled"
        ? new Date(raw.dueDate) < new Date(new Date().toDateString())
        : false,
    commentCount: raw.commentCount ?? raw.comments?.length ?? 0,
    raw,
  };
}
