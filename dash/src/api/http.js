/**
 * Central HTTP client for the OCT20FIVE API.
 *
 * Everything the app sends to the backend goes through here:
 *  - base URL + global `/api` prefix (see backend main.ts)
 *  - bearer token attachment
 *  - Nest error normalisation (statusCode / message / message[])
 *  - list-shape normalisation (the backend returns three different shapes)
 *  - 401 handling (there is no refresh-token grant on the backend today)
 *
 * No page or component should call fetch() directly.
 */

const BASE_URL = (
  import.meta.env.VITE_API_BASE_URL ?? "http://localhost:3000/api"
).replace(/\/+$/, "");

const TOKEN_KEY = "o5.accessToken";

/* ------------------------------------------------------------------ */
/* Session token                                                       */
/* ------------------------------------------------------------------ */

let memoryToken = null;

export function getToken() {
  if (memoryToken) return memoryToken;
  try {
    memoryToken = localStorage.getItem(TOKEN_KEY);
  } catch {
    memoryToken = null;
  }
  return memoryToken;
}

export function setToken(token) {
  memoryToken = token ?? null;
  try {
    if (token) localStorage.setItem(TOKEN_KEY, token);
    else localStorage.removeItem(TOKEN_KEY);
  } catch {
    /* storage unavailable (private mode) — memory token still works */
  }
}

export function clearToken() {
  setToken(null);
}

/**
 * Fired when the API rejects the current token. AuthProvider listens for this
 * and tears the session down. Kept as an event so the transport layer never
 * has to import React.
 */
export const AUTH_EXPIRED_EVENT = "o5:auth-expired";

function notifyAuthExpired() {
  clearToken();
  window.dispatchEvent(new CustomEvent(AUTH_EXPIRED_EVENT));
}

/* ------------------------------------------------------------------ */
/* Errors                                                              */
/* ------------------------------------------------------------------ */

export class ApiError extends Error {
  constructor(message, { status, code, fieldErrors, body } = {}) {
    super(message);
    this.name = "ApiError";
    this.status = status ?? 0;
    this.code = code ?? null;
    /** Array of validation strings from Nest's ValidationPipe, if any. */
    this.fieldErrors = fieldErrors ?? [];
    this.body = body ?? null;
  }

  get isUnauthorized() {
    return this.status === 401;
  }
  get isForbidden() {
    return this.status === 403;
  }
  get isNotFound() {
    return this.status === 404;
  }
  get isValidation() {
    return this.status === 400 || this.status === 422;
  }
  get isNetwork() {
    return this.status === 0;
  }
}

const FALLBACK_MESSAGES = {
  400: "That request wasn't valid.",
  401: "Your session has expired. Please sign in again.",
  403: "You don't have permission to do that.",
  404: "We couldn't find what you were looking for.",
  409: "That conflicts with something that already exists.",
  413: "That file is too large to upload.",
  500: "The server ran into a problem. Try again in a moment.",
};

function normalizeError(status, body) {
  // Nest default: { statusCode, message: string | string[], error }
  const raw = body?.message;
  const fieldErrors = Array.isArray(raw) ? raw : [];
  const message =
    (typeof raw === "string" && raw) ||
    fieldErrors[0] ||
    body?.error ||
    FALLBACK_MESSAGES[status] ||
    "Something went wrong.";

  return new ApiError(message, {
    status,
    code: body?.code ?? null,
    fieldErrors,
    body,
  });
}

/* ------------------------------------------------------------------ */
/* Query strings                                                       */
/* ------------------------------------------------------------------ */

/** Drops undefined / null / "" so we never send `?status=` to the API. */
export function toQueryString(params) {
  if (!params) return "";
  const search = new URLSearchParams();

  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null || value === "") continue;
    if (Array.isArray(value)) {
      value.filter((v) => v !== undefined && v !== null && v !== "").forEach((v) => search.append(key, v));
    } else {
      search.append(key, value);
    }
  }

  const qs = search.toString();
  return qs ? `?${qs}` : "";
}

/* ------------------------------------------------------------------ */
/* List normalisation                                                  */
/* ------------------------------------------------------------------ */

/**
 * The backend currently returns three different list shapes:
 *
 *   A  { data, meta: { total, page, limit, totalPages } }
 *        tasks, files, approvals, events, activity, invoices, queries
 *   B  { data, total, page, limit }
 *        projects, clients, staff, users
 *   C  [ ... ]  (bare array)
 *        services, and most nested collections
 *
 * Every list call in the app resolves to shape A so pages, tables and
 * pagination controls only ever deal with one contract.
 */
