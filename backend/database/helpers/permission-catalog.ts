/**
 * The permission vocabulary for the whole system: `module.action` slugs.
 *
 * This is the single source of truth seeders read from — do not hand-write
 * permission rows in a seeder file directly. When a new module needs a new
 * permission, add it here first, then reference it from
 * database/seeders/*-system-roles-permissions.ts.
 *
 * Kept deliberately close to docs/00_CURRENT_STATE_AUDIT.md's module list
 * and the spec's §9 vocabulary, trimmed to modules that actually exist in
 * src/modules today. Modules not yet built a frontend surface for
 * (careers, behind-the-work, payroll, roles/permissions admin) still get
 * their permissions seeded now, so the backend authorization work in
 * Phase 2 has something concrete to attach @RequirePermissions() to.
 */
export interface PermissionDef {
  module: string;
  action: string;
  description: string;
}

export const PERMISSION_CATALOG: PermissionDef[] = [
  // Projects
  { module: 'projects', action: 'view', description: 'View projects' },
  { module: 'projects', action: 'create', description: 'Create projects' },
  { module: 'projects', action: 'edit', description: 'Edit project details' },
  { module: 'projects', action: 'delete', description: 'Delete/archive projects' },

  // Tasks
  { module: 'tasks', action: 'view', description: 'View tasks' },
  { module: 'tasks', action: 'create', description: 'Create tasks' },
  { module: 'tasks', action: 'edit', description: 'Edit tasks' },
  { module: 'tasks', action: 'delete', description: 'Delete tasks' },
  { module: 'tasks', action: 'assign', description: 'Assign tasks to staff' },

  // Deliverables
  { module: 'deliverables', action: 'view', description: 'View deliverables' },
  { module: 'deliverables', action: 'create', description: 'Create deliverables' },
  { module: 'deliverables', action: 'edit', description: 'Edit/submit deliverables' },
  { module: 'deliverables', action: 'delete', description: 'Delete deliverables' },

  // Approvals
  { module: 'approvals', action: 'view', description: 'View approvals' },
  { module: 'approvals', action: 'create', description: 'Submit items for approval' },
  { module: 'approvals', action: 'review', description: 'Approve or request changes' },

  // Files
  { module: 'files', action: 'view', description: 'View/download files' },
  { module: 'files', action: 'upload', description: 'Upload files' },
  { module: 'files', action: 'edit', description: 'Rename/move files and folders' },
  { module: 'files', action: 'delete', description: 'Delete files' },

  // Clients
  { module: 'clients', action: 'view', description: 'View client organizations' },
  { module: 'clients', action: 'create', description: 'Create client organizations' },
  { module: 'clients', action: 'edit', description: 'Edit client organizations' },
  { module: 'clients', action: 'delete', description: 'Archive/delete client organizations' },

  // Team / Users
  { module: 'team', action: 'view', description: 'View staff/team directory' },
  { module: 'team', action: 'create', description: 'Invite/create staff users' },
  { module: 'team', action: 'edit', description: 'Edit staff users, assign roles' },
  { module: 'team', action: 'delete', description: 'Suspend/remove staff users' },

  // Finance
  { module: 'orders', action: 'view', description: 'View storefront orders' },
  { module: 'invoices', action: 'view', description: 'View invoices' },
  { module: 'invoices', action: 'create', description: 'Create invoices' },
  { module: 'invoices', action: 'edit', description: 'Edit invoices' },
  { module: 'invoices', action: 'delete', description: 'Void/delete invoices' },
  { module: 'payments', action: 'view', description: 'View payment records' },
  { module: 'payments', action: 'create', description: 'Record payments' },

  // Services
  { module: 'services', action: 'view', description: 'View service catalog' },
  { module: 'services', action: 'create', description: 'Create services/plans' },
  { module: 'services', action: 'edit', description: 'Edit services/plans' },
  { module: 'services', action: 'delete', description: 'Delete services/plans' },

  // Support / Queries
  { module: 'queries', action: 'view', description: 'View support queries' },
  { module: 'queries', action: 'create', description: 'Create support queries' },
  { module: 'queries', action: 'edit', description: 'Respond to / update queries' },
  { module: 'queries', action: 'assign', description: 'Assign queries to staff' },

  // Events
  { module: 'events', action: 'view', description: 'View events' },
  { module: 'events', action: 'create', description: 'Create events' },
  { module: 'events', action: 'edit', description: 'Edit events' },
  { module: 'events', action: 'delete', description: 'Delete events' },

  // Attendance
  { module: 'attendance', action: 'self', description: "Check in/out, view one's own attendance" },
  { module: 'attendance', action: 'view', description: 'View team attendance records' },
  { module: 'attendance', action: 'manage', description: 'Correct/manage attendance records' },

  // Payroll
  { module: 'payroll', action: 'view', description: 'View payroll records' },
  { module: 'payroll', action: 'manage', description: 'Process/manage payroll' },

  // Careers
  { module: 'careers', action: 'view', description: 'View job postings and candidates' },
  { module: 'careers', action: 'create', description: 'Create job postings' },
  { module: 'careers', action: 'edit', description: 'Edit postings, move candidates' },
  { module: 'careers', action: 'delete', description: 'Delete job postings' },

  // Behind the work (content)
  { module: 'behind_the_work', action: 'view', description: 'View behind-the-work posts' },
  { module: 'behind_the_work', action: 'create', description: 'Create behind-the-work posts' },
  { module: 'behind_the_work', action: 'edit', description: 'Edit behind-the-work posts' },
  { module: 'behind_the_work', action: 'publish', description: 'Publish/unpublish posts' },

  // Activity / notifications
  { module: 'activity', action: 'view', description: 'View activity log' },
  {
    module: 'activity',
    action: 'create',
    description: 'Manually write an activity log entry via the API (system/admin use)',
  },
  { module: 'notifications', action: 'view', description: "View one's own notifications" },
  { module: 'notifications', action: 'manage', description: 'Manage notifications for others' },

  // Authorization admin surface itself
  { module: 'roles', action: 'view', description: 'View roles' },
  { module: 'roles', action: 'manage', description: 'Create/edit roles and their permissions' },
  { module: 'permissions', action: 'view', description: 'View the permission catalog' },
];

