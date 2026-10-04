import { DataTypes, QueryInterface } from 'sequelize';
import { uuidPk } from '../helpers/columns';

// Mirrors src/modules/invoices/models/payment-transaction.model.ts.
//
// docs/00_CURRENT_STATE_AUDIT.md §40: there is no top-level GET /payments
// endpoint today — payments.api.js on the frontend intentionally avoids
// faking one by fanning out N+1 requests. This table is what a future
// paginated GET /payments would query directly (indexed below), rather
// than the frontend aggregating per-invoice transaction lists itself.
module.exports = {
  up: async (queryInterface: QueryInterface) => {
    await queryInterface.createTable('payment_transactions', {
      id: uuidPk,
      invoice_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: { model: 'invoices', key: 'id' },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      amount: { type: DataTypes.DECIMAL(14, 2), allowNull: false },
      method: { type: DataTypes.STRING(50), allowNull: true },
      reference: { type: DataTypes.STRING(100), allowNull: true },
      paid_at: { type: DataTypes.DATE, allowNull: true },
      status: {
        type: DataTypes.ENUM('pending', 'success', 'failed', 'refunded'),
        allowNull: false,
        defaultValue: 'pending',
      },
      created_at: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
    });

    await queryInterface.addIndex('payment_transactions', ['invoice_id']);
    await queryInterface.addIndex('payment_transactions', ['status']);
    await queryInterface.addIndex('payment_transactions', ['paid_at']);
  },

  down: async (queryInterface: QueryInterface) => {
    await queryInterface.dropTable('payment_transactions');
  },
};
