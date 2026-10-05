'use client'

import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import SectionWrapper from '@/components/layout/SectionWrapper'
import SectionTag from '@/components/ui/SectionTag'
import Reveal, { Stagger, StaggerItem } from '@/components/motion/Reveal'

/** Three-step process — oversized outlined numerals, the brand book's section device. */
export default function ProcessSteps({ headline, subline, steps = [], ctaLabel = 'Book a call', ctaHref }) {
  return (
    <SectionWrapper id="process" theme="dark" clip>
      <div className="container relative">
        <div className="max-w-3xl">
          <Reveal><SectionTag>Process</SectionTag></Reveal>
          <Reveal delay={0.05}>
            <h2 className="mt-6 font-display text-[clamp(2.4rem,5vw,4.5rem)] font-black uppercase leading-[0.98] tracking-[-0.02em] text-brand-cream text-balance">
              {headline}
            </h2>
          </Reveal>
          {subline && (
            <Reveal delay={0.1}>
              <p className="mt-6 max-w-xl text-base leading-relaxed text-brand-cream/70 md:text-lg">{subline}</p>
            </Reveal>
          )}
        </div>

        <Stagger className="relative mt-16 grid gap-5 md:grid-cols-3">
          {/* connecting hairline */}
          <div className="pointer-events-none absolute left-0 right-0 top-[3.25rem] hidden h-px bg-gradient-to-r from-transparent via-brand-orange/50 to-transparent md:block" />
          {steps.map((s, i) => (
            <StaggerItem key={s.title}>
              <div className="relative h-full rounded-card border border-brand-cream/10 bg-brand-blackSoft p-8 md:p-9">
                <span className="font-display text-[5rem] font-black leading-none text-outline">{String(i + 1).padStart(2, '0')}</span>
                <h3 className="mt-6 font-display text-2xl font-black uppercase leading-tight tracking-tight text-brand-cream">{s.title}</h3>
                <p className="mt-3 leading-relaxed text-brand-cream/70">{s.body}</p>
              </div>
            </StaggerItem>
          ))}
        </Stagger>

        <Reveal className="mt-14">
          <Link href={ctaHref} className="btn btn-primary">
            {ctaLabel} <ArrowRight size={16} />
          </Link>
        </Reveal>
      </div>
    </SectionWrapper>
  )
}
