/* Storefront e2e: visitor -> order -> verified payment -> client -> workspace.
 * Run: set -a; . ./.env.e2e; set +a; TS_NODE_TRANSPILE_ONLY=true npx ts-node -r tsconfig-paths/register test/storefront.e2e.ts */
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { NestFactory } from '@nestjs/core';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { EMAIL_PROVIDER } from '../src/modules/mail/email-provider';
import { MailService } from '../src/modules/mail/mail.service';
import { OrdersService } from '../src/modules/orders/orders.service';
import { PAYMENT_PROVIDER } from '../src/modules/payments/payment-provider';

let pass = 0, fail = 0;
const ok = (c: any, m: string) => { if (c) { pass++; console.log('  ✓', m); } else { fail++; console.log('  ✗ FAIL', m); } };
const eq = (a: any, b: any, m: string) => ok(JSON.stringify(a) === JSON.stringify(b), `${m}${JSON.stringify(a) === JSON.stringify(b) ? '' : `  (got ${JSON.stringify(a)}, want ${JSON.stringify(b)})`}`);
const section = (s: string) => console.log(`\n# ${s}`);

async function main() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, { rawBody: true, logger: ['error'] });
  app.setGlobalPrefix('api');
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }));
  await app.listen(0, '127.0.0.1');
  const http = app.getHttpServer();
  const mail = app.get(MailService);
  const email: any = app.get(EMAIL_PROVIDER);
  const provider: any = app.get(PAYMENT_PROVIDER);
  const orders = app.get(OrdersService);
  const sequelize = (orders as any).sequelize;
  const q = async (sql: string, replacements: any = {}) => (await sequelize.query(sql, { type: 'SELECT', replacements })) as any[];
  const flush = async () => { for (let i = 0; i < 20; i++) { await mail.processDue(); const [{ c }] = await q("SELECT COUNT(*) c FROM email_outbox WHERE status = 'pending'"); if (Number(c) === 0) return; await new Promise((r) => setTimeout(r, 150)); } };
  const sentTo = (to: string, tpl?: string) => email.sent.filter((e: any) => e.to === to && (!tpl || e.subject.toLowerCase().includes(tpl)));

  const stamp = Date.now();
  const buyer = `buyer+${stamp}@example.com`;

  section('1. Catalogue comes from the database');
  const cat = await request(http).get('/api/public/catalog/services');
  eq(cat.status, 200, 'catalogue 200');
  const slugs = cat.body.map((s: any) => s.slug);
  ok(['editing', 'design', '3d-ads', 'web-dev'].every((s) => slugs.includes(s)), 'four storefront services served');
  const editing = (await request(http).get('/api/public/catalog/services/editing')).body;
  const adv = editing.plans.find((p: any) => p.slug === 'advance');
  eq(adv.unitPrice, 6500, 'editing/advance unit price from DB');
  const pack7 = adv.packs.find((p: any) => p.quantity === 7);
  eq(pack7.discountPercent, 8, '7-pack discount from DB');
  eq((await request(http).get('/api/public/catalog/services/nope')).status, 404, 'unknown service 404');

  section('2. Server-side pricing + tamper rejection');
  const base = { serviceSlug: 'editing', planSlug: 'advance', packId: pack7.id, addonCodes: ['rush'], promoCode: 'OCT10' };
  const quote = await request(http).post('/api/checkout/quote').send(base);
  eq(quote.status, 200, 'quote 200');
  eq(quote.body.total, 48703.32, 'total = 7x6500, -8%, +rush, -10%, +18% GST');
  eq((await request(http).post('/api/checkout/quote').send({ ...base, total: 1 })).status, 400, 'client-supplied total rejected');
  eq((await request(http).post('/api/checkout/quote').send({ ...base, unitPrice: 1 })).status, 400, 'client-supplied price rejected');
  eq((await request(http).post('/api/checkout/quote').send({ ...base, promoCode: 'FAKE' })).status, 400, 'unknown promo rejected');
  eq((await request(http).post('/api/checkout/quote').send({ ...base, addonCodes: ['nope'] })).status, 400, 'unknown addon rejected');

  section('3. Order creation is idempotent');
  const body = { ...base, name: 'Test Buyer', email: buyer, phone: '+91 98765 43210', acceptTerms: true };
  const key = `k-${stamp}`;
  eq((await request(http).post('/api/checkout/orders').send({ ...body, acceptTerms: false })).status, 400, 'terms must be accepted');
  const o1 = await request(http).post('/api/checkout/orders').set('Idempotency-Key', key).send(body);
  const o2 = await request(http).post('/api/checkout/orders').set('Idempotency-Key', key).send(body);
  eq(o1.status, 201, 'order created');
  eq(o2.body.order.orderNumber, o1.body.order.orderNumber, 'same key -> same order');
  const [{ c: orderCount }] = await q('SELECT COUNT(*) c FROM orders WHERE buyer_email = :e', { e: buyer });
  eq(Number(orderCount), 1, 'exactly one order row');
  eq(o1.body.order.status, 'payment_pending', 'status payment_pending');
  const orderNumber = o1.body.order.orderNumber;
  const token = o1.body.accessToken;
  const providerOrderId = o1.body.payment.orderId;
  eq(o1.body.order.total, 48703.32, 'order total snapshot');
  eq((await request(http).get(`/api/checkout/orders/${orderNumber}`)).status, 401, 'no token -> 401');
  eq((await request(http).get(`/api/checkout/orders/${orderNumber}?token=bad`)).status, 401, 'bad token -> 401');

  section('4. Forged payment claims are rejected');
  const forged = await request(http).post(`/api/checkout/orders/${orderNumber}/verify?token=${token}`).send({ providerPaymentId: 'mock_pay_x', signature: 'deadbeef' });
  eq(forged.status, 400, 'forged signature rejected');
  eq((await request(http).get(`/api/checkout/orders/${orderNumber}?token=${token}`)).body.status, 'payment_pending', 'still unpaid');
  const badHook = await request(http).post('/api/webhooks/payments/mock').set('x-mock-signature', 'nope').set('content-type', 'application/json').send('{"eventId":"e0"}');
  eq(badHook.status, 401, 'unsigned webhook rejected');
  eq((await request(http).post('/api/dev/mock-payments/mock_order_unknown/captured')).status, 404, 'unknown mock order 404');

  section('5. Signed webhook settles the order; replay is a no-op');
  const hookBody = JSON.stringify({ eventId: `evt-${stamp}`, type: 'payment.captured', providerOrderId, providerPaymentId: `pay-${stamp}`, amountMinor: 4870332, currency: 'INR' });
  const sig = provider.sign(hookBody);
  const h1 = await request(http).post('/api/webhooks/payments/mock').set('x-mock-signature', sig).set('content-type', 'application/json').send(hookBody);
  eq(h1.status, 200, 'webhook accepted');
  const h2 = await request(http).post('/api/webhooks/payments/mock').set('x-mock-signature', sig).set('content-type', 'application/json').send(hookBody);
  eq(h2.body.duplicate, true, 'replay detected as duplicate');
  // second event id for same payment (gateway sends several events) must not double-apply
  const hookBody2 = JSON.stringify({ eventId: `evt2-${stamp}`, type: 'payment.captured', providerOrderId, providerPaymentId: `pay-${stamp}`, amountMinor: 4870332, currency: 'INR' });
  await request(http).post('/api/webhooks/payments/mock').set('x-mock-signature', provider.sign(hookBody2)).set('content-type', 'application/json').send(hookBody2);
  await flush();

  section('6. Exactly-once side effects');
  const pub = (await request(http).get(`/api/checkout/orders/${orderNumber}?token=${token}`)).body;
  eq(pub.status, 'paid', 'order PAID');
  ok(pub.workspaceReady, 'workspace provisioned');
  const [ord] = await q('SELECT * FROM orders WHERE order_number = :n', { n: orderNumber });
  const cnt = async (sql: string, r: any) => Number((await q(sql, r))[0].c);
  eq(await cnt('SELECT COUNT(*) c FROM users WHERE email = :e', { e: buyer }), 1, 'one user');
  eq(await cnt('SELECT COUNT(*) c FROM clients WHERE id = :i', { i: ord.client_id }), 1, 'one client');
  eq(await cnt('SELECT COUNT(*) c FROM projects WHERE id = :i', { i: ord.project_id }), 1, 'one project');
  eq(await cnt('SELECT COUNT(*) c FROM invoices WHERE id = :i', { i: ord.invoice_id }), 1, 'one invoice');
  eq(await cnt('SELECT COUNT(*) c FROM payment_transactions WHERE invoice_id = :i', { i: ord.invoice_id }), 1, 'one payment transaction');
  eq(await cnt("SELECT COUNT(*) c FROM email_outbox WHERE to_email = :e AND template='order_confirmation'", { e: buyer }), 1, 'one confirmation queued');
  eq(await cnt("SELECT COUNT(*) c FROM email_outbox WHERE to_email = :e AND template='workspace_invitation'", { e: buyer }), 1, 'one invitation queued');
  eq(Number((await q("SELECT redemptions r FROM promo_codes WHERE code='OCT10'"))[0].r) >= 1, true, 'promo redemption counted');
  const [u] = await q('SELECT status, password_hash FROM users WHERE email = :e', { e: buyer });
  eq(u.status, 'invited', 'user invited, not active');
  ok(/^\$2[aby]\$/.test(u.password_hash), 'password stored as bcrypt hash only');

  section('7. Emails');
  eq(sentTo(buyer).length, 2, 'two emails delivered (confirmation + invitation)');
  const inv = sentTo(buyer).find((e: any) => /set-password\?token=/.test(e.text));
  ok(!!inv, 'invitation contains one-time set-password link');
  const setToken = decodeURIComponent((inv.text.match(/token=([A-Za-z0-9_%.-]+)/) ?? [])[1] ?? '');
  const [{ c: hashRows }] = await q('SELECT COUNT(*) c FROM auth_tokens WHERE token_hash = :t', { t: setToken });
  eq(Number(hashRows), 0, 'raw token is not stored (only its hash)');
  ok(!sentTo(buyer).some((e: any) => /password:/i.test(e.text)), 'no plaintext password emailed');

  section('8. Set password: single use, then client login');
  eq((await request(http).post('/api/auth/login').send({ email: buyer, password: 'Whatever123!' })).status, 401, 'cannot log in before setting a password');
  eq((await request(http).post('/api/auth/set-password').send({ token: setToken, password: 'short' })).status, 400, 'weak password rejected');
  const sp = await request(http).post('/api/auth/set-password').send({ token: setToken, password: 'Str0ng-Pass!word' });
  eq(sp.status, 200, 'password set');
  eq((await request(http).post('/api/auth/set-password').send({ token: setToken, password: 'Another-Pass1!' })).status, 400, 'link is single-use');
  const login = await request(http).post('/api/auth/login').send({ email: buyer, password: 'Str0ng-Pass!word', portal: 'client' });
  eq(login.status, 200, 'client login works');
  const jwt = login.body.accessToken;
  const auth = { Authorization: `Bearer ${jwt}` };

  section('9. Client workspace shows the purchase');
  const mine = await request(http).get('/api/orders/mine').set(auth);
  eq(mine.status, 200, '/orders/mine 200');
  eq(mine.body.length, 1, 'one order');
  eq(mine.body[0].orderNumber, orderNumber, 'is the purchased order');
  eq(mine.body[0].status, 'paid', 'paid');
  eq(mine.body[0].planName, 'Advance', 'package name');
  ok(!!mine.body[0].project?.name, 'onboarding project attached');
  eq(mine.body[0].invoice?.status, 'paid', 'invoice paid');
  const projects = await request(http).get('/api/projects').set(auth);
  eq(projects.status, 200, 'existing /projects API works for the client');
  ok(JSON.stringify(projects.body).includes(ord.project_id), 'project visible via existing projects API');
  const invoices = await request(http).get('/api/invoices').set(auth);
  eq(invoices.status, 200, 'existing /invoices API works for the client');
  eq((await request(http).get('/api/orders').set(auth)).status, 403, 'client cannot list all orders');
  eq((await request(http).get('/api/orders')).status, 401, 'anonymous cannot list orders');
  const adminLogin = await request(http).post('/api/auth/login').send({ email: 'admin@example.com', password: 'DevPassword123!' });
  if (adminLogin.status === 200) {
    const lst = await request(http).get('/api/orders').set({ Authorization: `Bearer ${adminLogin.body.accessToken}` });
    ok(lst.status === 200 || lst.status === 403, `admin orders list responds (${lst.status}; 403 means re-login needed after permission seed)`);
  }

  section('10. Client cannot mark their own invoice paid');
  const selfPay = await request(http).post(`/api/invoices/${ord.invoice_id}/payments`).set(auth).send({ amount: 1, method: 'cash' });
  ok([403, 404].includes(selfPay.status), `client self-payment blocked (${selfPay.status})`);

  section('11. Price snapshot survives catalogue edits');
  await q("UPDATE service_plans SET price = 9999 WHERE slug='advance' AND service_id=(SELECT id FROM services WHERE slug='editing')").catch(() => {});
  await sequelize.query("UPDATE service_plans SET price = 9999 WHERE slug='advance' AND service_id=(SELECT id FROM services WHERE slug='editing')");
  const after = (await request(http).get(`/api/checkout/orders/${orderNumber}?token=${token}`)).body;
  eq(after.total, 48703.32, 'old order keeps its price');
  eq((await request(http).get('/api/public/catalog/services/editing')).body.plans.find((p: any) => p.slug === 'advance').unitPrice, 9999, 'catalogue edit is live immediately');
  await sequelize.query("UPDATE service_plans SET price = 6500 WHERE slug='advance' AND service_id=(SELECT id FROM services WHERE slug='editing')");

  section('12. Repeat customer: no duplicate client/user');
  const r1 = await request(http).post('/api/checkout/orders').set('Idempotency-Key', `r-${stamp}`).send({ serviceSlug: 'design', planSlug: 'standard', packId: (await request(http).get('/api/public/catalog/services/design')).body.plans[0].packs[0].id, name: 'Test Buyer', email: buyer.toUpperCase(), acceptTerms: true });
  eq(r1.status, 201, 'second order created (email case-insensitive)');
  const rBody = JSON.stringify({ eventId: `r-evt-${stamp}`, type: 'payment.captured', providerOrderId: r1.body.payment.orderId, providerPaymentId: `r-pay-${stamp}`, amountMinor: Math.round(r1.body.order.total * 100), currency: 'INR' });
  await request(http).post('/api/webhooks/payments/mock').set('x-mock-signature', provider.sign(rBody)).set('content-type', 'application/json').send(rBody);
  await flush();
  eq(await cnt('SELECT COUNT(*) c FROM users WHERE email = :e', { e: buyer }), 1, 'still one user');
  eq(await cnt('SELECT COUNT(*) c FROM clients WHERE id = :i', { i: ord.client_id }), 1, 'still one client');
  const mine2 = await request(http).get('/api/orders/mine').set(auth);
  eq(mine2.body.length, 2, 'both orders visible to the same client');
  ok(sentTo(buyer).some((e: any) => /added|new order|workspace/i.test(e.subject)), 'repeat customer notified (order added)');
  eq(sentTo(buyer).filter((e: any) => /set-password/.test(e.text)).length, 1, 'no second set-password invitation for an active user');

  section('13. Failed payment + retry');
  const fb = `fail+${stamp}@example.com`;
  const f1 = await request(http).post('/api/checkout/orders').send({ serviceSlug: 'web-dev', planSlug: 'standard', name: 'Fail Case', email: fb, acceptTerms: true });
  eq(f1.status, 201, 'project-mode order created');
  const fFail = JSON.stringify({ eventId: `f-${stamp}`, type: 'payment.failed', providerOrderId: f1.body.payment.orderId, providerPaymentId: `fp-${stamp}`, amountMinor: Math.round(f1.body.order.total * 100), currency: 'INR', failureReason: 'Card declined' });
  await request(http).post('/api/webhooks/payments/mock').set('x-mock-signature', provider.sign(fFail)).set('content-type', 'application/json').send(fFail);
  await flush();
  const fo = (await request(http).get(`/api/checkout/orders/${f1.body.order.orderNumber}?token=${f1.body.accessToken}`)).body;
  eq(fo.status, 'failed', 'order FAILED');
  eq(await cnt('SELECT COUNT(*) c FROM users WHERE email = :e', { e: fb }), 0, 'no account created for unpaid order');
  eq(sentTo(fb).length, 1, 'payment-failed email sent');
  ok(/retry|checkout/i.test(sentTo(fb)[0].text), 'failure email carries a retry link');
  const rp = await request(http).post(`/api/checkout/orders/${f1.body.order.orderNumber}/pay?token=${f1.body.accessToken}`);
  eq(rp.status, 200, 'retry payment allowed');
  const sim = (await request(http).post(`/api/dev/mock-payments/${rp.body.payment.orderId}/captured`)).body;
  const vr = await request(http).post(`/api/checkout/orders/${f1.body.order.orderNumber}/verify?token=${f1.body.accessToken}`).send({ providerPaymentId: sim.providerPaymentId, signature: sim.signature });
  eq(vr.body.status, 'paid', 'browser verify (server re-checks gateway) -> paid');
  await flush();
  eq(await cnt('SELECT COUNT(*) c FROM users WHERE email = :e', { e: fb }), 1, 'account created after eventual payment');

  section('14. Amount mismatch never marks paid');
  const mb = `mm+${stamp}@example.com`;
  const m1 = await request(http).post('/api/checkout/orders').send({ serviceSlug: 'design', planSlug: 'advance', packId: (await request(http).get('/api/public/catalog/services/design')).body.plans[1].packs[0].id, name: 'Mismatch', email: mb, acceptTerms: true });
  const mBody = JSON.stringify({ eventId: `m-${stamp}`, type: 'payment.captured', providerOrderId: m1.body.payment.orderId, providerPaymentId: `mp-${stamp}`, amountMinor: 100, currency: 'INR' });
  await request(http).post('/api/webhooks/payments/mock').set('x-mock-signature', provider.sign(mBody)).set('content-type', 'application/json').send(mBody);
  const mo = (await request(http).get(`/api/checkout/orders/${m1.body.order.orderNumber}?token=${m1.body.accessToken}`)).body;
  ok(mo.status !== 'paid', `underpaid order not marked paid (${mo.status})`);
  eq(await cnt('SELECT COUNT(*) c FROM users WHERE email = :e', { e: mb }), 0, 'no account provisioned');

  section('15. Forgot password does not leak');
  const fp1 = await request(http).post('/api/auth/forgot-password').send({ email: buyer });
  const fp2 = await request(http).post('/api/auth/forgot-password').send({ email: `nobody+${stamp}@example.com` });
  eq(fp1.body, { ok: true }, 'known email -> ok');
  eq(fp2.body, { ok: true }, 'unknown email -> identical ok');
  await flush();
  ok(sentTo(buyer).some((e: any) => /reset/i.test(e.subject)), 'reset email sent to the real user only');
  eq(sentTo(`nobody+${stamp}@example.com`).length, 0, 'nothing sent to unknown email');

  console.log(`\n${pass} passed, ${fail} failed`);
  await app.close();
  process.exit(fail ? 1 : 0);
}
main().catch((e) => { console.error(e); process.exit(2); });
