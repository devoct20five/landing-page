"use client";

import {
  ArrowRight,
  Rocket,
  Clock,
  Layers,
  Sparkles,
  Users,
  ShieldCheck,
  BadgeIndianRupee,
  Repeat,
  Film,
  Palette,
  Boxes,
  Code2,
  Compass,
  Atom,
  Clapperboard,
  Scale,
  Gem,
} from "lucide-react";

import SectionWrapper from "@/components/layout/SectionWrapper";
import SectionTag from "@/components/ui/SectionTag";
import Reveal, { Stagger, StaggerItem } from "@/components/motion/Reveal";
import MagneticButton from "@/components/motion/MagneticButton";

const ICONS = {
  Rocket,
  Clock,
  Layers,
  Sparkles,
  Users,
  ShieldCheck,
  BadgeIndianRupee,
  Repeat,
  Film,
  Palette,
  Boxes,
  Code2,
  Compass,
  Atom,
  Clapperboard,
};

export default function FeaturesGrid({
  theme = "light",
  id,

  /* FEATURES */
  eyebrow = "Features",
  headline,
  subline,
  features = [],
  ctaLabel,
  ctaHref = "/agency/get-in-touch",

  /* PRICING */
  pricingEyebrow = "Pricing",
  pricingHeadline,
  pricingSubline,
  plans = [],
  signature,
  compareLabel = "Compare Plans",
  compareHref = "#compare",
}) {
  return (
    <SectionWrapper theme={theme} id={id} className="!py-16 md:!py-20">
      <div className="container">
        {/* =====================================================
            PRICING SECTION
        ===================================================== */}

        {plans.length > 0 && (
          <div id="pricing" className="mt-28 md:mt-36">
            {/* -----------------------------------------------
                PRICING HEADER
            ----------------------------------------------- */}

            <div className="mx-auto max-w-[760px] text-center">
              <Reveal>
                <div className="flex justify-center">
                  <SectionTag>{pricingEyebrow}</SectionTag>
                </div>
              </Reveal>

              <Reveal delay={0.05}>
                <h2
                  className="
                    mx-auto
                    mt-5
                    max-w-[700px]
                    font-display
                    text-[clamp(2.8rem,5.5vw,5rem)]
                    font-black
                    uppercase
                    leading-[0.84]
                    tracking-[-0.03em]
                    text-balance
                  "
                >
                  {pricingHeadline}
                </h2>
              </Reveal>

              {pricingSubline && (
                <Reveal delay={0.1}>
                  <p
                    className="
                      mx-auto
                      mt-5
                      max-w-[570px]
                      text-[0.8rem]
                      leading-[1.5]
                      opacity-65
                      md:text-[0.85rem]
                    "
                  >
                    {pricingSubline}
                  </p>
                </Reveal>
              )}
            </div>

            {/* -----------------------------------------------
                PRICING CARDS
            ----------------------------------------------- */}

            <Stagger
              className="
                mx-auto
                mt-8
                grid
                max-w-[1080px]
                grid-cols-1
                gap-2
                md:grid-cols-3
              "
            >
              {plans.slice(0, 3).map((plan, i) => {
                const Icon = ICONS[plan.icon] || Sparkles;
                const featured = plan.featured;

                return (
                  <StaggerItem key={plan.id || i} className="h-full">
                    <article
                      className={`
                        group
                        relative
                        flex
                        h-full
                        min-h-[330px]
                        flex-col
                        overflow-hidden
                        rounded-[8px]
                        border
                        p-3
                        transition-all
                        duration-500

                        ${
                          featured
                            ? `
                              border-brand-orange
                              bg-brand-black
                              text-brand-cream
                              shadow-[0_0_35px_rgba(255,65,20,0.08)]
                            `
                            : `
                              border-brand-black/10
                              bg-brand-black
                              text-brand-cream
                              hover:border-brand-cream/25
                            `
                        }
                      `}
                    >
                      {/* FEATURED TOP LINE */}

                      {featured && (
                        <div
                          className="
                            pointer-events-none
                            absolute
                            inset-x-0
                            top-0
                            h-px
                            bg-brand-orange
                          "
                        />
                      )}

                      {/* PLAN HEADER */}

                      <div className="flex items-center justify-between px-2 py-1">
                        <div className="flex items-center gap-2">
                          <Icon
                            size={16}
                            strokeWidth={1.25}
                            className={
                              featured ? "text-brand-orange" : "text-brand-cream/80"
                            }
                          />

                          <span
                            className="
                              text-[12px]
                              font-bold
                              uppercase
                              tracking-[0.06em]
                            "
                          >
                            {plan.name}
                          </span>
                        </div>

                        {plan.discount && (
                          <span
                            className="
                              rounded-full
                              border
                              border-brand-orange/60
                              px-2
                              py-1
                              text-[11px]
                              font-bold
                              uppercase
                              text-brand-orange
                            "
                          >
                            Save {plan.discount}
                          </span>
                        )}
                      </div>

                      {/* PRICE */}

                      <div className="mt-4 px-2">
                        <div className="flex items-end gap-1">
                          <span
                            className="
                              font-display
                              text-[1.45rem]
                              font-black
                              leading-none
                              tracking-[-0.03em]
                            "
                          >
                            {plan.price}
                          </span>

                          <span
                            className="
                              pb-[2px]
                              text-[13px]
                              opacity-50
                            "
                          >
                            /project
                          </span>
                        </div>
                      </div>

                      {/* PACKAGE SELECTOR */}

                      <div
                        className="
                          mt-3
                          grid
                          grid-cols-3
                          overflow-hidden
                          rounded-full
                          border
                          border-brand-cream/10
                        "
                      >
                        {(plan.packages || ["3 Pack", "7 Pack", "15 Pack"]).map(
                          (pack, packIndex) => {
                            const selected =
                              packIndex === (plan.selectedPackage ?? 1);

                            return (
                              <div
                                key={pack}
                                className={`
                                flex
                                h-5
                                items-center
                                justify-center
                                text-[11px]
                                font-medium
                                ${
                                  selected
                                    ? featured
                                      ? "bg-brand-orange text-brand-cream"
                                      : "bg-brand-card text-brand-black"
                                    : "text-brand-cream/55"
                                }
                              `}
                              >
                                {pack}
                              </div>
                            );
                          },
                        )}
                      </div>

                      {/* TOTAL */}

                      <div className="mt-3 px-2">
                        <div
                          className="
                            text-[11px]
                            uppercase
                            tracking-[0.08em]
                            opacity-40
                          "
                        >
                          Total
                        </div>

                        <div className="mt-1 text-[0.8rem] font-medium">
                          {plan.total}
                        </div>
                      </div>

                      {/* PLAN FEATURES */}

                      <div
                        className="
                          mt-2
                          flex-1
                          border-t
                          border-brand-cream/[0.08]
                          px-2
                          pt-2
                        "
                      >
                        <ul className="space-y-[4px]">
                          {(plan.features || [])
                            .slice(0, 6)
                            .map((feature, index) => (
                              <li
                                key={index}
                                className="
                                  flex
                                  items-start
                                  gap-1.5
                                  text-[12px]
                                  leading-[1.3]
                                  text-brand-cream/65
                                "
                              >
                                <span className="mt-[1px] text-brand-orange">
                                  ✦
                                </span>

                                <span>{feature}</span>
                              </li>
                            ))}
                        </ul>
                      </div>

                      {/* ACTIONS */}

                      <div className="mt-3 space-y-1">
                        <a
                          href={plan.href || "#"}
                          className={`
                            flex
                            h-6
                            items-center
                            justify-center
                            gap-1
                            rounded-full
                            text-[13px]
                            font-bold
                            transition-transform
                            duration-300
                            hover:scale-[1.015]

                            ${
                              featured
                                ? "bg-brand-orange text-brand-cream"
                                : "bg-brand-card text-brand-black"
                            }
                          `}
                        >
                          Buy Now
                          <ArrowRight size={10} />
                        </a>

                        <a
                          href={plan.callHref || "/agency/get-in-touch"}
                          className="
                            flex
                            h-6
                            items-center
                            justify-center
                            rounded-full
                            border
                            border-brand-cream/10
                            text-[13px]
                            text-brand-cream/70
                            transition-colors
                            hover:border-brand-cream/30
                            hover:text-brand-cream
                          "
                        >
                          Book a Call
                        </a>
                      </div>
                    </article>
                  </StaggerItem>
                );
              })}
            </Stagger>

            {/* -----------------------------------------------
                SIGNATURE PACKAGE
            ----------------------------------------------- */}

            {signature && (
              <Reveal delay={0.2}>
                <div
                  className="
                    mx-auto
                    mt-2
                    flex
                    max-w-[1080px]
                    flex-col
                    gap-4
                    rounded-[7px]
                    border
                    border-brand-cream/10
                    bg-brand-black
                    px-4
                    py-3
                    text-brand-cream
                    md:flex-row
                    md:items-center
                    md:justify-between
                  "
                >
                  <div className="flex min-w-0 items-center gap-4">
                    <Gem
                      size={17}
                      strokeWidth={1.25}
                      className="shrink-0 text-brand-orange"
                    />

                    <div className="min-w-0">
                      <div className="text-[11px] font-bold uppercase text-brand-orange">
                        Signature
                      </div>

                      <h3 className="font-display text-[0.9rem] uppercase leading-none">
                        {signature.title}
                      </h3>

                      {signature.body && (
                        <p className="mt-1 text-[12px] opacity-50">
                          {signature.body}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-4 md:gap-6">
                    <div>
                      <div className="text-[11px] uppercase opacity-40">
                        From
                      </div>

                      <div className="text-[0.85rem] font-medium">
                        {signature.price}
                      </div>
                    </div>

                    {signature.href && (
                      <a
                        href={signature.href}
                        className="
                          hidden
                          h-6
                          items-center
                          gap-1
                          rounded-full
                          border
                          border-brand-cream/15
                          px-3
                          text-[11px]
                          md:flex
                        "
                      >
                        View work
                        <ArrowRight size={9} />
                      </a>
                    )}

                    <a
                      href={signature.callHref || "/agency/get-in-touch"}
                      className="
                        flex
                        h-6
                        items-center
                        gap-1
                        rounded-full
                        bg-brand-orange
                        px-3
                        text-[11px]
                        font-bold
                      "
                    >
                      Book a Call
                      <ArrowRight size={9} />
                    </a>
                  </div>
                </div>
              </Reveal>
            )}

            {/* -----------------------------------------------
                COMPARE PLANS
            ----------------------------------------------- */}

            <Reveal delay={0.25}>
              <a
                href={compareHref}
                className="
                  group
                  mx-auto
                  mt-2
                  flex
                  max-w-[1080px]
                  items-center
                  justify-between
                  rounded-[7px]
                  border
                  border-brand-cream/10
                  bg-brand-black
                  px-4
                  py-3
                  text-brand-cream
                  transition-colors
                  hover:border-brand-cream/25
                "
              >
                <div className="flex items-center gap-3">
                  <Scale
                    size={15}
                    strokeWidth={1.25}
                    className="text-brand-orange"
                  />

                  <div>
                    <div className="text-[11px] font-bold uppercase text-brand-orange">
                      Compare plans
                    </div>

                    <div className="font-display text-[0.8rem] uppercase leading-none">
                      Everything. Side by side.
                    </div>

                    <div className="mt-1 text-[11px] opacity-40">
                      Compare prices, plans and features all in one place.
                    </div>
                  </div>
                </div>

                <div
                  className="
                    flex
                    h-6
                    items-center
                    gap-1
                    rounded-full
                    border
                    border-brand-cream/15
                    px-3
                    text-[11px]
                    transition-all
                    group-hover:border-brand-orange
                    group-hover:text-brand-orange
                  "
                >
                  {compareLabel}
                  <ArrowRight size={9} />
                </div>
              </a>
            </Reveal>
          </div>
        )}
        {/* =====================================================
            FEATURES GRID
        ===================================================== */}

        <div className="mx-auto mt-28 max-w-[1080px] md:mt-36">
          {/* -------------------------------------------------
              FEATURES HEADER
          ------------------------------------------------- */}

          <div className="mx-auto max-w-[760px] text-center">
            <Reveal>
              <div className="flex justify-center">
                <SectionTag>{eyebrow}</SectionTag>
              </div>
            </Reveal>

            <Reveal delay={0.05}>
              <h2
                className="
                  mx-auto
                  mt-5
                  max-w-[760px]
                  font-display
                  text-[clamp(2.7rem,5vw,4.6rem)]
                  font-black
                  uppercase
                  leading-[0.84]
                  tracking-[-0.03em]
                  text-balance
                "
              >
                {headline}
              </h2>
            </Reveal>

            {subline && (
              <Reveal delay={0.1}>
                <p
                  className="
                    mx-auto
                    mt-5
                    max-w-[620px]
                    text-[0.8rem]
                    font-medium
                    leading-[1.5]
                    opacity-60
                    md:text-[0.85rem]
                  "
                >
                  {subline}
                </p>
              </Reveal>
            )}
          </div>

          {/* -------------------------------------------------
              FEATURE CARDS
          ------------------------------------------------- */}

          {features.length > 0 && (
            <Stagger
              className="
                mx-auto
                mt-9
                grid
                max-w-[1080px]
                grid-cols-1
                gap-2
                sm:grid-cols-2
                lg:grid-cols-3
              "
            >
              {features.slice(0, 6).map((feature, i) => {
                const Icon = ICONS[feature.icon] || Sparkles;

                return (
                  <StaggerItem key={feature.id || i} className="h-full">
                    <article
                      className="
                        group
                        relative
                        flex
                        min-h-[154px]
                        items-center
                        overflow-hidden
                        rounded-[9px]
                        border
                        bg-brand-card
                        px-4
                        py-4
                        transition-all
                        duration-400
                        ease-smooth
                        hover:-translate-y-[2px]
                        hover:border-brand-orange
                        hover:shadow-[0_12px_30px_rgba(26,9,7,0.06)]
                        md:min-h-[160px]
                        md:px-5
                        md:py-5
                      "
                      style={{
                        borderColor: "var(--surface-border)",
                      }}
                    >
                      {/* -------------------------------------------------
                          NUMBER
                      ------------------------------------------------- */}

                      <div
                        className="
                          absolute
                          left-4
                          top-4
                          flex
                          h-[22px]
                          min-w-[22px]
                          items-center
                          justify-center
                          rounded-[4px]
                          border
                          border-brand-orange/40
                          px-1
                          font-display
                          text-[13px]
                          font-black
                          leading-none
                          text-brand-orange
                          md:left-5
                          md:top-5
                        "
                      >
                        {String(i + 1).padStart(2, "0")}
                      </div>

                      {/* -------------------------------------------------
                          ICON
                      ------------------------------------------------- */}

                      <div
                        className="
                          flex
                          w-[72px]
                          shrink-0
                          items-center
                          justify-center
                          pt-3
                          md:w-[82px]
                        "
                      >
                        <Icon
                          size={43}
                          strokeWidth={1.15}
                          className="
                            text-brand-orange
                            transition-transform
                            duration-500
                            ease-out
                            group-hover:scale-105
                          "
                        />
                      </div>

                      {/* -------------------------------------------------
                          CONTENT
                      ------------------------------------------------- */}

                      <div
                        className="
                          min-w-0
                          flex-1
                          pl-1
                          pt-3
                        "
                      >
                        <h3
                          className="
                            max-w-[190px]
                            font-display
                            text-[0.72rem]
                            font-black
                            uppercase
                            leading-[1.05]
                            tracking-[-0.015em]
                            md:text-[0.78rem]
                          "
                        >
                          {feature.title}
                        </h3>

                        {/* ORANGE DIVIDER */}

                        <div
                          className="
                            mt-2
                            h-[2px]
                            w-[27px]
                            rounded-full
                            bg-brand-orange
                            transition-all
                            duration-300
                            group-hover:w-[38px]
                          "
                        />

                        {/* BODY */}

                        <p
                          className="
                            mt-2
                            max-w-[205px]
                            text-[0.55rem]
                            font-medium
                            leading-[1.45]
                            opacity-60
                            md:text-[0.59rem]
                          "
                        >
                          {feature.body}
                        </p>
                      </div>
                    </article>
                  </StaggerItem>
                );
              })}
            </Stagger>
          )}

          {/* -------------------------------------------------
              FEATURES CTA
          ------------------------------------------------- */}

          {ctaLabel && (
            <Reveal delay={0.2} className="mt-4 flex justify-center">
              <MagneticButton
                href={ctaHref}
                variant="primary"
                className="
                  h-8
                  rounded-full
                  px-5
                  text-[13px]
                  font-bold
                  uppercase
                  tracking-[0.04em]
                "
              >
                {ctaLabel}
                <ArrowRight size={11} />
              </MagneticButton>
            </Reveal>
          )}
        </div>
      </div>
    </SectionWrapper>
  );
}
