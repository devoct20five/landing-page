import {
  IsDateString,
  IsEnum,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { AttendanceStatus, WorkMode } from '../models/attendance.model';

export class CheckInDto {
  @IsOptional()
  @IsEnum(WorkMode)
  workMode?: WorkMode;
}

export class CheckOutDto {}

/** Admin manual override for a staff member's attendance on a given date. */
export class UpsertAttendanceDto {
  @IsDateString()
  workDate?: string;

  @IsEnum(AttendanceStatus)
  status?: AttendanceStatus;

  @IsOptional()
  @IsEnum(WorkMode)
  workMode?: WorkMode;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  notes?: string;
}

export class QueryAttendanceDto {
  @IsOptional()
  @IsDateString()
  date?: string; // defaults to today when omitted (admin date navigation, 3.7)

  @IsOptional()
  @IsString()
  search?: string; // filter/search by staff member (3.7)
}
