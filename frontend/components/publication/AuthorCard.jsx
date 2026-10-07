import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import Avatar from './Avatar'
import { getCategory, articlesByAuthor } from '@/lib/publication'

/** End-of-article author box → links to the full profile. */
export default function AuthorCard({ author }) {
  const count = articlesByAuthor(author.slug).length
  return (
    <div className="rounded-card border border-brand-border bg-brand-card p-8 md:p-10">
      <p className="text-xs font-bold uppercase tracking-[0.25em] text-brand-orange">Written by</p>
      <div className="mt-5 flex flex-col gap-6 sm:flex-row sm:items-start">
        <Link href={`/publication/authors/${author.slug}`} aria-label={`${author.name} — profile`}>
          <Avatar name={author.name} size={72} />
        </Link>
        <div className="min-w-0">
          <Link href={`/publication/authors/${author.slug}`} className="font-display text-2xl font-extrabold tracking-tight text-brand-black hover:text-brand-orange">
            {author.name}
          </Link>
          <p className="mt-1 text-sm font-medium text-brand-textSoft">{author.role}</p>
          <p className="mt-4 leading-relaxed text-brand-black/80">{author.bio}</p>
          <div className="mt-5 flex flex-wrap items-center gap-2">
            {author.beats.map((b) => (
              <Link key={b} href={`/publication/category/${b}`} className="tap rounded-full border border-brand-border px-3.5 py-1.5 text-xs font-bold text-brand-textSoft hover:border-brand-orange hover:text-brand-orange">
                {getCategory(b)?.label}
              </Link>
            ))}
          </div>
          <Link href={`/publication/authors/${author.slug}`} className="tap mt-6 inline-flex items-center gap-2 text-sm font-bold uppercase tracking-[0.15em] text-brand-orange">
            All {count} stories by {author.name.split(' ')[0]} <ArrowRight size={15} />
          </Link>
        </div>
      </div>
    </div>
  )
}
