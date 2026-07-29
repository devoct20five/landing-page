"use client";

import { ChevronDown } from "lucide-react";
import Navbar from "@/components/navigation/Navbar";
import Footer from "@/components/layout/Footer";
import SectionWrapper from "@/components/layout/SectionWrapper";
import SectionTag from "@/components/ui/SectionTag";
import Reveal, { Stagger, StaggerItem } from "@/components/motion/Reveal";

const TERMS = [
  {
    num: "01",
    title: "Footage Submission Requirements",
    paragraphs: [
      "Clients must provide pre-selected, clearly marked footage (timestamps, file names, or clip references) along with a complete brief.",
      "Submission of large volumes of unfiltered raw footage without clear direction may:",
    ],
    bullets: [
      "Result in extended turnaround timelines",
      "Be treated as additional scope, subject to additional charges",
    ],
    footnote:
      "OCT20FIVE Agency reserves the right to pause, delay, or re-scope projects where sufficient direction is not provided.",
  },
  {
    num: "02",
    title: "Footage Retention",
    paragraphs: [
      "All raw footage and project files are stored for 30 days after final delivery.",
      "After this period, all assets will be permanently deleted unless a written extension is agreed upon in advance.",
      "Clients are responsible for maintaining their own backups of all submitted and delivered assets.",
    ],
  },
  {
    num: "03",
    title: "Service Package Validity",
    paragraphs: [
      "Purchased passes must be utilized within the duration of the active plan.",
      "Unused services will expire at the end of the validity period and will not be carried forward unless explicitly stated.",
    ],
  },
  {
    num: "04",
    title: "Revisions & Feedback",
    paragraphs: [
      "Each project includes a fixed number of revision rounds as outlined in the agreed scope of work.",
      "Feedback must be consolidated and shared in a single, clearly written round rather than in a series of scattered notes.",
    ],
    bullets: [
      "Revisions beyond the agreed scope may be billed additionally",
      "New creative direction introduced after final sign-off is treated as a new project",
    ],
  },
  {
    num: "05",
    title: "Payment Terms",
    paragraphs: [
      "A non-refundable advance is required to begin work on any project or retainer.",
      "Final files are released only after the outstanding balance has been cleared in full.",
      "Late payments may result in a pause on active work and delivery timelines.",
    ],
  },
  {
    num: "06",
    title: "Ownership & Intellectual Property",
    paragraphs: [
      "Full ownership of final delivered assets transfers to the client upon receipt of full payment.",
      "OCT20FIVE Agency retains the right to showcase completed work in its portfolio, reel, and marketing materials unless otherwise agreed in writing.",
    ],
  },
  {
    num: "07",
    title: "Cancellations & Refunds",
    paragraphs: [
      "Cancellations made after work has commenced are non-refundable for the portion of work already completed.",
      "Any unused, pre-paid balance may be adjusted against future work at OCT20FIVE Agency's discretion.",
    ],
  },
  {
    num: "08",
    title: "Limitation of Liability",
    paragraphs: [
      "OCT20FIVE Agency is not liable for delays or losses arising from incomplete briefs, late feedback, or third-party platform issues.",
      "Our total liability for any claim is limited to the amount paid for the specific project or service in question.",
    ],
  },
  {
    num: "09",
    title: "Changes to These Terms",
    paragraphs: [
      "These terms may be updated periodically to reflect changes in our process or services.",
      "Continued use of our services after an update constitutes acceptance of the revised terms.",
    ],
  },
];

export default function TermsAndConditionsPage() {
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
                  Terms &amp; Conditions
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
                  Welcome to OCT20FIVE Agency! By continuing to use our
                  services, you agree to the following terms of service,
                  designed to ensure a smooth editing experience.
                </p>
              </Reveal>
              <Reveal delay={0.2}>
                <p className="mt-4 opacity-60 text-sm">
                  For any clarifications, please contact our support team.
                </p>
              </Reveal>
            </div>
          </div>
        </SectionWrapper>

        <SectionWrapper theme="dark" className="!pt-6 !pb-20">
          <div className="container">
            <div className="max-w-3xl mx-auto">
              <Stagger className="space-y-12">
                {TERMS.map((t) => (
                  <StaggerItem key={t.num}>
                    <div className="flex gap-5">
                      <span className="font-display text-2xl text-brand-orange shrink-0 leading-tight">
                        {t.num}.
                      </span>
                      <div className="flex-1">
                        <h2 className="font-display text-lg md:text-xl uppercase tracking-tight leading-tight">
                          {t.title}
                        </h2>
                        <div className="mt-4 space-y-3 text-sm md:text-base opacity-70 leading-relaxed">
                          {t.paragraphs.map((p, i) => (
                            <p key={i}>{p}</p>
                          ))}
                        </div>
                        {t.bullets && (
                          <ul className="mt-3 space-y-2 text-sm md:text-base opacity-70">
                            {t.bullets.map((b, i) => (
                              <li key={i} className="flex items-start gap-3">
                                <span className="w-1.5 h-1.5 rounded-full bg-brand-orange mt-2 shrink-0" />
                                <span>{b}</span>
                              </li>
                            ))}
                          </ul>
                        )}
                        {t.footnote && (
                          <p className="mt-4 text-sm md:text-base opacity-70 leading-relaxed">
                            {t.footnote}
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
                    className="opacity-40 animate-bounce"
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
