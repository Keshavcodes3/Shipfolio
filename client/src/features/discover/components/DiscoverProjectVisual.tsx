import { motion } from 'framer-motion'
import type { ProjectVisual as VisualType } from '../data/discoverData'

const ease = [0.22, 1, 0.36, 1] as const

interface DiscoverProjectVisualProps {
  type: VisualType
  isHovered?: boolean
}

export default function DiscoverProjectVisual({ type, isHovered = false }: DiscoverProjectVisualProps) {
  if (type === 'wave') {
    return (
      <div className="absolute inset-0 flex items-center justify-center overflow-hidden" aria-hidden="true">
        <svg viewBox="0 0 200 120" className="w-full h-full opacity-40">
          <motion.path
            d="M0 60 Q25 30 50 60 Q75 90 100 60 Q125 30 150 60 Q175 90 200 60"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            className="text-white/[0.06]"
            animate={isHovered ? { d: 'M0 60 Q25 40 50 60 Q75 80 100 60 Q125 40 150 60 Q175 80 200 60', stroke: 'rgba(182,243,74,0.15)' } : {}}
            transition={{ duration: 0.6, ease }}
          />
          <motion.path
            d="M0 70 Q25 45 50 70 Q75 95 100 70 Q125 45 150 70 Q175 95 200 70"
            fill="none"
            stroke="currentColor"
            strokeWidth="0.5"
            className="text-white/[0.04]"
            animate={isHovered ? { d: 'M0 70 Q25 50 50 70 Q75 90 100 70 Q125 50 150 70 Q175 90 200 70' } : {}}
            transition={{ duration: 0.8, ease }}
          />
          {[30, 70, 110, 150].map((cx) => (
            <motion.circle
              key={cx}
              cx={cx}
              cy="60"
              r="2"
              fill="currentColor"
              className="text-white/[0.08]"
              animate={isHovered ? { r: 3, fill: 'rgba(182,243,74,0.3)' } : { r: 2 }}
              transition={{ duration: 0.4 }}
            />
          ))}
        </svg>
      </div>
    )
  }

  if (type === 'orb') {
    return (
      <div className="absolute inset-0 flex items-center justify-center" aria-hidden="true">
        <svg viewBox="0 0 120 120" className="w-full h-full max-w-[80px] max-h-[80px]">
          <motion.circle cx="60" cy="60" r="45" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-white/[0.06]"
            animate={isHovered ? { r: 48, stroke: 'rgba(245,247,242,0.12)' } : { r: 45 }} transition={{ duration: 0.5, ease }} />
          <motion.circle cx="60" cy="60" r="28" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-white/[0.04]"
            animate={isHovered ? { r: 30, stroke: 'rgba(182,243,74,0.1)' } : { r: 28 }} transition={{ duration: 0.5, ease }} />
          <motion.circle cx="60" cy="60" r="8" fill="currentColor" className="text-white/[0.06]"
            animate={isHovered ? { r: 10, fill: 'rgba(182,243,74,0.2)' } : { r: 8 }} transition={{ duration: 0.4 }} />
          <motion.circle cx="60" cy="15" r="2.5" fill="currentColor" className="text-white/[0.1]"
            animate={isHovered ? { fill: 'rgba(182,243,74,0.4)' } : {}} transition={{ duration: 0.4 }} />
        </svg>
      </div>
    )
  }

  if (type === 'bars') {
    const bars = [16, 28, 12, 34, 20, 26, 14, 30, 18, 10, 24, 12]
    return (
      <div className="absolute inset-0 flex items-end justify-center pb-6 gap-[3px]" aria-hidden="true">
        {bars.map((h, i) => (
          <motion.div
            key={i}
            className="w-[3px] rounded-full bg-white/[0.06]"
            animate={isHovered ? { height: h, backgroundColor: 'rgba(182,243,74,0.15)' } : { height: h * 0.5, backgroundColor: 'rgba(245,247,242,0.06)' }}
            transition={{ duration: 0.4, delay: i * 0.02, ease }}
          />
        ))}
      </div>
    )
  }

  if (type === 'pulse') {
    return (
      <div className="absolute inset-0 flex items-center justify-center" aria-hidden="true">
        <div className="relative w-16 h-16">
          <motion.div className="absolute inset-0 rounded-full border border-white/[0.06]"
            animate={isHovered ? { scale: [1, 1.15, 1] } : {}} transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }} />
          <motion.div className="absolute inset-2 rounded-full border border-white/[0.04]"
            animate={isHovered ? { scale: [1, 1.2, 1] } : {}} transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }} />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-2 h-2 rounded-full bg-[#B6F34A]/20" />
          </div>
        </div>
      </div>
    )
  }

  // grid
  return (
    <div className="absolute inset-0 flex items-center justify-center" aria-hidden="true">
      <div className="grid grid-cols-3 gap-1">
        {Array.from({ length: 9 }).map((_, i) => (
          <motion.div
            key={i}
            className="w-2.5 h-2.5 bg-white/[0.04]"
            animate={isHovered ? { backgroundColor: i % 3 === 0 ? 'rgba(182,243,74,0.12)' : 'rgba(245,247,242,0.06)' } : { backgroundColor: 'rgba(245,247,242,0.04)' }}
            transition={{ duration: 0.3, delay: i * 0.02 }}
          />
        ))}
      </div>
    </div>
  )
}
