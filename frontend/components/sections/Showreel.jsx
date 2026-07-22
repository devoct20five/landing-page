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

        <Reveal className="flex justify-center mb-10">
          <SectionTag>Showreel</SectionTag>
        </Reveal>

        <Reveal delay={0.1}>
          <motion.button
            whileHover={{ scale: 1.015 }}
            whileTap={{ scale: 0.99 }}
            transition={{
              duration: 0.45,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="
              relative
              w-full
              overflow-hidden
              rounded-[28px]
              bg-brand-orange
              py-16
              md:py-24
              shadow-[0_30px_70px_rgba(0,0,0,0.18)]
            "
          >

            {/* subtle texture */}
            <div className="absolute inset-0 opacity-[0.04] grain" />

            {/* play button */}
            <motion.div
              animate={{
                scale: [1, 1.08, 1],
              }}
              transition={{
                duration: 2.2,
                repeat: Infinity,
              }}
              className="
                absolute
                left-1/2
                top-1/2
                -translate-x-1/2
                -translate-y-1/2
                z-20
              "
            >
              <div
                className="
                  w-20
                  h-20
                  md:w-28
                  md:h-28
                  rounded-full
                  bg-white
                  shadow-2xl
                  flex
                  items-center
                  justify-center
                "
              >
                <Play
                  fill="#ff5a1f"
                  color="#ff5a1f"
                  className="translate-x-[3px]"
                  size={36}
                />
              </div>
            </motion.div>

            {/* text */}
            <div className="relative z-10">

              <h2
                className="
                  font-display
                  font-black
                  uppercase
                  text-white
                  leading-[0.82]
                  tracking-[-0.06em]
                  text-[clamp(3rem,11vw,9rem)]
                  text-center
                "
              >
                WATCH OUR
                <br />
                SHOWREEL
              </h2>

            </div>

          </motion.button>
        </Reveal>

      </div>
    </SectionWrapper>
  );
}