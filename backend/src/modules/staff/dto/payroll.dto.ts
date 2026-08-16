import { Type } from 'class-transformer';
import {
  IsEnum,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Max,
  MaxLength,
  Min,
} from 'class-validator';

import { PayoutStatus } from '../models/payroll.model';

export class CreatePayrollEntryDto {
  @IsUUID()
  staffId?: string;

  @IsInt()
  @Min(1)
  @Max(12)
  periodMonth?: number;

  @IsInt()
  periodYear?: number;

  @IsNumber()
  @Min(0)
  salaryAmount?: number;

  @IsOptional()
  @IsString()
  @MaxLength(10)
  currency?: string;

  @IsOptional()
  @IsEnum(PayoutStatus)
  payoutStatus?: PayoutStatus;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  paymentMethod?: string;
}

export class UpdatePayrollEntryDto {
  @IsOptional()
  @IsNumber()
  @Min(0)
  salaryAmount?: number;

  @IsOptional()
  @IsEnum(PayoutStatus)
  payoutStatus?: PayoutStatus;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  paymentMethod?: string;
}

export class QueryPayrollDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(12)
  month?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  year?: number;

  @IsOptional()
  @IsEnum(PayoutStatus)
  status?: PayoutStatus;

  @IsOptional()
  @IsUUID()
  staffId?: string;
}
