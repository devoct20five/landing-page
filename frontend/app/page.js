"use client";

import Link from "next/link";
import Image from "next/image";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, ChevronDown, Lock } from "lucide-react";

import Navbar from "@/components/navigation/Navbar";
import Footer from "@/components/layout/Footer";
import SectionWrapper from "@/components/layout/SectionWrapper";
import SectionTag from "@/components/ui/SectionTag";
import Reveal, { Stagger, StaggerItem } from "@/components/motion/Reveal";

import { HOME_VERTICALS } from "@/data/content";

/* =========================================================
   Accent placeholders
========================================================= */

const ACCENT_BG = {
  gold: "from-amber-300 via-orange-300 to-amber-100",
  red: "from-red-400 via-rose-300 to-red-100",
  purple: "from-violet-400 via-fuchsia-300 to-violet-100",
};

/* =========================================================
   HERO
========================================================= */

function HomeHero() {
  const ref = useRef(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.15]);

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);

  return (
    <section
      ref={ref}
      data-theme="dark"
      className="
      relative
      flex
      min-h-screen
      items-center
      overflow-hidden
      bg-brand-black
      pt-24
      "
    >
      {/* Background */}

      <motion.div style={{ scale, y }} className="absolute inset-0">
        <Image
          fill
          priority
          sizes="100vw"
          alt="Hero"
          src="https://images.unsplash.com/photo-1655195215404-a89325e7dd3e?crop=entropy&cs=srgb&fm=jpg&q=90&w=2400"
          className="object-cover"
        />

        <div className="absolute inset-0 bg-black/55" />

        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/40 to-brand-black" />

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,90,31,.28),transparent_55%)]" />
      </motion.div>

      {/* Content */}

      <div className="container relative z-10 text-center">
        <motion.h1
          initial={{ opacity: 0, y: 120 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 1,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="
          font-display
          italic
          font-black
          leading-[0.82]
          tracking-tight
          text-[clamp(4rem,13vw,13rem)]
          text-white
          "
        >
          Showcase
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.45 }}
          className="
          mt-6
          text-[11px]
          uppercase
          tracking-[0.6em]
          text-white/70
          "
        >
          O C T 2 0 F I V E
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="
          mt-4
          font-display
          text-3xl
          font-black
          uppercase
          tracking-tight
          text-white
          md:text-5xl
          "
        >
          A Creative Ecosystem
        </motion.h2>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="
          mt-7
          flex
          flex-wrap
          items-center
          justify-center
          gap-4
          text-sm
          uppercase
          tracking-[0.12em]
          text-white/75
          "
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
          transition={{ delay: 1.3 }}
          className="
          absolute
          bottom-8
          left-1/2
          flex
          -translate-x-1/2
          flex-col
          items-center
          gap-2
          "
        >
          <span
            className="
            text-[10px]
            uppercase
            tracking-[0.45em]
            text-white/50
            "
          >
            Scroll Down
          </span>

          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{
              repeat: Infinity,
              duration: 1.8,
            }}
          >
            <ChevronDown size={20} className="text-brand-orange" />
          </motion.div>
        </motion.div>
      </div>
    </section>
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
        <HomeHero />

        {/* =====================================================
            ECOSYSTEM
        ===================================================== */}

        <SectionWrapper theme="light">
          <div className="relative mx-auto max-w-[1500px] px-6 lg:px-12">
            {/* Background glow */}

            <div className="pointer-events-none absolute inset-0 overflow-hidden">
              <div
                className="
                absolute
                left-1/2
                top-44
                h-[550px]
                w-[550px]
                -translate-x-1/2
                rounded-full
                bg-brand-orange/10
                blur-[170px]
                "
              />
            </div>

            {/* Heading */}

            <div className="relative mx-auto max-w-5xl text-center">
              <Reveal>
                <SectionTag>OCT20FIVE</SectionTag>
              </Reveal>

              <Reveal delay={0.05}>
                <h2
                  className="
                  mt-4
                  font-display
                  text-[clamp(3rem,6vw,5.5rem)]
                  font-black
                  uppercase
                  leading-none
                  tracking-[-0.04em]
                  text-brand-black
                  "
                >
                  A Creative Ecosystem
                </h2>
              </Reveal>

              <Reveal delay={0.15}>
                <div
                  className="
                  mt-3
                  flex
                  items-center
                  justify-center
                  gap-5
                  text-[12px]
                  uppercase
                  tracking-[0.4em]
                  text-black/45
                  "
                >
                  <span className="h-px w-10 bg-black/20" />
                  Built For The Future
                  <span className="h-px w-10 bg-black/20" />
                </div>
              </Reveal>
            </div>

            {/* =====================================================
    PREMIUM ECOSYSTEM GRID
===================================================== */}

            <Stagger
              className="
  relative
  mt-14
  grid
  gap-8
  lg:grid-cols-[1.15fr_1fr_1fr_1fr]
  "
            >
              {/* =====================================================
      AGENCY CARD
  ===================================================== */}

              <StaggerItem>
                <Link href="/agency">
                  <motion.article
                    whileHover={{
                      y: -10,
                      rotateX: 2,
                      rotateY: -2,
                    }}
                    transition={{
                      duration: 0.45,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    className="
        group
        relative
        h-full
        overflow-hidden
        rounded-[34px]
        border
        border-black/5
        bg-white
        p-9
        shadow-[0_20px_60px_rgba(0,0,0,.08)]
        "
                  >
                    {/* Glow */}

                    <div
                      className="
          absolute
          -right-20
          -top-20
          h-56
          w-56
          rounded-full
          bg-brand-orange/10
          blur-[80px]
          transition-all
          duration-700
          group-hover:scale-125
          "
                    />

                    {/* Logo */}

                    <div
                      className="
          relative
          flex
          h-20
          w-20
          items-center
          justify-center
          rounded-2xl
          bg-brand-orange
          shadow-lg
          "
                    >
                      <span
                        className="
            text-center
            font-display
            text-[14px]
            font-black
            leading-[0.85]
            text-white
            "
                      >
                        OCT
                        <br />
                        20
                        <br />
                        FIVE
                      </span>
                    </div>

                    {/* Content */}

                    <div className="mt-8">
                      <div className="flex items-center gap-3">
                        <h3
                          className="
              font-display
              text-[30px]
              font-black
              uppercase
              tracking-tight
              "
                        >
                          Agency
                        </h3>

                        <span
                          className="
              rounded-full
              bg-brand-orange
              px-3
              py-1
              text-[10px]
              font-bold
              uppercase
              tracking-[0.25em]
              text-white
              "
                        >
                          Live
                        </span>
                      </div>

                      <p
                        className="
            mt-5
            max-w-sm
            text-[15px]
            leading-8
            text-black/60
            "
                      >
                        Digital experiences, branding, design systems, websites
                        and products crafted for ambitious founders and modern
                        companies.
                      </p>
                    </div>

                    {/* Footer */}

                    <div
                      className="
          mt-12
          flex
          items-center
          justify-between
          "
                    >
                      <span
                        className="
            text-[13px]
            font-bold
            uppercase
            tracking-[0.22em]
            text-brand-orange
            "
                      >
                        Explore Agency
                      </span>

                      <div
                        className="
            flex
            h-12
            w-12
            items-center
            justify-center
            rounded-full
            bg-brand-orange
            transition-transform
            duration-500
            group-hover:translate-x-1
            "
                      >
                        <ArrowRight size={18} className="text-white" />
                      </div>
                    </div>
                  </motion.article>
                </Link>
              </StaggerItem>

              {/* =====================================================
      PART 1B-A ENDS HERE

      Next response:
      - Film
      - Labs
      - Originals
      - Closing </Stagger>
  ===================================================== */}
              {/* =====================================================
      FILM
  ===================================================== */}

              <StaggerItem>
                <motion.article
                  whileHover={{ y: -8 }}
                  transition={{ duration: 0.4 }}
                  className="
      group
      relative
      h-full
      overflow-hidden
      rounded-[34px]
      border
      border-black/5
      bg-white
      p-9
      shadow-[0_20px_60px_rgba(0,0,0,.08)]
      "
                >
                  <div
                    className="
        h-20
        w-20
        rounded-2xl
        bg-gradient-to-br
        from-amber-300
        via-orange-300
        to-yellow-100
        opacity-70
        blur-[8px]
        "
                  />

                  <div className="mt-8 flex items-center gap-3">
                    <h3 className="font-display text-[30px] font-black uppercase tracking-tight opacity-30">
                      Film
                    </h3>

                    <span className="rounded-full bg-black/5 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.25em] text-black/50">
                      TBA
                    </span>
                  </div>

                  <p className="mt-5 text-[15px] leading-8 text-black/35">
                    Original documentaries, cinematic stories, branded films and
                    visual narratives built for audiences that value exceptional
                    storytelling.
                  </p>

                  <div className="mt-12 flex items-center justify-between">
                    <span className="inline-flex items-center gap-2 text-[13px] font-bold uppercase tracking-[0.2em] text-black/40">
                      <Lock size={14} />
                      Coming Soon
                    </span>
                  </div>
                </motion.article>
              </StaggerItem>

              {/* =====================================================
      LABS
  ===================================================== */}

              <StaggerItem>
                <motion.article
                  whileHover={{ y: -8 }}
                  transition={{ duration: 0.4 }}
                  className="
      group
      relative
      h-full
      overflow-hidden
      rounded-[34px]
      border
      border-black/5
      bg-white
      p-9
      shadow-[0_20px_60px_rgba(0,0,0,.08)]
      "
                >
                  <div
                    className="
        h-20
        w-20
        rounded-2xl
        bg-gradient-to-br
        from-purple-400
        via-fuchsia-300
        to-violet-100
        opacity-70
        blur-[8px]
        "
                  />

                  <div className="mt-8 flex items-center gap-3">
                    <h3 className="font-display text-[30px] font-black uppercase tracking-tight opacity-30">
                      Labs
                    </h3>

                    <span className="rounded-full bg-black/5 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.25em] text-black/50">
                      TBA
                    </span>
                  </div>

                  <p className="mt-5 text-[15px] leading-8 text-black/35">
                    Experimental products, AI experiences, developer tools and
                    technology ventures currently under active development.
                  </p>

                  <div className="mt-12 flex items-center justify-between">
                    <span className="inline-flex items-center gap-2 text-[13px] font-bold uppercase tracking-[0.2em] text-black/40">
                      <Lock size={14} />
                      Coming Soon
                    </span>
                  </div>
                </motion.article>
              </StaggerItem>

              {/* =====================================================
      ORIGINALS
  ===================================================== */}

              <StaggerItem>
                <motion.article
                  whileHover={{ y: -8 }}
                  transition={{ duration: 0.4 }}
                  className="
      group
      relative
      h-full
      overflow-hidden
      rounded-[34px]
      border
      border-black/5
      bg-white
      p-9
      shadow-[0_20px_60px_rgba(0,0,0,.08)]
      "
                >
                  <div
                    className="
        h-20
        w-20
        rounded-2xl
        bg-gradient-to-br
        from-red-400
        via-rose-300
        to-red-100
        opacity-70
        blur-[8px]
        "
                  />

                  <div className="mt-8 flex items-center gap-3">
                    <h3 className="font-display text-[30px] font-black uppercase tracking-tight opacity-30">
                      Originals
                    </h3>

                    <span className="rounded-full bg-black/5 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.25em] text-black/50">
                      TBA
                    </span>
                  </div>

                  <p className="mt-5 text-[15px] leading-8 text-black/35">
                    Independent IPs, premium media properties, long-form
                    storytelling and creator-first entertainment built from the
                    ground up.
                  </p>

                  <div className="mt-12 flex items-center justify-between">
                    <span className="inline-flex items-center gap-2 text-[13px] font-bold uppercase tracking-[0.2em] text-black/40">
                      <Lock size={14} />
                      Coming Soon
                    </span>
                  </div>
                </motion.article>
              </StaggerItem>
            </Stagger>
          </div>
        </SectionWrapper>
      </main>

      <Footer />
    </>
  );
}
