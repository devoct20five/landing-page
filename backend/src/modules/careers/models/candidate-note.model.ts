import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';

import { User } from '@/modules/users/models/user.model';
import { Candidate } from './candidate.model';

@Table({
  tableName: 'candidate_notes',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false,
})
export class CandidateNote extends Model<CandidateNote> {
  @Column({
    type: DataType.UUID,
    primaryKey: true,
    defaultValue: DataType.UUIDV4,
  })
  declare id: string;

  @ForeignKey(() => Candidate)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  declare candidate_id: string;

  @ForeignKey(() => User)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  declare user_id: string;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  declare note: string;

  @Column({
    field: 'created_at',
    type: DataType.DATE,
    allowNull: false,
  })
  declare created_at: Date;

  @BelongsTo(() => User, 'user_id')
  declare author: User;

  @BelongsTo(() => Candidate, 'candidate_id')
  declare candidate: Candidate;
}
