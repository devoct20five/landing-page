import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { AssignQueryDto } from './dto/assign-query.dto';
import { CreateQueryDto } from './dto/create-query.dto';
import { QueryFilterDto } from './dto/query-filter.dto';
import { UpdateQueryDto } from './dto/update-query.dto';
import { QueriesService } from './queries.service';

@Controller('queries')
export class QueriesController {
  constructor(private readonly queriesService: QueriesService) {}

  // Client raises a ticket
  @Post()
  create(@Body() dto: CreateQueryDto) {
    return this.queriesService.create(dto);
  }

  // Admin: Queries inbox (3.10), filter by client/project/status/priority
  @Get()
  findAll(@Query() filter: QueryFilterDto) {
    return this.queriesService.findAll(filter);
  }

  @Get('stats/avg-response-time')
  avgResponseTime() {
    return this.queriesService
      .averageResponseTimeHours()
      .then((hours) => ({ averageResponseTimeHours: hours }));
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.queriesService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateQueryDto) {
    return this.queriesService.update(id, dto);
  }

  @Patch(':id/assign')
  assign(@Param('id', ParseIntPipe) id: number, @Body() dto: AssignQueryDto) {
    return this.queriesService.assign(id, dto);
  }

  @Delete(':id')
  @HttpCode(204)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.queriesService.remove(id);
  }
}
