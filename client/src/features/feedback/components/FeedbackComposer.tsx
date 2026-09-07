import { useState } from 'react'
import { motion } from 'framer-motion'
import { Send } from 'lucide-react'
import type { FeedbackCategory, FeedbackRequest } from '../data/feedbackData'
import { feedbackCategories } from '../data/feedbackData'

const ease = [0.22, 1, 0.36, 1] as const

interface FeedbackComposerProps {
  request: FeedbackRequest
  onSubmit: (content: string, category: FeedbackCategory) => void
}

export default function FeedbackComposer({ request, onSubmit }: FeedbackComposerProps) {
  const [content, setContent] = useState('')
  const [category, setCategory] = useState<FeedbackCategory>('UX / Usability')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = () => {
    if (!content.trim()) return
    onSubmit(content, category)
    setContent('')
    setSubmitted(true)
    setTimeout(() => setSubmitted(false), 2000)
  }

  if (request.status === 'CLOSED') {
    return (
      <div className="p-6 border border-white/[0.06] bg-white/[0.015] text-center">
        <p className="text-[11px] font-mono uppercase tracking-[0.2em] text-[#555B55] mb-2">
          FEEDBACK REQUEST CLOSED
        </p>
        <p className="text-[13px] text-[#8A8F89]">
          The builder has finished collecting feedback.
        </p>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease }}
      className="border border-white/[0.06] bg-white/[0.015] p-6"
    >
      <h3 className="text-[11px] font-mono uppercase tracking-[0.3em] text-[#8A8F89] mb-4">
        GIVE FEEDBACK
      </h3>

      {/* Quality prompt */}
      {content.length === 0 && (
        <div className="mb-4 p-4 border border-white/[0.04] bg-white/[0.01]">
          <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#555B55] mb-2">
            GOOD FEEDBACK
          </p>
          <div className="space-y-1">
            <p className="text-[12px] text-[#555B55]">What worked?</p>
            <p className="text-[12px] text-[#555B55]">What confused you?</p>
            <p className="text-[12px] text-[#555B55]">What would you change?</p>
            <p className="text-[12px] text-[#555B55]">Why?</p>
          </div>
        </div>
      )}

      {/* Textarea */}
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Share something useful..."
        rows={4}
        className="w-full bg-transparent border border-white/[0.06] p-4 text-[14px] text-[#F5F7F2] placeholder:text-[#303530] focus:outline-none focus:border-[#B6F34A]/30 transition-colors duration-200 resize-none mb-4"
      />

      {/* Category selector */}
      <div className="mb-4">
        <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#555B55] mb-2">
          FEEDBACK TYPE
        </p>
        <div className="flex flex-wrap gap-2">
          {feedbackCategories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`text-[11px] font-mono px-2.5 py-1 border transition-colors duration-200 cursor-pointer ${
                category === cat
                  ? 'text-[#B6F34A] border-[#B6F34A]/30 bg-[#B6F34A]/[0.06]'
                  : 'text-[#555B55] border-white/[0.06] hover:text-[#8A8F89]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Note */}
      <p className="text-[11px] text-[#303530] mb-4">
        Be specific. Explain what confused you, what worked, and what you would change.
      </p>

      {/* Submit */}
      <div className="flex items-center justify-between">
        {submitted && (
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-[12px] text-[#B6F34A] font-mono"
          >
            Feedback sent.
          </motion.span>
        )}
        <div className="ml-auto">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleSubmit}
            disabled={!content.trim()}
            className="flex items-center gap-2 px-5 py-2 text-[11px] font-mono uppercase tracking-[0.12em] bg-[#B6F34A] text-[#080A08] hover:bg-[#B6F34A]/90 transition-colors duration-200 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
          >
            <Send size={12} />
            Send Feedback
          </motion.button>
        </div>
      </div>
    </motion.div>
  )
}
