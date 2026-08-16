import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  HasMany,
  Model,
  Table,
} from 'sequelize-typescript';

import { Project } from '@/modules/projects/models/project.model';
import { User } from '@/modules/users/models/user.model';
import { File } from './file.model';

@Table({
  tableName: 'folders',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false,
})
export class Folder extends Model<Folder> {
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
    allowNull: true,
  })
  declare projectId: string | null;

  @BelongsTo(() => Project, 'projectId')
  declare project: Project;

  // ─────────────────────────────────────────────
  // Parent Folder
  // ─────────────────────────────────────────────

  @ForeignKey(() => Folder)
  @Column({
    type: DataType.UUID,
    field: 'parent_id',
    allowNull: true,
  })
  declare parentId: string | null;

  @BelongsTo(() => Folder, {
    foreignKey: 'parentId',
    as: 'parent',
  })
  declare parent: Folder;

  @HasMany(() => Folder, {
    foreignKey: 'parentId',
    as: 'children',
  })
  declare children: Folder[];

  // ─────────────────────────────────────────────
  // Folder
  // ─────────────────────────────────────────────

  @Column({
    type: DataType.STRING(150),
    allowNull: false,
  })
  declare name: string;

  // ─────────────────────────────────────────────
  // Created By
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
  })
  declare creator: User;

  // ─────────────────────────────────────────────
  // Files
  // ─────────────────────────────────────────────

  @HasMany(() => File, 'folderId')
  declare files: File[];
}
