import { DataTypes, QueryInterface } from 'sequelize';

// Mirrors src/modules/roles/models/role-permission.model.ts
// Composite primary key (role_id, permission_id) — a role can't be granted
// the same permission twice, and this doubles as the join table's index for
// "all permissions of this role" lookups.
module.exports = {
  up: async (queryInterface: QueryInterface) => {
    await queryInterface.createTable('role_permissions', {
      role_id: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
        references: { model: 'roles', key: 'id' },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      permission_id: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
        references: { model: 'permissions', key: 'id' },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
    });

    // Reverse lookup: "which roles have permission X" (used when auditing
    // or when a permission is being removed from the system).
    await queryInterface.addIndex('role_permissions', ['permission_id']);
  },

  down: async (queryInterface: QueryInterface) => {
    await queryInterface.dropTable('role_permissions');
  },
};
