import { Controller, Get, Query } from '@nestjs/common';
import { CurrentUser } from '@/common/decorators/current-user.decorator';
import { RequirePermissions } from '@/common/decorators/permissions.decorator';
import type { RequestUser } from '../auth/types/authenticated-user.type';
import { OrdersService } from './orders.service';

/** Authenticated order access: a client sees only their own; staff need a permission. */
@Controller('orders')
export class OrdersController {
  constructor(private readonly orders: OrdersService) {}

  /** The signed-in client's purchases, with their project and invoice. */
  @Get('mine')
  mine(@CurrentUser() user: RequestUser) {
    this.orders.assertClient(user);
    return this.orders.mine(user.clientId);
  }

  @Get()
  @RequirePermissions('orders.view')
  list(@Query('page') page?: string, @Query('limit') limit?: string, @Query('status') status?: string) {
    return this.orders.adminList(Math.max(1, Number(page) || 1), Math.min(100, Math.max(1, Number(limit) || 25)), status);
  }
}
