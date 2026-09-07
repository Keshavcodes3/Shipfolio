import { motion } from 'framer-motion'

const ease = [0.22, 1, 0.36, 1] as const

function Particles() {
  const count = 12
  return (
    <>
      {Array.from({ length: count }).map((_, i) => {
        const angle = (i / count) * 360
        const dist = 40 + Math.random() * 60
        const dx = Math.cos((angle * Math.PI) / 180) * dist
        const dy = Math.sin((angle * Math.PI) / 180) * dist
        const size = 1.5 + Math.random() * 2.5
        return (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              width: size,
              height: size,
              background: '#B6F34A',
              left: '50%',
              top: '50%',
              marginLeft: -size / 2,
              marginTop: -size / 2,
            }}
            animate={{
              x: [0, dx * 0.3, dx],
              y: [0, dy * 0.3, dy],
              opacity: [0, 0.9, 0],
              scale: [0, 1.2, 0],
            }}
            transition={{
              duration: 1.0,
              ease,
              delay: 0.45 + i * 0.03,
              repeat: Infinity,
              repeatDelay: 1.2,
            }}
          />
        )
      })}
    </>
  )
}

function EnergyRings() {
  return (
    <>
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="absolute rounded-full border"
          style={{
            borderColor: 'rgba(182, 243, 74, 0.12)',
            width: 60 + i * 30,
            height: 60 + i * 30,
            left: '50%',
            top: '50%',
            marginLeft: -(60 + i * 30) / 2,
            marginTop: -(60 + i * 30) / 2,
          }}
          animate={{
            scale: [0.8, 1.1, 0.8],
            opacity: [0, 0.5, 0],
          }}
          transition={{
            duration: 1.6,
            ease,
            delay: 0.3 + i * 0.15,
            repeat: Infinity,
            repeatDelay: 0.4,
          }}
        />
      ))}
    </>
  )
}

const slashBase: React.CSSProperties = {
  position: 'absolute',
  pointerEvents: 'none',
  left: '50%',
  top: '50%',
  transform: 'rotate(-35deg)',
  transformOrigin: 'center',
}

export default function LoadingScreen() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#080A08] overflow-hidden">
      {/* Main slash line */}
      <motion.div
        style={{
          ...slashBase,
          width: '200%',
          height: 2,
          marginTop: -1,
          background: 'linear-gradient(90deg, transparent 0%, #B6F34A 30%, #B6F34A 70%, transparent 100%)',
          boxShadow: '0 0 12px #B6F34A, 0 0 30px rgba(182, 243, 74, 0.4), 0 0 60px rgba(182, 243, 74, 0.15)',
        }}
        animate={{
          x: ['-120%', '0%', '120%'],
          y: ['120%', '0%', '-120%'],
          opacity: [0, 1, 1, 0],
        }}
        transition={{
          duration: 1.4,
          ease,
          times: [0, 0.4, 0.7, 1],
          repeat: Infinity,
          repeatDelay: 0.6,
        }}
      />

      {/* Glow trail */}
      <motion.div
        style={{
          ...slashBase,
          width: '200%',
          height: 6,
          marginTop: -3,
          background: 'linear-gradient(90deg, transparent 0%, rgba(182, 243, 74, 0.25) 30%, rgba(182, 243, 74, 0.25) 70%, transparent 100%)',
          filter: 'blur(6px)',
        }}
        animate={{
          x: ['-120%', '0%', '120%'],
          y: ['120%', '0%', '-120%'],
          opacity: [0, 0.6, 0.6, 0],
        }}
        transition={{
          duration: 1.4,
          ease,
          times: [0, 0.4, 0.7, 1],
          repeat: Infinity,
          repeatDelay: 0.6,
          delay: 0.08,
        }}
      />

      {/* Second slash (thinner, offset) */}
      <motion.div
        style={{
          ...slashBase,
          width: '200%',
          height: 1,
          marginTop: -0.5,
          transform: 'rotate(-35deg) translateY(8px)',
          background: 'linear-gradient(90deg, transparent 0%, rgba(182, 243, 74, 0.4) 30%, rgba(182, 243, 74, 0.4) 70%, transparent 100%)',
        }}
        animate={{
          x: ['-120%', '0%', '120%'],
          y: ['120%', '0%', '-120%'],
          opacity: [0, 0.5, 0.5, 0],
        }}
        transition={{
          duration: 1.4,
          ease,
          times: [0, 0.4, 0.7, 1],
          repeat: Infinity,
          repeatDelay: 0.6,
          delay: 0.12,
        }}
      />

      {/* Center flash */}
      <motion.div
        className="absolute rounded-full pointer-events-none"
        style={{
          width: 120,
          height: 120,
          background: 'radial-gradient(circle, rgba(182, 243, 74, 0.35) 0%, transparent 70%)',
          left: '50%',
          top: '50%',
          marginLeft: -60,
          marginTop: -60,
        }}
        animate={{
          scale: [0, 1.5, 0],
          opacity: [0, 0.4, 0],
        }}
        transition={{
          duration: 0.8,
          ease,
          delay: 0.5,
          repeat: Infinity,
          repeatDelay: 1.2,
        }}
      />

      {/* Energy rings */}
      <EnergyRings />

      {/* Particles */}
      <Particles />

      {/* Brand text */}
      <motion.div
        className="relative z-10 text-center select-none"
        animate={{
          opacity: [0, 1, 1, 0],
          scale: [0.85, 1, 1, 0.95],
          y: [8, 0, 0, -4],
        }}
        transition={{
          duration: 2.0,
          ease,
          times: [0, 0.15, 0.75, 1],
          repeat: Infinity,
          repeatDelay: 0.6,
        }}
      >
        <h1
          className="text-[28px] font-semibold tracking-[-0.03em] leading-none"
          style={{
            color: '#F5F7F2',
            textShadow: '0 0 30px rgba(182, 243, 74, 0.2), 0 0 60px rgba(182, 243, 74, 0.08)',
          }}
        >
          Ship<span style={{ color: '#B6F34A' }}>Folio</span>
        </h1>
      </motion.div>

      {/* Subtext */}
      <motion.p
        className="absolute bottom-[22%] text-[11px] uppercase tracking-[0.2em] select-none"
        style={{ color: '#555B55' }}
        animate={{
          opacity: [0, 0.5, 0.5, 0],
        }}
        transition={{
          duration: 2.0,
          ease,
          times: [0, 0.2, 0.75, 1],
          repeat: Infinity,
          repeatDelay: 0.6,
          delay: 0.15,
        }}
      >
        Loading
      </motion.p>
    </div>
  )
}
