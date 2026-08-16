import {
  IsEmail,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Max,
  MaxLength,
  Min,
} from 'class-validator';

export class CreateCandidateDto {
  @IsUUID()
  job_id?: string;

  @IsString()
  @MaxLength(150)
  name?: string;

  @IsEmail()
  @MaxLength(190)
  email?: string;

  @IsOptional()
  @IsString()
  @MaxLength(30)
  phone?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  resume_url?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(60)
  experience_years?: number;
}
