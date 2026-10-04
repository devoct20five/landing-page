import { DataTypes, QueryInterface } from 'sequelize';
import { uuidPk } from '../helpers/columns';

// Mirrors src/modules/careers/models/candidate.model.ts. Model uses
// `applied_at` as its @CreatedAt column (not `created_at`) — matched
// exactly here.
module.exports = {
  up: async (queryInterface: QueryInterface) => {
    await queryInterface.createTable('candidates', {
      id: uuidPk,
      job_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: { model: 'job_postings', key: 'id' },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      name: { type: DataTypes.STRING(150), allowNull: false },
      email: { type: DataTypes.STRING(190), allowNull: false },
      phone: { type: DataTypes.STRING(30), allowNull: true },
      resume_url: { type: DataTypes.STRING(500), allowNull: true },
      experience_years: { type: DataTypes.DECIMAL(4, 1), allowNull: true },
      stage: {
        type: DataTypes.ENUM('new', 'review', 'shortlisted', 'interview', 'hired', 'rejected'),
        allowNull: false,
        defaultValue: 'new',
      },
      applied_at: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
      updated_at: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
    });

    await queryInterface.addIndex('candidates', ['job_id']);
    await queryInterface.addIndex('candidates', ['stage']);
  },

  down: async (queryInterface: QueryInterface) => {
    await queryInterface.dropTable('candidates');
  },
};
