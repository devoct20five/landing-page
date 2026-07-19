'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'
import Image from 'next/image'
import { ChevronDown } from 'lucide-react'
import SectionTag from '@/components/ui/SectionTag'

// Hero – Dark theme, full-bleed image, huge display title, tagline row.
export default function Hero({ eyebrow, headline, subline, image, imageAlt = '', showScrollCue = true, taglineRow, script, kicker }) {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.25])
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '25%'])
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0.2])

  const words = (headline || '').split(' ')

  return (
    <section data-theme="dark" className="section theme-dark relative min-h-[100svh] flex items-end overflow-hidden pt-32 pb-16">
      {/* BG image */}
      <motion.div style={{ scale, y }} className="absolute inset-0 z-0">
        {image && (
          <Image
            src={image}
            alt={imageAlt || headline || 'OCT20FIVE hero'}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-brand-dark/70 via-brand-dark/40 to-brand-dark" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,90,31,0.25),transparent_60%)]" />
      </motion.div>

      <div ref={ref} className="container relative z-10">
        <motion.div style={{ opacity }} className="max-w-6xl">
          {script && (
            <motion.p initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
              className="font-display italic text-brand-orange text-2xl md:text-4xl mb-4 tracking-tight">
              {script}
            </motion.p>
          )}

          {eyebrow && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.25 }} className="mb-6">
              <SectionTag>{eyebrow}</SectionTag>
            </motion.div>
          )}

          <h1 className="font-display uppercase leading-[0.9] tracking-tight text-[clamp(3rem,10vw,10.5rem)] font-black text-balance">
            {words.map((w, i) => (
              <motion.span
                key={i}
                initial={{ y: '110%', opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 1, delay: 0.3 + i * 0.06, ease: [0.22, 1, 0.36, 1] }}
                className="inline-block mr-[0.22em] leading-[0.9]"
              >
                {w}
              </motion.span>
            ))}
          </h1>

          {subline && (
            <motion.p
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.9, ease: [0.22, 1, 0.36, 1] }}
              className="mt-8 font-display uppercase tracking-[0.25em] text-sm md:text-base text-brand-orange"
            >
              {subline}
            </motion.p>
          )}

          {taglineRow && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 1.05, ease: [0.22, 1, 0.36, 1] }}
              className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-2 text-lg md:text-2xl font-display tracking-tight">
              {taglineRow.map((t, i) => (
                <span key={i} className="inline-flex items-center gap-6">
                  <span>{t}</span>
                  {i < taglineRow.length - 1 && <span className="opacity-40">/</span>}
                </span>
              ))}
            </motion.div>
          )}

          {kicker && (
            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 1.1 }}
              className="mt-8 max-w-2xl text-body-lg opacity-80">{kicker}</motion.p>
          )}
        </motion.div>

        {showScrollCue && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.6, duration: 1 }}
            className="absolute right-6 bottom-8 md:right-10 md:bottom-10 flex flex-col items-center gap-3"
          >
            <span className="text-xs tracking-[0.3em] uppercase opacity-70">Scroll</span>
            <motion.span animate={{ y: [0, 10, 0] }} transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}>
              <ChevronDown size={22} className="text-brand-orange" />
            </motion.span>
          </motion.div>
        )}
      </div>
    </section>
  )
}
