import { QueryInterface } from 'sequelize';
import { randomUUID } from 'crypto';
import { PERMISSION_CATALOG, ROLE_PERMISSION_SLUGS } from '../helpers/permission-catalog';

// The four system roles from docs/00_CURRENT_STATE_AUDIT.md / spec §8.
// `is_system = 1` protects these from deletion/rename via the future
// Roles & Permissions admin UI (Phase 6) — that guard is an application-
// layer check the RolesService must add, this seeder just marks the rows.
const SYSTEM_ROLES = [
  { slug: 'admin', name: 'Administrator', description: 'Full agency-wide access to every module.' },
  { slug: 'manager', name: 'Manager', description: 'Elevated staff-portal role: agency-wide operational access, no authorization-model changes.' },
  { slug: 'staff', name: 'Staff', description: 'Production staff: scoped to assigned projects and tasks.' },
  { slug: 'client', name: 'Client', description: "Client-portal role: scoped to the user's own client organization." },
];

module.exports = {
  up: async (queryInterface: QueryInterface) => {
    const existingRoles = (await queryInterface.sequelize.query(
      'SELECT id, slug FROM roles',
      { type: 'SELECT' },
    )) as Array<{ id: string; slug: string }>;
    const existingBySlug = new Map(existingRoles.map((r) => [r.slug, r.id]));

    const roleIdBySlug = new Map<string, string>(existingBySlug);
    const roleRows = SYSTEM_ROLES.filter((r) => !existingBySlug.has(r.slug)).map((r) => {
      const id = randomUUID();
      roleIdBySlug.set(r.slug, id);
      return {
        id,
        name: r.name,
        slug: r.slug,
        description: r.description,
        is_system: 1,
        created_at: new Date(),
      };
    });

    if (roleRows.length > 0) {
      await queryInterface.bulkInsert('roles', roleRows);
    }

    // Permission slug -> id, needed to build role_permissions rows.
    const permissionRows = (await queryInterface.sequelize.query(
      'SELECT id, slug FROM permissions',
      { type: 'SELECT' },
    )) as Array<{ id: string; slug: string }>;
    const permissionIdBySlug = new Map(permissionRows.map((p) => [p.slug, p.id]));

    const existingRolePermissions = (await queryInterface.sequelize.query(
      'SELECT role_id, permission_id FROM role_permissions',
      { type: 'SELECT' },
    )) as Array<{ role_id: string; permission_id: string }>;
    const existingPairs = new Set(
      existingRolePermissions.map((rp) => `${rp.role_id}:${rp.permission_id}`),
    );

    const allSlugs = PERMISSION_CATALOG.map((p) => `${p.module}.${p.action}`);
    const slugsByRole: Record<string, string[]> = {
      admin: allSlugs, // admin gets every permission that exists, not a userType===admin bypass
      manager: ROLE_PERMISSION_SLUGS.manager,
      staff: ROLE_PERMISSION_SLUGS.staff,
      client: ROLE_PERMISSION_SLUGS.client,
    };

    const rolePermissionRows: Array<{ role_id: string; permission_id: string }> = [];
    for (const [roleSlug, slugs] of Object.entries(slugsByRole)) {
      const roleId = roleIdBySlug.get(roleSlug);
      if (!roleId) continue;
      for (const slug of slugs) {
        const permissionId = permissionIdBySlug.get(slug);
        if (!permissionId) {
          throw new Error(
            `Seeder error: permission slug "${slug}" referenced for role "${roleSlug}" ` +
              `does not exist in the permissions table. Run the system-permissions seeder first.`,
          );
        }
        const pairKey = `${roleId}:${permissionId}`;
        if (!existingPairs.has(pairKey)) {
          rolePermissionRows.push({ role_id: roleId, permission_id: permissionId });
          existingPairs.add(pairKey);
        }
      }
    }

    if (rolePermissionRows.length > 0) {
      await queryInterface.bulkInsert('role_permissions', rolePermissionRows);
    }
  },

  down: async (queryInterface: QueryInterface) => {
    const roles = (await queryInterface.sequelize.query(
      `SELECT id FROM roles WHERE slug IN ('admin','manager','staff','client')`,
      { type: 'SELECT' },
    )) as Array<{ id: string }>;
    const roleIds = roles.map((r) => r.id);
    if (roleIds.length > 0) {
      await queryInterface.bulkDelete('role_permissions', { role_id: roleIds });
    }
    await queryInterface.bulkDelete('roles', {
      slug: ['admin', 'manager', 'staff', 'client'],
    });
  },
};
