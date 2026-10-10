import { AllowNull, BelongsTo, Column, DataType, Default, ForeignKey, Model, Table } from 'sequelize-typescript';
import { Order } from './order.model';

/** One gateway payment attempt for an order. */
@Table({ tableName: 'order_payments', timestamps: true, underscored: true })
export class OrderPayment extends Model<OrderPayment> {
  @Column({ type: DataType.UUID, primaryKey: true, defaultValue: DataType.UUIDV4 })
  declare id: string;

  @AllowNull(false) @ForeignKey(() => Order) @Column({ type: DataType.UUID, field: 'order_id' }) declare orderId: string;
  @BelongsTo(() => Order, 'orderId') declare order: Order;

  @AllowNull(false) @Column({ type: DataType.STRING(30) }) declare provider: string;
  @AllowNull(false) @Column({ type: DataType.STRING(100), field: 'provider_order_id' }) declare providerOrderId: string;
  @Column({ type: DataType.STRING(100), allowNull: true, field: 'provider_payment_id' }) declare providerPaymentId: string | null;
  // BIGINT comes back from mysql2 as a string; always Number() it.
  @AllowNull(false) @Column({ type: DataType.BIGINT, field: 'amount_minor' }) declare amountMinor: number | string;
  @AllowNull(false) @Column({ type: DataType.STRING(10) }) declare currency: string;

  @Default('created')
  @Column({ type: DataType.ENUM('created', 'captured', 'failed', 'refunded'), allowNull: false })
  declare status: 'created' | 'captured' | 'failed' | 'refunded';

  @Column({ type: DataType.STRING(50), allowNull: true }) declare method: string | null;
  @Column({ type: DataType.STRING(255), allowNull: true, field: 'failure_reason' }) declare failureReason: string | null;
}
