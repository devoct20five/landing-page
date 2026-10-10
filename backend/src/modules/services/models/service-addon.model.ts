import {
  AllowNull,
  Column,
  DataType,
  Default,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { Service } from './service.model';

/** Optional paid extra on a service (e.g. "Rush delivery"). Priced server-side. */
@Table({ tableName: 'service_addons', timestamps: false, underscored: true })
export class ServiceAddon extends Model<ServiceAddon> {
  @Column({
    type: DataType.UUID,
    primaryKey: true,
    defaultValue: DataType.UUIDV4,
  })
  declare id: string;

  @AllowNull(false)
  @ForeignKey(() => Service)
  @Column({ type: DataType.UUID, field: 'service_id' })
  declare serviceId: string;

  @AllowNull(false)
  @Column({ type: DataType.STRING(40) })
  declare code: string;

  @AllowNull(false)
  @Column({ type: DataType.STRING(150) })
  declare label: string;

  @AllowNull(false)
  @Column({ type: DataType.DECIMAL(12, 2) })
  declare price: number;

  @Default(true)
  @Column({ type: DataType.BOOLEAN, allowNull: false, field: 'is_active' })
  declare isActive: boolean;

  @Default(0)
  @Column({
    type: DataType.SMALLINT.UNSIGNED,
    allowNull: false,
    field: 'sort_order',
  })
  declare sortOrder: number;
}
