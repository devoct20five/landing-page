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

@Table({
  tableName: 'service_plan_features',
  timestamps: false,
  underscored: true,
})
export class ServicePlanFeature extends Model<ServicePlanFeature> {
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
  // Feature
  // ─────────────────────────────────────────────

  @AllowNull(false)
  @Column({
    type: DataType.STRING(255),
  })
  declare featureText: string;

  @Default(0)
  @Column({
    type: DataType.SMALLINT.UNSIGNED,
    allowNull: false,
  })
  declare sortOrder: number;
}
