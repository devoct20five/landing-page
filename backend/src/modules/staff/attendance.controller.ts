import {
  Body,
  Controller,
  ForbiddenException,
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
import { CurrentUser } from '@/common/decorators/current-user.decorator';
import { RequirePermissions } from '@/common/decorators/permissions.decorator';
import type { RequestUser } from '../auth/types/authenticated-user.type';

// docs/00_CURRENT_STATE_AUDIT.md §30/§31: staffId used to come straight
// from the URL param with nothing checking it against the caller — any
// authenticated staff user could check in/out as, or read the attendance
// history of, any other staff member just by changing the UUID. Self-
// service actions now assert the param matches the authenticated user;
// "view someone else's" requires the attendance.view/manage permission.
@Controller('attendance')
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  @Post(':staffId/check-in')
  @RequirePermissions('attendance.self')
  checkIn(
    @Param('staffId', ParseUUIDPipe) staffId: string,
    @Body() dto: CheckInDto,
    @CurrentUser() user: RequestUser,
  ) {
    this.assertSelf(staffId, user);
    return this.attendanceService.checkIn(staffId, dto);
  }

  @Post(':staffId/check-out')
  @RequirePermissions('attendance.self')
  checkOut(
    @Param('staffId', ParseUUIDPipe) staffId: string,
    @CurrentUser() user: RequestUser,
  ) {
    this.assertSelf(staffId, user);
    return this.attendanceService.checkOut(staffId);
  }

  /** Admin manual override for a staff member's attendance on a given date (3.7). */
  @Put(':staffId')
  @RequirePermissions('attendance.manage')
  upsert(
    @Param('staffId', ParseUUIDPipe) staffId: string,
    @Body() dto: UpsertAttendanceDto,
  ) {
    return this.attendanceService.upsert(staffId, dto);
  }

  /** Company-wide dashboard for a given day, with date navigation (3.7). */
  @Get()
  @RequirePermissions('attendance.view')
  findByDate(@Query() query: QueryAttendanceDto) {
    return this.attendanceService.findByDate(query);
  }

  /** Personal history + hours-worked summary (2.7). */
  @Get(':staffId')
  @RequirePermissions('attendance.self')
  findForStaff(
    @Param('staffId', ParseUUIDPipe) staffId: string,
    @Query('from') from: string | undefined,
    @Query('to') to: string | undefined,
    @CurrentUser() user: RequestUser,
  ) {
    if (staffId !== user.id && !user.permissions.includes('attendance.view')) {
      throw new ForbiddenException(
        'You do not have permission to view another staff member\u2019s attendance.',
      );
    }
    return this.attendanceService.findForStaff(staffId, from, to);
  }

  private assertSelf(staffId: string, user: RequestUser): void {
    if (staffId !== user.id) {
      throw new ForbiddenException('You can only check yourself in or out.');
    }
  }
}
