import { http } from "./http";

/** @param {{search?, department?, page?, limit?}} params */
export const listStaff = (params) => http.list("/staff", params);

/** Note: keyed by userId, not by staff profile id. */
export const getStaff = (userId) => http.get(`/staff/${userId}`);
export const createStaff = (payload) => http.post("/staff", payload);
export const updateStaff = (userId, payload) =>
  http.patch(`/staff/${userId}`, payload);
export const deleteStaff = (userId) => http.delete(`/staff/${userId}`);
