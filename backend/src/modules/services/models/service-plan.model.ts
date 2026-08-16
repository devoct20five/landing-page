import {
  AllowNull,
  BelongsTo,
  Column,
  DataType,
  Default,
  ForeignKey,
  HasMany,
  Model,
  Table,
} from 'sequelize-typescript';

import { Service } from './service.model';
import { ServicePlanPackage } from './service-plan-package.model';
import { ServicePlanFeature } from './service-plan-feature.model';

/**
 * A tiered pricing plan for a service —
 * "Standard", "Advance", "Black".
 */
@Table({
  tableName: 'service_plans',
  timestamps: false,
  underscored: true,
})
export class ServicePlan extends Model<ServicePlan> {
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

  @AllowNull(false)
  @ForeignKey(() => Service)
  @Column({
    type: DataType.UUID,
    field: 'service_id',
  })
  declare serviceId: string;

  @BelongsTo(() => Service, 'serviceId')
  declare service: Service;

  // ─────────────────────────────────────────────
  // Plan
  // ─────────────────────────────────────────────

  @AllowNull(false)
  @Column({
    type: DataType.STRING(100),
  })
  declare name: string;

  @Column({
    type: DataType.STRING(60),
    allowNull: true,
  })
  declare icon: string | null;

  @Column({
    type: DataType.DECIMAL(12, 2),
    allowNull: true,
  })
  declare price: number | null;

  @Column({
    type: DataType.DECIMAL(12, 2),
    allowNull: true,
  })
  declare totalPrice: number | null;

  @Default(0)
  @Column({
    type: DataType.DECIMAL(5, 2),
    allowNull: false,
  })
  declare discountPercent: number;

  @Default(false)
  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
  })
  declare isFeatured: boolean;

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
  // Packages
  // ─────────────────────────────────────────────

  @HasMany(() => ServicePlanPackage, 'planId')
  declare packages: ServicePlanPackage[];

  // ─────────────────────────────────────────────
  // Features
  // ─────────────────────────────────────────────

  @HasMany(() => ServicePlanFeature, 'planId')
  declare features: ServicePlanFeature[];
}
