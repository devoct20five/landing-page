import { AllowNull, Column, DataType, Default, Model, Table } from 'sequelize-typescript';

@Table({ tableName: 'email_outbox', timestamps: true, underscored: true })
export class EmailOutbox extends Model<EmailOutbox> {
  @Column({ type: DataType.UUID, primaryKey: true, defaultValue: DataType.UUIDV4 })
  declare id: string;

  @AllowNull(false)
  @Column({ type: DataType.STRING(150), field: 'dedupe_key', unique: true })
  declare dedupeKey: string;

  @AllowNull(false)
  @Column({ type: DataType.STRING(50) })
  declare template: string;

  @AllowNull(false)
  @Column({ type: DataType.STRING(190), field: 'to_email' })
  declare toEmail: string;

  @AllowNull(false)
  @Column({ type: DataType.JSON })
  declare data: Record<string, any>;

  @Default('pending')
  @Column({ type: DataType.ENUM('pending', 'sent', 'failed'), allowNull: false })
  declare status: 'pending' | 'sent' | 'failed';

  @Default(0)
  @Column({ type: DataType.SMALLINT.UNSIGNED, allowNull: false })
  declare attempts: number;

  @Column({ type: DataType.DATE, allowNull: false, field: 'next_attempt_at', defaultValue: DataType.NOW })
  declare nextAttemptAt: Date;

  @Column({ type: DataType.STRING(500), allowNull: true, field: 'last_error' })
  declare lastError: string | null;

  @Column({ type: DataType.DATE, allowNull: true, field: 'sent_at' })
  declare sentAt: Date | null;
}
