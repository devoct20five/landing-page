'use client'

import SectionWrapper from '@/components/layout/SectionWrapper'
import SectionTag from '@/components/ui/SectionTag'
import Reveal, { Stagger, StaggerItem } from '@/components/motion/Reveal'
import { iconFor } from './icons'

/** "Why us" grid. Dark text on warm cards — readable by construction. */
export default function WhyUs({ reasons = [], title = 'Why teams pick us' }) {
  return (
    <SectionWrapper id="why" theme="light">
      <div className="container">
        <div className="mx-auto max-w-3xl text-center">
          <Reveal><SectionTag>Why OCT20FIVE</SectionTag></Reveal>
          <Reveal delay={0.05}>
            <h2 className="mt-6 font-display text-display-lg font-black uppercase leading-[0.98] tracking-[-0.02em] text-brand-black text-balance">
              {title}
            </h2>
          </Reveal>
        </div>

        <Stagger className="mt-16 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {reasons.map((r, i) => {
            const Icon = iconFor(r.icon)
            return (
              <StaggerItem key={r.title}>
                <div className="group h-full rounded-card border border-brand-border bg-brand-card p-8 transition-all duration-500 hover:-translate-y-1.5 hover:border-brand-orange/50 hover:shadow-medium">
                  <div className="flex items-start justify-between">
                    <span className="flex h-14 w-14 items-center justify-center rounded-tile border border-brand-border bg-gradient-to-br from-brand-peach to-brand-creamSoft shadow-soft">
                      <Icon size={24} strokeWidth={1.6} className="text-brand-orange" />
                    </span>
                    <span className="font-display text-3xl font-black text-outline-ink">{String(i + 1).padStart(2, '0')}</span>
                  </div>
                  <h3 className="mt-7 font-display text-xl font-black uppercase leading-tight tracking-tight text-brand-black">{r.title}</h3>
                  <p className="mt-3 leading-relaxed text-brand-textSoft">{r.body}</p>
                </div>
              </StaggerItem>
            )
          })}
        </Stagger>
      </div>
    </SectionWrapper>
  )
}
