import { SERVICES } from "./content";

/* ============================================================
   Presentation helpers for pricing. NO price lives in this repo:
   every number comes from the backend catalogue (`/public/catalog`)
   and the checkout is priced by the server. This file only shapes
   the API response for the UI and holds the page copy lookups.
============================================================ */

export const formatINR = (n) => {
  const v = Number(n) || 0;
  return `₹${v.toLocaleString("en-IN", { minimumFractionDigits: Number.isInteger(v) ? 0 : 2, maximumFractionDigits: 2 })}`;
};

/** Normalise one API service into the model the pricing UI uses. */
export function adaptService(api) {
  if (!api) return null;
  const copy = SERVICES[api.slug]?.pricing || {};
  const isProject = api.pricingMode === "project";
  const noun = { one: api.unit?.singular || "unit", many: api.unit?.plural || "units" };

  const plans = api.plans.map((p) => ({
    key: p.slug,
    name: p.name,
    icon: p.icon,
    unit: p.unitPrice,
    featured: !!p.featured,
    features: p.features,
    mode: isProject ? "project" : "packs",
    projectTypes: isProject ? p.projectTypes : undefined,
    packs: p.packs,
  }));

  // pack options are identical across plans: take them from the first plan
  const packs = isProject ? [] : (plans[0]?.packs || []).map((k) => ({ quantity: k.quantity, discountPercent: k.discountPercent }));
  const discounts = Object.fromEntries(packs.map((k) => [k.quantity, k.discountPercent]));

  return {
    slug: api.slug,
    title: api.name,
    mode: isProject ? "project" : "packs",
    noun,
    packs: packs.map((k) => k.quantity),
    discounts,
    defaultPack: packs.length ? packs[Math.floor(packs.length / 2)].quantity : 1,
    plans,
    addons: api.addons || [],
    custom: api.custom ? { title: api.custom.title, body: api.custom.body, from: api.custom.fromPrice } : null,
    headline: copy.headline,
    subline: copy.subline,
    reasons: copy.features || [],
  };
}

/** Display price for `plan` at pack size `pack` (display only: the server prices the order). */
export function priceFor(plan, pack, discounts = {}) {
  if (plan.mode === "project") {
    return { pack: 1, discountPct: 0, unit: plan.unit, list: plan.unit, total: plan.unit, save: 0 };
  }
  const discountPct = discounts[pack] ?? 0;
  const list = plan.unit * pack;
  const total = Math.round(list * (1 - discountPct / 100));
  return { pack, discountPct, unit: Math.round(total / pack), list, total, save: list - total };
}

/** Link builders - every CTA on the site goes through these. */
export const links = {
  checkout: (service, planKey, pack) =>
    `/agency/checkout?service=${service}&plan=${planKey}${pack ? `&pack=${pack}` : ""}`,
  call: (service, planKey) => `/agency/book-a-call?service=${service}${planKey ? `&plan=${planKey}` : ""}`,
  contact: (service) => `/agency/get-in-touch?service=${service}`,
};
