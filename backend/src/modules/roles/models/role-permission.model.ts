import {
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';

import { Role } from './role.model';
import { Permission } from './permission.model';

@Table({
  tableName: 'role_permissions',
  timestamps: false,
  underscored: true,
})
export class RolePermission extends Model<RolePermission> {
  // ─────────────────────────────────────────────
  // Role
  // ─────────────────────────────────────────────

  @ForeignKey(() => Role)
  @Column({
    type: DataType.UUID,
    allowNull: false,
    primaryKey: true,
    field: 'role_id',
  })
  declare roleId: string;

  // ─────────────────────────────────────────────
  // Permission
  // ─────────────────────────────────────────────

  @ForeignKey(() => Permission)
  @Column({
    type: DataType.UUID,
    allowNull: false,
    primaryKey: true,
    field: 'permission_id',
  })
  declare permissionId: string;
}
