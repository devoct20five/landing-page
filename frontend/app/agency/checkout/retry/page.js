"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Shell from "../../_shell";
import { api } from "@/lib/api";
import { startPayment, waitForPaid } from "@/lib/payment";
import { formatINR } from "@/data/plans";

/* Target of the "payment failed" email: re-opens payment for the SAME order. */
function Retry() {
  const q = useSearchParams();
  const n = q.get("order") || "";
  const token = q.get("token") || "";
  const [order, setOrder] = useState(null);
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!n || !token) return;
    api(`/checkout/orders/${n}?token=${encodeURIComponent(token)}`).then(setOrder).catch((e) => setMsg(e.message));
  }, [n, token]);

  if (!n || !token) return <p>This link is incomplete.</p>;
  if (!order) return <p className="opacity-70">{msg || "Loading…"}</p>;
  if (order.status === "paid")
    return (
      <div className="brand-card space-y-3">
        <p>Order {order.orderNumber} is already paid. Check your email for your workspace link.</p>
        <Link href="/agency/login" className="btn btn-primary justify-center">Go to your workspace</Link>
      </div>
    );

  const pay = async () => {
    setBusy(true);
    setMsg("");
    try {
      const created = await api(`/checkout/orders/${n}/pay?token=${encodeURIComponent(token)}`, { method: "POST" });
      const r = await startPayment(created);
      if (r.paid) return setOrder(r.order);
      if (r.cancelled) return setMsg("Payment cancelled. You haven't been charged.");
      if (r.failed) return setMsg("The payment didn't go through. You haven't been charged.");
      const f = await waitForPaid(n, created.accessToken);
      if (f?.status === "paid") setOrder(f);
      else setMsg("Still waiting for confirmation from your bank.");
    } catch (e) {
      setMsg(e.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="brand-card space-y-4">
      <p className="text-xs uppercase opacity-50">Order {order.orderNumber}</p>
      <p className="font-display text-xl uppercase">{order.serviceName} · {order.planName}</p>
      <p>Total {formatINR(order.total)} (incl. GST)</p>
      {order.failureReason && <p className="text-sm opacity-70">Last attempt: {order.failureReason}</p>}
      {msg && <p className="text-sm text-red-400">{msg}</p>}
      <button disabled={busy} onClick={pay} className="btn btn-primary w-full justify-center">{busy ? "Opening payment…" : "Pay now"}</button>
    </div>
  );
}

export default function Page() {
  return (
    <Shell tag="Checkout" title={<>Complete your <span className="text-brand-orange">payment</span></>}>
      <Suspense fallback={null}><Retry /></Suspense>
    </Shell>
  );
}
