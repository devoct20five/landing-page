import { PartialType, OmitType } from '@nestjs/mapped-types';
import { IsEnum, IsOptional } from 'class-validator';
import { CreateEventDto } from './create-event.dto';
import { EventStatus } from '@/common/enums/index.enum';

export class UpdateEventDto extends PartialType(
  OmitType(CreateEventDto, ['attendeeUserIds'] as const),
) {
  @IsOptional()
  @IsEnum(EventStatus)
  status?: EventStatus;
}
