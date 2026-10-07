'use client'

import Link from 'next/link'
import {
  ArrowRight,
  Phone,
  Pencil,
} from 'lucide-react'

import SectionWrapper from '@/components/layout/SectionWrapper'
import SectionTag from '@/components/ui/SectionTag'
import Reveal, {
  Stagger,
  StaggerItem,
} from '@/components/motion/Reveal'

export default function GetInTouchCTA({
  theme = 'light',
}) {
  return (
    <SectionWrapper
      theme={theme}
      className="
        relative
        overflow-hidden
        !py-20
        md:!py-24
      "
    >

      {/* =========================================
          SUBTLE WARM ATMOSPHERE
      ========================================= */}

      <div
        className="
          pointer-events-none
          absolute
          bottom-[-180px]
          left-[-120px]
          h-[380px]
          w-[380px]
          rounded-full
          bg-brand-orange/[0.07]
          blur-[100px]
        "
      />

      <div className="container relative z-10">

        <div
          className="
            grid
            items-center
            gap-12
            lg:grid-cols-12
            lg:gap-16
          "
        >

          {/* =================================================
              LEFT — MESSAGE
          ================================================= */}

          <div className="lg:col-span-6">

            <Reveal>
              <SectionTag>
                Get in touch
              </SectionTag>
            </Reveal>


            <Reveal delay={0.05}>
              <h2
                className="
                  mt-7
                  max-w-[620px]
                  font-display
                  text-display-xl
                  font-black
                  uppercase
                  leading-[0.82]
                  tracking-[-0.03em]
                "
              >
                READY TO START
                <span className="text-brand-orange">?</span>

                <br />

                OR STILL FIGURING IT OUT
                <span className="text-brand-orange">?</span>
              </h2>
            </Reveal>


            <Reveal delay={0.12}>
              <p
                className="
                  mt-6
                  max-w-[450px]
                  text-[0.82rem]
                  leading-[1.65]
                  text-brand-black/70
                  md:text-[0.9rem]
                "
              >
                Either works. Book a call if you’re ready to
                talk—or send us what you have so far.
              </p>
            </Reveal>

          </div>


          {/* =================================================
              RIGHT — TWO OPTIONS
          ================================================= */}

          <div className="lg:col-span-6">

            <Stagger
              className="
                grid
                gap-4
                sm:grid-cols-2
              "
            >

              {/* -------------------------------------------
                  READY TO TALK
              ------------------------------------------- */}

              <StaggerItem>

                <Link
                  href="/agency/book-a-call"
                  className="
                    group
                    flex
                    min-h-[280px]
                    flex-col
                    rounded-[9px]
                    border
                    border-brand-orange/40
                    bg-brand-card
                    p-5
                    transition-all
                    duration-500
                    hover:-translate-y-1.5
                    hover:border-brand-orange
                    hover:shadow-[0_25px_60px_rgba(26,9,7,0.08)]
                    md:p-6
                  "
                >

                  {/* Icon */}

                  <div
                    className="
                      flex
                      h-11
                      w-11
                      items-center
                      justify-center
                      rounded-full
                      border
                      border-brand-orange/40
                      text-brand-orange
                    "
                  >
                    <Phone
                      size={19}
                      strokeWidth={1.4}
                    />
                  </div>


                  {/* Copy */}

                  <div className="mt-5">

                    <h3
                      className="
                        font-display
                        text-[1.25rem]
                        font-black
                        uppercase
                        leading-[0.9]
                        tracking-[-0.025em]
                      "
                    >
                      READY TO TALK
                    </h3>

                    <p
                      className="
                        mt-3
                        max-w-[190px]
                        text-xs
                        leading-[1.55]
                        text-brand-black/60
                      "
                    >
                      You know what you need.
                      <br />
                      Let’s discuss the project.
                    </p>

                  </div>


                  {/* CTA */}

                  <div
                    className="
                      mt-auto
                      flex
                      items-center
                      justify-between
                      pt-8
                      text-xs
                      font-bold
                      uppercase
                      tracking-[0.02em]
                      text-brand-orange
                    "
                  >
                    <span>
                      Book a call
                    </span>

                    <ArrowRight
                      size={17}
                      strokeWidth={1.5}
                      className="
                        transition-transform
                        duration-500
                        group-hover:translate-x-1.5
                      "
                    />
                  </div>

                </Link>

              </StaggerItem>


              {/* -------------------------------------------
                  STILL FIGURING IT OUT
              ------------------------------------------- */}

              <StaggerItem>

                <Link
                  href="/agency/get-in-touch"
                  className="
                    group
                    flex
                    min-h-[280px]
                    flex-col
                    rounded-[9px]
                    border
                    bg-brand-card
                    p-5
                    transition-all
                    duration-500
                    hover:-translate-y-1.5
                    hover:border-brand-orange
                    hover:shadow-[0_25px_60px_rgba(26,9,7,0.08)]
                    md:p-6
                  "
                  style={{
                    borderColor:
                      'var(--surface-border)',
                  }}
                >

                  {/* Icon */}

                  <div
                    className="
                      flex
                      h-11
                      w-11
                      items-center
                      justify-center
                      rounded-full
                      border
                      border-brand-black/10
                      text-brand-black/70
                    "
                  >
                    <Pencil
                      size={19}
                      strokeWidth={1.4}
                    />
                  </div>


                  {/* Copy */}

                  <div className="mt-5">

                    <h3
                      className="
                        font-display
                        text-[1.25rem]
                        font-black
                        uppercase
                        leading-[0.9]
                        tracking-[-0.025em]
                      "
                    >
                      STILL FIGURING IT OUT
                    </h3>

                    <p
                      className="
                        mt-3
                        max-w-[190px]
                        text-xs
                        leading-[1.55]
                        text-brand-black/60
                      "
                    >
                      Have an idea but not all
                      the answers? Start with
                      what you know.
                    </p>

                  </div>


                  {/* CTA */}

                  <div
                    className="
                      mt-auto
                      flex
                      items-center
                      justify-between
                      pt-8
                      text-xs
                      font-bold
                      uppercase
                      tracking-[0.02em]
                    "
                  >
                    <span>
                      Tell us about it
                    </span>

                    <ArrowRight
                      size={17}
                      strokeWidth={1.5}
                      className="
                        transition-transform
                        duration-500
                        group-hover:translate-x-1.5
                      "
                    />
                  </div>

                </Link>

              </StaggerItem>

            </Stagger>

          </div>

        </div>

      </div>

    </SectionWrapper>
  )
}