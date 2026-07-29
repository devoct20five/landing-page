'use client'

import { ArrowRight } from 'lucide-react'
import SectionWrapper from '@/components/layout/SectionWrapper'
import SectionTag from '@/components/ui/SectionTag'
import Reveal, { Stagger, StaggerItem } from '@/components/motion/Reveal'
import MagneticButton from '@/components/motion/MagneticButton'

export default function Workflow({
  theme = 'light',
  headline,
  subline,
  steps = [],
  ctaLabel = 'Book a call',
  ctaHref = '/agency/get-in-touch',
}) {
  return (
    <SectionWrapper theme={theme}>
      <div className="container">
        {/* Header */}
        <div className="mx-auto max-w-3xl text-center">
          <Reveal>
            <SectionTag>Workflow</SectionTag>
          </Reveal>

          <Reveal delay={0.05}>
            <h2 className="mx-auto mt-5 max-w-2xl font-display text-display-lg uppercase leading-[0.88] tracking-[-0.04em] text-balance">
              {headline}
            </h2>
          </Reveal>

          {subline && (
            <Reveal delay={0.1}>
              <p className="mx-auto mt-5 max-w-xl text-sm leading-[1.45] opacity-70 md:text-base">
                {subline}
              </p>
            </Reveal>
          )}
        </div>

        {/* Workflow */}
        <Stagger className="mx-auto mt-12 grid max-w-6xl gap-3 md:grid-cols-3 md:gap-4">
          {steps.map((step, i) => (
            <StaggerItem key={i} className="relative">
              <div
                className="
                  group relative flex min-h-[108px] items-center
                  rounded-2xl border border-black/[0.08]
                  bg-white px-5 py-5
                  shadow-[0_2px_12px_rgba(0,0,0,0.04)]
                  transition-all duration-300
                  hover:-translate-y-0.5
                  hover:shadow-[0_8px_24px_rgba(0,0,0,0.07)]
                  md:px-5
                "
              >
                {/* Number */}
                <div
                  className="
                    shrink-0 font-display text-[3.2rem]
                    font-semibold leading-none tracking-[-0.06em]
                    md:text-[3.5rem]
                  "
                >
                  {String(i + 1).padStart(2, '0')}
                </div>

                {/* Content */}
                <div className="ml-5 min-w-0">
                  <h3 className="font-display text-[11px] font-semibold uppercase leading-tight tracking-tight md:text-xs">
                    {step.title}
                  </h3>

                  <p className="mt-2 max-w-[220px] text-[10px] leading-[1.45] opacity-65 md:text-[11px]">
                    {step.body}
                  </p>
                </div>
              </div>

              {/* Connector */}
              {i < steps.length - 1 && (
                <div
                  className="
                    pointer-events-none absolute
                    right-[-15px] top-1/2 z-20
                    hidden h-8 w-8 -translate-y-1/2
                    items-center justify-center
                    rounded-full border border-black/[0.08]
                    bg-white shadow-sm
                    md:flex
                  "
                >
                  <ArrowRight
                    size={15}
                    strokeWidth={1.8}
                    className="text-brand-orange"
                  />
                </div>
              )}
            </StaggerItem>
          ))}
        </Stagger>

        {/* CTA */}
        <Reveal delay={0.25}>
          <div className="mt-7 flex justify-center">
            <MagneticButton
              href={ctaHref}
              variant="primary"
              className="!rounded-full !px-5 !py-2.5 text-[11px] uppercase tracking-wide"
            >
              {ctaLabel}
              <ArrowRight size={14} />
            </MagneticButton>
          </div>
        </Reveal>
      </div>
    </SectionWrapper>
  )
}