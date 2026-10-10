"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Shell from "../_shell";
import { api, session, WORKSPACE_URL } from "@/lib/api";

export default function Page() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  const [mode, setMode] = useState("login");
  const [sent, setSent] = useState(false);

  useEffect(() => {
    if (session.get()?.accessToken && !WORKSPACE_URL) router.replace("/agency/account");
  }, [router]);

  const submit = async (e) => {
    e.preventDefault();
    setErr("");
    setBusy(true);
    try {
      if (mode === "forgot") {
        await api("/auth/forgot-password", { method: "POST", body: { email } });
        setSent(true);
        return;
      }
      const r = await api("/auth/login", { method: "POST", body: { email, password, portal: "client" } });
      session.set({ accessToken: r.accessToken, user: r.user });
      if (WORKSPACE_URL) window.location.href = WORKSPACE_URL;
      else router.push("/agency/account");
    } catch (e2) {
      setErr(e2.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <Shell tag="Client workspace" title={mode === "forgot" ? <>Reset <span className="text-brand-orange">password</span></> : <>Sign <span className="text-brand-orange">in</span></>}>
      {sent ? (
        <div className="brand-card"><p>If an account exists for {email}, a reset link is on its way.</p></div>
      ) : (
        <form onSubmit={submit} className="brand-card space-y-5">
          <input type="email" autoComplete="email" className="brand-input" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          {mode === "login" && (
            <input type="password" autoComplete="current-password" className="brand-input" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          )}
          {err && <p className="text-sm text-red-400">{err}</p>}
          <button disabled={busy} className="btn btn-primary w-full justify-center">
            {busy ? "Please wait…" : mode === "forgot" ? "Send reset link" : "Sign in"}
          </button>
          <button type="button" onClick={() => { setMode(mode === "login" ? "forgot" : "login"); setErr(""); }} className="text-sm opacity-70 underline underline-offset-4">
            {mode === "login" ? "Forgot password, or first time here?" : "Back to sign in"}
          </button>
        </form>
      )}
      <p className="mt-6 text-sm opacity-60">New here? <Link href="/agency" className="text-brand-orange underline">Browse services</Link></p>
    </Shell>
  );
}
