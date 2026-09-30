/**
 * Single import surface for the API layer.
 *
 *   import { projectsApi, ApiError } from "@/api";
 *   const { items, meta } = await projectsApi.listProjects({ page: 1 });
 *
 * Every list call resolves to { items, meta: { total, page, limit, totalPages } }
 * regardless of which of the three shapes the backend actually returned.
 */

export { ApiError, http, request, getToken, setToken, clearToken, saveBlob, AUTH_EXPIRED_EVENT, BASE_URL } from "./http";
export * from "./enums";

export * as authApi from "./auth.api";
export * as usersApi from "./users.api";
export * as projectsApi from "./projects.api";
export * as tasksApi from "./tasks.api";
export * as approvalsApi from "./approvals.api";
export * as filesApi from "./files.api";
export * as clientsApi from "./clients.api";
export * as invoicesApi from "./invoices.api";
export * as paymentsApi from "./payments.api";
export * as queriesApi from "./queries.api";
export * as notificationsApi from "./notifications.api";
export * as activityApi from "./activity.api";
export * as staffApi from "./staff.api";
export * as attendanceApi from "./attendance.api";
export * as servicesApi from "./services.api";
export * as eventsApi from "./events.api";
