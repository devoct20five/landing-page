"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import Navbar from "@/components/navigation/Navbar";
import Footer from "@/components/layout/Footer";
import SectionWrapper from "@/components/layout/SectionWrapper";
import SectionTag from "@/components/ui/SectionTag";
import Reveal, { Stagger, StaggerItem } from "@/components/motion/Reveal";
import NumberBadge from "@/components/ui/NumberBadge";
import GetInTouchCTA from "@/components/sections/GetInTouchCTA";

const STEPS = [
  {
    title: "Listen",
    body: "We start with your brand, not our template. Business goals, audience, tone — all documented before the first sketch.",
  },
  {
    title: "Frame the ask",
    body: "A one-pager with the problem, the deliverables, the scope, the schedule. Signed off before work starts.",
  },
  {
    title: "Prototype",
    body: "Rough cuts, style frames, motion prototypes. We’d rather show than tell.",
  },
  {
    title: "Iterate",
    body: "Two directed rounds per stage. Directed feedback, not comment threads.",
  },
  {
    title: "Polish",
    body: "Color, sound, animation, code polish — the last 10% that most agencies skip.",
  },
  {
    title: "Deliver",
    body: "Every format, every ratio, every export you need. Source files handed over on wrap.",
  },
];

const CRAFTS = [
  {
    title: "Editing",
    desc: "Cuts that hold attention — social, brand films, docs.",
    href: "/agency/portfolio?service=editing",
    thumbnail:
      "https://images.unsplash.com/photo-1500462918059-b1a0cb512f1d?crop=entropy&cs=srgb&fm=jpg&q=80&w=1200",
  },
  {
    title: "Design",
    desc: "Identity, packaging, and visual systems built to last.",
    href: "/agency/portfolio?service=design",
    thumbnail:
      "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?crop=entropy&cs=srgb&fm=jpg&q=80&w=1200",
  },
  {
    title: "3D-Ads",
    desc: "CGI and product films that feel real, not rendered.",
    href: "/agency/portfolio?service=3d-ads",
    thumbnail:
      "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?crop=entropy&cs=srgb&fm=jpg&q=80&w=1200",
  },
  {
    title: "Web-Dev",
    desc: "Sites and products built for speed, taste, and conversion.",
    href: "/agency/portfolio?service=web-dev",
    thumbnail:
      "https://images.unsplash.com/photo-1547658719-da2b51169166?crop=entropy&cs=srgb&fm=jpg&q=80&w=1200",
  },
];

export default function BehindTheWorkPage() {
  return (
    <>
      <Navbar variant="utility" initialTheme="dark" />
      <main>
        <SectionWrapper theme="dark" className="!pt-40 !pb-16">
          <div className="container">
            <div className="grid md:grid-cols-12 gap-10 items-end">
              <div className="md:col-span-7">
                <Reveal>
                  <SectionTag>Behind the Work</SectionTag>
                </Reveal>
                <Reveal delay={0.05}>
                  <h1 className="mt-6 font-display uppercase leading-[0.9] tracking-tight text-display-2xl text-balance">
                    Ideas. <span className="text-brand-orange">Process.</span>{" "}
                    Impact.
                  </h1>
                </Reveal>
              </div>
              <div className="md:col-span-5">
                <Reveal delay={0.15}>
                  <p className="text-body-lg opacity-70 max-w-md">
                    The 6-stage rhythm behind every OCT20FIVE project — whether
                    it&rsquo;s a 30-second social edit or a full brand relaunch.
                  </p>
                </Reveal>
              </div>
            </div>
          </div>
        </SectionWrapper>

        {/* 6-stage process */}
        <SectionWrapper theme="dark" className="!pt-8">
          <div className="container">
            <Stagger className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
              {STEPS.map((s, i) => (
                <StaggerItem key={i}>
                  <div className="brand-card h-full">
                    <NumberBadge n={i + 1} />
                    <h3 className="mt-6 font-display text-2xl leading-tight uppercase">
                      {s.title}
                    </h3>
                    <p className="mt-3 opacity-70 leading-relaxed">{s.body}</p>
                  </div>
                </StaggerItem>
              ))}
            </Stagger>
          </div>
        </SectionWrapper>

        {/* Explore by craft — links into the 4 category pages */}
        <SectionWrapper theme="dark">
          <div className="container">
            <div className="flex items-end justify-between mb-8">
              <div>
                <Reveal>
                  <p className="eyebrow">
                    <span className="eyebrow-dot" /> Explore the work
                  </p>
                </Reveal>
                <Reveal delay={0.05}>
                  <h2 className="mt-4 font-display uppercase leading-[0.9] tracking-tight text-display-lg">
                    See it by <span className="text-brand-orange">craft.</span>
                  </h2>
                </Reveal>
              </div>
            </div>

            <Stagger className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {CRAFTS.map((c) => (
                <StaggerItem key={c.title}>
                  <Link href={c.href} className="group block">
                    <div className="relative aspect-[4/5] rounded-card overflow-hidden">
                      <Image
                        src={c.thumbnail}
                        alt={c.title}
                        fill
                        sizes="(max-width: 768px) 50vw, 25vw"
                        className="object-cover transition-transform duration-700 ease-apple group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-brand-black/80 via-brand-black/10 to-transparent" />
                      <div className="absolute inset-x-0 bottom-0 p-5">
                        <div className="flex items-center justify-between">
                          <h3 className="font-display text-2xl uppercase leading-none">
                            {c.title}
                          </h3>
                          <span className="w-8 h-8 shrink-0 rounded-icon border border-brand-cream/30 flex items-center justify-center text-brand-cream transition-colors group-hover:border-brand-orange group-hover:text-brand-orange">
                            <ArrowUpRight size={14} />
                          </span>
                        </div>
                        <p className="mt-2 text-sm text-brand-cream/70">{c.desc}</p>
                      </div>
                    </div>
                  </Link>
                </StaggerItem>
              ))}
            </Stagger>
          </div>
        </SectionWrapper>

        {/* Testimonial */}
        <SectionWrapper theme="dark">
          <div className="container">
            <div className="grid md:grid-cols-2 gap-5">
              <div className="relative rounded-card overflow-hidden aspect-[4/5]">
                <Image
                  src="https://images.unsplash.com/photo-1602645803535-45caec9f2a3c?crop=entropy&cs=srgb&fm=jpg&q=85&w=1400"
                  alt=""
                  fill
                  sizes="50vw"
                  className="object-cover"
                />
              </div>
              <div className="flex flex-col justify-center">
                <Reveal>
                  <SectionTag>What clients feel</SectionTag>
                </Reveal>
                <Reveal delay={0.05}>
                  <blockquote className="mt-6 font-display text-display-md leading-tight uppercase text-balance">
                    &ldquo;They actually{" "}
                    <span className="text-brand-orange">answer emails</span>,
                    ship on time and their work looks like a Netflix
                    promo.&rdquo;
                  </blockquote>
                </Reveal>
                <Reveal delay={0.15}>
                  <p className="mt-6 opacity-70">
                    Head of Brand, DTC apparel — 3 launches, 12 films, one very
                    tired legal team.
                  </p>
                </Reveal>
              </div>
            </div>
          </div>
        </SectionWrapper>

        <GetInTouchCTA />
      </main>
      <Footer />
    </>
  );
}
