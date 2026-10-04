import { DataTypes, QueryInterface } from 'sequelize';
import { uuidPk } from '../helpers/columns';

// Mirrors src/modules/careers/models/job-posting.model.ts
module.exports = {
  up: async (queryInterface: QueryInterface) => {
    await queryInterface.createTable('job_postings', {
      id: uuidPk,
      title: { type: DataTypes.STRING(150), allowNull: false },
      department: { type: DataTypes.STRING(100), allowNull: true },
      employment_type: { type: DataTypes.STRING(50), allowNull: false, defaultValue: 'Full-time' },
      location: { type: DataTypes.STRING(150), allowNull: true },
      description: { type: DataTypes.TEXT, allowNull: true },
      status: {
        type: DataTypes.ENUM('open', 'paused', 'closed'),
        allowNull: false,
        defaultValue: 'open',
      },
      posted_at: { type: DataTypes.DATEONLY, allowNull: true },
      deadline: { type: DataTypes.DATEONLY, allowNull: true },
      created_by: {
        type: DataTypes.UUID,
        allowNull: true,
        references: { model: 'users', key: 'id' },
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
      },
      created_at: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
    });

    await queryInterface.addIndex('job_postings', ['status']);
  },

  down: async (queryInterface: QueryInterface) => {
    await queryInterface.dropTable('job_postings');
  },
};
