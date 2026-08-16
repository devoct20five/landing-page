import { IsEnum, IsOptional, IsString, IsUUID } from 'class-validator';

import { PaginationQueryDto } from '@/common/dto/pagination-query.dto';
import { TaskPriority, TaskStatus } from '@/common/enums/index.enum';

export class QueryTaskDto extends PaginationQueryDto {
  @IsOptional()
  @IsUUID()
  projectId?: string;

  @IsOptional()
  @IsUUID()
  clientId?: string;

  @IsOptional()
  @IsUUID()
  assigneeId?: string;

  @IsOptional()
  @IsEnum(TaskStatus)
  status?: TaskStatus;

  @IsOptional()
  @IsEnum(TaskPriority)
  priority?: TaskPriority;

  /** 'due-today' | 'overdue' — drives the due-date label chips in the UI */
  @IsOptional()
  @IsString()
  dueLabel?: 'due-today' | 'overdue';

  @IsOptional()
  @IsString()
  search?: string;
}
