import { MongoClient } from "mongodb";
import { v4 as uuidv4 } from "uuid";
import { NextResponse } from "next/server";

/**
 * POST /api/leads
 *
 * Receives every form on the site (contact, book-a-call, checkout order
 * request) and delivers it somewhere a human will actually see it.
 *
 * Delivery sinks (a lead counts as delivered if AT LEAST ONE succeeds):
 *   1. MongoDB   – MONGO_URL + DB_NAME           → `leads` collection
 *   2. Webhook   – LEADS_WEBHOOK_URL (optional)  → JSON POST; works with
 *                  Slack incoming webhooks, Zapier, Make, n8n, Google Apps Script…
 *
 * If nothing is configured / reachable we return 502 and the client falls back
 * to a pre-filled mailto: — we never report success for a lead that went nowhere.
 */

export const runtime = "nodejs";

const KINDS = new Set(["contact", "call", "order"]);
const clip = (v, n = 2000) => String(v ?? "").slice(0, n);

function safeDetails(d) {
  if (!d || typeof d !== "object") return undefined;
  const out = {};
  for (const [k, v] of Object.entries(d).slice(0, 25)) {
    if (["string", "number", "boolean"].includes(typeof v)) out[clip(k, 40)] = clip(v, 500);
  }
  return out;
}

let clientPromise;
function mongo() {
  if (!process.env.MONGO_URL) return null;
  if (!clientPromise) {
    clientPromise = new MongoClient(process.env.MONGO_URL, {
      serverSelectionTimeoutMS: 2500,
    })
      .connect()
      .catch((e) => {
        clientPromise = undefined;
        throw e;
      });
  }
  return clientPromise;
}

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  // honeypot: real people never fill this hidden field
  if (body.website) return NextResponse.json({ ok: true, id: "ignored" });

  const kind = KINDS.has(body.kind) ? body.kind : null;
  const email = clip(body.email, 200).trim();
  const name = clip(body.name, 200).trim();
  if (!kind) return NextResponse.json({ error: "Unknown form type" }, { status: 400 });
  if (!name || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json(
      { error: "A name and a valid email are required" },
      { status: 400 },
    );
  }

  // whitelist + clip: never store arbitrary client-supplied structure
  const lead = {
    id: uuidv4(),
    kind,
    name,
    email,
    phone: clip(body.phone, 40),
    company: clip(body.company, 200),
    service: clip(body.service, 60),
    plan: clip(body.plan, 60),
    pack: clip(body.pack, 20),
    message: clip(body.message, 4000),
    details: safeDetails(body.details),
    createdAt: new Date().toISOString(),
    source: clip(body.source, 300),
  };
  if (lead.details === undefined) delete lead.details;

  const results = [];

  try {
    const c = await mongo();
    if (c) {
      await c.db(process.env.DB_NAME).collection("leads").insertOne({ ...lead });
      results.push("mongo");
    }
  } catch (e) {
    console.error("[leads] mongo failed:", e?.message);
  }

  if (process.env.LEADS_WEBHOOK_URL) {
    try {
      const res = await fetch(process.env.LEADS_WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // `text` makes Slack-compatible webhooks render something readable
        body: JSON.stringify({
          text: `New ${kind} lead — ${name} <${email}>${
            lead.service ? ` · ${lead.service}` : ""
          }${lead.plan ? ` / ${lead.plan}` : ""}${lead.pack ? ` × ${lead.pack}` : ""}\n${lead.message}`,
          lead,
        }),
        signal: AbortSignal.timeout(5000),
      });
      if (res.ok) results.push("webhook");
      else console.error("[leads] webhook status", res.status);
    } catch (e) {
      console.error("[leads] webhook failed:", e?.message);
    }
  }

  if (results.length === 0) {
    return NextResponse.json(
      { ok: false, error: "Lead delivery is not configured" },
      { status: 502 },
    );
  }
  return NextResponse.json({ ok: true, id: lead.id });
}
