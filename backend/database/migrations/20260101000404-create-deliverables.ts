import { DataTypes, QueryInterface } from 'sequelize';
import { uuidPk, timestamps } from '../helpers/columns';

// Mirrors src/modules/projects/models/deliverable.model.ts
module.exports = {
  up: async (queryInterface: QueryInterface) => {
    await queryInterface.createTable('deliverables', {
      id: uuidPk,
      project_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: { model: 'projects', key: 'id' },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      service_id: {
        type: DataTypes.UUID,
        allowNull: true,
        references: { model: 'services', key: 'id' },
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
      },
      title: { type: DataTypes.STRING(255), allowNull: false },
      status: {
        type: DataTypes.ENUM('pending', 'in-progress', 'client-review', 'approved', 'delivered'),
        allowNull: false,
        defaultValue: 'pending',
      },
      due_date: { type: DataTypes.DATEONLY, allowNull: true },
      ...timestamps(),
    });

    await queryInterface.addIndex('deliverables', ['project_id']);
    await queryInterface.addIndex('deliverables', ['status']);
  },

  down: async (queryInterface: QueryInterface) => {
    await queryInterface.dropTable('deliverables');
  },
};
