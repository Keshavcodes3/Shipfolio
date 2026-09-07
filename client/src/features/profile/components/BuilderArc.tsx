import { motion } from 'framer-motion'
import type { ArcEntry } from '../data/profileData'

const ease = [0.22, 1, 0.36, 1] as const

export default function BuilderArc({ arc }: { arc: ArcEntry[] }) {
  if (!arc || arc.length === 0) return null

  return (
    <section className="py-20 md:py-28 border-t border-white/[0.06]">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.7, ease }}
      >
        <div className="flex items-center gap-3 mb-14">
          <span className="text-[10px] uppercase tracking-[0.3em] text-[#B6F34A] font-mono font-medium">
            THE ARC
          </span>
          <div className="flex-1 h-[1px] bg-white/[0.04]" />
        </div>

        {/* Desktop: horizontal */}
        <div className="hidden md:flex items-start gap-0">
          {arc.map((entry, i) => (
            <motion.div
              key={entry.year}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.12, duration: 0.5, ease }}
              className="flex-1 relative"
            >
              {/* Content */}
              <div className="pr-8">
                <p className={`text-[13px] font-mono font-bold ${entry.year === 'NOW' ? 'text-[#B6F34A]' : 'text-[#555B55]'}`}>
                  {entry.year}
                </p>
                <p className="text-[15px] text-[#F5F7F2] mt-2 leading-relaxed">
                  {entry.label}
                </p>
              </div>

              {/* Connector line */}
              {i < arc.length - 1 && (
                <div className="absolute top-[10px] right-0 w-full flex items-center pointer-events-none">
                  <div className="w-full h-[1px] bg-white/[0.06]" />
                  <motion.div
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 + i * 0.12, duration: 0.6, ease }}
                    className="absolute left-0 top-0 h-[1px] bg-[#B6F34A]/30 origin-left"
                    style={{ width: '100%' }}
                  />
                </div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Mobile: vertical */}
        <div className="md:hidden space-y-0">
          {arc.map((entry, i) => (
            <motion.div
              key={entry.year}
              initial={{ opacity: 0, x: -12 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.5, ease }}
              className="flex items-start gap-4 py-4 relative"
            >
              {/* Dot */}
              <div className="relative flex flex-col items-center shrink-0">
                <div className={`w-2.5 h-2.5 rounded-full ${entry.year === 'NOW' ? 'bg-[#B6F34A]' : 'bg-[#303530]'}`} />
              </div>

              <div>
                <p className={`text-[11px] font-mono font-bold ${entry.year === 'NOW' ? 'text-[#B6F34A]' : 'text-[#555B55]'}`}>
                  {entry.year}
                </p>
                <p className="text-[14px] text-[#8A8F89] mt-1">
                  {entry.label}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  )
}
