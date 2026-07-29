"use client";

import { motion } from "framer-motion";
import { Play } from "lucide-react";
import SectionWrapper from "@/components/layout/SectionWrapper";
import SectionTag from "@/components/ui/SectionTag";
import Reveal from "@/components/motion/Reveal";

export default function Showreel({
  theme = "cream",
  id = "showreel",
}) {
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
              shadow-[0_18px_40px_rgba(0,0,0,0.14)]
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
                from-white/[0.025]
                via-transparent
                to-black/[0.06]
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
                py-12
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
                  text-[clamp(3.2rem,10vw,9rem)]
                  font-black
                  uppercase
                  leading-[0.78]
                  tracking-[-0.065em]
                  text-white
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
                left-1/2
                top-1/2
                z-20
                -translate-x-1/2
                -translate-y-1/2
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
                  bg-white
                  shadow-[0_8px_25px_rgba(0,0,0,0.18)]
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
    </SectionWrapper>
  );
}