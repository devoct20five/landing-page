import { QueryInterface } from 'sequelize';
import { randomUUID } from 'crypto';

module.exports = {
  up: async (queryInterface: QueryInterface) => {
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
    if (!admin || !manager) {
      throw new Error('Seeder error: dev-users seeder must run first.');
    }

    const existing = (
      (await queryInterface.sequelize.query(
        `SELECT id FROM job_postings WHERE title = 'Mid-Level Graphic Designer' LIMIT 1`,
        { type: 'SELECT' },
      )) as Array<{ id: string }>
    )[0];
    if (existing) return;

    const jobId = randomUUID();
    const deadline = new Date();
    deadline.setDate(deadline.getDate() + 30);

    await queryInterface.bulkInsert('job_postings', [
      {
        id: jobId,
        title: 'Mid-Level Graphic Designer',
        department: 'Design',
        employment_type: 'Full-time',
        location: 'Remote',
        description: 'Own visual design for client-facing deliverables across brand and social.',
        status: 'open',
        posted_at: new Date().toISOString().slice(0, 10),
        deadline: deadline.toISOString().slice(0, 10),
        created_by: admin.id,
        created_at: new Date(),
      },
    ]);

    const candidateId = randomUUID();
    await queryInterface.bulkInsert('candidates', [
      {
        id: candidateId,
        job_id: jobId,
        name: 'Priya Sharma',
        email: 'priya.sharma@example.com',
        phone: '+91 98765 43210',
        resume_url: null,
        experience_years: 3.5,
        stage: 'shortlisted',
        applied_at: new Date(),
        updated_at: new Date(),
      },
    ]);

    await queryInterface.bulkInsert('candidate_notes', [
      {
        id: randomUUID(),
        candidate_id: candidateId,
        user_id: manager.id,
        note: 'Strong portfolio, especially packaging work. Move to interview.',
        created_at: new Date(),
      },
    ]);
  },

  down: async (queryInterface: QueryInterface) => {
    const job = (
      (await queryInterface.sequelize.query(
        `SELECT id FROM job_postings WHERE title = 'Mid-Level Graphic Designer' LIMIT 1`,
        { type: 'SELECT' },
      )) as Array<{ id: string }>
    )[0];
    if (!job) return;
    const candidates = (
      (await queryInterface.sequelize.query(`SELECT id FROM candidates WHERE job_id = :jid`, {
        type: 'SELECT',
        replacements: { jid: job.id },
      })) as Array<{ id: string }>
    ).map((c) => c.id);
    if (candidates.length > 0) {
      await queryInterface.bulkDelete('candidate_notes', { candidate_id: candidates });
      await queryInterface.bulkDelete('candidates', { id: candidates });
    }
    await queryInterface.bulkDelete('job_postings', { id: job.id });
  },
};
