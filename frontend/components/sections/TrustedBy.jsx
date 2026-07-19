'use client'

import SectionWrapper from '@/components/layout/SectionWrapper'
import SectionTag from '@/components/ui/SectionTag'
import { TRUSTED_BY } from '@/data/content'

export default function TrustedBy({ theme = 'dark' }) {
  const items = [...TRUSTED_BY, ...TRUSTED_BY]
  return (
    <SectionWrapper theme={theme} className="!py-16 md:!py-24">
      <div className="container">
        <div className="flex flex-col items-center text-center">
          <SectionTag>Our work has been trusted by</SectionTag>
        </div>
      </div>
      <div className="mt-10 overflow-hidden [mask-image:linear-gradient(90deg,transparent,black_15%,black_85%,transparent)]">
        <div className="flex gap-16 md:gap-24 animate-marquee w-max">
          {items.map((brand, i) => (
            <span key={i} className="font-display uppercase text-3xl md:text-5xl tracking-tight opacity-70 hover:opacity-100 transition">
              {brand}
            </span>
          ))}
        </div>
      </div>
    </SectionWrapper>
  )
}
