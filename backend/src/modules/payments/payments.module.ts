import { Logger, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { PAYMENT_PROVIDER } from './payment-provider';
import type { PaymentProvider } from './payment-provider';

import { CashfreeProvider } from './cashfree.provider';
import type { CashfreeEnvironment } from './cashfree.provider';

import { MockPaymentProvider } from './mock.provider';

/**
 * Chooses the payment gateway from PAYMENT_PROVIDER.
 *
 * Supported providers:
 * - cashfree
 * - mock (development only)
 *
 * Fails fast when the configuration is invalid.
 */
@Module({
  providers: [
    {
      provide: PAYMENT_PROVIDER,
      inject: [ConfigService],
      useFactory: (config: ConfigService): PaymentProvider => {
        const which = (config.get<string>('PAYMENT_PROVIDER') ?? 'cashfree')
          .trim()
          .toLowerCase();

        const nodeEnv = (config.get<string>('NODE_ENV') ?? 'development')
          .trim()
          .toLowerCase();

        const isProduction = nodeEnv === 'production';

        // --------------------------------------------------
        // MOCK PROVIDER — DEVELOPMENT ONLY
        // --------------------------------------------------
        if (which === 'mock') {
          if (isProduction) {
            throw new Error(
              'PAYMENT_PROVIDER=mock is not allowed when NODE_ENV=production',
            );
          }

          const mockSecret = config.get<string>('PAYMENT_MOCK_SECRET');

          if (!mockSecret && nodeEnv !== 'test') {
            Logger.warn(
              'PAYMENT_MOCK_SECRET is not configured; using a development-only secret',
              'PaymentsModule',
            );
          }

          Logger.warn(
            'Using MOCK payment provider - development/testing only',
            'PaymentsModule',
          );

          return new MockPaymentProvider(mockSecret ?? 'dev-only-mock-secret');
        }

        // --------------------------------------------------
        // CASHFREE PROVIDER
        // --------------------------------------------------
        if (which === 'cashfree') {
          const appId = config.get<string>('CASHFREE_APP_ID')?.trim();
          const secretKey = config.get<string>('CASHFREE_SECRET_KEY')?.trim();

          const environmentValue = (
            config.get<string>('CASHFREE_ENV') ?? 'sandbox'
          )
            .trim()
            .toLowerCase();

          if (!appId || !secretKey) {
            throw new Error(
              'CASHFREE_APP_ID and CASHFREE_SECRET_KEY must be configured when PAYMENT_PROVIDER=cashfree',
            );
          }

          if (
            environmentValue !== 'sandbox' &&
            environmentValue !== 'production'
          ) {
            throw new Error(
              'CASHFREE_ENV must be either sandbox or production',
            );
          }

          if (isProduction && environmentValue !== 'production') {
            throw new Error(
              'CASHFREE_ENV=sandbox is not allowed when NODE_ENV=production',
            );
          }

          const environment: CashfreeEnvironment = environmentValue;

          const webhookSecret =
            config.get<string>('CASHFREE_WEBHOOK_SECRET') ?? '';

          const merchantName =
            config.get<string>('MERCHANT_NAME') ?? 'OCT20FIVE';

          return new CashfreeProvider(
            appId,
            secretKey,
            environment,
            webhookSecret,
            merchantName,
          );
        }

        // --------------------------------------------------
        // UNKNOWN PROVIDER
        // --------------------------------------------------
        throw new Error(
          `Unknown PAYMENT_PROVIDER "${which}". Supported values: cashfree, mock.`,
        );
      },
    },
  ],
  exports: [PAYMENT_PROVIDER],
})
export class PaymentsModule {}
