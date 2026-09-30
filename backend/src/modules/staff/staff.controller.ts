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

// NOTE: gate write routes behind an admin/manager guard once auth is wired in.
@Controller('staff')
export class StaffController {
  constructor(private readonly staffService: StaffService) {}

  @Post()
  create(@Body() dto: CreateStaffProfileDto) {
    return this.staffService.create(dto);
  }

  @Get()
  findAll(@Query() query: QueryStaffDto) {
    return this.staffService.findAll(query);
  }

  @Get(':userId')
  findOne(@Param('userId', ParseUUIDPipe) userId: string) {
    return this.staffService.findOne(userId);
  }

  @Patch(':userId')
  update(
    @Param('userId', ParseUUIDPipe) userId: string,
    @Body() dto: UpdateStaffProfileDto,
  ) {
    return this.staffService.update(userId, dto);
  }

  @Delete(':userId')
  remove(@Param('userId', ParseUUIDPipe) userId: string) {
    return this.staffService.remove(userId);
  }
}
