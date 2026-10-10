import { QueryInterface } from 'sequelize';
import { randomUUID } from 'crypto';

// The storefront catalogue (the ONLY place prices live; the website reads them
// from the API). Generated from the original site's content data. Idempotent:
// matches by slug, updates prices/copy in place, never duplicates rows.
const SERVICES = [
 {
  "slug": "editing",
  "name": "Editing",
  "heroHeadline": "We make good footage really hard to skip",
  "heroTag": "CUT. PACE. GRIP.",
  "heroImage": "https://images.unsplash.com/photo-1586521532926-7db207e5b019?crop=entropy&cs=srgb&fm=jpg&q=85&w=2200",
  "mode": "packs",
  "unit": [
   "video",
   "videos"
  ],
  "customTitle": "Built Around Your Vision.",
  "customBody": "Tailored from scratch. For brands that need more than a package.",
  "customFrom": 55000,
  "sort": 10,
  "plans": [
   {
    "slug": "standard",
    "name": "Standard",
    "icon": "Film",
    "price": 3000,
    "featured": false,
    "features": [
     "Delivery in 48–72 Hours",
     "Basic Color Correction",
     "Basic Titles & Captions",
     "Client Footage",
     "Up to 2 Rounds of Revisions",
     "Basic Audio Cleanup"
    ],
    "packs": [
     {
      "label": "3 Pack",
      "quantity": 3,
      "discount": 0
     },
     {
      "label": "7 Pack",
      "quantity": 7,
      "discount": 8
     },
     {
      "label": "15 Pack",
      "quantity": 15,
      "discount": 12
     }
    ]
   },
   {
    "slug": "advance",
    "name": "Advance",
    "icon": "Rocket",
    "price": 6500,
    "featured": true,
    "features": [
     "Delivery in 48–72 Hours",
     "Advanced Color Matching & Grading",
     "Branded Graphics & Transitions",
     "Client Footage + Stock Assets",
     "Up to 3 Rounds of Revisions",
     "Enhanced Audio & SFX"
    ],
    "packs": [
     {
      "label": "3 Pack",
      "quantity": 3,
      "discount": 0
     },
     {
      "label": "7 Pack",
      "quantity": 7,
      "discount": 8
     },
     {
      "label": "15 Pack",
      "quantity": 15,
      "discount": 12
     }
    ]
   },
   {
    "slug": "black",
    "name": "Black",
    "icon": "Sparkles",
    "price": 10000,
    "featured": false,
    "features": [
     "Delivery in 24–48 Hours",
     "Cinematic Color Grading",
     "Premium Motion Design",
     "Extensive Integration",
     "Premium Sound Design",
     "Up to 3 Rounds of Revisions"
    ],
    "packs": [
     {
      "label": "3 Pack",
      "quantity": 3,
      "discount": 0
     },
     {
      "label": "7 Pack",
      "quantity": 7,
      "discount": 8
     },
     {
      "label": "15 Pack",
      "quantity": 15,
      "discount": 12
     }
    ]
   }
  ]
 },
 {
  "slug": "design",
  "name": "Design",
  "heroHeadline": "Good ideas deserve to look the part",
  "heroTag": "IMAGINE. DESIGN. DEFINE.",
  "heroImage": "https://images.unsplash.com/photo-1573867607590-361ea324975e?crop=entropy&cs=srgb&fm=jpg&q=85&w=2200",
  "mode": "packs",
  "unit": [
   "design",
   "designs"
  ],
  "customTitle": "Built Around Your Brand.",
  "customBody": "Custom identity, campaign or design systems built from scratch.",
  "customFrom": 35000,
  "sort": 11,
  "plans": [
   {
    "slug": "standard",
    "name": "Standard",
    "icon": "Palette",
    "price": 2500,
    "featured": false,
    "features": [
     "5–7 Day Delivery",
     "One Design Direction",
     "Print + Digital Assets",
     "Client Brand Assets",
     "Up to 2 Rounds of Revisions",
     "Production-Ready Exports"
    ],
    "packs": [
     {
      "label": "3 Pack",
      "quantity": 3,
      "discount": 0
     },
     {
      "label": "7 Pack",
      "quantity": 7,
      "discount": 8
     },
     {
      "label": "15 Pack",
      "quantity": 15,
      "discount": 12
     }
    ]
   },
   {
    "slug": "advance",
    "name": "Advance",
    "icon": "Sparkles",
    "price": 6500,
    "featured": true,
    "features": [
     "5–10 Day Design Sprint",
     "Multiple Creative Directions",
     "Brand + Campaign Systems",
     "Custom Illustration & Graphics",
     "Up to 3 Rounds of Revisions",
     "Print + Digital Production"
    ],
    "packs": [
     {
      "label": "3 Pack",
      "quantity": 3,
      "discount": 0
     },
     {
      "label": "7 Pack",
      "quantity": 7,
      "discount": 8
     },
     {
      "label": "15 Pack",
      "quantity": 15,
      "discount": 12
     }
    ]
   },
   {
    "slug": "black",
    "name": "Black",
    "icon": "Gem",
    "price": 12000,
    "featured": false,
    "features": [
     "Priority Design Delivery",
     "Full Brand System",
     "Campaign Art Direction",
     "Premium Motion & Graphics",
     "Up to 3 Rounds of Revisions",
     "Complete Source File Handover"
    ],
    "packs": [
     {
      "label": "3 Pack",
      "quantity": 3,
      "discount": 0
     },
     {
      "label": "7 Pack",
      "quantity": 7,
      "discount": 8
     },
     {
      "label": "15 Pack",
      "quantity": 15,
      "discount": 12
     }
    ]
   }
  ]
 },
 {
  "slug": "3d-ads",
  "name": "3D Ads",
  "heroHeadline": "We make products do impossible things",
  "heroTag": "MODEL. ANIMATE. IMPACT.",
  "heroImage": "https://images.unsplash.com/photo-1656588360305-095657d15c6f?crop=entropy&cs=srgb&fm=jpg&q=85&w=2200",
  "mode": "packs",
  "unit": [
   "ad",
   "ads"
  ],
  "customTitle": "Built Around Your Impossible.",
  "customBody": "Full CGI campaigns, product worlds and custom VFX production.",
  "customFrom": 75000,
  "sort": 12,
  "plans": [
   {
    "slug": "standard",
    "name": "Standard",
    "icon": "Boxes",
    "price": 7999,
    "featured": false,
    "features": [
     "5–7 Day Production",
     "Single Product Setup",
     "Basic CGI Animation",
     "Studio Lighting Setup",
     "Up to 2 Revision Rounds",
     "Platform-Ready Export"
    ],
    "packs": [
     {
      "label": "3 Pack",
      "quantity": 3,
      "discount": 0
     },
     {
      "label": "7 Pack",
      "quantity": 7,
      "discount": 8
     },
     {
      "label": "15 Pack",
      "quantity": 15,
      "discount": 12
     }
    ]
   },
   {
    "slug": "advance",
    "name": "Advance",
    "icon": "Clapperboard",
    "price": 18000,
    "featured": true,
    "features": [
     "7–14 Day Production",
     "Custom Product Modeling",
     "Cinematic Lighting & Materials",
     "Advanced Animation & Simulation",
     "Up to 3 Revision Rounds",
     "Color, Comp & Sound Design"
    ],
    "packs": [
     {
      "label": "3 Pack",
      "quantity": 3,
      "discount": 0
     },
     {
      "label": "7 Pack",
      "quantity": 7,
      "discount": 8
     },
     {
      "label": "15 Pack",
      "quantity": 15,
      "discount": 12
     }
    ]
   },
   {
    "slug": "black",
    "name": "Black",
    "icon": "Atom",
    "price": 35000,
    "featured": false,
    "features": [
     "Priority Production",
     "Photoreal Product Environments",
     "Complex FX & Simulation",
     "Premium Art Direction",
     "Up to 3 Revision Rounds",
     "Broadcast-Ready Mastering"
    ],
    "packs": [
     {
      "label": "3 Pack",
      "quantity": 3,
      "discount": 0
     },
     {
      "label": "7 Pack",
      "quantity": 7,
      "discount": 8
     },
     {
      "label": "15 Pack",
      "quantity": 15,
      "discount": 12
     }
    ]
   }
  ]
 },
 {
  "slug": "web-dev",
  "name": "Web Dev",
  "heroHeadline": "We build websites worth staying on",
  "heroTag": "DESIGN. DEVELOP. DEPLOY.",
  "heroImage": "https://images.unsplash.com/photo-1640030655997-7062bf40b23b?crop=entropy&cs=srgb&fm=jpg&q=85&w=2200",
  "mode": "project",
  "unit": [
   "project",
   "projects"
  ],
  "customTitle": "Built Around Your Business.",
  "customBody": "Custom web products, platforms and experiences scoped around your actual requirements.",
  "customFrom": 55000,
  "sort": 13,
  "plans": [
   {
    "slug": "standard",
    "name": "Standard",
    "icon": "Code2",
    "price": 6000,
    "featured": false,
    "features": [
     "3–5 Day Delivery",
     "Responsive Design",
     "Up to 5 Pages",
     "Contact / Lead Forms",
     "Basic SEO Setup",
     "Deployment Included"
    ],
    "packs": [
     {
      "label": "Landing",
      "quantity": 1,
      "discount": 0
     },
     {
      "label": "Business",
      "quantity": 1,
      "discount": 0
     },
     {
      "label": "Portfolio",
      "quantity": 1,
      "discount": 0
     }
    ]
   },
   {
    "slug": "advance",
    "name": "Advance",
    "icon": "Layers",
    "price": 18000,
    "featured": true,
    "features": [
     "7–14 Day Delivery",
     "Custom UI/UX Design",
     "CMS Integration",
     "Motion & Interactions",
     "Performance Optimization",
     "30 Days Post-Launch Support"
    ],
    "packs": [
     {
      "label": "Landing",
      "quantity": 1,
      "discount": 0
     },
     {
      "label": "Business",
      "quantity": 1,
      "discount": 0
     },
     {
      "label": "E-commerce",
      "quantity": 1,
      "discount": 0
     }
    ]
   },
   {
    "slug": "black",
    "name": "Black",
    "icon": "Rocket",
    "price": 35000,
    "featured": false,
    "features": [
     "Priority Development",
     "Advanced Web Architecture",
     "Custom Components",
     "E-commerce / API Integration",
     "Advanced Motion & Interaction",
     "Full Source + Deployment Handover"
    ],
    "packs": [
     {
      "label": "Business",
      "quantity": 1,
      "discount": 0
     },
     {
      "label": "E-commerce",
      "quantity": 1,
      "discount": 0
     },
     {
      "label": "Custom",
      "quantity": 1,
      "discount": 0
     }
    ]
   }
  ]
 }
] as any[];

