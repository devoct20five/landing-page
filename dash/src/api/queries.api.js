import { http } from "./http";

/** @param {{status?, priority?, clientId?, projectId?, assigneeId?, search?, page?, limit?}} params */
export const listQueries = (params) => http.list("/queries", params);

export const getAvgResponseTime = () =>
  http.get("/queries/stats/avg-response-time");

export const getQuery = (id) => http.get(`/queries/${id}`);
export const createQuery = (payload) => http.post("/queries", payload);
export const updateQuery = (id, payload) => http.patch(`/queries/${id}`, payload);
export const assignQuery = (id, payload) =>
  http.patch(`/queries/${id}/assign`, payload);
export const deleteQuery = (id) => http.delete(`/queries/${id}`);
