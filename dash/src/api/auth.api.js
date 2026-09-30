import { http, setToken, clearToken } from "./http";

/**
 * POST /auth/login
 * @param {{email: string, password: string, portal?: 'client'|'staff'|'admin'}} credentials
 *
 * `portal` is optional and enforced server-side: passing it makes the backend
 * reject an account whose userType doesn't match, which is what the role
 * picker on the login screen should send.
 */
export async function login(credentials) {
  const result = await http.post("/auth/login", credentials, { auth: false });
  if (result?.accessToken) setToken(result.accessToken);
  return result; // { accessToken, user }
}

/**
 * POST /auth/refresh
 *
 * This is NOT a refresh-token grant — it requires a currently valid JWT and
 * re-issues one with fresh permissions. Call it after a role/permission
 * change, not on 401.
 */
export async function reissueToken() {
  const result = await http.post("/auth/refresh");
  if (result?.accessToken) setToken(result.accessToken);
  return result;
}

/** Client-side only; the backend keeps no session state to invalidate. */
export function logout() {
  clearToken();
}
