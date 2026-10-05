"use client";

import Link from "next/link";
import { ArrowRight, Film, Palette, Boxes, Code2 } from "lucide-react";

import Navbar from "@/components/navigation/Navbar";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/sections/Hero";
import Showreel from "@/components/sections/Showreel";
import TrustedBy from "@/components/sections/TrustedBy";
import FeaturesGrid from "@/components/sections/FeaturesGrid";
import BehindTheWork from "@/components/sections/BehindTheWork";
import VisionPreview from "@/components/sections/VisionPreview";
import CareersPreview from "@/components/sections/CareersPreview";
import GetInTouchCTA from "@/components/sections/GetInTouchCTA";

import SectionWrapper from "@/components/layout/SectionWrapper";
import SectionTag from "@/components/ui/SectionTag";

import Reveal, { Stagger, StaggerItem } from "@/components/motion/Reveal";

import { AGENCY_SERVICES, AGENCY_FEATURES } from "@/data/content";

const ICONS = {
  Film,
  Palette,
  Boxes,
  Code2,
};

export default function AgencyPage() {
  return (
    <>
      <Navbar variant="agency" initialTheme="dark" />

      <main>
        <Hero
          eyebrow="OCT20FIVE Agency"
          headline="Full Spectrum Creative Services"
          subline="Concept. Create. Deliver."
          actions={
            <>
              <Link href="/agency/get-in-touch" className="btn btn-primary">
                Get in touch
                <ArrowRight size={16} strokeWidth={2} />
              </Link>
              <a href="#services" className="btn btn-outline">
                Our services
              </a>
              <Link href="/agency/portfolio" className="btn btn-ghost">
                Portfolio
              </Link>
            </>
          }
        />

        {/* ================= SERVICES ================= */}

        <SectionWrapper id="services" theme="cream">
          <div className="container">
            {/* =========================================
        SECTION LABEL
    ========================================= */}

            <Reveal>
              <div className="flex justify-center">
                <SectionTag>SERVICES</SectionTag>
              </div>
            </Reveal>

            {/* =========================================
        HEADING
    ========================================= */}

            <Reveal delay={0.05}>
              <h2
                className="
          mx-auto
          mt-7
          max-w-[1050px]
          text-center
          font-display
          font-black
          uppercase
          leading-[0.95]
          tracking-[-0.03em]
          text-[clamp(2.5rem,5.4vw,5rem)]
        "
              >
                EVERYTHING YOUR IDEA NEEDS
                <span className="text-brand-orange">.</span>
                <br />
                ALL UNDER ONE ROOF
                <span className="text-brand-orange">.</span>
              </h2>
            </Reveal>

            {/* =========================================
        DESCRIPTION
    ========================================= */}

            <Reveal delay={0.1}>
              <p
                className="
          mx-auto
          mt-7
          max-w-[690px]
          text-center
          text-[0.88rem]
          leading-[1.65]
          text-brand-black/75
          md:text-[0.95rem]
        "
              >
                From the first cut to the final launch, we bring editing,
                design, 3D and web together under one creative roof. Choose
                exactly what you need—or combine services to build something
                bigger.
              </p>
            </Reveal>

            {/* =========================================
        SERVICE CARDS
    ========================================= */}

            <Stagger
              className="
        mt-12
        grid
        gap-4
        sm:grid-cols-2
        lg:mt-14
        lg:grid-cols-4
        lg:gap-5
      "
            >
              {AGENCY_SERVICES.map((service) => {
                const Icon = ICONS[service.icon] || Film;

                return (
                  <StaggerItem key={service.slug}>
                    <Link
                      href={`/agency/${service.slug}`}
                      className="
                group
                flex
                min-h-[360px]
                flex-col
                rounded-[1.5rem]
                border
                bg-brand-card
                p-5
                transition-all
                duration-500
                ease-smooth
                hover:-translate-y-1.5
                hover:border-brand-orange
                hover:shadow-[0_25px_60px_rgba(26,9,7,0.09)]
                md:p-6
              "
                      style={{
                        borderColor: "var(--surface-border)",
                      }}
                    >
                      {/* ---------------------------------
                  ICON + NUMBER
              --------------------------------- */}

                      <div className="flex items-start justify-between">
                        <Icon
                          size={32}
                          strokeWidth={1.5}
                          className="
                    text-brand-orange
                    transition-transform
                    duration-500
                    group-hover:scale-105
                  "
                        />

                        <span
                          className="
                    font-display
                    text-[1.7rem]
                    font-black
                    leading-none
                    text-brand-orange
                  "
                        >
                          {service.n}
                        </span>
                      </div>

                      {/* ---------------------------------
                  TITLE
              --------------------------------- */}

                      <h3
                        className="
                  mt-7
                  font-display
                  text-[1.8rem]
                  font-black
                  uppercase
                  leading-[0.9]
                  tracking-[-0.025em]
                "
                      >
                        {service.title}
                      </h3>

                      {/* ---------------------------------
                  BLURB
              --------------------------------- */}

                      <p
                        className="
                  mt-4
                  max-w-[240px]
                  text-[0.8rem]
                  font-medium
                  uppercase
                  leading-[1.55]
                  text-brand-black/75
                "
                      >
                        {service.blurb}
                      </p>

                      {/* ---------------------------------
                  ORANGE TAG
              --------------------------------- */}

                      <p
                        className="
                  mt-2
                  text-[0.75rem]
                  font-bold
                  uppercase
                  leading-[1.4]
                  tracking-[0.03em]
                  text-brand-orange
                "
                      >
                        {service.tag}
                      </p>

                      {/* ---------------------------------
                  BOTTOM CTA
              --------------------------------- */}

                      <div
                        className="
                  mt-auto
                  flex
                  items-center
                  justify-between
                  border-t
                  pt-4
                "
                        style={{
                          borderColor: "var(--surface-border)",
                        }}
                      >
                        <span
                          className="
                    text-[0.75rem]
                    font-bold
                    uppercase
                    tracking-[0.02em]
                  "
                        >
                          EXPLORE {service.title}
                        </span>

                        <ArrowRight
                          size={17}
                          strokeWidth={1.5}
                          className="
                    text-brand-orange
                    transition-transform
                    duration-500
                    ease-smooth
                    group-hover:translate-x-1.5
                  "
                        />
                      </div>
                    </Link>
                  </StaggerItem>
                );
              })}
            </Stagger>
          </div>
        </SectionWrapper>
        <Showreel />

        <TrustedBy />

        <FeaturesGrid
          headline={
            <>
              GOOD WORK.
              <span className="text-brand-orange"> WITHOUT</span>
              <br />
              MAKING IT
              <span className="text-brand-orange"> COMPLICATED.</span>
            </>
          }
          subline="Clear process. Flexible ways to work. Serious attention to the details that make the final work better."
          features={AGENCY_FEATURES}
          ctaLabel="Start a Project"
        />

        <BehindTheWork currentSlug={null} />

        <VisionPreview />

        <CareersPreview />

        <GetInTouchCTA />
      </main>

      <Footer variant="agency" />
    </>
  );
}
