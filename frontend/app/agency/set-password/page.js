"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Shell from "../_shell";
import { api } from "@/lib/api";

function Form() {
  const token = useSearchParams().get("token") || "";
  const [pw, setPw] = useState("");
  const [pw2, setPw2] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);

  if (!token)
    return (
      <p className="opacity-80">
        This link is incomplete. Open the link from your email again, or{" "}
        <Link href="/agency/login" className="text-brand-orange underline">request a new one</Link>.
      </p>
    );

  if (done)
    return (
      <div className="brand-card space-y-4">
        <p>Your password is set. You can now sign in to your workspace.</p>
        <Link href="/agency/login" className="btn btn-primary justify-center">Sign in</Link>
      </div>
    );

  const submit = async (e) => {
    e.preventDefault();
    setErr("");
    if (pw.length < 8) return setErr("Use at least 8 characters.");
    if (pw !== pw2) return setErr("The two passwords don't match.");
    setBusy(true);
    try {
      await api("/auth/set-password", { method: "POST", body: { token, password: pw } });
      setDone(true);
    } catch (e2) {
      setErr(e2.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <form onSubmit={submit} className="brand-card space-y-5">
      <input type="password" autoComplete="new-password" className="brand-input" placeholder="New password (min 8 characters)" value={pw} onChange={(e) => setPw(e.target.value)} />
      <input type="password" autoComplete="new-password" className="brand-input" placeholder="Repeat password" value={pw2} onChange={(e) => setPw2(e.target.value)} />
      {err && <p className="text-sm text-red-400">{err}</p>}
      <button disabled={busy} className="btn btn-primary w-full justify-center">{busy ? "Saving…" : "Set password"}</button>
    </form>
  );
}

export default function Page() {
  return (
    <Shell tag="Your workspace" title={<>Set your <span className="text-brand-orange">password</span></>}>
      <Suspense fallback={null}><Form /></Suspense>
    </Shell>
  );
}
