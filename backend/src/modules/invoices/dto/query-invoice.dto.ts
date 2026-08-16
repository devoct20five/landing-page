import { IsIn, IsInt, IsOptional, IsString, IsUUID } from 'class-validator';

export class QueryInvoiceDto {
  @IsOptional()
  @IsIn(['draft', 'pending', 'paid', 'overdue', 'cancelled'])
  status?: string;

  @IsOptional()
  @IsUUID()
  client_id?: string;

  @IsOptional()
  @IsUUID()
  project_id?: string;

  @IsOptional()
  @IsString()
  search?: string; // matches invoice_number / description

  @IsOptional()
  @IsInt()
  page?: number = 1;

  @IsOptional()
  @IsInt()
  limit?: number = 20;
}
