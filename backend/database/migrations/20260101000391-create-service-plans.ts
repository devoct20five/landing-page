import { DataTypes, QueryInterface } from 'sequelize';
import { uuidPk } from '../helpers/columns';

// Mirrors src/modules/services/models/service-plan.model.ts
module.exports = {
  up: async (queryInterface: QueryInterface) => {
    await queryInterface.createTable('service_plans', {
      id: uuidPk,
      service_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: { model: 'services', key: 'id' },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      name: { type: DataTypes.STRING(100), allowNull: false },
      icon: { type: DataTypes.STRING(60), allowNull: true },
      price: { type: DataTypes.DECIMAL(12, 2), allowNull: true },
      total_price: { type: DataTypes.DECIMAL(12, 2), allowNull: true },
      discount_percent: { type: DataTypes.DECIMAL(5, 2), allowNull: false, defaultValue: 0 },
      is_featured: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
      is_active: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
      sort_order: { type: DataTypes.SMALLINT.UNSIGNED, allowNull: false, defaultValue: 0 },
      created_at: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
    });

    await queryInterface.addIndex('service_plans', ['service_id']);
  },

  down: async (queryInterface: QueryInterface) => {
    await queryInterface.dropTable('service_plans');
  },
};
