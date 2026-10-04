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
    const manager = (
      (await queryInterface.sequelize.query(
        `SELECT id FROM users WHERE email = 'manager@example.com' LIMIT 1`,
        { type: 'SELECT' },
      )) as Array<{ id: string }>
    )[0];

    if (!project || !staff || !manager) {
      throw new Error('Seeder error: prerequisite project/users not found — run earlier seeders first.');
    }

    const existing = (
      (await queryInterface.sequelize.query(
        `SELECT COUNT(*) AS c FROM tasks WHERE project_id = :pid`,
        { type: 'SELECT', replacements: { pid: project.id } },
      )) as Array<{ c: number }>
    )[0];
    if (Number(existing.c) > 0) return;

    const soon = new Date();
    soon.setDate(soon.getDate() + 3);
    const later = new Date();
    later.setDate(later.getDate() + 10);

    const task1Id = randomUUID();
    const task2Id = randomUUID();
    const task3Id = randomUUID();

    await queryInterface.bulkInsert('tasks', [
      {
        id: task1Id,
        project_id: project.id,
        client_id: project.client_id,
        assignee_id: staff.id,
        service_id: null,
        title: 'Refine logo concept per client feedback',
        description: 'Client asked for a bolder wordmark treatment — see approval feedback.',
        status: 'in-progress',
        priority: 'high',
        due_date: soon.toISOString().slice(0, 10),
        created_by: manager.id,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: task2Id,
        project_id: project.id,
        client_id: project.client_id,
        assignee_id: staff.id,
        service_id: null,
        title: 'Draft brand guidelines outline',
        description: null,
        status: 'not-started',
        priority: 'medium',
        due_date: later.toISOString().slice(0, 10),
        created_by: manager.id,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: task3Id,
        project_id: project.id,
        client_id: project.client_id,
        assignee_id: manager.id,
        service_id: null,
        title: 'Schedule client review call',
        description: null,
        status: 'completed',
        priority: 'low',
        due_date: null,
        created_by: manager.id,
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);

    await queryInterface.bulkInsert('task_comments', [
      {
        id: randomUUID(),
        task_id: task1Id,
        user_id: manager.id,
        comment: 'Client specifically mentioned they want the wordmark to feel less delicate.',
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
    const tasks = (
      (await queryInterface.sequelize.query(`SELECT id FROM tasks WHERE project_id = :pid`, {
        type: 'SELECT',
        replacements: { pid: project.id },
      })) as Array<{ id: string }>
    ).map((t) => t.id);
    if (tasks.length > 0) {
      await queryInterface.bulkDelete('task_comments', { task_id: tasks });
      await queryInterface.bulkDelete('tasks', { id: tasks });
    }
  },
};
