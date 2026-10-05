import Link from 'next/link'
import { notFound } from 'next/navigation'
import Navbar from '@/components/navigation/Navbar'
import Footer from '@/components/layout/Footer'
import Eclipse from '@/components/brands/Eclipse'
import Avatar from '@/components/newsroom/Avatar'
import AuthorArticles from '@/components/newsroom/AuthorArticles'
import { AUTHORS, SITE_URL, articlesByAuthor, formatDate, getAuthor, getCategory } from '@/lib/newsroom'

export const dynamicParams = false
export const generateStaticParams = () => AUTHORS.map((a) => ({ author: a.slug }))

export async function generateMetadata({ params }) {
  const { author } = await params
  const a = getAuthor(author)
  return a ? { title: `${a.name} — Newsroom`, description: `${a.role}. ${a.bio}` } : {}
}

export default async function AuthorPage({ params }) {
  const { author: slug } = await params
  const author = getAuthor(slug)
  if (!author) notFound()

  const articles = articlesByAuthor(author.slug)
  const desks = [...new Set(articles.map((a) => a.category))]
  const latest = articles[0]

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: author.name,
    jobTitle: author.role,
    description: author.bio,
    url: `${SITE_URL}/newsroom/authors/${author.slug}`,
    worksFor: { '@type': 'Organization', name: 'OCT20FIVE' },
  }

  const stats = [
    { k: articles.length, v: articles.length === 1 ? 'Story' : 'Stories' },
    { k: desks.length, v: desks.length === 1 ? 'Desk' : 'Desks' },
    { k: author.since, v: 'Writing here since' },
    ...(latest ? [{ k: formatDate(latest.date, { day: 'numeric', month: 'short' }), v: 'Latest story' }] : []),
  ]

  return (
    <>
      <Navbar variant="newsroom" initialTheme="dark" />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <main>
        <header data-theme="dark" className="theme-dark relative overflow-hidden bg-brand-black pb-14 pt-36 text-brand-cream md:pb-20 md:pt-44">
          <Eclipse />
          <div className="container relative z-10">
            <Link href="/newsroom" className="text-xs font-bold uppercase tracking-[0.2em] text-brand-cream/60 hover:text-brand-cream">← Newsroom</Link>
            <div className="mt-10 grid items-start gap-10 md:grid-cols-[auto_1fr] md:gap-14">
              <Avatar name={author.name} size={140} className="!text-5xl" />
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.3em] text-brand-orange">{author.role}</p>
                <h1 className="mt-4 font-display text-[clamp(2.8rem,7vw,6rem)] font-black uppercase leading-[0.95] tracking-[-0.02em]">{author.name}</h1>
                <p className="mt-6 max-w-2xl text-lg leading-relaxed text-brand-cream/75">{author.bio}</p>
                <div className="mt-7 flex flex-wrap gap-2.5">
                  {author.beats.map((b) => (
                    <Link key={b} href={`/newsroom/category/${b}`} className="rounded-full border border-brand-cream/25 px-4 py-2 text-sm font-bold text-brand-cream/85 hover:border-brand-orange hover:text-brand-orange">
                      {getCategory(b)?.label}
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            <dl className="mt-14 grid grid-cols-2 gap-px overflow-hidden rounded-card border border-brand-cream/10 bg-brand-cream/10 md:grid-cols-4">
              {stats.map((s) => (
                <div key={s.v} className="bg-brand-black px-6 py-6">
                  <dd className="font-display text-3xl font-black text-brand-cream">{s.k}</dd>
                  <dt className="mt-1 text-xs font-bold uppercase tracking-[0.18em] text-brand-cream/55">{s.v}</dt>
                </div>
              ))}
            </dl>
          </div>
        </header>

        <section data-theme="light" className="bg-brand-cream py-16 md:py-24">
          <div className="container">
            <div className="mb-10 flex items-end justify-between border-b-2 border-brand-black pb-4">
              <h2 className="font-display text-3xl font-black uppercase tracking-tight text-brand-black md:text-4xl">Written by {author.name.split(' ')[0]}</h2>
            </div>
            {articles.length ? <AuthorArticles articles={articles} /> : <p className="text-brand-textSoft">No published stories yet.</p>}
          </div>
        </section>
      </main>
      <Footer variant="newsroom" />
    </>
  )
}
