import {
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';

import { Project } from './project.model';
import { Service } from '@/modules/services/models/service.model';

/**
 * Pure join table:
 * which services are involved in a project (many-to-many).
 */
@Table({
  tableName: 'project_services',
  timestamps: false,
  underscored: true,
})
export class ProjectService extends Model<ProjectService> {
  @ForeignKey(() => Project)
  @Column({
    type: DataType.UUID,
    field: 'project_id',
    primaryKey: true,
    allowNull: false,
  })
  declare projectId: string;

  @ForeignKey(() => Service)
  @Column({
    type: DataType.UUID,
    field: 'service_id',
    primaryKey: true,
    allowNull: false,
  })
  declare serviceId: string;
}
