import { QueryInterface } from 'sequelize';
import { randomUUID } from 'crypto';
import { PERMISSION_CATALOG } from '../helpers/permission-catalog';

module.exports = {
  up: async (queryInterface: QueryInterface) => {
    const rows = PERMISSION_CATALOG.map((p) => ({
      id: randomUUID(),
      module: p.module,
      action: p.action,
      slug: `${p.module}.${p.action}`,
      description: p.description,
    }));

    // Idempotent: safe to re-run against a DB that already has some rows
    // (e.g. after adding new permissions to the catalog) without duplicating
    // existing slugs.
    const existing = (await queryInterface.sequelize.query(
      'SELECT slug FROM permissions',
      { type: 'SELECT' },
    )) as Array<{ slug: string }>;
    const existingSlugs = new Set(existing.map((r) => r.slug));
    const toInsert = rows.filter((r) => !existingSlugs.has(r.slug));

    if (toInsert.length > 0) {
      await queryInterface.bulkInsert('permissions', toInsert);
    }
  },

  down: async (queryInterface: QueryInterface) => {
    const slugs = PERMISSION_CATALOG.map((p) => `${p.module}.${p.action}`);
    await queryInterface.bulkDelete('permissions', { slug: slugs });
  },
};
