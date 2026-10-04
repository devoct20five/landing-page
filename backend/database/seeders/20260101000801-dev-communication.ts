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
    const clientUser = (
      (await queryInterface.sequelize.query(
        `SELECT id FROM users WHERE email = 'client@example.com' LIMIT 1`,
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

    if (!project || !clientUser || !manager || !staff) {
      throw new Error('Seeder error: prerequisite rows not found — run earlier seeders first.');
    }

    const already = (
      (await queryInterface.sequelize.query(`SELECT COUNT(*) AS c FROM queries`, {
        type: 'SELECT',
      })) as Array<{ c: number }>
    )[0];
    if (Number(already.c) > 0) return;

    // Support query
    await queryInterface.bulkInsert('queries', [
      {
        id: randomUUID(),
        client_id: project.client_id,
        project_id: project.id,
        subject: 'Question about file formats for print',
        message: 'Can you deliver the final logo files as both AI and PDF?',
        category: 'files',
        priority: 'low',
        status: 'open',
        assigned_to: manager.id,
        resolved_at: null,
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);

    // Event
    const eventId = randomUUID();
    const eventDate = new Date();
    eventDate.setDate(eventDate.getDate() + 5);
    await queryInterface.bulkInsert('events', [
      {
        id: eventId,
        title: 'Logo concept review call',
        description: 'Walk through round 2 concepts with Northwind.',
        event_type: 'review',
        event_date: eventDate.toISOString().slice(0, 10),
        start_time: '15:00:00',
        end_time: '15:30:00',
        location: null,
        meeting_link: 'https://meet.example.com/northwind-review',
        client_id: project.client_id,
        project_id: project.id,
        status: 'scheduled',
        created_by: manager.id,
        created_at: new Date(),
      },
    ]);
    await queryInterface.bulkInsert('event_attendees', [
      { event_id: eventId, user_id: manager.id, rsvp_status: 'accepted' },
      { event_id: eventId, user_id: clientUser.id, rsvp_status: 'invited' },
    ]);

    // Notifications
    await queryInterface.bulkInsert('notifications', [
      {
        id: randomUUID(),
        user_id: clientUser.id,
        title: 'New deliverable ready for review',
        message: 'Logo concept round 2 is ready for your approval.',
        link_url: '/client/approvals',
        is_read: false,
        created_at: new Date(),
      },
      {
        id: randomUUID(),
        user_id: staff.id,
        title: 'New task assigned',
        message: 'You were assigned "Refine logo concept per client feedback".',
        link_url: '/staff/tasks',
        is_read: false,
        created_at: new Date(),
      },
    ]);

    // Activity log
    await queryInterface.bulkInsert('activity_log', [
      {
        id: randomUUID(),
        actor_id: manager.id,
        project_id: project.id,
        client_id: project.client_id,
        activity_type: 'status',
        description: 'Project status changed to In Progress',
        metadata_json: JSON.stringify({ from: 'not-started', to: 'in-progress' }),
        created_at: new Date(),
      },
      {
        id: randomUUID(),
        actor_id: staff.id,
        project_id: project.id,
        client_id: project.client_id,
        activity_type: 'upload',
        description: 'Uploaded northwind-logo-concept-v2.png',
        metadata_json: null,
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
    await queryInterface.bulkDelete('activity_log', { project_id: project.id });
    const events = (
      (await queryInterface.sequelize.query(`SELECT id FROM events WHERE project_id = :pid`, {
        type: 'SELECT',
        replacements: { pid: project.id },
      })) as Array<{ id: string }>
    ).map((e) => e.id);
    if (events.length > 0) {
      await queryInterface.bulkDelete('event_attendees', { event_id: events });
      await queryInterface.bulkDelete('events', { id: events });
    }
    await queryInterface.bulkDelete('queries', { project_id: project.id });
    await queryInterface.bulkDelete('notifications', {
      title: ['New deliverable ready for review', 'New task assigned'],
    });
  },
};
