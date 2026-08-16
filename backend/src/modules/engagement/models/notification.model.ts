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

// Maps 1:1 to `notifications`
@Table({
  tableName: 'notifications',
  timestamps: false,
})
export class Notification extends Model<Notification> {
  @Column({
    type: DataType.UUID,
    primaryKey: true,
    defaultValue: DataType.UUIDV4,
  })
  declare id: string;

  // ─────────────────────────────────────────────
  // User
  // ─────────────────────────────────────────────

  @ForeignKey(() => User)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  declare user_id: string;

  @BelongsTo(() => User, 'user_id')
  declare user: User;

  // ─────────────────────────────────────────────
  // Notification
  // ─────────────────────────────────────────────

  @Column({
    type: DataType.STRING(255),
    allowNull: false,
  })
  declare title: string;

  @Column({
    type: DataType.STRING(500),
    allowNull: false,
  })
  declare message: string;

  @Column({
    type: DataType.STRING(500),
    allowNull: true,
  })
  declare link_url: string | null;

  @Default(false)
  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
  })
  declare is_read: boolean;

  @Column({
    field: 'created_at',
    type: DataType.DATE,
    allowNull: false,
  })
  declare created_at: Date;
}
