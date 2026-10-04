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
import { CreateJobDto } from './dto/create-job.dto';
import { JobFilterDto } from './dto/job-filter.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { JobsService } from './jobs.service';
import { RequirePermissions } from '@/common/decorators/permissions.decorator';

// Internal recruitment surface (spec §26) — no client access at all;
// careers.* permissions are admin/manager/staff(view-only) only.
@Controller('careers/jobs')
export class JobsController {
  constructor(private readonly jobsService: JobsService) {}

  @Post()
  @RequirePermissions('careers.create')
  create(@Body() dto: CreateJobDto) {
    return this.jobsService.create(dto);
  }

  @Get()
  @RequirePermissions('careers.view')
  findAll(@Query() filter: JobFilterDto) {
    return this.jobsService.findAll(filter);
  }

  @Get(':id')
  @RequirePermissions('careers.view')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.jobsService.findOne(id);
  }

  @Patch(':id')
  @RequirePermissions('careers.edit')
  update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateJobDto) {
    return this.jobsService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(204)
  @RequirePermissions('careers.delete')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.jobsService.remove(id);
  }
}
