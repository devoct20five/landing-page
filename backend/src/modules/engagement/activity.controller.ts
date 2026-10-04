import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ActivityService } from './activity.service';
import { CreateActivityLogDto } from './dto/create-activity-log.dto';
import { QueryActivityLogDto } from './dto/query-activity-log.dto';
import { CurrentUser } from '@/common/decorators/current-user.decorator';
import { RequirePermissions } from '@/common/decorators/permissions.decorator';
import type { RequestUser } from '../auth/types/authenticated-user.type';

@Controller('activity')
export class ActivityController {
  constructor(private readonly activityService: ActivityService) {}

  @Get()
  @RequirePermissions('activity.view')
  findAll(@Query() query: QueryActivityLogDto, @CurrentUser() user: RequestUser) {
    return this.activityService.findAll(query, user);
  }

  /** Dashboard "recent activity" widgets — grouped by calendar day. */
  @Get('feed')
  @RequirePermissions('activity.view')
  findFeed(@Query() query: QueryActivityLogDto, @CurrentUser() user: RequestUser) {
    return this.activityService.findGroupedByDay(query, user);
  }

  /**
   * Manual/system write path. Other modules (tasks, approvals, files, payments...)
   * should prefer injecting ActivityService and calling log() directly rather than
   * making an HTTP round trip through this endpoint. Gated separately from
   * activity.view (which clients/staff also have, for their own feed) -
   * this is a distinct, manager/admin-only grant since it lets the
   * caller write arbitrary log rows, not just read them.
   */
  @Post()
  @RequirePermissions('activity.create')
  create(@Body() dto: CreateActivityLogDto) {
    return this.activityService.log(dto);
  }
}
