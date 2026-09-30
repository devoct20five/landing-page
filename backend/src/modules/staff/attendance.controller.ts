import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { AttendanceService } from './attendance.service';
import {
  CheckInDto,
  QueryAttendanceDto,
  UpsertAttendanceDto,
} from './dto/attendance.dto';

// NOTE: staffId for check-in/out should come from the authenticated staff
// user in production, not a route param — left as a param here so the
// module works before auth is wired in.
@Controller('attendance')
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  @Post(':staffId/check-in')
  checkIn(
    @Param('staffId', ParseUUIDPipe) staffId: string,
    @Body() dto: CheckInDto,
  ) {
    return this.attendanceService.checkIn(staffId, dto);
  }

  @Post(':staffId/check-out')
  checkOut(@Param('staffId', ParseUUIDPipe) staffId: string) {
    return this.attendanceService.checkOut(staffId);
  }

  /** Admin manual override for a staff member's attendance on a given date (3.7). */
  @Put(':staffId')
  upsert(
    @Param('staffId', ParseUUIDPipe) staffId: string,
    @Body() dto: UpsertAttendanceDto,
  ) {
    return this.attendanceService.upsert(staffId, dto);
  }

  /** Company-wide dashboard for a given day, with date navigation (3.7). */
  @Get()
  findByDate(@Query() query: QueryAttendanceDto) {
    return this.attendanceService.findByDate(query);
  }

  /** Personal history + hours-worked summary (2.7). */
  @Get(':staffId')
  findForStaff(
    @Param('staffId', ParseUUIDPipe) staffId: string,
    @Query('from') from?: string,
    @Query('to') to?: string,
  ) {
    return this.attendanceService.findForStaff(staffId, from, to);
  }
}
