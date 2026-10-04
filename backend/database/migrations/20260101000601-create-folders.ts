import { DataTypes, QueryInterface } from 'sequelize';
import { uuidPk } from '../helpers/columns';

// Mirrors src/modules/files/models/folder.model.ts.
//
// Sequenced ahead of "Work" (approvals) and well ahead of the Files
// feature phase in the roadmap, for the same reason services.ts was
// pulled forward: Approval.fileId -> files.id -> (optionally) folders.id.
// Migration order follows the FK dependency graph.
//
// parent_id is a self-reference (sub-folders). Added as a second step
// via addConstraint rather than inline in createTable — MySQL/MariaDB can
// technically self-reference within one CREATE TABLE, but splitting it
// out is the more portable, easier-to-read pattern and matches how the
// other self-referencing case in this schema would be handled if one
// existed.
module.exports = {
  up: async (queryInterface: QueryInterface) => {
    await queryInterface.createTable('folders', {
      id: uuidPk,
      project_id: {
        type: DataTypes.UUID,
        allowNull: true,
        references: { model: 'projects', key: 'id' },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      parent_id: { type: DataTypes.UUID, allowNull: true },
      name: { type: DataTypes.STRING(150), allowNull: false },
      created_by: {
        type: DataTypes.UUID,
        allowNull: true,
        references: { model: 'users', key: 'id' },
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
      },
      created_at: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
    });

    await queryInterface.addConstraint('folders', {
      fields: ['parent_id'],
      type: 'foreign key',
      name: 'fk_folders_parent_id',
      references: { table: 'folders', field: 'id' },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });

    await queryInterface.addIndex('folders', ['project_id']);
    await queryInterface.addIndex('folders', ['parent_id']);
  },

  down: async (queryInterface: QueryInterface) => {
    await queryInterface.dropTable('folders');
  },
};
