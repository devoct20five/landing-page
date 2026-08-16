import { IsEnum, IsOptional, IsUUID } from 'class-validator';

import { PaginationQueryDto } from '@/common/dto/pagination-query.dto';
import { ApprovalStatus } from '@/common/enums/index.enum';

export class QueryApprovalDto extends PaginationQueryDto {
  @IsOptional()
  @IsUUID()
  projectId?: string;

  @IsOptional()
  @IsUUID()
  clientId?: string;

  @IsOptional()
  @IsUUID()
  deliverableId?: string;

  @IsOptional()
  @IsEnum(ApprovalStatus)
  status?: ApprovalStatus;
}
