import { http } from "./http";
import { ApprovalStatus } from "./enums";

/** @param {{projectId?, clientId?, deliverableId?, status?, page?, limit?}} params */
export const listApprovals = (params) => http.list("/approvals", params);

export const getApproval = (id) => http.get(`/approvals/${id}`);

/** Every prior approval round for one deliverable — the version history. */
export const getDeliverableApprovalHistory = (deliverableId) =>
  http.get(`/approvals/deliverables/${deliverableId}/history`);

/** Staff/admin: request client review of a deliverable. */
export const createApproval = (payload) => http.post("/approvals", payload);

/** @param {{status: string, feedback?: string}} decision */
export const reviewApproval = (id, decision) =>
  http.patch(`/approvals/${id}/review`, decision);

/* Convenience wrappers for the three client actions */
export const approve = (id, feedback) =>
  reviewApproval(id, { status: ApprovalStatus.APPROVED, feedback });
export const requestChanges = (id, feedback) =>
  reviewApproval(id, { status: ApprovalStatus.CHANGES_REQUESTED, feedback });
export const reject = (id, feedback) =>
  reviewApproval(id, { status: ApprovalStatus.REJECTED, feedback });
