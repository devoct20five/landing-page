import { Type } from 'class-transformer';
import { IsIn, IsInt, IsOptional, IsString, Min } from 'class-validator';
import { ClientStatus } from '@/common/enums/index.enum';

export class QueryClientDto {
  @IsOptional()
  @IsString()
  search?: string; // matches name / short_name / email

  @IsOptional()
  @IsIn(Object.values(ClientStatus))
  status?: ClientStatus;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number = 20;
}
