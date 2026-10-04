import { DataTypes, QueryInterface } from 'sequelize';
import { uuidPk } from '../helpers/columns';

// Mirrors src/modules/staff/models/payroll.model.ts
module.exports = {
  up: async (queryInterface: QueryInterface) => {
    await queryInterface.createTable('payroll', {
      id: uuidPk,
      staff_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: { model: 'users', key: 'id' },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      period_month: { type: DataTypes.TINYINT.UNSIGNED, allowNull: false },
      period_year: { type: DataTypes.SMALLINT.UNSIGNED, allowNull: false },
      salary_amount: { type: DataTypes.DECIMAL(12, 2), allowNull: false },
      currency: { type: DataTypes.STRING(10), allowNull: false, defaultValue: 'INR' },
      payout_status: {
        type: DataTypes.ENUM('paid', 'pending', 'overdue'),
        allowNull: false,
        defaultValue: 'pending',
      },
      payout_date: { type: DataTypes.DATEONLY, allowNull: true },
      payment_method: { type: DataTypes.STRING(50), allowNull: true },
      created_at: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
    });

    // One payroll record per staff member per period — matches the
    // model's unique index; also the natural "has this period been run
    // for this person yet" existence check.
    await queryInterface.addIndex('payroll', ['staff_id', 'period_month', 'period_year'], {
      unique: true,
      name: 'payroll_staff_id_period_unique',
    });
    await queryInterface.addIndex('payroll', ['payout_status']);
  },

  down: async (queryInterface: QueryInterface) => {
    await queryInterface.dropTable('payroll');
  },
};
