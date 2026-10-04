/**
 * Eclipse — the OCT20FIVE signature backdrop.
 *
 * Recreates the brand book's imagery language (slides 1–26): a near-black
 * field (#1A0907), a glowing orange eclipse rim and a soft lens flare.
 * Pure SVG/CSS — no stock photography, no network requests.
 *
 * Decorative only (aria-hidden). Server-component safe.
 */
const ARC = 'M639 872 A620 620 0 0 1 1560 443'

export default function Eclipse({ className = '', bare = false }) {
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 overflow-hidden ${bare ? '' : 'bg-brand-black'} ${className}`}
    >
      {/* ambient warm bloom */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_72%_105%,rgba(255,90,31,0.26),transparent_58%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_10%_0%,rgba(46,26,22,0.9),transparent_55%)]" />

      <svg
        viewBox="0 0 1600 900"
        preserveAspectRatio="xMidYMid slice"
        className="absolute inset-y-0 right-0 h-full w-[230%] max-w-none sm:w-[140%] md:w-full"
      >
        <defs>
          <linearGradient
            id="ecl-rim"
            gradientUnits="userSpaceOnUse"
            x1="639"
            y1="872"
            x2="1560"
            y2="443"
          >
            <stop offset="0" stopColor="#FF5A1F" stopOpacity="0" />
            <stop offset="0.36" stopColor="#FF5A1F" stopOpacity="0.85" />
            <stop offset="0.5" stopColor="#FFE2CC" />
            <stop offset="0.64" stopColor="#FF5A1F" stopOpacity="0.85" />
            <stop offset="1" stopColor="#FF5A1F" stopOpacity="0" />
          </linearGradient>
          <radialGradient id="ecl-flare">
            <stop offset="0" stopColor="#FFF3E6" />
            <stop offset="0.18" stopColor="#FFB089" stopOpacity="0.9" />
            <stop offset="0.5" stopColor="#FF5A1F" stopOpacity="0.35" />
            <stop offset="1" stopColor="#FF5A1F" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="ecl-streak" x1="0" x2="1" y1="0" y2="0">
            <stop offset="0" stopColor="#FF5A1F" stopOpacity="0" />
            <stop offset="0.5" stopColor="#FFE2CC" stopOpacity="0.95" />
            <stop offset="1" stopColor="#FF5A1F" stopOpacity="0" />
          </linearGradient>
          <filter id="ecl-blur-s" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="7" />
          </filter>
          <filter id="ecl-blur-l" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="42" />
          </filter>
        </defs>

        {/* eclipse body */}
        <circle cx="1250" cy="980" r="620" fill="#0E0302" />

        {/* rim light: wide glow → tight glow → hairline */}
        <path d={ARC} fill="none" stroke="url(#ecl-rim)" strokeWidth="54" filter="url(#ecl-blur-l)" opacity="0.6" />
        <path d={ARC} fill="none" stroke="url(#ecl-rim)" strokeWidth="14" filter="url(#ecl-blur-s)" opacity="0.85" />
        <path d={ARC} fill="none" stroke="url(#ecl-rim)" strokeWidth="3" strokeLinecap="round" />

        {/* echo arcs (the swirl lines in the brand book) */}
        <circle cx="1250" cy="980" r="668" fill="none" stroke="#FF5A1F" strokeOpacity="0.22" strokeWidth="1.2" />
        <circle cx="1250" cy="980" r="735" fill="none" stroke="#FF5A1F" strokeOpacity="0.1" strokeWidth="1" />
        <circle cx="1250" cy="980" r="810" fill="none" stroke="#F6F0E8" strokeOpacity="0.05" strokeWidth="1" />

        {/* lens flare */}
        <g transform="translate(894 472)">
          <g className="eclipse-flare">
            <circle r="110" fill="url(#ecl-flare)" />
            <rect x="-260" y="-1" width="520" height="2" fill="url(#ecl-streak)" />
            <rect x="-1" y="-170" width="2" height="340" fill="url(#ecl-streak)" opacity="0.6" />
          </g>
        </g>
      </svg>

      {/* keep type legible: darken the left where copy sits */}
      <div className="absolute inset-0 bg-gradient-to-r from-brand-black/75 via-brand-black/25 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-brand-black to-transparent" />
    </div>
  )
}
