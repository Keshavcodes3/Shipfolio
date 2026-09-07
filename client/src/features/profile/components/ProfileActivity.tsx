import { motion } from 'framer-motion'
import type { ActivityEntry } from '../data/profileData'
import ActivityItem from './ActivityItem'

const ease = [0.22, 1, 0.36, 1] as const

export default function ProfileActivity({ activity }: { activity: ActivityEntry[] }) {
  if (!activity || activity.length === 0) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-30px' }}
      transition={{ duration: 0.5, ease }}
      className="border border-white/[0.06] p-6 h-full"
    >
      <div className="flex items-center gap-2 mb-4">
        <span className="text-[10px] uppercase tracking-[0.2em] text-[#B6F34A] font-mono">
          RECENTLY
        </span>
        <motion.span animate={{ opacity: [0.3, 0.8, 0.3] }} transition={{ duration: 2, repeat: Infinity }}
          className="w-1.5 h-1.5 rounded-full bg-[#B6F34A]" />
      </div>

      <div className="space-y-0">
        {activity.slice(0, 5).map((item, i) => (
          <ActivityItem key={i} item={item} index={i} />
        ))}
      </div>
    </motion.div>
  )
}
