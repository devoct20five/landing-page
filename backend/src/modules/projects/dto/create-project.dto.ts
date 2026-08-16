import {
  IsArray,
  IsDateString,
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  Min,
} from 'class-validator';

import { ProjectStatus } from '@/common/enums/index.enum';

export class CreateProjectDto {
  @IsUUID()
  clientId?: string;

  @IsString()
  @MaxLength(150)
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsIn(Object.values(ProjectStatus))
  status?: ProjectStatus;

  @IsOptional()
  @IsInt()
  @Min(0)
  teamSize?: number;

  @IsOptional()
  @IsDateString()
  deadline?: string;

  // Service IDs involved in this project (project_services)
  @IsOptional()
  @IsArray()
  @IsUUID(undefined, { each: true })
  serviceIds?: string[];

  // Staff user IDs to assign at creation time (project_team_members)
  @IsOptional()
  @IsArray()
  @IsUUID(undefined, { each: true })
  teamMemberIds?: string[];

  @IsOptional()
  @IsUUID()
  createdBy?: string;
}
