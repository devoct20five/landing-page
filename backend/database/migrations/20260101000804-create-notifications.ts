import { DataTypes, QueryInterface } from 'sequelize';
import { uuidPk } from '../helpers/columns';

// Mirrors src/modules/engagement/models/notification.model.ts.
//
// Note (spec §47): this model has only `link_url`, no structured
// `entityType`/`entityId`/`action` reference. That's a real gap for safe
// click-through navigation, but it's a model addition the engagement
// module owner should make deliberately — not something to invent inside
// a migration for a column the model doesn't declare.
module.exports = {
  up: async (queryInterface: QueryInterface) => {
    await queryInterface.createTable('notifications', {
      id: uuidPk,
      user_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: { model: 'users', key: 'id' },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      title: { type: DataTypes.STRING(255), allowNull: false },
      message: { type: DataTypes.STRING(500), allowNull: false },
      link_url: { type: DataTypes.STRING(500), allowNull: true },
      is_read: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
      created_at: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
    });

    // The two queries every notification bell/list endpoint runs on every
    // page load: "this user's notifications" and "this user's unread count".
    await queryInterface.addIndex('notifications', ['user_id', 'is_read'], {
      name: 'notifications_user_id_is_read',
    });
  },

  down: async (queryInterface: QueryInterface) => {
    await queryInterface.dropTable('notifications');
  },
};
