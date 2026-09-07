import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

const ease = [0.22, 1, 0.36, 1] as const

const events = [
  { action: 'SHIPPED', detail: 'v1.0', project: 'Letterly' },
  { action: 'BUILT', detail: 'GitHub integration', project: 'Shipboard' },
  { action: 'STARTED', detail: 'new project', project: 'Letterly' },
  { action: 'UPDATED', detail: 'project description', project: 'FounderHQ' },
  { action: 'RELEASED', detail: 'v0.9.0', project: 'Perplexity++' },
  { action: 'SHIPPED', detail: 'public launch', project: 'FounderHQ' },
]

export default function ActivitySection() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-10%' })

  return (
    <section className="relative py-32 md:py-44">
      <div className="absolute top-0 left-0 right-0 h-px bg-white/[0.06]" />

      <div ref={ref} className="mx-auto max-w-[1400px] px-6 md:px-10">
        <div className="grid lg:grid-cols-[1fr_1.2fr] gap-16 lg:gap-24 items-start">
          {/* Left: heading */}
          <div className="lg:sticky lg:top-32">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, ease }}
            >
              <p className="text-[11px] tracking-[0.25em] uppercase text-neutral-600 font-mono mb-4">
                Proof of work
              </p>
              <h2 className="text-[clamp(2.2rem,5vw,3.8rem)] font-bold text-white tracking-tight leading-[1.05] mb-6">
                Show the work.
                <br />
                <span className="text-neutral-500">Not just the words.</span>
              </h2>
              <p className="text-sm text-neutral-500 leading-relaxed max-w-sm">
                Every ship, every release, every milestone.
                A living feed of the things you actually do.
              </p>
            </motion.div>
          </div>

          {/* Right: timeline */}
          <div className="relative">
            {/* Vertical line */}
            <motion.div
              className="absolute left-[7px] top-0 bottom-0 w-px"
              style={{ background: 'linear-gradient(to bottom, rgba(245,247,242,0.08), rgba(245,247,242,0.02))', transformOrigin: 'top' }}
              initial={{ scaleY: 0 }}
              animate={isInView ? { scaleY: 1 } : {}}
              transition={{ duration: 1.5, delay: 0.3, ease }}
            />

            <div className="space-y-0">
              {events.map((event, i) => (
                <motion.div
                  key={`${event.action}-${event.detail}-${i}`}
                  initial={{ opacity: 0, x: -15 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.5 + i * 0.12, ease }}
                  className="relative flex gap-6 py-6 group"
                >
                  {/* Dot */}
                  <div className="relative z-10 mt-1.5 shrink-0">
                    <motion.div
                      className="w-[14px] h-[14px] rounded-full border-2 border-black bg-white/[0.12]"
                      whileHover={{ scale: 1.3, backgroundColor: 'rgba(245,247,242,0.25)' }}
                      transition={{ duration: 0.2 }}
                    />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0 border border-white/[0.04] rounded-lg p-5 group-hover:border-white/[0.08] transition-colors duration-200">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <span className="text-[11px] font-mono font-bold tracking-wider text-white">
                          {event.action}
                        </span>
                        <span className="text-[11px] font-mono text-neutral-500">
                          {event.detail}
                        </span>
                      </div>
                      <span className="text-[10px] font-mono text-neutral-600">
                        {event.project}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
