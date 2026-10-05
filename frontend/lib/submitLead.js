/**
 * Client helper used by every form.
 *
 *   const r = await submitLead({ kind: 'call', name, email, ... })
 *   r.ok          → delivered to the team
 *   r.fallback    → delivery isn't set up; a pre-filled email was opened instead
 *
 * It never reports success for a lead that went nowhere.
 */
export const CONTACT_EMAIL = "hello@oct20five.com";

export async function submitLead(lead) {
  try {
    const res = await fetch("/api/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...lead,
        source: typeof window !== "undefined" ? window.location.href : "",
      }),
    });
    const data = await res.json().catch(() => ({}));
    if (res.ok && data.ok) return { ok: true, id: data.id };
    if (res.status === 400) return { ok: false, error: data.error || "Please check your details." };
  } catch {
    /* network / server down → fall through to email */
  }

  // Fallback: open a pre-filled email so the enquiry isn't lost.
  if (typeof window !== "undefined") {
    const subject = `[${lead.kind || "enquiry"}] ${lead.service || "OCT20FIVE"} — ${lead.name}`;
    const body = [
      `Name: ${lead.name}`,
      `Email: ${lead.email}`,
      lead.phone && `Phone: ${lead.phone}`,
      lead.company && `Company: ${lead.company}`,
      lead.service && `Service: ${lead.service}`,
      lead.plan && `Plan: ${lead.plan}${lead.pack ? ` × ${lead.pack}` : ""}`,
      "",
      lead.message || "",
    ]
      .filter((l) => l !== undefined && l !== false && l !== null)
      .join("\n");
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(
      subject,
    )}&body=${encodeURIComponent(body)}`;
  }
  return { ok: false, fallback: true };
}
