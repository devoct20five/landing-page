import { api } from "./api";

/* The catalogue is owned by the backend database. No price fallback exists on purpose:
 * if the API is down the page says so rather than showing a price that may be wrong. */
export async function fetchServices() {
  return api("/public/catalog/services", { next: { revalidate: 30 } });
}
export async function fetchService(slug) {
  try {
    return await api(`/public/catalog/services/${encodeURIComponent(slug)}`, { next: { revalidate: 30 } });
  } catch (e) {
    if (e.status === 404) return null;
    console.error("catalogue fetch failed", slug, e.message);
    return null;
  }
}
