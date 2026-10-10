/** Transactional email templates. Pure functions; everything interpolated is HTML-escaped. */
export interface RenderedEmail {
  subject: string;
  html: string;
  text: string;
}

export interface OrderEmailData {
  name: string;
  orderNumber: string;
  serviceName: string;
  planName: string;
  packLabel?: string | null;
  total: number;
  currency: string;
  paidAt?: string | null;
  retryUrl?: string;
}

const esc = (s: unknown) =>
  String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);

export const money = (n: number, currency = 'INR') =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency, maximumFractionDigits: 2 }).format(n);

const fmtDate = (iso?: string | null) =>
  new Date(iso ?? Date.now()).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });

function layout(o: { preheader: string; heading: string; bodyHtml: string; cta?: { label: string; url: string }; support: string }) {
  const cta = o.cta
    ? `<p style="margin:28px 0"><a href="${esc(o.cta.url)}" style="background:#FF5A1F;color:#fff;text-decoration:none;padding:14px 26px;border-radius:999px;font-weight:600;display:inline-block">${esc(o.cta.label)}</a></p>
<p style="font-size:12px;color:#777;word-break:break-all">If the button doesn't work, paste this link into your browser:<br>${esc(o.cta.url)}</p>`
    : '';
  return `<!doctype html><html><body style="margin:0;background:#f4f1ec;font-family:Helvetica,Arial,sans-serif;color:#111">
<span style="display:none;opacity:0">${esc(o.preheader)}</span>
<table width="100%" cellpadding="0" cellspacing="0"><tr><td align="center" style="padding:32px 12px">
<table width="560" cellpadding="0" cellspacing="0" style="max-width:560px;background:#fff;border-radius:16px;padding:36px"><tr><td>
<div style="font-weight:800;letter-spacing:.14em;font-size:13px;color:#FF5A1F">OCT20FIVE</div>
<h1 style="font-size:24px;margin:18px 0 12px">${esc(o.heading)}</h1>
${o.bodyHtml}${cta}
<hr style="border:none;border-top:1px solid #eee;margin:28px 0">
<p style="font-size:12px;color:#777;margin:0">Questions? Reply to this email or write to <a href="mailto:${esc(o.support)}" style="color:#777">${esc(o.support)}</a>.</p>
</td></tr></table></td></tr></table></body></html>`;
}

function orderTable(d: OrderEmailData) {
  const rows: Array<[string, string]> = [
    ['Order', d.orderNumber],
    ['Package', `${d.serviceName} · ${d.planName}${d.packLabel ? ` · ${d.packLabel}` : ''}`],
    ['Amount', money(d.total, d.currency)],
  ];
  return `<table width="100%" cellpadding="8" cellspacing="0" style="border:1px solid #eee;border-radius:8px;font-size:14px">${rows
    .map(([k, v]) => `<tr><td style="color:#777;width:110px">${esc(k)}</td><td><b>${esc(v)}</b></td></tr>`)
    .join('')}</table>`;
}
const orderText = (d: OrderEmailData) =>
  `Order: ${d.orderNumber}\nPackage: ${d.serviceName} - ${d.planName}${d.packLabel ? ` - ${d.packLabel}` : ''}\nAmount: ${money(d.total, d.currency)}`;

export function orderConfirmation(d: OrderEmailData, support: string): RenderedEmail {
  return {
    subject: `Order confirmed — ${d.orderNumber}`,
    text: `Hi ${d.name},\n\nThanks for your purchase on ${fmtDate(d.paidAt)}. Your payment was received.\n\n${orderText(d)}\n\nWhat happens next: we're setting up your project and you'll hear from your OCT20FIVE team shortly. Your workspace invitation arrives in a separate email.\n\nQuestions? ${support}\n`,
    html: layout({
      preheader: `Order ${d.orderNumber} confirmed`,
      heading: 'Purchase successful',
      support,
      bodyHtml: `<p>Hi ${esc(d.name)}, thanks for your purchase on ${esc(fmtDate(d.paidAt))}. Your payment was received.</p>
${orderTable(d)}
<p style="margin-top:20px"><b>What happens next</b><br>We're setting up your project now and your OCT20FIVE team will be in touch shortly. Your workspace invitation arrives in a separate email.</p>`,
    }),
  };
}

