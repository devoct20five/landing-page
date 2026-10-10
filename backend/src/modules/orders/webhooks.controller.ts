import { Controller, ForbiddenException, HttpCode, Inject, NotFoundException, Param, Post, Req } from '@nestjs/common';
import { SkipThrottle } from '@nestjs/throttler';
import type { Request } from 'express';
import { Public } from '@/common/decorators/public.decorator';
import { PAYMENT_PROVIDER } from '../payments/payment-provider';
import type { PaymentProvider } from '../payments/payment-provider';
import { MockPaymentProvider } from '../payments/mock.provider';
import { OrdersService } from './orders.service';

/** Gateway -> us. Authenticated by signature over the RAW body, not by JWT. */
@Public()
@SkipThrottle()
@Controller('webhooks/payments')
export class WebhooksController {
  constructor(private readonly orders: OrdersService) {}

  @Post(':provider')
  @HttpCode(200)
  handle(@Param('provider') provider: string, @Req() req: Request & { rawBody?: Buffer }) {
    return this.orders.handleWebhook(provider, req.rawBody, req.headers);
  }
}

/**
 * Dev/test-only: stands in for the gateway's hosted payment page so the whole
 * flow can be exercised without gateway credentials. 404s unless the mock
 * provider is active (which itself cannot boot in production).
 */
@Public()
@Controller('dev/mock-payments')
export class MockPaymentsController {
  constructor(@Inject(PAYMENT_PROVIDER) private readonly provider: PaymentProvider) {}

  @Post(':providerOrderId/:outcome')
  @HttpCode(200)
  simulate(@Param('providerOrderId') id: string, @Param('outcome') outcome: string) {
    if (!(this.provider instanceof MockPaymentProvider) || process.env.NODE_ENV === 'production') throw new NotFoundException();
    if (outcome !== 'captured' && outcome !== 'failed') throw new ForbiddenException();
    try {
      const { payment, signature } = this.provider.simulate(id, outcome);
      return { providerPaymentId: payment.providerPaymentId, signature, status: payment.status };
    } catch {
      throw new NotFoundException('Unknown mock payment order');
    }
  }
}
