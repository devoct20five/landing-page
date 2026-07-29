"use client";

import Link from "next/link";
import { ArrowUpRight, Mail } from "lucide-react";
import Navbar from "@/components/navigation/Navbar";
import Footer from "@/components/layout/Footer";
import SectionWrapper from "@/components/layout/SectionWrapper";
import SectionTag from "@/components/ui/SectionTag";
import Reveal, { Stagger, StaggerItem } from "@/components/motion/Reveal";

const ROLES = [
  {
    title: "Video Editor",
    category: "Creative",
    employment: "Full-time",
    location: "On-site • Bhiwani",
    href: "https://www.linkedin.com/company/oct20five/jobs/",
  },
  {
    title: "Graphic Designer",
    category: "Creative",
    employment: "Full-time",
    location: "On-site • Bhiwani",
    href: "https://www.linkedin.com/company/oct20five/jobs/",
  },
  {
    title: "3D Artist",
    category: "CGI",
    employment: "Full-time",
    location: "On-site • Bhiwani",
    href: "https://www.linkedin.com/company/oct20five/jobs/",
  },
  {
    title: "Web Developer",
    category: "Digital",
    employment: "Full-time",
    location: "On-site • Bhiwani",
    href: "https://www.linkedin.com/company/oct20five/jobs/",
  },
];

export default function CareersPage() {
  return (
    <>
      <Navbar variant="utility" initialTheme="dark" />
      <main>
        <SectionWrapper theme="dark" className="!pt-40 !pb-16">
          <div className="container">
            <Reveal>
              <SectionTag>Careers</SectionTag>
            </Reveal>
            <Reveal delay={0.05}>
              <h1 className="mt-6 font-display uppercase leading-[0.9] tracking-tight text-display-2xl text-balance max-w-4xl">
                Come build <br /> with us
                <span className="text-brand-orange">.</span>
              </h1>
            </Reveal>
            <Reveal delay={0.15}>
              <p className="mt-6 max-w-2xl text-body-lg opacity-70">
                Explore current opportunities at OCT20FIVE.
              </p>
            </Reveal>

            <Reveal delay={0.2}>
              <p className="mt-14 eyebrow">
                <span className="eyebrow-dot" /> Current Openings
              </p>
            </Reveal>

            <Stagger className="mt-6 grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {ROLES.map((r) => (
                <StaggerItem key={r.title}>
                  <div className="brand-card !p-6 h-full flex flex-col">
                    <h3 className="font-display text-xl uppercase leading-tight">
                      {r.title}
                    </h3>
                    <p className="mt-1 text-sm opacity-50">{r.category}</p>

                    <div
                      className="mt-5 pt-5 border-t text-sm space-y-1"
                      style={{ borderColor: "var(--surface-border)" }}
                    >
                      <p className="opacity-85">{r.employment}</p>
                      <p className="opacity-60">{r.location}</p>
                    </div>

                    <div
                      className="mt-5 pt-5 border-t"
                      style={{ borderColor: "var(--surface-border)" }}
                    >
                      <a
                        href={r.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-brand-orange text-xs font-semibold uppercase tracking-wide hover:opacity-80"
                      >
                        Apply on LinkedIn <ArrowUpRight size={14} />
                      </a>
                    </div>
                  </div>
                </StaggerItem>
              ))}
            </Stagger>

            <Reveal delay={0.3} className="mt-3">
              <div className="brand-card !p-6 flex flex-col md:flex-row md:items-center gap-6 md:gap-10">
                <div className="flex items-center gap-4 md:w-64 shrink-0">
                  <div
                    className="w-11 h-11 rounded-icon border flex items-center justify-center text-brand-orange shrink-0"
                    style={{ borderColor: "var(--surface-border)" }}
                  >
                    <Mail size={18} />
                  </div>
                  <div>
                    <p className="font-display text-sm uppercase tracking-tight">
                      Don&rsquo;t see your role?
                    </p>
                    <p className="text-sm opacity-60 mt-0.5">
                      We&rsquo;re always open to great talents.
                    </p>
                  </div>
                </div>

                <div
                  className="flex-1 md:border-l md:pl-10"
                  style={{ borderColor: "var(--surface-border)" }}
                >
                  <a
                    href="mailto:careers@oct20five.com"
                    className="text-brand-orange font-medium text-sm underline underline-offset-4"
                  >
                    careers@oct20five.com
                  </a>
                  <p className="text-sm opacity-60 mt-1">
                    Email us your portfolio, resume and a short introduction.
                  </p>
                </div>

                <a
                  href="mailto:careers@oct20five.com"
                  className="inline-flex items-center gap-1.5 text-brand-orange text-sm font-semibold uppercase tracking-wide shrink-0 hover:opacity-80"
                >
                  Email us <ArrowUpRight size={16} />
                </a>
              </div>
            </Reveal>
          </div>
        </SectionWrapper>
      </main>
      <Footer />
    </>
  );
}
