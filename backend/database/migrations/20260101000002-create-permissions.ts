import { DataTypes, QueryInterface } from 'sequelize';
import { uuidPk } from '../helpers/columns';

// Mirrors src/modules/roles/models/permission.model.ts
module.exports = {
  up: async (queryInterface: QueryInterface) => {
    await queryInterface.createTable('permissions', {
      id: uuidPk,
      module: { type: DataTypes.STRING(60), allowNull: false },
      action: { type: DataTypes.STRING(60), allowNull: false },
      // "module.action", e.g. "projects.view" — this is the literal string
      // @RequirePermissions() checks against, so it must stay unique.
      slug: { type: DataTypes.STRING(120), allowNull: false, unique: true },
      description: { type: DataTypes.STRING(255), allowNull: true },
    });

    // module + action lookups (e.g. "everything under projects.*") are a
    // natural admin-UI query pattern; slug already has its own unique index.
    await queryInterface.addIndex('permissions', ['module']);
  },

  down: async (queryInterface: QueryInterface) => {
    await queryInterface.dropTable('permissions');
  },
};
