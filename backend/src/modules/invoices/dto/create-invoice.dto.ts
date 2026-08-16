import { Type } from 'class-transformer';
import {
  IsDateString,
  IsIn,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  IsUUID,
  MaxLength,
  Min,
} from 'class-validator';

export class CreateInvoiceDto {
  @IsString()
  @MaxLength(40)
  invoice_number?: string;

  @IsUUID()
  client_id?: string;

  @IsOptional()
  @IsUUID()
  project_id?: string;

  @Type(() => Number)
  @IsNumber()
  @IsPositive()
  amount?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  amount_paid?: number;

  @IsOptional()
  @IsString()
  @MaxLength(10)
  currency?: string;

  @IsOptional()
  @IsIn(['draft', 'pending', 'paid', 'overdue', 'cancelled'])
  status?: 'draft' | 'pending' | 'paid' | 'overdue' | 'cancelled';

  @IsOptional()
  @IsString()
  @MaxLength(255)
  description?: string;

  @IsOptional()
  @IsDateString()
  issue_date?: string;

  @IsDateString()
  due_date?: string;

  @IsOptional()
  @IsUUID()
  created_by?: string;
}
