'use client'

import Link from 'next/link'

// variant: 'auto' (inherits currentColor / surface tokens), 'dark' (cream mark, for dark bg),
// 'light' (dark mark, for light/cream bg)
// size: 'sm' | 'md' | 'lg'
export default function Logo({ variant = 'auto', size = 'md', href = '/', showWordmark = true }) {
  const isDark = variant === 'dark'
  const isLight = variant === 'light'

  const sizeMap = {
    sm: { box: 'w-8 h-8', top: 'text-[0.34rem]', mid: 'text-[0.62rem]', gap: 'gap-0', wordmark: 'text-sm' },
    md: { box: 'w-10 h-10', top: 'text-[0.4rem]', mid: 'text-[0.78rem]', gap: 'gap-0', wordmark: 'text-base' },
    lg: { box: 'w-24 h-24', top: 'text-[0.85rem]', mid: 'text-[1.9rem]', gap: 'gap-0.5', wordmark: 'text-2xl' },
  }
  const s = sizeMap[size] || sizeMap.md

  // Fill logic: solid badge, inverts against the section it sits on.
  // auto -> uses currentColor as border/text so it inherits nav theme; bg follows --surface-bg
  const badgeBg = isDark
    ? 'bg-brand-cream text-brand-dark border-brand-cream'
    : isLight
    ? 'bg-brand-dark text-brand-cream border-brand-dark'
    : 'bg-[var(--surface-fg)] text-[var(--surface-bg)] border-[var(--surface-fg)]'

  return (
    <Link href={href} className="inline-flex items-center gap-2.5" aria-label="OCT20FIVE Home">
      <span
        className={`relative flex flex-col items-center justify-center ${s.box} ${s.gap} rounded-[0.35em] border-[1.5px] ${badgeBg} font-display font-black leading-[0.85] select-none shrink-0`}
      >
        <span className={`${s.top} tracking-[0.15em] opacity-90`}>OCT</span>
        <span className={`${s.mid} font-black tracking-tighter -my-[0.05em]`}>20</span>
        <span className={`${s.top} tracking-[0.15em] opacity-90`}>FIVE</span>
      </span>

      {showWordmark && (
        <span className={`hidden sm:inline font-display font-bold tracking-tight ${s.wordmark}`}>
          OCT20FIVE
        </span>
      )}
    </Link>
  )
}