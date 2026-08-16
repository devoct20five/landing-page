import { IsIn } from 'class-validator';
import { RsvpStatus } from '@/common/enums/index.enum';

export class RsvpEventDto {
  @IsIn([RsvpStatus.ACCEPTED, RsvpStatus.DECLINED])
  rsvpStatus!: RsvpStatus;
}
