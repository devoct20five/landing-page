'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'
import Image from 'next/image'
import { ChevronDown } from 'lucide-react'

export default function Hero({
  eyebrow = 'OCT20FIVE AGENCY',
  headline = 'FULL SPECTRUM CREATIVE SERVICES',
  subline = 'CONCEPT / CREATE / DELIVER',
  image,
  imageAlt = '',
  showScrollCue = true,
}) {
  const ref = useRef(null)

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  })

  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.12])
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '8%'])
  const contentOpacity = useTransform(
    scrollYProgress,
    [0, 0.65, 1],
    [1, 1, 0]
  )

  return (
    <section
      ref={ref}
      data-theme="dark"
      className="
        relative
        min-h-[100svh]
        w-full
        overflow-hidden
        bg-black
        text-white
      "
    >
      {/* =========================================================
          BACKGROUND
      ========================================================= */}

      <motion.div
        style={{ scale, y }}
        className="absolute inset-0 z-0"
      >
        {image && (
          <Image
            src={image}
            alt={imageAlt || 'OCT20FIVE production set'}
            fill
            priority
            sizes="100vw"
            className="object-cover object-center"
          />
        )}

        {/* Heavy cinematic darkening */}
        <div className="absolute inset-0 bg-black/65" />

        {/* Darker centre behind typography */}
        <div
          className="
            absolute inset-0
            bg-[radial-gradient(
              ellipse_at_center,
              rgba(0,0,0,0.15)_0%,
              rgba(0,0,0,0.58)_48%,
              rgba(0,0,0,0.88)_100%
            )]
          "
        />

        {/* Top / bottom cinematic falloff */}
        <div
          className="
            absolute inset-0
            bg-gradient-to-b
            from-black/75
            via-transparent
            to-black/85
          "
        />

        {/* Subtle orange atmospheric glow */}
        <div
          className="
            absolute
            left-1/2
            top-1/2
            h-[45vw]
            w-[70vw]
            -translate-x-1/2
            -translate-y-1/2
            rounded-full
            bg-brand-orange/[0.055]
            blur-[120px]
          "
        />
      </motion.div>

      {/* =========================================================
          CONTENT
      ========================================================= */}

      <motion.div
        style={{ opacity: contentOpacity }}
        className="
          relative
          z-10
          flex
          min-h-[100svh]
          flex-col
          items-center
          justify-center
          px-5
          pb-20
          pt-32
          text-center
        "
      >
        {/* -----------------------------------------
            EYEBROW
        ----------------------------------------- */}

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.8,
            delay: 0.25,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="
            mb-7
            text-[11px]
            font-medium
            uppercase
            tracking-[0.48em]
            text-brand-orange
            sm:text-xs
            md:mb-8
            md:text-sm
            md:tracking-[0.55em]
          "
        >
          {eyebrow}
        </motion.div>

        {/* -----------------------------------------
            MAIN HEADLINE
        ----------------------------------------- */}

        <h1
          className="
            max-w-[1100px]
            font-display
            font-black
            uppercase
            leading-[0.82]
            tracking-[-0.045em]
            text-white
          "
        >
          <span className="block overflow-hidden">
            <motion.span
              initial={{ y: '110%', opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{
                duration: 1,
                delay: 0.35,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="
                block
                text-[clamp(3.3rem,8.2vw,8rem)]
              "
            >
              FULL SPECTRUM
            </motion.span>
          </span>

          <span className="block overflow-hidden">
            <motion.span
              initial={{ y: '110%', opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{
                duration: 1,
                delay: 0.43,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="
                block
                text-[clamp(3.3rem,8.2vw,8rem)]
              "
            >
              CREATIVE SERVICES
            </motion.span>
          </span>
        </h1>

        {/* -----------------------------------------
            TAGLINE
        ----------------------------------------- */}

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.9,
            delay: 0.95,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="
            mt-9
            flex
            items-center
            justify-center
            gap-3
            text-[11px]
            font-medium
            uppercase
            tracking-[0.34em]
            text-white/90
            sm:gap-4
            sm:text-xs
            md:mt-10
            md:text-sm
            md:tracking-[0.42em]
          "
        >
          <span>CONCEPT</span>
          <span className="text-brand-orange">.</span>

          <span>CREATE</span>
          <span className="text-brand-orange">.</span>

          <span>DELIVER</span>
          <span className="text-brand-orange">.</span>
        </motion.div>
      </motion.div>

      {/* =========================================================
          SCROLL CUE
      ========================================================= */}

      {showScrollCue && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{
            delay: 1.55,
            duration: 1,
          }}
          className="
            absolute
            bottom-7
            left-1/2
            z-20
            flex
            -translate-x-1/2
            flex-col
            items-center
            gap-2
            md:bottom-8
          "
        >
          <span
            className="
              text-[8px]
              font-medium
              uppercase
              tracking-[0.35em]
              text-white/70
              md:text-[9px]
            "
          >
            Scroll Down
          </span>

          <motion.div
            animate={{
              y: [0, 7, 0],
              opacity: [0.6, 1, 0.6],
            }}
            transition={{
              duration: 1.8,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            <ChevronDown
              size={18}
              strokeWidth={1.5}
              className="text-brand-orange"
            />
          </motion.div>
        </motion.div>
      )}
    </section>
  )
}