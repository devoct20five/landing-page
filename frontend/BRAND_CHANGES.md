# OCT20FIVE — brand alignment changes

Source of truth: `book_brand.pptx`.

| Token | Before | Now (brand book) |
|---|---|---|
| Dark | #0A0A0A | **#1A0907** |
| Cream | #F6F4EF | **#F6F0E8** |
| Orange | #FF5A1F | **#FF5A1F** (unchanged) |
| Muted text | neutral #585858 | warm #6F625A (book slide 14) |
| Headings | Oswald | **Saira** (self-hosted `@fontsource-variable/saira`) |
| Body | Satoshi | Satoshi (Fontshare CDN) |

## New / changed files
- `tailwind.config.js`, `app/globals.css` – tokens, type, full button system (primary / secondary / ghost / icon / destructive / disabled / loading)
- `public/brand/*` – web-sized transparent logo variants (orange/cream/ink/badge) + favicons, generated from `assets/logos`
- `components/brands/Logo.jsx` – uses the real logo art (text imitation removed); dead duplicate `components/ui/Logo.jsx` deleted
- `components/brands/Eclipse.jsx` – new SVG eclipse backdrop (brand-book imagery language)
- `components/sections/Hero.jsx` – rewritten; now honours `headline` / `description` / `actions` props (service pages previously all showed the same headline)
- `app/page.js` – main-site home rebuilt on brand; `app/agency/page.js` hero rewired
- `components/navigation/Navbar.jsx` – main-site vs agency link sets, no nested links, readable type
- `components/layout/Footer.jsx` – real logo
- `app/agency/checkout/page.js` – wrapped `useSearchParams` in Suspense (this was breaking `next build`)
- `next.config.js` – frame-ancestors / X-Frame-Options / CORS tightened
- Site-wide: raw black/white/gray → brand tokens; micro type (6–9px) raised to 11–13px

## Before you deploy
1. `npm install` then `npm run build`
2. Set `NEXT_PUBLIC_SITE_URL` (currently a placeholder) and `CORS_ORIGINS` in `.env` (currently `*`)
3. Replace the ~46 Unsplash placeholder images with real work samples

---
# Round 2 — service pages, pricing, working CTAs

## Service pages (editing / design / 3d-ads / web-dev)
New section order, light/dark alternating: Hero → Solution → Trusted by → **Work gallery** (tabbed bento) →
**Process** (3 steps) → **Why us** (6 reasons) → **Pricing** → FAQ → **Closing CTA band**.
New components live in `components/service/`. Removed from service pages: the cramped tier rail,
the identical "Behind the Work" block with floating images, and the dead showreel.

## Pricing
- `data/plans.js` is now the single source of truth. Totals are **computed** (unit × pack × (1 − discount)), never typed.
- Pack selector (3 / 7 / 15) really drives every figure: per-unit price, list price struck through, total, savings.
- Web Dev is priced per project (no packs, no volume discount) — shown as "Starting at".
- Side-by-side compare table (`#compare`) and a "Custom" card with Book a call / Request a quote.
- Prices are labelled **per video / design / ad / project** (was always "/project") and "exclude 18% GST".

## CTAs — every one now resolves (crawled 54 internal targets, 0 broken)
| CTA | Goes to |
|---|---|
| See plans | `#pricing` on the same page |
| Get <plan> · N | `/agency/checkout?service=&plan=&pack=` (right plan, pack and total pre-selected) |
| Book a call | `/agency/book-a-call?service=` (service pre-selected) |
| Request a quote | `/agency/get-in-touch?service=` |
Dead `#` links removed: Footer "Newsroom", team LinkedIn/Instagram (8), portfolio items without a URL (no longer clickable).
Wrong paths fixed: checkout Terms/Refund links, `#compare`. Showreel only renders when `NEXT_PUBLIC_SHOWREEL_URL` is set.

## Forms now actually deliver
Contact, Book-a-call and Checkout previously only flipped a "success" flag in the browser.
They now POST to `/api/leads` (`app/api/leads/route.js`) which stores to MongoDB (`MONGO_URL`, `DB_NAME`) and/or
forwards to `LEADS_WEBHOOK_URL` (Slack, Zapier, Make, n8n, Google Apps Script). If neither is configured, the form says
so and opens a pre-filled email instead — it never claims success for a lead that went nowhere.

## Checkout (important)
There is **no payment processor** behind the old checkout, yet it asked for card numbers, said "Payment successful / Paid in full"
and claimed "256-bit SSL encrypted". Step 3 is now an honest **order request**: no card fields, "nothing is charged until you pay the
invoice". Plug in Razorpay/Stripe when you're ready and restore a pay step.
Call booking is likewise a **request** (the team confirms by email) — there is no calendar integration.

