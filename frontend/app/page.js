"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight, Film, FlaskConical, Lock, Sparkle } from "lucide-react";

import Navbar from "@/components/navigation/Navbar";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/sections/Hero";
import Logo from "@/components/brands/Logo";
import SectionWrapper from "@/components/layout/SectionWrapper";
import SectionTag from "@/components/ui/SectionTag";
import Reveal, { Stagger, StaggerItem } from "@/components/motion/Reveal";

/* =========================================================
   ECOSYSTEM — one live vertical, three on the way.
   Copy is unchanged from the original build.
========================================================= */

const VERTICALS = [
  {
    n: "01",
    key: "agency",
    title: "Agency",
    status: "Live",
    href: "/agency",
    cta: "Explore Agency",
    blurb:
      "Digital experiences, branding, design systems, websites and products crafted for ambitious founders and modern companies.",
  },
  {
    n: "02",
    key: "film",
    title: "Film",
    status: "TBA",
    icon: Film,
    blurb:
      "Original documentaries, cinematic stories, branded films and visual narratives built for audiences that value exceptional storytelling.",
  },
  {
    n: "03",
    key: "labs",
    title: "Labs",
    status: "TBA",
    icon: FlaskConical,
    blurb:
      "Experimental products, AI experiences, developer tools and technology ventures currently under active development.",
  },
  {
    n: "04",
    key: "originals",
    title: "Originals",
    status: "TBA",
    icon: Sparkle,
    blurb:
      "Independent IPs, premium media properties, long-form storytelling and creator-first entertainment built from the ground up.",
  },
];

/* Icon tile — rounded square, orange glyph (brand book "Icons", slide 22) */
function IconTile({ children, muted = false }) {
  return (
    <div
      className={`flex h-20 w-20 items-center justify-center rounded-tile border border-brand-border bg-gradient-to-br from-brand-peach to-brand-creamSoft shadow-soft ${
        muted ? "opacity-70" : ""
      }`}
    >
      {children}
    </div>
  );
}

function VerticalCard({ v }) {
  const live = v.status === "Live";
  const Icon = v.icon;

  const body = (
    <motion.article
      whileHover={live ? { y: -8 } : undefined}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className={`brand-card group flex h-full flex-col !p-9 ${
        live ? "brand-card-featured" : ""
      }`}
    >
      {/* soft orange bloom on the live card */}
      {live && (
        <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-brand-orange/15 blur-[80px] transition-transform duration-700 group-hover:scale-125" />
      )}

      <div className="relative flex items-start justify-between">
        {live ? (
          <IconTile>
            <Logo variant="orange" size={52} asLink={false} />
          </IconTile>
        ) : (
          <IconTile muted>
            <Icon size={32} strokeWidth={1.5} className="text-brand-orange" />
          </IconTile>
        )}
        <span className="font-display text-5xl font-black leading-none text-outline-ink">
          {v.n}
        </span>
      </div>

      <div className="relative mt-8 flex items-center gap-3">
        <h3
          className={`font-display text-[1.9rem] font-black uppercase leading-none tracking-tight ${
            live ? "" : "text-brand-black/45"
          }`}
        >
          {v.title}
        </h3>
        <span
          className={`rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-[0.2em] ${
            live
              ? "bg-brand-orange text-brand-cream"
              : "border border-brand-border text-brand-textSoft"
          }`}
        >
          {v.status}
        </span>
      </div>

      <p
        className={`relative mt-5 max-w-sm text-[15px] leading-7 ${
          live ? "text-brand-textSoft" : "text-brand-textSoft/80"
        }`}
      >
        {v.blurb}
      </p>

      <div className="relative mt-auto flex items-center justify-between pt-12">
        {live ? (
          <>
            <span className="text-[13px] font-bold uppercase tracking-[0.18em] text-brand-orange">
              {v.cta}
            </span>
            <span className="btn-icon transition-transform duration-500 group-hover:-translate-y-0.5 group-hover:translate-x-0.5">
              <ArrowUpRight size={18} strokeWidth={1.8} />
            </span>
          </>
        ) : (
          <span className="inline-flex items-center gap-2 text-[13px] font-bold uppercase tracking-[0.18em] text-brand-textSoft">
            <Lock size={14} />
            Coming Soon
          </span>
        )}
      </div>
    </motion.article>
  );

  return (
    <StaggerItem>
      {live ? (
        <Link href={v.href} className="block h-full" aria-label={`${v.title} — ${v.cta}`}>
          {body}
        </Link>
      ) : (
        body
      )}
    </StaggerItem>
  );
}

/* =========================================================
   PAGE
========================================================= */

export default function HomePage() {
  return (
    <>
      <Navbar variant="utility" initialTheme="dark" />

      <main>
        <Hero
          eyebrow="OCT20FIVE"
          headline="A Creative Ecosystem"
          description="Built for the future. One brand, many ways to create."
          subline="We Create. We Build. We Evolve."
          actions={
            <>
              <Link href="/agency" className="btn btn-primary">
                Explore Agency
                <ArrowUpRight size={16} strokeWidth={2} />
              </Link>
              <Link href="/agency/get-in-touch" className="btn btn-outline">
                Get in touch
              </Link>
            </>
          }
        />

        <SectionWrapper id="ecosystem" theme="light">
          <div className="relative mx-auto max-w-[1500px] px-6 lg:px-12">
            <div className="relative max-w-3xl">
              <Reveal>
                <SectionTag>The Ecosystem</SectionTag>
              </Reveal>

              <Reveal delay={0.05}>
                <h2 className="mt-6 font-display text-[clamp(2.75rem,6vw,5.5rem)] font-black uppercase leading-[0.95] tracking-[-0.02em] text-brand-black">
                  Built for the future<span className="text-brand-orange">.</span>
                </h2>
              </Reveal>
            </div>

            <Stagger className="relative mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-[1.15fr_1fr_1fr_1fr] lg:gap-8">
              {VERTICALS.map((v) => (
                <VerticalCard key={v.key} v={v} />
              ))}
            </Stagger>
          </div>
        </SectionWrapper>
      </main>

      <Footer />
    </>
  );
}
