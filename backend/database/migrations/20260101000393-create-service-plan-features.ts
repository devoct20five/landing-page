import { DataTypes, QueryInterface } from 'sequelize';
import { uuidPk } from '../helpers/columns';

// Mirrors src/modules/services/models/service-plan-feature.model.ts
module.exports = {
  up: async (queryInterface: QueryInterface) => {
    await queryInterface.createTable('service_plan_features', {
      id: uuidPk,
      plan_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: { model: 'service_plans', key: 'id' },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      feature_text: { type: DataTypes.STRING(255), allowNull: false },
      sort_order: { type: DataTypes.SMALLINT.UNSIGNED, allowNull: false, defaultValue: 0 },
    });

    await queryInterface.addIndex('service_plan_features', ['plan_id']);
  },

  down: async (queryInterface: QueryInterface) => {
    await queryInterface.dropTable('service_plan_features');
  },
};
