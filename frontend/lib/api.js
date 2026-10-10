/* Same-origin proxy: the browser talks to /backend-api/* (rewritten by next.config.js to the
 * NestJS API). On the server (RSC / ISR) we call the backend directly. */
const SERVER_BASE =
  (
    process.env.BACKEND_API_URL ||
    (process.env.NODE_ENV === "production"
      ? "https://landing-page-03cf.onrender.com"
      : "http://localhost:4000")
  ).replace(/\/$/, "") + "/api";

export const apiBase = () =>
  typeof window === "undefined" ? SERVER_BASE : "/backend-api";
export class ApiError extends Error {
  constructor(message, status, body) {
    super(message);
    this.status = status;
    this.body = body;
  }
}

export async function api(
  path,
  { method = "GET", body, headers = {}, token, ...rest } = {},
) {
  const res = await fetch(apiBase() + path, {
    method,
    headers: {
      ...(body !== undefined ? { "Content-Type": "application/json" } : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
    ...rest,
  });
  const data = await res.json().catch(() => null);
  if (!res.ok) {
    const m = data?.message;
    throw new ApiError(
      Array.isArray(m) ? m.join(", ") : m || `Request failed (${res.status})`,
      res.status,
      data,
    );
  }
  return data;
}

/* ---- client session (workspace login) ---- */
const KEY = "oct20five.session";
export const session = {
  get() {
    try {
      return JSON.parse(localStorage.getItem(KEY) || "null");
    } catch {
      return null;
    }
  },
  set(v) {
    try {
      localStorage.setItem(KEY, JSON.stringify(v));
    } catch {}
  },
  clear() {
    try {
      localStorage.removeItem(KEY);
    } catch {}
  },
};

/** If NEXT_PUBLIC_WORKSPACE_URL is set the full workspace app is the post-login destination. */
export const WORKSPACE_URL = process.env.NEXT_PUBLIC_WORKSPACE_URL || "";
