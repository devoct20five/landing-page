import { DataTypes, QueryInterface } from 'sequelize';

// Mirrors src/modules/projects/models/project-service.model.ts — pure
// many-to-many join, no extra attributes.
module.exports = {
  up: async (queryInterface: QueryInterface) => {
    await queryInterface.createTable('project_services', {
      project_id: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
        references: { model: 'projects', key: 'id' },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      service_id: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
        references: { model: 'services', key: 'id' },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
    });

    await queryInterface.addIndex('project_services', ['service_id']);
  },

  down: async (queryInterface: QueryInterface) => {
    await queryInterface.dropTable('project_services');
  },
};
