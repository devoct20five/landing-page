import { Logger, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { AuthTokensModule } from '../auth/auth-tokens.module';
import { User } from '../users/models/user.model';
import { EMAIL_PROVIDER } from './email-provider';
import type { EmailProvider } from './email-provider';
import { EmailOutbox } from './email-outbox.model';
import { MailService } from './mail.service';
import { ConsoleEmailProvider, SmtpEmailProvider } from './providers';

@Module({
  imports: [SequelizeModule.forFeature([EmailOutbox, User]), AuthTokensModule],
  providers: [
    {
      provide: EMAIL_PROVIDER,
      inject: [ConfigService],
      useFactory: (config: ConfigService): EmailProvider => {
        const which = (config.get<string>('EMAIL_PROVIDER') ?? 'smtp').toLowerCase();
        const prod = config.get<string>('NODE_ENV') === 'production';
        if (which === 'console') {
          if (prod) throw new Error('EMAIL_PROVIDER=console is not allowed when NODE_ENV=production');
          Logger.warn('Using CONSOLE email provider - nothing is actually sent', 'MailModule');
          return new ConsoleEmailProvider();
        }
        if (which === 'smtp') {
          const host = config.get<string>('SMTP_HOST');
          const from = config.get<string>('MAIL_FROM');
          if (!host || !from) throw new Error('SMTP_HOST and MAIL_FROM must be set (or EMAIL_PROVIDER=console in development)');
          const port = Number(config.get('SMTP_PORT') ?? 587);
          return new SmtpEmailProvider(
            {
              host,
              port,
              secure: String(config.get('SMTP_SECURE') ?? port === 465) === 'true',
              user: config.get<string>('SMTP_USER'),
              pass: config.get<string>('SMTP_PASS'),
            },
            from,
          );
        }
        throw new Error(`Unknown EMAIL_PROVIDER "${which}"`);
      },
    },
    MailService,
  ],
  exports: [MailService, EMAIL_PROVIDER],
})
export class MailModule {}
