import { http } from "./http";

/** @param {{search?, status?, clientId?, staffId?, page?, limit?}} params */
export const listProjects = (params) => http.list("/projects", params);

/** Projects flagged with an attentionReason — drives the admin attention queue. */
export const listProjectsNeedingAttention = () => http.get("/projects/attention");

/** Aggregated dashboard payload for one client. */
export const getClientProjectDashboard = (clientId) =>
  http.get(`/projects/dashboard/${clientId}`);

export const getProject = (id) => http.get(`/projects/${id}`);
export const createProject = (payload) => http.post("/projects", payload);
export const updateProject = (id, payload) => http.patch(`/projects/${id}`, payload);
export const deleteProject = (id) => http.delete(`/projects/${id}`);

/* Services attached to a project (many-to-many) */
export const addProjectService = (id, payload) =>
  http.post(`/projects/${id}/services`, payload);
export const removeProjectService = (id, serviceId) =>
  http.delete(`/projects/${id}/services/${serviceId}`);

/* Team assignment */
export const addProjectTeamMember = (id, payload) =>
  http.post(`/projects/${id}/team`, payload);
export const removeProjectTeamMember = (id, staffId) =>
  http.delete(`/projects/${id}/team/${staffId}`);

/* Deliverables — the bridge between project work, approvals and files */
export const listDeliverables = (id) => http.get(`/projects/${id}/deliverables`);
export const createDeliverable = (id, payload) =>
  http.post(`/projects/${id}/deliverables`, payload);
export const updateDeliverable = (id, deliverableId, payload) =>
  http.patch(`/projects/${id}/deliverables/${deliverableId}`, payload);
export const deleteDeliverable = (id, deliverableId) =>
  http.delete(`/projects/${id}/deliverables/${deliverableId}`);
