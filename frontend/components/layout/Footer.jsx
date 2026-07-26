"use client";

import Link from "next/link";
import { Mail, Instagram, Linkedin, ArrowUpRight } from "lucide-react";

const AGENCY_NAVIGATE = [
  { label: "Services", href: "/agency#services" },
  { label: "Work", href: "/agency#work" },
  { label: "Behind the Work", href: "/agency/behind-the-work" },
  { label: "Vision", href: "/agency/vision" },
  { label: "Careers", href: "/agency/careers" },
  { label: "Newsroom", href: "#" },
];

const SERVICE_NAVIGATE = [
  { label: "Solution", href: "#solution" },
  { label: "Work", href: "#work" },
  { label: "Behind the Work", href: "/agency/behind-the-work" },
  { label: "Pricing", href: "#pricing" },
  { label: "FAQs", href: "#faqs" },
  { label: "Vision", href: "/agency/vision" },
  { label: "Newsroom", href: "#" },
];

const USEFUL_LINKS = [
  { label: "Contact Form", href: "/agency/get-in-touch" },
  { label: "Book a Call", href: "/agency/book-a-call" },
  { label: "Terms & Condition", href: "/agency/Term-&-Conditions" },
  { label: "Privacy Policy", href: "/agency/Privacy-Policy" },
  { label: "Refund & Cancellation", href: "/agency/Refund-&-Cancellation" },
];

