import { DataTypes, QueryInterface } from 'sequelize';

// Mirrors src/modules/events/models/event-attendee.model.ts
module.exports = {
  up: async (queryInterface: QueryInterface) => {
    await queryInterface.createTable('event_attendees', {
      event_id: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
        references: { model: 'events', key: 'id' },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      user_id: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
        references: { model: 'users', key: 'id' },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      rsvp_status: {
        type: DataTypes.ENUM('invited', 'accepted', 'declined'),
        allowNull: false,
        defaultValue: 'invited',
      },
    });

    // "which events is this user invited to" — a user's own calendar view.
    await queryInterface.addIndex('event_attendees', ['user_id']);
  },

  down: async (queryInterface: QueryInterface) => {
    await queryInterface.dropTable('event_attendees');
  },
};
