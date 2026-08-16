import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  HasMany,
  Model,
  Table,
} from 'sequelize-typescript';

import { User } from '@/modules/users/models/user.model';
import { Candidate } from './candidate.model';

export type JobStatus = 'open' | 'paused' | 'closed';

@Table({
  tableName: 'job_postings',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false,
})
export class JobPosting extends Model<JobPosting> {
  @Column({
    type: DataType.UUID,
    primaryKey: true,
    defaultValue: DataType.UUIDV4,
  })
  declare id: string;

  @Column({
    type: DataType.STRING(150),
    allowNull: false,
  })
  declare title: string;

  @Column({
    type: DataType.STRING(100),
    allowNull: true,
  })
  declare department: string | null;

  @Column({
    type: DataType.STRING(50),
    allowNull: false,
    defaultValue: 'Full-time',
  })
  declare employment_type: string;

  @Column({
    type: DataType.STRING(150),
    allowNull: true,
  })
  declare location: string | null;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  declare description: string | null;

  @Column({
    type: DataType.ENUM('open', 'paused', 'closed'),
    allowNull: false,
    defaultValue: 'open',
  })
  declare status: JobStatus;

  @Column({
    type: DataType.DATEONLY,
    allowNull: true,
  })
  declare posted_at: string | null;

  @Column({
    type: DataType.DATEONLY,
    allowNull: true,
  })
  declare deadline: string | null;

  @ForeignKey(() => User)
  @Column({
    type: DataType.UUID,
    allowNull: true,
  })
  declare created_by: string | null;

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  declare created_at: Date;

  @BelongsTo(() => User, 'created_by')
  declare creator: User;

  @HasMany(() => Candidate, 'job_id')
  declare candidates: Candidate[];
}
