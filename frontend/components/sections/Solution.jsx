'use client'

import SectionWrapper from '@/components/layout/SectionWrapper'
import SectionTag from '@/components/ui/SectionTag'
import Pill from '@/components/ui/Pill'
import Reveal, { Stagger, StaggerItem } from '@/components/motion/Reveal'

export default function Solution({ id = 'solution', theme = 'light', eyebrow = 'Solution', headline, copy, audiences = [], formats = [] }) {
  return (
    <SectionWrapper id={id} theme={theme}>
      <div className="container">
        <div className="grid md:grid-cols-12 gap-10">
          <div className="md:col-span-5">
            <Reveal><SectionTag>{eyebrow}</SectionTag></Reveal>
            <Reveal delay={0.05}>
              <h2 className="mt-6 font-display uppercase leading-[0.95] tracking-tight text-display-lg text-balance">{headline}</h2>
            </Reveal>
            {copy && (
              <Reveal delay={0.15}><p className="mt-6 text-body-lg opacity-70 max-w-md">{copy}</p></Reveal>
            )}
          </div>
          <div className="md:col-span-7 space-y-8">
            {audiences.length > 0 && (
              <div>
                <p className="eyebrow mb-4"><span className="eyebrow-dot" /> Who it’s for</p>
                <Stagger className="flex flex-wrap gap-2">
                  {audiences.map((a) => <StaggerItem key={a}><Pill>{a}</Pill></StaggerItem>)}
                </Stagger>
              </div>
            )}
            {formats.length > 0 && (
              <div>
                <p className="eyebrow mb-4"><span className="eyebrow-dot" /> What we make</p>
                <Stagger className="flex flex-wrap gap-2">
                  {formats.map((f) => <StaggerItem key={f}><Pill>{f}</Pill></StaggerItem>)}
                </Stagger>
              </div>
            )}
          </div>
        </div>
      </div>
    </SectionWrapper>
  )
}
