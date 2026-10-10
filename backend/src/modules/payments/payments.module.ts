import { Logger, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PAYMENT_PROVIDER } from './payment-provider';
import type { PaymentProvider } from './payment-provider';
import { RazorpayProvider } from './razorpay.provider';
import { MockPaymentProvider } from './mock.provider';

/** Chooses the gateway from PAYMENT_PROVIDER (razorpay | mock); fails fast on misconfiguration. */
@Module({
  providers: [
    {
      provide: PAYMENT_PROVIDER,
      inject: [ConfigService],
      useFactory: (config: ConfigService): PaymentProvider => {
        const which = (
          config.get<string>('PAYMENT_PROVIDER') ?? 'razorpay'
        ).toLowerCase();
        const prod = config.get<string>('NODE_ENV') === 'production';

        if (which === 'mock') {
          if (prod)
            throw new Error(
              'PAYMENT_PROVIDER=mock is not allowed when NODE_ENV=production',
            );
          Logger.warn(
            'Using MOCK payment provider - development only',
            'PaymentsModule',
          );
          return new MockPaymentProvider(
            config.get<string>('PAYMENT_MOCK_SECRET') ?? 'dev-only-mock-secret',
          );
        }
        if (which === 'razorpay') {
          const id = config.get<string>('RAZORPAY_KEY_ID');
          const secret = config.get<string>('RAZORPAY_KEY_SECRET');
          const hook = config.get<string>('RAZORPAY_WEBHOOK_SECRET');
          if (!id || !secret || !hook) {
            throw new Error(
              'RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET and RAZORPAY_WEBHOOK_SECRET must all be set (or use PAYMENT_PROVIDER=mock in development)',
            );
          }
          return new RazorpayProvider(
            id,
            secret,
            hook,
            config.get<string>('MERCHANT_NAME') ?? 'OCT20FIVE',
          );
        }
        throw new Error(`Unknown PAYMENT_PROVIDER "${which}"`);
      },
    },
  ],
  exports: [PAYMENT_PROVIDER],
})
export class PaymentsModule {}
