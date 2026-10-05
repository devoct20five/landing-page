"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, X } from "lucide-react";
import SectionWrapper from "@/components/layout/SectionWrapper";
import SectionTag from "@/components/ui/SectionTag";
import Reveal from "@/components/motion/Reveal";

/* YouTube / Vimeo page URLs → embeddable URLs; anything else is treated as a direct video file. */
function toEmbed(url) {
  const yt = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]{11})/);
  if (yt) return { iframe: `https://www.youtube.com/embed/${yt[1]}?autoplay=1&rel=0` };
  const vm = url.match(/vimeo\.com\/(\d+)/);
  if (vm) return { iframe: `https://player.vimeo.com/video/${vm[1]}?autoplay=1` };
  return { file: url };
}

/**
 * Showreel — plays `videoUrl` in a lightbox (set NEXT_PUBLIC_SHOWREEL_URL).
 * With no URL the section is not rendered: a play button with nothing behind
 * it is worse than no section.
 */
export default function Showreel({
  theme = "cream",
  id = "showreel",
  videoUrl = process.env.NEXT_PUBLIC_SHOWREEL_URL,
}) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  if (!videoUrl) return null;
  const media = toEmbed(videoUrl);

  return (
    <SectionWrapper id={id} theme={theme}>
      <div className="container">

        {/* =========================================
            SECTION LABEL
        ========================================= */}

        <Reveal className="flex justify-center">
          <SectionTag>SHOWREEL</SectionTag>
        </Reveal>


        {/* =========================================
            SHOWREEL BLOCK
        ========================================= */}

        <Reveal delay={0.08}>
          <motion.button
            type="button"
            onClick={() => setOpen(true)}
            aria-label="Play showreel"
            whileHover={{
              scale: 1.008,
              y: -2,
            }}
            whileTap={{
              scale: 0.995,
            }}
            transition={{
              duration: 0.45,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="
              group
              relative
              mt-5
              block
              w-full
              overflow-hidden
              rounded-[9px]
              bg-brand-orange
              shadow-[0_18px_40px_rgba(26,9,7,0.14)]
              focus:outline-none
              focus-visible:ring-2
              focus-visible:ring-brand-orange
              focus-visible:ring-offset-4
            "
          >

            {/* -----------------------------------------
                SUBTLE TEXTURE
            ----------------------------------------- */}

            <div
              className="
                grain
                absolute
                inset-0
                z-0
                opacity-[0.035]
              "
            />


            {/* -----------------------------------------
                SUBTLE ORANGE GRADIENT
            ----------------------------------------- */}

            <div
              className="
                absolute
                inset-0
                bg-gradient-to-br
                from-brand-cream/[0.025]
                via-transparent
                to-brand-black/[0.06]
              "
            />


            {/* -----------------------------------------
                SHOWREEL TITLE
            ----------------------------------------- */}

            <div
              className="
                relative
                z-10
                flex
                min-h-[255px]
                items-center
                justify-center
                px-5
                pb-32
                pt-12
                sm:min-h-[275px]
                sm:px-8
                md:min-h-[315px]
                md:px-12
                lg:min-h-[350px]
                lg:px-16
              "
            >

              <h2
                className="
                  max-w-[1100px]
                  text-center
                  font-display
                  text-[clamp(2.6rem,7.2vw,6.5rem)]
                  font-black
                  uppercase
                  leading-[0.92]
                  tracking-[-0.02em]
                  text-brand-cream
                "
              >
                <span className="block">
                  WATCH OUR
                </span>

                <span className="block">
                  SHOWREEL
                </span>
              </h2>

            </div>


            {/* -----------------------------------------
                PLAY BUTTON
            ----------------------------------------- */}

            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{
                once: true,
                amount: 0.5,
              }}
              transition={{
                duration: 0.7,
                delay: 0.15,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="
                absolute
                inset-x-0
                top-[85%]
                z-20
                -mt-10
                flex
                justify-center
              "
            >

              <motion.div
                animate={{
                  scale: [1, 1.045, 1],
                }}
                transition={{
                  duration: 2.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="
                  flex
                  h-[68px]
                  w-[68px]
                  items-center
                  justify-center
                  rounded-full
                  bg-brand-card
                  shadow-[0_8px_25px_rgba(26,9,7,0.18)]
                  transition-transform
                  duration-500
                  group-hover:scale-105
                  sm:h-[74px]
                  sm:w-[74px]
                  md:h-[82px]
                  md:w-[82px]
                "
              >

                <Play
                  size={29}
                  strokeWidth={0}
                  fill="var(--brand-orange)"
                  color="var(--brand-orange)"
                  className="translate-x-[2px]"
                />

              </motion.div>

            </motion.div>

          </motion.button>
        </Reveal>

      </div>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-brand-black/90 p-4 backdrop-blur-sm"
            role="dialog"
            aria-modal="true"
            aria-label="Showreel"
          >
            <button
              onClick={() => setOpen(false)}
              aria-label="Close showreel"
              className="absolute right-5 top-5 flex h-11 w-11 items-center justify-center rounded-full border border-brand-cream/30 text-brand-cream hover:bg-brand-cream hover:text-brand-black"
            >
              <X size={20} />
            </button>
            <div onClick={(e) => e.stopPropagation()} className="aspect-video w-full max-w-5xl overflow-hidden rounded-card bg-brand-black">
              {media.iframe ? (
                <iframe src={media.iframe} title="OCT20FIVE showreel" allow="autoplay; fullscreen; picture-in-picture" allowFullScreen className="h-full w-full" />
              ) : (
                <video src={media.file} controls autoPlay className="h-full w-full" />
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </SectionWrapper>
  );
}