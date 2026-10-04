import { DataTypes, QueryInterface } from 'sequelize';

// Mirrors src/modules/projects/models/project-team-member.model.ts
module.exports = {
  up: async (queryInterface: QueryInterface) => {
    await queryInterface.createTable('project_team_members', {
      project_id: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
        references: { model: 'projects', key: 'id' },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      staff_id: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
        references: { model: 'users', key: 'id' },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      role_on_project: { type: DataTypes.STRING(100), allowNull: true },
      assigned_at: { type: DataTypes.DATE, allowNull: true },
    });

    // "which projects is this staff member assigned to" — the exact query
    // needed to scope a staff user's project list to their assignments
    // (docs/00_CURRENT_STATE_AUDIT.md §3/§11).
    await queryInterface.addIndex('project_team_members', ['staff_id']);
  },

  down: async (queryInterface: QueryInterface) => {
    await queryInterface.dropTable('project_team_members');
  },
};
