import { http } from "./http";

/** @param {{status?, clientId?, projectId?, search?, page?, limit?}} params */
export const listInvoices = (params) => http.list("/invoices", params);

/** Receivables totals for the finance dashboard. */
export const getInvoiceStats = (params) => http.get("/invoices/stats", params);

export const listInvoicesForProject = (projectId) =>
  http.get(`/invoices/project/${projectId}`);

export const getInvoice = (id) => http.get(`/invoices/${id}`);
export const createInvoice = (payload) => http.post("/invoices", payload);
export const updateInvoice = (id, payload) => http.patch(`/invoices/${id}`, payload);
export const deleteInvoice = (id) => http.delete(`/invoices/${id}`);
