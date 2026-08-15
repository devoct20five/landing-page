"use client";

import Navbar from "@/components/navigation/Navbar";
import Footer from "@/components/layout/Footer";

import Hero from "@/components/sections/Hero";
import Solution from "@/components/sections/Solution";
import TrustedBy from "@/components/sections/TrustedBy";
import Showreel from "@/components/sections/Showreel";
import CollectionRail from "./CollectionRail";
import Workflow from "@/components/sections/Workflow";
import BehindTheWork from "@/components/sections/BehindTheWork";
import FeaturesGrid from "@/components/sections/FeaturesGrid";
import FAQ from "@/components/sections/FAQ";

/*
  ============================================================
  SERVICE PAGE STRUCTURE
  ============================================================

  Navbar
      ↓
  Hero
      ↓
  Solution
      ↓
  Trusted By
      ↓
  Showreel
      ↓
  Work Collections
      ↓
  Workflow
      ↓
  Behind The Work
      ↓
  Pricing
      ↓
  FAQ
      ↓
  Footer
*/

export default function ServicePageTemplate({ data }) {
  const { hero, solution, workflow, pricing, collections, slug, title } = data;


  const collectionItems = Array.isArray(collections)
    ? collections
    : collections?.items || [];

  const collectionEyebrow = Array.isArray(collections)
    ? `${title} Work`
    : collections?.eyebrow || `${title} Work`;

  const collectionHeadline = Array.isArray(collections)
    ? "Work made to make an impact."
    : collections?.headline || "Work made to make an impact.";

  return (
    <>
      {/* =====================================================
          NAVBAR
          ===================================================== */}

      <Navbar variant="service" initialTheme="dark" />

      <main>
        {/* =====================================================
            HERO
            ===================================================== */}

        <Hero
          eyebrow={`OCT20FIVE ${title}`}
          headline={hero.headline}
          subline={hero.tag}
          image={hero.image}
        />

        {/* =====================================================
            SOLUTION
            ===================================================== */}

        <Solution
          headline={solution.headline}
          copy={solution.copy}
          audiences={solution.audiences}
          formats={solution.formats}
        />

        {/* =====================================================
            TRUSTED BY
            ===================================================== */}

        <TrustedBy />

        {/* =====================================================
            SHOWREEL
            ===================================================== */}

        <Showreel />

        {/* =====================================================
            SELECTED WORK / COLLECTIONS
            ===================================================== */}

        {collectionItems.length > 0 && (
          <CollectionRail
            eyebrow={collectionEyebrow}
            title={collectionHeadline}
            collections={collectionItems}
            accent="#ff5a1f"
          />
        )}

        {/* =====================================================
            WORKFLOW
            ===================================================== */}

        <Workflow
          headline={workflow.headline}
          subline={workflow.subline}
          steps={workflow.steps}
          ctaLabel={workflow.ctaLabel}
          ctaHref="/agency/get-in-touch"
        />

        {/* =====================================================
            BEHIND THE WORK
            ===================================================== */}

        <BehindTheWork currentSlug={slug} />

        {/* =====================================================
            PRICING
            ===================================================== */}

        <FeaturesGrid
          id="pricing"
          theme="dark"
          eyebrow={pricing.eyebrow || "Pricing"}
          headline={pricing.headline}
          subline={pricing.subline}
          plans={pricing.plans}
          features={pricing.features}
          signature={pricing.signature}
          compareLabel={pricing.compareLabel || "Compare Plans"}
          compareHref={pricing.compareHref || "#compare"}
        />

        {/* =====================================================
            FAQ
            ===================================================== */}

        <FAQ />
      </main>

      {/* =====================================================
          FOOTER
          ===================================================== */}

      <Footer variant="service" />
    </>
  );
}
