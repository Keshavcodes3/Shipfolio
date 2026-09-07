import { motion } from 'framer-motion'
import type { FeedbackResponse } from '../data/feedbackData'
import { feedbackCategories } from '../data/feedbackData'

const ease = [0.22, 1, 0.36, 1] as const

interface FeedbackSummaryProps {
  responses: FeedbackResponse[]
  helpfulCount: number
}

export default function FeedbackSummary({ responses, helpfulCount }: FeedbackSummaryProps) {
  const categoryCounts = feedbackCategories
    .map((cat) => ({
      category: cat,
      count: responses.filter((r) => r.category === cat).length,
    }))
    .filter((c) => c.count > 0)
    .sort((a, b) => b.count - a.count)

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease }}
      className="border border-white/[0.06] bg-white/[0.015] p-6"
    >
      <h3 className="text-[11px] font-mono uppercase tracking-[0.3em] text-[#8A8F89] mb-4">
        FEEDBACK
      </h3>

      <div className="flex items-baseline gap-2 mb-6">
        <span className="text-[clamp(1.8rem,3vw,2.5rem)] font-bold text-[#F5F7F2]">
          {responses.length}
        </span>
        <span className="text-[13px] text-[#555B55]">
          {responses.length === 1 ? 'response' : 'responses'}
        </span>
      </div>

      <div className="space-y-0">
        {/* Helpful count */}
        <div className="flex items-center justify-between py-3 border-b border-white/[0.04]">
          <span className="text-[12px] text-[#8A8F89]">Found helpful</span>
          <span className="text-[14px] font-bold text-[#B6F34A]">{helpfulCount}</span>
        </div>

        {/* Category breakdown */}
        {categoryCounts.map(({ category, count }) => (
          <div
            key={category}
            className="flex items-center justify-between py-3 border-b border-white/[0.04] last:border-b-0"
          >
            <span className="text-[12px] text-[#8A8F89]">{category}</span>
            <span className="text-[14px] font-bold text-[#F5F7F2]">{count}</span>
          </div>
        ))}
      </div>
    </motion.div>
  )
}
