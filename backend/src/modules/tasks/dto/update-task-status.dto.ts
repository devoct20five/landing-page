import { IsEnum } from 'class-validator';
import { TaskStatus } from '@/common/enums/index.enum';

export class UpdateTaskStatusDto {
  @IsEnum(TaskStatus)
  status?: TaskStatus;
}
