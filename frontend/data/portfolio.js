/* ============================================================
   PORTFOLIO — the single catalogue behind /agency/portfolio.

   Every service page links here pre-filtered:
     /agency/portfolio?service=editing | design | 3d-ads | web-dev

   To add a piece of work, add one entry below. Fields:
     service    "editing" | "design" | "3d-ads" | "web-dev"   (drives filtering)
     title      project name
     thumbnail  image URL
     duration   OPTIONAL runtime "mm:ss" — only meaningful for video work
     href       OPTIONAL real URL (case study, video, live site). Without one
                the card is shown but is not a link — no dead clicks.
   NOTE: the entries below are the placeholders carried over from the old
   "Behind the Work" pages (stock thumbnails). Replace with real work.
============================================================ */

export const PORTFOLIO_SERVICES = [
  { slug: "editing", label: "Editing", noun: "Video editing" },
  { slug: "design", label: "Design", noun: "Design" },
  { slug: "3d-ads", label: "3D Ads", noun: "3D & CGI ads" },
  { slug: "web-dev", label: "Web Dev", noun: "Web development" },
];

/** Runtimes only make sense for video-based services. */
export const HAS_RUNTIME = new Set(["editing", "3d-ads"]);

export const PORTFOLIO = [
  {
    id: "editing-01",
    service: "editing",
    title: "Chase The Light",
    thumbnail:
      "https://images.unsplash.com/photo-1500462918059-b1a0cb512f1d?crop=entropy&cs=srgb&fm=jpg&q=80&w=1200",
    duration: "18:24",
  },
  {
    id: "editing-02",
    service: "editing",
    title: "Unseen Hustle",
    thumbnail:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?crop=entropy&cs=srgb&fm=jpg&q=80&w=1200",
    duration: "12:37",
  },
  {
    id: "editing-03",
    service: "editing",
    title: "Made To Perform",
    thumbnail:
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?crop=entropy&cs=srgb&fm=jpg&q=80&w=1200",
    duration: "15:02",
  },
  {
    id: "editing-04",
    service: "editing",
    title: "Next Round",
    thumbnail:
      "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?crop=entropy&cs=srgb&fm=jpg&q=80&w=1200",
    duration: "09:11",
  },
  {
    id: "editing-05",
    service: "editing",
    title: "Time In Motion",
    thumbnail:
      "https://images.unsplash.com/photo-1524592094714-0f0654e20314?crop=entropy&cs=srgb&fm=jpg&q=80&w=1200",
    duration: "14:48",
  },
  {
    id: "editing-06",
    service: "editing",
    title: "Find Your Escape",
    thumbnail:
      "https://images.unsplash.com/photo-1500534623283-312aade485b7?crop=entropy&cs=srgb&fm=jpg&q=80&w=1200",
    duration: "10:22",
  },
  {
    id: "design-01",
    service: "design",
    title: "Terraform – Brand Identity",
    thumbnail:
      "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?crop=entropy&cs=srgb&fm=jpg&q=80&w=1200",
    duration: "12:41",
  },
  {
    id: "design-02",
    service: "design",
    title: "Momentum – Logo Design",
    thumbnail:
      "https://images.unsplash.com/photo-1517842645767-c639042777db?crop=entropy&cs=srgb&fm=jpg&q=80&w=1200",
    duration: "09:16",
  },
  {
    id: "design-03",
    service: "design",
    title: "Ventura – Brand System",
    thumbnail:
      "https://images.unsplash.com/photo-1626785774573-4b799315345d?crop=entropy&cs=srgb&fm=jpg&q=80&w=1200",
    duration: "14:28",
  },
  {
    id: "design-04",
    service: "design",
    title: "Auric – Packaging Design",
    thumbnail:
      "https://images.unsplash.com/photo-1607083206869-4c7672e72a8a?crop=entropy&cs=srgb&fm=jpg&q=80&w=1200",
    duration: "10:33",
  },
  {
    id: "design-05",
    service: "design",
    title: "Kinetic – Visual Language",
    thumbnail:
      "https://images.unsplash.com/photo-1626785774625-0b1c2c4eab67?crop=entropy&cs=srgb&fm=jpg&q=80&w=1200",
    duration: "08:52",
  },
  {
    id: "design-06",
    service: "design",
    title: "Nest – UI/UX Design",
    thumbnail:
      "https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?crop=entropy&cs=srgb&fm=jpg&q=80&w=1200",
    duration: "11:07",
  },
  {
    id: "3d-ads-01",
    service: "3d-ads",
    title: "Beyond Real – Camera Ad",
    thumbnail:
      "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?crop=entropy&cs=srgb&fm=jpg&q=80&w=1200",
    duration: "13:42",
  },
  {
    id: "3d-ads-02",
    service: "3d-ads",
    title: "Nexus – Fragrance Ad",
    thumbnail:
      "https://images.unsplash.com/photo-1541643600914-78b084683601?crop=entropy&cs=srgb&fm=jpg&q=80&w=1200",
    duration: "15:18",
  },
  {
    id: "3d-ads-03",
    service: "3d-ads",
    title: "Elevate – Shoe Ad",
    thumbnail:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?crop=entropy&cs=srgb&fm=jpg&q=80&w=1200",
    duration: "12:07",
  },
  {
    id: "3d-ads-04",
    service: "3d-ads",
    title: "Volt – Energy Drink Ad",
    thumbnail:
      "https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?crop=entropy&cs=srgb&fm=jpg&q=80&w=1200",
    duration: "11:36",
  },
  {
    id: "3d-ads-05",
    service: "3d-ads",
    title: "Velocity – Automotive Ad",
    thumbnail:
      "https://images.unsplash.com/photo-1503376780353-7e6692767b70?crop=entropy&cs=srgb&fm=jpg&q=80&w=1200",
    duration: "14:53",
  },
  {
    id: "3d-ads-06",
    service: "3d-ads",
    title: "Pure Sound – Headphone Ad",
    thumbnail:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?crop=entropy&cs=srgb&fm=jpg&q=80&w=1200",
    duration: "10:28",
  },
  {
    id: "web-dev-01",
    service: "web-dev",
    title: "Nexora – Agency Website",
    thumbnail:
      "https://images.unsplash.com/photo-1547658719-da2b51169166?crop=entropy&cs=srgb&fm=jpg&q=80&w=1200",
    duration: "12:31",
  },
  {
    id: "web-dev-02",
    service: "web-dev",
    title: "Leafy – Ecommerce Website",
    thumbnail:
      "https://images.unsplash.com/photo-1463320726281-696a485928c7?crop=entropy&cs=srgb&fm=jpg&q=80&w=1200",
    duration: "14:08",
  },
  {
    id: "web-dev-03",
    service: "web-dev",
    title: "Fokus – Portfolio Website",
    thumbnail:
      "https://images.unsplash.com/photo-1494783367193-149034c05e8f?crop=entropy&cs=srgb&fm=jpg&q=80&w=1200",
    duration: "11:45",
  },
  {
    id: "web-dev-04",
    service: "web-dev",
    title: "FitTrack – SaaS Website",
    thumbnail:
      "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?crop=entropy&cs=srgb&fm=jpg&q=80&w=1200",
    duration: "13:27",
  },
  {
    id: "web-dev-05",
    service: "web-dev",
    title: "Horizon – Travel Website",
    thumbnail:
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?crop=entropy&cs=srgb&fm=jpg&q=80&w=1200",
    duration: "10:19",
  },
  {
    id: "web-dev-06",
    service: "web-dev",
    title: "Velox – SaaS Landing Page",
    thumbnail:
      "https://images.unsplash.com/photo-1550439062-609e1531270e?crop=entropy&cs=srgb&fm=jpg&q=80&w=1200",
    duration: "09:44",
  },
];

export const countByService = (slug) =>
  slug ? PORTFOLIO.filter((p) => p.service === slug).length : PORTFOLIO.length;

export const portfolioHref = (slug) =>
  slug ? `/agency/portfolio?service=${slug}` : "/agency/portfolio";
