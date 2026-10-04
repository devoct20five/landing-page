import { DataTypes, QueryInterface } from 'sequelize';
import { uuidPk } from '../helpers/columns';

// Mirrors src/modules/careers/models/candidate-note.model.ts
module.exports = {
  up: async (queryInterface: QueryInterface) => {
    await queryInterface.createTable('candidate_notes', {
      id: uuidPk,
      candidate_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: { model: 'candidates', key: 'id' },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      user_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: { model: 'users', key: 'id' },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      note: { type: DataTypes.TEXT, allowNull: false },
      created_at: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
    });

    await queryInterface.addIndex('candidate_notes', ['candidate_id']);
  },

  down: async (queryInterface: QueryInterface) => {
    await queryInterface.dropTable('candidate_notes');
  },
};
