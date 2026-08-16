import { IsEnum, IsOptional, IsString, IsUUID } from 'class-validator';

import { PaginationQueryDto } from '@/common/dto/pagination-query.dto';
import { BtwContentType, BtwStatus } from '../models/behind-the-work.model';

export class QueryBehindTheWorkDto extends PaginationQueryDto {
  @IsOptional()
  @IsEnum(BtwStatus)
  status?: BtwStatus;

  @IsOptional()
  @IsEnum(BtwContentType)
  content_type?: BtwContentType;

  @IsOptional()
  @IsUUID()
  project_id?: string;

  @IsOptional()
  @IsUUID()
  client_id?: string;

  @IsOptional()
  @IsString()
  search?: string;
}
