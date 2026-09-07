import { motion } from 'framer-motion'
import type { ActivityEntry } from '../data/profileData'

const ease = [0.22, 1, 0.36, 1] as const

const typeIcons: Record<string, string> = {
  PROJECT_SHIPPED: '◆',
  PROJECT_STARTED: '●',
  PROJECT_UPDATED: '○',
  PROJECT_CREATED: '○',
  PROJECT_PAUSED: '◇',
  POST_PUBLISHED: '▲',
  TECHNOLOGY_STARTED: '△',
  PROFILE_UPDATED: '·',
}

const typeColors: Record<string, string> = {
  PROJECT_SHIPPED: '#B6F34A',
  POST_PUBLISHED: '#B6F34A',
  PROJECT_STARTED: '#8A8F89',
  TECHNOLOGY_STARTED: '#8A8F89',
}

export default function ActivityItem({ item, index }: { item: ActivityEntry; index: number }) {
  const icon = typeIcons[item.type] || '·'
  const color = typeColors[item.type] || '#555B55'

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.06, duration: 0.5, ease }}
      className="flex items-start gap-5 py-4 border-b border-white/[0.04] group cursor-default"
    >
      {/* Icon */}
      <span className="text-[10px] shrink-0 mt-1 w-4 text-center" style={{ color }}>
        {icon}
      </span>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p className="text-[14px] text-[#8A8F89] group-hover:text-[#F5F7F2] transition-colors duration-300">
          {item.title}
        </p>
      </div>

      {/* Timestamp */}
      <span className="text-[11px] text-[#303530] font-mono shrink-0 mt-0.5">
        {item.timestamp}
      </span>
    </motion.div>
  )
}
