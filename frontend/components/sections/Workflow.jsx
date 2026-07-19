'use client'

import { ArrowRight } from 'lucide-react'
import SectionWrapper from '@/components/layout/SectionWrapper'
import SectionTag from '@/components/ui/SectionTag'
import NumberBadge from '@/components/ui/NumberBadge'
import Reveal, { Stagger, StaggerItem } from '@/components/motion/Reveal'
import MagneticButton from '@/components/motion/MagneticButton'

export default function Workflow({ theme = 'light', headline, subline, steps = [], ctaLabel = 'Start a project', ctaHref = '/agency/get-in-touch' }) {
  return (
    <SectionWrapper theme={theme}>
      <div className="container">
        <div className="max-w-4xl">
          <Reveal><SectionTag>Workflow</SectionTag></Reveal>
          <Reveal delay={0.05}>
            <h2 className="mt-6 font-display uppercase leading-[0.95] tracking-tight text-display-lg text-balance">{headline}</h2>
          </Reveal>
          {subline && (
            <Reveal delay={0.15}><p className="mt-6 text-body-lg opacity-70 max-w-2xl">{subline}</p></Reveal>
          )}
        </div>

        <Stagger className="mt-16 grid md:grid-cols-3 gap-6 md:gap-4 relative">
          {steps.map((s, i) => (
            <StaggerItem key={i} className="relative">
              <div className="brand-card h-full">
                <NumberBadge n={i + 1} />
                <h3 className="mt-6 font-display text-2xl md:text-3xl leading-tight">{s.title}</h3>
                <p className="mt-3 opacity-70 leading-relaxed">{s.body}</p>
              </div>
              {i < steps.length - 1 && (
                <div className="hidden md:block absolute top-[3rem] -right-3 z-10">
                  <ArrowRight className="text-brand-orange" size={24} />
                </div>
              )}
            </StaggerItem>
          ))}
        </Stagger>

        <Reveal delay={0.3} className="mt-14 flex justify-center">
          <MagneticButton href={ctaHref} variant="primary">
            {ctaLabel} <ArrowRight size={16} />
          </MagneticButton>
        </Reveal>
      </div>
    </SectionWrapper>
  )
}
