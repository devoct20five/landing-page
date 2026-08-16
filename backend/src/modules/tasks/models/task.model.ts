import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  HasMany,
  Model,
  Table,
} from 'sequelize-typescript';

import { TaskPriority, TaskStatus } from '@/common/enums/index.enum';
import { Project } from '@/modules/projects/models/project.model';
import { Client } from '@/modules/clients/models/client.model';
import { User } from '@/modules/users/models/user.model';
import { Service } from '@/modules/services/models/service.model';

import { TaskComment } from './task-comment.model';

@Table({
  tableName: 'tasks',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
})
export class Task extends Model<Task> {
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
  // Project
  // ─────────────────────────────────────────────

  @ForeignKey(() => Project)
  @Column({
    type: DataType.UUID,
    field: 'project_id',
    allowNull: false,
  })
  declare projectId: string;

  @BelongsTo(() => Project, 'projectId')
  declare project: Project;

  // ─────────────────────────────────────────────
  // Client
  // ─────────────────────────────────────────────

  @ForeignKey(() => Client)
  @Column({
    type: DataType.UUID,
    field: 'client_id',
    allowNull: false,
  })
  declare clientId: string;

  @BelongsTo(() => Client, 'clientId')
  declare client: Client;

  // ─────────────────────────────────────────────
  // Assignee
  // ─────────────────────────────────────────────

  @ForeignKey(() => User)
  @Column({
    type: DataType.UUID,
    field: 'assignee_id',
    allowNull: true,
  })
  declare assigneeId: string | null;

  @BelongsTo(() => User, {
    foreignKey: 'assigneeId',
    as: 'assignee',
  })
  declare assignee: User | null;

  // ─────────────────────────────────────────────
  // Service
  // ─────────────────────────────────────────────

  @ForeignKey(() => Service)
  @Column({
    type: DataType.UUID,
    field: 'service_id',
    allowNull: true,
  })
  declare serviceId: string | null;

  @BelongsTo(() => Service, 'serviceId')
  declare service: Service | null;

  // ─────────────────────────────────────────────
  // Task
  // ─────────────────────────────────────────────

  @Column({
    type: DataType.STRING(255),
    allowNull: false,
  })
  declare title: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  declare description: string | null;

  @Column({
    type: DataType.ENUM(...Object.values(TaskStatus)),
    allowNull: false,
    defaultValue: TaskStatus.NOT_STARTED,
  })
  declare status: TaskStatus;

  @Column({
    type: DataType.ENUM(...Object.values(TaskPriority)),
    allowNull: false,
    defaultValue: TaskPriority.MEDIUM,
  })
  declare priority: TaskPriority;

  @Column({
    type: DataType.DATEONLY,
    field: 'due_date',
    allowNull: true,
  })
  declare dueDate: string | null;

  // ─────────────────────────────────────────────
  // Creator
  // ─────────────────────────────────────────────

  @ForeignKey(() => User)
  @Column({
    type: DataType.UUID,
    field: 'created_by',
    allowNull: true,
  })
  declare createdBy: string | null;

  @BelongsTo(() => User, {
    foreignKey: 'createdBy',
    as: 'creator',
  })
  declare creator: User | null;

  // ─────────────────────────────────────────────
  // Comments
  // ─────────────────────────────────────────────

  @HasMany(() => TaskComment, {
    foreignKey: 'taskId',
  })
  declare comments: TaskComment[];

  /**
   * Populated through a COUNT query/subquery
   * in the service layer.
   *
   * Not a database column.
   */
  declare commentCount?: number;
}
