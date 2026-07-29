"use client";

import { ChevronDown } from "lucide-react";
import Navbar from "@/components/navigation/Navbar";
import Footer from "@/components/layout/Footer";
import SectionWrapper from "@/components/layout/SectionWrapper";
import SectionTag from "@/components/ui/SectionTag";
import Reveal, { Stagger, StaggerItem } from "@/components/motion/Reveal";

const POLICY = [
  {
    num: "01",
    title: "General Terms",
    paragraphs: [
      "All purchases made through OCT20FIVE Agency are subject to this Refund & Cancellation Policy.",
      "By purchasing any service, retainer, or subscription, you acknowledge and agree to the terms outlined below.",
    ],
  },
  {
    num: "02",
    title: "All Plans",
    paragraphs: [
      "Refunds and cancellations depend on the stage of work and the type of service purchased.",
    ],
    bullets: [
      "Advance payments are non-refundable once work has commenced.",
      "Projects cancelled before work begins may be eligible for a partial refund after deducting applicable transaction or administrative charges.",
      "Unused subscription or retainer periods are generally non-refundable unless otherwise agreed in writing.",
      "Failure to submit required project assets or feedback does not qualify for a refund.",
    ],
    footnote:
      "OCT20FIVE Agency reserves the right to determine refund eligibility on a case-by-case basis.",
  },
  {
    num: "03",
    title: "Premium / Custom Projects",
    paragraphs: [
      "Custom creative work, strategy, branding, editing, or consulting services are tailored specifically for each client.",
      "Because work begins immediately upon project confirmation, these services are non-refundable after production has started.",
    ],
  },
  {
    num: "04",
    title: "Failed or Unsatisfactory Services",
    paragraphs: [
      "If you believe your delivered project does not match the agreed scope of work, please contact us within 7 days of delivery.",
      "We will review the concern and, where appropriate, provide revisions or a suitable resolution in accordance with the agreed project scope.",
    ],
  },
  {
    num: "05",
    title: "Changes to This Policy",
    paragraphs: [
      "This Refund & Cancellation Policy may be updated periodically to reflect changes in our services or business practices.",
      "The latest version will always be available on our website.",
      "Continued use of our services constitutes acceptance of the revised policy.",
    ],
  },
];

export default function RefundCancellationPage() {
  return (
    <>
      <Navbar variant="utility" initialTheme="dark" />

      <main>
        <SectionWrapper theme="dark" className="!pt-40 !pb-10">
          <div className="container">
            <div className="max-w-3xl mx-auto text-center">
              <Reveal>
                <SectionTag className="mx-auto">Legal</SectionTag>
              </Reveal>

              <Reveal delay={0.05}>
                <h1 className="mt-6 font-display uppercase leading-[0.95] tracking-tight text-display-lg">
                  Refund &amp; Cancellation Policy
                </h1>
              </Reveal>

              <Reveal delay={0.1}>
                <p className="mt-4 text-sm opacity-50">
                  Effective Date: 1 August 2026 &nbsp;|&nbsp; Last Updated: 1
                  August 2026
                </p>
              </Reveal>

              <Reveal delay={0.15}>
                <p className="mt-8 opacity-75 leading-relaxed">
                  At OCT20FIVE Agency, we are committed to delivering
                  high-quality creative services. This Refund & Cancellation
                  Policy explains when refunds or cancellations may be
                  applicable.
                </p>
              </Reveal>

              <Reveal delay={0.2}>
                <p className="mt-4 opacity-60 text-sm">
                  By purchasing our services, you agree to the terms outlined
                  below.
                </p>
              </Reveal>
            </div>
          </div>
        </SectionWrapper>

        <SectionWrapper theme="dark" className="!pt-6 !pb-20">
          <div className="container">
            <div className="max-w-3xl mx-auto">
              <Stagger className="space-y-12">
                {POLICY.map((section) => (
                  <StaggerItem key={section.num}>
                    <div className="flex gap-5">
                      <span className="font-display text-2xl text-brand-orange shrink-0 leading-tight">
                        {section.num}.
                      </span>

                      <div className="flex-1">
                        <h2 className="font-display text-lg md:text-xl uppercase tracking-tight leading-tight">
                          {section.title}
                        </h2>

                        <div className="mt-4 space-y-3 text-sm md:text-base opacity-70 leading-relaxed">
                          {section.paragraphs.map((paragraph, index) => (
                            <p key={index}>{paragraph}</p>
                          ))}
                        </div>

                        {section.bullets && (
                          <ul className="mt-3 space-y-2 text-sm md:text-base opacity-70">
                            {section.bullets.map((bullet, index) => (
                              <li
                                key={index}
                                className="flex items-start gap-3"
                              >
                                <span className="mt-2 h-1.5 w-1.5 rounded-full bg-brand-orange shrink-0" />
                                <span>{bullet}</span>
                              </li>
                            ))}
                          </ul>
                        )}

                        {section.footnote && (
                          <p className="mt-4 text-sm md:text-base opacity-70 leading-relaxed">
                            {section.footnote}
                          </p>
                        )}
                      </div>
                    </div>
                  </StaggerItem>
                ))}
              </Stagger>

              <Reveal delay={0.1}>
                <div className="mt-16 flex flex-col items-center gap-2">
                  <span className="text-xs uppercase tracking-widest opacity-40">
                    Scroll down
                  </span>

                  <ChevronDown
                    size={16}
                    className="animate-bounce opacity-40"
                  />
                </div>
              </Reveal>
            </div>
          </div>
        </SectionWrapper>
      </main>

      <Footer />
    </>
  );
}
