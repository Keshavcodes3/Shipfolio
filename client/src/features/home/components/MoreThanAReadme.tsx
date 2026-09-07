import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

const ease = [0.22, 1, 0.36, 1] as const

export default function MoreThanAReadme() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-15%' })

  const line1 = 'MORE'
  const line2 = 'THAN'
  const line3 = 'A README.'

  return (
    <section className="relative py-40 md:py-56 overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-px bg-white/[0.06]" />

      {/* Large background text */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none" aria-hidden="true">
        <span className="text-[clamp(8rem,20vw,20rem)] font-bold text-white/[0.015] tracking-tighter leading-none">
          README
        </span>
      </div>

      <div ref={ref} className="relative z-10 mx-auto max-w-[1400px] px-6 md:px-10">
        <div className="max-w-5xl">
          {/* Headline - large editorial */}
          <div className="mb-16 md:mb-24">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8, ease }}
            >
              <span className="block text-[clamp(3rem,9vw,8rem)] font-bold leading-[0.9] tracking-tight text-white">
                {line1}
              </span>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.1, ease }}
            >
              <span className="block text-[clamp(3rem,9vw,8rem)] font-bold leading-[0.9] tracking-tight text-white">
                {line2}
              </span>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.2, ease }}
            >
              <motion.span
                className="block text-[clamp(3rem,9vw,8rem)] font-bold leading-[0.9] tracking-tight"
                initial={{ color: 'rgba(245,247,242,0.15)' }}
                animate={isInView ? { color: '#ffffff' } : {}}
                transition={{ duration: 1, delay: 0.6 }}
              >
                {line3}
              </motion.span>
            </motion.div>
          </div>

          {/* Supporting copy - animated sentences */}
          <div className="max-w-xl space-y-6">
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.8, ease }}
              className="text-[clamp(1rem,1.8vw,1.2rem)] text-neutral-500 leading-relaxed"
            >
              A README explains what the project is.
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 1.0, ease }}
              className="text-[clamp(1rem,1.8vw,1.2rem)] leading-relaxed"
            >
              <span className="text-neutral-500">Shipfolio shows </span>
              <motion.span
                className="text-white font-medium"
                initial={{ opacity: 0.3 }}
                animate={isInView ? { opacity: 1 } : {}}
                transition={{ duration: 0.6, delay: 1.2 }}
              >
                who built it,
              </motion.span>
              <motion.span
                className="text-white font-medium"
                initial={{ opacity: 0.3 }}
                animate={isInView ? { opacity: 1 } : {}}
                transition={{ duration: 0.6, delay: 1.4 }}
              >
                {' '}why it exists,
              </motion.span>
              <motion.span
                className="text-white font-medium"
                initial={{ opacity: 0.3 }}
                animate={isInView ? { opacity: 1 } : {}}
                transition={{ duration: 0.6, delay: 1.6 }}
              >
                {' '}where it is going,
              </motion.span>
              <motion.span
                className="text-white font-medium"
                initial={{ opacity: 0.3 }}
                animate={isInView ? { opacity: 1 } : {}}
                transition={{ duration: 0.6, delay: 1.8 }}
              >
                {' '}and what happened along the way.
              </motion.span>
            </motion.p>
          </div>
        </div>
      </div>
    </section>
  )
}
