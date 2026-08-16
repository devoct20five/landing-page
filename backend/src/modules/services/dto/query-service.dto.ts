import { Type } from 'class-transformer';
import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class QueryServiceDto {
  @IsOptional()
  @IsString()
  search?: string;

  // client-facing browse (1.6) should only ever see active=true;
  // admin catalog management (3.14) passes nothing to see everything.
  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  activeOnly?: boolean;
}
