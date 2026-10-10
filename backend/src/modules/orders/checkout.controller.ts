import { Body, Controller, Get, Headers, HttpCode, Param, Post, Query } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { Public } from '@/common/decorators/public.decorator';
import { CreateOrderDto, QuoteDto, VerifyPaymentDto } from './dto/checkout.dto';
import { OrdersService } from './orders.service';

/**
 * Anonymous purchase API. Public by design (visitors have no account yet);
 * protected by strict throttling, server-side pricing and a per-order
 * capability token for everything after creation.
 */
@Public()
@Controller('checkout')
export class CheckoutController {
  constructor(private readonly orders: OrdersService) {}

  @Post('quote')
  @HttpCode(200)
  @Throttle({ default: { limit: 40, ttl: 60_000 } })
  quote(@Body() dto: QuoteDto) {
    return this.orders.quote(dto);
  }

  @Post('orders')
  @Throttle({ default: { limit: 10, ttl: 60_000 } })
  create(@Body() dto: CreateOrderDto, @Headers('idempotency-key') key?: string) {
    return this.orders.createOrder(dto, key);
  }

  @Get('orders/:orderNumber')
  @Throttle({ default: { limit: 60, ttl: 60_000 } })
  get(@Param('orderNumber') n: string, @Query('token') token?: string) {
    return this.orders.getPublic(n, token);
  }

  /** Re-open payment for a failed/abandoned order. */
  @Post('orders/:orderNumber/pay')
  @HttpCode(200)
  @Throttle({ default: { limit: 10, ttl: 60_000 } })
  pay(@Param('orderNumber') n: string, @Query('token') token?: string) {
    return this.orders.retryPayment(n, token);
  }

  /** Browser says "I paid" -> verified server-side before anything changes. */
  @Post('orders/:orderNumber/verify')
  @HttpCode(200)
  @Throttle({ default: { limit: 20, ttl: 60_000 } })
  verify(@Param('orderNumber') n: string, @Query('token') token: string | undefined, @Body() dto: VerifyPaymentDto) {
    return this.orders.verifyFromBrowser(n, token, dto);
  }

  @Post('orders/:orderNumber/cancel')
  @HttpCode(200)
  @Throttle({ default: { limit: 10, ttl: 60_000 } })
  cancel(@Param('orderNumber') n: string, @Query('token') token?: string) {
    return this.orders.cancel(n, token);
  }
}
