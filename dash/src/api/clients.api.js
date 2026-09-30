import { http } from "./http";

/** @param {{search?, status?, page?, limit?}} params */
export const listClients = (params) => http.list("/clients", params);

export const getClient = (id) => http.get(`/clients/${id}`);

/** Counts/totals used by the admin client command page header. */
export const getClientStats = (id) => http.get(`/clients/${id}/stats`);

export const createClient = (payload) => http.post("/clients", payload);
export const updateClient = (id, payload) => http.patch(`/clients/${id}`, payload);
export const deleteClient = (id) => http.delete(`/clients/${id}`);

export const listClientContacts = (id) => http.get(`/clients/${id}/contacts`);
export const createClientContact = (id, payload) =>
  http.post(`/clients/${id}/contacts`, payload);
export const updateClientContact = (id, contactId, payload) =>
  http.patch(`/clients/${id}/contacts/${contactId}`, payload);
export const deleteClientContact = (id, contactId) =>
  http.delete(`/clients/${id}/contacts/${contactId}`);
