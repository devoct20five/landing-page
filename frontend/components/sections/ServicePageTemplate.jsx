'use client'

import Navbar from '@/components/navigation/Navbar'
import Footer from '@/components/layout/Footer'
import Hero from '@/components/sections/Hero'
import Solution from '@/components/sections/Solution'
import TrustedBy from '@/components/sections/TrustedBy'
import Showreel from '@/components/sections/Showreel'
import Workflow from '@/components/sections/Workflow'
import BehindTheWork from '@/components/sections/BehindTheWork'
import FeaturesGrid from '@/components/sections/FeaturesGrid'
import FAQ from '@/components/sections/FAQ'

// Service page section order per plan §3 (10 sections):
// Navbar B — Hero (dark) — Solution (light) — Trusted-by (dark) — Showreel (light)
// — Workflow (light) — Behind-the-Work (dark) — Pricing intro (light) — FAQ (dark) — Footer (dark)
export default function ServicePageTemplate({ data }) {
  const { hero, solution, workflow, pricing, slug } = data
  return (
    <>
      <Navbar variant="service" initialTheme="dark" />
      <main>
        <Hero
          eyebrow={`OCT20FIVE ${data.title}`}
          headline={hero.headline}
          subline={hero.tag}
          image={hero.image}
        />
        <Solution
          headline={solution.headline}
          copy={solution.copy}
          audiences={solution.audiences}
          formats={solution.formats}
        />
        <TrustedBy />
        <Showreel />
        <Workflow
          headline={workflow.headline}
          subline={workflow.subline}
          steps={workflow.steps}
          ctaLabel={workflow.ctaLabel}
        />
        <BehindTheWork currentSlug={slug} />
        <FeaturesGrid
          id="pricing"
          eyebrow="Pricing"
          headline={pricing.headline}
          subline={pricing.subline}
          features={pricing.features}
          ctaLabel={pricing.ctaLabel}
          ctaHref="/agency/get-in-touch"
        />
        <FAQ />
      </main>
      <Footer variant="service" />
    </>
  )
}
