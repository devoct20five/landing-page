import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';

import { ActivityType } from '@/common/enums/index.enum';
import { User } from '@/modules/users/models/user.model';
import { Project } from '@/modules/projects/models/project.model';
import { Client } from '@/modules/clients/models/client.model';

@Table({
  tableName: 'activity_log',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false,
})
export class ActivityLog extends Model<ActivityLog> {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  declare id: string;

  // Actor User ID
  @ForeignKey(() => User)
  @Column({
    type: DataType.UUID,
    field: 'actor_id',
    allowNull: true,
  })
  declare actorId: string | null;

  @BelongsTo(() => User, 'actorId')
  declare actor: User;

  // Project ID
  @ForeignKey(() => Project)
  @Column({
    type: DataType.UUID,
    field: 'project_id',
    allowNull: true,
  })
  declare projectId: string | null;

  @BelongsTo(() => Project, 'projectId')
  declare project: Project;

  // Client ID
  @ForeignKey(() => Client)
  @Column({
    type: DataType.UUID,
    field: 'client_id',
    allowNull: true,
  })
  declare clientId: string | null;

  @BelongsTo(() => Client, 'clientId')
  declare client: Client;

  @Column({
    type: DataType.ENUM(...Object.values(ActivityType)),
    field: 'activity_type',
    allowNull: false,
  })
  declare activityType: ActivityType;

  @Column({
    type: DataType.STRING(500),
    allowNull: false,
  })
  declare description: string;

  @Column({
    type: DataType.JSON,
    field: 'metadata_json',
    allowNull: true,
  })
  declare metadataJson: Record<string, unknown> | null;
}
