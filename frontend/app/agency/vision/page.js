"use client";

import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/navigation/Navbar";
import Footer from "@/components/layout/Footer";
import SectionWrapper from "@/components/layout/SectionWrapper";
import SectionTag from "@/components/ui/SectionTag";
import Reveal, { Stagger, StaggerItem } from "@/components/motion/Reveal";
import { TEAM } from "@/data/content";
import { ArrowUpRight } from "lucide-react";

export default function VisionPage() {
  return (
    <>
      {/* Vision uses a minimal nav per plan \u00a73: logo + Contact pill only */}
      <header className="fixed top-4 md:top-5 left-0 right-0 z-50 flex justify-center px-4">
        <div className="glass-nav glass-nav-light rounded-full pl-5 pr-2 py-2 flex items-center gap-3 shadow-brand-soft max-w-5xl w-full">
          <Link
            href="/"
            className="flex items-center gap-2 font-display font-bold tracking-tight text-[0.95rem]"
          >
            <span className="inline-block w-6 h-6 rounded-md border-[1.5px] border-current relative overflow-hidden">
              <span className="absolute inset-0.5 bg-brand-orange rounded-[3px]" />
            </span>
            <span className="hidden sm:inline">OCT20FIVE</span>
          </Link>
          <span className="opacity-40 text-xs tracking-[0.25em] uppercase ml-4 hidden md:inline">
            Vision
          </span>
          <Link
            href="/agency/get-in-touch"
            className="ml-auto inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-brand-orange text-white text-[0.85rem] font-semibold hover:bg-brand-orangeHover transition-colors"
          >
            Get in Touch <ArrowUpRight size={14} />
          </Link>
        </div>
      </header>
      <main>
        <SectionWrapper theme="light" className="!pt-40">
          <div className="container">
            <div className="grid md:grid-cols-12 gap-10">
              <div className="md:col-span-7">
                <Reveal>
                  <SectionTag>Core Members</SectionTag>
                </Reveal>
                <Reveal delay={0.05}>
                  <h1 className="mt-6 font-display uppercase leading-[0.9] tracking-tight text-display-2xl text-balance">
                    The people who{" "}
                    <span className="text-brand-orange">made this</span>{" "}
                    possible.
                  </h1>
                </Reveal>
              </div>
              <div className="md:col-span-5">
                <Reveal delay={0.15}>
                  <div className="relative aspect-[4/3] rounded-card overflow-hidden">
                    <Image
                      src="https://images.unsplash.com/photo-1573867607590-361ea324975e?crop=entropy&cs=srgb&fm=jpg&q=85&w=1400"
                      alt="OCT20FIVE core team"
                      fill
                      sizes="50vw"
                      className="object-cover"
                    />
                  </div>
                </Reveal>
              </div>
            </div>
          </div>
        </SectionWrapper>

        <SectionWrapper theme="light" className="!pt-4">
          <div className="container">
            <Stagger className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {TEAM.map((m) => (
                <StaggerItem key={m.name}>
                  <article className="brand-card group h-full">
                    <div className="aspect-square rounded-icon overflow-hidden mb-5 bg-[radial-gradient(circle_at_30%_20%,#FF5A1F,#1A0907)] relative">
                      <div className="absolute inset-0 grain" />
                      <div className="absolute inset-0 flex items-center justify-center font-display text-6xl text-white/30 uppercase">
                        {m.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </div>
                    </div>
                    <h3 className="font-display text-xl leading-tight">
                      {m.name}
                    </h3>
                    <p className="mt-1 text-sm opacity-70">{m.role}</p>
                  </article>
                </StaggerItem>
              ))}
            </Stagger>
          </div>
        </SectionWrapper>

        <SectionWrapper theme="dark">
          <div className="container">
            <div className="grid md:grid-cols-12 gap-14">
              <div className="md:col-span-5">
                <Reveal>
                  <SectionTag>Our Vision</SectionTag>
                </Reveal>
                <Reveal delay={0.05}>
                  <h2 className="mt-6 font-display uppercase leading-[0.9] tracking-tight text-display-xl text-balance">
                    We all started <br /> this{" "}
                    <span className="text-brand-orange">creative</span>{" "}
                    agency...
                  </h2>
                </Reveal>
              </div>
              <div className="md:col-span-7 space-y-6 text-body-lg opacity-80 leading-relaxed">
                <Reveal>
                  <p>
                    We started OCT20FIVE Agency because we wanted to give people
                    the quality they actually deserve, not the low-effort work
                    they&rsquo;ve learned to settle for. A one-stop creative
                    solution where people don&rsquo;t have to contact different
                    agencies for different services, where ideas don&rsquo;t get
                    lost between different people and different directions.
                  </p>
                </Reveal>
                <Reveal delay={0.1}>
                  <p>
                    That&rsquo;s why we believe in{" "}
                    <span className="text-brand-orange font-medium">
                      FULL SPECTRUM CREATIVE SERVICES
                    </span>
                    , and that&rsquo;s what makes OCT20FIVE Agency.
                  </p>
                </Reveal>
                <Reveal delay={0.2}>
                  <p>
                    But beyond the work, we also saw creatives around us fall
                    apart, brilliant ideas buried under miscommunication,
                    unhealthy workflows, and impossible timelines. We
                    didn&rsquo;t want that. Not for clients, not for creatives,
                    not for ourselves. That&rsquo;s our vision.
                  </p>
                </Reveal>
              </div>
            </div>
          </div>
        </SectionWrapper>

        <SectionWrapper theme="dark" className="!pt-0">
          <div className="container">
            <div className="rounded-card border border-white/10 p-10 md:p-20 relative overflow-hidden text-center">
              <div className="absolute -bottom-32 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-radial-orange blur-3xl opacity-70" />
              <div className="relative">
                <Reveal>
                  <SectionTag>Our Mission</SectionTag>
                </Reveal>
                <Reveal delay={0.05}>
                  <h2 className="mt-6 font-display uppercase leading-[0.9] tracking-tight text-display-xl text-balance">
                    We just have one mission... <br />{" "}
                    <span className="text-brand-orange">
                      Concept. Create. Deliver.
                    </span>{" "}
                    <br /> That&rsquo;s all.
                  </h2>
                </Reveal>
              </div>
            </div>
          </div>
        </SectionWrapper>
      </main>
      <Footer />
    </>
  );
}
