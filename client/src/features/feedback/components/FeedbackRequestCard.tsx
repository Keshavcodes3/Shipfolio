import { motion } from 'framer-motion'
import { Link } from 'react-router'
import { MessageCircle } from 'lucide-react'
import type { FeedbackRequest } from '../data/feedbackData'
import FeedbackTypeBadge from './FeedbackTypeBadge'

const ease = [0.22, 1, 0.36, 1] as const

interface FeedbackRequestCardProps {
  request: FeedbackRequest
  index?: number
}

export default function FeedbackRequestCard({ request, index = 0 }: FeedbackRequestCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.5, ease }}
      className="border border-white/[0.06] bg-white/[0.015] p-5 group hover:border-[#B6F34A]/15 transition-colors duration-300"
    >
      {/* Header: builder + timestamp */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Link
            to={`/profile/${request.builder.username}`}
            className="text-[13px] font-bold text-[#F5F7F2] hover:text-[#B6F34A] transition-colors duration-200"
          >
            @{request.builder.username}
          </Link>
          <span className="text-[11px] text-[#303530] font-mono">{request.createdAt}</span>
        </div>
        {request.status === 'CLOSED' && (
          <span className="text-[9px] font-mono uppercase tracking-[0.15em] text-[#555B55] border border-white/[0.06] px-2 py-0.5">
            CLOSED
          </span>
        )}
      </div>

      {/* Project name */}
      <Link
        to={`/projects/${request.projectId}`}
        className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#B6F34A]/70 hover:text-[#B6F34A] transition-colors duration-200 mb-2 block"
      >
        {request.projectName}
      </Link>

      {/* Title */}
      <h3 className="text-[15px] font-semibold text-[#F5F7F2] mb-2 leading-snug">
        {request.title}
      </h3>

      {/* Description */}
      <p className="text-[13px] text-[#8A8F89] leading-relaxed mb-4 line-clamp-2">
        {request.description}
      </p>

      {/* Category + CTA */}
      <div className="flex items-center justify-between">
        <FeedbackTypeBadge category={request.category} />
        <Link
          to={`/projects/${request.projectId}/feedback`}
          className="flex items-center gap-2 text-[11px] font-mono uppercase tracking-[0.12em] text-[#8A8F89] group-hover:text-[#B6F34A] transition-colors duration-200"
        >
          <MessageCircle size={12} />
          {request.status === 'OPEN' ? 'Give Feedback' : 'View Feedback'}
          <span className="text-[10px] text-[#303530]">({request.responses})</span>
        </Link>
      </div>
    </motion.div>
  )
}
