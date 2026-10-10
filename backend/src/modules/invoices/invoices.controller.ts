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
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { QueryInvoiceDto } from './dto/query-invoice.dto';
import { UpdateInvoiceDto } from './dto/update-invoice.dto';
import { InvoicesService } from './invoices.service';
import { CurrentUser } from '@/common/decorators/current-user.decorator';
import { RequirePermissions } from '@/common/decorators/permissions.decorator';
import type { RequestUser } from '../auth/types/authenticated-user.type';

@Controller('invoices')
export class InvoicesController {
  constructor(private readonly invoicesService: InvoicesService) {}

  // ---- Admin: Payments module (3.9) ----------------------------------
  @Post()
  @RequirePermissions('invoices.create')
  create(@Body() dto: CreateInvoiceDto) {
    return this.invoicesService.create(dto);
  }

  @Get()
  @RequirePermissions('invoices.view')
  findAll(@Query() query: QueryInvoiceDto, @CurrentUser() user: RequestUser) {
    return this.invoicesService.findAll(query, user);
  }

  @Get('stats')
  @RequirePermissions('invoices.view')
  revenueStats(@Query('client_id') clientId?: string) {
    // clientId is a UUID string, Number(...) would always produce NaN.
    return this.invoicesService.revenueStats(clientId);
  }

  @Get('project/:projectId')
  @RequirePermissions('invoices.view')
  findByProject(
    @Param('projectId', ParseUUIDPipe) projectId: string,
    @CurrentUser() user: RequestUser,
  ) {
    return this.invoicesService.findByProject(projectId, user);
  }

  @Get(':id')
  @RequirePermissions('invoices.view')
  findOne(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: RequestUser,
  ) {
    return this.invoicesService.findOne(id, user);
  }

  @Patch(':id')
  @RequirePermissions('invoices.edit')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateInvoiceDto,
  ) {
    return this.invoicesService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(204)
  @RequirePermissions('invoices.delete')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.invoicesService.remove(id);
  }

  // ---- Client: Project Payment module (1.3) ---------------------------
  @Post(':id/payments')
  @RequirePermissions('payments.create')
  recordPayment(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: CreatePaymentDto,
    @CurrentUser() user: RequestUser,
  ) {
    return this.invoicesService.recordPayment(id, dto, user);
  }

  @Get(':id/payments')
  @RequirePermissions('payments.view')
  listPayments(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: RequestUser,
  ) {
    return this.invoicesService.listTransactions(id, user);
  }
}
