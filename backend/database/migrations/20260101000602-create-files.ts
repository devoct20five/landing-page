import { DataTypes, QueryInterface } from 'sequelize';
import { uuidPk } from '../helpers/columns';

// Mirrors src/modules/files/models/file.model.ts.
//
// Security note (docs/00_CURRENT_STATE_AUDIT.md §3/§38-39): this table has
// no direct client_id column — a file's client-visibility must be derived
// by joining through project_id -> projects.client_id (or folder_id ->
// folders.project_id -> projects.client_id for files inside a folder).
// FilesController currently skips this check entirely; that's an
// application-layer fix for Phase 2, not something the schema can enforce
// on its own. Flagging here so it isn't missed when that controller is
// revisited.
module.exports = {
  up: async (queryInterface: QueryInterface) => {
    await queryInterface.createTable('files', {
      id: uuidPk,
      folder_id: {
        type: DataTypes.UUID,
        allowNull: true,
        references: { model: 'folders', key: 'id' },
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
      },
      project_id: {
        type: DataTypes.UUID,
        allowNull: true,
        references: { model: 'projects', key: 'id' },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      name: { type: DataTypes.STRING(255), allowNull: false },
      file_type: {
        type: DataTypes.ENUM('pdf', 'image', 'video', 'spreadsheet', 'doc', 'other'),
        allowNull: false,
        defaultValue: 'other',
      },
      mime_type: { type: DataTypes.STRING(120), allowNull: true },
      size_bytes: { type: DataTypes.BIGINT.UNSIGNED, allowNull: true },
      storage_url: { type: DataTypes.STRING(500), allowNull: false },
      version: { type: DataTypes.STRING(20), allowNull: false, defaultValue: '01' },
      uploaded_by: {
        type: DataTypes.UUID,
        allowNull: true,
        references: { model: 'users', key: 'id' },
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
      },
      created_at: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
    });

    // This is the index the access-control fix in Phase 2 depends on:
    // "does file X belong to project Y" is the core of assertFileAccess.
    await queryInterface.addIndex('files', ['project_id']);
    await queryInterface.addIndex('files', ['folder_id']);
  },

  down: async (queryInterface: QueryInterface) => {
    await queryInterface.dropTable('files');
  },
};
