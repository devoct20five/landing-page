import Link from 'next/link'
import { CATEGORIES, categoryCount, allArticles } from '@/lib/newsroom'

/** Desk navigation — "All" + one pill per category. Server component; links, not state. */
export default function CategoryNav({ active }) {
  const pill = (on) =>
    `shrink-0 rounded-full border px-5 py-2.5 text-sm font-bold transition-colors ${
      on
        ? 'border-brand-orange bg-brand-orange text-brand-cream'
        : 'border-brand-cream/20 text-brand-cream/80 hover:border-brand-cream hover:text-brand-cream'
    }`
  return (
    <nav
      aria-label="Newsroom desks"
      className="-mx-6 flex gap-2.5 overflow-x-auto px-6 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:mx-0 md:flex-wrap md:overflow-visible md:px-0"
    >
      <Link href="/newsroom" aria-current={!active ? 'page' : undefined} className={pill(!active)}>
        All stories <span className="ml-1 opacity-60">{allArticles().length}</span>
      </Link>
      {CATEGORIES.map((c) => (
        <Link
          key={c.slug}
          href={`/newsroom/category/${c.slug}`}
          aria-current={active === c.slug ? 'page' : undefined}
          className={pill(active === c.slug)}
        >
          {c.label} <span className="ml-1 opacity-60">{categoryCount(c.slug)}</span>
        </Link>
      ))}
    </nav>
  )
}
