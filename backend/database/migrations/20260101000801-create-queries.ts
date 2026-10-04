import { DataTypes, QueryInterface } from 'sequelize';
import { uuidPk, timestamps } from '../helpers/columns';

// Mirrors src/modules/queries/models/query.model.ts. Table name is
// `queries` (the model's actual @Table tableName), not `support_queries`
// as the original plan's naming suggested — matching the model exactly.
//
// Note (spec §44): this is a single subject+message record per query, not
// a threaded conversation. If a real message thread is needed later
// that's a new query_messages table and a deliberate model change, not
// something this migration should invent unasked.
module.exports = {
  up: async (queryInterface: QueryInterface) => {
    await queryInterface.createTable('queries', {
      id: uuidPk,
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
      subject: { type: DataTypes.STRING(255), allowNull: false },
      message: { type: DataTypes.TEXT, allowNull: false },
      category: { type: DataTypes.STRING(60), allowNull: true },
      priority: {
        type: DataTypes.ENUM('low', 'medium', 'high'),
        allowNull: false,
        defaultValue: 'medium',
      },
      status: {
        type: DataTypes.ENUM('open', 'in-progress', 'resolved', 'closed'),
        allowNull: false,
        defaultValue: 'open',
      },
      assigned_to: {
        type: DataTypes.UUID,
        allowNull: true,
        references: { model: 'users', key: 'id' },
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
      },
      resolved_at: { type: DataTypes.DATE, allowNull: true },
      ...timestamps(),
    });

    await queryInterface.addIndex('queries', ['client_id']);
    await queryInterface.addIndex('queries', ['status']);
    await queryInterface.addIndex('queries', ['assigned_to']);
  },

  down: async (queryInterface: QueryInterface) => {
    await queryInterface.dropTable('queries');
  },
};
