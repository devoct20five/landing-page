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

import { ServicePlan } from './service-plan.model';

/**
 * Pack-size option for a plan —
 * "3 Pack", "7 Pack", "15 Pack".
 */
@Table({
  tableName: 'service_plan_packages',
  timestamps: false,
  underscored: true,
})
export class ServicePlanPackage extends Model<ServicePlanPackage> {
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
  // Service Plan
  // ─────────────────────────────────────────────

  @AllowNull(false)
  @ForeignKey(() => ServicePlan)
  @Column({
    type: DataType.UUID,
    field: 'plan_id',
  })
  declare planId: string;

  @BelongsTo(() => ServicePlan, 'planId')
  declare plan: ServicePlan;

  // ─────────────────────────────────────────────
  // Package
  // ─────────────────────────────────────────────

  @AllowNull(false)
  @Column({
    type: DataType.STRING(50),
  })
  declare label: string;

  @Default(0)
  @Column({
    type: DataType.SMALLINT.UNSIGNED,
    allowNull: false,
  })
  declare sortOrder: number;
}
