'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import SectionWrapper from '@/components/layout/SectionWrapper'
import SectionTag from '@/components/ui/SectionTag'
import Reveal from '@/components/motion/Reveal'

const EASE = [0.22, 1, 0.36, 1]

/**
 * Work gallery — one tab per tier, a bento grid of large tiles.
 * Tiles are deliberately NOT links: the portfolio items have no case-study
 * pages yet, and a clickable tile that goes nowhere is worse than a plain one.
 * Pass `href` on a card (a real URL) to make that tile clickable.
 */
export default function WorkGallery({ eyebrow = 'Our work', headline, collections = [], ctaHref = '#pricing', portfolioHref, portfolioLabel = 'View all work', portfolioCount }) {
  const [tab, setTab] = useState(0)
  if (!collections.length) return null
  const active = collections[tab]
  const cards = active.cards || []
  const n = cards.length
  const wideTiles = new Set(
    { 3: [0], 2: [0, n - 1], 1: [0, n - 2, n - 1] }[n % 4] || []
  )

  return (
    <SectionWrapper id="work" theme="light">
      <div className="container">
        <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
          <div className="max-w-3xl">
            <Reveal><SectionTag>{eyebrow}</SectionTag></Reveal>
            <Reveal delay={0.05}>
              <h2 className="mt-6 font-display text-display-lg font-black uppercase leading-[0.98] tracking-[-0.02em] text-brand-black text-balance">
                {headline}
              </h2>
            </Reveal>
          </div>

          {collections.length > 1 && (
            <Reveal delay={0.1}>
              <div role="tablist" className="inline-flex rounded-full border border-brand-border bg-brand-card p-1.5">
                {collections.map((c, i) => (
                  <button
                    key={c.id || c.title}
                    role="tab"
                    aria-selected={i === tab}
                    onClick={() => setTab(i)}
                    className={`relative rounded-full px-5 py-2.5 text-sm font-bold transition-colors ${
                      i === tab ? 'text-brand-cream' : 'text-brand-textSoft hover:text-brand-black'
                    }`}
                  >
                    {i === tab && (
                      <motion.span layoutId="work-pill" className="absolute inset-0 rounded-full bg-brand-black" transition={{ duration: 0.35, ease: EASE }} />
                    )}
                    <span className="relative">{c.title}</span>
                  </button>
                ))}
              </div>
            </Reveal>
          )}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={tab}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.4, ease: EASE }}
            className="mt-14 grid auto-rows-[200px] grid-cols-2 gap-4 sm:auto-rows-[260px] md:auto-rows-[300px] lg:grid-cols-4 lg:gap-5"
          >
            {cards.map((card, i) => {
              // Bento: on a 4-column grid, widen just enough tiles so every row fills
              // exactly (no gaps) for any tile count.
              const wide = wideTiles.has(i)
              const span = wide ? 'col-span-2' : ''
              const Tag = card.href ? Link : 'div'
              return (
                <Tag
                  key={card.id || i}
                  {...(card.href ? { href: card.href } : {})}
                  className={`group relative overflow-hidden rounded-[1.5rem] bg-brand-black ${span}`}
                >
                  {card.image && (
                    <Image
                      src={card.image}
                      alt={card.title}
                      fill
                      sizes="(min-width:1024px) 25vw, 50vw"
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-brand-black/85 via-brand-black/10 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-5 md:p-6">
                    <p className="font-display text-lg font-black uppercase leading-none tracking-tight text-brand-cream md:text-xl">
                      {card.title}
                    </p>
                    {card.subtitle && <p className="mt-1.5 text-sm text-brand-cream/70">{card.subtitle}</p>}
                  </div>
                </Tag>
              )
            })}
          </motion.div>
        </AnimatePresence>

        <Reveal className="mt-12 flex flex-wrap items-center justify-center gap-3">
          {portfolioHref && (
            <Link href={portfolioHref} className="btn btn-primary">
              {portfolioLabel}
              {portfolioCount ? <span className="rounded-full bg-brand-cream/20 px-2 py-0.5 text-xs">{portfolioCount}</span> : null}
              <ArrowRight size={16} />
            </Link>
          )}
          <Link href={ctaHref} className="btn btn-secondary">
            See plans & pricing
          </Link>
        </Reveal>
      </div>
    </SectionWrapper>
  )
}
