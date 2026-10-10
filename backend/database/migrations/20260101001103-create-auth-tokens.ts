import { DataTypes, QueryInterface } from 'sequelize';
import { uuidPk } from '../helpers/columns';

// One-time tokens for "set your password" (workspace invitation) and
// "reset your password". Only the SHA-256 of the token is stored.
module.exports = {
  up: async (qi: QueryInterface) => {
    await qi.createTable('auth_tokens', {
      id: uuidPk,
      user_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: { model: 'users', key: 'id' },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      purpose: { type: DataTypes.ENUM('password_setup', 'password_reset'), allowNull: false },
      token_hash: { type: DataTypes.CHAR(64), allowNull: false, unique: true },
      expires_at: { type: DataTypes.DATE, allowNull: false },
      used_at: { type: DataTypes.DATE, allowNull: true },
      created_at: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
    });
    await qi.addIndex('auth_tokens', ['user_id', 'purpose']);
  },
  down: async (qi: QueryInterface) => {
    await qi.dropTable('auth_tokens');
  },
};
