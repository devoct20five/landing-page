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
import { RequirePermissions } from '@/common/decorators/permissions.decorator';

// docs/00_CURRENT_STATE_AUDIT.md §32 / spec §32: "Do not expose payroll to
// normal clients or unauthorized staff." Previously had zero protection —
// any authenticated user, including a client, could read every staff
// member's salary via GET /payroll. Unlike attendance, there is no
// self-service case here by design (staff don't have a "view my own
// payslip" permission in the catalog or an implemented capability) —
// payroll.view/payroll.manage are manager/admin-only grants.
@Controller('payroll')
export class PayrollController {
  constructor(private readonly payrollService: PayrollService) {}

  @Post()
  @RequirePermissions('payroll.manage')
  create(@Body() dto: CreatePayrollEntryDto) {
    return this.payrollService.create(dto);
  }

  @Get()
  @RequirePermissions('payroll.view')
  findAll(@Query() query: QueryPayrollDto) {
    return this.payrollService.findAll(query);
  }

  @Get('staff/:staffId')
  @RequirePermissions('payroll.view')
  payoutHistory(@Param('staffId', ParseUUIDPipe) staffId: string) {
    return this.payrollService.payoutHistoryForStaff(staffId);
  }

  @Get(':id')
  @RequirePermissions('payroll.view')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.payrollService.findOne(id);
  }

  @Patch(':id')
  @RequirePermissions('payroll.manage')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdatePayrollEntryDto,
  ) {
    return this.payrollService.update(id, dto);
  }

  @Post(':id/process')
  @RequirePermissions('payroll.manage')
  processPayout(@Param('id', ParseUUIDPipe) id: string) {
    return this.payrollService.processPayout(id);
  }

  @Post('process-period')
  @RequirePermissions('payroll.manage')
  processPeriod(
    @Query('month', ParseIntPipe) month: number,
    @Query('year', ParseIntPipe) year: number,
  ) {
    return this.payrollService.processPayoutsForPeriod(month, year);
  }
}
