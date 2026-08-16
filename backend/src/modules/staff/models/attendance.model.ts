import {
  AllowNull,
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';

import { User } from '@/modules/users/models/user.model';

export enum AttendanceStatus {
  PRESENT = 'present',
  LATE = 'late',
  REMOTE = 'remote',
  LEAVE = 'leave',
  ABSENT = 'absent',
}

export enum WorkMode {
  OFFICE = 'Office',
  REMOTE = 'Remote',
}

@Table({
  tableName: 'attendance',
  timestamps: false,
  underscored: true,
  indexes: [
    {
      unique: true,
      fields: ['staff_id', 'work_date'],
    },
  ],
})
export class Attendance extends Model<Attendance> {
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
  // Attendance Date
  // ─────────────────────────────────────────────

  @AllowNull(false)
  @Column({
    type: DataType.DATEONLY,
    field: 'work_date',
  })
  declare workDate: string;

  // ─────────────────────────────────────────────
  // Attendance
  // ─────────────────────────────────────────────

  @AllowNull(false)
  @Column({
    type: DataType.ENUM(...Object.values(AttendanceStatus)),
  })
  declare status: AttendanceStatus;

  @Column({
    type: DataType.TIME,
    allowNull: true,
  })
  declare checkIn: string | null;

  @Column({
    type: DataType.TIME,
    allowNull: true,
  })
  declare checkOut: string | null;

  @Column({
    type: DataType.ENUM(...Object.values(WorkMode)),
    allowNull: true,
  })
  declare workMode: WorkMode | null;

  @Column({
    type: DataType.DECIMAL(5, 2),
    allowNull: true,
  })
  declare hoursWorked: number | null;

  @Column({
    type: DataType.STRING(255),
    allowNull: true,
  })
  declare notes: string | null;

  // ─────────────────────────────────────────────
  // Created At
  // ─────────────────────────────────────────────

  @Column({
    type: DataType.DATE,
    field: 'created_at',
    allowNull: false,
    defaultValue: DataType.NOW,
  })
  declare createdAt: Date;
}
