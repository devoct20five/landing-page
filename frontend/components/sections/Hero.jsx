'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'
import Image from 'next/image'
import { ChevronDown } from 'lucide-react'
import Eclipse from '@/components/brands/Eclipse'

const EASE = [0.22, 1, 0.36, 1]

/**
 * Shared page hero — brand book layout language:
 * dark #1A0907 field + Eclipse glow, left-aligned heavy uppercase title,
 * Satoshi body, orange hairline footer.
 *
 * Props
 *  eyebrow     small orange label above the title
 *  headline    string (wrapped word-by-word) or ReactNode
 *  description optional supporting paragraph (Satoshi)
 *  subline     "CONCEPT. CREATE. DELIVER." → rendered with orange full stops
 *  actions     optional buttons (ReactNode)
 *  chips       optional short facts shown as pills under the actions
 *  image       optional photo, shown as a quiet monochrome texture under the glow
 */
export default function Hero({
  eyebrow = 'OCT20FIVE',
  headline = '',
  description,
  subline,
  actions,
  chips,
  chipsLabel = 'Built for',
  image,
  imageAlt = '',
  showScrollCue = true,
}) {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  })
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.1])
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '8%'])
  const contentOpacity = useTransform(scrollYProgress, [0, 0.65, 1], [1, 1, 0])

  const words = typeof headline === 'string' ? headline.trim().split(/\s+/) : null
  const tokens = subline
    ? subline.split(/\s*[./]\s*/).map((t) => t.trim()).filter(Boolean)
    : []

  return (
    <section
      ref={ref}
      data-theme="dark"
      className="theme-dark relative min-h-[100svh] w-full overflow-hidden bg-brand-black text-brand-cream"
    >
      {/* BACKGROUND */}
      <motion.div style={{ scale, y }} className="absolute inset-0 z-0">
        {image && (
          <Image
            src={image}
            alt={imageAlt}
            fill
            priority
            sizes="100vw"
            className="object-cover object-center opacity-25 mix-blend-luminosity grayscale"
          />
        )}
        <Eclipse bare={!!image} />
      </motion.div>

      {/* CONTENT */}
      <motion.div
        style={{ opacity: contentOpacity }}
        className="container relative z-10 flex min-h-[100svh] flex-col justify-center pb-28 pt-36"
      >
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: EASE }}
          className="mb-7 flex items-center gap-4 text-xs font-bold uppercase tracking-[0.3em] text-brand-orange md:mb-9 md:text-sm"
        >
          <span className="h-px w-10 bg-brand-orange" />
          {eyebrow}
        </motion.div>

        <h1 className="max-w-[16ch] font-display text-hero font-black uppercase leading-[0.92] tracking-[-0.02em] text-brand-cream text-balance sm:max-w-[18ch]">
          {words
            ? words.map((w, i) => (
                <span key={i} className="mr-[0.22em] inline-block overflow-hidden align-bottom">
                  <motion.span
                    initial={{ y: '110%' }}
                    animate={{ y: 0 }}
                    transition={{ duration: 0.9, delay: 0.3 + i * 0.07, ease: EASE }}
                    className="inline-block"
                  >
                    {w}
                  </motion.span>
                </span>
              ))
            : headline}
        </h1>

        {description && (
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.85, ease: EASE }}
            className="mt-8 max-w-xl text-base leading-relaxed text-brand-cream/70 md:text-lg"
          >
            {description}
          </motion.p>
        )}

        {tokens.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.95, ease: EASE }}
            className="mt-8 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-medium uppercase tracking-[0.28em] text-brand-cream/90 md:text-sm"
          >
            {tokens.map((t, i) => (
              <span key={i} className="inline-flex items-center gap-3">
                {t}
                <span className="text-brand-orange">.</span>
              </span>
            ))}
          </motion.div>
        )}

        {actions && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 1.1, ease: EASE }}
            className="mt-10 flex flex-wrap items-center gap-3"
          >
            {actions}
          </motion.div>
        )}

        {chips?.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 1.25, ease: EASE }}
            className="mt-10 flex flex-wrap items-center gap-2.5"
          >
            <span className="mr-1 text-xs font-bold uppercase tracking-[0.25em] text-brand-cream/50">{chipsLabel}</span>
            {chips.map((c) => (
              <span key={c} className="rounded-full border border-brand-cream/20 bg-brand-cream/[0.06] px-4 py-1.5 text-sm font-medium text-brand-cream/90 backdrop-blur">
                {c}
              </span>
            ))}
          </motion.div>
        )}
      </motion.div>

      {/* FOOTER HAIRLINE — echoes the orange rule + page number on every brand-book slide */}
      {showScrollCue && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
          className="absolute inset-x-0 bottom-7 z-20 md:bottom-9"
        >
          <div className="container flex items-center gap-4">
            <span className="h-px flex-1 bg-brand-orange/60" />
            <span className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.3em] text-brand-cream/70">
              Scroll
              <motion.span
                animate={{ y: [0, 5, 0] }}
                transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
                className="inline-flex"
              >
                <ChevronDown size={16} strokeWidth={1.6} className="text-brand-orange" />
              </motion.span>
            </span>
          </div>
        </motion.div>
      )}
    </section>
  )
}
