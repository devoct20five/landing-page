import Link from 'next/link'
import Image from 'next/image'
import { ArrowUpRight } from 'lucide-react'
import { getAuthor, getCategory, formatDate, readingMinutes } from '@/lib/newsroom'

/**
 * One story, four shapes:
 *   lead  – big image + large headline (top story)
 *   card  – standard grid card
 *   row   – small thumbnail beside the headline (sidebars, "latest" lists)
 *   dark  – card for dark sections
 * The whole card is one link; the byline is plain text (no nested anchors).
 */
function Meta({ article, light }) {
  const author = getAuthor(article.author)
  return (
    <p className={`mt-3 text-[13px] font-medium ${light ? 'text-brand-cream/55' : 'text-brand-textSoft'}`}>
      {author?.name}
      <span className="mx-2 opacity-40">·</span>
      {formatDate(article.date)}
      <span className="mx-2 opacity-40">·</span>
      {readingMinutes(article)} min read
    </p>
  )
}

function Kicker({ article, light }) {
  const cat = getCategory(article.category)
  return (
    <span className={`text-[11px] font-bold uppercase tracking-[0.22em] ${light ? 'text-brand-orange' : 'text-brand-orange'}`}>
      {cat?.label}
    </span>
  )
}

export default function ArticleCard({ article, variant = 'card', priority = false }) {
  const href = `/newsroom/${article.slug}`

  if (variant === 'lead') {
    return (
      <Link href={href} className="group block">
        <div className="relative aspect-[16/10] overflow-hidden rounded-card bg-brand-black">
          <Image
            src={article.image}
            alt={article.imageAlt || article.title}
            fill
            priority={priority}
            sizes="(min-width:1024px) 60vw, 100vw"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-brand-black/50 via-transparent to-transparent" />
        </div>
        <div className="mt-6">
          <Kicker article={article} />
          <h2 className="mt-3 font-display text-[clamp(1.9rem,3.6vw,3.2rem)] font-extrabold leading-[1.05] tracking-[-0.02em] text-brand-black transition-colors group-hover:text-brand-orange">
            {article.title}
          </h2>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-brand-textSoft">{article.dek}</p>
          <Meta article={article} />
        </div>
      </Link>
    )
  }

  if (variant === 'row') {
    return (
      <Link href={href} className="group flex gap-4">
        <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-2xl bg-brand-black md:h-28 md:w-28">
          <Image src={article.image} alt={article.imageAlt || article.title} fill sizes="112px" className="object-cover transition-transform duration-500 group-hover:scale-105" />
        </div>
        <div className="min-w-0">
          <Kicker article={article} />
          <h3 className="mt-1.5 font-display text-lg font-extrabold leading-snug tracking-tight text-brand-black transition-colors group-hover:text-brand-orange">
            {article.title}
          </h3>
          <Meta article={article} />
        </div>
      </Link>
    )
  }

  const dark = variant === 'dark'
  return (
    <Link href={href} className="group flex h-full flex-col">
      <div className="relative aspect-[4/3] overflow-hidden rounded-[1.5rem] bg-brand-black">
        <Image
          src={article.image}
          alt={article.imageAlt || article.title}
          fill
          sizes="(min-width:1024px) 33vw, (min-width:640px) 50vw, 100vw"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.05]"
        />
        <span className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-brand-cream text-brand-black opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <ArrowUpRight size={16} />
        </span>
      </div>
      <div className="mt-5 flex flex-1 flex-col">
        <Kicker article={article} light={dark} />
        <h3 className={`mt-2.5 font-display text-[1.35rem] font-extrabold leading-[1.15] tracking-tight transition-colors group-hover:text-brand-orange ${dark ? 'text-brand-cream' : 'text-brand-black'}`}>
          {article.title}
        </h3>
        <p className={`mt-3 line-clamp-2 text-[15px] leading-relaxed ${dark ? 'text-brand-cream/65' : 'text-brand-textSoft'}`}>{article.dek}</p>
        <div className="mt-auto"><Meta article={article} light={dark} /></div>
      </div>
    </Link>
  )
}
