import { DataTypes, QueryInterface } from 'sequelize';
import { uuidPk, timestamps } from '../helpers/columns';

// Mirrors src/modules/users/models/user.model.ts.
//
// Note on user.uuid: the model only has `id` (UUID-typed already). The
// running AuthService currently signs a `user.uuid` field into the JWT
// which does not exist on this model — see docs/00_CURRENT_STATE_AUDIT.md
// §4. That's an application-code bug to fix in auth.service.ts, not a
// schema gap, so no `uuid` column is added here.
module.exports = {
  up: async (queryInterface: QueryInterface) => {
    await queryInterface.createTable('users', {
      id: uuidPk,
      user_type: {
        type: DataTypes.ENUM('client', 'staff', 'admin'),
        allowNull: false,
      },
      role_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: { model: 'roles', key: 'id' },
        onDelete: 'RESTRICT',
        onUpdate: 'CASCADE',
      },
      first_name: { type: DataTypes.STRING(80), allowNull: false },
      last_name: { type: DataTypes.STRING(80), allowNull: true },
      initials: { type: DataTypes.STRING(4), allowNull: true },
      email: { type: DataTypes.STRING(190), allowNull: false, unique: true },
      phone: { type: DataTypes.STRING(30), allowNull: true },
      password_hash: { type: DataTypes.STRING(255), allowNull: false },
      avatar_url: { type: DataTypes.STRING(500), allowNull: true },
      status: {
        type: DataTypes.ENUM('active', 'invited', 'suspended'),
        allowNull: false,
        defaultValue: 'invited',
      },
      last_login_at: { type: DataTypes.DATE, allowNull: true },
      ...timestamps(),
    });

    // email already carries a unique index from the column definition above.
    await queryInterface.addIndex('users', ['role_id']);
    await queryInterface.addIndex('users', ['user_type']);
    await queryInterface.addIndex('users', ['status']);
  },

  down: async (queryInterface: QueryInterface) => {
    await queryInterface.dropTable('users');
    // MySQL/MariaDB persists ENUM types as inline column definitions (not
    // named types like Postgres), so there is nothing extra to drop here.
  },
};
