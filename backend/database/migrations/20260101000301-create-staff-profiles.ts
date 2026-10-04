import { DataTypes, QueryInterface } from 'sequelize';

// Mirrors src/modules/staff/models/staff-profile.model.ts.
//
// 1:1 extension of `users`: user_id is both the PK and FK, not a separate
// UUID. A staff user resolves their own profile via their JWT user id
// directly — no separate "staffId" needs to be looked up (see note in
// 20260101000302-create-attendance.ts about the staffId/userId naming).
module.exports = {
  up: async (queryInterface: QueryInterface) => {
    await queryInterface.createTable('staff_profiles', {
      user_id: {
        type: DataTypes.UUID,
        primaryKey: true,
        allowNull: false,
        references: { model: 'users', key: 'id' },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      department: { type: DataTypes.STRING(100), allowNull: true },
      designation: { type: DataTypes.STRING(100), allowNull: true },
      employment_type: {
        type: DataTypes.ENUM('full-time', 'part-time', 'contract', 'intern'),
        allowNull: false,
        defaultValue: 'full-time',
      },
      join_date: { type: DataTypes.DATEONLY, allowNull: true },
      salary: { type: DataTypes.DECIMAL(12, 2), allowNull: true },
      currency: { type: DataTypes.STRING(10), allowNull: false, defaultValue: 'INR' },
      pay_cycle: {
        type: DataTypes.ENUM('monthly', 'weekly', 'biweekly'),
        allowNull: false,
        defaultValue: 'monthly',
      },
      payment_method: { type: DataTypes.STRING(50), allowNull: true },
    });

    await queryInterface.addIndex('staff_profiles', ['department']);
  },

  down: async (queryInterface: QueryInterface) => {
    await queryInterface.dropTable('staff_profiles');
  },
};
