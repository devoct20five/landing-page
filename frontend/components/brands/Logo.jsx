'use client'

import Link from 'next/link'

export default function Logo({
  variant = 'light',
  size = 'md',
  href = '/agency',
  className = '',
}) {
  const isDark = variant === 'dark'

  const sizes = {
    sm: {
      wrapper: 'w-[34px] h-[34px]',
      text: 'text-[8px]',
      gap: 'leading-[0.78]',
    },

    md: {
      wrapper: 'w-[46px] h-[46px]',
      text: 'text-[10px]',
      gap: 'leading-[0.78]',
    },

    lg: {
      wrapper: 'w-[58px] h-[58px]',
      text: 'text-[13px]',
      gap: 'leading-[0.78]',
    },
  }

  const current = sizes[size] || sizes.md

  return (
    <Link
      href={href}
      aria-label="OCT20FIVE"
      className={`
        ${current.wrapper}
        relative
        flex
        shrink-0
        items-center
        justify-center
        overflow-hidden
        rounded-[3px]
        transition-transform
        duration-300
        hover:scale-105
        ${className}
      `}
    >

      {/* =====================================================
          LOGO BODY
      ===================================================== */}

      <span
        className={`
          relative
          flex
          h-full
          w-full
          flex-col
          items-center
          justify-center
          ${current.gap}
          font-display
          font-black
          uppercase
          tracking-[-0.08em]
          ${current.text}

          ${
            isDark
              ? 'bg-brand-dark text-brand-orange'
              : 'bg-brand-orange text-white'
          }
        `}
      >

        {/* OCT */}

        <span>
          OCT
        </span>


        {/* 20 */}

        <span>
          20
        </span>


        {/* FIVE */}

        <span>
          FIVE
        </span>

      </span>


      {/* =====================================================
          SUBTLE INNER BORDER
      ===================================================== */}

      <span
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          inset-[2px]
          rounded-[2px]
          border
          border-white/10
        "
      />

    </Link>
  )
}