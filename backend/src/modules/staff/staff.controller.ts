import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { StaffService } from './staff.service';
import {
  CreateStaffProfileDto,
  UpdateStaffProfileDto,
} from './dto/staff-profile.dto';
import { QueryStaffDto } from './dto/query-staff.dto';
import { RequirePermissions } from '@/common/decorators/permissions.decorator';

@Controller('staff')
export class StaffController {
  constructor(private readonly staffService: StaffService) {}

  @Post()
  @RequirePermissions('team.create')
  create(@Body() dto: CreateStaffProfileDto) {
    return this.staffService.create(dto);
  }

  @Get()
  @RequirePermissions('team.view')
  findAll(@Query() query: QueryStaffDto) {
    return this.staffService.findAll(query);
  }

  @Get(':userId')
  @RequirePermissions('team.view')
  findOne(@Param('userId', ParseUUIDPipe) userId: string) {
    return this.staffService.findOne(userId);
  }

  @Patch(':userId')
  @RequirePermissions('team.edit')
  update(
    @Param('userId', ParseUUIDPipe) userId: string,
    @Body() dto: UpdateStaffProfileDto,
  ) {
    return this.staffService.update(userId, dto);
  }

  @Delete(':userId')
  @RequirePermissions('team.delete')
  remove(@Param('userId', ParseUUIDPipe) userId: string) {
    return this.staffService.remove(userId);
  }
}
