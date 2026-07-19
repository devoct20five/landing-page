'use client'

import { useRef } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'
import Link from 'next/link'

export default function MagneticButton({ children, className = '', variant = 'primary', href, onClick, type, ariaLabel, strength = 22 }) {
  const ref = useRef(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const sx = useSpring(x, { stiffness: 200, damping: 15, mass: 0.5 })
  const sy = useSpring(y, { stiffness: 200, damping: 15, mass: 0.5 })

  const onMouseMove = (e) => {
    if (!ref.current) return
    const rect = ref.current.getBoundingClientRect()
    const relX = (e.clientX - (rect.left + rect.width / 2)) / (rect.width / 2)
    const relY = (e.clientY - (rect.top + rect.height / 2)) / (rect.height / 2)
    x.set(relX * strength)
    y.set(relY * strength)
  }
  const onMouseLeave = () => { x.set(0); y.set(0) }

  const cls = `btn btn-${variant} ${className}`

  const inner = (
    <motion.span ref={ref} onMouseMove={onMouseMove} onMouseLeave={onMouseLeave} style={{ x: sx, y: sy, display: 'inline-flex' }} className={cls}>
      {children}
    </motion.span>
  )

  if (href) {
    const isExternal = /^https?:\/\//.test(href)
    if (isExternal) return <a href={href} aria-label={ariaLabel} target="_blank" rel="noreferrer" className="inline-flex">{inner}</a>
    return <Link href={href} aria-label={ariaLabel} className="inline-flex">{inner}</Link>
  }
  return (
    <button type={type || 'button'} onClick={onClick} aria-label={ariaLabel} className="inline-flex">
      {inner}
    </button>
  )
}
