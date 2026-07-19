'use client'

import { motion } from 'framer-motion'

const variants = {
  hidden: (custom = {}) => ({
    opacity: 0,
    y: custom.y ?? 40,
    filter: custom.blur ? 'blur(14px)' : 'blur(0px)',
  }),
  visible: (custom = {}) => ({
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: {
      duration: custom.duration ?? 0.9,
      delay: custom.delay ?? 0,
      ease: [0.22, 1, 0.36, 1],
    },
  }),
}

export default function Reveal({ children, delay = 0, y = 40, blur = false, once = true, className = '', as = 'div', duration = 0.9 }) {
  const MotionTag = motion[as] || motion.div
  return (
    <MotionTag
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, margin: '-80px' }}
      variants={variants}
      custom={{ delay, y, blur, duration }}
    >
      {children}
    </MotionTag>
  )
}

export function Stagger({ children, className = '', delay = 0, stagger = 0.08 }) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-80px' }}
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: stagger, delayChildren: delay } },
      }}
    >
      {children}
    </motion.div>
  )
}

export function StaggerItem({ children, className = '', y = 30 }) {
  return (
    <motion.div
      className={className}
      variants={{
        hidden: { opacity: 0, y },
        visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } },
      }}
    >
      {children}
    </motion.div>
  )
}
