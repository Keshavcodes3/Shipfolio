import { useRef, useMemo } from 'react'
import { motion, useInView } from 'framer-motion'

const techStack = ['React', 'TypeScript', 'WebSockets', 'PostgreSQL']

export default function CurrentlyBuildingSection() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-15%' })

  const barHeights = useMemo(
    () => Array.from({ length: 20 }, (_, i) => 4 + ((i * 7 + 13) % 24)),
    [],
  )

  return (
    <section className="relative py-32 md:py-48 overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-px bg-white/[0.06]" />

      {/* Subtle grid accent */}
      <div className="absolute right-0 top-0 bottom-0 w-1/2 opacity-[0.02] pointer-events-none hidden lg:block">
        <div
          className="h-full"
          style={{
            backgroundImage:
              'linear-gradient(rgba(245,247,242,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(245,247,242,0.5) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />
      </div>

      <div ref={ref} className="mx-auto max-w-[1400px] px-6 md:px-10">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          {/* Left side - text */}
          <div>
            <motion.p
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ duration: 0.6 }}
              className="text-[11px] tracking-[0.25em] uppercase text-neutral-600 font-mono mb-6"
            >
              Currently building
            </motion.p>

            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] as const }}
              className="text-[clamp(2.5rem,6vw,4.5rem)] font-bold text-white leading-[1.05] tracking-tight mb-12"
            >
              WHAT ARE
              <br />
              YOU BUILDING?
            </motion.h2>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="flex flex-wrap gap-2"
            >
              {techStack.map((tech, i) => (
                <motion.span
                  key={tech}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={isInView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ duration: 0.4, delay: 0.5 + i * 0.08 }}
                  className="px-3 py-1.5 text-[12px] font-mono text-neutral-400 border border-white/[0.08] rounded-md"
                >
                  {tech}
                </motion.span>
              ))}
            </motion.div>
          </div>

          {/* Right side - profile card */}
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.97 }}
            animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
            transition={{ duration: 0.9, delay: 0.3, ease: [0.22, 1, 0.36, 1] as const }}
            className="relative"
          >
            <div className="border border-white/[0.08] rounded-2xl p-8 md:p-10 bg-white/[0.01]">
              {/* Profile header */}
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 rounded-full bg-white/[0.06] border border-white/[0.08] flex items-center justify-center text-white font-semibold text-sm">
                  K
                </div>
                <div>
                  <p className="text-white font-medium">Keshav</p>
                  <p className="text-[12px] text-neutral-500 font-mono">@keshav</p>
                </div>
              </div>

              {/* Currently building */}
              <div className="mb-6">
                <p className="text-[11px] tracking-[0.2em] uppercase text-neutral-600 font-mono mb-3">
                  Currently building
                </p>
                <p className="text-2xl font-semibold text-white tracking-tight">
                  Letterly
                </p>
              </div>

              {/* Status */}
              <div className="flex items-center gap-2 mb-6">
                <motion.div
                  className="w-2 h-2 rounded-full bg-[#B6F34A]"
                  animate={{ opacity: [1, 0.4, 1] }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                />
                <span className="text-[11px] font-mono text-[#B6F34A] tracking-wider">
                  BUILDING
                </span>
              </div>

              {/* Description */}
              <p className="text-sm text-neutral-400 leading-relaxed mb-8">
                An asynchronous letter platform
                <br />
                for people who want slower conversations.
              </p>

              {/* Activity bars */}
              <div className="flex gap-1 items-end h-8">
                {barHeights.map((height, i) => (
                  <motion.div
                    key={i}
                    className="w-1.5 bg-white/[0.06] rounded-full"
                    initial={{ height: 4 }}
                    animate={isInView ? { height } : {}}
                    transition={{ duration: 0.6, delay: 0.8 + i * 0.03 }}
                  />
                ))}
              </div>
            </div>

            {/* Glow */}
            <div className="absolute -inset-px rounded-2xl bg-gradient-to-b from-white/[0.03] to-transparent pointer-events-none" />
          </motion.div>
        </div>
      </div>
    </section>
  )
}
