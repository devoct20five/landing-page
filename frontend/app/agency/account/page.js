"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Shell from "../_shell";
import { api, session, WORKSPACE_URL } from "@/lib/api";
import { formatINR } from "@/data/plans";

export default function Page() {
  const router = useRouter();
  const [state, setState] = useState({ loading: true, orders: [], error: "" });
  const [user, setUser] = useState(null);

  useEffect(() => {
    const s = session.get();
    if (!s?.accessToken) return router.replace("/agency/login");
    setUser(s.user);
    api("/orders/mine", { token: s.accessToken })
      .then((orders) => setState({ loading: false, orders, error: "" }))
      .catch((e) => {
        if (e.status === 401 || e.status === 403) { session.clear(); router.replace("/agency/login"); return; }
        setState({ loading: false, orders: [], error: e.message });
      });
  }, [router]);

  const signOut = () => { session.clear(); router.push("/agency/login"); };

  return (
    <Shell wide tag="Client workspace" title={<>Your <span className="text-brand-orange">orders</span></>}>
      <div className="mb-6 flex items-center justify-between text-sm opacity-80">
        <span>{user?.email}</span>
        <div className="flex gap-4">
          {WORKSPACE_URL && <a className="underline" href={WORKSPACE_URL}>Open full workspace</a>}
          <button onClick={signOut} className="underline">Sign out</button>
        </div>
      </div>
      {state.loading && <p className="opacity-70">Loading…</p>}
      {state.error && <p className="text-red-400">{state.error}</p>}
      {!state.loading && !state.error && state.orders.length === 0 && (
        <div className="brand-card"><p>No orders yet. <Link href="/agency" className="text-brand-orange underline">Browse services</Link></p></div>
      )}
      <div className="space-y-5">
        {state.orders.map((o) => (
          <article key={o.orderNumber} data-testid="order" className="brand-card space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xs uppercase opacity-50">Order {o.orderNumber}</p>
                <h2 className="font-display text-xl uppercase tracking-tight">
                  {o.serviceName} · {o.planName}{o.packLabel ? ` · ${o.packLabel}` : ""}
                </h2>
              </div>
              <span className="rounded-full border border-brand-orange px-3 py-1 text-xs font-bold uppercase text-brand-orange">{o.status}</span>
            </div>
            <div className="grid gap-4 text-sm md:grid-cols-3">
              <div><p className="opacity-50">Total</p><p className="font-semibold">{formatINR(o.total)}</p></div>
              <div><p className="opacity-50">Invoice</p><p className="font-semibold">{o.invoice ? `${o.invoice.number} · ${o.invoice.status}` : "—"}</p></div>
              <div><p className="opacity-50">Paid</p><p className="font-semibold">{o.paidAt ? new Date(o.paidAt).toLocaleDateString("en-IN") : "—"}</p></div>
            </div>
            {o.project && (
              <div className="border-t pt-4 text-sm" style={{ borderColor: "var(--surface-border)" }}>
                <p className="opacity-50">Project</p>
                <p className="font-semibold">{o.project.name}</p>
                <p className="opacity-70">Status: {String(o.project.status).replace(/[_-]/g, " ")}{o.project.nextStep ? ` · ${o.project.nextStep}` : ""}</p>
              </div>
            )}
          </article>
        ))}
      </div>
    </Shell>
  );
}
