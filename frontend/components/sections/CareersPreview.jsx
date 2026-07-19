'use client'

import { ArrowRight } from 'lucide-react'
import SectionWrapper from '@/components/layout/SectionWrapper'
import SectionTag from '@/components/ui/SectionTag'
import Reveal from '@/components/motion/Reveal'
import MagneticButton from '@/components/motion/MagneticButton'

export default function CareersPreview() {
  return (
    <SectionWrapper theme="dark" className="!pt-4">
      <div className="container">
        <div className="rounded-card border p-10 md:p-16 relative overflow-hidden" style={{ borderColor: 'var(--surface-border)' }}>
          <div className="absolute -right-24 -top-24 w-[400px] h-[400px] bg-radial-orange blur-3xl opacity-70" />
          <div className="relative grid md:grid-cols-12 gap-8 items-end">
            <div className="md:col-span-8">
              <Reveal><SectionTag>Careers</SectionTag></Reveal>
              <Reveal delay={0.05}>
                <h2 className="mt-6 font-display uppercase leading-[0.95] tracking-tight text-display-lg text-balance">
                  Good at what you do? <br /> <span className="text-brand-orange">Come do it</span> with us.
                </h2>
              </Reveal>
              <Reveal delay={0.12}>
                <p className="mt-6 max-w-xl opacity-75">We’re always open to meeting talented people who care about the work, bring something different to the table, and want to build something worth being part of.</p>
              </Reveal>
            </div>
            <div className="md:col-span-4 md:justify-self-end">
              <Reveal delay={0.2}>
                <MagneticButton href="/agency/careers" variant="primary">Explore careers <ArrowRight size={16} /></MagneticButton>
              </Reveal>
            </div>
          </div>
        </div>
      </div>
    </SectionWrapper>
  )
}
