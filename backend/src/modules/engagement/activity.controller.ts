import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ActivityService } from './activity.service';
import { CreateActivityLogDto } from './dto/create-activity-log.dto';
import { QueryActivityLogDto } from './dto/query-activity-log.dto';

@Controller('activity')
export class ActivityController {
  constructor(private readonly activityService: ActivityService) {}

  @Get()
  findAll(@Query() query: QueryActivityLogDto) {
    return this.activityService.findAll(query);
  }

  /** Dashboard "recent activity" widgets — grouped by calendar day. */
  @Get('feed')
  findFeed(@Query() query: QueryActivityLogDto) {
    return this.activityService.findGroupedByDay(query);
  }

  /**
   * Manual/system write path. Other modules (tasks, approvals, files, payments...)
   * should prefer injecting ActivityService and calling log() directly rather than
   * making an HTTP round trip through this endpoint.
   */
  @Post()
  create(@Body() dto: CreateActivityLogDto) {
    return this.activityService.log(dto);
  }
}
