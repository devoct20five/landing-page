import { SERVICES } from "./content";

/* ============================================================
   PLANS — single source of truth for every price on the site.

   The service pages and the checkout both read from here, so a
   number can never differ between "what the card says" and
   "what the checkout charges".

   Copy and unit prices still live in data/content.js (per service,
   under `pricing.plans`). This file only DERIVES from them:

     per-unit list price  = plan.price           (e.g. ₹6,500 / video)
     pack discount        = PACK_DISCOUNT[pack]  (3 → 0%, 7 → 8%, 15 → 12%)
     total                = unit × pack × (1 − discount)

   Totals are computed, never typed in — hand-typed totals had drifted
   (3D Ads showed ₹116,640 and ₹369,600, which don't match their own
   unit prices).
============================================================ */

/** Volume discount by pack size. Inferred from the original price list
 *  (Advance 7-pack = 8% off, Black 15-pack = 12% off). Edit here to change it. */
export const PACK_DISCOUNT = { 3: 0, 7: 8, 15: 12 };

/** Pack size selected by default (the middle option). */
export const DEFAULT_PACK = 7;

/** GST the checkout adds on top of every price. */
export const GST_RATE = 0.18;

/** What one "unit" is called, per service. */
export const UNIT_NOUN = {
  editing: { one: "video", many: "videos" },
  design: { one: "design", many: "designs" },
  "3d-ads": { one: "ad", many: "ads" },
  "web-dev": { one: "project", many: "projects" },
};

/** Web Dev is priced per project (Landing / Business / E-commerce…),
 *  not in packs of N, so it has no pack selector and no volume discount. */
const PROJECT_PRICED = new Set(["web-dev"]);

const parseINR = (s) => Number(String(s).replace(/[^\d]/g, "")) || 0;

export const formatINR = (n) => `₹${Math.round(n).toLocaleString("en-IN")}`;

const slugKey = (name) => name.toLowerCase().replace(/[^a-z0-9]+/g, "-");

/** Price for `plan` at `pack` size → every number the UI needs. */
export function priceFor(plan, pack) {
  if (plan.mode === "project") {
    return {
      pack: 1,
      discountPct: 0,
      unit: plan.unit,
      list: plan.unit,
      total: plan.unit,
      save: 0,
    };
  }
  const discountPct = PACK_DISCOUNT[pack] ?? 0;
  const list = plan.unit * pack;
  const total = Math.round(list * (1 - discountPct / 100));
  return {
    pack,
    discountPct,
    unit: Math.round(total / pack),
    list,
    total,
    save: list - total,
  };
}

/** Link builders — every CTA on the site goes through these. */
export const links = {
  checkout: (service, planKey, pack) =>
    `/agency/checkout?service=${service}&plan=${planKey}${
      pack ? `&pack=${pack}` : ""
    }`,
  call: (service, planKey) =>
    `/agency/book-a-call?service=${service}${planKey ? `&plan=${planKey}` : ""}`,
  contact: (service) => `/agency/get-in-touch?service=${service}`,
};

/** Normalised pricing model for one service (null if unknown). */
export function getPricing(slug) {
  const svc = SERVICES[slug];
  if (!svc?.pricing) return null;

  const mode = PROJECT_PRICED.has(slug) ? "project" : "packs";
  const noun = UNIT_NOUN[slug] || { one: "unit", many: "units" };

  const plans = svc.pricing.plans.map((p) => ({
    key: slugKey(p.name),
    name: p.name,
    icon: p.icon,
    unit: parseINR(p.price),
    featured: !!p.featured,
    features: p.features,
    mode,
    // project-priced services list what the tier is suited to
    projectTypes: mode === "project" ? p.packages : undefined,
  }));

  const packs =
    mode === "packs"
      ? (svc.pricing.plans[0].packages || [])
          .map((s) => parseInt(s, 10))
          .filter(Boolean)
      : [];

  return {
    slug,
    title: svc.title,
    mode,
    noun,
    packs,
    plans,
    custom: {
      title: svc.pricing.signature?.title,
      body: svc.pricing.signature?.body,
      from: parseINR(svc.pricing.signature?.price),
    },
    headline: svc.pricing.headline,
    subline: svc.pricing.subline,
    reasons: svc.pricing.features,
  };
}

/** Look a plan up by service + plan key (used by checkout). */
export function findPlan(slug, planKey) {
  const model = getPricing(slug);
  if (!model) return { model: null, plan: null };
  const plan =
    model.plans.find((p) => p.key === planKey) ||
    model.plans.find((p) => p.featured) ||
    model.plans[0];
  return { model, plan };
}
