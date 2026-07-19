'use client'

import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import Navbar from '@/components/navigation/Navbar'
import Footer from '@/components/layout/Footer'
import SectionWrapper from '@/components/layout/SectionWrapper'
import SectionTag from '@/components/ui/SectionTag'
import Reveal, { Stagger, StaggerItem } from '@/components/motion/Reveal'

const ROLES = [
  { title: 'Senior Editor', team: 'Post', location: 'Mumbai / Remote' },
  { title: 'Motion Designer', team: 'Design', location: 'Bengaluru / Remote' },
  { title: '3D Generalist (Blender + Unreal)', team: '3D', location: 'Mumbai' },
  { title: 'Next.js Developer', team: 'Web', location: 'Remote' },
  { title: 'Producer', team: 'Ops', location: 'Mumbai' },
  { title: 'Brand Strategist (contract)', team: 'Design', location: 'Remote' },
]

export default function CareersPage() {
  return (
    <>
      <Navbar variant="utility" initialTheme="light" />
      <main>
        <SectionWrapper theme="light" className="!pt-40">
          <div className="container">
            <Reveal><SectionTag>Careers</SectionTag></Reveal>
            <Reveal delay={0.05}>
              <h1 className="mt-6 font-display uppercase leading-[0.9] tracking-tight text-display-2xl text-balance max-w-5xl">
                Work on ambitious briefs, with <span className="text-brand-orange">senior craft.</span>
              </h1>
            </Reveal>
            <Reveal delay={0.15}>
              <p className="mt-6 max-w-2xl text-body-lg opacity-75">We’re a small studio. Every hire matters. We hire slow — for craft, curiosity, and taste. Named leads across every discipline, honest scopes, real ownership.</p>
            </Reveal>
          </div>
        </SectionWrapper>

        <SectionWrapper theme="peach">
          <div className="container">
            <div className="flex items-end justify-between mb-8">
              <p className="eyebrow"><span className="eyebrow-dot" /> Open Roles</p>
              <p className="text-sm opacity-70">Updated Jun 2025</p>
            </div>
            <Stagger className="space-y-3">
              {ROLES.map((r) => (
                <StaggerItem key={r.title}>
                  <Link href="/agency/get-in-touch" className="group block brand-card !p-6">
                    <div className="grid md:grid-cols-12 items-center gap-4">
                      <div className="md:col-span-6">
                        <h3 className="font-display text-2xl md:text-3xl uppercase leading-tight">{r.title}</h3>
                      </div>
                      <div className="md:col-span-2 text-sm opacity-70">{r.team}</div>
                      <div className="md:col-span-3 text-sm opacity-70">{r.location}</div>
                      <div className="md:col-span-1 md:justify-self-end">
                        <span className="btn-icon"><ArrowUpRight size={18} /></span>
                      </div>
                    </div>
                  </Link>
                </StaggerItem>
              ))}
            </Stagger>
            <Reveal delay={0.3} className="mt-12 opacity-70 text-sm">
              Don&rsquo;t see your role? <Link href="/agency/get-in-touch" className="underline underline-offset-4 hover:text-brand-orange">Pitch us anyway</Link>.
            </Reveal>
          </div>
        </SectionWrapper>
      </main>
      <Footer />
    </>
  )
}
