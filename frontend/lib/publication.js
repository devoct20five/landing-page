import { ARTICLES, AUTHORS, CATEGORIES } from "@/data/publication";

/* All publication reads go through here — swap the data source without touching pages. */

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://oct20five.example.com";

const byDateDesc = (a, b) => new Date(b.date) - new Date(a.date);

export const allArticles = () => [...ARTICLES].sort(byDateDesc);
export const getArticle = (slug) => ARTICLES.find((a) => a.slug === slug) || null;
export const getCategory = (slug) => CATEGORIES.find((c) => c.slug === slug) || null;
export const getAuthor = (slug) => AUTHORS.find((a) => a.slug === slug) || null;

export const articlesByCategory = (slug) =>
  allArticles().filter((a) => a.category === slug);
export const articlesByAuthor = (slug) =>
  allArticles().filter((a) => a.author === slug);

/** Related = same category first, then newest of the rest. Never includes `article` itself. */
export function relatedArticles(article, n = 3) {
  const others = allArticles().filter((a) => a.slug !== article.slug);
  const same = others.filter((a) => a.category === article.category);
  const rest = others.filter((a) => a.category !== article.category);
  return [...same, ...rest].slice(0, n);
}

export const categoryCount = (slug) => articlesByCategory(slug).length;

const wordsOf = (article) =>
  article.body
    .map((b) => (b.items ? b.items.join(" ") : b.text || ""))
    .join(" ")
    .split(/\s+/)
    .filter(Boolean).length;

/** ~220 wpm, minimum 1 minute. */
export const readingMinutes = (article) => Math.max(1, Math.round(wordsOf(article) / 220));

export const formatDate = (iso, opts = { day: "numeric", month: "short", year: "numeric" }) =>
  new Date(iso + "T00:00:00Z").toLocaleDateString("en-IN", { ...opts, timeZone: "UTC" });

export const initials = (name) =>
  name
    .split(/\s+/)
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

export const slugify = (t) =>
  t.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

/** Headings in the body → table of contents. */
export const tableOfContents = (article) =>
  article.body
    .filter((b) => b.type === "h2")
    .map((b) => ({ text: b.text, id: slugify(b.text) }));

export const articleUrl = (a) => `${SITE_URL}/publication/${a.slug}`;

export { CATEGORIES, AUTHORS, ARTICLES };
