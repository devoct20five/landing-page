'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, ArrowUpRight } from 'lucide-react'

import Logo from '@/components/ui/Logo'

/* =========================================================
   NAVIGATION DATA
========================================================= */

const NAV_LINKS = {
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

/* =========================================================
   COMPONENT
========================================================= */

export default function Navbar({
  variant = 'agency',
  ctaLabel,
  ctaHref,
  initialTheme = 'dark',
  contactHref = '/agency/get-in-touch',
}) {
  const pathname = usePathname()

  const [open, setOpen] = useState(false)
  const [theme, setTheme] = useState(initialTheme)
  const [scrolled, setScrolled] = useState(false)

  const links = NAV_LINKS[variant] ?? NAV_LINKS.agency

  const defaultCTA =
    variant === 'service'
      ? {
          label: 'Book a Call',
          href: '/agency/book-a-call',
        }
      : {
          label: 'Get in Touch',
          href: '/agency/get-in-touch',
        }

  const cta = {
    label: ctaLabel || defaultCTA.label,
    href: ctaHref || defaultCTA.href,
  }

  /* =====================================
      Detect Scroll
  ===================================== */

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 25)
    }

    window.addEventListener('scroll', handleScroll, {
      passive: true,
    })

    return () =>
      window.removeEventListener(
        'scroll',
        handleScroll
      )
  }, [])

  /* =====================================
      Detect Section Theme
  ===================================== */

  useEffect(() => {
    const sections = document.querySelectorAll(
      'section[data-theme]'
    )

    if (!sections.length) return

    const observer = new IntersectionObserver(
      (entries) => {
        let current = null

        entries.forEach((entry) => {
          if (!entry.isIntersecting) return

          if (
            !current ||
            entry.boundingClientRect.top <
              current.boundingClientRect.top
          ) {
            current = entry
          }
        })

        if (!current) return

        const sectionTheme =
          current.target.getAttribute('data-theme')

        setTheme(
          sectionTheme === 'dark'
            ? 'dark'
            : 'light'
        )
      },
      {
        rootMargin: '-90px 0px -70% 0px',
      }
    )

    sections.forEach((section) =>
      observer.observe(section)
    )

    return () => observer.disconnect()
  }, [pathname])

  const dark = theme === 'dark'

  const navClass = dark
    ? 'glass-nav glass-nav-dark'
    : 'glass-nav glass-nav-light'

  const logoVariant = dark ? 'dark' : 'light'

  return (
    <>
      <motion.header
        initial={{
          y: -30,
          opacity: 0,
        }}
        animate={{
          y: 0,
          opacity: 1,
        }}
        transition={{
          duration: 0.9,
          ease: [0.22, 1, 0.36, 1],
        }}
        className="
          fixed
          inset-x-0
          top-6
          z-50
          flex
          justify-center
          px-5
        "
      >
        <nav
          className={`
            ${navClass}
            relative
            flex
            h-[74px]
            w-full
            max-w-[1380px]
            items-center
            rounded-full
            border
            px-7
            transition-all
            duration-500
            ${
              scrolled
                ? 'shadow-[0_20px_60px_rgba(0,0,0,.18)]'
                : ''
            }
          `}
        >
          {/* ========= LOGO ========= */}

          <Logo
            variant={logoVariant}
            size="sm"
          />

          {/* Desktop Navigation continues in Part 2 */}
                    {/* =====================================
              DESKTOP NAVIGATION
          ===================================== */}

          <div className="mx-auto hidden items-center lg:flex">

            <div className="flex items-center gap-1 rounded-full border border-white/6 bg-white/[0.015] px-2 py-2">

              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="
                    group
                    relative
                    overflow-hidden
                    rounded-full
                    px-5
                    py-3
                    text-[14px]
                    font-medium
                    tracking-[-0.01em]
                    text-white/65
                    transition-all
                    duration-500
                    hover:text-white
                  "
                >
                  <span className="relative z-10">
                    {link.label}
                  </span>

                  {/* Hover Background */}

                  <span
                    className="
                      absolute
                      inset-0
                      scale-90
                      rounded-full
                      bg-white/[0.05]
                      opacity-0
                      transition-all
                      duration-500
                      group-hover:scale-100
                      group-hover:opacity-100
                    "
                  />

                  {/* Orange Line */}

                  <span
                    className="
                      absolute
                      bottom-2
                      left-5
                      h-[2px]
                      w-0
                      bg-brand-orange
                      transition-all
                      duration-500
                      group-hover:w-[calc(100%-40px)]
                    "
                  />
                </Link>
              ))}

            </div>

          </div>

          {/* =====================================
                RIGHT SIDE
          ===================================== */}

          <div className="ml-auto flex items-center gap-3">

            {/* CTA */}

            <Link
              href={cta.href}
              className="
                hidden
                md:inline-flex
                items-center
                gap-2
                rounded-full
                bg-brand-orange
                px-6
                py-3
                text-[14px]
                font-semibold
                text-white
                transition-all
                duration-500
                hover:-translate-y-1
                hover:bg-brand-orangeHover
                hover:shadow-brand-glow
              "
            >
              <span>{cta.label}</span>

              <ArrowUpRight
                size={16}
                className="
                  transition-transform
                  duration-500
                  group-hover:-translate-y-1
                  group-hover:translate-x-1
                "
              />
            </Link>

            {/* Contact Pill */}

            <Link
              href={contactHref}
              className={`
                hidden
                xl:inline-flex
                items-center
                gap-3
                rounded-full
                border
                px-5
                py-3
                text-[13px]
                font-semibold
                tracking-[0.18em]
                uppercase
                transition-all
                duration-500
                ${
                  dark
                    ? 'border-white/10 bg-white/[0.03] text-white/80 hover:bg-white/[0.06]'
                    : 'border-black/10 bg-black/[0.03] text-black/75 hover:bg-black/[0.05]'
                }
              `}
            >
              <span className="h-2 w-2 rounded-full bg-brand-orange shadow-[0_0_12px_#FF5A1F]" />

              Contact
            </Link>

            {/* Mobile Button */}

            <button
              onClick={() => setOpen(true)}
              className="
                flex
                h-12
                w-12
                items-center
                justify-center
                rounded-full
                border
                transition-all
                duration-500
                lg:hidden
              "
            >
              <Menu size={18} />
            </button>

          </div>

        </nav>

      </motion.header>

      {/* Mobile Menu continues in Part 3 */}
            {/* =====================================================
          MOBILE MENU
      ====================================================== */}

      <AnimatePresence>

        {open && (

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: .35 }}
            className="
              fixed
              inset-0
              z-[100]
              bg-brand-dark
              text-brand-cream
            "
          >

            {/* Background Glow */}

            <div className="pointer-events-none absolute left-1/2 top-0 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-brand-orange/10 blur-[160px]" />

            {/* Header */}

            <div className="relative flex items-center justify-between border-b border-white/10 px-7 py-7">

              <Logo
                variant="dark"
                size="md"
              />

              <button
                onClick={() => setOpen(false)}
                className="
                  flex
                  h-12
                  w-12
                  items-center
                  justify-center
                  rounded-full
                  border
                  border-white/10
                  transition-all
                  duration-500
                  hover:border-brand-orange
                  hover:text-brand-orange
                "
              >
                <X size={20} />
              </button>

            </div>

            {/* Navigation */}

            <motion.div

              variants={{
                visible: {
                  transition: {
                    staggerChildren: .08,
                  },
                },
              }}

              initial="hidden"

              animate="visible"

              className="
                flex
                flex-col
                px-8
                pt-14
              "

            >

              {links.map((link) => (

                <motion.div

                  key={link.href}

                  variants={{
                    hidden: {
                      opacity: 0,
                      y: 40,
                    },
                    visible: {
                      opacity: 1,
                      y: 0,
                    },
                  }}

                >

                  <Link

                    href={link.href}

                    onClick={() => setOpen(false)}

                    className="
                      group
                      flex
                      items-center
                      justify-between
                      border-b
                      border-white/8
                      py-7
                    "

                  >

                    <span
                      className="
                        font-display
                        text-[42px]
                        leading-none
                        tracking-[-0.03em]
                        transition-colors
                        duration-500
                        group-hover:text-brand-orange
                      "
                    >
                      {link.label}
                    </span>

                    <ArrowUpRight
                      size={22}
                      className="
                        transition-all
                        duration-500
                        group-hover:-translate-y-1
                        group-hover:translate-x-1
                        group-hover:text-brand-orange
                      "
                    />

                  </Link>

                </motion.div>

              ))}

              {/* CTA */}

              <motion.div

                variants={{
                  hidden: {
                    opacity: 0,
                    y: 40,
                  },
                  visible: {
                    opacity: 1,
                    y: 0,
                  },
                }}

                className="mt-12 flex flex-col gap-5"

              >

                <Link

                  href={cta.href}

                  onClick={() => setOpen(false)}

                  className="
                    inline-flex
                    w-fit
                    items-center
                    gap-3
                    rounded-full
                    bg-brand-orange
                    px-8
                    py-4
                    font-semibold
                    text-white
                    transition-all
                    duration-500
                    hover:-translate-y-1
                    hover:bg-brand-orangeHover
                  "

                >

                  {cta.label}

                  <ArrowUpRight size={18} />

                </Link>

                <Link

                  href={contactHref}

                  onClick={() => setOpen(false)}

                  className="
                    inline-flex
                    w-fit
                    items-center
                    gap-3
                    rounded-full
                    border
                    border-white/10
                    px-8
                    py-4
                    font-semibold
                    text-white/75
                    transition-all
                    duration-500
                    hover:border-brand-orange
                    hover:text-white
                  "

                >

                  Contact

                </Link>

              </motion.div>

            </motion.div>

          </motion.div>

        )}

      </AnimatePresence>

    </>

  )

}