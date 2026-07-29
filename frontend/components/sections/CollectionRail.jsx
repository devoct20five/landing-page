'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, Play, Mouse } from 'lucide-react'

export default function CollectionRail({
  eyebrow = 'Selected Work',
  title,
  collections = [],
  accent = '#ff5a1f',
  showScrollCue = true,
  className = '',
}) {
  return (
    <section
      className={`
        relative
        overflow-hidden
        bg-black
        py-8
        text-white
        md:py-10
        ${className}
      `}
      style={{ '--collection-accent': accent }}
    >
      {/* =====================================================
          OPTIONAL HEADER
      ===================================================== */}

      {(eyebrow || title) && (
        <div className="container mb-7 md:mb-8">
          {eyebrow && (
            <div className="mb-3 flex items-center gap-2">
              <span
                className="h-px w-6"
                style={{
                  backgroundColor: 'var(--collection-accent)',
                }}
              />

              <span className="text-[8px] font-bold uppercase tracking-[0.22em] text-white/50">
                {eyebrow}
              </span>
            </div>
          )}

          {title && (
            <h2 className="max-w-4xl font-display text-[clamp(2rem,5vw,5rem)] font-black uppercase leading-[0.86] tracking-[-0.05em]">
              {title}
            </h2>
          )}
        </div>
      )}

      {/* =====================================================
          COLLECTIONS
      ===================================================== */}

      <div className="relative">
        {collections.map((collection, index) => (
          <CollectionRow
            key={collection.id || index}
            collection={collection}
            index={index}
            accent={accent}
          />
        ))}
      </div>

      {/* =====================================================
          SCROLL CUE
      ===================================================== */}

      {showScrollCue && (
        <div className="mt-7 flex items-center justify-center gap-2 text-[8px] font-medium uppercase tracking-[0.25em] text-white/30">
          <Mouse size={12} strokeWidth={1.2} />
          <span>Scroll to explore</span>
        </div>
      )}
    </section>
  )
}


/* =========================================================
   COLLECTION ROW
========================================================= */

function CollectionRow({
  collection,
  index,
  accent,
}) {
  const cards = collection.cards || []

  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 18,
      }}
      whileInView={{
        opacity: 1,
        y: 0,
      }}
      viewport={{
        once: true,
        amount: 0.1,
      }}
      transition={{
        duration: 0.55,
        delay: index * 0.04,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="
        border-t
        border-white/[0.09]
        py-2
        md:py-[9px]
      "
    >
      <div
        className="
          container
          flex
          min-w-0
          items-stretch
          gap-3
          md:gap-4
        "
      >

        {/* =================================================
            COLLECTION INFO
        ================================================= */}

        <div
          className="
            flex
            w-[72px]
            shrink-0
            flex-col
            justify-center
            md:w-[92px]
            lg:w-[105px]
          "
        >
          <span
            className="
              text-[7px]
              font-bold
              uppercase
              tracking-[0.12em]
              md:text-[8px]
            "
            style={{
              color: accent,
            }}
          >
            {collection.number ||
              `TIER ${String(index + 1).padStart(2, '0')}`}
          </span>

          <h3
            className="
              mt-[3px]
              font-display
              text-[1rem]
              font-black
              uppercase
              leading-[0.88]
              tracking-[-0.03em]
              md:text-[1.25rem]
            "
          >
            {collection.title}
          </h3>

          {collection.subtitle && (
            <span
              className="
                mt-[3px]
                font-display
                text-[0.58rem]
                font-bold
                uppercase
                leading-none
                text-white/40
                md:text-[0.68rem]
              "
            >
              {collection.subtitle}
            </span>
          )}

          <span
            className="
              mt-3
              h-[2px]
              w-2
              rounded-full
            "
            style={{
              backgroundColor: accent,
            }}
          />
        </div>


        {/* =================================================
            CARDS
        ================================================= */}

        <div className="min-w-0 flex-1 overflow-hidden">
          <div
            className="
              flex
              h-[76px]
              gap-[5px]
              overflow-x-auto
              scrollbar-none
              md:h-[88px]
              md:gap-[6px]
              lg:h-[96px]
            "
          >
            {cards.map((card, cardIndex) => (
              <CollectionCard
                key={card.id || cardIndex}
                card={card}
                accent={accent}
                index={cardIndex}
              />
            ))}
          </div>
        </div>


        {/* =================================================
            ROW ARROW
        ================================================= */}

        {collection.href && (
          <Link
            href={collection.href}
            aria-label={`Explore ${collection.title}`}
            className="
              hidden
              w-5
              shrink-0
              items-center
              justify-center
              text-white/50
              transition-colors
              hover:text-white
              md:flex
            "
          >
            <ArrowRight
              size={16}
              strokeWidth={1.2}
            />
          </Link>
        )}
      </div>
    </motion.div>
  )
}


