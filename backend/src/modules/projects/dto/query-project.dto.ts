import { Type } from 'class-transformer';
import {
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  IsUUID,
  Min,
} from 'class-validator';

import { ProjectStatus } from '@/common/enums/index.enum';

export class QueryProjectDto {
  @IsOptional()
  @IsString()
  search?: string; // matches project name

  @IsOptional()
  @IsIn(Object.values(ProjectStatus))
  status?: ProjectStatus;

  @IsOptional()
  @IsUUID()
  clientId?: string;

  // Filters to projects a given staff member is assigned to (staff portal)
  @IsOptional()
  @IsUUID()
  staffId?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number = 20;
}
