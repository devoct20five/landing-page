import { QueryInterface } from 'sequelize';

const PROFILES = [
  {
    email: 'manager@example.com',
    department: 'Production',
    designation: 'Production Manager',
    employmentType: 'full-time',
    joinDate: '2023-02-01',
    salary: 95000,
    payCycle: 'monthly',
  },
  {
    email: 'staff@example.com',
    department: 'Design',
    designation: 'Senior Designer',
    employmentType: 'full-time',
    joinDate: '2023-06-15',
    salary: 62000,
    payCycle: 'monthly',
  },
];

module.exports = {
  up: async (queryInterface: QueryInterface) => {
    const users = (await queryInterface.sequelize.query(
      `SELECT id, email FROM users WHERE email IN (:emails)`,
      { type: 'SELECT', replacements: { emails: PROFILES.map((p) => p.email) } },
    )) as Array<{ id: string; email: string }>;
    const userIdByEmail = new Map(users.map((u) => [u.email, u.id]));

    const existing = (await queryInterface.sequelize.query(
      'SELECT user_id FROM staff_profiles',
      { type: 'SELECT' },
    )) as Array<{ user_id: string }>;
    const existingIds = new Set(existing.map((e) => e.user_id));

    const rows: Record<string, unknown>[] = [];
    for (const p of PROFILES) {
      const userId = userIdByEmail.get(p.email);
      if (!userId || existingIds.has(userId)) continue;
      rows.push({
        user_id: userId,
        department: p.department,
        designation: p.designation,
        employment_type: p.employmentType,
        join_date: p.joinDate,
        salary: p.salary,
        currency: 'INR',
        pay_cycle: p.payCycle,
        payment_method: 'bank_transfer',
      });
    }

    if (rows.length > 0) {
      await queryInterface.bulkInsert('staff_profiles', rows);
    }
  },

  down: async (queryInterface: QueryInterface) => {
    const users = (await queryInterface.sequelize.query(
      `SELECT id FROM users WHERE email IN (:emails)`,
      { type: 'SELECT', replacements: { emails: PROFILES.map((p) => p.email) } },
    )) as Array<{ id: string }>;
    const ids = users.map((u) => u.id);
    if (ids.length > 0) {
      await queryInterface.bulkDelete('staff_profiles', { user_id: ids });
    }
  },
};
