import { motion } from 'framer-motion'
import type { ProjectActivity } from '../data/projectDetailData'

const ease = [0.22, 1, 0.36, 1] as const

const typeIcons: Record<string, string> = {
  update: '○',
  shipped: '◆',
  started: '●',
  milestone: '▲',
}

const typeColors: Record<string, string> = {
  shipped: '#B6F34A',
  started: '#B6F34A',
}

interface ProjectActivityProps {
  activity: ProjectActivity[]
}

export default function ProjectActivitySection({ activity }: ProjectActivityProps) {
  return (
    <section className="py-16 md:py-20 border-b border-white/[0.06]">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease }}
      >
        <span className="text-[10px] uppercase tracking-[0.25em] text-[#B6F34A] font-mono">ACTIVITY</span>
        <div className="mt-8 space-y-0">
          {activity.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06, duration: 0.4, ease }}
              className="flex items-start gap-4 py-4 border-b border-white/[0.04] last:border-0"
            >
              <span
                className="text-[10px] shrink-0 mt-1 w-4 text-center"
                style={{ color: typeColors[item.type] || '#555B55' }}
              >
                {typeIcons[item.type] || '·'}
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-[14px] text-[#8A8F89]">{item.text}</p>
              </div>
              <span className="text-[11px] text-[#303530] font-mono shrink-0 mt-0.5">
                {item.timestamp}
              </span>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  )
}
