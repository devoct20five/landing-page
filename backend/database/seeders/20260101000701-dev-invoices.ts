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
    const admin = (
      (await queryInterface.sequelize.query(
        `SELECT id FROM users WHERE email = 'admin@example.com' LIMIT 1`,
        { type: 'SELECT' },
      )) as Array<{ id: string }>
    )[0];

    if (!project || !admin) {
      throw new Error('Seeder error: prerequisite project/user not found — run earlier seeders first.');
    }

    const existing = (
      (await queryInterface.sequelize.query(
        `SELECT id FROM invoices WHERE invoice_number = 'INV-2026-0001' LIMIT 1`,
        { type: 'SELECT' },
      )) as Array<{ id: string }>
    )[0];
    if (existing) return;

    const invoiceId = randomUUID();
    const issueDate = new Date();
    issueDate.setDate(issueDate.getDate() - 10);
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 20);

    await queryInterface.bulkInsert('invoices', [
      {
        id: invoiceId,
        invoice_number: 'INV-2026-0001',
        client_id: project.client_id,
        project_id: project.id,
        amount: 180000,
        amount_paid: 90000,
        currency: 'INR',
        status: 'pending',
        description: 'Northwind Rebrand 2026 — 50% milestone invoice',
        issue_date: issueDate.toISOString().slice(0, 10),
        due_date: dueDate.toISOString().slice(0, 10),
        created_by: admin.id,
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);

    await queryInterface.bulkInsert('payment_transactions', [
      {
        id: randomUUID(),
        invoice_id: invoiceId,
        amount: 90000,
        method: 'bank_transfer',
        reference: 'TXN-NW-0001',
        paid_at: issueDate,
        status: 'success',
        created_at: issueDate,
      },
    ]);
  },

  down: async (queryInterface: QueryInterface) => {
    const invoice = (
      (await queryInterface.sequelize.query(
        `SELECT id FROM invoices WHERE invoice_number = 'INV-2026-0001' LIMIT 1`,
        { type: 'SELECT' },
      )) as Array<{ id: string }>
    )[0];
    if (invoice) {
      await queryInterface.bulkDelete('payment_transactions', { invoice_id: invoice.id });
      await queryInterface.bulkDelete('invoices', { id: invoice.id });
    }
  },
};
