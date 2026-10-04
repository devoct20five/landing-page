import { DataTypes, QueryInterface } from 'sequelize';
import { uuidPk } from '../helpers/columns';

// Mirrors src/modules/behind-the-work/models/behind-the-work.model.ts —
// the last table in the full domain model (see
// docs/00_CURRENT_STATE_AUDIT.md's original module list).
module.exports = {
  up: async (queryInterface: QueryInterface) => {
    await queryInterface.createTable('behind_the_work', {
      id: uuidPk,
      content_type: { type: DataTypes.ENUM('photo', 'video', 'youtube'), allowNull: false },
      title: { type: DataTypes.STRING(255), allowNull: false },
      description: { type: DataTypes.TEXT, allowNull: false },
      project_id: {
        type: DataTypes.UUID,
        allowNull: true,
        references: { model: 'projects', key: 'id' },
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
      },
      client_id: {
        type: DataTypes.UUID,
        allowNull: true,
        references: { model: 'clients', key: 'id' },
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
      },
      thumbnail_url: { type: DataTypes.STRING(500), allowNull: true },
      media_url: { type: DataTypes.STRING(500), allowNull: false },
      status: {
        type: DataTypes.ENUM('draft', 'published'),
        allowNull: false,
        defaultValue: 'draft',
      },
      author_id: {
        type: DataTypes.UUID,
        allowNull: true,
        references: { model: 'users', key: 'id' },
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
      },
      created_at: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
      published_at: { type: DataTypes.DATE, allowNull: true },
    });

    // The public-facing feed only ever queries status='published', so
    // that's the index that matters most here.
    await queryInterface.addIndex('behind_the_work', ['status']);
  },

  down: async (queryInterface: QueryInterface) => {
    await queryInterface.dropTable('behind_the_work');
  },
};
