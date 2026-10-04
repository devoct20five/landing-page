import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { AssignQueryDto } from './dto/assign-query.dto';
import { CreateQueryDto } from './dto/create-query.dto';
import { QueryFilterDto } from './dto/query-filter.dto';
import { UpdateQueryDto } from './dto/update-query.dto';
import { QueriesService } from './queries.service';
import { CurrentUser } from '@/common/decorators/current-user.decorator';
import { RequirePermissions } from '@/common/decorators/permissions.decorator';
import type { RequestUser } from '../auth/types/authenticated-user.type';

@Controller('queries')
export class QueriesController {
  constructor(private readonly queriesService: QueriesService) {}

  // Client raises a ticket
  @Post()
  @RequirePermissions('queries.create')
  create(@Body() dto: CreateQueryDto, @CurrentUser() user: RequestUser) {
    return this.queriesService.create(dto, user);
  }

  // Admin: Queries inbox (3.10), filter by client/project/status/priority
  @Get()
  @RequirePermissions('queries.view')
  findAll(@Query() filter: QueryFilterDto, @CurrentUser() user: RequestUser) {
    return this.queriesService.findAll(filter, user);
  }

  @Get('stats/avg-response-time')
  @RequirePermissions('queries.view')
  avgResponseTime() {
    return this.queriesService
      .averageResponseTimeHours()
      .then((hours) => ({ averageResponseTimeHours: hours }));
  }

  @Get(':id')
  @RequirePermissions('queries.view')
  findOne(@Param('id', ParseUUIDPipe) id: string, @CurrentUser() user: RequestUser) {
    return this.queriesService.findOne(id, user);
  }

  @Patch(':id')
  @RequirePermissions('queries.edit')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateQueryDto,
    @CurrentUser() user: RequestUser,
  ) {
    return this.queriesService.update(id, dto, user);
  }

  @Patch(':id/assign')
  @RequirePermissions('queries.assign')
  assign(@Param('id', ParseUUIDPipe) id: string, @Body() dto: AssignQueryDto) {
    return this.queriesService.assign(id, dto);
  }

  @Delete(':id')
  @HttpCode(204)
  @RequirePermissions('queries.edit')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.queriesService.remove(id);
  }
}
