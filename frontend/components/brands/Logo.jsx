'use client'

import Link from 'next/link'
import Image from 'next/image'

/**
 * OCT20FIVE logo — uses the real brand artwork (not a text approximation).
 *
 * Variants follow the brand book's Logo System (slides 5 & 9):
 *   orange  – primary mark, works on dark AND cream          (default)
 *   cream   – single-colour reversed mark for dark/orange backgrounds
 *   ink     – single-colour dark mark for cream backgrounds
 *   badge   – solid orange tile with cream mark (app icon / compact use)
 *
 * Legacy aliases are kept so existing call-sites keep working:
 *   'light' → orange (used on dark surfaces)   'dark' → ink (used on light surfaces)
 *
 * Rules from the book: never stretch, recolour, or add effects — so the
 * mark is rendered at its native square aspect ratio with no filters.
 */
const SRC = {
  orange: '/brand/logo-orange.png',
  cream: '/brand/logo-cream.png',
  ink: '/brand/logo-ink.png',
  badge: '/brand/logo-badge.png',
}
const ALIAS = { light: 'orange', dark: 'ink' }

const PX = { xs: 28, sm: 36, md: 46, lg: 64, xl: 96, '2xl': 140 }

export default function Logo({
  variant = 'orange',
  size = 'md',
  href = '/',
  className = '',
  asLink = true,
  priority = false,
}) {
  const key = SRC[variant] ? variant : ALIAS[variant] || 'orange'
  const px = typeof size === 'number' ? size : PX[size] || PX.md

  const img = (
    <Image
      src={SRC[key]}
      alt="OCT20FIVE"
      width={px}
      height={px}
      priority={priority}
      draggable={false}
      style={{ width: px, height: px }}
      className="select-none object-contain"
    />
  )

  if (!asLink || !href) {
    return <span className={`inline-flex shrink-0 ${className}`}>{img}</span>
  }

  return (
    <Link
      href={href}
      aria-label="OCT20FIVE — home"
      className={`inline-flex shrink-0 items-center justify-center transition-transform duration-300 hover:scale-105 ${className}`}
    >
      {img}
    </Link>
  )
}
