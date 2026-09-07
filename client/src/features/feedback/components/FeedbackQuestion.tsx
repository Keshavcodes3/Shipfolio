import { motion } from 'framer-motion'
import type { FeedbackRequest } from '../data/feedbackData'
import FeedbackTypeBadge from './FeedbackTypeBadge'

const ease = [0.22, 1, 0.36, 1] as const

interface FeedbackQuestionProps {
  request: FeedbackRequest
}

export default function FeedbackQuestion({ request }: FeedbackQuestionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease }}
      className="border border-white/[0.06] bg-white/[0.015] p-6"
    >
      <div className="flex items-center gap-2 mb-4">
        <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#B6F34A]/70">
          FEEDBACK REQUEST
        </span>
        {request.status === 'CLOSED' && (
          <span className="text-[9px] font-mono uppercase tracking-[0.15em] text-[#555B55] border border-white/[0.06] px-2 py-0.5">
            CLOSED
          </span>
        )}
      </div>

      <h2 className="text-[clamp(1.1rem,2vw,1.4rem)] font-bold text-[#F5F7F2] mb-3 leading-snug">
        {request.title}
      </h2>

      <p className="text-[14px] text-[#8A8F89] leading-relaxed mb-4">
        {request.description}
      </p>

      {request.context && (
        <div className="p-4 border-l-2 border-[#B6F34A]/20 bg-[#B6F34A]/[0.02] mb-4">
          <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#555B55] mb-2">
            CONTEXT
          </p>
          <p className="text-[13px] text-[#C5C8C5] leading-relaxed">
            {request.context}
          </p>
        </div>
      )}

      <div className="flex items-center justify-between pt-4 border-t border-white/[0.04]">
        <div className="flex items-center gap-3">
          <FeedbackTypeBadge category={request.category} size="md" />
          <span className="text-[12px] text-[#555B55]">
            Asked {request.createdAt} by{' '}
            <span className="text-[#8A8F89]">@{request.builder.username}</span>
          </span>
        </div>
      </div>
    </motion.div>
  )
}
