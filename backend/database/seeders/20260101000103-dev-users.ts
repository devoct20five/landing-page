import { QueryInterface } from 'sequelize';
import { randomUUID } from 'crypto';
import * as bcrypt from 'bcrypt';

// Matches BCRYPT_ROUNDS in src/modules/users/users.service.ts — keep these
// in sync so a seeded hash and an API-created hash are equivalent in cost.
const BCRYPT_ROUNDS = 12;

// Development-only accounts (spec §67 / audit §8). NEVER used in
// production — see database/README.md, which documents that the
// production seed path only creates the single initial admin account with
// a password read from env, not this file.
const DEV_USERS = [
  {
    email: 'admin@example.com',
    firstName: 'Ava',
    lastName: 'Admin',
    userType: 'admin',
    roleSlug: 'admin',
    password: 'DevPassword123!',
  },
  {
    email: 'manager@example.com',
    firstName: 'Marcus',
    lastName: 'Manager',
    userType: 'staff',
    roleSlug: 'manager',
    password: 'DevPassword123!',
  },
  {
    email: 'staff@example.com',
    firstName: 'Sam',
    lastName: 'Staff',
    userType: 'staff',
    roleSlug: 'staff',
    password: 'DevPassword123!',
  },
  {
    email: 'client@example.com',
    firstName: 'Cara',
    lastName: 'Client',
    userType: 'client',
    roleSlug: 'client',
    password: 'DevPassword123!',
  },
];

module.exports = {
  up: async (queryInterface: QueryInterface) => {
    const roles = (await queryInterface.sequelize.query('SELECT id, slug FROM roles', {
      type: 'SELECT',
    })) as Array<{ id: string; slug: string }>;
    const roleIdBySlug = new Map(roles.map((r) => [r.slug, r.id]));

    const existingUsers = (await queryInterface.sequelize.query('SELECT email FROM users', {
      type: 'SELECT',
    })) as Array<{ email: string }>;
    const existingEmails = new Set(existingUsers.map((u) => u.email));

    const rows: Record<string, unknown>[] = [];
    for (const u of DEV_USERS) {
      if (existingEmails.has(u.email)) continue;
      const roleId = roleIdBySlug.get(u.roleSlug);
      if (!roleId) {
        throw new Error(
          `Seeder error: role "${u.roleSlug}" not found — run the system-roles seeder first.`,
        );
      }
      rows.push({
        id: randomUUID(),
        user_type: u.userType,
        role_id: roleId,
        first_name: u.firstName,
        last_name: u.lastName,
        initials: `${u.firstName[0]}${u.lastName[0]}`.toUpperCase(),
        email: u.email,
        password_hash: await bcrypt.hash(u.password, BCRYPT_ROUNDS),
        status: 'active',
        created_at: new Date(),
        updated_at: new Date(),
      });
    }

    if (rows.length > 0) {
      await queryInterface.bulkInsert('users', rows);
    }
  },

  down: async (queryInterface: QueryInterface) => {
    await queryInterface.bulkDelete('users', {
      email: DEV_USERS.map((u) => u.email),
    });
  },
};
