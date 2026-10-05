import { slugify } from '@/lib/newsroom'

/** Renders article blocks with real reading typography (Satoshi, ~68ch, generous leading). */
export default function ArticleBody({ blocks }) {
  let firstP = true
  return (
    <div className="article-body">
      {blocks.map((b, i) => {
        if (b.type === 'h2')
          return (
            <h2
              key={i}
              id={slugify(b.text)}
              className="mb-5 mt-14 scroll-mt-32 font-display text-[1.75rem] font-extrabold leading-tight tracking-tight text-brand-black md:text-[2rem]"
            >
              {b.text}
            </h2>
          )
        if (b.type === 'quote')
          return (
            <blockquote key={i} className="my-12 border-l-4 border-brand-orange pl-6 md:pl-8">
              <p className="font-display text-[1.6rem] font-extrabold leading-snug tracking-tight text-brand-black md:text-[2rem]">
                &ldquo;{b.text}&rdquo;
              </p>
              {b.cite && <footer className="mt-4 text-sm font-bold uppercase tracking-[0.18em] text-brand-textSoft">{b.cite}</footer>}
            </blockquote>
          )
        if (b.type === 'list')
          return (
            <ul key={i} className="my-8 space-y-3.5">
              {b.items.map((it) => (
                <li key={it} className="flex gap-4 text-[1.125rem] leading-[1.7] text-brand-black/85">
                  <span className="mt-[0.7em] h-2 w-2 shrink-0 rounded-full bg-brand-orange" />
                  {it}
                </li>
              ))}
            </ul>
          )
        const lead = firstP
        firstP = false
        return (
          <p
            key={i}
            className={`mb-6 ${
              lead
                ? 'text-[1.3rem] font-medium leading-[1.7] text-brand-black md:text-[1.4rem]'
                : 'text-[1.125rem] leading-[1.85] text-brand-black/85'
            }`}
          >
            {b.text}
          </p>
        )
      })}
    </div>
  )
}
