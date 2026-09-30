/**
 * Status vocabularies, mirrored from the backend.
 *
 * Source of truth:
 *   backend/src/common/enums/index.enum.ts
 *   backend/src/modules/invoices/models/invoice.model.ts
 *   backend/src/modules/invoices/models/payment-transaction.model.ts
 *   backend/src/modules/queries/models/query.model.ts
 *   backend/src/modules/staff/models/attendance.model.ts
 *
 * Use these instead of typing status strings into components. If a value you
 * need isn't here, it isn't in the backend either — change the backend rather
 * than inventing a frontend-only status.
 */

export const UserType = {
  CLIENT: "client",
  STAFF: "staff",
  ADMIN: "admin",
};

export const ClientStatus = {
  ACTIVE: "active",
  INACTIVE: "inactive",
};

export const ProjectStatus = {
  NOT_STARTED: "not-started",
  IN_PROGRESS: "in-progress",
  CLIENT_REVIEW: "client-review",
  BLOCKED: "blocked",
  COMPLETED: "completed",
  CANCELLED: "cancelled",
};

export const DeliverableStatus = {
  PENDING: "pending",
  IN_PROGRESS: "in-progress",
  CLIENT_REVIEW: "client-review",
  APPROVED: "approved",
  DELIVERED: "delivered",
};

export const TaskStatus = {
  NOT_STARTED: "not-started",
  PLANNED: "planned",
  IN_PROGRESS: "in-progress",
  CLIENT_REVIEW: "client-review",
  BLOCKED: "blocked",
  COMPLETED: "completed",
  CANCELLED: "cancelled",
};

export const TaskPriority = { LOW: "low", MEDIUM: "medium", HIGH: "high" };

export const ApprovalStatus = {
  PENDING: "pending",
  APPROVED: "approved",
  CHANGES_REQUESTED: "changes-requested",
  REJECTED: "rejected",
};

export const FileType = {
  PDF: "pdf",
  IMAGE: "image",
  VIDEO: "video",
  SPREADSHEET: "spreadsheet",
  DOC: "doc",
  OTHER: "other",
};

export const InvoiceStatus = {
  DRAFT: "draft",
  PENDING: "pending",
  PAID: "paid",
  OVERDUE: "overdue",
  CANCELLED: "cancelled",
};

/** Transaction status — deliberately distinct from InvoiceStatus. */
export const PaymentStatus = {
  PENDING: "pending",
  SUCCESS: "success",
  FAILED: "failed",
  REFUNDED: "refunded",
};

/**
 * NOTE: the backend does NOT have "new", "assigned" or "waiting-for-client".
 * The UI lifecycle must be built from these four values.
 */
export const QueryStatus = {
  OPEN: "open",
  IN_PROGRESS: "in-progress",
  RESOLVED: "resolved",
  CLOSED: "closed",
};

export const QueryPriority = { LOW: "low", MEDIUM: "medium", HIGH: "high" };

export const ActivityType = {
  STATUS: "status",
  APPROVAL: "approval",
  UPLOAD: "upload",
  TASK: "task",
  COMMENT: "comment",
  PAYMENT: "payment",
  ATTENDANCE: "attendance",
  OTHER: "other",
};

export const EventType = {
  MEETING: "meeting",
  REVIEW: "review",
  DEADLINE: "deadline",
  INTERNAL: "internal",
};

export const EventStatus = {
  SCHEDULED: "scheduled",
  COMPLETED: "completed",
  CANCELLED: "cancelled",
};

export const RsvpStatus = {
  INVITED: "invited",
  ACCEPTED: "accepted",
  DECLINED: "declined",
};

export const AttendanceStatus = {
  PRESENT: "present",
  LATE: "late",
  REMOTE: "remote",
  LEAVE: "leave",
  ABSENT: "absent",
};

/** Capitalised on the backend — do not lowercase these. */
export const WorkMode = { OFFICE: "Office", REMOTE: "Remote" };
