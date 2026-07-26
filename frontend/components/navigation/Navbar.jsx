"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ArrowUpRight } from "lucide-react";

import Logo from "@/components/ui/Logo";

/* =========================================================
   NAVIGATION DATA
========================================================= */

const NAV_LINKS = {
  agency: [
    { label: "Services", href: "/agency#services" },
    { label: "Work", href: "/agency#showreel" },
    { label: "Behind the Work", href: "/agency/behind-the-work" },
    { label: "Vision", href: "/agency/vision" },
    { label: "Careers", href: "/agency/careers" },
  ],

  service: [
    { label: "Solution", href: "#solution" },
    { label: "Work", href: "#showreel" },
    { label: "Behind the Work", href: "#behind" },
    { label: "Pricing", href: "#pricing" },
    { label: "FAQs", href: "#faqs" },
  ],

  utility: [
    { label: "Services", href: "/agency#services" },
    { label: "Work", href: "/agency#showreel" },
    { label: "Behind the Work", href: "/agency/behind-the-work" },
    { label: "Vision", href: "/agency/vision" },
    { label: "Careers", href: "/agency/careers" },
  ],

  minimal: [],
};

/* =========================================================
   COMPONENT
========================================================= */

export default function Navbar({
  variant = "agency",
  ctaLabel,
  ctaHref,
  initialTheme = "dark",
  contactHref = "/agency/get-in-touch",
}) {
  const pathname = usePathname();

  const [open, setOpen] = useState(false);
  const [theme, setTheme] = useState(initialTheme);
  const [scrolled, setScrolled] = useState(false);

  const links = NAV_LINKS[variant] ?? NAV_LINKS.agency;

  const defaultCTA =
    variant === "service"
      ? {
          label: "Book a Call",
          href: "/agency/book-a-call",
        }
      : {
          label: "Get in Touch",
          href: "/agency/get-in-touch",
        };

  const cta = {
    label: ctaLabel || defaultCTA.label,
    href: ctaHref || defaultCTA.href,
  };

  /* =====================================
      Detect Scroll
  ===================================== */

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 25);
    };

    window.addEventListener("scroll", handleScroll, {
      passive: true,
    });

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  /* =====================================
      Detect Section Theme
  ===================================== */

  useEffect(() => {
    const sections = document.querySelectorAll("section[data-theme]");

    if (!sections.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        let current = null;

        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          if (
            !current ||
            entry.boundingClientRect.top < current.boundingClientRect.top
          ) {
            current = entry;
          }
        });

        if (!current) return;

        const sectionTheme = current.target.getAttribute("data-theme");

        setTheme(sectionTheme === "dark" ? "dark" : "light");
      },
      {
        rootMargin: "-90px 0px -70% 0px",
      },
    );

    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, [pathname]);

  const dark = theme === "dark";

  const navClass = dark
    ? "glass-nav glass-nav-dark"
    : "glass-nav glass-nav-light";

  const logoVariant = dark ? "dark" : "light";

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
            rounded-pill
            border
            px-7
            transition-all
            duration-500
            ease-smooth
            ${scrolled ? "shadow-medium" : ""}
          `}
        >
          {/* ========= LOGO ========= */}

          <Logo variant={logoVariant} size="sm" />

          {/* Desktop Navigation continues in Part 2 */}
          {/* =====================================
              DESKTOP NAVIGATION
          ===================================== */}

          <div className="mx-auto hidden items-center lg:flex">
            <div className="flex items-center gap-1 rounded-pill border border-brand-borderDark bg-white/[0.015] px-2 py-2">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="
                    group
                    relative
                    overflow-hidden
                    rounded-pill
                    px-5
                    py-3
                    text-[14px]
                    font-medium
                    tracking-[-0.01em]
                    text-white/65
                    transition-all
                    duration-500
                    ease-smooth
                    hover:text-white
                  "
                >
                  <span className="relative z-10">{link.label}</span>

                  {/* Hover Background */}

                  <span
                    className="
                      absolute
                      inset-0
                      scale-90
                      rounded-pill
                      bg-white/[0.05]
                      opacity-0
                      transition-all
                      duration-500
                      ease-smooth
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
                      ease-smooth
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
                rounded-pill
                bg-brand-orange
                px-6
                py-3
                text-[14px]
                font-semibold
                text-white
                transition-all
                duration-500
                ease-smooth
                hover:-translate-y-1
                hover:bg-brand-orangeHover
                hover:shadow-glow
              "
            >
              <span>{cta.label}</span>

              <ArrowUpRight
                size={16}
                className="
                  transition-transform
                  duration-500
                  ease-smooth
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
                rounded-pill
                border
                px-5
                py-3
                font-body
                text-eyebrow
                uppercase
                transition-all
                duration-500
                ease-smooth
                ${
                  dark
                    ? "border-brand-borderDark bg-white/[0.03] text-white/80 hover:bg-white/[0.06]"
                    : "border-black/10 bg-black/[0.03] text-black/75 hover:bg-black/[0.05]"
                }
              `}
            >
              <span className="h-2 w-2 rounded-full bg-brand-orange shadow-glow" />
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
                ease-smooth
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
            transition={{ duration: 0.35 }}
            className="
              fixed
              inset-0
              z-[100]
              bg-brand-black
              text-brand-cream
            "
          >
            {/* Background Glow */}

            <div className="pointer-events-none absolute left-1/2 top-0 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-brand-orange/10 blur-[160px]" />

            {/* Header */}

            <div className="relative flex items-center justify-between border-b border-brand-borderDark px-7 py-7">
              <Logo variant="dark" size="md" />

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
                  border-brand-borderDark
                  transition-all
                  duration-500
                  ease-smooth
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
                    staggerChildren: 0.08,
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
                      border-brand-borderDark
                      py-7
                    "
                  >
                    <span
                      className="
                        font-display
                        text-display-sm
                        leading-none
                        tracking-[-0.03em]
                        transition-colors
                        duration-500
                        ease-smooth
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
                        ease-smooth
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
                    rounded-pill
                    bg-brand-orange
                    px-8
                    py-4
                    font-semibold
                    text-white
                    transition-all
                    duration-500
                    ease-smooth
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
                    rounded-pill
                    border
                    border-brand-borderDark
                    px-8
                    py-4
                    font-semibold
                    text-white/75
                    transition-all
                    duration-500
                    ease-smooth
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
  );
}
