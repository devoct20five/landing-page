import { DataTypes, QueryInterface } from 'sequelize';
import { uuidPk, timestamps } from '../helpers/columns';

// Mirrors src/modules/projects/models/project.model.ts.
//
// Note on project ownership (docs/00_CURRENT_STATE_AUDIT.md §34 /
// spec §34): the model has no true "owner" FK, only
// project_team_members.role_on_project (a free-text string, see the next
// migration). This migration does not invent an owner column — the
// backend service layer must either add one deliberately later or label
// the UI as "team" rather than faking an owner from team-member order.
module.exports = {
  up: async (queryInterface: QueryInterface) => {
    await queryInterface.createTable('projects', {
      id: uuidPk,
      client_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: { model: 'clients', key: 'id' },
        onDelete: 'RESTRICT',
        onUpdate: 'CASCADE',
      },
      name: { type: DataTypes.STRING(150), allowNull: false },
      description: { type: DataTypes.TEXT, allowNull: true },
      status: {
        type: DataTypes.ENUM(
          'not-started',
          'in-progress',
          'client-review',
          'blocked',
          'completed',
          'cancelled',
        ),
        allowNull: false,
        defaultValue: 'not-started',
      },
      progress_percent: { type: DataTypes.TINYINT.UNSIGNED, allowNull: false, defaultValue: 0 },
      team_size: { type: DataTypes.SMALLINT.UNSIGNED, allowNull: false, defaultValue: 0 },
      attention_reason: { type: DataTypes.STRING(255), allowNull: true },
      current_work_title: { type: DataTypes.STRING(255), allowNull: true },
      current_work_service_id: {
        type: DataTypes.UUID,
        allowNull: true,
        references: { model: 'services', key: 'id' },
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
      },
      current_work_description: { type: DataTypes.TEXT, allowNull: true },
      deadline: { type: DataTypes.DATEONLY, allowNull: true },
      created_by: {
        type: DataTypes.UUID,
        allowNull: false,
        references: { model: 'users', key: 'id' },
        onDelete: 'RESTRICT',
        onUpdate: 'CASCADE',
      },
      ...timestamps(),
    });

    // These four match the exact query patterns docs/00_CURRENT_STATE_AUDIT.md
    // flags as currently unscoped/IDOR-prone (§3): once ProjectsService is
    // fixed to filter by the caller's resolved clientId/staffId, those
    // queries need to hit an index, not scan every project.
    await queryInterface.addIndex('projects', ['client_id']);
    await queryInterface.addIndex('projects', ['status']);
    await queryInterface.addIndex('projects', ['deadline']);
  },

  down: async (queryInterface: QueryInterface) => {
    await queryInterface.dropTable('projects');
  },
};
