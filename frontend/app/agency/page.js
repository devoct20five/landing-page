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
          headline="FULL SPECTRUM CREATIVE SERVICES"
          subline="CONCEPT. CREATE. DELIVER."
          image="https://images.unsplash.com/photo-1604888989902-6c8d8617e02a?crop=entropy&cs=srgb&fm=jpg&q=85&w=2600"
        />

        {/* ================= SERVICES ================= */}

        <SectionWrapper id="services" theme="cream">
          <div className="container">
            <Reveal>
              <div className="flex justify-center">
                <SectionTag>SERVICES</SectionTag>
              </div>
            </Reveal>

            <Reveal delay={0.05}>
              <h2 className="mt-8 text-center font-display font-black uppercase leading-[0.83] tracking-[-0.05em] text-[clamp(3.5rem,8vw,7.25rem)]">
                EVERYTHING YOUR IDEA NEEDS
                <span className="text-brand-orange">.</span>
                <br />
                ALL UNDER ONE ROOF
                <span className="text-brand-orange">.</span>
              </h2>
            </Reveal>

            <Reveal delay={0.12}>
              <p className="mx-auto mt-8 max-w-[720px] text-center text-[1.05rem] leading-8 opacity-75">
                From the first cut to the final launch, we bring editing,
                design, 3D and web together under one creative roof. Choose
                exactly what you need—or combine services to build something
                bigger.
              </p>
            </Reveal>

            <Stagger className="mt-20 grid gap-6 lg:grid-cols-4 sm:grid-cols-2">
              {AGENCY_SERVICES.map((service) => {
                const Icon = ICONS[service.icon] || Film;

                return (
                  <StaggerItem key={service.slug}>
                    <Link
                      href={`/agency/${service.slug}`}
                      className="group block rounded-[24px] border bg-white p-7 transition-all duration-500 hover:-translate-y-2 hover:border-brand-orange hover:shadow-[0_30px_80px_rgba(0,0,0,0.12)]"
                      style={{
                        borderColor: "var(--surface-border)",
                      }}
                    >
                      <div className="flex items-start justify-between">
                        <Icon
                          size={34}
                          strokeWidth={1.5}
                          className="text-brand-orange"
                        />

                        <span className="font-display text-[2rem] font-black leading-none text-brand-orange">
                          {service.n}
                        </span>
                      </div>

                      <h3 className="mt-7 font-display text-[2rem] font-black uppercase leading-none">
                        {service.title}
                      </h3>

                      <p className="mt-5 text-[0.92rem] font-medium uppercase leading-6 opacity-80">
                        {service.blurb}
                      </p>

                      <p className="mt-4 text-[13px] font-bold uppercase tracking-wide text-brand-orange">
                        {service.tag}
                      </p>

                      <div className="mt-10 flex items-center justify-between border-t pt-5">
                        <span className="text-[0.9rem] font-bold uppercase tracking-wide">
                          EXPLORE {service.title}
                        </span>

                        <ArrowRight
                          size={18}
                          className="text-brand-orange transition-transform duration-500 group-hover:translate-x-2"
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
