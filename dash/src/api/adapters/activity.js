import { relativeTime } from "./project";

/** Maps the backend's activityType to the icon key ActivityItem already knows. */
const TYPE_TO_ICON = {
  status: "status",
  approval: "approval",
  upload: "upload",
  task: "status",
  comment: "status",
  payment: "approval",
  attendance: "status",
  other: "status",
};

/** Adapts one activity_log row to the shape ActivityItem/ActivityList expect. */
export function adaptActivity(raw) {
  if (!raw) return null;
  return {
    id: raw.id,
    type: TYPE_TO_ICON[raw.activityType] ?? "status",
    text: raw.description,
    timestamp: relativeTime(raw.createdAt) ?? "—",
    actorName: raw.actor
      ? [raw.actor.firstName, raw.actor.lastName].filter(Boolean).join(" ")
      : null,
    createdAt: raw.createdAt,
    raw,
  };
}
