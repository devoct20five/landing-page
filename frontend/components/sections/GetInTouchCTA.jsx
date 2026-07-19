'use client'

import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import SectionWrapper from '@/components/layout/SectionWrapper'
import SectionTag from '@/components/ui/SectionTag'
import Reveal, { Stagger, StaggerItem } from '@/components/motion/Reveal'

export default function GetInTouchCTA({ theme = 'light' }) {
  return (
    <SectionWrapper theme={theme} className="!theme-peach">
      <div className="container">
        <div className="text-center max-w-4xl mx-auto">
          <Reveal><SectionTag>Get in touch</SectionTag></Reveal>
          <Reveal delay={0.05}>
            <h2 className="mt-6 font-display uppercase leading-[0.95] tracking-tight text-display-xl text-balance">
              Ready to start? <br />
              <span className="text-brand-orange italic font-medium normal-case tracking-tight">Or still figuring it out?</span>
            </h2>
          </Reveal>
          <Reveal delay={0.12}>
            <p className="mt-6 max-w-xl mx-auto text-body-lg opacity-75">Either works. Book a call if you’re ready to talk — or send us what you have so far.</p>
          </Reveal>
        </div>

        <Stagger className="mt-14 grid md:grid-cols-2 gap-5 max-w-4xl mx-auto">
          <StaggerItem>
            <Link href="/agency/book-a-call" className="brand-card group block !bg-brand-dark !text-brand-cream border-brand-dark hover:!bg-brand-orange hover:border-brand-orange transition-colors">
              <p className="eyebrow border-white/25 text-white/80"><span className="eyebrow-dot" /> Ready to talk</p>
              <h3 className="mt-5 font-display text-3xl md:text-4xl uppercase leading-[0.95] text-balance">You know what you need.<br />Let’s discuss the project.</h3>
              <div className="mt-8 inline-flex items-center gap-2 text-brand-orange font-semibold group-hover:text-white">
                <span>Book a call</span>
                <ArrowRight size={16} className="transition-transform duration-500 ease-apple group-hover:translate-x-2" />
              </div>
            </Link>
          </StaggerItem>
          <StaggerItem>
            <Link href="/agency/get-in-touch" className="brand-card group block !bg-brand-orange !text-white border-brand-orange hover:!bg-brand-dark hover:border-brand-dark transition-colors">
              <p className="eyebrow border-white/40 text-white/90"><span className="eyebrow-dot !bg-white" /> Still figuring it out</p>
              <h3 className="mt-5 font-display text-3xl md:text-4xl uppercase leading-[0.95] text-balance">Have an idea but not all the answers?<br />Start with what you know.</h3>
              <div className="mt-8 inline-flex items-center gap-2 font-semibold">
                <span>Tell us about it</span>
                <ArrowRight size={16} className="transition-transform duration-500 ease-apple group-hover:translate-x-2" />
              </div>
            </Link>
          </StaggerItem>
        </Stagger>
      </div>
    </SectionWrapper>
  )
}
