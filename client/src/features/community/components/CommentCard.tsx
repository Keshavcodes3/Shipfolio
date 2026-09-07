import { motion } from 'framer-motion'
import type { PostComment } from '../types/community'
import FeedbackHelpfulButton from '../../feedback/components/FeedbackHelpfulButton'

const ease = [0.22, 1, 0.36, 1] as const

interface CommentCardProps {
  comment: PostComment
  index?: number
  isHelpful: boolean
  onToggleHelpful: (id: string) => void
}

export default function CommentCard({ comment, index = 0, isHelpful, onToggleHelpful }: CommentCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.4, ease }}
      className="py-5 border-b border-white/[0.04] last:border-b-0"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-[#1A1D1A] border border-white/[0.08] flex items-center justify-center text-[10px] font-bold text-[#B6F34A]">
            {comment.author.username[0].toUpperCase()}
          </div>
          <span className="text-[13px] font-bold text-[#F5F7F2]">
            @{comment.author.username}
          </span>
        </div>
        <span className="text-[11px] text-[#303530] font-mono">{comment.createdAt}</span>
      </div>

      {/* Content */}
      <p className="text-[14px] text-[#C5C8C5] leading-[1.7] mb-3 pl-8">
        {comment.content}
      </p>

      {/* Helpful */}
      <div className="pl-8">
        <FeedbackHelpfulButton
          helpfulCount={comment.helpfulCount}
          isHelpful={isHelpful}
          onToggle={() => onToggleHelpful(comment.id)}
        />
      </div>
    </motion.div>
  )
}