## Needs your input
1. Set `LEADS_WEBHOOK_URL` and/or `MONGO_URL` (without one, forms fall back to email).
2. Confirm pack discounts (3→0%, 7→8%, 15→12%) in `PACK_DISCOUNT` — inferred from your original prices.
3. 3D Ads old totals (₹116,640 / ₹369,600) didn't match their unit prices; they're now computed
   (Advance ×7 = ₹115,920; Black ×15 = ₹462,000). Confirm that's intended.
4. Web Dev tiers carried "8% / 12%" discount badges that make no sense for fixed-price projects — removed.
5. Real work samples/URLs (all gallery images are stock) and real team social links.

---
# Round 3 — Newsroom + Portfolio

## Newsroom (`/newsroom`)
| Route | What |
|---|---|
| `/newsroom` | Masthead, desk navigation, top story + "Latest", desk-by-desk sections, reporters |
| `/newsroom/category/[slug]` | One desk: top story, more from the desk, that desk's reporters |
| `/newsroom/[slug]` | Article: breadcrumb, byline, cover, reading typography, share rail (copy/X/LinkedIn/WhatsApp/email), reading-progress bar, "In this story" TOC, tags, author box, "Keep reading" |
| `/newsroom/authors/[slug]` | Profile: bio, desks, stats, **all their written material** with a desk filter |
All pages are statically generated, have per-page metadata + Open Graph, and articles/authors emit schema.org JSON-LD. Unknown slugs 404.
Code: `components/newsroom/`, `lib/newsroom.js`, `data/newsroom.js`. Home page now has a live Newsroom card and a "Latest stories" strip.

⚠️ ALL newsroom content is PLACEHOLDER (12 articles, 4 fictional authors, 6 desks, stock images) so the design can be tested end to end.
Replace `data/newsroom.js` (or swap it for a CMS fetch inside `lib/newsroom.js` — pages only use that file) before launch.

## Portfolio (`/agency/portfolio`)
One catalogue for all four services (`data/portfolio.js`, 24 items). Filter pills with counts, live search, URL-synced
(`?service=design`), per-service blurb with links to the service page and its pricing, empty state.
**Every service page links to its own filtered view** ("View all Design work · 6") and the portfolio links back to each
service and its pricing. Nav + footer now say "Portfolio". The 4 old `/agency/behind-the-work/<service>` pages were duplicates and
now 308-redirect to the portfolio.

## Needs your input
1. Real articles/authors/desks (and real author portraits — currently initial avatars).
2. Real portfolio work: all 24 entries are placeholders; add `href` to make a card clickable.
3. The old data gave *every* project a runtime (even logos and websites). Runtimes now show for Editing and 3D Ads only —
   please confirm the 3D Ads ones (10–15 min for an ad looks wrong).
4. No newsletter signup or comments yet (no backend for them) — say the word and I'll add signup through `/api/leads`.

---
# Round 4 — Newsroom → Publication, and site-wide responsive type

## Rebrand: Newsroom → Publication
Routes now live under `/publication` (`/publication`, `/publication/category/<desk>`, `/publication/<article>`,
`/publication/authors/<author>`). Old `/newsroom/*` URLs 308-redirect permanently. Code moved to
`components/publication/`, `lib/publication.js`, `data/publication.js`. Nav, footer, home card and copy all say "Publication".

## Responsive type system
Found by measuring (tools/responsive-audit.py), not guessing — 18 pages × 8 widths (360 → 1920):
- **Two tokens were used but never defined** (`text-display-2xl`, `text-body-lg`), so Careers and Behind-the-Work titles rendered at 16px.
- Existing tokens had huge phone minimums (48px) → long words like "COMPLICATED." clipped at 360px. Replaced with one fluid scale in
  `tailwind.config.js`: hero / display-2xl…sm / lead / body-lg / body / label, all `clamp(phone min, rem + vw, desktop max)`.
- 21 one-off `text-[clamp(...)]` headings + 11 `text-4xl/5xl/7xl` combos migrated onto those tokens.
- **12px floor**: ~66 micro-labels (8–11px) raised; the agency feature cards (text was 9px) are readable.
- **Large screens**: root font-size steps 17px ≥1680, 18px ≥1920, 22px ≥2560; the container is rem-based so it grows with it
  (previously 16px text floated in a fixed 1440px column on Full HD).
- Safety nets: headings can't push the page sideways (`overflow-wrap`), `min-w-0` on the booking grids (was overflowing 4px at 360).
- **Touch**: 44px minimum tap targets (buttons, tabs, footer links, logo, hamburger, inline text links); 16px form text on phones
  so iOS Safari doesn't zoom on focus.
Result: 144 page×width combinations — 0 overflow, 0 clipped headings, 0 text under 12px.
Page-title sizes: 32–42px on a small phone → 44–66px tablet → 60–105px desktop → up to 136px on Full HD.

Removed dead code: `components/sections/CollectionRail.jsx`.
