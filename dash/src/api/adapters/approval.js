import { relativeTime } from "./project";

export function adaptApproval(raw) {
  if (!raw) return null;
  return {
    id: raw.id,
    title: raw.title,
    version: raw.version,
    status: raw.status,
    feedback: raw.feedback ?? null,
    projectId: raw.projectId,
    projectName: raw.project?.name ?? null,
    clientId: raw.clientId,
    clientName: raw.client?.name ?? null,
    deliverableId: raw.deliverableId ?? null,
    deliverableTitle: raw.deliverable?.title ?? null,
    requesterName: raw.requester
      ? [raw.requester.firstName, raw.requester.lastName].filter(Boolean).join(" ")
      : null,
    requestedAt: raw.requestedAt,
    waitingSince: raw.status === "pending" ? relativeTime(raw.requestedAt) : null,
    reviewedAt: raw.reviewedAt ?? null,
    raw,
  };
}
