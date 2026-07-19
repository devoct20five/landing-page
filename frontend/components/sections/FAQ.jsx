'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, ArrowRight } from 'lucide-react'
import SectionWrapper from '@/components/layout/SectionWrapper'
import SectionTag from '@/components/ui/SectionTag'
import Reveal from '@/components/motion/Reveal'
import MagneticButton from '@/components/motion/MagneticButton'
import { FAQS } from '@/data/content'

export default function FAQ({ theme = 'dark', items = FAQS }) {
  const [open, setOpen] = useState(0)
  return (
    <SectionWrapper theme={theme} id="faqs">
      <div className="container">
        <div className="grid md:grid-cols-12 gap-10">
          <div className="md:col-span-5">
            <Reveal><SectionTag>FAQs</SectionTag></Reveal>
            <Reveal delay={0.05}>
              <h2 className="mt-6 font-display uppercase leading-[0.9] tracking-tight text-display-xl text-balance">
                Have a <br /> <span className="italic font-medium normal-case tracking-tight text-brand-orange">different</span> <br /> question?
              </h2>
            </Reveal>
            <Reveal delay={0.12}>
              <p className="mt-6 opacity-75 max-w-md">Still curious? Our team is ready to help with any questions about our services, pricing, or workflows.</p>
            </Reveal>
            <Reveal delay={0.2} className="mt-8">
              <MagneticButton href="/agency/get-in-touch" variant="ghost">Contact us <ArrowRight size={16} /></MagneticButton>
            </Reveal>
          </div>

          <div className="md:col-span-7">
            <p className="eyebrow mb-6"><span className="eyebrow-dot" /> Frequently Asked Questions</p>
            <ul className="divide-y" style={{ borderColor: 'var(--surface-border)' }}>
              {items.map((it, i) => (
                <li key={i} className="border-t last:border-b" style={{ borderColor: 'var(--surface-border)' }}>
                  <button
                    onClick={() => setOpen(open === i ? -1 : i)}
                    className="w-full flex items-center justify-between text-left py-6 gap-6 group"
                    aria-expanded={open === i}
                  >
                    <span className="font-display text-xl md:text-2xl leading-tight pr-4">{it.q}</span>
                    <motion.span
                      animate={{ rotate: open === i ? 45 : 0, backgroundColor: open === i ? '#FF5A1F' : 'transparent' }}
                      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                      className="shrink-0 w-10 h-10 rounded-full border flex items-center justify-center text-current group-hover:border-brand-orange"
                      style={{ borderColor: 'var(--surface-border)' }}
                    >
                      <Plus size={18} />
                    </motion.span>
                  </button>
                  <AnimatePresence initial={false}>
                    {open === i && (
                      <motion.div
                        key="content"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                        className="overflow-hidden"
                      >
                        <p className="pb-6 opacity-75 max-w-2xl leading-relaxed">{it.a}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </SectionWrapper>
  )
}
