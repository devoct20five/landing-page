import { DataTypes, QueryInterface } from 'sequelize';
import { uuidPk } from '../helpers/columns';

// Mirrors src/modules/roles/models/role.model.ts
module.exports = {
  up: async (queryInterface: QueryInterface) => {
    await queryInterface.createTable('roles', {
      id: uuidPk,
      name: { type: DataTypes.STRING(60), allowNull: false },
      slug: { type: DataTypes.STRING(60), allowNull: false, unique: true },
      description: { type: DataTypes.STRING(255), allowNull: true },
      // "is_system" is a TINYINT in the model (matches Sequelize's default
      // BOOLEAN-as-TINYINT(1) mapping on MySQL) protecting admin/manager/
      // staff/client from deletion or rename via the API.
      is_system: { type: DataTypes.TINYINT, allowNull: false, defaultValue: 0 },
      created_at: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
    });
  },

  down: async (queryInterface: QueryInterface) => {
    await queryInterface.dropTable('roles');
  },
};
