'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  ArrowUpRight,
  Menu,
  X,
} from 'lucide-react'

import Logo from '../brands/Logo'
const links = [
  {
    label: 'Services',
    href: '/agency#services',
  },
  {
    label: 'Work',
    href: '/agency#work',
  },
  {
    label: 'Behind the Work',
    href: '/agency/behind-the-work',
  },
  {
    label: 'Vision',
    href: '/agency/vision',
  },
  {
    label: 'Careers',
    href: '/agency/careers',
  },
]

/* Main-site (ecosystem hub) navigation */
const mainLinks = [
  {
    label: 'Ecosystem',
    href: '/#ecosystem',
  },
  {
    label: 'Agency',
    href: '/agency',
  },
  {
    label: 'Vision',
    href: '/agency/vision',
  },
  {
    label: 'Careers',
    href: '/agency/careers',
  },
]

const cta = {
  label: 'Get in touch',
  href: '/agency/get-in-touch',
}

const contactHref = '/agency/book-a-call'

export default function Navbar({ variant = 'agency', initialTheme = 'dark' }) {
  const pathname = usePathname()
  const isMain = variant === 'utility' || variant === 'main'
  const navLinks = isMain ? mainLinks : links
  const homeHref = isMain ? '/' : '/agency'

  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [dark, setDark] = useState(initialTheme === 'dark')

  /*
   * ---------------------------------------------------------
   * SCROLL STATE
   * ---------------------------------------------------------
   */

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30)
    }

    handleScroll()

    window.addEventListener('scroll', handleScroll, {
      passive: true,
    })

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])


  /*
   * ---------------------------------------------------------
   * DETECT SECTION THEME
   *
   * The navbar follows the section currently underneath it.
   * Sections should use:
   *
   * <section data-theme="dark">
   * <section data-theme="light">
   * <section data-theme="cream">
   * ---------------------------------------------------------
   */

  useEffect(() => {
    const updateTheme = () => {
      const nav = document.querySelector('nav[data-navbar]')

      if (!nav) return

      const navRect = nav.getBoundingClientRect()
      const probeY = navRect.bottom + 4

      const sections = Array.from(
        document.querySelectorAll('[data-theme]')
      )

      let activeSection = null

      for (const section of sections) {
        const rect = section.getBoundingClientRect()

        if (
          rect.top <= probeY &&
          rect.bottom >= probeY
        ) {
          activeSection = section
          break
        }
      }

      if (!activeSection) return

      const theme =
        activeSection.getAttribute('data-theme')

      setDark(theme === 'dark')
    }

    updateTheme()

    window.addEventListener(
      'scroll',
      updateTheme,
      { passive: true }
    )

    window.addEventListener(
      'resize',
      updateTheme
    )

    return () => {
      window.removeEventListener(
        'scroll',
        updateTheme
      )

      window.removeEventListener(
        'resize',
        updateTheme
      )
    }
  }, [])


  /*
   * ---------------------------------------------------------
   * CLOSE MOBILE MENU ON ROUTE CHANGE
   * ---------------------------------------------------------
   */

  useEffect(() => {
    setOpen(false)
  }, [pathname])


  /*
   * ---------------------------------------------------------
   * LOCK BODY WHEN MOBILE MENU IS OPEN
   * ---------------------------------------------------------
   */

  useEffect(() => {
    if (!open) {
      document.body.style.overflow = ''
      return
    }

    document.body.style.overflow = 'hidden'

    return () => {
      document.body.style.overflow = ''
    }
  }, [open])


  /*
   * ---------------------------------------------------------
   * THEME CLASSES
   * ---------------------------------------------------------
   */

  const navClass = dark
    ? `
      border-brand-cream/10
      bg-brand-black/80
      text-brand-cream
      backdrop-blur-xl
    `
    : `
      border-brand-black/10
      bg-brand-cream/90
      text-brand-black
      backdrop-blur-xl
    `

  const logoVariant = dark
    ? 'orange'
    : 'ink'


  return (
    <>
      {/* =====================================================
          DESKTOP / MAIN NAVBAR
      ===================================================== */}

      <motion.header
        initial={{
          y: -20,
          opacity: 0,
        }}
        animate={{
          y: 0,
          opacity: 1,
        }}
        transition={{
          duration: 0.8,
          ease: [0.22, 1, 0.36, 1],
        }}
        className="
          fixed
          inset-x-0
          top-4
          z-50
          flex
          justify-center
          px-4
          md:top-5
          md:px-5
        "
      >

        <nav
          data-navbar
          className={`
            relative
            flex
            h-[48px]
            w-full
            max-w-[1380px]
            items-center
            rounded-full
            border
            px-1.5
            transition-all
            duration-500
            ease-smooth

            md:h-[50px]
            md:px-2

            ${navClass}

            ${
              scrolled
                ? `
                  shadow-[0_12px_45px_rgba(26,9,7,0.18)]
                `
                : ''
            }
          `}
        >

          {/* =================================================
              LOGO
          ================================================= */}

          <Logo
            href={homeHref}
            variant={logoVariant}
            size="sm"
            priority
            className="relative z-20 ml-0.5"
          />


          {/* =================================================
              DESKTOP NAV LINKS
          ================================================= */}

          <div
            className="
              mx-auto
              hidden
              lg:flex
              lg:items-center
            "
          >
            <div className="flex items-center">

              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="
                    group
                    relative
                    rounded-full
                    px-3
                    py-2
                    text-[11px]
                    font-semibold
                    uppercase
                    tracking-[0.08em]
                    text-current
                    opacity-65
                    transition-all
                    duration-300
                    hover:opacity-100

                    xl:px-4
                    xl:text-[12px]
                  "
                >

                  <span className="relative z-10">
                    {link.label}
                  </span>

                  <span
                    className="
                      absolute
                      inset-0
                      rounded-full
                      bg-current/[0.045]
                      opacity-0
                      transition-opacity
                      duration-300
                      group-hover:opacity-100
                    "
                  />

                </Link>
              ))}

            </div>
          </div>


          {/* =================================================
              RIGHT ACTIONS
          ================================================= */}

          <div className="
            ml-auto
            flex
            items-center
            gap-1.5
          ">

            {/* ---------------------------------------------
                GET IN TOUCH
            --------------------------------------------- */}

            <Link
              href={cta.href}
              className="
                group
                hidden
                h-[34px]
                items-center
                gap-2
                rounded-full
                bg-brand-orange
                px-4
                text-[11px]
                font-bold
                uppercase
                tracking-[0.045em]
                text-brand-cream
                transition-all
                duration-300

                hover:-translate-y-[1px]
                hover:bg-brand-orangeHover
                hover:shadow-[0_6px_24px_rgba(255,90,31,0.28)]

                md:inline-flex
              "
            >

              <span>
                {cta.label}
              </span>

              <ArrowUpRight
                size={13}
                strokeWidth={2}
                className="
                  transition-transform
                  duration-300
                  group-hover:-translate-y-[1px]
                  group-hover:translate-x-[1px]
                "
              />

            </Link>


            {/* ---------------------------------------------
                CONTACT
            --------------------------------------------- */}

            <Link
              href={contactHref}
              className={`
                hidden
                h-[34px]
                items-center
                gap-2
                rounded-full
                border
                px-4
                text-[11px]
                font-semibold
                uppercase
                tracking-[0.09em]
                transition-all
                duration-300

                xl:inline-flex

                ${
                  dark
                    ? `
                      border-brand-cream/10
                      bg-brand-cream/[0.015]
                      text-brand-cream/70
                      hover:border-brand-cream/20
                      hover:text-brand-cream
                    `
                    : `
                      border-brand-black/10
                      bg-brand-black/[0.02]
                      text-brand-black/70
                      hover:border-brand-black/20
                      hover:text-brand-black
                    `
                }
              `}
            >

              <span
                className="
                  h-[5px]
                  w-[5px]
                  shrink-0
                  rounded-full
                  bg-brand-orange
                "
              />

              <span>
                Contact
              </span>

            </Link>


            {/* ---------------------------------------------
                MOBILE MENU BUTTON
            --------------------------------------------- */}

            <button
              type="button"
              onClick={() => setOpen(true)}
              aria-label="Open navigation menu"
              aria-expanded={open}
              className={`
                flex
                h-[36px]
                w-[36px]
                items-center
                justify-center
                rounded-full
                border
                transition-colors
                duration-300
                lg:hidden

                ${
                  dark
                    ? `
                      border-brand-cream/10
                      text-brand-cream
                      hover:bg-brand-cream/5
                    `
                    : `
                      border-brand-black/10
                      text-brand-black
                      hover:bg-brand-black/5
                    `
                }
              `}
            >
              <Menu
                size={16}
                strokeWidth={1.8}
              />
            </button>

          </div>

        </nav>

      </motion.header>


      {/* =====================================================
          MOBILE MENU
      ===================================================== */}

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: 1,
            }}
            exit={{
              opacity: 0,
            }}
            className="
              fixed
              inset-0
              z-[100]
              bg-brand-dark
              text-brand-cream
              lg:hidden
            "
          >

            {/* ---------------------------------------------
                MOBILE HEADER
            --------------------------------------------- */}

            <div
              className="
                flex
                h-[72px]
                items-center
                justify-between
                px-5
              "
            >

              <span onClick={() => setOpen(false)}>
                <Logo href={homeHref} variant="orange" size="sm" />
              </span>


              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close navigation menu"
                className="
                  flex
                  h-10
                  w-10
                  items-center
                  justify-center
                  rounded-full
                  border
                  border-brand-cream/10
                  text-brand-cream
                "
              >
                <X
                  size={18}
                  strokeWidth={1.7}
                />
              </button>

            </div>


            {/* ---------------------------------------------
                MOBILE LINKS
            --------------------------------------------- */}

            <motion.div
              initial={{
                opacity: 0,
                y: 20,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                delay: 0.1,
                duration: 0.6,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="
                flex
                flex-col
                px-6
                pt-12
              "
            >

              {navLinks.map((link, index) => (
                <motion.div
                  key={link.href}
                  initial={{
                    opacity: 0,
                    y: 15,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  transition={{
                    delay:
                      0.12 + index * 0.06,
                    duration: 0.5,
                  }}
                >
                  <Link
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="
                      flex
                      items-center
                      justify-between
                      border-b
                      border-brand-cream/10
                      py-5
                      font-display
                      text-[2.2rem]
                      font-black
                      uppercase
                      leading-none
                    "
                  >

                    <span>
                      {link.label}
                    </span>

                    <ArrowUpRight
                      size={22}
                      strokeWidth={1.5}
                      className="text-brand-orange"
                    />

                  </Link>
                </motion.div>
              ))}


              {/* -------------------------------------------
                  MOBILE CTA
              ------------------------------------------- */}

              <Link
                href={cta.href}
                onClick={() => setOpen(false)}
                className="
                  mt-8
                  flex
                  h-14
                  items-center
                  justify-center
                  gap-2
                  rounded-full
                  bg-brand-orange
                  text-xs
                  font-bold
                  uppercase
                  tracking-[0.08em]
                  text-brand-cream
                "
              >

                <span>
                  {cta.label}
                </span>

                <ArrowUpRight
                  size={16}
                />

              </Link>


              {/* -------------------------------------------
                  MOBILE CONTACT
              ------------------------------------------- */}

              <Link
                href={contactHref}
                onClick={() => setOpen(false)}
                className="
                  mt-3
                  flex
                  h-14
                  items-center
                  justify-center
                  gap-2
                  rounded-full
                  border
                  border-brand-cream/10
                  text-xs
                  font-bold
                  uppercase
                  tracking-[0.08em]
                  text-brand-cream/70
                "
              >

                <span
                  className="
                    h-1.5
                    w-1.5
                    rounded-full
                    bg-brand-orange
                  "
                />

                Contact

              </Link>

            </motion.div>

          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}