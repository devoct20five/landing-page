import { DataTypes, QueryInterface } from 'sequelize';
import { uuidPk, timestamps } from '../helpers/columns';

// Mirrors src/modules/invoices/models/invoice.model.ts.
//
// Money is stored as DECIMAL(14,2), matching the model exactly (not
// integer minor units — spec §92 recommends minor units, but changing the
// representation is a model-level decision for a later pass, not
// something a migration should silently diverge on from what
// Invoice/PaymentTransaction actually declare today).
module.exports = {
  up: async (queryInterface: QueryInterface) => {
    await queryInterface.createTable('invoices', {
      id: uuidPk,
      invoice_number: { type: DataTypes.STRING(40), allowNull: false, unique: true },
      client_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: { model: 'clients', key: 'id' },
        onDelete: 'RESTRICT',
        onUpdate: 'CASCADE',
      },
      project_id: {
        type: DataTypes.UUID,
        allowNull: true,
        references: { model: 'projects', key: 'id' },
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
      },
      amount: { type: DataTypes.DECIMAL(14, 2), allowNull: false },
      amount_paid: { type: DataTypes.DECIMAL(14, 2), allowNull: false, defaultValue: 0 },
      currency: { type: DataTypes.STRING(10), allowNull: false, defaultValue: 'INR' },
      status: {
        type: DataTypes.ENUM('draft', 'pending', 'paid', 'overdue', 'cancelled'),
        allowNull: false,
        defaultValue: 'pending',
      },
      description: { type: DataTypes.STRING(255), allowNull: true },
      issue_date: { type: DataTypes.DATEONLY, allowNull: true },
      due_date: { type: DataTypes.DATEONLY, allowNull: false },
      created_by: {
        type: DataTypes.UUID,
        allowNull: true,
        references: { model: 'users', key: 'id' },
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
      },
      ...timestamps(),
    });

    // client_id + status: the exact pair a client's "my outstanding
    // invoices" view and the admin finance dashboard both filter on.
    await queryInterface.addIndex('invoices', ['client_id']);
    await queryInterface.addIndex('invoices', ['project_id']);
    await queryInterface.addIndex('invoices', ['status']);
  },

  down: async (queryInterface: QueryInterface) => {
    await queryInterface.dropTable('invoices');
  },
};
