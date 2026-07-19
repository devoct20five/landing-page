'use client'

import { ArrowRight, Rocket, Clock, Layers, Sparkles, Users, ShieldCheck, BadgeIndianRupee, Repeat, Film, Palette, Boxes, Code2, Compass, Atom, Clapperboard } from 'lucide-react'
import SectionWrapper from '@/components/layout/SectionWrapper'
import SectionTag from '@/components/ui/SectionTag'
import NumberBadge from '@/components/ui/NumberBadge'
import Reveal, { Stagger, StaggerItem } from '@/components/motion/Reveal'
import MagneticButton from '@/components/motion/MagneticButton'

const ICONS = { Rocket, Clock, Layers, Sparkles, Users, ShieldCheck, BadgeIndianRupee, Repeat, Film, Palette, Boxes, Code2, Compass, Atom, Clapperboard }

export default function FeaturesGrid({ theme = 'light', id, eyebrow = 'Features', headline, subline, features = [], ctaLabel, ctaHref = '/agency/get-in-touch' }) {
  return (
    <SectionWrapper theme={theme} id={id}>
      <div className="container">
        <div className="grid md:grid-cols-12 gap-10 mb-14">
          <div className="md:col-span-6">
            <Reveal><SectionTag>{eyebrow}</SectionTag></Reveal>
            <Reveal delay={0.05}>
              <h2 className="mt-6 font-display uppercase leading-[0.95] tracking-tight text-display-lg text-balance">{headline}</h2>
            </Reveal>
          </div>
          {subline && (
            <div className="md:col-span-6 flex items-end">
              <Reveal delay={0.15}><p className="text-body-lg opacity-70 max-w-lg">{subline}</p></Reveal>
            </div>
          )}
        </div>

        <Stagger className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((f, i) => {
            const Icon = ICONS[f.icon] || Sparkles
            return (
              <StaggerItem key={i}>
                <article className="brand-card h-full group">
                  <div className="flex items-center justify-between">
                    <NumberBadge n={i + 1} />
                    <div className="w-11 h-11 rounded-icon border flex items-center justify-center text-brand-orange group-hover:bg-brand-orange group-hover:text-white transition-colors" style={{ borderColor: 'var(--surface-border)' }}>
                      <Icon size={20} strokeWidth={1.7} />
                    </div>
                  </div>
                  <h3 className="mt-6 font-display text-2xl leading-tight">{f.title}</h3>
                  <p className="mt-3 opacity-70 leading-relaxed text-[0.95rem]">{f.body}</p>
                </article>
              </StaggerItem>
            )
          })}
        </Stagger>

        {ctaLabel && (
          <Reveal delay={0.3} className="mt-14 flex justify-center">
            <MagneticButton href={ctaHref} variant="primary">
              {ctaLabel} <ArrowRight size={16} />
            </MagneticButton>
          </Reveal>
        )}
      </div>
    </SectionWrapper>
  )
}
