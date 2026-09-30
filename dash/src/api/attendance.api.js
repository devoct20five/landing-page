import { http } from "./http";

/** Admin view. @param {{date?: string, search?: string}} params */
export const listAttendance = (params) => http.list("/attendance", params);

/** One staff member's history. */
export const getStaffAttendance = (staffId, params) =>
  http.get(`/attendance/${staffId}`, params);

/** @param {{workMode?: 'Office'|'Remote'}} payload */
export const checkIn = (staffId, payload) =>
  http.post(`/attendance/${staffId}/check-in`, payload);

export const checkOut = (staffId, payload) =>
  http.post(`/attendance/${staffId}/check-out`, payload);

/** Admin correction — PUT, not PATCH. Must be auditable in the UI. */
export const correctAttendance = (staffId, payload) =>
  http.put(`/attendance/${staffId}`, payload);
