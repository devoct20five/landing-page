import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { PayrollService } from './payroll.service';
import {
  CreatePayrollEntryDto,
  QueryPayrollDto,
  UpdatePayrollEntryDto,
} from './dto/payroll.dto';

// NOTE: admin/manager-only in production — gate once auth is wired in.
@Controller('payroll')
export class PayrollController {
  constructor(private readonly payrollService: PayrollService) {}

  @Post()
  create(@Body() dto: CreatePayrollEntryDto) {
    return this.payrollService.create(dto);
  }

  @Get()
  findAll(@Query() query: QueryPayrollDto) {
    return this.payrollService.findAll(query);
  }

  @Get('staff/:staffId')
  payoutHistory(@Param('staffId', ParseUUIDPipe) staffId: string) {
    return this.payrollService.payoutHistoryForStaff(staffId);
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.payrollService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdatePayrollEntryDto,
  ) {
    return this.payrollService.update(id, dto);
  }

  @Post(':id/process')
  processPayout(@Param('id', ParseUUIDPipe) id: string) {
    return this.payrollService.processPayout(id);
  }

  @Post('process-period')
  processPeriod(
    @Query('month', ParseIntPipe) month: number,
    @Query('year', ParseIntPipe) year: number,
  ) {
    return this.payrollService.processPayoutsForPeriod(month, year);
  }
}
