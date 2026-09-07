import { motion } from 'framer-motion'
import type { FeedbackResponse } from '../data/feedbackData'
import FeedbackTypeBadge from './FeedbackTypeBadge'
import FeedbackHelpfulButton from './FeedbackHelpfulButton'

const ease = [0.22, 1, 0.36, 1] as const

interface FeedbackCardProps {
  response: FeedbackResponse
  index?: number
  isHelpful: boolean
  onToggleHelpful: (id: string) => void
}

export default function FeedbackCard({ response, index = 0, isHelpful, onToggleHelpful }: FeedbackCardProps) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.5, ease }}
      className="py-6 border-b border-white/[0.04] last:border-b-0"
    >
      {/* Header: author + category + time */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <span className="text-[13px] font-bold text-[#F5F7F2]">
            @{response.author.username}
          </span>
          <FeedbackTypeBadge category={response.category} />
        </div>
        <span className="text-[11px] text-[#303530] font-mono">{response.createdAt}</span>
      </div>

      {/* Content */}
      <p className="text-[14px] text-[#C5C8C5] leading-[1.7] mb-4">
        {response.content}
      </p>

      {/* Helpful */}
      <FeedbackHelpfulButton
        helpfulCount={response.helpfulCount}
        isHelpful={isHelpful}
        onToggle={() => onToggleHelpful(response.id)}
      />
    </motion.article>
  )
}
