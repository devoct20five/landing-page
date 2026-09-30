import { http } from "./http";

/** @param {{projectId?, clientId?, actorId?, activityType?, from?, to?, page?, limit?}} params */
export const listActivity = (params) => http.list("/activity", params);

/** Grouped by calendar day — for the dashboard "recent activity" widgets. */
export const getActivityFeed = (params) => http.get("/activity/feed", params);

/**
 * Manual write path. Prefer letting the backend log activity inside the
 * mutation that caused it rather than posting from the UI.
 */
export const logActivity = (payload) => http.post("/activity", payload);
