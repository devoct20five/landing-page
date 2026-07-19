'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, Film, Palette, Boxes, Code2 } from 'lucide-react'
import SectionWrapper from '@/components/layout/SectionWrapper'
import SectionTag from '@/components/ui/SectionTag'
import Reveal, { Stagger, StaggerItem } from '@/components/motion/Reveal'
import MagneticButton from '@/components/motion/MagneticButton'
import { AGENCY_SERVICES } from '@/data/content'

const ICONS = { Film, Palette, Boxes, Code2 }

export default function BehindTheWork({ theme = 'dark', currentSlug }) {
  const others = AGENCY_SERVICES.filter((s) => s.slug !== currentSlug)
  return (
    <SectionWrapper theme={theme} id="behind">
      <div className="container">
        <div className="grid md:grid-cols-12 gap-10 items-center">
          <div className="md:col-span-6">
            <Reveal><SectionTag>Behind the Work</SectionTag></Reveal>
            <Reveal delay={0.05}>
              <h2 className="mt-6 font-display uppercase leading-[0.85] tracking-tight text-display-xl text-balance">
                Ideas. <br /> <span className="text-brand-orange">Process.</span> <br /> Impact.
              </h2>
            </Reveal>
            <Reveal delay={0.12}>
              <p className="mt-6 opacity-80 max-w-xl text-body-lg">
                Great work doesn’t happen by chance. Explore the ideas, decisions, process, and craft that turn concepts into results that matter.
              </p>
            </Reveal>
            <Reveal delay={0.2} className="mt-8">
              <MagneticButton href="/agency/behind-the-work" variant="ghost">Explore Behind the Work <ArrowRight size={16} /></MagneticButton>
            </Reveal>
          </div>

          <div className="md:col-span-6">
            <Reveal delay={0.1}>
              <div className="grid grid-cols-6 grid-rows-4 gap-3 h-[380px] md:h-[500px]">
                <div className="col-span-4 row-span-3 relative rounded-card overflow-hidden">
                  <Image src="https://images.unsplash.com/photo-1602645803535-45caec9f2a3c?crop=entropy&cs=srgb&fm=jpg&q=85&w=1600" alt="" fill sizes="50vw" className="object-cover" />
                </div>
                <div className="col-span-2 row-span-2 relative rounded-card overflow-hidden">
                  <Image src="https://images.unsplash.com/photo-1604888989902-6c8d8617e02a?crop=entropy&cs=srgb&fm=jpg&q=85&w=1200" alt="" fill sizes="25vw" className="object-cover" />
                </div>
                <div className="col-span-2 row-span-2 relative rounded-card overflow-hidden">
                  <Image src="https://images.unsplash.com/photo-1656588360305-095657d15c6f?crop=entropy&cs=srgb&fm=jpg&q=85&w=1200" alt="" fill sizes="25vw" className="object-cover" />
                </div>
                <div className="col-span-4 row-span-1 relative rounded-card overflow-hidden">
                  <Image src="https://images.unsplash.com/photo-1573867607590-361ea324975e?crop=entropy&cs=srgb&fm=jpg&q=85&w=1400" alt="" fill sizes="50vw" className="object-cover" />
                </div>
              </div>
            </Reveal>
          </div>
        </div>

        {/* Explore other services strip */}
        <div className="mt-24">
          <Reveal className="mb-8">
            <p className="eyebrow"><span className="eyebrow-dot" /> Explore what else we do</p>
          </Reveal>
          <Stagger className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {others.map((s) => {
              const Icon = ICONS[s.icon] || Film
              return (
                <StaggerItem key={s.slug}>
                  <Link href={`/agency/${s.slug}`} className="brand-card block group !bg-transparent border-white/10 hover:!bg-white/[0.03]">
                    <Icon size={26} strokeWidth={1.6} className="text-brand-orange" />
                    <h4 className="mt-6 font-display text-2xl uppercase leading-tight">{s.title}</h4>
                    <p className="mt-2 text-sm opacity-70">{s.blurb}</p>
                    <div className="mt-6 flex items-center gap-2 text-brand-orange text-sm font-medium">
                      <span>Explore</span>
                      <ArrowRight size={16} className="transition-transform duration-500 ease-apple group-hover:translate-x-2" />
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
