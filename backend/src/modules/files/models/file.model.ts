import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';

import { FileType } from '@/common/enums/index.enum';
import { Project } from '@/modules/projects/models/project.model';
import { User } from '@/modules/users/models/user.model';
import { Folder } from './folder.model';

@Table({
  tableName: 'files',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false,
})
export class File extends Model<File> {
  @Column({
    type: DataType.UUID,
    primaryKey: true,
    defaultValue: DataType.UUIDV4,
  })
  declare id: string;

  // ─────────────────────────────────────────────
  // Folder
  // ─────────────────────────────────────────────

  @ForeignKey(() => Folder)
  @Column({
    type: DataType.UUID,
    field: 'folder_id',
    allowNull: true,
  })
  declare folderId: string | null;

  @BelongsTo(() => Folder, 'folderId')
  declare folder: Folder;

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
  // File
  // ─────────────────────────────────────────────

  @Column({
    type: DataType.STRING(255),
    allowNull: false,
  })
  declare name: string;

  @Column({
    type: DataType.ENUM(...Object.values(FileType)),
    field: 'file_type',
    allowNull: false,
    defaultValue: FileType.OTHER,
  })
  declare fileType: FileType;

  @Column({
    type: DataType.STRING(120),
    field: 'mime_type',
    allowNull: true,
  })
  declare mimeType: string | null;

  // File size in bytes, NOT an ID.
  @Column({
    type: DataType.BIGINT.UNSIGNED,
    field: 'size_bytes',
    allowNull: true,
  })
  declare sizeBytes: number | null;

  @Column({
    type: DataType.STRING(500),
    field: 'storage_url',
    allowNull: false,
  })
  declare storageUrl: string;

  @Column({
    type: DataType.STRING(20),
    allowNull: false,
    defaultValue: '01',
  })
  declare version: string;

  // ─────────────────────────────────────────────
  // Uploaded By
  // ─────────────────────────────────────────────

  @ForeignKey(() => User)
  @Column({
    type: DataType.UUID,
    field: 'uploaded_by',
    allowNull: true,
  })
  declare uploadedBy: string | null;

  @BelongsTo(() => User, 'uploadedBy')
  declare uploader: User;
}
