import { api } from "./api";

function loadRazorpay() {
  return new Promise((resolve, reject) => {
    if (window.Razorpay) return resolve();
    const s = document.createElement("script");
    s.src = "https://checkout.razorpay.com/v1/checkout.js";
    s.onload = resolve;
    s.onerror = () => reject(new Error("Could not load the payment window"));
    document.body.appendChild(s);
  });
}

/** Opens the gateway for a created order. Resolves { paid:boolean, cancelled?:boolean }.
 *  The browser result is only a CLAIM - the backend verifies it with the gateway. */
export async function startPayment({ order, payment, accessToken }) {
  const verify = (body) =>
    api(`/checkout/orders/${order.orderNumber}/verify?token=${encodeURIComponent(accessToken)}`, { method: "POST", body });

  if (payment.provider === "razorpay") {
    await loadRazorpay();
    return new Promise((resolve) => {
      const rzp = new window.Razorpay({
        key: payment.keyId,
        order_id: payment.orderId,
        amount: payment.amount,
        currency: payment.currency,
        name: payment.name || "OCT20FIVE",
        description: `${order.serviceName} · ${order.planName}`,
        prefill: payment.prefill,
        theme: { color: "#FF4D00" },
        handler: async (r) => {
          try {
            const o = await verify({ providerPaymentId: r.razorpay_payment_id, signature: r.razorpay_signature });
            resolve({ paid: o.status === "paid", order: o });
          } catch {
            resolve({ paid: false, pending: true });
          }
        },
        modal: { ondismiss: () => resolve({ paid: false, cancelled: true }) },
      });
      rzp.on("payment.failed", () => resolve({ paid: false, failed: true }));
      rzp.open();
    });
  }

  if (payment.provider === "mock") {
    // Dev/test only gateway stand-in.
    const ok = window.confirm(`TEST GATEWAY\nPay ${(payment.amount / 100).toLocaleString("en-IN")} ${payment.currency} for ${order.orderNumber}?\nOK = pay, Cancel = fail`);
    const sim = await api(`/dev/mock-payments/${payment.orderId}/${ok ? "captured" : "failed"}`, { method: "POST" });
    const o = await verify({ providerPaymentId: sim.providerPaymentId, signature: sim.signature });
    return { paid: o.status === "paid", failed: !ok, order: o };
  }
  throw new Error("Unsupported payment provider");
}

/** After the gateway closes, the webhook may land a moment later: poll for the real state. */
export async function waitForPaid(orderNumber, accessToken, { tries = 12, delayMs = 1500 } = {}) {
  let last;
  for (let i = 0; i < tries; i++) {
    last = await api(`/checkout/orders/${orderNumber}?token=${encodeURIComponent(accessToken)}`);
    if (last.status === "paid" || last.status === "failed") return last;
    await new Promise((r) => setTimeout(r, delayMs));
  }
  return last;
}
