import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import Navbar from '@/components/navigation/Navbar'
import Footer from '@/components/layout/Footer'
import PageMasthead from '@/components/layout/PageMasthead'
import CategoryNav from './CategoryNav'
import ArticleCard from './ArticleCard'
import Avatar from './Avatar'
import { ARTICLES, AUTHORS, CATEGORIES, allArticles, articlesByCategory, articlesByAuthor } from '@/lib/newsroom'

const Eyebrow = ({ children }) => (
  <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-brand-orange">{children}</p>
)

/** /newsroom (all desks) and /newsroom/category/[slug] (one desk) share this layout. */
export default function NewsroomHome({ category }) {
  const all = allArticles()
  const stories = category ? articlesByCategory(category.slug) : all
  const lead = category ? stories[0] : all.find((a) => a.lead) || all[0]
  const sidebar = stories.filter((a) => a.slug !== lead?.slug).slice(0, 4)
  const rest = stories.filter((a) => a.slug !== lead?.slug && !sidebar.includes(a))
  const reporters = category ? AUTHORS.filter((a) => a.beats.includes(category.slug)) : AUTHORS

  return (
    <>
      <Navbar variant="newsroom" initialTheme="dark" />
      <main>
        <PageMasthead
          eyebrow={category ? 'Newsroom · Desk' : 'OCT20FIVE'}
          title={category ? category.label : 'Newsroom'}
          description={
            category
              ? category.description
              : 'Stories on film, design, technology and the business of making things — written by people who do the work.'
          }
          meta={`${stories.length} ${stories.length === 1 ? 'story' : 'stories'}${category ? '' : ` · ${CATEGORIES.length} desks · ${AUTHORS.length} reporters`}`}
        >
          <CategoryNav active={category?.slug} />
        </PageMasthead>

        {/* TOP STORY + LATEST ------------------------------------------------ */}
        <section data-theme="light" className="bg-brand-cream py-16 md:py-24">
          <div className="container">
            {lead ? (
              <div className="grid gap-14 lg:grid-cols-[1.65fr_1fr] lg:gap-16">
                <div>
                  <Eyebrow>{category ? 'Top story' : 'Top story'}</Eyebrow>
                  <div className="mt-5">
                    <ArticleCard article={lead} variant="lead" priority />
                  </div>
                </div>
                {sidebar.length > 0 && (
                  <aside aria-label="Latest stories">
                    <div className="flex items-center justify-between border-b-2 border-brand-black pb-4">
                      <Eyebrow>Latest</Eyebrow>
                      <span className="text-xs font-medium text-brand-textSoft">Newest first</span>
                    </div>
                    <div className="divide-y divide-brand-border">
                      {sidebar.map((a) => (
                        <div key={a.slug} className="py-6">
                          <ArticleCard article={a} variant="row" />
                        </div>
                      ))}
                    </div>
                  </aside>
                )}
              </div>
            ) : (
              <p className="py-16 text-center text-lg text-brand-textSoft">No stories on this desk yet.</p>
            )}
          </div>
        </section>

        {/* MORE FROM THIS DESK (category page) ----------------------------- */}
        {category && rest.length > 0 && (
          <section data-theme="light" className="bg-brand-cream pb-20 md:pb-28">
            <div className="container">
              <div className="border-b-2 border-brand-black pb-4"><Eyebrow>More from {category.label}</Eyebrow></div>
              <div className="mt-10 grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
                {rest.map((a) => <ArticleCard key={a.slug} article={a} />)}
              </div>
            </div>
          </section>
        )}

        {/* DESK BY DESK (home) ---------------------------------------------- */}
        {!category && (
          <section data-theme="light" className="bg-brand-cream pb-20 md:pb-28">
            <div className="container space-y-20">
              {CATEGORIES.map((c) => {
                const items = articlesByCategory(c.slug).slice(0, 3)
                if (!items.length) return null
                return (
                  <div key={c.slug}>
                    <div className="flex flex-wrap items-end justify-between gap-4 border-b-2 border-brand-black pb-4">
                      <div>
                        <h2 className="font-display text-3xl font-black uppercase tracking-tight text-brand-black md:text-4xl">{c.label}</h2>
                        <p className="mt-1.5 max-w-xl text-sm text-brand-textSoft">{c.description}</p>
                      </div>
                      <Link href={`/newsroom/category/${c.slug}`} className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-[0.15em] text-brand-orange">
                        View desk <ArrowRight size={15} />
                      </Link>
                    </div>
                    <div className={`mt-10 grid gap-x-8 gap-y-12 sm:grid-cols-2 ${items.length === 2 ? "" : "lg:grid-cols-3"}`}>
                      {items.map((a) => <ArticleCard key={a.slug} article={a} />)}
                    </div>
                  </div>
                )
              })}
            </div>
          </section>
        )}

        {/* REPORTERS --------------------------------------------------------- */}
        {reporters.length > 0 && (
          <section data-theme="dark" className="theme-dark bg-brand-black py-20 text-brand-cream md:py-28">
            <div className="container">
              <Eyebrow>{category ? `${category.label} reporters` : 'Our reporters'}</Eyebrow>
              <h2 className="mt-4 max-w-2xl font-display text-[clamp(2.2rem,4.5vw,4rem)] font-black uppercase leading-[0.98] tracking-[-0.02em]">
                The people behind the stories<span className="text-brand-orange">.</span>
              </h2>
              <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {reporters.map((r) => (
                  <Link key={r.slug} href={`/newsroom/authors/${r.slug}`} className="group rounded-card border border-brand-cream/10 bg-brand-blackSoft p-7 transition-colors hover:border-brand-orange/60">
                    <Avatar name={r.name} size={56} />
                    <h3 className="mt-6 font-display text-xl font-extrabold tracking-tight group-hover:text-brand-orange">{r.name}</h3>
                    <p className="mt-1 text-sm text-brand-cream/60">{r.role}</p>
                    <p className="mt-5 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-brand-orange">
                      {articlesByAuthor(r.slug).length} stories <ArrowRight size={13} />
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
      <Footer variant="newsroom" />
    </>
  )
}
