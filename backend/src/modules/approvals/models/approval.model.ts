import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { ApprovalStatus } from '@/common/enums/index.enum';
import { Project } from '@/modules/projects/models/project.model';
import { Client } from '@/modules/clients/models/client.model';
import { User } from '@/modules/users/models/user.model';
import { Deliverable } from '@/modules/projects/models/deliverable.model';
import { File } from '../../files/models/file.model';

@Table({
  tableName: 'approvals',
  timestamps: false,
})
export class Approval extends Model<Approval> {
  @Column({
    type: DataType.UUID,
    primaryKey: true,
    defaultValue: DataType.UUIDV4,
  })
  declare id: string;

  @ForeignKey(() => Project)
  @Column({
    type: DataType.UUID,
    field: 'project_id',
  })
  declare projectId: string;

  @BelongsTo(() => Project)
  declare project: Project;

  @ForeignKey(() => Client)
  @Column({
    type: DataType.UUID,
    field: 'client_id',
  })
  declare clientId: string;

  @BelongsTo(() => Client)
  declare client: Client;

  @ForeignKey(() => Deliverable)
  @Column({
    type: DataType.UUID,
    field: 'deliverable_id',
    allowNull: true,
  })
  declare deliverableId: string | null;

  @BelongsTo(() => Deliverable)
  declare deliverable: Deliverable;

  @Column({
    type: DataType.STRING(255),
  })
  declare title: string;

  @Column({
    type: DataType.STRING(20),
  })
  declare version: string;

  @ForeignKey(() => File)
  @Column({
    type: DataType.UUID,
    field: 'file_id',
    allowNull: true,
  })
  declare fileId: string | null;

  @BelongsTo(() => File)
  declare file: File;

  @Column({
    type: DataType.ENUM(...Object.values(ApprovalStatus)),
    defaultValue: ApprovalStatus.PENDING,
  })
  declare status: ApprovalStatus;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  declare feedback: string | null;

  @ForeignKey(() => User)
  @Column({
    type: DataType.UUID,
    field: 'requested_by',
    allowNull: true,
  })
  declare requestedBy: string | null;

  @BelongsTo(() => User, {
    foreignKey: 'requestedBy',
    as: 'requester',
  })
  declare requester: User;

  @ForeignKey(() => User)
  @Column({
    type: DataType.UUID,
    field: 'reviewed_by',
    allowNull: true,
  })
  declare reviewedBy: string | null;

  @BelongsTo(() => User, {
    foreignKey: 'reviewedBy',
    as: 'reviewer',
  })
  declare reviewer: User;

  @Column({
    type: DataType.DATE,
    field: 'requested_at',
    defaultValue: DataType.NOW,
  })
  declare requestedAt: Date;

  @Column({
    type: DataType.DATE,
    field: 'reviewed_at',
    allowNull: true,
  })
  declare reviewedAt: Date | null;
}
