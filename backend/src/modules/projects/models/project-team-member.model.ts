import {
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';

import { Project } from './project.model';
import { User } from '@/modules/users/models/user.model';

/**
 * Join table with an extra attribute (role_on_project),
 * so it is treated as a full Sequelize model.
 */
@Table({
  tableName: 'project_team_members',
  timestamps: false,
  underscored: true,
})
export class ProjectTeamMember extends Model<ProjectTeamMember> {
  // ─────────────────────────────────────────────
  // Project
  // ─────────────────────────────────────────────

  @ForeignKey(() => Project)
  @Column({
    type: DataType.UUID,
    field: 'project_id',
    primaryKey: true,
    allowNull: false,
  })
  declare projectId: string;

  // ─────────────────────────────────────────────
  // Staff / User
  // ─────────────────────────────────────────────

  @ForeignKey(() => User)
  @Column({
    type: DataType.UUID,
    field: 'staff_id',
    primaryKey: true,
    allowNull: false,
  })
  declare staffId: string;

  // ─────────────────────────────────────────────
  // Team Member
  // ─────────────────────────────────────────────

  @Column({
    type: DataType.STRING(100),
    allowNull: true,
  })
  declare roleOnProject: string | null;

  @Column({
    type: DataType.DATE,
    field: 'assigned_at',
    allowNull: true,
  })
  declare assignedAt: Date | null;
}
