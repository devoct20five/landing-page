import { Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { EmailProvider, OutgoingEmail } from './email-provider';

/** Works with any SMTP server, including Gmail (smtp.gmail.com + app password). */
export class SmtpEmailProvider implements EmailProvider {
  readonly name = 'smtp';
  private readonly transport: nodemailer.Transporter;

  constructor(
    opts: { host: string; port: number; secure: boolean; user?: string; pass?: string },
    private readonly from: string,
  ) {
    this.transport = nodemailer.createTransport({
      host: opts.host,
      port: opts.port,
      secure: opts.secure,
      auth: opts.user ? { user: opts.user, pass: opts.pass } : undefined,
      connectionTimeout: 10_000,
      socketTimeout: 15_000,
    });
  }

  async send(e: OutgoingEmail): Promise<void> {
    await this.transport.sendMail({ from: this.from, to: e.to, subject: e.subject, html: e.html, text: e.text });
  }
}

/** DEV / TEST ONLY: records and logs mail instead of sending it. */
export class ConsoleEmailProvider implements EmailProvider {
  readonly name = 'console';
  readonly sent: OutgoingEmail[] = [];
  private readonly log = new Logger('ConsoleEmail');

  async send(e: OutgoingEmail): Promise<void> {
    this.sent.push(e);
    this.log.log(`to=${e.to} subject="${e.subject}"\n${e.text}`);
  }
}
