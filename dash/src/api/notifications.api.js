import { http } from "./http";

/**
 * The notification model is one of the places where the backend uses snake_case
 * attribute names (`is_read`, `link_url`, `created_at`) while most other models
 * use camelCase. Normalising here means no component ever has to write
 * `n.is_read ?? n.isRead`.
 */
export function adaptNotification(raw) {
  if (!raw) return null;
  return {
    id: raw.id,
    userId: raw.user_id ?? raw.userId ?? null,
    title: raw.title,
    message: raw.message,
    /** Click-through destination. Null means the notification isn't actionable. */
    linkUrl: raw.link_url ?? raw.linkUrl ?? null,
    isRead: Boolean(raw.is_read ?? raw.isRead),
    createdAt: raw.created_at ?? raw.createdAt ?? null,
  };
}

/** @param {{unread?: boolean, page?: number, limit?: number}} params */
export async function listNotifications(params) {
  const { items, meta } = await http.list("/notifications", params);
  return { items: items.map(adaptNotification), meta };
}

/**
 * GET /notifications/unread-count
 * Returns a plain number regardless of whether the backend wraps it.
 */
export async function getUnreadCount() {
  const result = await http.get("/notifications/unread-count");
  if (typeof result === "number") return result;
  return result?.count ?? result?.unread ?? result?.unreadCount ?? 0;
}

export const markRead = (id) => http.patch(`/notifications/${id}/read`);
export const markAllRead = () => http.patch("/notifications/read-all");
export const deleteNotification = (id) => http.delete(`/notifications/${id}`);

/** System/admin write path. */
export const createNotification = (payload) => http.post("/notifications", payload);
