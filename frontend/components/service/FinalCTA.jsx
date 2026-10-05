'use client'

import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import Reveal from '@/components/motion/Reveal'

/** Closing band — brand orange, cream type, two clear ways forward. */
export default function FinalCTA({ headline = "Let's get started.", body, primary, secondary }) {
  return (
    <section data-theme="dark" className="relative overflow-hidden bg-brand-orange py-24 text-brand-cream md:py-32">
      <div className="pointer-events-none absolute -right-32 -top-32 h-[28rem] w-[28rem] rounded-full border border-brand-cream/20" />
      <div className="pointer-events-none absolute -right-16 -top-16 h-[22rem] w-[22rem] rounded-full border border-brand-cream/15" />
      <div className="container relative">
        <Reveal>
          <h2 className="max-w-4xl font-display text-[clamp(2.6rem,6.5vw,6rem)] font-black uppercase leading-[0.95] tracking-[-0.02em] text-balance">
            {headline}
          </h2>
        </Reveal>
        {body && (
          <Reveal delay={0.08}>
            <p className="mt-6 max-w-xl text-lg text-brand-cream/85">{body}</p>
          </Reveal>
        )}
        <Reveal delay={0.15} className="mt-10 flex flex-wrap gap-3">
          <Link href={primary.href} className="btn bg-brand-black text-brand-cream hover:-translate-y-0.5 hover:bg-brand-blackElevated">
            {primary.label} <ArrowRight size={16} />
          </Link>
          <Link href={secondary.href} className="btn border-[1.5px] border-brand-cream text-brand-cream hover:bg-brand-cream hover:text-brand-black">
            {secondary.label}
          </Link>
        </Reveal>
      </div>
    </section>
  )
}
