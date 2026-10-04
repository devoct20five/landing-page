import { DataTypes, QueryInterface } from 'sequelize';
import { uuidPk } from '../helpers/columns';

// Mirrors src/modules/staff/models/attendance.model.ts.
//
// NOTE (docs/00_CURRENT_STATE_AUDIT.md §30): `staff_id` here is a direct FK
// to `users.id` — the same id a logged-in staff member already has from
// their JWT. There is no separate "staff id" to resolve; the audit's
// concern was about the *service layer* possibly expecting a different id
// shape, not a schema mismatch. Confirmed at the model level: staff_id,
// staff_profiles.user_id and payroll.staff_id all reference the same
// users.id space.
module.exports = {
  up: async (queryInterface: QueryInterface) => {
    await queryInterface.createTable('attendance', {
      id: uuidPk,
      staff_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: { model: 'users', key: 'id' },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      work_date: { type: DataTypes.DATEONLY, allowNull: false },
      status: {
        type: DataTypes.ENUM('present', 'late', 'remote', 'leave', 'absent'),
        allowNull: false,
      },
      check_in: { type: DataTypes.TIME, allowNull: true },
      check_out: { type: DataTypes.TIME, allowNull: true },
      work_mode: { type: DataTypes.ENUM('Office', 'Remote'), allowNull: true },
      hours_worked: { type: DataTypes.DECIMAL(5, 2), allowNull: true },
      notes: { type: DataTypes.STRING(255), allowNull: true },
      created_at: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
    });

    // One attendance record per staff member per day — matches the
    // model's own unique index and is what makes check-in/check-out
    // idempotent per day.
    await queryInterface.addIndex('attendance', ['staff_id', 'work_date'], {
      unique: true,
      name: 'attendance_staff_id_work_date_unique',
    });
    // "attendance for date range across all staff" (admin filter view).
    await queryInterface.addIndex('attendance', ['work_date']);
  },

  down: async (queryInterface: QueryInterface) => {
    await queryInterface.dropTable('attendance');
  },
};