/* =========================================================
   COLLECTION CARD
========================================================= */

function CollectionCard({
  card,
  accent,
  index,
}) {
  /*
   * Featured cards are deliberately wider.
   * This is one of the most important differences from
   * the original implementation.
   */

  const widthClass = card.featured
    ? `
      w-[132px]
      md:w-[155px]
      lg:w-[175px]
    `
    : `
      w-[88px]
      md:w-[104px]
      lg:w-[118px]
    `

  const content = (
    <motion.div
      whileHover={{
        y: -2,
      }}
      transition={{
        duration: 0.25,
        ease: [0.22, 1, 0.36, 1],
      }}
      className={`
        group
        relative
        h-full
        shrink-0
        overflow-hidden
        border
        bg-[#090909]
        transition-all
        duration-300

        ${widthClass}

        ${
          card.featured
            ? 'border-[var(--collection-accent)]'
            : 'border-white/[0.08]'
        }
      `}
      style={{
        '--collection-accent': accent,
      }}
    >

      {/* IMAGE */}

      {card.image && (
        <Image
          src={card.image}
          alt={card.alt || card.title || ''}
          fill
          sizes="175px"
          className="
            object-cover
            transition-transform
            duration-700
            ease-[cubic-bezier(.22,1,.36,1)]
            group-hover:scale-[1.06]
          "
        />
      )}


      {/* DARK OVERLAY */}

      <div
        className="
          absolute
          inset-0
          bg-gradient-to-t
          from-black/90
          via-black/20
          to-black/5
        "
      />


      {/* FEATURED OUTLINE */}

      {card.featured && (
        <div
          className="
            pointer-events-none
            absolute
            inset-0
            border
            border-[var(--collection-accent)]
          "
        />
      )}


      {/* PLAY */}

      {card.play && (
        <div
          className="
            absolute
            bottom-1.5
            left-1.5
            flex
            h-4
            w-4
            items-center
            justify-center
            rounded-full
            border
            border-white/45
            bg-black/50
            backdrop-blur-sm
          "
        >
          <Play
            size={6}
            fill="white"
            className="translate-x-[0.5px]"
          />
        </div>
      )}


      {/* TEXT */}

      {(card.title || card.subtitle) && (
        <div
          className="
            absolute
            inset-x-1.5
            bottom-1.5
            z-10
          "
        >
          {card.title && (
            <p
              className="
                font-display
                text-[7px]
                font-bold
                uppercase
                leading-[0.95]
                text-white
                md:text-[8px]
              "
            >
              {card.title}
            </p>
          )}

          {card.subtitle && (
            <p
              className="
                mt-0.5
                text-[5px]
                leading-tight
                text-white/55
                md:text-[6px]
              "
            >
              {card.subtitle}
            </p>
          )}
        </div>
      )}

    </motion.div>
  )

  if (card.href) {
    return (
      <Link
        href={card.href}
        className="block h-full shrink-0"
      >
        {content}
      </Link>
    )
  }

  return content
}