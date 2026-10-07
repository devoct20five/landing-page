import { initials } from '@/lib/publication'

/** Initial avatar — deliberately no photos until real author portraits exist. */
export default function Avatar({ name, size = 40, className = '' }) {
  return (
    <span
      aria-hidden="true"
      style={{ width: size, height: size, fontSize: Math.max(11, size * 0.38) }}
      className={`inline-flex shrink-0 items-center justify-center rounded-full bg-brand-orange font-display font-black tracking-tight text-brand-cream ${className}`}
    >
      {initials(name)}
    </span>
  )
}
