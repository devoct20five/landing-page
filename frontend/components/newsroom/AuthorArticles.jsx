'use client'

import { useState, useMemo } from 'react'
import ArticleCard from './ArticleCard'
import { getCategory } from '@/lib/newsroom'

/** Author's written material, filterable by desk. Receives plain article objects. */
export default function AuthorArticles({ articles }) {
  const [cat, setCat] = useState('all')
  const desks = useMemo(() => [...new Set(articles.map((a) => a.category))], [articles])
  const shown = cat === 'all' ? articles : articles.filter((a) => a.category === cat)
  const pill = (on) =>
    `rounded-full border px-5 py-2.5 text-sm font-bold transition-colors ${
      on ? 'border-brand-black bg-brand-black text-brand-cream' : 'border-brand-border text-brand-textSoft hover:border-brand-black hover:text-brand-black'
    }`
  return (
    <div>
      {desks.length > 1 && (
        <div className="mb-10 flex flex-wrap gap-2.5" role="tablist" aria-label="Filter by desk">
          <button role="tab" aria-selected={cat === 'all'} onClick={() => setCat('all')} className={pill(cat === 'all')}>
            All <span className="ml-1 opacity-60">{articles.length}</span>
          </button>
          {desks.map((d) => (
            <button key={d} role="tab" aria-selected={cat === d} onClick={() => setCat(d)} className={pill(cat === d)}>
              {getCategory(d)?.label}
              <span className="ml-1 opacity-60">{articles.filter((a) => a.category === d).length}</span>
            </button>
          ))}
        </div>
      )}
      <div className="grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
        {shown.map((a) => (
          <ArticleCard key={a.slug} article={a} />
        ))}
      </div>
    </div>
  )
}
