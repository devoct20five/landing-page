import { DataTypes, QueryInterface } from 'sequelize';
import { uuidPk } from '../helpers/columns';

// Mirrors src/modules/engagement/models/activity-log.model.ts. Table name
// is `activity_log` (singular — the model's actual @Table tableName), not
// `activity_logs`.
//
// Note (spec §46): activity_type is a coarse category enum (status,
// approval, upload, task, comment, payment, attendance, other) — not the
// fine-grained "project.created" / "task.status_changed" event-name
// vocabulary the spec describes. The free-text `description` column is
// what actually carries the specific human-readable event today. Worth
// revisiting when the activity-generation logic itself is audited in a
// later phase; not a schema change to make silently here.
module.exports = {
  up: async (queryInterface: QueryInterface) => {
    await queryInterface.createTable('activity_log', {
      id: uuidPk,
      actor_id: {
        type: DataTypes.UUID,
        allowNull: true,
        references: { model: 'users', key: 'id' },
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
      client_id: {
        type: DataTypes.UUID,
        allowNull: true,
        references: { model: 'clients', key: 'id' },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      activity_type: {
        type: DataTypes.ENUM(
          'status',
          'approval',
          'upload',
          'task',
          'comment',
          'payment',
          'attendance',
          'other',
        ),
        allowNull: false,
      },
      description: { type: DataTypes.STRING(500), allowNull: false },
      metadata_json: { type: DataTypes.JSON, allowNull: true },
      created_at: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
    });

    // Matches docs/00_CURRENT_STATE_AUDIT.md §83's indexing recommendation
    // exactly: actor_id, project_id, created_at are the three real
    // filters an activity feed uses (client feed, project feed, "recent").
    await queryInterface.addIndex('activity_log', ['actor_id']);
    await queryInterface.addIndex('activity_log', ['project_id']);
    await queryInterface.addIndex('activity_log', ['client_id']);
    await queryInterface.addIndex('activity_log', ['created_at']);
  },

  down: async (queryInterface: QueryInterface) => {
    await queryInterface.dropTable('activity_log');
  },
};
