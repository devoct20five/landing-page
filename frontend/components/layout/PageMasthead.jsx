import Eclipse from '@/components/brands/Eclipse'

/**
 * Compact dark page header (brand book: dark field + eclipse glow + orange hairline).
 * Used by the publication, category, author and portfolio pages — the full-height
 * <Hero> is for landing pages, this is for pages people come to *use*.
 */
export default function PageMasthead({ eyebrow, title, description, meta, children, size = 'xl' }) {
  const titleSize =
    size === 'lg'
      ? 'text-display-xl'
      : 'text-hero'
  return (
    <section
      data-theme="dark"
      className="theme-dark relative overflow-hidden bg-brand-black pb-10 pt-36 text-brand-cream md:pb-14 md:pt-44"
    >
      <Eclipse />
      <div className="container relative z-10">
        {eyebrow && (
          <div className="mb-6 flex items-center gap-4 text-xs font-bold uppercase tracking-[0.3em] text-brand-orange md:text-sm">
            <span className="h-px w-10 bg-brand-orange" />
            {eyebrow}
          </div>
        )}
        <h1 className={`max-w-[18ch] font-display font-black uppercase leading-[0.92] tracking-[-0.02em] text-balance ${titleSize}`}>
          {title}
        </h1>
        {description && (
          <p className="mt-7 max-w-2xl text-base leading-relaxed text-brand-cream/70 md:text-lg">{description}</p>
        )}
        {meta && <div className="mt-6 text-sm font-medium tracking-wide text-brand-cream/55">{meta}</div>}
        {children && <div className="mt-10">{children}</div>}
        <div className="mt-10 h-px w-full bg-brand-orange/60" />
      </div>
    </section>
  )
}
