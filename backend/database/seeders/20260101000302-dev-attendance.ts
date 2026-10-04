import { QueryInterface } from 'sequelize';
import { randomUUID } from 'crypto';

// Five weekdays of attendance for staff@example.com, ending yesterday, so
// the "own attendance history" view has something real to render without
// depending on wall-clock "today" edge cases in a demo.
module.exports = {
  up: async (queryInterface: QueryInterface) => {
    const user = (
      (await queryInterface.sequelize.query(
        `SELECT id FROM users WHERE email = 'staff@example.com' LIMIT 1`,
        { type: 'SELECT' },
      )) as Array<{ id: string }>
    )[0];
    if (!user) {
      throw new Error('Seeder error: staff@example.com not found — run dev-users seeder first.');
    }

    const existing = (
      (await queryInterface.sequelize.query(
        `SELECT COUNT(*) AS c FROM attendance WHERE staff_id = :id`,
        { type: 'SELECT', replacements: { id: user.id } },
      )) as Array<{ c: number }>
    )[0];
    if (Number(existing.c) > 0) return;

    const rows: Record<string, unknown>[] = [];
    const statuses = ['present', 'present', 'remote', 'present', 'late'];
    for (let i = 5; i >= 1; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const workDate = d.toISOString().slice(0, 10);
      const status = statuses[5 - i];
      rows.push({
        id: randomUUID(),
        staff_id: user.id,
        work_date: workDate,
        status,
        check_in: status === 'late' ? '10:15:00' : '09:05:00',
        check_out: '18:30:00',
        work_mode: status === 'remote' ? 'Remote' : 'Office',
        hours_worked: 8.5,
        notes: null,
        created_at: new Date(),
      });
    }

    await queryInterface.bulkInsert('attendance', rows);
  },

  down: async (queryInterface: QueryInterface) => {
    const user = (
      (await queryInterface.sequelize.query(
        `SELECT id FROM users WHERE email = 'staff@example.com' LIMIT 1`,
        { type: 'SELECT' },
      )) as Array<{ id: string }>
    )[0];
    if (user) {
      await queryInterface.bulkDelete('attendance', { staff_id: user.id });
    }
  },
};
