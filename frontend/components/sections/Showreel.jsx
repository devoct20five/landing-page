'use client'

import Image from 'next/image'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { Play } from 'lucide-react'
import SectionWrapper from '@/components/layout/SectionWrapper'
import SectionTag from '@/components/ui/SectionTag'
import Reveal from '@/components/motion/Reveal'

export default function Showreel({ theme = 'light', id = 'showreel', image = 'https://images.unsplash.com/photo-1655195215404-a89325e7dd3e?crop=entropy&cs=srgb&fm=jpg&q=85&w=2400' }) {
  const [hover, setHover] = useState(false)
  return (
    <SectionWrapper theme={theme} id={id}>
      <div className="container">
        <Reveal className="mb-12 text-center"><SectionTag>Showreel</SectionTag></Reveal>
        <Reveal delay={0.05}>
          <motion.div
            onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
            className="relative aspect-[16/9] rounded-card overflow-hidden group cursor-pointer border"
            style={{ borderColor: 'var(--surface-border)' }}
            whileHover={{ scale: 1.005 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <motion.div
              animate={{ scale: hover ? 1.08 : 1 }}
              transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
              className="absolute inset-0"
            >
              <Image src={image} alt="OCT20FIVE showreel" fill sizes="100vw" className="object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/50 via-transparent to-brand-orange/10" />
            </motion.div>
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.button
                aria-label="Play showreel"
                whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}
                className="relative inline-flex items-center justify-center w-24 h-24 md:w-32 md:h-32 rounded-full bg-brand-orange text-white shadow-brand-glow"
              >
                <span className="absolute inset-0 rounded-full bg-brand-orange animate-ping-slow" />
                <Play size={38} className="relative translate-x-[2px]" fill="currentColor" />
              </motion.button>
            </div>
            <div className="absolute bottom-6 left-6 md:bottom-8 md:left-10 text-white">
              <p className="eyebrow border-white/30 text-white"><span className="eyebrow-dot" /> 2024 — 2025</p>
              <h3 className="mt-3 font-display text-3xl md:text-5xl uppercase leading-none">Work that moves</h3>
            </div>
          </motion.div>
        </Reveal>
      </div>
    </SectionWrapper>
  )
}
