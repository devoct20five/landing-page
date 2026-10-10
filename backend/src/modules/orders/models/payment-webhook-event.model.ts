import { AllowNull, Column, DataType, Model, Table } from 'sequelize-typescript';

/** Ledger of processed gateway events. (provider, event_id) is unique => replays are no-ops. */
@Table({ tableName: 'payment_webhook_events', timestamps: false, underscored: true })
export class PaymentWebhookEvent extends Model<PaymentWebhookEvent> {
  @Column({ type: DataType.UUID, primaryKey: true, defaultValue: DataType.UUIDV4 })
  declare id: string;
  @AllowNull(false) @Column({ type: DataType.STRING(30) }) declare provider: string;
  @AllowNull(false) @Column({ type: DataType.STRING(150), field: 'event_id' }) declare eventId: string;
  @AllowNull(false) @Column({ type: DataType.STRING(80), field: 'event_type' }) declare eventType: string;
  @Column({ type: DataType.STRING(255), allowNull: true }) declare outcome: string | null;
  @Column({ type: DataType.DATE, allowNull: true, field: 'processed_at' }) declare processedAt: Date | null;
  @Column({ type: DataType.DATE, allowNull: false, field: 'created_at', defaultValue: DataType.NOW }) declare createdAt: Date;
}
