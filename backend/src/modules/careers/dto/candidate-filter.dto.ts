import { IsIn, IsInt, IsOptional, IsString, IsUUID } from 'class-validator';

export class CandidateFilterDto {
  @IsOptional()
  @IsUUID()
  job_id?: string;

  @IsOptional()
  @IsIn(['new', 'review', 'shortlisted', 'interview', 'hired', 'rejected'])
  stage?: string;

  @IsOptional()
  @IsString()
  search?: string; // name / email

  @IsOptional()
  @IsInt()
  page?: number = 1;

  @IsOptional()
  @IsInt()
  limit?: number = 20;
}
