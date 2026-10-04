import { DataTypes, QueryInterface } from 'sequelize';
import { uuidPk } from '../helpers/columns';

// Mirrors src/modules/approvals/models/approval.model.ts.
// timestamps: false on the model, but requested_at/reviewed_at cover the
// same "when did this happen" need explicitly and are part of the
// approval lifecycle itself (spec §37: record timestamp, record decision).
module.exports = {
  up: async (queryInterface: QueryInterface) => {
    await queryInterface.createTable('approvals', {
      id: uuidPk,
      project_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: { model: 'projects', key: 'id' },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      client_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: { model: 'clients', key: 'id' },
        onDelete: 'RESTRICT',
        onUpdate: 'CASCADE',
      },
      deliverable_id: {
        type: DataTypes.UUID,
        allowNull: true,
        references: { model: 'deliverables', key: 'id' },
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
      },
      title: { type: DataTypes.STRING(255), allowNull: false },
      version: { type: DataTypes.STRING(20), allowNull: true },
      file_id: {
        type: DataTypes.UUID,
        allowNull: true,
        references: { model: 'files', key: 'id' },
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
      },
      status: {
        type: DataTypes.ENUM('pending', 'approved', 'changes-requested', 'rejected'),
        allowNull: false,
        defaultValue: 'pending',
      },
      feedback: { type: DataTypes.TEXT, allowNull: true },
      requested_by: {
        type: DataTypes.UUID,
        allowNull: true,
        references: { model: 'users', key: 'id' },
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
      },
      reviewed_by: {
        type: DataTypes.UUID,
        allowNull: true,
        references: { model: 'users', key: 'id' },
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
      },
      requested_at: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
      reviewed_at: { type: DataTypes.DATE, allowNull: true },
    });

    await queryInterface.addIndex('approvals', ['project_id']);
    await queryInterface.addIndex('approvals', ['deliverable_id']);
    await queryInterface.addIndex('approvals', ['status']);
    await queryInterface.addIndex('approvals', ['client_id']);
  },

  down: async (queryInterface: QueryInterface) => {
    await queryInterface.dropTable('approvals');
  },
};
