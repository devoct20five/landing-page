import { QueryInterface } from 'sequelize';
import { randomUUID } from 'crypto';

// Links the dev client@example.com login (created in 20260101000103) to
// Northwind Studios (created in 20260101000201) as its primary contact.
// Without this row, client@example.com is a `users` record with no
// resolvable client tenant — logging in would work but every
// client-scoped endpoint would correctly return nothing, since (per
// docs/00_CURRENT_STATE_AUDIT.md §3) tenancy must be resolved through
// this join table, not trusted from the request.
module.exports = {
  up: async (queryInterface: QueryInterface) => {
    const user = (
      (await queryInterface.sequelize.query(
        `SELECT id FROM users WHERE email = 'client@example.com' LIMIT 1`,
        { type: 'SELECT' },
      )) as Array<{ id: string }>
    )[0];
    const client = (
      (await queryInterface.sequelize.query(
        `SELECT id FROM clients WHERE name = 'Northwind Studios' LIMIT 1`,
        { type: 'SELECT' },
      )) as Array<{ id: string }>
    )[0];

    if (!user || !client) {
      throw new Error(
        'Seeder error: client@example.com or Northwind Studios not found — run the ' +
          'dev-users and dev-clients seeders first.',
      );
    }

    const existing = (
      (await queryInterface.sequelize.query(
        `SELECT id FROM client_contacts WHERE client_id = :clientId AND user_id = :userId`,
        { type: 'SELECT', replacements: { clientId: client.id, userId: user.id } },
      )) as Array<{ id: string }>
    )[0];
    if (existing) return;

    await queryInterface.bulkInsert('client_contacts', [
      {
        id: randomUUID(),
        client_id: client.id,
        user_id: user.id,
        designation: 'Marketing Director',
        is_primary: true,
        created_at: new Date(),
      },
    ]);
  },

  down: async (queryInterface: QueryInterface) => {
    const user = (
      (await queryInterface.sequelize.query(
        `SELECT id FROM users WHERE email = 'client@example.com' LIMIT 1`,
        { type: 'SELECT' },
      )) as Array<{ id: string }>
    )[0];
    if (user) {
      await queryInterface.bulkDelete('client_contacts', { user_id: user.id });
    }
  },
};
