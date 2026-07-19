'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, ArrowUpRight } from 'lucide-react'
import Logo from '@/components/ui/Logo'

// variants:
//   agency  -> Services, Work, Behind the Work, Vision, Careers  CTA Get in Touch
//   service -> Solution, Work, Behind the Work, Pricing, FAQs    CTA Book a Call
//   utility -> Services, Work, Behind the Work, Vision, Careers  CTA Get in Touch
const variantLinks = {
  agency: [
    { label: 'Services', href: '/agency#services' },
    { label: 'Work', href: '/agency#showreel' },
    { label: 'Behind the Work', href: '/agency/behind-the-work' },
    { label: 'Vision', href: '/agency/vision' },
    { label: 'Careers', href: '/agency/careers' },
  ],
  service: [
    { label: 'Solution', href: '#solution' },
    { label: 'Work', href: '#showreel' },
    { label: 'Behind the Work', href: '#behind' },
    { label: 'Pricing', href: '#pricing' },
    { label: 'FAQs', href: '#faqs' },
  ],
  utility: [
    { label: 'Services', href: '/agency#services' },
    { label: 'Work', href: '/agency#showreel' },
    { label: 'Behind the Work', href: '/agency/behind-the-work' },
    { label: 'Vision', href: '/agency/vision' },
    { label: 'Careers', href: '/agency/careers' },
  ],
  minimal: [],
}

export default function Navbar({ variant = 'agency', ctaLabel, ctaHref, initialTheme = 'dark' }) {
  const [scrolled, setScrolled] = useState(false)
  const [theme, setTheme] = useState(initialTheme) // 'dark' or 'light'
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  const links = variantLinks[variant] || variantLinks.agency
  const defaultCta = variant === 'service' ? { label: 'Book a Call', href: '/agency/book-a-call' } : { label: 'Get in Touch', href: '/agency/get-in-touch' }
  const cta = { label: ctaLabel || defaultCta.label, href: ctaHref || defaultCta.href }

  // Scroll listener for backdrop
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Theme awareness — read data-theme of section under navbar
  useEffect(() => {
    const sections = document.querySelectorAll('section[data-theme]')
    if (!sections.length) return
    const io = new IntersectionObserver((entries) => {
      // Find the section closest to the top that is intersecting
      let best = null
      entries.forEach((e) => {
        if (e.isIntersecting) {
          if (!best || e.boundingClientRect.top < best.boundingClientRect.top) best = e
        }
      })
      if (best) {
        const t = best.target.getAttribute('data-theme')
        setTheme(t === 'dark' ? 'dark' : 'light')
      }
    }, { rootMargin: '-80px 0px -75% 0px', threshold: 0 })
    sections.forEach((s) => io.observe(s))
    return () => io.disconnect()
  }, [pathname])

  const isDark = theme === 'dark'
  const glassCls = isDark ? 'glass-nav glass-nav-dark' : 'glass-nav glass-nav-light'

  return (
    <>
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
        className="fixed top-4 md:top-5 left-0 right-0 z-50 flex justify-center px-4"
      >
        <nav className={`${glassCls} flex items-center gap-2 rounded-full pl-4 pr-2 py-2 shadow-brand-soft transition-colors duration-500 max-w-5xl w-full`}>
          <Link href="/" className="flex items-center gap-2 font-display font-bold tracking-tight text-[0.95rem]" aria-label="OCT20FIVE">
            <span className="inline-block w-6 h-6 rounded-md border-[1.5px] border-current relative overflow-hidden">
              <span className="absolute inset-0.5 bg-brand-orange rounded-[3px]" />
            </span>
            <span className="hidden sm:inline">OCT20FIVE</span>
          </Link>
          <div className="hidden lg:flex items-center gap-1 mx-auto">
            {links.map((l) => (
              <Link key={l.href} href={l.href} className="relative px-3 py-2 text-[0.85rem] font-medium opacity-80 hover:opacity-100 transition-opacity group">
                {l.label}
                <span className="absolute left-3 right-3 bottom-1 h-[1.5px] scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-500 bg-brand-orange" />
              </Link>
            ))}
          </div>
          <Link
            href={cta.href}
            className="ml-auto lg:ml-0 inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-brand-orange text-white text-[0.85rem] font-semibold hover:bg-brand-orangeHover transition-colors"
          >
            {cta.label}
            <ArrowUpRight size={14} />
          </Link>
          <button className="lg:hidden ml-1 p-2" onClick={() => setOpen(true)} aria-label="Open menu">
            <Menu size={18} />
          </button>
        </nav>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-brand-dark text-brand-cream"
          >
            <div className="flex items-center justify-between p-6">
              <Logo size="md" />
              <button onClick={() => setOpen(false)} className="btn-icon" aria-label="Close menu"><X size={20} /></button>
            </div>
            <motion.div
              initial="hidden" animate="visible"
              variants={{ visible: { transition: { staggerChildren: 0.06 } } }}
              className="px-6 pt-8 flex flex-col gap-4"
            >
              {links.map((l) => (
                <motion.div key={l.href} variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}>
                  <Link onClick={() => setOpen(false)} href={l.href} className="font-display text-4xl font-bold tracking-tight">{l.label}</Link>
                </motion.div>
              ))}
              <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }} className="mt-8">
                <Link onClick={() => setOpen(false)} href={cta.href} className="btn btn-primary">{cta.label} <ArrowUpRight size={16} /></Link>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
