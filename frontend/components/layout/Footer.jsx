"use client";

import Link from "next/link";
import Logo from "@/components/brands/Logo";
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
  { label: "Terms & Condition", href: "/agency/terms-and-conditions" },
  { label: "Privacy Policy", href: "/agency/privacy-policy" },
  { label: "Refund & Cancellation", href: "/agency/refund-and-cancellation" },
];

export default function Footer({ variant = "agency" }) {
  const navLinks = variant === "service" ? SERVICE_NAVIGATE : AGENCY_NAVIGATE;

  return (
<footer className="relative overflow-hidden bg-brand-black text-brand-cream">
  {/* Background */}
  <div className="absolute inset-x-0 top-0 h-px bg-brand-cream/10" />
  <div className="pointer-events-none absolute left-1/2 top-0 h-[400px] w-[400px] -translate-x-1/2 rounded-full bg-brand-orange/5 blur-[150px]" />

  <div className="container relative py-16">
    {/* Top Divider */}
    <div className="mb-12 border-t border-brand-cream/10" />

    {/* Logo */}
    <div className="mb-14 flex justify-center">
      <LogoMark />
    </div>

    {/* Main Content */}
    <div className="grid gap-10 lg:grid-cols-[1fr_1fr_1fr_1.3fr]">

      {/* Navigation */}
      <div>
        <Heading>Navigate</Heading>

        <ul className="space-y-2.5">
          {navLinks.map((link) => (
            <li key={link.label}>
              <FooterLink href={link.href}>{link.label}</FooterLink>
            </li>
          ))}
        </ul>
      </div>

      {/* Contact */}
      <div>
        <Heading>Get In Touch</Heading>

        <ul className="space-y-3">
          <li>
            <FooterLink
              href="mailto:hello@oct20five.com"
              icon={<Mail size={14} />}
            >
              Email
            </FooterLink>
          </li>

          <li>
            <FooterLink
              href="https://instagram.com"
              external
              icon={<Instagram size={14} />}
            >
              Instagram
            </FooterLink>
          </li>

          <li>
            <FooterLink
              href="https://linkedin.com"
              external
              icon={<Linkedin size={14} />}
            >
              LinkedIn
            </FooterLink>
          </li>
        </ul>
      </div>

      {/* Useful Links */}
      <div>
        <Heading>Useful Links</Heading>

        <ul className="space-y-2.5">
          {USEFUL_LINKS.map((link) => (
            <li key={link.label}>
              <FooterLink href={link.href}>{link.label}</FooterLink>
            </li>
          ))}
        </ul>
      </div>

      {/* CTA */}
      <div>
        <div className="relative overflow-hidden rounded-2xl border border-brand-cream/10 bg-brand-cream/[0.02] p-7">

          <div className="absolute right-0 top-0 h-28 w-28 rounded-full bg-brand-orange/20 blur-3xl" />

          <h3 className="mb-4 text-3xl font-bold text-brand-cream">
            Join us now!
          </h3>

          <p className="mb-6 text-sm leading-7 text-brand-cream/60">
            Good at what you do and serious about making great work?
            We're always open to meeting people who can bring
            something new to the table.
          </p>

          <Link
            href="/agency/careers"
            className="group inline-flex items-center gap-2 rounded-full border border-brand-orange px-5 py-2.5 text-sm font-semibold text-brand-orange transition-all duration-300 hover:bg-brand-orange hover:text-brand-cream"
          >
            Join the team!

            <ArrowUpRight
              size={15}
              className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
            />
          </Link>
        </div>
      </div>
    </div>

    {/* Bottom */}
    <div className="mt-12 border-t border-brand-cream/10 pt-8">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">

        <div className="flex items-center gap-5">

          <Logo href="/" variant="orange" size="sm" />

          <div>
            <p className="text-[13px] text-brand-cream/40">
              © {new Date().getFullYear()} OCT20FIVE Agency. All rights reserved.
            </p>

            <p className="mt-1 text-[13px] text-brand-cream/30">
              Crafted with purpose. Built for impact.
              <span className="ml-1 text-brand-orange">•</span>
            </p>
          </div>

        </div>

        <div className="flex items-center gap-8">

          <div className="hidden h-10 w-px bg-brand-cream/10 lg:block" />

          <div className="flex items-center gap-5 text-[12px] uppercase tracking-[0.45em] text-brand-cream/55">

            <span>CREATE</span>

            <span className="text-brand-orange">•</span>

            <span>CONCEPT</span>

            <span className="text-brand-orange">•</span>

            <span>DELIVER</span>

            <span className="text-brand-orange">.</span>

          </div>

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
  return <Logo href="/" variant="orange" size="xl" />;
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
      className="group inline-flex items-center gap-3 text-[15px] text-brand-cream/55 transition-all duration-500 ease-smooth hover:text-brand-cream"
    >
      {icon && (
        <span
          className={`flex h-7 w-7 items-center justify-center rounded-lg text-brand-cream ${iconClass}`}
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
            text-brand-cream
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
function Heading({ children }) {
  return (
    <div className="mb-5">
      <p className="relative inline-block text-[13px] font-semibold uppercase tracking-wider text-brand-cream">
        {children}

        <span className="absolute -bottom-2 left-0 h-[2px] w-8 bg-brand-orange" />
      </p>
    </div>
  );
}