export default function Footer({ variant = "agency" }) {
  const navLinks = variant === "service" ? SERVICE_NAVIGATE : AGENCY_NAVIGATE;

  return (
    <footer className="theme-dark relative overflow-hidden bg-brand-black">
      {/* subtle top divider */}

      <div className="absolute inset-x-0 top-0 h-px bg-brand-borderDark" />

      {/* background glow */}

      <div className="pointer-events-none absolute left-1/2 top-0 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-brand-orange/5 blur-[160px]" />

      <div className="container relative pt-36 pb-14">
        {/* ===============================
             LOGO
        ================================ */}

        <div className="mb-28 flex justify-center">
          <LogoMark />
        </div>

        {/* ===============================
            MAIN GRID
        ================================ */}

        <div
          className="
            grid
            gap-16
            xl:grid-cols-[1fr_1fr_1fr_1.35fr]
            lg:grid-cols-4
            md:grid-cols-2
          "
        >
          {/* ===============================
              NAVIGATION
          =============================== */}

          <div>
            <p className="mb-8 font-body text-eyebrow uppercase text-white/35">
              Navigate
            </p>

            <ul className="space-y-4">
              {navLinks.map((link) => (
                <li key={link.label}>
                  <FooterLink href={link.href}>{link.label}</FooterLink>
                </li>
              ))}
            </ul>
          </div>

          {/* ===============================
              CONTACT
          =============================== */}

          <div>
            <p className="mb-8 font-body text-eyebrow uppercase text-white/35">
              Get in touch
            </p>

            <ul className="space-y-5">
              <li>
                <FooterLink
                  href="mailto:hello@oct20five.com"
                  icon={<Mail size={14} strokeWidth={2} />}
                  iconClass="bg-brand-orange"
                >
                  hello@oct20five.com
                </FooterLink>
              </li>

              <li>
                <FooterLink
                  href="https://instagram.com"
                  external
                  icon={<Instagram size={14} strokeWidth={2} />}
                  iconStyle={{
                    background:
                      "linear-gradient(45deg,#f09433,#e6683c,#dc2743,#cc2366,#bc1888)",
                  }}
                >
                  Instagram
                </FooterLink>
              </li>

              <li>
                <FooterLink
                  href="https://linkedin.com"
                  external
                  icon={<Linkedin size={14} strokeWidth={2} />}
                  iconStyle={{
                    background: "#0A66C2",
                  }}
                >
                  LinkedIn
                </FooterLink>
              </li>
            </ul>
          </div>

          {/* ===============================
              USEFUL LINKS
          =============================== */}

          <div>
            <p className="mb-8 font-body text-eyebrow uppercase text-white/35">
              Useful Links
            </p>

            <ul className="space-y-4">
              {USEFUL_LINKS.map((link) => (
                <li key={link.label}>
                  <FooterLink href={link.href}>{link.label}</FooterLink>
                </li>
              ))}
            </ul>
          </div>

          {/* ===============================
              CTA CARD
          =============================== */}

          <div>
            <div className="relative overflow-hidden rounded-card border border-brand-borderDark bg-white/[0.03] p-10">
              <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-brand-orange/10 blur-[100px]" />

              <div className="relative">
                <span className="mb-5 inline-block font-body text-eyebrow uppercase text-brand-orange">
                  Careers
                </span>

                <h3 className="mb-6 max-w-xs font-display text-display-sm font-bold leading-[0.95] text-white">
                  Ready to build
                  <br />
                  something
                  <br />
                  unforgettable?
                </h3>

                <p className="mb-8 max-w-sm text-[15px] leading-7 text-white/60">
                  We are always looking for designers, developers, editors and
                  creators who genuinely care about building exceptional digital
                  experiences.
                </p>

                <Link
                  href="/agency/careers"
                  className="group inline-flex items-center gap-3 rounded-pill bg-brand-orange px-7 py-3 text-sm font-semibold text-white shadow-glow transition-all duration-600 ease-smooth hover:-translate-y-1 hover:bg-brand-orangeHover"
                >
                  Join our team
                  <ArrowUpRight
                    size={16}
                    className="transition-transform duration-600 ease-smooth group-hover:translate-x-1 group-hover:-translate-y-1"
                  />
                </Link>
              </div>
            </div>
          </div>
        </div>
        {/* ===============================
            FOOTER BOTTOM
        =============================== */}

        <div className="mt-24 border-t border-brand-borderDark pt-8">
          <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
            <p className="text-sm tracking-wide text-white/40">
              © {new Date().getFullYear()} OCT20FIVE. All rights reserved.
            </p>

            <div className="flex items-center gap-8 text-sm text-white/40">
              <Link
                href="/agency/Privacy-Policy"
                className="transition-colors duration-400 ease-smooth hover:text-white"
              >
                Privacy
              </Link>

              <Link
                href="/agency/Term-&-Conditions"
                className="transition-colors duration-400 ease-smooth hover:text-white"
              >
                Terms
              </Link>

              <Link
                href="/agency/Refund-&-Cancellation"
                className="transition-colors duration-400 ease-smooth hover:text-white"
              >
                Refund
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

/* ==========================================================
   LOGO
========================================================== */

function LogoMark() {
  return (
    <Link href="/" className="group relative inline-flex">
      {/* subtle glow */}

      <div className="pointer-events-none absolute inset-0 rounded-2xl bg-brand-orange/10 blur-3xl transition-opacity duration-700 group-hover:opacity-100" />

      <div
        className="
          relative
          overflow-hidden
          rounded-2xl
          border
          border-brand-borderDark
          bg-white/[0.02]
          px-10
          py-7
          backdrop-blur-xl
          transition-all
          duration-500
          ease-smooth
          group-hover:border-brand-orange/40
          group-hover:-translate-y-1
        "
      >
        <div className="font-display leading-[0.82] text-center">
          <div className="text-lg tracking-[0.18em] text-brand-orange">OCT</div>

          <div className="my-1 text-[64px] font-bold text-white">20</div>

          <div className="text-lg tracking-[0.18em] text-brand-orange">
            FIVE
          </div>
        </div>
      </div>
    </Link>
  );
}

/* ==========================================================
   FOOTER LINK
========================================================== */

function FooterLink({
  href,
  children,
  external = false,
  icon,
  iconClass = "",
  iconStyle,
}) {
  return (
    <Link
      href={href}
      {...(external
        ? {
            target: "_blank",
            rel: "noopener noreferrer",
          }
        : {})}
      className="group inline-flex items-center gap-3 text-[15px] text-white/55 transition-all duration-500 ease-smooth hover:text-white"
    >
      {icon && (
        <span
          className={`flex h-7 w-7 items-center justify-center rounded-lg text-white ${iconClass}`}
          style={iconStyle}
        >
          {icon}
        </span>
      )}

      <span className="relative overflow-hidden">
        <span className="block transition-transform duration-500 ease-smooth group-hover:-translate-y-full">
          {children}
        </span>

        <span
          className="
            absolute
            left-0
            top-full
            block
            text-white
            transition-transform
            duration-500
            ease-smooth
            group-hover:-translate-y-full
          "
        >
          {children}
        </span>
      </span>
    </Link>
  );
}
