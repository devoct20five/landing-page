"use client";

import Image from "next/image";
import { Play, ArrowUpRight } from "lucide-react";
import Navbar from "@/components/navigation/Navbar";
import Footer from "@/components/layout/Footer";
import SectionWrapper from "@/components/layout/SectionWrapper";
import SectionTag from "@/components/ui/SectionTag";
import Reveal, { Stagger, StaggerItem } from "@/components/motion/Reveal";

/**
 * Shared "work category" template — used by /agency/work/editing,
 * /agency/work/web-dev, /agency/work/3d-ads, /agency/work/design.
 *
 * @param {string} category   e.g. "Editing", "Web-Dev", "3D-Ads", "Design"
 * @param {Array}  items      [{ title, duration, thumbnail, href }]
 */
export default function WorkCategoryGrid({ category, items }) {
  return (
    <>
      <Navbar variant="utility" initialTheme="dark" />
      <main>
        <SectionWrapper theme="dark" className="!pt-40 !pb-16">
          <div className="container">
            <Reveal>
              <SectionTag>Behind the work</SectionTag>
            </Reveal>
            <Reveal delay={0.05}>
              <h1 className="mt-4 font-display uppercase leading-[0.9] tracking-tight text-display-2xl text-balance">
                {category}
                <span className="text-brand-orange">.</span>
              </h1>
            </Reveal>

            <Stagger className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {items.map((item) => (
                <StaggerItem key={item.title}>
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group block"
                  >
                    <div className="relative aspect-video rounded-card overflow-hidden">
                      <Image
                        src={item.thumbnail}
                        alt={item.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className="object-cover transition-transform duration-700 ease-apple group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-black/25 group-hover:bg-black/10 transition-colors" />

                      {/* Play button */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-14 h-14 rounded-full bg-brand-orange flex items-center justify-center shadow-brand-glow transition-transform duration-300 group-hover:scale-110">
                          <Play
                            size={22}
                            fill="white"
                            className="text-white translate-x-0.5"
                          />
                        </div>
                      </div>

                      {/* Duration badge */}
                      <span className="absolute bottom-3 right-3 rounded-md bg-black/70 px-2 py-1 text-xs font-medium tabular-nums text-white/90">
                        {item.duration}
                      </span>
                    </div>

                    <div className="mt-3 flex items-center justify-between gap-3">
                      <h3 className="font-display text-sm md:text-base uppercase tracking-tight leading-tight">
                        {item.title}
                      </h3>
                      <span
                        className="w-7 h-7 shrink-0 rounded-icon border flex items-center justify-center text-brand-orange transition-colors group-hover:border-brand-orange"
                        style={{ borderColor: "var(--surface-border)" }}
                      >
                        <ArrowUpRight size={13} />
                      </span>
                    </div>
                  </a>
                </StaggerItem>
              ))}
            </Stagger>
          </div>
        </SectionWrapper>
      </main>
      <Footer />
    </>
  );
}