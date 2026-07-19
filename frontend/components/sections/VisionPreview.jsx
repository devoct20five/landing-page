'use client'

import { ArrowRight } from 'lucide-react'
import SectionWrapper from '@/components/layout/SectionWrapper'
import SectionTag from '@/components/ui/SectionTag'
import Reveal from '@/components/motion/Reveal'
import MagneticButton from '@/components/motion/MagneticButton'

export default function VisionPreview() {
  return (
    <SectionWrapper theme="dark">
      <div className="container">
        <div className="grid md:grid-cols-12 gap-10 items-end">
          <div className="md:col-span-8">
            <Reveal><SectionTag>Vision</SectionTag></Reveal>
            <Reveal delay={0.05}>
              <h2 className="mt-6 font-display uppercase leading-[0.95] tracking-tight text-display-xl text-balance">
                We’re building <br /> the kind of <span className="text-brand-orange">agency</span> <br /> we’d want to work with.
              </h2>
            </Reveal>
            <Reveal delay={0.12}>
              <p className="mt-6 max-w-2xl text-body-lg opacity-75">
                A place for good ideas, good people, and work we can genuinely be proud of. We’re still building it — and that’s part of the story.
              </p>
            </Reveal>
          </div>
          <div className="md:col-span-4 md:justify-self-end">
            <Reveal delay={0.2}>
              <MagneticButton href="/agency/vision" variant="ghost">Discover our vision <ArrowRight size={16} /></MagneticButton>
            </Reveal>
          </div>
        </div>
      </div>
    </SectionWrapper>
  )
}
