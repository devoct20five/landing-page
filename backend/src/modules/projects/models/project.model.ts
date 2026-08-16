import {
  AllowNull,
  BelongsTo,
  BelongsToMany,
  Column,
  DataType,
  Default,
  ForeignKey,
  HasMany,
  Model,
  Table,
} from 'sequelize-typescript';

import { ProjectStatus } from '@/common/enums/index.enum';
import { User } from '@/modules/users/models/user.model';
import { Service } from '@/modules/services/models/service.model';
import { Client } from '../../clients/models/client.model';
import { ProjectService } from './project-service.model';
import { ProjectTeamMember } from './project-team-member.model';
import { Deliverable } from './deliverable.model';

@Table({
  tableName: 'projects',
  timestamps: true,
  underscored: true,
})
export class Project extends Model<Project> {
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

  @AllowNull(false)
  @ForeignKey(() => Client)
  @Column({
    type: DataType.UUID,
    field: 'client_id',
  })
  declare clientId: string;

  @BelongsTo(() => Client, 'clientId')
  declare client: Client;

  // ─────────────────────────────────────────────
  // Project
  // ─────────────────────────────────────────────

  @AllowNull(false)
  @Column({
    type: DataType.STRING(150),
  })
  declare name: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  declare description: string | null;

  @Default(ProjectStatus.NOT_STARTED)
  @Column({
    type: DataType.ENUM(...Object.values(ProjectStatus)),
    allowNull: false,
  })
  declare status: ProjectStatus;

  @Default(0)
  @Column({
    type: DataType.TINYINT.UNSIGNED,
    allowNull: false,
  })
  declare progressPercent: number;

  @Default(0)
  @Column({
    type: DataType.SMALLINT.UNSIGNED,
    allowNull: false,
  })
  declare teamSize: number;

  // Surfaced on dashboards when a project needs attention
  // (blocked / review / deadline soon)
  @Column({
    type: DataType.STRING(255),
    allowNull: true,
  })
  declare attentionReason: string | null;

  @Column({
    type: DataType.STRING(255),
    allowNull: true,
  })
  declare currentWorkTitle: string | null;

  // ─────────────────────────────────────────────
  // Current Work Service
  // ─────────────────────────────────────────────

  @ForeignKey(() => Service)
  @Column({
    type: DataType.UUID,
    field: 'current_work_service_id',
    allowNull: true,
  })
  declare currentWorkServiceId: string | null;

  @BelongsTo(() => Service, 'currentWorkServiceId')
  declare currentWorkService: Service;

  @Column({
    type: DataType.TEXT,
    field: 'current_work_description',
    allowNull: true,
  })
  declare currentWorkDescription: string | null;

  @Column({
    type: DataType.DATEONLY,
    allowNull: true,
  })
  declare deadline: string | null;

  // ─────────────────────────────────────────────
  // Created By
  // ─────────────────────────────────────────────

  @ForeignKey(() => User)
  @Column({
    type: DataType.UUID,
    field: 'created_by',
    allowNull: false,
  })
  declare createdBy: string;

  @BelongsTo(() => User, 'createdBy')
  declare creator: User;

  // ─────────────────────────────────────────────
  // Services
  // ─────────────────────────────────────────────

  // project_services join table
  // Services involved in this project
  @BelongsToMany(() => Service, () => ProjectService)
  declare services: Service[];

  // ─────────────────────────────────────────────
  // Team Members
  // ─────────────────────────────────────────────

  // project_team_members join table
  // Staff assigned to this project
  @BelongsToMany(() => User, () => ProjectTeamMember)
  declare teamMembers: User[];

  // ─────────────────────────────────────────────
  // Deliverables
  // ─────────────────────────────────────────────

  @HasMany(() => Deliverable, 'projectId')
  declare deliverables: Deliverable[];
}
