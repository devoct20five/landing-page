import { http } from "./http";

/**
 * @param {{projectId?, clientId?, assigneeId?, status?, priority?,
 *          dueLabel?: 'due-today'|'overdue', search?, page?, limit?}} params
 */
export const listTasks = (params) => http.list("/tasks", params);

export const getTask = (id) => http.get(`/tasks/${id}`);
export const createTask = (payload) => http.post("/tasks", payload);
export const updateTask = (id, payload) => http.patch(`/tasks/${id}`, payload);

/** Dedicated status transition endpoint — prefer this over updateTask. */
export const updateTaskStatus = (id, status) =>
  http.patch(`/tasks/${id}/status`, { status });

export const deleteTask = (id) => http.delete(`/tasks/${id}`);

export const listTaskComments = (id) => http.get(`/tasks/${id}/comments`);
export const createTaskComment = (id, payload) =>
  http.post(`/tasks/${id}/comments`, payload);
