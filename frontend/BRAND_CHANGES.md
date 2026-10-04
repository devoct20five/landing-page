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
