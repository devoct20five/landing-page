"use client";

import Image from "next/image";
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

export default function BehindTheWorkPage() {
  return (
    <>
      <Navbar variant="utility" initialTheme="light" />
      <main>
        <SectionWrapper theme="light" className="!pt-40">
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
                  <p className="text-body-lg opacity-75 max-w-md">
                    The 6-stage rhythm behind every OCT20FIVE project — whether
                    it’s a 30-second social edit or a full brand relaunch.
                  </p>
                </Reveal>
              </div>
            </div>
          </div>
        </SectionWrapper>

        <SectionWrapper theme="peach" className="!pt-8">
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
