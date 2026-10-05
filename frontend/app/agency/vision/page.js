"use client";

import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/navigation/Navbar";
import Footer from "@/components/layout/Footer";
import SectionWrapper from "@/components/layout/SectionWrapper";
import SectionTag from "@/components/ui/SectionTag";
import Reveal from "@/components/motion/Reveal";
import { ArrowRight, Users } from "lucide-react";
import { TEAM } from "@/data/content";
export default function VisionPage() {
  return (
    <>
      <Navbar />

      <main className="bg-brand-cream text-brand-black">
        {/* ============================= */}
        {/* OUR VISION                    */}
        {/* ============================= */}
        <SectionWrapper theme="light" className="pt-36 pb-24">
          <div className="container max-w-6xl mx-auto">
            <Reveal>
              <div className="flex flex-col items-center text-center">
                <SectionTag>Our Vision</SectionTag>

                <h1 className="mt-7 font-display uppercase leading-[0.86] tracking-tight text-5xl md:text-7xl xl:text-8xl max-w-5xl text-balance">
                  We all started{" "}
                  <span className="text-brand-orange">
                    this creative agency...
                  </span>
                </h1>

                <div className="mt-12 max-w-3xl space-y-7 text-base md:text-lg leading-8 text-brand-textSoft">
                  <p>
                    We started OCT20FIVE Agency because we wanted to give people
                    the quality they actually deserve, not the low-effort work
                    they've learned to settle for. A one-stop creative solution
                    where people don't have to contact different agencies for
                    different services, where ideas don't get lost between
                    different people and different directions.
                  </p>

                  <p>
                    That's why we believe in{" "}
                    <span className="font-semibold text-brand-orange uppercase">
                      Full Spectrum Creative Services
                    </span>
                    , and that's what makes OCT20FIVE Agency.
                  </p>

                  <p>
                    But beyond the work, we also saw creatives around us fall
                    apart. Brilliant ideas buried under miscommunication,
                    unhealthy workflows, and impossible timelines. We didn't
                    want that—not for clients, not for creatives, not for
                    ourselves.
                    <br />
                    <span className="font-medium text-brand-black">
                      That's our vision.
                    </span>
                  </p>
                </div>
              </div>
            </Reveal>
          </div>
        </SectionWrapper>

        {/* ============================= */}
        {/* OUR MISSION                   */}
        {/* ============================= */}
        <SectionWrapper theme="light" className="pt-4 pb-20">
          <div className="container max-w-6xl mx-auto">
            <Reveal>
              <div className="text-center">
                <SectionTag>Our Mission</SectionTag>

                <p className="mt-6 uppercase tracking-[0.35em] text-xs text-brand-textSoft">
                  We just have one mission...
                </p>

                <h2 className="mt-5 font-display uppercase leading-[0.85] tracking-tight text-5xl md:text-7xl xl:text-8xl">
                  <span className="text-brand-black">Concept.</span>{" "}
                  <span className="text-brand-black">Create.</span>{" "}
                  <span className="text-brand-black">Deliver.</span>{" "}
                  <span className="text-brand-orange">That's All.</span>
                </h2>
              </div>
            </Reveal>

            {/* Leadership CTA Card */}
            <Reveal delay={0.15}>
              <Link
                href="#leadership"
                className="group mt-16 block rounded-3xl border border-brand-orange/20 bg-brand-card transition-all duration-300 hover:border-brand-orange hover:shadow-xl"
              >
                <div className="grid md:grid-cols-12 items-center gap-8 px-8 py-8 md:px-10">
                  <div className="md:col-span-2 flex justify-center md:justify-start">
                    <div className="w-16 h-16 rounded-2xl bg-brand-orange/10 flex items-center justify-center">
                      <Users
                        size={30}
                        className="text-brand-orange"
                        strokeWidth={1.8}
                      />
                    </div>
                  </div>

                  <div className="md:col-span-4 text-center md:text-left">
                    <h3 className="font-display uppercase text-3xl leading-none">
                      Leadership
                      <br />& Team
                    </h3>
                  </div>

                  <div className="md:col-span-4 text-center md:text-left text-brand-textSoft leading-7">
                    Meet the people turning this vision into reality.
                  </div>

                  <div className="md:col-span-2 flex justify-center md:justify-end">
                    <div className="flex items-center gap-3 font-semibold uppercase tracking-wide text-sm">
                      Explore Team
                      <div className="w-11 h-11 rounded-full border border-brand-orange text-brand-orange flex items-center justify-center transition-all duration-300 group-hover:bg-brand-orange group-hover:text-brand-cream">
                        <ArrowRight
                          size={18}
                          className="group-hover:translate-x-0.5 transition-transform"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </Reveal>
          </div>
        </SectionWrapper>

        {/* ============================= */}
        {/* LEADERSHIP & TEAM            */}
        {/* ============================= */}

        <SectionWrapper id="leadership" theme="light" className="pt-12 pb-28">
          <div className="container max-w-7xl mx-auto">
            <Reveal>
              <div className="text-center">
                <SectionTag>Core Members</SectionTag>

                <h2 className="mt-6 font-display uppercase tracking-tight leading-[0.88] text-5xl md:text-7xl">
                  Leadership & Team
                </h2>
              </div>
            </Reveal>

            <Reveal delay={0.15}>
              <div className="relative mt-14 rounded-[28px] overflow-hidden border border-brand-border">
                <div className="relative aspect-[16/8]">
                  <Image
                    src="/images/team/team-photo.jpg"
                    alt="OCT20FIVE Team"
                    fill
                    priority
                    sizes="100vw"
                    className="object-cover"
                  />

                  <div className="absolute inset-0 bg-gradient-to-r from-brand-black/70 via-brand-black/25 to-transparent" />

                  <div className="absolute left-10 bottom-10 max-w-sm">
                    <p className="text-brand-cream/80 uppercase tracking-[0.35em] text-xs mb-4">
                      OCT20FIVE
                    </p>

                    <h3 className="font-display uppercase leading-[0.88] text-4xl md:text-6xl text-brand-cream">
                      People
                      <br />
                      <span className="text-brand-orange">Who Made</span>
                      <br />
                      This Possible.
                    </h3>
                  </div>
                </div>
              </div>
            </Reveal>

            {/* Leadership */}

            <Reveal delay={0.25}>
              <div className="mt-24">
                <div className="flex justify-center">
                  <div className="h-px w-24 bg-brand-border" />
                </div>

                <p className="text-center mt-5 uppercase tracking-[0.45em] text-xs text-brand-textSoft">
                  Leadership
                </p>
              </div>
            </Reveal>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-7 mt-12">
              {/* Founder */}

              <Reveal>
                <article className="group">
                  <div className="relative overflow-hidden rounded-3xl aspect-[4/5] bg-brand-creamSoft">
                    <Image
                      src="/images/team/tarun.jpg"
                      alt="Tarun Verma"
                      fill
                      className="object-cover transition duration-500 group-hover:scale-105"
                    />
                  </div>

                  <div className="mt-5">
                    <h3 className="font-display uppercase text-xl">
                      Tarun Verma
                    </h3>

                    <p className="text-sm text-brand-textSoft mt-1">
                      Founder & CEO
                    </p>
                  </div>
                </article>
              </Reveal>

              {/* Designer */}

              <Reveal delay={0.05}>
                <article className="group">
                  <div className="relative overflow-hidden rounded-3xl aspect-[4/5] bg-brand-creamSoft">
                    <Image
                      src="/images/team/ananya.jpg"
                      alt="Ananya Iyer"
                      fill
                      className="object-cover transition duration-500 group-hover:scale-105"
                    />
                  </div>

                  <div className="mt-5">
                    <h3 className="font-display uppercase text-xl">
                      Ananya Iyer
                    </h3>

                    <p className="text-sm text-brand-textSoft mt-1">Design Lead</p>
                  </div>
                </article>
              </Reveal>

              {/* Head */}

              <Reveal delay={0.1}>
                <article className="group">
                  <div className="relative overflow-hidden rounded-3xl aspect-[4/5] bg-brand-creamSoft">
                    <Image
                      src="/images/team/rachav.jpg"
                      alt="Rachav Sharma"
                      fill
                      className="object-cover transition duration-500 group-hover:scale-105"
                    />
                  </div>

                  <div className="mt-5">
                    <h3 className="font-display uppercase text-xl">
                      Rachav Sharma
                    </h3>

                    <p className="text-sm text-brand-textSoft mt-1">
                      Head of Production
                    </p>
                  </div>
                </article>
              </Reveal>

              {/* Marketing */}

              <Reveal delay={0.15}>
                <article className="group">
                  <div className="relative overflow-hidden rounded-3xl aspect-[4/5] bg-brand-creamSoft">
                    <Image
                      src="/images/team/vivek.jpg"
                      alt="Vivek Rathi"
                      fill
                      className="object-cover transition duration-500 group-hover:scale-105"
                    />
                  </div>

                  <div className="mt-5">
                    <h3 className="font-display uppercase text-xl">
                      Vivek Rathi
                    </h3>

                    <p className="text-sm text-brand-textSoft mt-1">
                      3D & Motion Lead
                    </p>
                  </div>
                </article>
              </Reveal>
            </div>

            {/* Divider before team */}

            <Reveal delay={0.3}>
              <div className="mt-28 flex justify-center">
                <div className="h-px w-24 bg-brand-border" />
              </div>

              <p className="mt-5 text-center uppercase tracking-[0.45em] text-xs text-brand-textSoft">
                Team
              </p>
            </Reveal>

            {/* ===================================== */}
            {/* TEAM GRID                             */}
            {/* ===================================== */}

            <div className="mt-14 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
              {TEAM.map((member, index) => (
                <Reveal key={member.name} delay={index * 0.04}>
                  <article className="group">
                    {/* Image */}

                    <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-brand-creamSoft border border-brand-border">
                      <Image
                        src={member.image}
                        alt={member.name}
                        fill
                        sizes="(max-width:768px) 50vw,20vw"
                        className="object-cover transition duration-500 group-hover:scale-105"
                      />

                      <div className="absolute inset-0 bg-gradient-to-t from-brand-black/15 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition" />
                    </div>

                    {/* Details */}

                    <div className="mt-4">
                      <h3 className="font-display uppercase tracking-tight text-[15px] leading-tight">
                        {member.name}
                      </h3>

                      <p className="mt-1 text-xs text-brand-textSoft">
                        {member.role}
                      </p>

                      {(member.linkedin || member.instagram) && (
                        <div className="flex gap-3 mt-3">
                          {member.linkedin && (
                            <Link
                              href={member.linkedin}
                              target="_blank"
                              className="text-brand-orange text-xs hover:underline"
                            >
                              LinkedIn
                            </Link>
                          )}

                          {member.instagram && (
                            <Link
                              href={member.instagram}
                              target="_blank"
                              className="text-brand-orange text-xs hover:underline"
                            >
                              Instagram
                            </Link>
                          )}
                        </div>
                      )}
                    </div>
                  </article>
                </Reveal>
              ))}
            </div>

            {/* ===================================== */}
            {/* BOTTOM BRAND STATEMENT                */}
            {/* ===================================== */}

            <Reveal delay={0.25}>
              <div className="mt-32 border-t border-brand-border pt-20">
                <div className="max-w-5xl mx-auto text-center">
                  <SectionTag>Our Culture</SectionTag>

                  <h2 className="mt-6 font-display uppercase leading-[0.88] tracking-tight text-4xl md:text-6xl">
                    Great work begins with
                    <span className="text-brand-orange"> great people.</span>
                  </h2>

                  <p className="mt-8 text-lg leading-8 text-brand-textSoft max-w-3xl mx-auto">
                    Every campaign, every design, every line of code and every
                    strategy that leaves OCT20FIVE carries the effort of a team
                    that believes creativity isn't a department—it's a culture.
                    We collaborate, challenge each other and obsess over the
                    smallest details because extraordinary work is never created
                    alone.
                  </p>
                </div>
              </div>
            </Reveal>

            {/* ===================================== */}
            {/* FINAL CTA                             */}
            {/* ===================================== */}

            <Reveal delay={0.35}>
              <div className="mt-24 rounded-[36px] overflow-hidden bg-brand-black text-brand-cream">
                <div className="px-10 md:px-20 py-20 text-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,#ff5a1f33,transparent_65%)]" />

                  <div className="relative">
                    <SectionTag>Let's Build Together</SectionTag>

                    <h2 className="mt-7 font-display uppercase leading-[0.86] tracking-tight text-5xl md:text-7xl max-w-4xl mx-auto">
                      Ready to create
                      <span className="text-brand-orange">
                        {" "}
                        something remarkable?
                      </span>
                    </h2>

                    <p className="mt-8 max-w-2xl mx-auto text-brand-cream/60 leading-8">
                      Whether you're launching a brand, scaling a product,
                      producing content or building a digital experience, we'd
                      love to hear your story.
                    </p>

                    <Link
                      href="/agency/get-in-touch"
                      className="inline-flex items-center gap-3 mt-12 rounded-full bg-brand-orange hover:bg-brand-orangeHover transition-colors px-8 py-4 font-semibold text-brand-cream"
                    >
                      Start Your Project
                      <ArrowRight size={18} />
                    </Link>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </SectionWrapper>
      </main>

      <Footer />
    </>
  );
}
