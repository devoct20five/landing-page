'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Check, ArrowRight, ArrowUpRight, Minus, Plus } from 'lucide-react'
import SectionWrapper from '@/components/layout/SectionWrapper'
import SectionTag from '@/components/ui/SectionTag'
import Reveal from '@/components/motion/Reveal'
import { iconFor } from './icons'
import { DEFAULT_PACK, PACK_DISCOUNT, formatINR, links, priceFor } from '@/data/plans'

const EASE = [0.22, 1, 0.36, 1]

/* Animated number: re-keys on change so the figure visibly updates when the pack changes */
function Money({ value, className = '' }) {
  return (
    <AnimatePresence mode="popLayout" initial={false}>
      <motion.span
        key={value}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.25, ease: EASE }}
        className={`inline-block ${className}`}
      >
        {formatINR(value)}
      </motion.span>
    </AnimatePresence>
  )
}

function PlanCard({ plan, model, pack }) {
  const Icon = iconFor(plan.icon)
  const isProject = model.mode === 'project'
  const p = priceFor(plan, pack)
  const featured = plan.featured
  const noun = pack === 1 ? model.noun.one : model.noun.many

  const ink = featured ? 'text-brand-black' : 'text-brand-cream'
  const soft = featured ? 'text-brand-textSoft' : 'text-brand-cream/60'
  const line = featured ? 'border-brand-black/10' : 'border-brand-cream/10'

  return (
    <motion.article
      layout="position"
      className={`relative flex h-full flex-col rounded-card p-8 md:p-9 ${
        featured
          ? 'bg-brand-cream shadow-floating ring-1 ring-brand-orange lg:-my-4 lg:py-12'
          : 'border border-brand-cream/10 bg-brand-blackSoft'
      }`}
    >
      {featured && (
        <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-brand-orange px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.18em] text-brand-cream">
          Most popular
        </span>
      )}

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span
            className={`flex h-11 w-11 items-center justify-center rounded-2xl ${
              featured ? 'bg-brand-orange/[0.12]' : 'bg-brand-cream/[0.08]'
            }`}
          >
            <Icon size={20} strokeWidth={1.6} className="text-brand-orange" />
          </span>
          <h3 className={`font-display text-2xl font-black uppercase tracking-tight ${ink}`}>{plan.name}</h3>
        </div>
        {!isProject && p.discountPct > 0 && (
          <span className="rounded-full bg-brand-orange px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-brand-cream">
            Save {p.discountPct}%
          </span>
        )}
      </div>

      {/* PRICE ------------------------------------------------ */}
      <div className="mt-8">
        {isProject && <p className={`text-xs font-bold uppercase tracking-[0.2em] ${soft}`}>Starting at</p>}
        <div className="mt-1 flex items-end gap-2">
          <Money value={p.unit} className={`font-display text-[3.25rem] font-black leading-none tracking-tight ${ink}`} />
          <span className={`pb-1.5 text-sm font-medium ${soft}`}>
            per {model.noun.one}
          </span>
        </div>

        {!isProject && (
          <div className={`mt-4 rounded-2xl px-4 py-3 text-sm ${featured ? 'bg-brand-black/[0.04]' : 'bg-brand-cream/[0.05]'}`}>
            <div className="flex items-baseline justify-between gap-3">
              <span className={soft}>
                {pack} {noun}
              </span>
              <span className={`font-bold ${ink}`}>
                {p.save > 0 && (
                  <span className={`mr-2 font-normal line-through ${soft}`}>{formatINR(p.list)}</span>
                )}
                <Money value={p.total} />
              </span>
            </div>
            {p.save > 0 && (
              <p className="mt-1 text-xs font-semibold text-brand-orange">You save {formatINR(p.save)}</p>
            )}
          </div>
        )}

        {isProject && plan.projectTypes && (
          <div className="mt-4 flex flex-wrap gap-2">
            {plan.projectTypes.map((t) => (
              <span
                key={t}
                className={`rounded-full border px-3 py-1 text-xs font-medium ${
                  featured ? 'border-brand-black/15 text-brand-black' : 'border-brand-cream/20 text-brand-cream/80'
                }`}
              >
                {t}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* FEATURES --------------------------------------------- */}
      <ul className={`mt-8 space-y-3.5 border-t pt-8 ${line}`}>
        {plan.features.map((f) => (
          <li key={f} className={`flex items-start gap-3 text-[15px] leading-snug ${featured ? 'text-brand-black/85' : 'text-brand-cream/85'}`}>
            <Check size={17} strokeWidth={2.4} className="mt-0.5 shrink-0 text-brand-orange" />
            {f}
          </li>
        ))}
      </ul>

      {/* CTAS ------------------------------------------------- */}
      <div className="mt-auto pt-10">
        <Link
          href={links.checkout(model.slug, plan.key, isProject ? undefined : pack)}
          className={`btn w-full justify-center ${featured ? 'btn-primary' : 'btn-secondary'}`}
        >
          {isProject ? `Start with ${plan.name}` : `Get ${plan.name} · ${pack} ${noun}`}
          <ArrowRight size={16} strokeWidth={2} />
        </Link>
        <Link
          href={links.call(model.slug, plan.key)}
          className={`mt-3 flex items-center justify-center gap-1.5 text-sm font-semibold underline-offset-4 hover:underline ${
            featured ? 'text-brand-black/70' : 'text-brand-cream/70'
          }`}
        >
          Not sure? Book a call <ArrowUpRight size={14} />
        </Link>
      </div>
    </motion.article>
  )
}

/* Side-by-side comparison — rows line up by position (every plan lists 6 features in the same order) */
function CompareTable({ model }) {
  const rows = model.plans[0].features.map((_, i) => model.plans.map((p) => p.features[i]))
  return (
    <div id="compare" className="mt-6 overflow-x-auto rounded-card border border-brand-cream/10 bg-brand-blackSoft">
      <table className="w-full min-w-[640px] border-collapse text-left text-sm">
        <thead>
          <tr className="border-b border-brand-cream/10">
            <th className="w-[4%] p-5" />
            {model.plans.map((p) => (
              <th key={p.key} className="p-5 align-bottom">
                <span className="font-display text-lg font-black uppercase tracking-tight text-brand-cream">{p.name}</span>
                <span className="mt-0.5 block text-xs font-normal text-brand-cream/55">
                  {formatINR(p.unit)} / {model.noun.one}
                </span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((cells, i) => (
            <tr key={i} className="border-b border-brand-cream/[0.07] last:border-0">
              <td className="p-5 font-display text-xs font-bold text-brand-orange">{String(i + 1).padStart(2, '0')}</td>
              {cells.map((c, j) => (
                <td key={j} className="p-5 align-top text-brand-cream/85">{c}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default function PricingSection({ model }) {
  const [pack, setPack] = useState(DEFAULT_PACK)
  const [compare, setCompare] = useState(false)
  const isProject = model.mode === 'project'

  return (
    <SectionWrapper id="pricing" theme="dark" clip>
      <div className="pointer-events-none absolute left-1/2 top-0 h-[520px] w-[900px] -translate-x-1/2 rounded-full bg-brand-orange/10 blur-[140px]" />
      <div className="container relative">
        <div className="mx-auto max-w-3xl text-center">
          <Reveal><SectionTag>Pricing</SectionTag></Reveal>
          <Reveal delay={0.05}>
            <h2 className="mt-6 font-display text-[clamp(2.4rem,5vw,4.5rem)] font-black uppercase leading-[0.98] tracking-[-0.02em] text-brand-cream text-balance">
              {model.headline}
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-brand-cream/70 md:text-lg">{model.subline}</p>
          </Reveal>
        </div>

        {/* PACK SELECTOR — actually drives every number below */}
        {!isProject && (
          <Reveal delay={0.15} className="mt-12 flex flex-col items-center gap-3">
            <div role="radiogroup" aria-label="Pack size" className="inline-flex rounded-full border border-brand-cream/15 bg-brand-cream/[0.04] p-1.5">
              {model.packs.map((n) => {
                const on = n === pack
                return (
                  <button
                    key={n}
                    role="radio"
                    aria-checked={on}
                    onClick={() => setPack(n)}
                    className={`relative rounded-full px-5 py-2.5 text-sm font-bold transition-colors md:px-7 ${
                      on ? 'text-brand-cream' : 'text-brand-cream/60 hover:text-brand-cream'
                    }`}
                  >
                    {on && (
                      <motion.span layoutId="pack-pill" className="absolute inset-0 rounded-full bg-brand-orange" transition={{ duration: 0.35, ease: EASE }} />
                    )}
                    <span className="relative flex items-center gap-2">
                      {n} {model.noun.many}
                      {PACK_DISCOUNT[n] > 0 && (
                        <span className={`hidden rounded-full px-2 py-0.5 text-[10px] font-bold sm:inline ${on ? 'bg-brand-cream/20' : 'bg-brand-orange/20 text-brand-orange'}`}>
                          −{PACK_DISCOUNT[n]}%
                        </span>
                      )}
                    </span>
                  </button>
                )
              })}
            </div>
            <p className="text-center text-xs text-brand-cream/50">Bigger packs cost less per {model.noun.one}. Prices exclude 18% GST.</p>
          </Reveal>
        )}
        {isProject && (
          <p className="mt-10 text-center text-xs text-brand-cream/50">Fixed price per project. Prices exclude 18% GST.</p>
        )}

        {/* PLANS */}
        <div className="mt-14 grid items-stretch gap-6 lg:grid-cols-3 lg:gap-8">
          {model.plans.map((plan) => (
            <PlanCard key={plan.key} plan={plan} model={model} pack={pack} />
          ))}
        </div>

        {/* COMPARE */}
        <div className="mt-10 text-center">
          <button
            onClick={() => setCompare((v) => !v)}
            aria-expanded={compare}
            className="btn btn-secondary"
          >
            {compare ? <Minus size={16} /> : <Plus size={16} />}
            {compare ? 'Hide comparison' : 'Compare plans side by side'}
          </button>
        </div>
        <AnimatePresence initial={false}>
          {compare && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.45, ease: EASE }}
              className="overflow-hidden"
            >
              <CompareTable model={model} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* CUSTOM */}
        {model.custom?.title && (
          <Reveal className="mt-12">
            <div className="relative overflow-hidden rounded-card border border-brand-orange/40 bg-gradient-to-br from-brand-blackElevated to-brand-blackSoft p-8 md:p-12">
              <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-brand-orange/20 blur-[90px]" />
              <div className="relative flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
                <div className="max-w-xl">
                  <p className="text-xs font-bold uppercase tracking-[0.25em] text-brand-orange">Custom</p>
                  <h3 className="mt-3 font-display text-3xl font-black uppercase leading-none tracking-tight text-brand-cream md:text-4xl">
                    {model.custom.title}
                  </h3>
                  <p className="mt-4 text-brand-cream/70">{model.custom.body}</p>
                </div>
                <div className="flex flex-col items-start gap-4 md:items-end">
                  <div className="md:text-right">
                    <span className="text-xs uppercase tracking-[0.2em] text-brand-cream/50">From</span>
                    <p className="font-display text-4xl font-black text-brand-cream">{formatINR(model.custom.from)}</p>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    <Link href={links.call(model.slug, 'custom')} className="btn btn-primary">
                      Book a call <ArrowRight size={16} />
                    </Link>
                    <Link href={links.contact(model.slug)} className="btn btn-secondary">Request a quote</Link>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        )}
      </div>
    </SectionWrapper>
  )
}
