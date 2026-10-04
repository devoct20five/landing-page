import { QueryInterface } from 'sequelize';
import { randomUUID } from 'crypto';

module.exports = {
  up: async (queryInterface: QueryInterface) => {
    const profiles = (await queryInterface.sequelize.query(
      `SELECT sp.user_id, sp.salary, sp.currency
       FROM staff_profiles sp
       JOIN users u ON u.id = sp.user_id
       WHERE u.email IN ('manager@example.com', 'staff@example.com')`,
      { type: 'SELECT' },
    )) as Array<{ user_id: string; salary: string; currency: string }>;

    if (profiles.length === 0) {
      throw new Error(
        'Seeder error: no matching staff_profiles found — run dev-staff-profiles seeder first.',
      );
    }

    const now = new Date();
    // Previous calendar month, so "payout_status = paid" reads as a
    // completed period rather than a period still in progress.
    const prevMonth = now.getMonth() === 0 ? 12 : now.getMonth();
    const prevYear = now.getMonth() === 0 ? now.getFullYear() - 1 : now.getFullYear();

    const existing = (await queryInterface.sequelize.query(
      `SELECT staff_id FROM payroll WHERE period_month = :m AND period_year = :y`,
      { type: 'SELECT', replacements: { m: prevMonth, y: prevYear } },
    )) as Array<{ staff_id: string }>;
    const existingIds = new Set(existing.map((e) => e.staff_id));

    const rows = profiles
      .filter((p) => !existingIds.has(p.user_id))
      .map((p) => ({
        id: randomUUID(),
        staff_id: p.user_id,
        period_month: prevMonth,
        period_year: prevYear,
        salary_amount: p.salary,
        currency: p.currency,
        payout_status: 'paid',
        payout_date: new Date(prevYear, prevMonth, 1).toISOString().slice(0, 10),
        payment_method: 'bank_transfer',
        created_at: new Date(),
      }));

    if (rows.length > 0) {
      await queryInterface.bulkInsert('payroll', rows);
    }
  },

  down: async (queryInterface: QueryInterface) => {
    const profiles = (await queryInterface.sequelize.query(
      `SELECT sp.user_id
       FROM staff_profiles sp
       JOIN users u ON u.id = sp.user_id
       WHERE u.email IN ('manager@example.com', 'staff@example.com')`,
      { type: 'SELECT' },
    )) as Array<{ user_id: string }>;
    const ids = profiles.map((p) => p.user_id);
    if (ids.length > 0) {
      await queryInterface.bulkDelete('payroll', { staff_id: ids });
    }
  },
};
