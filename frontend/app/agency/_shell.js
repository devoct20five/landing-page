"use client";

import Navbar from "@/components/navigation/Navbar";
import Footer from "@/components/layout/Footer";
import SectionWrapper from "@/components/layout/SectionWrapper";
import SectionTag from "@/components/ui/SectionTag";

/** Shared frame for the small account pages. */
export default function Shell({ tag, title, children, wide }) {
  return (
    <>
      <Navbar variant="utility" initialTheme="dark" />
      <main>
        <SectionWrapper theme="dark" className="!pt-40 !pb-24">
          <div className={`container mx-auto ${wide ? "max-w-4xl" : "max-w-lg"}`}>
            {tag && <SectionTag>{tag}</SectionTag>}
            <h1 className="mt-6 font-display uppercase leading-[0.95] tracking-tight text-display-md text-balance">{title}</h1>
            <div className="mt-8">{children}</div>
          </div>
        </SectionWrapper>
      </main>
      <Footer />
    </>
  );
}
