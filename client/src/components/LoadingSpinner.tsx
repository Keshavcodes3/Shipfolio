import { motion } from 'framer-motion'

interface LoadingSpinnerProps {
  size?: number
  className?: string
}

const ease = [0.22, 1, 0.36, 1] as const

export default function LoadingSpinner({ size = 14, className = '' }: LoadingSpinnerProps) {
  const half = size / 2
  const lineLen = size * 2

  return (
    <span
      className={`relative inline-flex items-center justify-center ${className}`}
      style={{ width: size, height: size }}
      role="status"
    >
      {/* Slash line */}
      <motion.span
        className="absolute block pointer-events-none"
        style={{
          width: lineLen,
          height: 1.5,
          background: 'linear-gradient(90deg, transparent, #B6F34A, transparent)',
          boxShadow: '0 0 6px #B6F34A, 0 0 14px rgba(182,243,74,0.3)',
          left: half - lineLen / 2,
          top: half - 0.75,
          transform: 'rotate(-35deg)',
          transformOrigin: 'center',
        }}
        animate={{
          x: ['-110%', '0%', '110%'],
          opacity: [0, 1, 0],
        }}
        transition={{
          duration: 0.9,
          ease,
          repeat: Infinity,
          repeatDelay: 0.3,
        }}
      />
      {/* Second slash (thinner, delayed) */}
      <motion.span
        className="absolute block pointer-events-none"
        style={{
          width: lineLen * 0.7,
          height: 1,
          background: 'linear-gradient(90deg, transparent, rgba(182,243,74,0.5), transparent)',
          left: half - (lineLen * 0.7) / 2,
          top: half - 0.5 + 2,
          transform: 'rotate(-35deg)',
          transformOrigin: 'center',
        }}
        animate={{
          x: ['-110%', '0%', '110%'],
          opacity: [0, 0.7, 0],
        }}
        transition={{
          duration: 0.9,
          ease,
          repeat: Infinity,
          repeatDelay: 0.3,
          delay: 0.1,
        }}
      />
      {/* Center dot pulse */}
      <motion.span
        className="absolute rounded-full"
        style={{
          width: 2.5,
          height: 2.5,
          background: '#B6F34A',
          left: half - 1.25,
          top: half - 1.25,
        }}
        animate={{
          scale: [0.8, 1.4, 0.8],
          opacity: [0.4, 1, 0.4],
        }}
        transition={{
          duration: 1.0,
          ease,
          repeat: Infinity,
        }}
      />
    </span>
  )
}
