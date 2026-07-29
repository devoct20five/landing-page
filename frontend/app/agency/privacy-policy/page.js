"use client";

import { ChevronDown } from "lucide-react";
import Navbar from "@/components/navigation/Navbar";
import Footer from "@/components/layout/Footer";
import SectionWrapper from "@/components/layout/SectionWrapper";
import SectionTag from "@/components/ui/SectionTag";
import Reveal, { Stagger, StaggerItem } from "@/components/motion/Reveal";

const SECTIONS = [
  {
    num: "01",
    title: "Information We Collect",
    paragraphs: [
      "We collect information you voluntarily provide when you contact us, request our services, submit project materials, or communicate with our team.",
      "We may also automatically collect certain technical information when you visit our website.",
    ],
    bullets: [
      "Name, email address, phone number, and company details",
      "Project files, briefs, and creative assets you provide",
      "Payment and billing information processed by secure payment providers",
      "IP address, browser type, operating system, and device information",
      "Website usage analytics and cookie data",
    ],
  },
  {
    num: "02",
    title: "How We Use Your Information",
    paragraphs: [
      "Your information is used solely to deliver and improve our services, communicate effectively, and fulfil our contractual obligations.",
    ],
    bullets: [
      "Manage projects and deliver editing services",
      "Process payments and issue invoices",
      "Respond to enquiries and support requests",
      "Improve our website and customer experience",
      "Send important service-related updates",
      "Comply with legal obligations",
    ],
  },
  {
    num: "03",
    title: "Information Sharing",
    paragraphs: [
      "We never sell or rent your personal information. We only share information where necessary to provide our services.",
    ],
    bullets: [
      "Payment providers (such as Stripe or Razorpay)",
      "Cloud storage and collaboration platforms",
      "Analytics providers for website performance",
      "Government authorities when legally required",
    ],
    footnote:
      "All third-party service providers are expected to maintain appropriate confidentiality and security standards.",
  },
  {
    num: "04",
    title: "Data Security",
    paragraphs: [
      "We implement reasonable technical and organisational measures to safeguard your information against unauthorised access, alteration, disclosure, or destruction.",
    ],
    bullets: [
      "Encrypted data transmission (SSL/TLS)",
      "Restricted access to sensitive information",
      "Regular software and security updates",
      "Secure storage of project files",
    ],
    footnote:
      "While we follow industry best practices, no internet transmission or storage system can be guaranteed to be completely secure.",
  },
  {
    num: "05",
    title: "Data Retention",
    paragraphs: [
      "Personal information is retained only for as long as necessary to provide our services, meet legal obligations, and resolve disputes.",
      "Raw footage and project files are generally retained for 30 days after final delivery unless otherwise agreed in writing.",
    ],
  },
  {
    num: "06",
    title: "Cookies & Analytics",
    paragraphs: [
      "Our website may use cookies and similar technologies to improve functionality, analyse traffic, and enhance your browsing experience.",
      "You can disable cookies through your browser settings, although some features may not function correctly.",
    ],
  },
  {
    num: "07",
    title: "Your Rights",
    paragraphs: [
      "Subject to applicable law, you may request access to, correction of, or deletion of your personal information.",
    ],
    bullets: [
      "Request access to your personal data",
      "Request corrections to inaccurate information",
      "Request deletion where legally permitted",
      "Withdraw consent for marketing communications",
    ],
  },
  {
    num: "08",
    title: "Third-Party Services",
    paragraphs: [
      "Our website or services may contain links to third-party platforms. We are not responsible for the privacy practices or content of external websites.",
    ],
  },
  {
    num: "09",
    title: "Policy Updates",
    paragraphs: [
      "We may revise this Privacy Policy from time to time to reflect changes in our business practices, legal requirements, or services.",
      "Continued use of our services after changes are published constitutes acceptance of the updated Privacy Policy.",
    ],
  },
  {
    num: "10",
    title: "Contact Us",
    paragraphs: [
      "If you have any questions regarding this Privacy Policy or how your information is handled, please contact OCT20FIVE Agency.",
    ],
  },
];

export default function PrivacyPolicyPage() {
  return (
    <>
      <Navbar variant="utility" initialTheme="dark" />

      <main>
        <SectionWrapper theme="dark" className="!pt-40 !pb-10">
          <div className="container">
            <div className="max-w-3xl mx-auto text-center">
              <Reveal>
                <SectionTag className="mx-auto">Privacy</SectionTag>
              </Reveal>

              <Reveal delay={0.05}>
                <h1 className="mt-6 font-display uppercase leading-[0.95] tracking-tight text-display-lg">
                  Privacy Policy
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
                  This Privacy Policy explains how OCT20FIVE Agency collects,
                  uses, stores, and protects your personal information whenever
                  you interact with our website or use our creative services.
                </p>
              </Reveal>

              <Reveal delay={0.2}>
                <p className="mt-4 opacity-60 text-sm">
                  By using our services, you acknowledge that you have read and
                  understood this Privacy Policy.
                </p>
              </Reveal>
            </div>
          </div>
        </SectionWrapper>

        <SectionWrapper theme="dark" className="!pt-6 !pb-20">
          <div className="container">
            <div className="max-w-3xl mx-auto">
              <Stagger className="space-y-12">
                {SECTIONS.map((section) => (
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
                                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-orange" />
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