/**
 * Which permission slugs each system role gets, by module+action.
 * `admin` is granted the full PERMISSION_CATALOG programmatically in the
 * seeder rather than listed twice here — see 20260101000102-system-roles.ts.
 */
export const ROLE_PERMISSION_SLUGS: Record<'manager' | 'staff' | 'client', string[]> = {
  manager: [
    'projects.view', 'projects.create', 'projects.edit', 'projects.delete',
    'tasks.view', 'tasks.create', 'tasks.edit', 'tasks.delete', 'tasks.assign',
    'deliverables.view', 'deliverables.create', 'deliverables.edit', 'deliverables.delete',
    // NOTE: approvals.review is deliberately NOT granted to manager —
    // ApprovalsService.review() hard-codes "only the client can review an
    // approval" (clients sign off on work; staff/admin cannot reproduce
    // that action, even to act on a client's behalf). Granting the
    // permission here would pass the route guard and then always hit
    // that ForbiddenException, which is a confusing way to be blocked.
    // See the client list below, which is where this permission belongs.
    'approvals.view', 'approvals.create',
    'files.view', 'files.upload', 'files.edit', 'files.delete',
    'clients.view', 'clients.create', 'clients.edit',
    'team.view', 'team.create', 'team.edit',
    'orders.view',
    'invoices.view', 'invoices.create', 'invoices.edit',
    'payments.view', 'payments.create',
    'services.view', 'services.create', 'services.edit',
    'queries.view', 'queries.edit', 'queries.assign',
    'events.view', 'events.create', 'events.edit', 'events.delete',
    'attendance.self', 'attendance.view', 'attendance.manage',
    'payroll.view', 'payroll.manage',
    'careers.view', 'careers.create', 'careers.edit',
    'behind_the_work.view', 'behind_the_work.create', 'behind_the_work.edit', 'behind_the_work.publish',
    'activity.view', 'activity.create',
    'notifications.view', 'notifications.manage',
    'roles.view', 'permissions.view',
  ],
  staff: [
    'projects.view',
    'tasks.view', 'tasks.create', 'tasks.edit',
    'deliverables.view', 'deliverables.create', 'deliverables.edit',
    'approvals.view', 'approvals.create',
    'files.view', 'files.upload',
    'clients.view',
    'queries.view',
    'events.view',
    'attendance.self',
    'careers.view',
    'behind_the_work.view', 'behind_the_work.create',
    'activity.view',
    'notifications.view',
  ],
  client: [
    'projects.view',
    // Added after auditing tasks.service.ts (Phase 2): Task has its own
    // clientId column and the service already scoped findAll/findOne to
    // the requester's own clientId — the data model and existing service
    // logic both assume clients can see (read-only) tasks on their own
    // projects, even though the top-level Client OS nav list in the
    // original spec doesn't call it out by name. Following what's
    // actually implemented rather than silently blocking it.
    'tasks.view',
    'deliverables.view',
    'approvals.view', 'approvals.create',
    // review is a client-only action in ApprovalsService (the client
    // signs off on work; staff/admin cannot) — granted here to match
    // that logic exactly, not to manager/staff above.
    'approvals.review',
    'files.view',
    'invoices.view', 'payments.view', 'payments.create',
    'services.view',
    'queries.view', 'queries.create',
    'events.view',
    'activity.view',
    'notifications.view',
  ],
};
