'use client'

import Link from 'next/link'
import { ArrowRight, Film, Palette, Boxes, Code2 } from 'lucide-react'
import Navbar from '@/components/navigation/Navbar'
import Footer from '@/components/layout/Footer'
import SectionWrapper from '@/components/layout/SectionWrapper'
import SectionTag from '@/components/ui/SectionTag'
import NumberBadge from '@/components/ui/NumberBadge'
import Hero from '@/components/sections/Hero'
import TrustedBy from '@/components/sections/TrustedBy'
import Showreel from '@/components/sections/Showreel'
import FeaturesGrid from '@/components/sections/FeaturesGrid'
import BehindTheWork from '@/components/sections/BehindTheWork'
import VisionPreview from '@/components/sections/VisionPreview'
import CareersPreview from '@/components/sections/CareersPreview'
import GetInTouchCTA from '@/components/sections/GetInTouchCTA'
import Reveal, { Stagger, StaggerItem } from '@/components/motion/Reveal'
import { AGENCY_SERVICES, AGENCY_FEATURES } from '@/data/content'

const ICONS = { Film, Palette, Boxes, Code2 }

export default function AgencyPage() {
  return (
    <>
      <Navbar variant="agency" initialTheme="dark" />
      <main>
        <Hero
          eyebrow="OCT20FIVE Agency"
          headline="Full spectrum creative services"
          subline="Concept. Create. Deliver."
          image="https://images.unsplash.com/photo-1604888989902-6c8d8617e02a?crop=entropy&cs=srgb&fm=jpg&q=85&w=2600"
          taglineRow={['Editing', 'Design', '3D Ads', 'Web Dev']}
        />

        {/* Services grid */}
        <SectionWrapper id="services" theme="peach">
          <div className="container">
            <div className="grid md:grid-cols-12 gap-10 mb-14">
              <div className="md:col-span-7">
                <Reveal><SectionTag>Everything under one roof</SectionTag></Reveal>
                <Reveal delay={0.05}>
                  <h2 className="mt-6 font-display uppercase leading-[0.95] tracking-tight text-display-xl text-balance">
                    Everything your idea needs. <br className="hidden md:block" /> <span className="text-brand-orange">All under one roof.</span>
                  </h2>
                </Reveal>
              </div>
              <div className="md:col-span-5 flex items-end">
                <Reveal delay={0.15}><p className="text-body-lg opacity-75">Four disciplines, one team, one bill. No stitching agencies together, no lost weeks in vendor handoffs.</p></Reveal>
              </div>
            </div>

            <Stagger className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {AGENCY_SERVICES.map((s) => {
                const Icon = ICONS[s.icon] || Film
                return (
                  <StaggerItem key={s.slug}>
                    <Link href={`/agency/${s.slug}`} className="brand-card block group h-full">
                      <div className="flex items-center justify-between">
                        <NumberBadge n={s.n} />
                        <div className="w-11 h-11 rounded-icon border flex items-center justify-center text-brand-orange group-hover:bg-brand-orange group-hover:text-white transition-colors" style={{ borderColor: 'var(--surface-border)' }}>
                          <Icon size={20} strokeWidth={1.7} />
                        </div>
                      </div>
                      <h3 className="mt-6 font-display text-3xl uppercase leading-tight">{s.title}</h3>
                      <p className="mt-3 opacity-70 leading-relaxed text-[0.95rem]">{s.blurb}</p>
                      <p className="mt-4 text-xs tracking-[0.25em] uppercase text-brand-orange">{s.tag}</p>
                      <div className="mt-6 flex items-center gap-2 text-sm font-semibold text-brand-orange">
                        Explore <ArrowRight size={16} className="transition-transform duration-500 ease-apple group-hover:translate-x-2" />
                      </div>
                    </Link>
                  </StaggerItem>
                )
              })}
            </Stagger>
          </div>
        </SectionWrapper>

        <Showreel />
        <TrustedBy />

        <FeaturesGrid
          headline={<>Good work. <span className="text-brand-orange">Without</span> making it complicated.</>}
          subline="Clear process. Flexible ways to work. Serious attention to the details that make the final work better."
          features={AGENCY_FEATURES}
          ctaLabel="Start a Project"
        />

        <BehindTheWork currentSlug={null} />
        <VisionPreview />
        <CareersPreview />
        <GetInTouchCTA />
      </main>
      <Footer variant="service" />
    </>
  )
}