export function normalizeList(payload, { page = 1, limit } = {}) {
  if (Array.isArray(payload)) {
    return {
      items: payload,
      meta: {
        total: payload.length,
        page: 1,
        limit: payload.length,
        totalPages: 1,
      },
    };
  }

  if (payload && Array.isArray(payload.data)) {
    const items = payload.data;

    if (payload.meta) {
      const m = payload.meta;
      return {
        items,
        meta: {
          total: m.total ?? items.length,
          page: m.page ?? page,
          limit: m.limit ?? limit ?? items.length,
          totalPages:
            m.totalPages ??
            Math.max(1, Math.ceil((m.total ?? items.length) / (m.limit || limit || items.length || 1))),
        },
      };
    }

    const total = payload.total ?? items.length;
    const resolvedLimit = payload.limit ?? limit ?? items.length ?? 1;
    return {
      items,
      meta: {
        total,
        page: payload.page ?? page,
        limit: resolvedLimit,
        totalPages: Math.max(1, Math.ceil(total / (resolvedLimit || 1))),
      },
    };
  }

  // Unexpected shape — surface it as empty rather than crashing a page.
  return {
    items: [],
    meta: { total: 0, page: 1, limit: 0, totalPages: 1 },
  };
}

/* ------------------------------------------------------------------ */
/* Core request                                                        */
/* ------------------------------------------------------------------ */

async function parseBody(response) {
  if (response.status === 204) return null;
  const type = response.headers.get("content-type") ?? "";
  if (type.includes("application/json")) {
    try {
      return await response.json();
    } catch {
      return null;
    }
  }
  const text = await response.text();
  return text || null;
}

/**
 * @param {string} path      Path under /api, e.g. "/projects/12"
 * @param {object} options
 * @param {string} [options.method]
 * @param {object} [options.body]    JSON-serialised unless `formData` is set
 * @param {FormData} [options.formData]
 * @param {object} [options.params]  Query params (undefined values dropped)
 * @param {AbortSignal} [options.signal]
 * @param {boolean} [options.auth=true]
 */
export async function request(path, options = {}) {
  const {
    method = "GET",
    body,
    formData,
    params,
    signal,
    auth = true,
    headers: extraHeaders,
  } = options;

  const headers = { Accept: "application/json", ...extraHeaders };

  if (auth) {
    const token = getToken();
    if (token) headers.Authorization = `Bearer ${token}`;
  }

  let payload;
  if (formData) {
    payload = formData; // let the browser set the multipart boundary
  } else if (body !== undefined) {
    headers["Content-Type"] = "application/json";
    payload = JSON.stringify(body);
  }

  let response;
  try {
    response = await fetch(`${BASE_URL}${path}${toQueryString(params)}`, {
      method,
      headers,
      body: payload,
      signal,
    });
  } catch (err) {
    if (err?.name === "AbortError") throw err;
    throw new ApiError("Couldn't reach the server. Check your connection.", {
      status: 0,
    });
  }

  const parsed = await parseBody(response);

  if (!response.ok) {
    // The backend has no refresh-token grant: /auth/refresh re-issues a token
    // for an already-valid session. So a 401 means sign in again, full stop.
    if (response.status === 401 && auth) notifyAuthExpired();
    throw normalizeError(response.status, parsed);
  }

  return parsed;
}

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

export const http = {
  get: (path, params, options) => request(path, { ...options, method: "GET", params }),
  post: (path, body, options) => request(path, { ...options, method: "POST", body }),
  patch: (path, body, options) => request(path, { ...options, method: "PATCH", body }),
  put: (path, body, options) => request(path, { ...options, method: "PUT", body }),
  delete: (path, options) => request(path, { ...options, method: "DELETE" }),

  /** GET a list endpoint and normalise whatever shape it returns. */
  list: async (path, params, options) => {
    const payload = await request(path, { ...options, method: "GET", params });
    return normalizeList(payload, { page: params?.page, limit: params?.limit });
  },

  /** POST multipart/form-data (file uploads). */
  upload: (path, formData, options) =>
    request(path, { ...options, method: "POST", formData }),

  /**
   * Fetch a protected binary route as a Blob.
   * Needed because /files/:id/download sits behind the JWT guard — a plain
   * <a href> or window.open() would arrive without the Authorization header.
   */
  blob: async (path) => {
    const token = getToken();
    const response = await fetch(`${BASE_URL}${path}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });

    if (!response.ok) {
      if (response.status === 401) notifyAuthExpired();
      throw normalizeError(response.status, await parseBody(response));
    }

    const disposition = response.headers.get("content-disposition") ?? "";
    const match = /filename\*?=(?:UTF-8'')?"?([^";]+)"?/i.exec(disposition);

    return {
      blob: await response.blob(),
      filename: match ? decodeURIComponent(match[1]) : null,
    };
  },
};

/** Triggers a browser save dialog for a Blob fetched via http.blob(). */
export function saveBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename || "download";
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}

export { BASE_URL };
