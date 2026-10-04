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
    const staff = (
      (await queryInterface.sequelize.query(
        `SELECT id FROM users WHERE email = 'staff@example.com' LIMIT 1`,
        { type: 'SELECT' },
      )) as Array<{ id: string }>
    )[0];
    if (!project || !staff) {
      throw new Error('Seeder error: prerequisite project/user not found — run earlier seeders first.');
    }

    const existing = (
      (await queryInterface.sequelize.query(
        `SELECT id FROM behind_the_work WHERE title = 'Behind the Northwind logo refresh' LIMIT 1`,
        { type: 'SELECT' },
      )) as Array<{ id: string }>
    )[0];
    if (existing) return;

    await queryInterface.bulkInsert('behind_the_work', [
      {
        id: randomUUID(),
        content_type: 'photo',
        title: 'Behind the Northwind logo refresh',
        description: 'Early sketches and concept boards from the Northwind rebrand.',
        project_id: project.id,
        client_id: project.client_id,
        thumbnail_url: null,
        media_url: './storage/seed/btw-northwind-sketches.jpg',
        status: 'published',
        author_id: staff.id,
        created_at: new Date(),
        published_at: new Date(),
      },
    ]);
  },

  down: async (queryInterface: QueryInterface) => {
    await queryInterface.bulkDelete('behind_the_work', {
      title: 'Behind the Northwind logo refresh',
    });
  },
};
