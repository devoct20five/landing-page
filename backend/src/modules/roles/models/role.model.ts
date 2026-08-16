import {
  BelongsToMany,
  Column,
  DataType,
  HasMany,
  Model,
  Table,
} from 'sequelize-typescript';

import { Permission } from './permission.model';
import { RolePermission } from './role-permission.model';
import { User } from '../../users/models/user.model';

@Table({
  tableName: 'roles',
  timestamps: false,
})
export class Role extends Model<Role> {
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
  // Role
  // ─────────────────────────────────────────────

  // "Administrator", "Manager", "Staff", "Client"
  @Column({
    type: DataType.STRING(60),
    allowNull: false,
  })
  declare name: string;

  // "admin", "manager", "staff", "client"
  @Column({
    type: DataType.STRING(60),
    allowNull: false,
    unique: true,
  })
  declare slug: string;

  @Column({
    type: DataType.STRING(255),
    allowNull: true,
  })
  declare description: string | null;

  // Protected/system role -
  // cannot be deleted or renamed via API
  @Column({
    type: DataType.TINYINT,
    allowNull: false,
    defaultValue: 0,
    field: 'is_system',
  })
  declare isSystem: boolean;

  // ─────────────────────────────────────────────
  // Timestamps
  // ─────────────────────────────────────────────

  @Column({
    type: DataType.DATE,
    allowNull: false,
    defaultValue: DataType.NOW,
    field: 'created_at',
  })
  declare createdAt: Date;

  // ─────────────────────────────────────────────
  // Permissions
  // ─────────────────────────────────────────────

  @BelongsToMany(() => Permission, () => RolePermission)
  declare permissions: Permission[];

  // ─────────────────────────────────────────────
  // Users
  // ─────────────────────────────────────────────

  @HasMany(() => User)
  declare users: User[];
}
