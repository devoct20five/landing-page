import { IsEnum, IsOptional, IsString, IsUUID } from 'class-validator';

import { PaginationQueryDto } from '@/common/dto/pagination-query.dto';
import { FileType } from '@/common/enums/index.enum';

export class QueryFileDto extends PaginationQueryDto {
  @IsOptional()
  @IsUUID()
  projectId?: string;

  /** Omit to list root-level files; pass null/appropriate root handling when needed. */
  @IsOptional()
  @IsUUID()
  folderId?: string;

  @IsOptional()
  @IsEnum(FileType)
  fileType?: FileType;

  @IsOptional()
  @IsString()
  search?: string;
}
