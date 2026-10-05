import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { ChevronRight } from 'lucide-react'
import Navbar from '@/components/navigation/Navbar'
import Footer from '@/components/layout/Footer'
import Eclipse from '@/components/brands/Eclipse'
import Avatar from '@/components/newsroom/Avatar'
import ArticleBody from '@/components/newsroom/ArticleBody'
import ArticleCard from '@/components/newsroom/ArticleCard'
import AuthorCard from '@/components/newsroom/AuthorCard'
import ShareBar from '@/components/newsroom/ShareBar'
import ReadingProgress from '@/components/newsroom/ReadingProgress'
import {
  ARTICLES, SITE_URL, articleUrl, formatDate, getArticle, getAuthor, getCategory,
  readingMinutes, relatedArticles, tableOfContents,
} from '@/lib/newsroom'

export const dynamicParams = false
export const generateStaticParams = () => ARTICLES.map((a) => ({ slug: a.slug }))

export async function generateMetadata({ params }) {
  const { slug } = await params
  const a = getArticle(slug)
  if (!a) return {}
  const author = getAuthor(a.author)
  return {
    title: a.title,
    description: a.dek,
    authors: author ? [{ name: author.name, url: `${SITE_URL}/newsroom/authors/${author.slug}` }] : undefined,
    openGraph: {
      type: 'article',
      title: a.title,
      description: a.dek,
      publishedTime: a.date,
      authors: author ? [author.name] : undefined,
      images: [{ url: a.image, width: 1600, height: 1067 }],
    },
    twitter: { card: 'summary_large_image', title: a.title, description: a.dek, images: [a.image] },
  }
}

export default async function ArticlePage({ params }) {
  const { slug } = await params
  const article = getArticle(slug)
  if (!article) notFound()

  const author = getAuthor(article.author)
  const category = getCategory(article.category)
  const toc = tableOfContents(article)
  const related = relatedArticles(article, 3)

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: article.title,
    description: article.dek,
    image: [article.image],
    datePublished: article.date,
    author: author ? { '@type': 'Person', name: author.name, url: `${SITE_URL}/newsroom/authors/${author.slug}` } : undefined,
    publisher: { '@type': 'Organization', name: 'OCT20FIVE', logo: { '@type': 'ImageObject', url: `${SITE_URL}/brand/icon-512.png` } },
    mainEntityOfPage: articleUrl(article),
    articleSection: category?.label,
  }

  return (
    <>
      <ReadingProgress />
      <Navbar variant="newsroom" initialTheme="dark" />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <main>
        {/* HEADER ---------------------------------------------------------- */}
        <header data-theme="dark" className="theme-dark relative overflow-hidden bg-brand-black pb-32 pt-36 text-brand-cream md:pb-44 md:pt-44">
          <Eclipse />
          <div className="container relative z-10 max-w-5xl">
            <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-brand-cream/60">
              <Link href="/newsroom" className="hover:text-brand-cream">Newsroom</Link>
              <ChevronRight size={13} />
              <Link href={`/newsroom/category/${category.slug}`} className="text-brand-orange hover:underline">{category.label}</Link>
            </nav>

            <h1 className="mt-7 max-w-[22ch] font-display text-[clamp(2.4rem,6vw,5rem)] font-extrabold leading-[1.02] tracking-[-0.025em] text-balance">
              {article.title}
            </h1>
            <p className="mt-7 max-w-2xl text-lg leading-relaxed text-brand-cream/75 md:text-xl">{article.dek}</p>

            <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-4 border-t border-brand-cream/15 pt-8">
              {author && (
                <Link href={`/newsroom/authors/${author.slug}`} className="group flex items-center gap-3.5">
                  <Avatar name={author.name} size={48} />
                  <span>
                    <span className="block font-display text-base font-extrabold tracking-tight group-hover:text-brand-orange">{author.name}</span>
                    <span className="block text-sm text-brand-cream/60">{author.role}</span>
                  </span>
                </Link>
              )}
              <span className="text-sm font-medium text-brand-cream/60 md:ml-auto">
                <time dateTime={article.date}>{formatDate(article.date, { day: 'numeric', month: 'long', year: 'numeric' })}</time>
                <span className="mx-2.5 opacity-40">·</span>
                {readingMinutes(article)} min read
              </span>
            </div>
          </div>
        </header>

        {/* COVER + BODY ----------------------------------------------------- */}
        <section data-theme="light" className="bg-brand-cream pb-20 md:pb-28">
          <div className="container max-w-5xl">
            <figure className="relative -mt-24 aspect-[16/9] overflow-hidden rounded-card bg-brand-black shadow-floating md:-mt-32">
              <Image src={article.image} alt={article.imageAlt || article.title} fill priority sizes="(min-width:1024px) 1000px, 100vw" className="object-cover" />
            </figure>
          </div>

          <div className={`container mt-14 grid max-w-[1180px] gap-10 lg:justify-center lg:gap-14 ${toc.length > 1 ? 'lg:grid-cols-[64px_minmax(0,720px)_260px]' : 'lg:grid-cols-[64px_minmax(0,720px)_64px]'}`}>
            <div className="hidden lg:block">
              <div className="sticky top-32">
                <p className="mb-4 text-[10px] font-bold uppercase tracking-[0.25em] text-brand-textSoft">Share</p>
                <ShareBar title={article.title} fallbackUrl={articleUrl(article)} orientation="col" />
              </div>
            </div>

            <article id="article-body" className="min-w-0">
              <div className="mb-10 lg:hidden">
                <ShareBar title={article.title} fallbackUrl={articleUrl(article)} />
              </div>
              <ArticleBody blocks={article.body} />

              {article.tags?.length > 0 && (
                <div className="mt-12 flex flex-wrap gap-2 border-t border-brand-border pt-8">
                  {article.tags.map((t) => (
                    <span key={t} className="rounded-full bg-brand-creamSoft px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-brand-textSoft">#{t}</span>
                  ))}
                </div>
              )}
            </article>

            {toc.length > 1 ? (
              <aside className="hidden lg:block">
                <div className="sticky top-32 rounded-card border border-brand-border bg-brand-card p-6">
                  <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-brand-orange">In this story</p>
                  <ul className="mt-4 space-y-3">
                    {toc.map((t) => (
                      <li key={t.id}><a href={`#${t.id}`} className="text-[15px] font-medium leading-snug text-brand-black/80 hover:text-brand-orange">{t.text}</a></li>
                    ))}
                  </ul>
                </div>
              </aside>
            ) : <div className="hidden lg:block" />}
          </div>

          {author && (
            <div className="container mt-20 max-w-[820px]">
              <AuthorCard author={author} />
            </div>
          )}
        </section>

        {/* KEEP READING ---------------------------------------------------- */}
        <section data-theme="light" className="border-t border-brand-border bg-brand-creamSoft py-20 md:py-28">
          <div className="container">
            <div className="flex items-end justify-between border-b-2 border-brand-black pb-4">
              <h2 className="font-display text-3xl font-black uppercase tracking-tight text-brand-black md:text-4xl">Keep reading</h2>
              <Link href="/newsroom" className="text-sm font-bold uppercase tracking-[0.15em] text-brand-orange">All stories →</Link>
            </div>
            <div className="mt-10 grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((a) => <ArticleCard key={a.slug} article={a} />)}
            </div>
          </div>
        </section>
      </main>
      <Footer variant="newsroom" />
    </>
  )
}
