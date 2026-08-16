import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  HasMany,
  Model,
  Table,
} from 'sequelize-typescript';

import { JobPosting } from './job-posting.model';
import { CandidateNote } from './candidate-note.model';

export type CandidateStage =
  'new' | 'review' | 'shortlisted' | 'interview' | 'hired' | 'rejected';

@Table({
  tableName: 'candidates',
  timestamps: true,
  createdAt: 'applied_at',
  updatedAt: 'updated_at',
})
export class Candidate extends Model<Candidate> {
  @Column({
    type: DataType.UUID,
    primaryKey: true,
    defaultValue: DataType.UUIDV4,
  })
  declare id: string;

  @ForeignKey(() => JobPosting)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  declare job_id: string;

  @Column({
    type: DataType.STRING(150),
    allowNull: false,
  })
  declare name: string;

  @Column({
    type: DataType.STRING(190),
    allowNull: false,
  })
  declare email: string;

  @Column({
    type: DataType.STRING(30),
    allowNull: true,
  })
  declare phone: string | null;

  @Column({
    type: DataType.STRING(500),
    allowNull: true,
  })
  declare resume_url: string | null;

  @Column({
    type: DataType.DECIMAL(4, 1),
    allowNull: true,
  })
  declare experience_years: number | null;

  @Column({
    type: DataType.ENUM(
      'new',
      'review',
      'shortlisted',
      'interview',
      'hired',
      'rejected',
    ),
    allowNull: false,
    defaultValue: 'new',
  })
  declare stage: CandidateStage;

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  declare applied_at: Date;

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  declare updated_at: Date;

  @BelongsTo(() => JobPosting, 'job_id')
  declare job: JobPosting;

  @HasMany(() => CandidateNote, 'candidate_id')
  declare notes: CandidateNote[];
}
