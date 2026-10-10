import { QueryInterface } from 'sequelize';
import { randomUUID } from 'crypto';

// Adds orders.view to an existing database (admin + manager).
module.exports = {
  up: async (qi: QueryInterface) => {
    const q = (sql: string) => qi.sequelize.query(sql, { type: 'SELECT' }) as Promise<any[]>;
    let [perm] = await q("SELECT id FROM permissions WHERE slug='orders.view'");
    if (!perm) {
      perm = { id: randomUUID() };
      await qi.bulkInsert('permissions', [{ id: perm.id, module: 'orders', action: 'view', slug: 'orders.view', description: 'View storefront orders' }]);
    }
    for (const slug of ['admin', 'manager']) {
      const [role] = await q(`SELECT id FROM roles WHERE slug='${slug}'`);
      if (!role) continue;
      const [has] = await q(`SELECT 1 AS x FROM role_permissions WHERE role_id='${role.id}' AND permission_id='${perm.id}'`);
      if (!has) await qi.bulkInsert('role_permissions', [{ role_id: role.id, permission_id: perm.id }]);
    }
  },
  down: async () => {},
};
