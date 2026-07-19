'use client'

import Link from 'next/link'

export default function Logo({ variant = 'auto', size = 'md', href = '/' }) {
  const dims = size === 'lg' ? 'text-2xl' : size === 'sm' ? 'text-sm' : 'text-base'
  const box = size === 'lg' ? 'p-3' : 'p-2'
  const isLight = variant === 'light'
  const isDark = variant === 'dark'

  const content = (
    <span className={`inline-flex items-center gap-2 font-display font-bold ${dims}`}>
      <span className={`grid grid-cols-2 grid-rows-2 gap-[2px] ${box} rounded-md ${isDark ? 'bg-brand-cream text-brand-dark' : isLight ? 'bg-brand-dark text-brand-cream' : 'bg-current text-[var(--surface-bg)]'}`} style={{ lineHeight: 1 }}>
        <span className="text-[0.55em]">OCT</span>
        <span className="text-[0.55em] justify-self-end">20</span>
        <span className="text-[0.55em] col-span-2 text-center tracking-widest">FIVE</span>
      </span>
      <span className="tracking-tight hidden sm:inline">OCT20FIVE</span>
    </span>
  )
  return <Link href={href} className="inline-flex" aria-label="OCT20FIVE Home">{content}</Link>
}
