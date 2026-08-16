import {
  BelongsToMany,
  Column,
  DataType,
  Model,
  Table,
} from 'sequelize-typescript';

import { Role } from './role.model';
import { RolePermission } from './role-permission.model';

@Table({
  tableName: 'permissions',
  timestamps: false,
})
export class Permission extends Model<Permission> {
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
  // Permission
  // ─────────────────────────────────────────────

  // e.g. "projects", "tasks", "payments", "team"
  @Column({
    type: DataType.STRING(60),
    allowNull: false,
  })
  declare module: string;

  // e.g. "view", "create", "edit", "delete", "approve"
  @Column({
    type: DataType.STRING(60),
    allowNull: false,
  })
  declare action: string;

  // e.g. "projects.view", "payments.edit"
  // Used by @RequirePermissions()
  @Column({
    type: DataType.STRING(120),
    allowNull: false,
    unique: true,
  })
  declare slug: string;

  @Column({
    type: DataType.STRING(255),
    allowNull: true,
  })
  declare description: string | null;

  // ─────────────────────────────────────────────
  // Roles
  // ─────────────────────────────────────────────

  @BelongsToMany(() => Role, () => RolePermission)
  declare roles: Role[];
}
