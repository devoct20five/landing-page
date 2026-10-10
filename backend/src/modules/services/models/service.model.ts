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

  /** 'packs' = sold in N-unit packs w/ volume discounts; 'project' = fixed price per project. */
  @Default('packs')
  @Column({
    type: DataType.ENUM('packs', 'project'),
    allowNull: false,
    field: 'pricing_mode',
  })
  declare pricingMode: 'packs' | 'project';

  @Column({ type: DataType.STRING(30), allowNull: true, field: 'unit_singular' })
  declare unitSingular: string | null;

  @Column({ type: DataType.STRING(30), allowNull: true, field: 'unit_plural' })
  declare unitPlural: string | null;

  /** The non-purchasable "built around your vision" tier (book a call). */
  @Column({ type: DataType.STRING(150), allowNull: true, field: 'custom_title' })
  declare customTitle: string | null;

  @Column({ type: DataType.STRING(500), allowNull: true, field: 'custom_body' })
  declare customBody: string | null;

  @Column({ type: DataType.DECIMAL(12, 2), allowNull: true, field: 'custom_from_price' })
  declare customFromPrice: number | null;

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
