import { IsIn, IsOptional, IsString, IsUUID, MaxLength } from 'class-validator';

export class CreateQueryDto {
  @IsUUID()
  client_id?: string;

  @IsOptional()
  @IsUUID()
  project_id?: string;

  @IsString()
  @MaxLength(255)
  subject?: string;

  @IsString()
  message?: string;

  @IsOptional()
  @IsString()
  @MaxLength(60)
  category?: string;

  @IsOptional()
  @IsIn(['low', 'medium', 'high'])
  priority?: 'low' | 'medium' | 'high';
}
