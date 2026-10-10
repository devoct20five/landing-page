import {
  AllowNull,
  Column,
  DataType,
  Default,
  Model,
  Table,
} from 'sequelize-typescript';

@Table({ tableName: 'promo_codes', timestamps: true, underscored: true })
export class PromoCode extends Model<PromoCode> {
  @Column({
    type: DataType.UUID,
    primaryKey: true,
    defaultValue: DataType.UUIDV4,
  })
  declare id: string;

  @AllowNull(false)
  @Column({ type: DataType.STRING(40), unique: true })
  declare code: string;

  @AllowNull(false)
  @Column({ type: DataType.DECIMAL(5, 2), field: 'percent_off' })
  declare percentOff: number;

  @Default(true)
  @Column({ type: DataType.BOOLEAN, allowNull: false, field: 'is_active' })
  declare isActive: boolean;

  @Column({ type: DataType.DATE, allowNull: true, field: 'expires_at' })
  declare expiresAt: Date | null;

  @Column({
    type: DataType.INTEGER.UNSIGNED,
    allowNull: true,
    field: 'max_redemptions',
  })
  declare maxRedemptions: number | null;

  @Default(0)
  @Column({ type: DataType.INTEGER.UNSIGNED, allowNull: false })
  declare redemptions: number;
}
