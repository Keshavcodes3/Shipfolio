import { useRef } from 'react'
import Logo from '../../../components/Logo'
import { motion, useInView } from 'framer-motion'

const ease = [0.22, 1, 0.36, 1] as const

const equationParts = [
  { label: 'PROJECTS', delay: 0.3 },
  { label: '+', delay: 0.5, isOperator: true },
  { label: 'ACTIVITY', delay: 0.7 },
  { label: '+', delay: 0.9, isOperator: true },
  { label: 'TIMELINE', delay: 1.1 },
  { label: '+', delay: 1.3, isOperator: true },
  { label: 'IDENTITY', delay: 1.5 },
]

export default function IdentitySection() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-15%' })

  return (
    <section className="relative py-40 md:py-56 overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-px bg-white/[0.06]" />

      <div ref={ref} className="relative z-10 mx-auto max-w-[1400px] px-6 md:px-10">
        {/* Headline */}
        <div className="max-w-4xl mb-20 md:mb-32">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease }}
            className="text-[clamp(2rem,5vw,3.5rem)] font-bold text-white tracking-tight leading-[1.1] mb-6"
          >
            Your work changes.
            <br />
            <motion.span
              initial={{ color: 'rgba(245,247,242,0.2)' }}
              animate={isInView ? { color: '#ffffff' } : {}}
              transition={{ duration: 1, delay: 0.4 }}
            >
              Your identity shouldn&apos;t
              <br />
              disappear with it.
            </motion.span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.6, ease }}
            className="text-[clamp(1rem,1.8vw,1.2rem)] text-neutral-500 leading-relaxed"
          >
            Shipfolio gives everything you build a home.
          </motion.p>
        </div>

        {/* Equation */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="flex flex-wrap items-center justify-center gap-4 md:gap-6 mb-16 md:mb-24"
        >
          {equationParts.map((part) => (
            <motion.span
              key={part.label}
              initial={{ opacity: 0, y: 15 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: part.delay, ease }}
              className={`text-[clamp(1rem,2.5vw,1.8rem)] font-bold tracking-tight ${
                part.isOperator ? 'text-neutral-600' : 'text-white'
              }`}
            >
              {part.label}
            </motion.span>
          ))}

          <motion.span
            initial={{ opacity: 0, scale: 0.8 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.5, delay: 1.7, ease }}
            className="text-[clamp(1rem,2.5vw,1.8rem)] font-bold text-neutral-600"
          >
            =
          </motion.span>

          <motion.span
            initial={{ opacity: 0, y: 15 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 1.9, ease }}
            className="text-[clamp(1.2rem,3vw,2.2rem)] font-bold text-white tracking-[0.15em]"
          >
            <Logo size="sm" animate={false} />
          </motion.span>
        </motion.div>
      </div>
    </section>
  )
}