export function workspaceInvitation(
  d: { name: string; orderNumber: string; serviceName: string; planName: string; setPasswordUrl: string; expiresHours: number },
  support: string,
): RenderedEmail {
  return {
    subject: 'Welcome to OCT20FIVE — your workspace is ready',
    text: `Hi ${d.name},\n\nWelcome to OCT20FIVE. Your workspace is ready, with your ${d.serviceName} · ${d.planName} project (order ${d.orderNumber}) waiting inside.\n\nSet your password to get in:\n${d.setPasswordUrl}\n\nThis link works once and expires in ${d.expiresHours} hours. If it expires, use "Forgot password" on the login page.\n\nQuestions? ${support}\n`,
    html: layout({
      preheader: 'Your OCT20FIVE workspace is ready — set your password',
      heading: 'Your workspace is ready',
      support,
      bodyHtml: `<p>Hi ${esc(d.name)}, welcome to OCT20FIVE. Your <b>${esc(d.serviceName)} · ${esc(d.planName)}</b> project (order ${esc(d.orderNumber)}) is waiting inside.</p>
<p>Set your password to enter your workspace. The link works once and expires in ${d.expiresHours} hours.</p>`,
      cta: { label: 'Set your password', url: d.setPasswordUrl },
    }),
  };
}

export function orderAddedToWorkspace(d: OrderEmailData & { loginUrl: string }, support: string): RenderedEmail {
  return {
    subject: `New project added to your workspace — ${d.orderNumber}`,
    text: `Hi ${d.name},\n\nYour new purchase has been added to your existing OCT20FIVE workspace.\n\n${orderText(d)}\n\nLog in: ${d.loginUrl}\n\nQuestions? ${support}\n`,
    html: layout({
      preheader: `Order ${d.orderNumber} added to your workspace`,
      heading: 'Added to your workspace',
      support,
      bodyHtml: `<p>Hi ${esc(d.name)}, your new purchase has been added to your existing OCT20FIVE workspace.</p>${orderTable(d)}`,
      cta: { label: 'Open your workspace', url: d.loginUrl },
    }),
  };
}

export function paymentFailed(d: OrderEmailData, support: string): RenderedEmail {
  return {
    subject: `Payment unsuccessful — ${d.orderNumber}`,
    text: `Hi ${d.name},\n\nWe couldn't complete your payment, and you have not been charged for this order.\n\n${orderText(d)}\n\n${d.retryUrl ? `Try again: ${d.retryUrl}\n\n` : ''}Questions? ${support}\n`,
    html: layout({
      preheader: `Payment for ${d.orderNumber} was unsuccessful`,
      heading: 'Payment unsuccessful',
      support,
      bodyHtml: `<p>Hi ${esc(d.name)}, we couldn't complete your payment for the order below. If money left your account, it is automatically returned by your bank.</p>${orderTable(d)}`,
      cta: d.retryUrl ? { label: 'Retry payment', url: d.retryUrl } : undefined,
    }),
  };
}

export function passwordReset(d: { name: string; resetUrl: string; expiresMinutes: number }, support: string): RenderedEmail {
  return {
    subject: 'Reset your OCT20FIVE password',
    text: `Hi ${d.name},\n\nUse this link to choose a new password:\n${d.resetUrl}\n\nIt works once and expires in ${d.expiresMinutes} minutes. If you didn't ask for this, you can ignore this email.\n\n${support}\n`,
    html: layout({
      preheader: 'Reset your OCT20FIVE password',
      heading: 'Reset your password',
      support,
      bodyHtml: `<p>Hi ${esc(d.name)}, use the button below to choose a new password. It works once and expires in ${d.expiresMinutes} minutes. If you didn't ask for this, you can safely ignore this email.</p>`,
      cta: { label: 'Choose a new password', url: d.resetUrl },
    }),
  };
}
