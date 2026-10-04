import { DataTypes, QueryInterface } from 'sequelize';
import { uuidPk, timestamps } from '../helpers/columns';

// Mirrors src/modules/clients/models/client.model.ts
module.exports = {
  up: async (queryInterface: QueryInterface) => {
    await queryInterface.createTable('clients', {
      id: uuidPk,
      name: { type: DataTypes.STRING(150), allowNull: false },
      short_name: { type: DataTypes.STRING(50), allowNull: true },
      email: { type: DataTypes.STRING(190), allowNull: true },
      phone: { type: DataTypes.STRING(30), allowNull: true },
      website: { type: DataTypes.STRING(255), allowNull: true },
      industry: { type: DataTypes.STRING(100), allowNull: true },
      address: { type: DataTypes.STRING(255), allowNull: true },
      logo_url: { type: DataTypes.STRING(500), allowNull: true },
      status: {
        type: DataTypes.ENUM('active', 'inactive'),
        allowNull: false,
        defaultValue: 'active',
      },
      // Staff/admin user who created this client record. RESTRICT (not
      // CASCADE/SET NULL): a client's audit trail of "who onboarded this
      // account" shouldn't silently disappear if that staff user is later
      // removed — remove/reassign the client first.
      created_by: {
        type: DataTypes.UUID,
        allowNull: false,
        references: { model: 'users', key: 'id' },
        onDelete: 'RESTRICT',
        onUpdate: 'CASCADE',
      },
      ...timestamps(),
    });

    await queryInterface.addIndex('clients', ['status']);
    await queryInterface.addIndex('clients', ['created_by']);
  },

  down: async (queryInterface: QueryInterface) => {
    await queryInterface.dropTable('clients');
  },
};
