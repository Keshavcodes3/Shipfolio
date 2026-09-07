import { motion } from 'framer-motion'
import { Link } from 'react-router'
import { MessageCircle } from 'lucide-react'
import type { ActivityEvent } from '../types/activity'
import ActivityProjectPreview from './ActivityProjectPreview'

const ease = [0.22, 1, 0.36, 1] as const

interface ActivityItemProps {
  event: ActivityEvent
  index: number
}

const typeColors: Record<string, string> = {
  PROJECT_SHIPPED: '#B6F34A',
  PROJECT_STARTED: '#B6F34A',
  FEEDBACK_REQUEST: '#B6F34A',
}

export default function ActivityItem({ event, index }: ActivityItemProps) {
  const isFeedback = event.type === 'FEEDBACK_REQUEST'

  return (
    <motion.article
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.5, ease }}
      className="relative pl-8 pb-10 last:pb-0"
    >
      {/* Timeline line */}
      <div className="absolute left-[5px] top-3 bottom-0 w-px bg-white/[0.06]" />

      {/* Timeline dot */}
      <div className="absolute left-0 top-1.5 z-10">
        <span
          className="block w-[11px] h-[11px] rounded-full border-2 border-[#080A08]"
          style={{ backgroundColor: typeColors[event.type] ?? '#555B55' }}
        />
      </div>

      {/* Header: who + what + when */}
      <div className="flex flex-col gap-1">
        <div className="flex items-baseline gap-2 flex-wrap min-w-0">
          <Link
            to={`/profile/${event.builder.username}`}
            className="text-[14px] font-bold text-[#F5F7F2] hover:text-[#B6F34A] transition-colors duration-200 shrink-0"
          >
            @{event.builder.username}
          </Link>
          <span className="text-[14px] text-[#8A8F89] min-w-0 overflow-wrap-anywhere">{event.text}</span>
        </div>
        <span className="text-[11px] text-[#303530] font-mono">
          {event.timestamp}
        </span>
      </div>

      {/* Detail text */}
      {event.detail && (
        <p className="text-[13px] text-[#555B55] mt-2 leading-relaxed">
          {event.detail}
        </p>
      )}

      {/* Feedback request label */}
      {isFeedback && (
        <div className="mt-3 flex items-center gap-2">
          <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#B6F34A]/70 border border-[#B6F34A]/15 px-2 py-0.5">
            FEEDBACK REQUEST
          </span>
        </div>
      )}

      {/* Project preview */}
      <div className="mt-4">
        <ActivityProjectPreview project={event.project} />
      </div>

      {/* Feedback CTA */}
      {isFeedback && (
        <Link
          to={`/projects/${event.project.id}/feedback`}
          className="mt-4 flex items-center gap-2 text-[11px] font-mono uppercase tracking-[0.12em] text-[#8A8F89] hover:text-[#B6F34A] transition-colors duration-200"
        >
          <MessageCircle size={12} />
          Give Feedback
        </Link>
      )}
    </motion.article>
  )
}
