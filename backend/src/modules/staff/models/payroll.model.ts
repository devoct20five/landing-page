import {
  AllowNull,
  BelongsTo,
  Column,
  DataType,
  Default,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';

import { User } from '@/modules/users/models/user.model';

export enum PayoutStatus {
  PAID = 'paid',
  PENDING = 'pending',
  OVERDUE = 'overdue',
}

@Table({
  tableName: 'payroll',
  timestamps: false,
  underscored: true,
  indexes: [
    {
      unique: true,
      fields: ['staff_id', 'period_month', 'period_year'],
    },
  ],
})
export class Payroll extends Model<Payroll> {
  // ─────────────────────────────────────────────
  // Primary Key
  // ─────────────────────────────────────────────

  @Column({
    type: DataType.UUID,
    primaryKey: true,
    defaultValue: DataType.UUIDV4,
  })
  declare id: string;

  // ─────────────────────────────────────────────
  // Staff
  // ─────────────────────────────────────────────

  @AllowNull(false)
  @ForeignKey(() => User)
  @Column({
    type: DataType.UUID,
    field: 'staff_id',
  })
  declare staffId: string;

  @BelongsTo(() => User, 'staffId')
  declare staff: User;

  // ─────────────────────────────────────────────
  // Payroll Period
  // ─────────────────────────────────────────────

  @AllowNull(false)
  @Column({
    type: DataType.TINYINT.UNSIGNED,
    field: 'period_month',
  })
  declare periodMonth: number;

  @AllowNull(false)
  @Column({
    type: DataType.SMALLINT.UNSIGNED,
    field: 'period_year',
  })
  declare periodYear: number;

  // ─────────────────────────────────────────────
  // Salary
  // ─────────────────────────────────────────────

  @AllowNull(false)
  @Column({
    type: DataType.DECIMAL(12, 2),
    field: 'salary_amount',
  })
  declare salaryAmount: number;

  @Default('INR')
  @Column({
    type: DataType.STRING(10),
    allowNull: false,
  })
  declare currency: string;

  // ─────────────────────────────────────────────
  // Payout
  // ─────────────────────────────────────────────

  @Default(PayoutStatus.PENDING)
  @Column({
    type: DataType.ENUM(...Object.values(PayoutStatus)),
    field: 'payout_status',
    allowNull: false,
  })
  declare payoutStatus: PayoutStatus;

  @Column({
    type: DataType.DATEONLY,
    field: 'payout_date',
    allowNull: true,
  })
  declare payoutDate: string | null;

  @Column({
    type: DataType.STRING(50),
    field: 'payment_method',
    allowNull: true,
  })
  declare paymentMethod: string | null;

  // ─────────────────────────────────────────────
  // Timestamp
  // ─────────────────────────────────────────────

  @Column({
    type: DataType.DATE,
    field: 'created_at',
    allowNull: false,
    defaultValue: DataType.NOW,
  })
  declare createdAt: Date;
}
