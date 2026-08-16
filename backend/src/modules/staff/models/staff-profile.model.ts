import {
  BelongsTo,
  Column,
  DataType,
  Default,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';

import { User } from '@/modules/users/models/user.model';

export enum EmploymentType {
  FULL_TIME = 'full-time',
  PART_TIME = 'part-time',
  CONTRACT = 'contract',
  INTERN = 'intern',
}

export enum PayCycle {
  MONTHLY = 'monthly',
  WEEKLY = 'weekly',
  BIWEEKLY = 'biweekly',
}

/**
 * 1:1 extension of `users` for staff.
 *
 * Stores department, designation, employment,
 * salary and payment configuration.
 */
@Table({
  tableName: 'staff_profiles',
  timestamps: false,
  underscored: true,
})
export class StaffProfile extends Model<StaffProfile> {
  // ─────────────────────────────────────────────
  // User / Primary Key
  // ─────────────────────────────────────────────

  @ForeignKey(() => User)
  @Column({
    type: DataType.UUID,
    primaryKey: true,
    field: 'user_id',
  })
  declare userId: string;

  @BelongsTo(() => User, 'userId')
  declare user: User;

  // ─────────────────────────────────────────────
  // Staff Information
  // ─────────────────────────────────────────────

  @Column({
    type: DataType.STRING(100),
    allowNull: true,
  })
  declare department: string | null;

  @Column({
    type: DataType.STRING(100),
    allowNull: true,
  })
  declare designation: string | null;

  @Default(EmploymentType.FULL_TIME)
  @Column({
    type: DataType.ENUM(...Object.values(EmploymentType)),
    field: 'employment_type',
    allowNull: false,
  })
  declare employmentType: EmploymentType;

  @Column({
    type: DataType.DATEONLY,
    field: 'join_date',
    allowNull: true,
  })
  declare joinDate: string | null;

  // ─────────────────────────────────────────────
  // Salary
  // ─────────────────────────────────────────────

  @Column({
    type: DataType.DECIMAL(12, 2),
    allowNull: true,
  })
  declare salary: number | null;

  @Default('INR')
  @Column({
    type: DataType.STRING(10),
    allowNull: false,
  })
  declare currency: string;

  @Default(PayCycle.MONTHLY)
  @Column({
    type: DataType.ENUM(...Object.values(PayCycle)),
    field: 'pay_cycle',
    allowNull: false,
  })
  declare payCycle: PayCycle;

  @Column({
    type: DataType.STRING(50),
    field: 'payment_method',
    allowNull: true,
  })
  declare paymentMethod: string | null;
}
