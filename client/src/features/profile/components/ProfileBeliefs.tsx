import { motion } from 'framer-motion'
import type { Belief } from '../data/profileData'

const ease = [0.22, 1, 0.36, 1] as const

export default function ProfileBeliefs({ beliefs }: { beliefs: Belief[] }) {
  if (!beliefs || beliefs.length === 0) return null

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
            THINGS I BELIEVE
          </span>
          <div className="flex-1 h-[1px] bg-white/[0.04]" />
        </div>

        <div className="space-y-12">
          {beliefs.map((belief, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.6, ease }}
              className="relative"
            >
              <span className="text-[clamp(3rem,6vw,5rem)] font-black text-white/[0.03] absolute -top-6 -left-2 select-none pointer-events-none">
                {String(i + 1).padStart(2, '0')}
              </span>
              <p className="text-[clamp(1rem,2vw,1.25rem)] text-[#8A8F89] leading-relaxed max-w-[560px] relative pl-4 border-l border-white/[0.06]">
                {belief.body}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  )
}
