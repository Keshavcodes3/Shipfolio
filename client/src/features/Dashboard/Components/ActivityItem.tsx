import { motion } from 'framer-motion'
import type { ActivityEvent } from '../data/dashboardData'

const ease = [0.22, 1, 0.36, 1] as const

interface ActivityItemProps {
  event: ActivityEvent
  index: number
  isLast: boolean
}

export default function ActivityItem({ event, index, isLast }: ActivityItemProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: 0.8 + index * 0.06, ease }}
      className="relative flex gap-4 group"
    >
      {/* Timeline dot */}
      <div className="relative z-10 mt-1.5 shrink-0">
        <div
          className={`h-2 w-2 rounded-full ${
            event.important ? 'bg-[#B6F34A]' : 'bg-white/[0.12]'
          } group-hover:bg-white/20 transition-colors duration-200`}
        />
      </div>

      {/* Content */}
      <div className={`flex-1 min-w-0 ${!isLast ? 'pb-5' : ''}`}>
        <div className="flex items-baseline gap-2 mb-0.5">
          <span className="text-[12px] font-medium text-[#F5F7F2]">
            {event.action}
          </span>
          <span className="text-[12px] text-[#8A8F89]">
            {event.project}
          </span>
        </div>
        <p className="text-[12px] text-[#555B55]">{event.detail}</p>
        <span className="text-[10px] text-[#303530] font-mono mt-1 block">{event.time}</span>
      </div>
    </motion.div>
  )
}
