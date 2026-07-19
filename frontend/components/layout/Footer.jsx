'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowUpRight, Instagram, Linkedin, Youtube, Twitter } from 'lucide-react'

const DEFAULT_NAVIGATE = [
  { label: 'Home', href: '/' },
  { label: 'Agency', href: '/agency' },
  { label: 'About Us', href: '/agency/vision' },
  { label: 'Contact', href: '/agency/get-in-touch' },
]

const FULL_NAVIGATE = [
  { label: 'Solution', href: '#solution' },
  { label: 'Work', href: '#showreel' },
  { label: 'Behind the Work', href: '/agency/behind-the-work' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'FAQs', href: '#faqs' },
  { label: 'Vision', href: '/agency/vision' },
  { label: 'Newsroom', href: '#' },
]

export default function Footer({ variant = 'agency' }) {
  const navLinks = variant === 'service' ? FULL_NAVIGATE : DEFAULT_NAVIGATE
  return (
    <footer className="section theme-dark relative overflow-hidden pt-24 pb-10">
      {/* Ambient glow */}
      <div className="pointer-events-none absolute inset-0 opacity-70" aria-hidden>
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[80vw] h-[60vh] bg-radial-orange blur-3xl" />
      </div>
      <div className="container relative">
        <motion.h2
          initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="font-display text-display-xl uppercase tracking-tight text-balance leading-[0.9] mb-16"
        >
          Let&rsquo;s make <span className="text-brand-orange">something</span><br /> worth watching.
        </motion.h2>

        <div className="grid md:grid-cols-4 gap-10 md:gap-6 mb-16">
          <div>
            <p className="eyebrow mb-5"><span className="eyebrow-dot" /> Navigate</p>
            <ul className="space-y-2.5">
              {navLinks.map((l) => (
                <li key={l.label}><FooterLink href={l.href}>{l.label}</FooterLink></li>
              ))}
            </ul>
          </div>
          <div>
            <p className="eyebrow mb-5"><span className="eyebrow-dot" /> Get in touch</p>
            <ul className="space-y-2.5">
              <li><FooterLink href="mailto:hello@oct20five.com">hello@oct20five.com</FooterLink></li>
              <li><FooterLink href="/agency/book-a-call">Book a call</FooterLink></li>
              <li><FooterLink href="/agency/get-in-touch">Send a brief</FooterLink></li>
            </ul>
          </div>
          <div>
            <p className="eyebrow mb-5"><span className="eyebrow-dot" /> Useful Links</p>
            <ul className="space-y-2.5">
              <li><FooterLink href="/agency/vision">Vision & Mission</FooterLink></li>
              <li><FooterLink href="/agency/careers">Careers</FooterLink></li>
              <li><FooterLink href="#">Newsroom</FooterLink></li>
              <li><FooterLink href="#">Privacy</FooterLink></li>
            </ul>
          </div>
          <div>
            <div className="rounded-card border p-6 bg-white/[0.03] backdrop-blur-sm" style={{ borderColor: 'var(--surface-border)' }}>
              <p className="eyebrow mb-4"><span className="eyebrow-dot" /> Join us now</p>
              <h4 className="font-display text-xl mb-4 leading-tight">Get the drop on new work &amp; behind-the-scenes.</h4>
              <form className="flex gap-2" onSubmit={(e) => e.preventDefault()}>
                <input type="email" placeholder="your@email.com" className="brand-input text-sm py-2.5" />
                <button type="submit" className="btn btn-primary text-sm !py-2.5 !px-4"><ArrowUpRight size={14} /></button>
              </form>
              <div className="flex gap-2 mt-5">
                <SocialIcon href="#"><Instagram size={14} /></SocialIcon>
                <SocialIcon href="#"><Linkedin size={14} /></SocialIcon>
                <SocialIcon href="#"><Youtube size={14} /></SocialIcon>
                <SocialIcon href="#"><Twitter size={14} /></SocialIcon>
              </div>
            </div>
          </div>
        </div>

        {/* Big logo mark */}
        <div className="border-t border-white/10 pt-10">
          <div className="flex flex-col items-center gap-6">
            <div className="font-display text-[clamp(4rem,15vw,14rem)] font-black tracking-tighter leading-none text-center bg-gradient-to-b from-brand-cream/90 via-brand-cream/40 to-transparent bg-clip-text text-transparent select-none">
              OCT20FIVE
            </div>
            <div className="flex flex-col md:flex-row items-center justify-between w-full gap-3 text-xs opacity-60">
              <span>&copy; {new Date().getFullYear()} OCT20FIVE. All rights reserved.</span>
              <span>Concept. Create. Deliver.</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

function FooterLink({ href, children }) {
  return (
    <Link href={href} className="group inline-flex items-center gap-1 text-sm opacity-75 hover:opacity-100 transition">
      <span className="relative">
        {children}
        <span className="absolute left-0 -bottom-0.5 h-px w-0 group-hover:w-full bg-brand-orange transition-[width] duration-500 ease-apple" />
      </span>
    </Link>
  )
}

function SocialIcon({ href, children }) {
  return (
    <a href={href} className="btn-icon !w-8 !h-8 border-white/25 text-white/70 hover:!bg-brand-orange hover:!border-brand-orange hover:text-white">
      {children}
    </a>
  )
}
