import { QueryInterface } from 'sequelize';
import { randomUUID } from 'crypto';

// Deterministic dev-fixture clients (spec §8: "the system must be usable
// immediately after install + migrate + seed"). Two clients so the admin
// list view, client isolation checks, and "client A cannot see client B"
// tests all have something real to exercise.
const DEV_CLIENTS = [
  {
    key: 'northwind-studios',
    name: 'Northwind Studios',
    shortName: 'Northwind',
    email: 'hello@northwindstudios.example',
    industry: 'Fashion & Retail',
  },
  {
    key: 'lumen-labs',
    name: 'Lumen Labs',
    shortName: 'Lumen',
    email: 'contact@lumenlabs.example',
    industry: 'Technology',
  },
];

module.exports = {
  up: async (queryInterface: QueryInterface) => {
    const admin = (
      (await queryInterface.sequelize.query(
        `SELECT id FROM users WHERE email = 'admin@example.com' LIMIT 1`,
        { type: 'SELECT' },
      )) as Array<{ id: string }>
    )[0];
    if (!admin) {
      throw new Error(
        'Seeder error: admin@example.com not found — run the dev-users seeder first.',
      );
    }

    const existing = (await queryInterface.sequelize.query('SELECT name FROM clients', {
      type: 'SELECT',
    })) as Array<{ name: string }>;
    const existingNames = new Set(existing.map((c) => c.name));

    const rows = DEV_CLIENTS.filter((c) => !existingNames.has(c.name)).map((c) => ({
      id: randomUUID(),
      name: c.name,
      short_name: c.shortName,
      email: c.email,
      phone: null,
      website: null,
      industry: c.industry,
      address: null,
      logo_url: null,
      status: 'active',
      created_by: admin.id,
      created_at: new Date(),
      updated_at: new Date(),
    }));

    if (rows.length > 0) {
      await queryInterface.bulkInsert('clients', rows);
    }
  },

  down: async (queryInterface: QueryInterface) => {
    await queryInterface.bulkDelete('clients', {
      name: DEV_CLIENTS.map((c) => c.name),
    });
  },
};
