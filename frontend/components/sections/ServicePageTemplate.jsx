"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Navbar from "@/components/navigation/Navbar";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/sections/Hero";
import Solution from "@/components/sections/Solution";
import TrustedBy from "@/components/sections/TrustedBy";
import FAQ from "@/components/sections/FAQ";
import WorkGallery from "@/components/service/WorkGallery";
import ProcessSteps from "@/components/service/ProcessSteps";
import WhyUs from "@/components/service/WhyUs";
import PricingSection from "@/components/service/PricingSection";
import FinalCTA from "@/components/service/FinalCTA";
import { links } from "@/data/plans";
import { countByService, portfolioHref } from "@/data/portfolio";

/*
  ============================================================
  SERVICE PAGE — section order (light / dark alternate)
  ============================================================
  Hero            dark   what we do · See plans / Book a call
  Solution        light  who it's for, formats
  Trusted by      dark
  Work            light  tabbed bento gallery
  Process         dark   3 steps
  Why us          light  6 reasons
  Pricing         dark   pack selector · plans · compare · custom
  FAQ             light
  Final CTA       orange
  ------------------------------------------------------------
  Every CTA resolves to a real route:
    See plans   → #pricing (this page)
    Get <plan>  → /agency/checkout?service=&plan=&pack=
    Book a call → /agency/book-a-call?service=
    Quote       → /agency/get-in-touch?service=
*/
export default function ServicePageTemplate({ data, pricing }) {
  const { hero, solution, workflow, collections, slug, title } = data;

  const collectionItems = Array.isArray(collections)
    ? collections
    : collections?.items || [];
  const workEyebrow = Array.isArray(collections)
    ? `${title} work`
    : collections?.eyebrow || `${title} work`;
  const workHeadline = Array.isArray(collections)
    ? "Work made to make an impact."
    : collections?.headline || "Work made to make an impact.";

  return (
    <>
      <Navbar variant="service" initialTheme="dark" />

      <main>
        <Hero
          eyebrow={`OCT20FIVE ${title}`}
          headline={hero.headline}
          subline={hero.tag}
          image={hero.image}
          actions={
            <>
              <a href="#pricing" className="btn btn-primary">
                See plans
                <ArrowRight size={16} strokeWidth={2} />
              </a>
              <Link href={links.call(slug)} className="btn btn-secondary">
                Book a call
              </Link>
            </>
          }
        />

        <Solution
          headline={solution.headline}
          copy={solution.copy}
          audiences={solution.audiences}
          formats={solution.formats}
        />

        <TrustedBy />

        <WorkGallery
          eyebrow={workEyebrow}
          headline={workHeadline}
          collections={collectionItems}
          portfolioHref={portfolioHref(slug)}
          portfolioLabel={`View all ${title} work`}
          portfolioCount={countByService(slug)}
        />

        <ProcessSteps
          headline={workflow.headline}
          subline={workflow.subline}
          steps={workflow.steps}
          ctaLabel={workflow.ctaLabel}
          ctaHref={links.call(slug)}
        />

        {pricing && <WhyUs reasons={pricing.reasons} />}

        {pricing ? (
          <PricingSection model={pricing} />
        ) : (
          <section id="pricing" className="bg-brand-black py-24 text-center text-brand-cream">
            <div className="container">
              <h2 className="font-display text-3xl font-black uppercase">Pricing is loading slowly</h2>
              <p className="mx-auto mt-4 max-w-md text-brand-cream/70">
                We couldn&apos;t load live prices just now. Please refresh in a moment, or{" "}
                <Link href={links.call(slug)} className="underline">book a call</Link> and we&apos;ll quote you directly.
              </p>
            </div>
          </section>
        )}

        <FAQ theme="light" />

        <FinalCTA
          headline="Let's get started."
          body="Pick a plan and check out in minutes — or talk to us first and we'll scope it together."
          primary={{ label: "See plans", href: "#pricing" }}
          secondary={{ label: workflow.ctaLabel || "Book a call", href: links.call(slug) }}
        />
      </main>

      <Footer variant="service" />
    </>
  );
}
