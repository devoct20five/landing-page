'use client'

import Image from 'next/image'
import Link from 'next/link'
import {
  ArrowRight,
  Film,
  Palette,
  Boxes,
  Code2,
} from 'lucide-react'

import SectionWrapper from '@/components/layout/SectionWrapper'
import SectionTag from '@/components/ui/SectionTag'
import Reveal, {
  Stagger,
  StaggerItem,
} from '@/components/motion/Reveal'
import MagneticButton from '@/components/motion/MagneticButton'
import { AGENCY_SERVICES } from '@/data/content'

const ICONS = {
  Film,
  Palette,
  Boxes,
  Code2,
}

export default function BehindTheWork({
  theme = 'dark',
  currentSlug,
}) {
  const others = AGENCY_SERVICES.filter(
    (service) => service.slug !== currentSlug
  )

  return (
    <SectionWrapper
      theme={theme}
      id="behind"
      className="!py-20 md:!py-24"
    >
      <div className="container">

        {/* =====================================================
            MAIN FEATURE
        ===================================================== */}

        <div
          className="
            grid
            items-center
            gap-12
            lg:grid-cols-12
            lg:gap-14
          "
        >

          {/* -----------------------------------------------
              LEFT — COPY
          ----------------------------------------------- */}

          <div className="lg:col-span-4">

            <Reveal>
              <SectionTag>
                Behind the Work
              </SectionTag>
            </Reveal>

            <Reveal delay={0.05}>
              <h2
                className="
                  mt-6
                  font-display
                  text-display-xl
                  font-black
                  uppercase
                  leading-[0.78]
                  tracking-[-0.03em]
                "
              >
                IDEAS
                <span className="text-brand-orange">.</span>

                <br />

                PROCESS
                <span className="text-brand-orange">.</span>

                <br />

                IMPACT
                <span className="text-brand-orange">.</span>
              </h2>
            </Reveal>

            <Reveal delay={0.12}>
              <p
                className="
                  mt-6
                  max-w-[410px]
                  text-[0.82rem]
                  leading-[1.6]
                  text-brand-cream/70
                  md:text-[0.9rem]
                "
              >
                Great work doesn’t happen by chance. Explore
                the ideas, decisions, process, and craft that
                turn concepts into results that matter.
              </p>
            </Reveal>

            <Reveal
              delay={0.2}
              className="mt-7"
            >
              <MagneticButton
                href="/agency/behind-the-work"
                variant="ghost"
              >
                Explore Behind the Work
                <ArrowRight size={16} />
              </MagneticButton>
            </Reveal>

          </div>


          {/* -----------------------------------------------
              RIGHT — EDITORIAL WORKBOARD
          ----------------------------------------------- */}

          <div className="lg:col-span-8">

            <Reveal delay={0.1}>

              <div
                className="
                  relative
                  aspect-[1.35/1]
                  w-full
                  overflow-hidden
                  rounded-[8px]
                  bg-brand-black
                "
              >

                {/* Main image */}

                <Image
                  src="https://images.unsplash.com/photo-1602645803535-45caec9f2a3c?crop=entropy&cs=srgb&fm=jpg&q=85&w=1600"
                  alt="Creative process workspace"
                  fill
                  sizes="(max-width: 1024px) 100vw, 65vw"
                  className="
                    object-cover
                    transition-transform
                    duration-1000
                    ease-out
                    hover:scale-[1.025]
                  "
                />

                {/* Dark cinematic overlay */}

                <div
                  className="
                    absolute
                    inset-0
                    bg-gradient-to-t
                    from-brand-black/65
                    via-transparent
                    to-brand-black/10
                  "
                />

                {/* -----------------------------------------
                    FLOATING PROCESS CARDS
                ----------------------------------------- */}

                <div
                  className="
                    absolute
                    left-[7%]
                    top-[8%]
                    hidden
                    w-[25%]
                    rotate-[-3deg]
                    overflow-hidden
                    rounded-[3px]
                    shadow-[0_15px_35px_rgba(26,9,7,0.35)]
                    sm:block
                  "
                >
                  <Image
                    src="https://images.unsplash.com/photo-1604888989902-6c8d8617e02a?crop=entropy&cs=srgb&fm=jpg&q=85&w=1200"
                    alt=""
                    width={600}
                    height={400}
                    className="h-auto w-full object-cover"
                  />
                </div>

                <div
                  className="
                    absolute
                    right-[7%]
                    top-[7%]
                    w-[28%]
                    rotate-[2deg]
                    overflow-hidden
                    rounded-[3px]
                    shadow-[0_15px_35px_rgba(26,9,7,0.35)]
                  "
                >
                  <Image
                    src="https://images.unsplash.com/photo-1656588360305-095657d15c6f?crop=entropy&cs=srgb&fm=jpg&q=85&w=1200"
                    alt=""
                    width={600}
                    height={400}
                    className="h-auto w-full object-cover"
                  />
                </div>

                <div
                  className="
                    absolute
                    bottom-[8%]
                    left-[12%]
                    w-[27%]
                    rotate-[2deg]
                    overflow-hidden
                    rounded-[3px]
                    shadow-[0_15px_35px_rgba(26,9,7,0.4)]
                  "
                >
                  <Image
                    src="https://images.unsplash.com/photo-1573867607590-361ea324975e?crop=entropy&cs=srgb&fm=jpg&q=85&w=1400"
                    alt=""
                    width={700}
                    height={450}
                    className="h-auto w-full object-cover"
                  />
                </div>

                {/* Orange process note */}

                <div
                  className="
                    absolute
                    bottom-[12%]
                    right-[10%]
                    hidden
                    rotate-[-2deg]
                    bg-brand-peach
                    px-4
                    py-3
                    text-brand-black
                    shadow-[0_15px_30px_rgba(26,9,7,0.3)]
                    md:block
                  "
                >
                  <p className="text-xs font-bold uppercase tracking-[0.15em]">
                    We create.
                  </p>

                  <p className="mt-1 text-xs font-medium">
                    We concept.
                  </p>

                  <p className="text-xs font-bold text-brand-orange">
                    We deliver.
                  </p>
                </div>

              </div>

            </Reveal>

          </div>

        </div>


        {/* =====================================================
            OTHER SERVICES
        ===================================================== */}

        <div className="mt-14 md:mt-16">

          <Reveal>
            <div className="mb-5 flex items-center justify-center gap-3">

              <span
                className="
                  h-px
                  w-8
                  bg-brand-orange
                "
              />

              <p
                className="
                  text-xs
                  font-bold
                  uppercase
                  tracking-[0.12em]
                  text-brand-cream/80
                "
              >
                Explore what else we do
              </p>

              <span
                className="
                  h-px
                  w-8
                  bg-brand-orange
                "
              />

            </div>
          </Reveal>


          <Stagger
            className="
              grid
              gap-3
              sm:grid-cols-2
              lg:grid-cols-4
            "
          >
            {others.map((service) => {
              const Icon =
                ICONS[service.icon] || Film

              return (
                <StaggerItem key={service.slug}>

                  <Link
                    href={`/agency/${service.slug}`}
                    className="
                      group
                      flex
                      min-h-[120px]
                      flex-col
                      rounded-[5px]
                      border
                      border-brand-cream/10
                      bg-brand-cream/[0.015]
                      p-4
                      transition-all
                      duration-500
                      hover:-translate-y-1
                      hover:border-brand-orange/50
                      hover:bg-brand-cream/[0.035]
                    "
                  >

                    <div className="flex items-start justify-between">

                      <Icon
                        size={25}
                        strokeWidth={1.5}
                        className="
                          text-brand-orange
                        "
                      />

                      <ArrowRight
                        size={16}
                        strokeWidth={1.5}
                        className="
                          text-brand-cream/60
                          transition-transform
                          duration-500
                          group-hover:translate-x-1
                          group-hover:text-brand-orange
                        "
                      />

                    </div>

                    <div className="mt-auto">

                      <h4
                        className="
                          mt-4
                          font-display
                          text-[1.05rem]
                          font-black
                          uppercase
                          leading-none
                        "
                      >
                        {service.title}
                      </h4>

                      <p
                        className="
                          mt-2
                          max-w-[190px]
                          text-xs
                          leading-[1.45]
                          text-brand-cream/55
                        "
                      >
                        {service.blurb}
                      </p>

                    </div>

                  </Link>

                </StaggerItem>
              )
            })}
          </Stagger>

        </div>

      </div>
    </SectionWrapper>
  )
}