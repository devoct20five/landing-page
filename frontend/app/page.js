"use client";

import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";
import { ArrowRight, ChevronDown, Lock } from "lucide-react";
import Navbar from "@/components/navigation/Navbar";
import Footer from "@/components/layout/Footer";
import SectionWrapper from "@/components/layout/SectionWrapper";
import SectionTag from "@/components/ui/SectionTag";
import Reveal, { Stagger, StaggerItem } from "@/components/motion/Reveal";
import { HOME_VERTICALS } from "@/data/content";

// corrected: TBA accent tokens don't exist in the brand palette yet —
// using these as placeholders until exact hex values are provided.
// The AGENCY card no longer uses this map since it renders the real
// logo mark, not a colored icon.
const ACCENT_BG = {
  gold: "bg-gradient-to-br from-amber-400/70 to-orange-500/40",
  red: "bg-gradient-to-br from-red-500/70 to-rose-600/40",
  purple: "bg-gradient-to-br from-purple-500/70 to-violet-600/40",
};

function HomeHero() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.22]);
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);

  return (
    <section
      data-theme="dark"
      ref={ref}
      className="section theme-dark relative min-h-[100svh] flex items-center overflow-hidden pt-24"
    >
      <motion.div style={{ scale, y }} className="absolute inset-0 z-0">
        <Image
          src="https://images.unsplash.com/photo-1655195215404-a89325e7dd3e?crop=entropy&cs=srgb&fm=jpg&q=85&w=2600"
          alt="OCT20FIVE cinematic hero"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-brand-black/60 via-brand-black/50 to-brand-black" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_60%,rgba(255,90,31,0.35),transparent_60%)]" />
      </motion.div>

      <div className="container relative z-10 text-center">
        {/* corrected: "Showcase" is the dominant hero element in the
            reference (huge script/italic), not a small subtitle. */}
        <h1 className="font-display italic font-black leading-[0.9] tracking-tight text-[clamp(3.5rem,14vw,13rem)]">
          <span className="block overflow-hidden">
            <motion.span
              initial={{ y: "105%" }}
              animate={{ y: 0 }}
              transition={{
                duration: 1.1,
                ease: [0.22, 1, 0.36, 1],
                delay: 0.25,
              }}
              className="inline-block"
            >
              Showcase
            </motion.span>
          </span>
        </h1>

        {/* corrected: "OCT20FIVE" is a small letter-spaced line under
            "Showcase", not the giant headline. */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.6 }}
          className="mt-4 font-display uppercase tracking-[0.4em] text-xs md:text-sm opacity-80"
        >
          O C T 2 0 F I V E
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.7 }}
          className="mt-3 font-display uppercase tracking-tight text-2xl md:text-4xl font-black"
        >
          A Creative Ecosystem
        </motion.p>

        {/* corrected: pipe separators, not slashes */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.9 }}
          className="mt-6 flex flex-wrap items-center justify-center gap-x-3 gap-y-2 text-sm md:text-base tracking-tight"
        >
          <span>We Create.</span>
          <span className="opacity-30">|</span>
          <span>We Build.</span>
          <span className="opacity-30">|</span>
          <span>We Evolve.</span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.6, duration: 1 }}
          className="absolute left-1/2 -translate-x-1/2 bottom-8 flex flex-col items-center gap-3"
        >
          {/* corrected: literal reference copy is "SCROLL DOWN" */}
          <span className="text-[0.65rem] tracking-[0.35em] uppercase opacity-60">
            Scroll down
          </span>
          <motion.span
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          >
            <ChevronDown size={20} className="text-brand-orange" />
          </motion.span>
        </motion.div>
      </div>
    </section>
  );
}

export default function HomePage() {
  return (
    <>
      <Navbar variant="utility" initialTheme="dark" />
      <main>
        <HomeHero />

        {/* Ecosystem grid — Home section 2 (light) per plan §3 */}
        <SectionWrapper theme="light">
          <div className="container">
            <div className="text-center max-w-4xl mx-auto">
              <Reveal>
                <SectionTag>OCT20FIVE</SectionTag>
              </Reveal>

              {/* corrected: two distinct lines — bold headline, then a
                  separate small tracked subheading flanked by dashes —
                  not one merged sentence with a color-split fragment. */}
              <Reveal delay={0.05}>
                <h2 className="mt-6 font-display uppercase leading-[0.95] tracking-tight text-display-xl text-balance">
                  A Creative Ecosystem
                </h2>
              </Reveal>
              <Reveal delay={0.12}>
                <p className="mt-5 flex items-center justify-center gap-4 text-xs md:text-sm tracking-[0.3em] uppercase opacity-60">
                  <span className="h-px w-8 bg-current opacity-40" />
                  Built for the future
                  <span className="h-px w-8 bg-current opacity-40" />
                </p>
              </Reveal>
            </div>

            <Stagger className="mt-16 grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {HOME_VERTICALS.map((v) => {
                const inner = (
                  <article
                    className={`brand-card h-full group relative ${v.locked ? "opacity-90" : ""}`}
                  >
                    {v.locked ? (
                      // corrected: TBA cards get a solid blurred-gradient
                      // color square, not a bordered lucide icon.
                      <div
                        className={`w-14 h-14 rounded-icon ${ACCENT_BG[v.accent] || ACCENT_BG.gold} blur-[1px]`}
                      />
                    ) : (
                      // corrected: AGENCY card icon is the real boxed
                      // OCT20FIVE logo mark, not a Compass icon.
                      <div className="w-14 h-14 rounded-icon bg-brand-orange flex items-center justify-center">
                        <span className="font-display font-black text-white text-[0.6rem] leading-[0.9] text-center">
                          OCT
                          <br />
                          20
                          <br />
                          FIVE
                        </span>
                      </div>
                    )}

                    <div className="mt-6 flex items-center gap-2">
                      <h3
                        className={`font-display text-2xl uppercase leading-tight ${v.locked ? "blur-[2px] select-none" : ""}`}
                      >
                        {v.title}
                      </h3>
                      <span
                        className={`text-[0.65rem] font-semibold tracking-[0.2em] px-2 py-0.5 rounded-pill ${v.tag === "LIVE" ? "bg-brand-orange text-white" : "bg-black/5 text-current opacity-60"}`}
                      >
                        {v.tag}
                      </span>
                    </div>
                    <p
                      className={`mt-3 opacity-70 text-[0.95rem] leading-relaxed ${v.locked ? "blur-[2px] select-none" : ""}`}
                    >
                      {v.body}
                    </p>
                    <div className="mt-8 flex items-center gap-2 text-sm font-semibold">
                      {v.locked ? (
                        <span className="inline-flex items-center gap-2 opacity-60">
                          <Lock size={14} /> Explore TBA
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-2 text-brand-orange">
                          Explore Agency{" "}
                          <ArrowRight
                            size={16}
                            className="transition-transform duration-500 ease-smooth group-hover:translate-x-2"
                          />
                        </span>
                      )}
                    </div>
                  </article>
                );
                return (
                  <StaggerItem key={v.title}>
                    {v.href && !v.locked ? (
                      <Link href={v.href}>{inner}</Link>
                    ) : (
                      inner
                    )}
                  </StaggerItem>
                );
              })}
            </Stagger>
          </div>
        </SectionWrapper>
      </main>
      <Footer />
    </>
  );
}
