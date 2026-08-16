import {
  AllowNull,
  BelongsTo,
  Column,
  DataType,
  Default,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';

import { DeliverableStatus } from '@/common/enums/index.enum';
import { Project } from './project.model';
import { Service } from '@/modules/services/models/service.model';

@Table({
  tableName: 'deliverables',
  timestamps: true,
  underscored: true,
})
export class Deliverable extends Model<Deliverable> {
  @Column({
    type: DataType.UUID,
    primaryKey: true,
    defaultValue: DataType.UUIDV4,
  })
  declare id: string;

  // ─────────────────────────────────────────────
  // Project
  // ─────────────────────────────────────────────

  @AllowNull(false)
  @ForeignKey(() => Project)
  @Column({
    type: DataType.UUID,
    field: 'project_id',
  })
  declare projectId: string;

  @BelongsTo(() => Project, 'projectId')
  declare project: Project;

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
  declare service: Service;

  // ─────────────────────────────────────────────
  // Deliverable
  // ─────────────────────────────────────────────

  @AllowNull(false)
  @Column({
    type: DataType.STRING(255),
  })
  declare title: string;

  @Default(DeliverableStatus.PENDING)
  @Column({
    type: DataType.ENUM(...Object.values(DeliverableStatus)),
    allowNull: false,
  })
  declare status: DeliverableStatus;

  @Column({
    type: DataType.DATEONLY,
    allowNull: true,
  })
  declare dueDate: string | null;
}
