import { DataTypes, QueryInterface } from 'sequelize';
import { uuidPk, timestamps } from '../helpers/columns';

// orders            - the commercial record. Price is SNAPSHOTTED at purchase;
//                     later catalogue edits never change an existing order.
// order_payments    - one row per gateway payment attempt. Unique constraints
//                     make settlement idempotent at the database level.
// payment_webhook_events - ledger of received webhook events; (provider,
//                     event_id) is unique so a replayed event is a no-op.
// On successful payment the existing finance tables are populated too
// (invoices + payment_transactions); orders.invoice_id links the two.
module.exports = {
  up: async (qi: QueryInterface) => {
    const fk = (model: string, onDelete = 'SET NULL') => ({
      type: DataTypes.UUID,
      allowNull: true,
      references: { model, key: 'id' },
      onDelete,
      onUpdate: 'CASCADE',
    });

    await qi.createTable('orders', {
      id: uuidPk,
      order_number: { type: DataTypes.STRING(30), allowNull: false, unique: true },
      status: {
        type: DataTypes.ENUM('pending', 'payment_pending', 'paid', 'failed', 'cancelled', 'refunded'),
        allowNull: false,
        defaultValue: 'pending',
      },
      provisioning_status: {
        type: DataTypes.ENUM('not_started', 'done', 'manual_review'),
        allowNull: false,
        defaultValue: 'not_started',
      },
      provisioning_note: { type: DataTypes.STRING(500), allowNull: true },

      buyer_name: { type: DataTypes.STRING(150), allowNull: false },
      buyer_email: { type: DataTypes.STRING(190), allowNull: false },
      buyer_phone: { type: DataTypes.STRING(30), allowNull: true },
      buyer_company: { type: DataTypes.STRING(150), allowNull: true },
      buyer_gstin: { type: DataTypes.STRING(20), allowNull: true },
      notes: { type: DataTypes.TEXT, allowNull: true },

      client_id: fk('clients'),
      user_id: fk('users'),
      project_id: fk('projects'),
      invoice_id: fk('invoices'),
      service_id: fk('services'),
      plan_id: fk('service_plans'),
      pack_id: fk('service_plan_packages'),

      // ---- commercial snapshot (frozen at creation) ----
      service_name: { type: DataTypes.STRING(100), allowNull: false },
      plan_name: { type: DataTypes.STRING(100), allowNull: false },
      pack_label: { type: DataTypes.STRING(50), allowNull: true },
      quantity: { type: DataTypes.SMALLINT.UNSIGNED, allowNull: false, defaultValue: 1 },
      unit_price: { type: DataTypes.DECIMAL(12, 2), allowNull: false },
      list_price: { type: DataTypes.DECIMAL(12, 2), allowNull: false },
      pack_discount_percent: { type: DataTypes.DECIMAL(5, 2), allowNull: false, defaultValue: 0 },
      pack_discount: { type: DataTypes.DECIMAL(12, 2), allowNull: false, defaultValue: 0 },
      addons: { type: DataTypes.JSON, allowNull: true },
      addons_total: { type: DataTypes.DECIMAL(12, 2), allowNull: false, defaultValue: 0 },
      promo_code: { type: DataTypes.STRING(40), allowNull: true },
      promo_percent: { type: DataTypes.DECIMAL(5, 2), allowNull: false, defaultValue: 0 },
      promo_discount: { type: DataTypes.DECIMAL(12, 2), allowNull: false, defaultValue: 0 },
      subtotal: { type: DataTypes.DECIMAL(12, 2), allowNull: false },
      tax_rate: { type: DataTypes.DECIMAL(5, 4), allowNull: false, defaultValue: 0 },
      tax_amount: { type: DataTypes.DECIMAL(12, 2), allowNull: false, defaultValue: 0 },
      total: { type: DataTypes.DECIMAL(12, 2), allowNull: false },
      currency: { type: DataTypes.STRING(10), allowNull: false, defaultValue: 'INR' },
      features_snapshot: { type: DataTypes.JSON, allowNull: true },

      idempotency_key: { type: DataTypes.STRING(80), allowNull: true, unique: true },
      paid_at: { type: DataTypes.DATE, allowNull: true },
      failed_at: { type: DataTypes.DATE, allowNull: true },
      cancelled_at: { type: DataTypes.DATE, allowNull: true },
      failure_reason: { type: DataTypes.STRING(255), allowNull: true },
      ...timestamps(),
    });
    await qi.addIndex('orders', ['status']);
    await qi.addIndex('orders', ['buyer_email']);
    await qi.addIndex('orders', ['client_id']);
    await qi.addIndex('orders', ['user_id']);

    await qi.createTable('order_payments', {
      id: uuidPk,
      order_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: { model: 'orders', key: 'id' },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      provider: { type: DataTypes.STRING(30), allowNull: false },
      provider_order_id: { type: DataTypes.STRING(100), allowNull: false },
      provider_payment_id: { type: DataTypes.STRING(100), allowNull: true },
      amount_minor: { type: DataTypes.BIGINT, allowNull: false },
      currency: { type: DataTypes.STRING(10), allowNull: false },
      status: {
        type: DataTypes.ENUM('created', 'captured', 'failed', 'refunded'),
        allowNull: false,
        defaultValue: 'created',
      },
      method: { type: DataTypes.STRING(50), allowNull: true },
      failure_reason: { type: DataTypes.STRING(255), allowNull: true },
      ...timestamps(),
    });
    await qi.addIndex('order_payments', ['order_id']);
    await qi.addIndex('order_payments', ['provider', 'provider_order_id'], {
      unique: true,
      name: 'order_payments_provider_order_unique',
    });
    await qi.addIndex('order_payments', ['provider', 'provider_payment_id'], {
      unique: true,
      name: 'order_payments_provider_payment_unique',
    });

    await qi.createTable('payment_webhook_events', {
      id: uuidPk,
      provider: { type: DataTypes.STRING(30), allowNull: false },
      event_id: { type: DataTypes.STRING(150), allowNull: false },
      event_type: { type: DataTypes.STRING(80), allowNull: false },
      outcome: { type: DataTypes.STRING(255), allowNull: true },
      processed_at: { type: DataTypes.DATE, allowNull: true },
      created_at: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
    });
    await qi.addIndex('payment_webhook_events', ['provider', 'event_id'], {
      unique: true,
      name: 'payment_webhook_events_provider_event_unique',
    });
  },

  down: async (qi: QueryInterface) => {
    await qi.dropTable('payment_webhook_events');
    await qi.dropTable('order_payments');
    await qi.dropTable('orders');
  },
};
