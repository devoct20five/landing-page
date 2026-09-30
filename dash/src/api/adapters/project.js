/**
 * Project adapter.
 *
 * `06_BACKEND_ALIGNMENT.md` §13 asks for one normalisation point rather than
 * `project.progressPercent ?? project.progress` sprinkled through components.
 * This is that point: API project -> the shape the existing project cards,
 * rows and tables already expect.
 *
 * Note what the LIST endpoint includes: client and services only. Deliverables
 * and team members are not included unless the staffId filter is applied, so
 * deliverable counts come back null on list responses and the components have
 * to tolerate that rather than render a fake 0/0.
 */

export function formatDate(value) {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return date.toLocaleDateString(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function relativeTime(value) {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;

  const minutes = Math.round((Date.now() - date.getTime()) / 60000);
  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes} min ago`;

  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours} ${hours === 1 ? "hour" : "hours"} ago`;
  if (hours < 48) return "Yesterday";

  const days = Math.round(hours / 24);
  if (days < 7) return `${days} days ago`;

  return formatDate(value);
}

const COMPLETED_DELIVERABLE_STATUSES = new Set(["approved", "delivered"]);

function initialsFor(user) {
  if (!user) return "?";
  if (user.initials) return user.initials;
  return [user.firstName, user.lastName]
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

export function adaptTeamMember(user) {
  if (!user) return null;
  return {
    id: user.id,
    name: [user.firstName, user.lastName].filter(Boolean).join(" ") || user.email,
    initials: initialsFor(user),
    role: user.role?.name ?? user.roleSlug ?? null,
    avatarUrl: user.avatarUrl ?? null,
  };
}

export function adaptDeliverable(raw) {
  if (!raw) return null;
  return {
    id: raw.id,
    projectId: raw.projectId,
    serviceId: raw.serviceId ?? null,
    serviceName: raw.service?.name ?? null,
    title: raw.title,
    status: raw.status,
    dueDate: formatDate(raw.dueDate),
    dueDateISO: raw.dueDate ?? null,
    raw,
  };
}

export function adaptProject(raw) {
  if (!raw) return null;

  const services = (raw.services ?? []).map((service) =>
    typeof service === "string" ? service : service?.name,
  ).filter(Boolean);

  const deliverables = raw.deliverables ? raw.deliverables.map(adaptDeliverable) : null;
  const teamMembers = (raw.teamMembers ?? []).map(adaptTeamMember);

  return {
    id: raw.id,
    name: raw.name,
    description: raw.description ?? "",

    clientId: raw.clientId ?? raw.client?.id ?? null,
    clientName: raw.client?.name ?? raw.client?.shortName ?? "—",

    services,

    /** Components use `progress`; the model calls it progressPercent. */
    progress: raw.progressPercent ?? 0,
    status: raw.status,

    teamSize: raw.teamSize ?? teamMembers.length,
    teamMembers,

    attentionReason: raw.attentionReason ?? null,

    currentWork: {
      title: raw.currentWorkTitle ?? null,
      service: raw.currentWorkService?.name ?? null,
      description: raw.currentWorkDescription ?? null,
    },

    /** null (not 0) when the endpoint didn't include deliverables. */
    deliverables,
    totalDeliverables: deliverables ? deliverables.length : null,
    completedDeliverables: deliverables
      ? deliverables.filter((item) => COMPLETED_DELIVERABLE_STATUSES.has(item.status)).length
      : null,

    deadline: formatDate(raw.deadline) ?? "No deadline",
    deadlineISO: raw.deadline ?? null,

    updatedAt: relativeTime(raw.updatedAt ?? raw.updated_at) ?? "—",
    updatedAtISO: raw.updatedAt ?? raw.updated_at ?? null,

    /** Escape hatch for anything not mapped above. */
    raw,
  };
}

/** True for the UI's "At Risk" bucket, which isn't a backend status. */
export function isAtRisk(project) {
  return project.status === "blocked" || Boolean(project.attentionReason);
}
