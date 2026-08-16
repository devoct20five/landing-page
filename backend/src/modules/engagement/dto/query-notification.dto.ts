import { Type } from 'class-transformer';
import { IsBoolean, IsOptional } from 'class-validator';

import { PaginationQueryDto } from '@/common/dto/pagination-query.dto';

export class QueryNotificationDto extends PaginationQueryDto {
  // ?unread=true to only return unread notifications
  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  unread?: boolean;
}
