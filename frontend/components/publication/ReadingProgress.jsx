'use client'

import { useEffect, useRef } from 'react'

/** Thin orange bar fixed at the top; fills as the article body scrolls past. */
export default function ReadingProgress({ targetId = 'article-body' }) {
  const bar = useRef(null)
  useEffect(() => {
    const el = document.getElementById(targetId)
    if (!el) return
    let raf
    const update = () => {
      const r = el.getBoundingClientRect()
      const total = r.height - window.innerHeight * 0.6
      const done = Math.min(1, Math.max(0, (-r.top + window.innerHeight * 0.3) / Math.max(total, 1)))
      if (bar.current) bar.current.style.transform = `scaleX(${done})`
    }
    const onScroll = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [targetId])
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-x-0 top-0 z-[60] h-[3px] bg-transparent">
      <div ref={bar} className="h-full origin-left bg-brand-orange" style={{ transform: 'scaleX(0)' }} />
    </div>
  )
}
