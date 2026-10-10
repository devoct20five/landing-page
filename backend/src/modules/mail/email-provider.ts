/** Transport-agnostic mail contract. SMTP/Gmail today; SES/Resend etc. later. */
export const EMAIL_PROVIDER = Symbol('EMAIL_PROVIDER');

export interface OutgoingEmail {
  to: string;
  subject: string;
  html: string;
  text: string;
}

export interface EmailProvider {
  readonly name: string;
  send(email: OutgoingEmail): Promise<void>;
}
