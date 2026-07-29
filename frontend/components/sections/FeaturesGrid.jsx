'use client'

import {
  ArrowRight,
  Rocket,
  Clock,
  Layers,
  Sparkles,
  Users,
  ShieldCheck,
  BadgeIndianRupee,
  Repeat,
  Film,
  Palette,
  Boxes,
  Code2,
  Compass,
  Atom,
  Clapperboard,
} from 'lucide-react'

import SectionWrapper from '@/components/layout/SectionWrapper'
import SectionTag from '@/components/ui/SectionTag'
import Reveal, {
  Stagger,
  StaggerItem,
} from '@/components/motion/Reveal'
import MagneticButton from '@/components/motion/MagneticButton'

const ICONS = {
  Rocket,
  Clock,
  Layers,
  Sparkles,
  Users,
  ShieldCheck,
  BadgeIndianRupee,
  Repeat,
  Film,
  Palette,
  Boxes,
  Code2,
  Compass,
  Atom,
  Clapperboard,
}

export default function FeaturesGrid({
  theme = 'light',
  id,
  eyebrow = 'Features',
  headline,
  subline,
  features = [],
  ctaLabel,
  ctaHref = '/agency/get-in-touch',
}) {
  return (
    <SectionWrapper
      theme={theme}
      id={id}
      className="!py-20 md:!py-24"
    >
      <div className="container">

        {/* =========================================
            HEADER
        ========================================= */}

        <div className="mx-auto max-w-[760px] text-center">

          <Reveal>
            <div className="flex justify-center">
              <SectionTag>{eyebrow}</SectionTag>
            </div>
          </Reveal>

          <Reveal delay={0.05}>
            <h2
              className="
                mt-6
                font-display
                text-[clamp(3rem,6vw,5.5rem)]
                font-black
                uppercase
                leading-[0.84]
                tracking-[-0.055em]
                text-balance
              "
            >
              {headline}
            </h2>
          </Reveal>

          {subline && (
            <Reveal delay={0.1}>
              <p
                className="
                  mx-auto
                  mt-5
                  max-w-[600px]
                  text-[0.8rem]
                  leading-[1.55]
                  text-black/65
                  md:text-[0.9rem]
                "
              >
                {subline}
              </p>
            </Reveal>
          )}

        </div>


        {/* =========================================
            FEATURE GRID
        ========================================= */}

        <Stagger
          className="
            mx-auto
            mt-10
            grid
            max-w-[1080px]
            grid-cols-1
            gap-2
            sm:grid-cols-2
            lg:grid-cols-3
          "
        >
          {features.slice(0, 6).map((feature, i) => {
            const Icon = ICONS[feature.icon] || Sparkles

            return (
              <StaggerItem key={feature.id || i}>

                <article
                  className="
                    group
                    relative
                    flex
                    min-h-[165px]
                    gap-4
                    rounded-[9px]
                    border
                    bg-white
                    p-5
                    transition-all
                    duration-500
                    ease-smooth
                    hover:-translate-y-1
                    hover:border-brand-orange
                    hover:shadow-[0_18px_45px_rgba(0,0,0,0.08)]
                    md:min-h-[175px]
                    md:p-6
                  "
                  style={{
                    borderColor: 'var(--surface-border)',
                  }}
                >

                  {/* ---------------------------------
                      ICON
                  --------------------------------- */}

                  <div
                    className="
                      flex
                      h-[58px]
                      w-[58px]
                      shrink-0
                      items-center
                      justify-center
                    "
                  >
                    <Icon
                      size={42}
                      strokeWidth={1.25}
                      className="
                        text-brand-orange
                        transition-transform
                        duration-500
                        group-hover:scale-105
                      "
                    />
                  </div>


                  {/* ---------------------------------
                      CONTENT
                  --------------------------------- */}

                  <div className="min-w-0">

                    {/* Number */}

                    <div
                      className="
                        text-[9px]
                        font-bold
                        uppercase
                        tracking-[0.08em]
                        text-brand-orange
                      "
                    >
                      {String(i + 1).padStart(2, '0')}.
                    </div>


                    {/* Title */}

                    <h3
                      className="
                        mt-1
                        font-display
                        text-[1rem]
                        font-black
                        uppercase
                        leading-[0.95]
                        tracking-[-0.025em]
                        md:text-[1.08rem]
                      "
                    >
                      {feature.title}
                    </h3>


                    {/* Body */}

                    <p
                      className="
                        mt-2
                        max-w-[235px]
                        text-[0.66rem]
                        font-medium
                        leading-[1.45]
                        text-black/65
                        md:text-[0.7rem]
                      "
                    >
                      {feature.body}
                    </p>

                  </div>

                </article>

              </StaggerItem>
            )
          })}
        </Stagger>


        {/* =========================================
            CTA
        ========================================= */}

        {ctaLabel && (
          <Reveal
            delay={0.25}
            className="mt-7 flex justify-center"
          >
            <MagneticButton
              href={ctaHref}
              variant="primary"
            >
              {ctaLabel}
              <ArrowRight size={15} />
            </MagneticButton>
          </Reveal>
        )}

      </div>
    </SectionWrapper>
  )
}