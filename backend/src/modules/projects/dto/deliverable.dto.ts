import {
  IsDateString,
  IsIn,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
} from 'class-validator';

import { DeliverableStatus } from '@/common/enums/index.enum';

export class CreateDeliverableDto {
  @IsString()
  @MaxLength(255)
  title?: string;

  @IsOptional()
  @IsUUID()
  serviceId?: string;

  @IsOptional()
  @IsIn(Object.values(DeliverableStatus))
  status?: DeliverableStatus;

  @IsOptional()
  @IsDateString()
  dueDate?: string;
}

export class UpdateDeliverableDto {
  @IsOptional()
  @IsString()
  @MaxLength(255)
  title?: string;

  @IsOptional()
  @IsUUID()
  serviceId?: string;

  @IsOptional()
  @IsIn(Object.values(DeliverableStatus))
  status?: DeliverableStatus;

  @IsOptional()
  @IsDateString()
  dueDate?: string;
}
