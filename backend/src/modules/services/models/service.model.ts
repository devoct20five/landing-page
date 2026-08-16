import {
  AllowNull,
  Column,
  DataType,
  Default,
  HasMany,
  Model,
  Table,
  Unique,
} from 'sequelize-typescript';

import { ServicePlan } from './service-plan.model';

@Table({
  tableName: 'services',
  timestamps: false,
  underscored: true,
})
export class Service extends Model<Service> {
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
  // Service
  // ─────────────────────────────────────────────

  @Unique
  @AllowNull(false)
  @Column({
    type: DataType.STRING(60),
  })
  declare slug: string;

  @AllowNull(false)
  @Column({
    type: DataType.STRING(100),
  })
  declare name: string;

  @Column({
    type: DataType.STRING(255),
    allowNull: true,
  })
  declare heroHeadline: string | null;

  @Column({
    type: DataType.STRING(100),
    allowNull: true,
  })
  declare heroTag: string | null;

  @Column({
    type: DataType.STRING(500),
    allowNull: true,
  })
  declare heroImageUrl: string | null;

  @Default(true)
  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
  })
  declare isActive: boolean;

  @Default(0)
  @Column({
    type: DataType.SMALLINT.UNSIGNED,
    allowNull: false,
  })
  declare sortOrder: number;

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

  // ─────────────────────────────────────────────
  // Plans
  // ─────────────────────────────────────────────

  @HasMany(() => ServicePlan, 'serviceId')
  declare plans: ServicePlan[];
}
