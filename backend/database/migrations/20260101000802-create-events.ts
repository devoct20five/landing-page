import { DataTypes, QueryInterface } from 'sequelize';
import { uuidPk } from '../helpers/columns';

// Mirrors src/modules/events/models/event.model.ts
module.exports = {
  up: async (queryInterface: QueryInterface) => {
    await queryInterface.createTable('events', {
      id: uuidPk,
      title: { type: DataTypes.STRING(255), allowNull: false },
      description: { type: DataTypes.TEXT, allowNull: true },
      event_type: {
        type: DataTypes.ENUM('meeting', 'review', 'deadline', 'internal'),
        allowNull: false,
        defaultValue: 'meeting',
      },
      event_date: { type: DataTypes.DATEONLY, allowNull: false },
      start_time: { type: DataTypes.TIME, allowNull: true },
      end_time: { type: DataTypes.TIME, allowNull: true },
      location: { type: DataTypes.STRING(255), allowNull: true },
      meeting_link: { type: DataTypes.STRING(500), allowNull: true },
      client_id: {
        type: DataTypes.UUID,
        allowNull: true,
        references: { model: 'clients', key: 'id' },
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
      },
      project_id: {
        type: DataTypes.UUID,
        allowNull: true,
        references: { model: 'projects', key: 'id' },
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
      },
      status: {
        type: DataTypes.ENUM('scheduled', 'completed', 'cancelled'),
        allowNull: false,
        defaultValue: 'scheduled',
      },
      created_by: {
        type: DataTypes.UUID,
        allowNull: true,
        references: { model: 'users', key: 'id' },
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
      },
      created_at: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
    });

    // "events visible to this client" and "upcoming events" (calendar
    // range queries) are the two real access patterns here.
    await queryInterface.addIndex('events', ['client_id']);
    await queryInterface.addIndex('events', ['event_date']);
  },

  down: async (queryInterface: QueryInterface) => {
    await queryInterface.dropTable('events');
  },
};
