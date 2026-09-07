import { motion } from 'framer-motion'

interface LogoProps {
  size?: 'sm' | 'md' | 'lg'
  animate?: boolean
  className?: string
}

export default function Logo({ size = 'md', animate = true, className = '' }: LogoProps) {
  const dims = {
    sm: { width: 28, height: 28, fontSize: 9, dot: 2, gap: 6 },
    md: { width: 36, height: 36, fontSize: 11, dot: 3, gap: 8 },
    lg: { width: 48, height: 48, fontSize: 14, dot: 4, gap: 10 },
  }[size]

  return (
    <div className={`flex items-center ${className}`} style={{ gap: dims.gap }}>
      {/* Animated icon */}
      <svg
        width={dims.width}
        height={dims.height}
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Outer ring — slow pulse */}
        <motion.circle
          cx="24"
          cy="24"
          r="22"
          stroke="#B6F34A"
          strokeWidth="1"
          strokeOpacity="0.15"
          fill="none"
          animate={animate ? { r: [22, 23, 22], strokeOpacity: [0.15, 0.3, 0.15] } : {}}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        />

        {/* Middle ring — counter-rotate */}
        <motion.circle
          cx="24"
          cy="24"
          r="16"
          stroke="#B6F34A"
          strokeWidth="0.8"
          strokeOpacity="0.1"
          fill="none"
          strokeDasharray="4 6"
          animate={animate ? { rotate: 360 } : {}}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          style={{ transformOrigin: '24px 24px' }}
        />

        {/* Inner ship / arrow shape */}
        <motion.g
          animate={animate ? { y: [0, -1.5, 0] } : {}}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        >
          {/* Arrow pointing up-right — represents "shipping" */}
          <motion.path
            d="M16 32L24 14L32 32"
            stroke="#B6F34A"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={animate
              ? { pathLength: 1, opacity: 1 }
              : { pathLength: 1, opacity: 1 }}
            transition={{ duration: 1.2, ease: 'easeOut', delay: 0.3 }}
          />

          {/* Horizontal line — the "deck" */}
          <motion.line
            x1="18"
            y1="28"
            x2="30"
            y2="28"
            stroke="#B6F34A"
            strokeWidth="1.5"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={animate ? { pathLength: 1 } : { pathLength: 1 }}
            transition={{ duration: 0.8, ease: 'easeOut', delay: 0.8 }}
          />

          {/* Dot at the peak — the signal */}
          <motion.circle
            cx="24"
            cy="14"
            r="2"
            fill="#B6F34A"
            initial={{ scale: 0, opacity: 0 }}
            animate={animate
              ? { scale: [0, 1.3, 1], opacity: [0, 1, 1] }
              : { scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 1.2, ease: 'easeOut' }}
          />

          {/* Signal rings from peak */}
          {animate && (
            <>
              <motion.circle
                cx="24"
                cy="14"
                r="2"
                stroke="#B6F34A"
                strokeWidth="0.5"
                fill="none"
                initial={{ r: 2, opacity: 0.5 }}
                animate={{ r: [2, 8], opacity: [0.4, 0] }}
                transition={{ duration: 2, repeat: Infinity, delay: 1.5, ease: 'easeOut' }}
              />
              <motion.circle
                cx="24"
                cy="14"
                r="2"
                stroke="#B6F34A"
                strokeWidth="0.5"
                fill="none"
                initial={{ r: 2, opacity: 0.5 }}
                animate={{ r: [2, 8], opacity: [0.4, 0] }}
                transition={{ duration: 2, repeat: Infinity, delay: 2.5, ease: 'easeOut' }}
              />
            </>
          )}
        </motion.g>
      </svg>

      {/* Wordmark */}
      <span
        className="font-bold tracking-[0.25em] uppercase text-[#F5F7F2]"
        style={{ fontSize: dims.fontSize }}
      >
        SHIPFOLIO
      </span>

      {/* Animated dot */}
      <motion.span
        className="rounded-full bg-[#B6F34A]"
        style={{ width: dims.dot, height: dims.dot }}
        animate={animate ? { opacity: [1, 0.3, 1], scale: [1, 1.2, 1] } : {}}
        transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
      />
    </div>
  )
}
