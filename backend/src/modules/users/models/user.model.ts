import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';

import { Role } from '../../roles/models/role.model';
import { UserType } from '../../../common/enums/user-type.enum';
import { UserStatus } from '../../../common/enums/user-status.enum';

@Table({
  tableName: 'users',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
})
export class User extends Model<User> {
  // ─────────────────────────────────────────────
  // Primary Key
  // ─────────────────────────────────────────────

  @Column({
    type: DataType.UUID,
    primaryKey: true,
    defaultValue: DataType.UUIDV4,
    allowNull: false,
  })
  declare id: string;

  // ─────────────────────────────────────────────
  // User Type
  // ─────────────────────────────────────────────

  @Column({
    type: DataType.ENUM(...Object.values(UserType)),
    allowNull: false,
    field: 'user_type',
  })
  declare userType: UserType;

  // ─────────────────────────────────────────────
  // Role
  // ─────────────────────────────────────────────

  @ForeignKey(() => Role)
  @Column({
    type: DataType.UUID,
    allowNull: false,
    field: 'role_id',
  })
  declare roleId: string;

  @BelongsTo(() => Role, 'roleId')
  declare role: Role;

  // ─────────────────────────────────────────────
  // Name
  // ─────────────────────────────────────────────

  @Column({
    type: DataType.STRING(80),
    allowNull: false,
    field: 'first_name',
  })
  declare firstName: string;

  @Column({
    type: DataType.STRING(80),
    allowNull: true,
    field: 'last_name',
  })
  declare lastName: string | null;

  @Column({
    type: DataType.STRING(4),
    allowNull: true,
  })
  declare initials: string | null;

  // ─────────────────────────────────────────────
  // Contact
  // ─────────────────────────────────────────────

  @Column({
    type: DataType.STRING(190),
    allowNull: false,
    unique: true,
  })
  declare email: string;

  @Column({
    type: DataType.STRING(30),
    allowNull: true,
  })
  declare phone: string | null;

  // ─────────────────────────────────────────────
  // Authentication
  // ─────────────────────────────────────────────

  /**
   * Never expose passwordHash through DTOs/serializers.
   */
  @Column({
    type: DataType.STRING(255),
    allowNull: false,
    field: 'password_hash',
  })
  declare passwordHash: string;

  // ─────────────────────────────────────────────
  // Profile
  // ─────────────────────────────────────────────

  @Column({
    type: DataType.STRING(500),
    allowNull: true,
    field: 'avatar_url',
  })
  declare avatarUrl: string | null;

  // ─────────────────────────────────────────────
  // Status
  // ─────────────────────────────────────────────

  @Column({
    type: DataType.ENUM(...Object.values(UserStatus)),
    allowNull: false,
    defaultValue: UserStatus.INVITED,
  })
  declare status: UserStatus;

  // ─────────────────────────────────────────────
  // Login
  // ─────────────────────────────────────────────

  @Column({
    type: DataType.DATE,
    allowNull: true,
    field: 'last_login_at',
  })
  declare lastLoginAt: Date | null;

  // ─────────────────────────────────────────────
  // Timestamps
  // ─────────────────────────────────────────────

  @Column({
    type: DataType.DATE,
    allowNull: false,
    field: 'created_at',
  })
  declare createdAt: Date;

  @Column({
    type: DataType.DATE,
    allowNull: false,
    field: 'updated_at',
  })
  declare updatedAt: Date;

  // ─────────────────────────────────────────────
  // Safe Serialization
  // ─────────────────────────────────────────────

  /**
   * Returns the user without the password hash.
   *
   * Typed as a plain record, not `Omit<User, 'passwordHash'>` — the
   * previous annotation claimed this returns something structurally
   * assignable to a full `User` instance (minus one field), but
   * `toJSON()` returns a plain serialized object with none of the
   * Sequelize Model instance methods (`$add`, `$set`, `$get`, ...) that
   * `User` (a Model subclass) structurally requires. That mismatch is
   * exactly what TS2740 was catching; the annotation was giving callers
   * a false sense of what's actually available on the returned object.
   */
  toSafeJSON(): Record<string, unknown> {
    const json = this.toJSON();

    const { passwordHash: _passwordHash, ...safe } = json;

    return safe;
  }
}
