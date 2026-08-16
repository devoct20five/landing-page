export enum ClientStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
}

export enum ProjectStatus {
  NOT_STARTED = 'not-started',
  IN_PROGRESS = 'in-progress',
  CLIENT_REVIEW = 'client-review',
  BLOCKED = 'blocked',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

export enum DeliverableStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in-progress',
  CLIENT_REVIEW = 'client-review',
  APPROVED = 'approved',
  DELIVERED = 'delivered',
}
export enum TaskStatus {
  NOT_STARTED = 'not-started',
  PLANNED = 'planned',
  IN_PROGRESS = 'in-progress',
  CLIENT_REVIEW = 'client-review',
  BLOCKED = 'blocked',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

export enum TaskPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
}

export enum ApprovalStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  CHANGES_REQUESTED = 'changes-requested',
  REJECTED = 'rejected',
}

export enum FileType {
  PDF = 'pdf',
  IMAGE = 'image',
  VIDEO = 'video',
  SPREADSHEET = 'spreadsheet',
  DOC = 'doc',
  OTHER = 'other',
}

export enum UserType {
  CLIENT = 'client',
  STAFF = 'staff',
  ADMIN = 'admin',
}

export enum ActivityType {
  STATUS = 'status',
  APPROVAL = 'approval',
  UPLOAD = 'upload',
  TASK = 'task',
  COMMENT = 'comment',
  PAYMENT = 'payment',
  ATTENDANCE = 'attendance',
  OTHER = 'other',
}

export enum EventType {
  MEETING = 'meeting',
  REVIEW = 'review',
  DEADLINE = 'deadline',
  INTERNAL = 'internal',
}

export enum EventStatus {
  SCHEDULED = 'scheduled',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

export enum RsvpStatus {
  INVITED = 'invited',
  ACCEPTED = 'accepted',
  DECLINED = 'declined',
}
