import { Inject, Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/sequelize';
import { Op, Transaction, UniqueConstraintError } from 'sequelize';
import { AuthTokensService } from '../auth/auth-tokens.service';
import { User } from '../users/models/user.model';
import { EMAIL_PROVIDER } from './email-provider';
import type { EmailProvider } from './email-provider';
import { EmailOutbox } from './email-outbox.model';
import * as T from './templates';
import { orderAccessToken } from '../orders/order-token';

export type EmailTemplate = 'order_confirmation' | 'workspace_invitation' | 'order_added' | 'payment_failed' | 'password_reset';

const BACKOFF_MS = [60_000, 5 * 60_000, 30 * 60_000, 2 * 3600_000, 6 * 3600_000];
const MAX_ATTEMPTS = BACKOFF_MS.length + 1;
const INVITE_TTL_HOURS = 72;
const RESET_TTL_MIN = 60;

@Injectable()
export class MailService implements OnModuleInit, OnModuleDestroy {
  private readonly log = new Logger('MailService');
  private timer?: NodeJS.Timeout;
  private busy = false;

  constructor(
    @InjectModel(EmailOutbox) private readonly outbox: typeof EmailOutbox,
    @InjectModel(User) private readonly users: typeof User,
    @Inject(EMAIL_PROVIDER) private readonly provider: EmailProvider,
    private readonly authTokens: AuthTokensService,
    private readonly config: ConfigService,
  ) {}

  /** The public website (hosts set-password + retry-payment pages). */
  private get websiteUrl() {
    const v = this.config.get<string>('WEBSITE_URL') ?? this.config.get<string>('FRONTEND_URL') ?? 'http://localhost:3000';
    return v.split(',')[0].trim().replace(/\/$/, '');
  }
  /** Where a signed-in client lands: the workspace app if configured, else the site's account page. */
  private get workspaceUrl() {
    const v = this.config.get<string>('WORKSPACE_URL');
    return v ? v.trim().replace(/\/$/, '') : `${this.websiteUrl}/agency/account`;
  }
  private get support() {
    return this.config.get<string>('SUPPORT_EMAIL') ?? 'hello@oct20five.com';
  }

  onModuleInit() {
    if (this.config.get('MAIL_WORKER') === 'off') return;
    this.timer = setInterval(() => void this.processDue(), 30_000);
    this.timer.unref();
    void this.processDue(); // pick up anything left pending by a restart
  }
  onModuleDestroy() {
    if (this.timer) clearInterval(this.timer);
  }

  /**
   * Queue an email. `dedupeKey` makes this idempotent: enqueueing the same key
   * twice (e.g. a replayed webhook) is a silent no-op. Pass the business
   * transaction so the email exists iff the business change committed.
   */
  async enqueue(
    i: { dedupeKey: string; template: EmailTemplate; to: string; data: Record<string, any> },
    transaction?: Transaction,
  ): Promise<void> {
    try {
      await this.outbox.create({ dedupeKey: i.dedupeKey, template: i.template, toEmail: i.to, data: i.data } as any, { transaction });
    } catch (e) {
      if (e instanceof UniqueConstraintError) return;
      throw e;
    }
  }

  /** Call after the surrounding transaction commits to send promptly. */
  kick() {
    setImmediate(() => void this.processDue());
  }

  async processDue(): Promise<number> {
    if (this.busy) return 0;
    this.busy = true;
    let sent = 0;
    try {
      const due = await this.outbox.findAll({
        where: { status: 'pending', nextAttemptAt: { [Op.lte]: new Date() } },
        order: [['nextAttemptAt', 'ASC']],
        limit: 25,
      });
      for (const row of due) {
        // Claim: push next_attempt_at forward so another worker/instance skips it.
        const [claimed] = await this.outbox.update(
          { nextAttemptAt: new Date(Date.now() + 5 * 60_000), attempts: row.attempts + 1 },
          { where: { id: row.id, status: 'pending', attempts: row.attempts } },
        );
        if (claimed !== 1) continue;
        try {
          const email = await this.render(row);
          await this.provider.send({ to: row.toEmail, ...email });
          await row.update({ status: 'sent', sentAt: new Date(), lastError: null });
          sent++;
        } catch (e: any) {
          const attempts = row.attempts + 1;
          const msg = String(e?.message ?? e).slice(0, 500);
          this.log.error(`Email ${row.template} to ${row.toEmail} failed (attempt ${attempts}): ${msg}`);
          if (attempts >= MAX_ATTEMPTS) await row.update({ status: 'failed', lastError: msg });
          else await row.update({ lastError: msg, nextAttemptAt: new Date(Date.now() + BACKOFF_MS[attempts - 1]) });
        }
      }
    } finally {
      this.busy = false;
    }
    return sent;
  }

  /** Rendered at send time so password links are minted fresh and never stored. */
  private async render(row: EmailOutbox): Promise<T.RenderedEmail> {
    const d = row.data;
    switch (row.template as EmailTemplate) {
      case 'order_confirmation':
        return T.orderConfirmation(d as T.OrderEmailData, this.support);
      case 'payment_failed': {
        const secret = this.config.get<string>('ORDER_TOKEN_SECRET') || this.config.getOrThrow<string>('JWT_SECRET');
        const retryUrl = `${this.websiteUrl}/agency/checkout/retry?order=${encodeURIComponent(d.orderNumber)}&token=${orderAccessToken(secret, d.orderNumber)}`;
        return T.paymentFailed({ ...(d as T.OrderEmailData), retryUrl }, this.support);
      }
      case 'order_added':
        return T.orderAddedToWorkspace({ ...(d as T.OrderEmailData), loginUrl: this.workspaceUrl }, this.support);
      case 'workspace_invitation': {
        const user = await this.users.findByPk(d.userId);
        if (!user) throw new Error('Invitation user no longer exists');
        const raw = await this.authTokens.issue(user.id, 'password_setup', INVITE_TTL_HOURS * 3600_000);
        return T.workspaceInvitation(
          { ...(d as any), setPasswordUrl: `${this.websiteUrl}/agency/set-password?token=${encodeURIComponent(raw)}`, expiresHours: INVITE_TTL_HOURS },
          this.support,
        );
      }
      case 'password_reset': {
        const user = await this.users.findByPk(d.userId);
        if (!user) throw new Error('Reset user no longer exists');
        const raw = await this.authTokens.issue(user.id, 'password_reset', RESET_TTL_MIN * 60_000);
        return T.passwordReset(
          { name: d.name, resetUrl: `${this.websiteUrl}/agency/set-password?token=${encodeURIComponent(raw)}`, expiresMinutes: RESET_TTL_MIN },
          this.support,
        );
      }
      default:
        throw new Error(`Unknown email template ${row.template}`);
    }
  }
}
