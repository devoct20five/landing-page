'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useSearchParams } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, ArrowUpRight, Search, X, Play } from 'lucide-react'
import Navbar from '@/components/navigation/Navbar'
import Footer from '@/components/layout/Footer'
import PageMasthead from '@/components/layout/PageMasthead'
import FinalCTA from '@/components/service/FinalCTA'
import { AGENCY_SERVICES } from '@/data/content'
import { HAS_RUNTIME, PORTFOLIO, PORTFOLIO_SERVICES, countByService } from '@/data/portfolio'
import { links } from '@/data/plans'

const EASE = [0.22, 1, 0.36, 1]
const VALID = new Set(PORTFOLIO_SERVICES.map((s) => s.slug))
const label = (slug) => PORTFOLIO_SERVICES.find((s) => s.slug === slug)?.label

function Card({ item }) {
  const real = item.href && item.href !== '#'
  const Tag = real ? 'a' : 'div'
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.4, ease: EASE }}
    >
      <Tag
        {...(real ? { href: item.href, target: '_blank', rel: 'noopener noreferrer' } : {})}
        className="group block"
      >
        <div className="relative aspect-[4/3] overflow-hidden rounded-[1.5rem] bg-brand-black">
          <Image
            src={item.thumbnail}
            alt={item.title}
            fill
            sizes="(min-width:1024px) 33vw, (min-width:640px) 50vw, 100vw"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-brand-black/70 via-transparent to-transparent opacity-80" />
          <span className="absolute left-4 top-4 rounded-full bg-brand-black/70 px-3.5 py-1.5 text-xs font-bold uppercase tracking-[0.18em] text-brand-cream backdrop-blur">
            {label(item.service)}
          </span>
          {HAS_RUNTIME.has(item.service) && item.duration && (
            <span className="absolute bottom-4 right-4 inline-flex items-center gap-1.5 rounded-full bg-brand-cream px-3 py-1 text-xs font-bold text-brand-black">
              {real && <Play size={11} className="fill-current" />} {item.duration}
            </span>
          )}
          {real && (
            <span className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-brand-orange text-brand-cream">
              <ArrowUpRight size={16} />
            </span>
          )}
        </div>
        <h3 className="mt-5 font-display text-xl font-extrabold leading-tight tracking-tight text-brand-black transition-colors group-hover:text-brand-orange">
          {item.title}
        </h3>
      </Tag>
    </motion.div>
  )
}

export default function PortfolioCatalogue() {
  const params = useSearchParams()
  const initial = params.get('service')
  const [service, setService] = useState(VALID.has(initial) ? initial : 'all')
  const [query, setQuery] = useState('')

  // keep the URL shareable: /agency/portfolio?service=design
  useEffect(() => {
    const url = new URL(window.location.href)
    if (service === 'all') url.searchParams.delete('service')
    else url.searchParams.set('service', service)
    window.history.replaceState(null, '', url)
  }, [service])

  const shown = useMemo(() => {
    const q = query.trim().toLowerCase()
    return PORTFOLIO.filter(
      (p) => (service === 'all' || p.service === service) && (!q || p.title.toLowerCase().includes(q)),
    )
  }, [service, query])

  const info = AGENCY_SERVICES.find((s) => s.slug === service)
  const pill = (on) =>
    `shrink-0 rounded-full border px-5 py-2.5 text-sm font-bold transition-colors ${
      on
        ? 'border-brand-orange bg-brand-orange text-brand-cream'
        : 'border-brand-cream/20 text-brand-cream/80 hover:border-brand-cream hover:text-brand-cream'
    }`

  return (
    <>
      <Navbar variant="agency" initialTheme="dark" />
      <main>
        <PageMasthead
          eyebrow="OCT20FIVE Agency"
          title="Portfolio"
          description="Everything we've made — editing, design, 3D ads and web. Filter by service, or browse the lot."
          meta={`${PORTFOLIO.length} projects · ${PORTFOLIO_SERVICES.length} services`}
        >
          <div role="tablist" aria-label="Filter by service" className="-mx-6 flex gap-2.5 overflow-x-auto px-6 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:mx-0 md:flex-wrap md:overflow-visible md:px-0">
            <button role="tab" aria-selected={service === 'all'} onClick={() => setService('all')} className={pill(service === 'all')}>
              All work <span className="ml-1 opacity-60">{countByService()}</span>
            </button>
            {PORTFOLIO_SERVICES.map((s) => (
              <button key={s.slug} role="tab" aria-selected={service === s.slug} onClick={() => setService(s.slug)} className={pill(service === s.slug)}>
                {s.label} <span className="ml-1 opacity-60">{countByService(s.slug)}</span>
              </button>
            ))}
          </div>
        </PageMasthead>

        <section data-theme="light" className="bg-brand-cream py-14 md:py-20">
          <div className="container">
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div className="min-h-[3.25rem]">
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={service}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.25 }}
                  >
                    {info ? (
                      <p className="max-w-xl text-base text-brand-textSoft">
                        <span className="font-bold text-brand-black">{info.title}.</span> {info.blurb}{' '}
                        <Link href={`/agency/${info.slug}`} className="whitespace-nowrap font-bold text-brand-orange underline-offset-4 hover:underline">
                          Service details →
                        </Link>{' '}
                        <Link href={`/agency/${info.slug}#pricing`} className="whitespace-nowrap font-bold text-brand-orange underline-offset-4 hover:underline">
                          Pricing →
                        </Link>
                      </p>
                    ) : (
                      <p className="text-base text-brand-textSoft">Showing work from every service.</p>
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>

              <label className="relative block w-full md:w-72">
                <span className="sr-only">Search projects</span>
                <Search size={17} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-brand-textSoft" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search projects"
                  className="w-full rounded-full border border-brand-border bg-brand-card py-3 pl-11 pr-10 text-sm text-brand-black outline-none placeholder:text-brand-textSoft focus:border-brand-orange"
                />
                {query && (
                  <button onClick={() => setQuery('')} aria-label="Clear search" className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-textSoft hover:text-brand-black">
                    <X size={16} />
                  </button>
                )}
              </label>
            </div>

            <p className="mt-8 border-b border-brand-border pb-4 text-xs font-bold uppercase tracking-[0.2em] text-brand-textSoft" aria-live="polite">
              Showing {shown.length} of {PORTFOLIO.length} projects
            </p>

            <motion.div layout className="mt-10 grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
              <AnimatePresence mode="popLayout">
                {shown.map((item) => <Card key={item.id} item={item} />)}
              </AnimatePresence>
            </motion.div>

            {shown.length === 0 && (
              <div className="py-20 text-center">
                <p className="font-display text-2xl font-extrabold text-brand-black">No projects match “{query}”.</p>
                <button onClick={() => { setQuery(''); setService('all') }} className="btn btn-secondary mt-6">Clear filters</button>
              </div>
            )}
          </div>
        </section>

        <FinalCTA
          headline="Like what you see?"
          body="Tell us what you're making and we'll scope it together — or pick a plan and start straight away."
          primary={{ label: 'Book a call', href: service === 'all' ? '/agency/book-a-call' : links.call(service) }}
          secondary={{ label: info ? `${info.title} pricing` : 'Browse services', href: info ? `/agency/${info.slug}#pricing` : '/agency#services' }}
        />
      </main>
      <Footer />
    </>
  )
}
