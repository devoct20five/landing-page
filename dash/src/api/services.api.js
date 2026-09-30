import { http } from "./http";

/**
 * @param {{search?: string, activeOnly?: boolean}} params
 * Returns a bare array from the backend; normalised to { items, meta } here.
 */
export const listServices = (params) => http.list("/services", params);

export const getService = (id) => http.get(`/services/${id}`);
export const createService = (payload) => http.post("/services", payload);
export const updateService = (id, payload) => http.patch(`/services/${id}`, payload);
export const deleteService = (id) => http.delete(`/services/${id}`);

/* Plans */
export const getServicePlan = (id, planId) =>
  http.get(`/services/${id}/plans/${planId}`);
export const createServicePlan = (id, payload) =>
  http.post(`/services/${id}/plans`, payload);
export const updateServicePlan = (id, planId, payload) =>
  http.patch(`/services/${id}/plans/${planId}`, payload);
export const toggleServicePlanStatus = (id, planId) =>
  http.patch(`/services/${id}/plans/${planId}/toggle-status`);
export const duplicateServicePlan = (id, planId) =>
  http.post(`/services/${id}/plans/${planId}/duplicate`);
export const deleteServicePlan = (id, planId) =>
  http.delete(`/services/${id}/plans/${planId}`);

/* Plan packages and features */
export const addPlanPackage = (id, planId, payload) =>
  http.post(`/services/${id}/plans/${planId}/packages`, payload);
export const removePlanPackage = (id, planId, packageId) =>
  http.delete(`/services/${id}/plans/${planId}/packages/${packageId}`);
export const addPlanFeature = (id, planId, payload) =>
  http.post(`/services/${id}/plans/${planId}/features`, payload);
export const removePlanFeature = (id, planId, featureId) =>
  http.delete(`/services/${id}/plans/${planId}/features/${featureId}`);
