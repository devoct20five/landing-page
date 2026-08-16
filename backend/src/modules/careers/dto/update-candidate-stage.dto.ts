import { IsIn } from 'class-validator';

export class UpdateCandidateStageDto {
  @IsIn(['new', 'review', 'shortlisted', 'interview', 'hired', 'rejected'])
  stage?: 'new' | 'review' | 'shortlisted' | 'interview' | 'hired' | 'rejected';
}
