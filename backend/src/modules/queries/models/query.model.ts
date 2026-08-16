import {
  BelongsTo,
  Column,
  CreatedAt,
  DataType,
  ForeignKey,
  Model,
  Table,
  UpdatedAt,
} from 'sequelize-typescript';

import { Client } from '@/modules/clients/models/client.model';
import { Project } from '@/modules/projects/models/project.model';
import { User } from '@/modules/users/models/user.model';

export type QueryPriority = 'low' | 'medium' | 'high';

export type QueryStatus = 'open' | 'in-progress' | 'resolved' | 'closed';

@Table({
  tableName: 'queries',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
})
export class SupportQuery extends Model<SupportQuery> {
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
  // Client
  // ─────────────────────────────────────────────

  @ForeignKey(() => Client)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  declare client_id: string;

  @BelongsTo(() => Client, 'client_id')
  declare client: Client;

  // ─────────────────────────────────────────────
  // Project
  // ─────────────────────────────────────────────

  @ForeignKey(() => Project)
  @Column({
    type: DataType.UUID,
    allowNull: true,
  })
  declare project_id: string | null;

  @BelongsTo(() => Project, 'project_id')
  declare project: Project;

  // ─────────────────────────────────────────────
  // Query
  // ─────────────────────────────────────────────

  @Column({
    type: DataType.STRING(255),
    allowNull: false,
  })
  declare subject: string;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  declare message: string;

  @Column({
    type: DataType.STRING(60),
    allowNull: true,
  })
  declare category: string | null;

  @Column({
    type: DataType.ENUM('low', 'medium', 'high'),
    allowNull: false,
    defaultValue: 'medium',
  })
  declare priority: QueryPriority;

  @Column({
    type: DataType.ENUM('open', 'in-progress', 'resolved', 'closed'),
    allowNull: false,
    defaultValue: 'open',
  })
  declare status: QueryStatus;

  // ─────────────────────────────────────────────
  // Assigned User
  // ─────────────────────────────────────────────

  @ForeignKey(() => User)
  @Column({
    type: DataType.UUID,
    allowNull: true,
  })
  declare assigned_to: string | null;

  @BelongsTo(() => User, 'assigned_to')
  declare assignee: User;

  // ─────────────────────────────────────────────
  // Timestamps
  // ─────────────────────────────────────────────

  @CreatedAt
  declare created_at: Date;

  @UpdatedAt
  declare updated_at: Date;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  declare resolved_at: Date | null;
}
