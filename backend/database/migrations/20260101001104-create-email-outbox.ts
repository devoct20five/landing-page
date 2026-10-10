import { DataTypes, QueryInterface } from 'sequelize';
import { uuidPk, timestamps } from '../helpers/columns';

// Transactional email outbox. Business code enqueues a row (inside the same
// DB transaction as the business change); a worker sends it and retries with
// backoff. dedupe_key is unique, so a replayed webhook can never enqueue the
// same email twice. Rows hold template data only - never secrets.
module.exports = {
  up: async (qi: QueryInterface) => {
    await qi.createTable('email_outbox', {
      id: uuidPk,
      dedupe_key: { type: DataTypes.STRING(150), allowNull: false, unique: true },
      template: { type: DataTypes.STRING(50), allowNull: false },
      to_email: { type: DataTypes.STRING(190), allowNull: false },
      data: { type: DataTypes.JSON, allowNull: false },
      status: {
        type: DataTypes.ENUM('pending', 'sent', 'failed'),
        allowNull: false,
        defaultValue: 'pending',
      },
      attempts: { type: DataTypes.SMALLINT.UNSIGNED, allowNull: false, defaultValue: 0 },
      next_attempt_at: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
      last_error: { type: DataTypes.STRING(500), allowNull: true },
      sent_at: { type: DataTypes.DATE, allowNull: true },
      ...timestamps(),
    });
    await qi.addIndex('email_outbox', ['status', 'next_attempt_at']);
  },
  down: async (qi: QueryInterface) => {
    await qi.dropTable('email_outbox');
  },
};
