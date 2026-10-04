import { DataTypes, QueryInterface } from 'sequelize';
import { uuidPk } from '../helpers/columns';

// Mirrors src/modules/services/models/service.model.ts.
//
// Sequenced *before* projects (0004xx) even though "Services" is a later
// feature phase in the project plan: Project.currentWorkServiceId and the
// project_services join table both FK into this table, so it has to exist
// first. Migration order follows the dependency graph, not the feature
// roadmap — see docs/00_CURRENT_STATE_AUDIT.md.
module.exports = {
  up: async (queryInterface: QueryInterface) => {
    await queryInterface.createTable('services', {
      id: uuidPk,
      slug: { type: DataTypes.STRING(60), allowNull: false, unique: true },
      name: { type: DataTypes.STRING(100), allowNull: false },
      hero_headline: { type: DataTypes.STRING(255), allowNull: true },
      hero_tag: { type: DataTypes.STRING(100), allowNull: true },
      hero_image_url: { type: DataTypes.STRING(500), allowNull: true },
      is_active: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
      sort_order: { type: DataTypes.SMALLINT.UNSIGNED, allowNull: false, defaultValue: 0 },
      created_at: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
    });

    await queryInterface.addIndex('services', ['is_active']);
  },

  down: async (queryInterface: QueryInterface) => {
    await queryInterface.dropTable('services');
  },
};
