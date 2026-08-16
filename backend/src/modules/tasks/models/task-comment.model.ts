import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';

import { Task } from './task.model';
import { User } from '@/modules/users/models/user.model';

@Table({
  tableName: 'task_comments',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false,
})
export class TaskComment extends Model<TaskComment> {
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
  // Task
  // ─────────────────────────────────────────────

  @ForeignKey(() => Task)
  @Column({
    type: DataType.UUID,
    field: 'task_id',
    allowNull: false,
  })
  declare taskId: string;

  @BelongsTo(() => Task, 'taskId')
  declare task: Task;

  // ─────────────────────────────────────────────
  // User
  // ─────────────────────────────────────────────

  @ForeignKey(() => User)
  @Column({
    type: DataType.UUID,
    field: 'user_id',
    allowNull: false,
  })
  declare userId: string;

  @BelongsTo(() => User, 'userId')
  declare user: User;

  // ─────────────────────────────────────────────
  // Comment
  // ─────────────────────────────────────────────

  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  declare comment: string;
}
