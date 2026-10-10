import {
  AllowNull,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { User } from '../../users/models/user.model';

@Table({ tableName: 'auth_tokens', timestamps: false, underscored: true })
export class AuthToken extends Model<AuthToken> {
  @Column({
    type: DataType.UUID,
    primaryKey: true,
    defaultValue: DataType.UUIDV4,
  })
  declare id: string;

  @AllowNull(false)
  @ForeignKey(() => User)
  @Column({ type: DataType.UUID, field: 'user_id' })
  declare userId: string;

  @AllowNull(false)
  @Column({ type: DataType.ENUM('password_setup', 'password_reset') })
  declare purpose: 'password_setup' | 'password_reset';

  @AllowNull(false)
  @Column({ type: DataType.CHAR(64), field: 'token_hash', unique: true })
  declare tokenHash: string;

  @AllowNull(false)
  @Column({ type: DataType.DATE, field: 'expires_at' })
  declare expiresAt: Date;

  @Column({ type: DataType.DATE, allowNull: true, field: 'used_at' })
  declare usedAt: Date | null;

  @Column({
    type: DataType.DATE,
    allowNull: false,
    field: 'created_at',
    defaultValue: DataType.NOW,
  })
  declare createdAt: Date;
}
