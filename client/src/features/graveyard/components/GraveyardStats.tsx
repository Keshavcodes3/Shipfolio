import { motion } from 'framer-motion'
import { graveyardStats } from '../data/graveyardData'

const ease = [0.22, 1, 0.36, 1] as const

const stats = [
  { value: graveyardStats.projectsArchived, label: 'PROJECTS ARCHIVED', suffix: '' },
  { value: graveyardStats.builders, label: 'BUILDERS', suffix: '' },
  { value: graveyardStats.lessonsShared, label: 'LESSONS SHARED', suffix: '' },
]

export default function GraveyardStats() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.6, duration: 0.5, ease }}
      className="py-8 border-t border-b border-white/[0.06]"
    >
      <div className="flex items-stretch gap-0">
        {stats.map((stat, i) => (
          <div
            key={stat.label}
            className={`flex-1 flex flex-col items-center text-center px-6 py-2 ${
              i < stats.length - 1 ? 'border-r border-white/[0.04]' : ''
            }`}
          >
            <span className="text-[clamp(1.8rem,4vw,2.8rem)] font-black tracking-[-0.05em] text-[#F5F7F2] leading-none">
              {stat.value}{stat.suffix}
            </span>
            <span className="text-[9px] font-mono uppercase tracking-[0.25em] text-[#303530] mt-2">
              {stat.label}
            </span>
          </div>
        ))}
      </div>
    </motion.div>
  )
}
