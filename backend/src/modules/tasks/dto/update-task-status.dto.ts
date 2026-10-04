import { IsEnum, IsNotEmpty } from 'class-validator';
import { TaskStatus } from '@/common/enums/index.enum';

export class UpdateTaskStatusDto {
  @IsEnum(TaskStatus)
  @IsNotEmpty()
  status!: TaskStatus;
}
