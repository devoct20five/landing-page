import { http } from "./http";

/**
 * GET /users/me
 *
 * Returns the user record (toSafeJSON) — it does NOT include the permission
 * slugs. Those live in the JWT payload only; see decodePermissions() in
 * src/auth/token.js.
 */
export const getMe = () => http.get("/users/me");

export const updateMe = (payload) => http.patch("/users/me", payload);

export const changeMyPassword = (payload) =>
  http.patch("/users/me/password", payload);

/** Admin only. @param {{search?, userType?, status?, page?, limit?}} params */
export const listUsers = (params) => http.list("/users", params);

export const getUser = (id) => http.get(`/users/${id}`);
export const createUser = (payload) => http.post("/users", payload);
export const updateUser = (id, payload) => http.patch(`/users/${id}`, payload);
export const deleteUser = (id) => http.delete(`/users/${id}`);
