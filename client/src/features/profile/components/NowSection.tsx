import { motion } from 'framer-motion'
import type { NowData } from '../data/profileData'

const ease = [0.22, 1, 0.36, 1] as const

const nowItems = (now: NowData) =>
  Object.entries(now).filter(([, v]) => v) as [string, string][]

export default function NowSection({ now }: { now: NowData }) {
  const items = nowItems(now)
  if (items.length === 0) return null

  return (
    <section className="py-20 md:py-28 border-t border-white/[0.06]">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.7, ease }}
      >
        <div className="flex items-center gap-3 mb-12">
          <span className="text-[10px] uppercase tracking-[0.3em] text-[#B6F34A] font-mono font-medium">
            NOW
          </span>
          <div className="flex-1 h-[1px] bg-white/[0.04]" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-6">
          {items.map(([key, value], i) => (
            <motion.div
              key={key}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06, duration: 0.5, ease }}
              className="flex items-baseline gap-4"
            >
              <span className="text-[11px] uppercase tracking-[0.2em] text-[#303530] font-mono shrink-0 w-20">
                {key}
              </span>
              <span className="text-[15px] text-[#8A8F89]">
                {value}
              </span>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  )
}
