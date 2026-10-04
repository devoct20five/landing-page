import { QueryInterface } from 'sequelize';
import { randomUUID } from 'crypto';

module.exports = {
  up: async (queryInterface: QueryInterface) => {
    const client = (
      (await queryInterface.sequelize.query(
        `SELECT id FROM clients WHERE name = 'Northwind Studios' LIMIT 1`,
        { type: 'SELECT' },
      )) as Array<{ id: string }>
    )[0];
    const admin = (
      (await queryInterface.sequelize.query(
        `SELECT id FROM users WHERE email = 'admin@example.com' LIMIT 1`,
        { type: 'SELECT' },
      )) as Array<{ id: string }>
    )[0];
    const manager = (
      (await queryInterface.sequelize.query(
        `SELECT id FROM users WHERE email = 'manager@example.com' LIMIT 1`,
        { type: 'SELECT' },
      )) as Array<{ id: string }>
    )[0];
    const staff = (
      (await queryInterface.sequelize.query(
        `SELECT id FROM users WHERE email = 'staff@example.com' LIMIT 1`,
        { type: 'SELECT' },
      )) as Array<{ id: string }>
    )[0];
    const service = (
      (await queryInterface.sequelize.query(
        `SELECT id FROM services WHERE slug = 'brand-identity' LIMIT 1`,
        { type: 'SELECT' },
      )) as Array<{ id: string }>
    )[0];

    if (!client || !admin || !manager || !staff) {
      throw new Error(
        'Seeder error: prerequisite dev-clients/dev-users rows missing — run earlier seeders first.',
      );
    }

    const existingProject = (
      (await queryInterface.sequelize.query(
        `SELECT id FROM projects WHERE name = 'Northwind Rebrand 2026' LIMIT 1`,
        { type: 'SELECT' },
      )) as Array<{ id: string }>
    )[0];
    if (existingProject) return;

    const projectId = randomUUID();
    const deadline = new Date();
    deadline.setDate(deadline.getDate() + 21);

    await queryInterface.bulkInsert('projects', [
      {
        id: projectId,
        client_id: client.id,
        name: 'Northwind Rebrand 2026',
        description: 'Full brand identity refresh: logo, guidelines, and social templates.',
        status: 'in-progress',
        progress_percent: 40,
        team_size: 2,
        attention_reason: null,
        current_work_title: 'Logo concept round 2',
        current_work_service_id: service ? service.id : null,
        current_work_description: 'Refining logo direction based on client feedback.',
        deadline: deadline.toISOString().slice(0, 10),
        created_by: admin.id,
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);

    await queryInterface.bulkInsert('project_team_members', [
      {
        project_id: projectId,
        staff_id: manager.id,
        role_on_project: 'Project Manager',
        assigned_at: new Date(),
      },
      {
        project_id: projectId,
        staff_id: staff.id,
        role_on_project: 'Lead Designer',
        assigned_at: new Date(),
      },
    ]);

    if (service) {
      await queryInterface.bulkInsert('project_services', [
        { project_id: projectId, service_id: service.id },
      ]);
    }

    await queryInterface.bulkInsert('deliverables', [
      {
        id: randomUUID(),
        project_id: projectId,
        service_id: service ? service.id : null,
        title: 'Logo concept round 2',
        status: 'client-review',
        due_date: deadline.toISOString().slice(0, 10),
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: randomUUID(),
        project_id: projectId,
        service_id: service ? service.id : null,
        title: 'Brand guidelines document',
        status: 'pending',
        due_date: null,
        created_at: new Date(),
        updated_at: new Date(),
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
    // deliverables/project_team_members/project_services all CASCADE off
    // projects.id, so deleting the project row is sufficient — but delete
    // explicitly anyway so this seeder's down() doesn't rely on FK cascade
    // behavior working correctly to be idempotent-safe.
    await queryInterface.bulkDelete('deliverables', { project_id: project.id });
    await queryInterface.bulkDelete('project_services', { project_id: project.id });
    await queryInterface.bulkDelete('project_team_members', { project_id: project.id });
    await queryInterface.bulkDelete('projects', { id: project.id });
  },
};
