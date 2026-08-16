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
import { Project } from '@/modules/projects/models/project.model';
import { Client } from '@/modules/clients/models/client.model';

export enum BtwContentType {
  PHOTO = 'photo',
  VIDEO = 'video',
  YOUTUBE = 'youtube',
}

export enum BtwStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
}

@Table({
  tableName: 'behind_the_work',
  timestamps: false,
})
export class BehindTheWork extends Model<BehindTheWork> {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  declare id: string;

  @Column({
    type: DataType.ENUM(...Object.values(BtwContentType)),
    allowNull: false,
  })
  declare content_type: BtwContentType;

  @Column({
    type: DataType.STRING(255),
    allowNull: false,
  })
  declare title: string;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  declare description: string;

  @ForeignKey(() => Project)
  @Column({
    type: DataType.UUID,
    allowNull: true,
  })
  declare project_id: string | null;

  @BelongsTo(() => Project)
  declare project: Project;

  @ForeignKey(() => Client)
  @Column({
    type: DataType.UUID,
    allowNull: true,
  })
  declare client_id: string | null;

  @BelongsTo(() => Client)
  declare client: Client;

  @Column({
    type: DataType.STRING(500),
    allowNull: true,
  })
  declare thumbnail_url: string | null;

  @Column({
    type: DataType.STRING(500),
    allowNull: false,
  })
  declare media_url: string;

  @Default(BtwStatus.DRAFT)
  @Column({
    type: DataType.ENUM(...Object.values(BtwStatus)),
    allowNull: false,
  })
  declare status: BtwStatus;

  @ForeignKey(() => User)
  @Column({
    type: DataType.UUID,
    allowNull: true,
  })
  declare author_id: string | null;

  @BelongsTo(() => User)
  declare author: User;

  @Column({
    field: 'created_at',
    type: DataType.DATE,
    allowNull: false,
  })
  declare created_at: Date;

  @Column({
    field: 'published_at',
    type: DataType.DATE,
    allowNull: true,
  })
  declare published_at: Date | null;
}
