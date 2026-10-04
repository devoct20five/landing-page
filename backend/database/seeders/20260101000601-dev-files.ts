import { QueryInterface } from 'sequelize';
import { randomUUID } from 'crypto';

// storage_url mirrors how FilesService actually stores uploads (a local
// path under FILE_STORAGE_ROOT, default ./storage — see files.service.ts).
// This seeded row points at a path that won't resolve to a real file on
// disk; that's fine for exercising list/metadata endpoints, but the
// download endpoint will 404/error against it until a real file is
// uploaded through the API. Documented in database/README.md.
module.exports = {
  up: async (queryInterface: QueryInterface) => {
    const project = (
      (await queryInterface.sequelize.query(
        `SELECT id FROM projects WHERE name = 'Northwind Rebrand 2026' LIMIT 1`,
        { type: 'SELECT' },
      )) as Array<{ id: string }>
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

    const existingFolder = (
      (await queryInterface.sequelize.query(
        `SELECT id FROM folders WHERE project_id = :pid AND name = 'Logo Concepts' LIMIT 1`,
        { type: 'SELECT', replacements: { pid: project.id } },
      )) as Array<{ id: string }>
    )[0];
    if (existingFolder) return;

    const folderId = randomUUID();
    await queryInterface.bulkInsert('folders', [
      {
        id: folderId,
        project_id: project.id,
        parent_id: null,
        name: 'Logo Concepts',
        created_by: staff.id,
        created_at: new Date(),
      },
    ]);

    await queryInterface.bulkInsert('files', [
      {
        id: randomUUID(),
        folder_id: folderId,
        project_id: project.id,
        name: 'northwind-logo-concept-v2.png',
        file_type: 'image',
        mime_type: 'image/png',
        size_bytes: 482300,
        storage_url: './storage/seed/northwind-logo-concept-v2.png',
        version: '02',
        uploaded_by: staff.id,
        created_at: new Date(),
      },
    ]);
  },

  down: async (queryInterface: QueryInterface) => {
    const project = (
      (await queryInterface.sequelize.query(
        `SELECT id FROM projects WHERE name = 'Northwind Rebrand 2026' LIMIT 1`,
        { type: 'SELECT' },
      )) as Array<{ id: string }>
    )[0];
    if (!project) return;
    await queryInterface.bulkDelete('files', { project_id: project.id });
    await queryInterface.bulkDelete('folders', { project_id: project.id });
  },
};
