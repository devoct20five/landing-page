'use client'

import Link from 'next/link'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'
import Image from 'next/image'
import { ArrowRight, ChevronDown, Compass, Clapperboard, Atom, Rocket, Lock } from 'lucide-react'
import Navbar from '@/components/navigation/Navbar'
import Footer from '@/components/layout/Footer'
import SectionWrapper from '@/components/layout/SectionWrapper'
import SectionTag from '@/components/ui/SectionTag'
import Reveal, { Stagger, StaggerItem } from '@/components/motion/Reveal'
import { HOME_VERTICALS } from '@/data/content'

const ICONS = { Compass, Clapperboard, Atom, Rocket }
const ACCENT = {
  orange: 'text-brand-orange',
  yellow: 'text-yellow-300',
  red: 'text-red-400',
  purple: 'text-purple-300',
}

function HomeHero() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.22])
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '30%'])

  return (
    <section data-theme="dark" ref={ref} className="section theme-dark relative min-h-[100svh] flex items-center overflow-hidden pt-24">
      <motion.div style={{ scale, y }} className="absolute inset-0 z-0">
        <Image src="https://images.unsplash.com/photo-1655195215404-a89325e7dd3e?crop=entropy&cs=srgb&fm=jpg&q=85&w=2600" alt="OCT20FIVE cinematic hero" fill priority sizes="100vw" className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-brand-dark/60 via-brand-dark/50 to-brand-dark" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_60%,rgba(255,90,31,0.35),transparent_60%)]" />
      </motion.div>

      <div className="container relative z-10 text-center">
        <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
          className="font-display italic text-brand-orange text-3xl md:text-5xl tracking-tight mb-2">
          Showcase
        </motion.p>

        <h1 className="font-display uppercase font-black leading-[0.85] tracking-tight text-[clamp(3.5rem,15vw,15rem)]">
          <span className="block overflow-hidden">
            <motion.span initial={{ y: '105%' }} animate={{ y: 0 }} transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1], delay: 0.25 }} className="inline-block">
              OCT20FIVE
            </motion.span>
          </span>
        </h1>

        <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.7 }}
          className="mt-6 font-display uppercase tracking-[0.3em] text-xs md:text-sm text-brand-orange">
          A Creative Ecosystem
        </motion.p>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.9 }}
          className="mt-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-lg md:text-3xl font-display tracking-tight uppercase">
          <span>We Create.</span>
          <span className="opacity-40">/</span>
          <span>We Build.</span>
          <span className="opacity-40">/</span>
          <span className="text-brand-orange">We Evolve.</span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.6, duration: 1 }}
          className="absolute left-1/2 -translate-x-1/2 bottom-8 flex flex-col items-center gap-3"
        >
          <span className="text-[0.65rem] tracking-[0.35em] uppercase opacity-60">Scroll to explore</span>
          <motion.span animate={{ y: [0, 10, 0] }} transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}>
            <ChevronDown size={20} className="text-brand-orange" />
          </motion.span>
        </motion.div>
      </div>
    </section>
  )
}

export default function HomePage() {
  return (
    <>
      <Navbar variant="utility" initialTheme="dark" />
      <main>
        <HomeHero />

        {/* Ecosystem grid — Home section 2 (light) per plan §3 */}
        <SectionWrapper theme="light">
          <div className="container">
            <div className="text-center max-w-4xl mx-auto">
              <Reveal><SectionTag>OCT20FIVE</SectionTag></Reveal>
              <Reveal delay={0.05}>
                <h2 className="mt-6 font-display uppercase leading-[0.95] tracking-tight text-display-xl text-balance">
                  A creative ecosystem <span className="text-brand-orange">built for the future.</span>
                </h2>
              </Reveal>
              <Reveal delay={0.12}>
                <p className="mt-6 text-body-lg opacity-70 max-w-2xl mx-auto">
                  Four verticals. One mission. Concept. Create. Deliver.
                </p>
              </Reveal>
            </div>

            <Stagger className="mt-16 grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {HOME_VERTICALS.map((v) => {
                const Icon = ICONS[v.icon] || Compass
                const inner = (
                  <article className={`brand-card h-full group relative ${v.locked ? 'opacity-90' : ''}`}>
                    <div className={`w-14 h-14 rounded-icon border flex items-center justify-center ${ACCENT[v.accent] || 'text-brand-orange'}`} style={{ borderColor: 'var(--surface-border)' }}>
                      <Icon size={24} strokeWidth={1.6} />
                    </div>
                    <div className="mt-6 flex items-center gap-2">
                      <h3 className="font-display text-2xl uppercase leading-tight">{v.title}</h3>
                      <span className={`text-[0.65rem] font-semibold tracking-[0.2em] px-2 py-0.5 rounded-full ${v.tag === 'LIVE' ? 'bg-brand-orange text-white' : 'bg-black/5 text-current opacity-60'}`}>{v.tag}</span>
                    </div>
                    <p className="mt-3 opacity-70 text-[0.95rem] leading-relaxed">{v.body}</p>
                    <div className="mt-8 flex items-center gap-2 text-sm font-semibold">
                      {v.locked ? (
                        <span className="inline-flex items-center gap-2 opacity-60"><Lock size={14} /> Explore TBA</span>
                      ) : (
                        <span className="inline-flex items-center gap-2 text-brand-orange">Explore Agency <ArrowRight size={16} className="transition-transform duration-500 ease-apple group-hover:translate-x-2" /></span>
                      )}
                    </div>
                  </article>
                )
                return (
                  <StaggerItem key={v.title}>
                    {v.href && !v.locked ? <Link href={v.href}>{inner}</Link> : inner}
                  </StaggerItem>
                )
              })}
            </Stagger>
          </div>
        </SectionWrapper>
      </main>
      <Footer />
    </>
  )
}
