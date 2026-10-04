import { QueryInterface } from 'sequelize';
import { randomUUID } from 'crypto';

module.exports = {
  up: async (queryInterface: QueryInterface) => {
    const project = (
      (await queryInterface.sequelize.query(
        `SELECT id, client_id FROM projects WHERE name = 'Northwind Rebrand 2026' LIMIT 1`,
        { type: 'SELECT' },
      )) as Array<{ id: string; client_id: string }>
    )[0];
    const deliverable = (
      (await queryInterface.sequelize.query(
        `SELECT id FROM deliverables WHERE title = 'Logo concept round 2' LIMIT 1`,
        { type: 'SELECT' },
      )) as Array<{ id: string }>
    )[0];
    const file = (
      (await queryInterface.sequelize.query(
        `SELECT id FROM files WHERE name = 'northwind-logo-concept-v2.png' LIMIT 1`,
        { type: 'SELECT' },
      )) as Array<{ id: string }>
    )[0];
    const manager = (
      (await queryInterface.sequelize.query(
        `SELECT id FROM users WHERE email = 'manager@example.com' LIMIT 1`,
        { type: 'SELECT' },
      )) as Array<{ id: string }>
    )[0];

    if (!project || !deliverable || !manager) {
      throw new Error(
        'Seeder error: prerequisite project/deliverable/user not found — run earlier seeders first.',
      );
    }

    const existing = (
      (await queryInterface.sequelize.query(
        `SELECT id FROM approvals WHERE deliverable_id = :did LIMIT 1`,
        { type: 'SELECT', replacements: { did: deliverable.id } },
      )) as Array<{ id: string }>
    )[0];
    if (existing) return;

    await queryInterface.bulkInsert('approvals', [
      {
        id: randomUUID(),
        project_id: project.id,
        client_id: project.client_id,
        deliverable_id: deliverable.id,
        title: 'Logo concept round 2',
        version: '02',
        file_id: file ? file.id : null,
        status: 'pending',
        feedback: null,
        requested_by: manager.id,
        reviewed_by: null,
        requested_at: new Date(),
        reviewed_at: null,
      },
    ]);
  },

  down: async (queryInterface: QueryInterface) => {
    const deliverable = (
      (await queryInterface.sequelize.query(
        `SELECT id FROM deliverables WHERE title = 'Logo concept round 2' LIMIT 1`,
        { type: 'SELECT' },
      )) as Array<{ id: string }>
    )[0];
    if (deliverable) {
      await queryInterface.bulkDelete('approvals', { deliverable_id: deliverable.id });
    }
  },
};
