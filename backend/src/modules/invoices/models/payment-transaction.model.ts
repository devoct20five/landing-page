import {
  BelongsTo,
  Column,
  CreatedAt,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';

import { Invoice } from './invoice.model';

export type PaymentTxnStatus = 'pending' | 'success' | 'failed' | 'refunded';

@Table({
  tableName: 'payment_transactions',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false,
})
export class PaymentTransaction extends Model<PaymentTransaction> {
  @Column({
    type: DataType.UUID,
    primaryKey: true,
    defaultValue: DataType.UUIDV4,
  })
  declare id: string;

  // ─────────────────────────────────────────────
  // Invoice
  // ─────────────────────────────────────────────

  @ForeignKey(() => Invoice)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  declare invoice_id: string;

  // ─────────────────────────────────────────────
  // Payment
  // ─────────────────────────────────────────────

  @Column({
    type: DataType.DECIMAL(14, 2),
    allowNull: false,
  })
  declare amount: number;

  @Column({
    type: DataType.STRING(50),
    allowNull: true,
  })
  declare method: string | null;

  @Column({
    type: DataType.STRING(100),
    allowNull: true,
  })
  declare reference: string | null;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  declare paid_at: Date | null;

  @Column({
    type: DataType.ENUM('pending', 'success', 'failed', 'refunded'),
    allowNull: false,
    defaultValue: 'pending',
  })
  declare status: PaymentTxnStatus;

  // ─────────────────────────────────────────────
  // Timestamp
  // ─────────────────────────────────────────────

  @CreatedAt
  declare created_at: Date;

  // ─────────────────────────────────────────────
  // Relationship
  // ─────────────────────────────────────────────

  @BelongsTo(() => Invoice, 'invoice_id')
  declare invoice: Invoice;
}