const ADDONS: Record<string, Array<{ code: string; label: string; price: number }>> = {
  editing: [
    { code: 'rush', label: 'Rush delivery (12hr)', price: 4000 },
    { code: 'thumbnails', label: 'Extra thumbnail set', price: 1500 },
    { code: 'captions', label: 'Multi-language captions', price: 2500 },
  ],
};
const PROMOS = [{ code: 'OCT10', percent: 10 }, { code: 'OCT20', percent: 20 }];

module.exports = {
  up: async (qi: QueryInterface) => {
    const now = new Date();
    const q = async (sql: string, replacements: any = {}) =>
      (await qi.sequelize.query(sql, { type: 'SELECT', replacements })) as any[];

    for (const s of SERVICES) {
      let [svc] = await q('SELECT id FROM services WHERE slug = :slug', { slug: s.slug });
      const fields = {
        name: s.name, hero_headline: s.heroHeadline, hero_tag: s.heroTag, hero_image_url: s.heroImage,
        is_active: 1, sort_order: s.sort, pricing_mode: s.mode,
        unit_singular: s.unit[0], unit_plural: s.unit[1],
        custom_title: s.customTitle, custom_body: s.customBody, custom_from_price: s.customFrom,
      };
      if (!svc) {
        svc = { id: randomUUID() };
        await qi.bulkInsert('services', [{ id: svc.id, slug: s.slug, created_at: now, ...fields }]);
      } else {
        await qi.bulkUpdate('services', fields, { id: svc.id });
      }

      for (const [pi, p] of s.plans.entries()) {
        let [plan] = await q('SELECT id FROM service_plans WHERE service_id = :sid AND slug = :slug', { sid: svc.id, slug: p.slug });
        const pf = { name: p.name, icon: p.icon, price: p.price, is_featured: p.featured ? 1 : 0, is_active: 1, sort_order: pi };
        if (!plan) {
          plan = { id: randomUUID() };
          await qi.bulkInsert('service_plans', [{ id: plan.id, service_id: svc.id, slug: p.slug, created_at: now, ...pf }]);
        } else {
          await qi.bulkUpdate('service_plans', pf, { id: plan.id });
        }
        // packs + features are replaced wholesale only when none exist (keeps edits made in the DB)
        const [hasPacks] = await q('SELECT 1 AS x FROM service_plan_packages WHERE plan_id = :id LIMIT 1', { id: plan.id });
        if (!hasPacks) {
          await qi.bulkInsert('service_plan_packages', p.packs.map((k: any, i: number) => ({
            id: randomUUID(), plan_id: plan.id, label: k.label, sort_order: i, quantity: k.quantity, discount_percent: k.discount,
          })));
        }
        const [hasFeat] = await q('SELECT 1 AS x FROM service_plan_features WHERE plan_id = :id LIMIT 1', { id: plan.id });
        if (!hasFeat) {
          await qi.bulkInsert('service_plan_features', p.features.map((f: string, i: number) => ({
            id: randomUUID(), plan_id: plan.id, feature_text: f, sort_order: i,
          })));
        }
      }

      for (const [ai, a] of (ADDONS[s.slug] ?? []).entries()) {
        const [ex] = await q('SELECT id FROM service_addons WHERE service_id = :sid AND code = :code', { sid: svc.id, code: a.code });
        if (!ex) await qi.bulkInsert('service_addons', [{ id: randomUUID(), service_id: svc.id, code: a.code, label: a.label, price: a.price, is_active: 1, sort_order: ai }]);
      }
    }

    for (const p of PROMOS) {
      const [ex] = await q('SELECT id FROM promo_codes WHERE code = :c', { c: p.code });
      if (!ex) await qi.bulkInsert('promo_codes', [{ id: randomUUID(), code: p.code, percent_off: p.percent, is_active: 1, redemptions: 0, created_at: now, updated_at: now }]);
    }
  },
  down: async () => {},
};
