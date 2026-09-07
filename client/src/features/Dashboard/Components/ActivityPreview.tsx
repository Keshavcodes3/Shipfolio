import { motion } from 'framer-motion'
import { activityEvents } from '../data/dashboardData'
import ActivityItem from './ActivityItem'

const ease = [0.22, 1, 0.36, 1] as const

export default function ActivityPreview() {
  return (
    <section className="px-6 pb-12 md:px-8">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.9, ease }}
      >
        <h2 className="text-[11px] uppercase tracking-[0.25em] text-[#555B55] font-mono mb-5">
          Recent activity
        </h2>

        <div className="relative border border-white/[0.06] bg-white/[0.015] p-5">
          {/* Vertical timeline line */}
          <div className="absolute left-[29px] top-5 bottom-5 w-px bg-white/[0.06]" />

          <div className="space-y-0">
            {activityEvents.map((event, i) => (
              <ActivityItem
                key={event.id}
                event={event}
                index={i}
                isLast={i === activityEvents.length - 1}
              />
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  )
}
