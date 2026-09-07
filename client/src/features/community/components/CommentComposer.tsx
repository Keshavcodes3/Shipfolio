import { useState } from 'react'
import { motion } from 'framer-motion'
import { Send } from 'lucide-react'

const ease = [0.22, 1, 0.36, 1] as const

interface CommentComposerProps {
  onSubmit: (content: string) => void
}

export default function CommentComposer({ onSubmit }: CommentComposerProps) {
  const [content, setContent] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = () => {
    if (!content.trim()) return
    onSubmit(content)
    setContent('')
    setSubmitted(true)
    setTimeout(() => setSubmitted(false), 2000)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease }}
      className="border border-white/[0.06] bg-white/[0.015] p-5"
    >
      <h4 className="text-[11px] font-mono uppercase tracking-[0.3em] text-[#8A8F89] mb-3">
        ADD A COMMENT
      </h4>

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
          </div>
        </div>
      )}

      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Share something useful..."
        rows={3}
        className="w-full bg-transparent border border-white/[0.06] p-4 text-[14px] text-[#F5F7F2] placeholder:text-[#303530] focus:outline-none focus:border-[#B6F34A]/30 transition-colors duration-200 resize-none mb-3"
      />

      <div className="flex items-center justify-between">
        <p className="text-[11px] text-[#303530]">
          Be specific. Explain what confused you, what worked, and what you would change.
        </p>
        <div className="flex items-center gap-3">
          {submitted && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-[12px] text-[#B6F34A] font-mono"
            >
              Comment posted.
            </motion.span>
          )}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleSubmit}
            disabled={!content.trim()}
            className="flex items-center gap-2 px-4 py-1.5 text-[11px] font-mono uppercase tracking-[0.12em] bg-[#B6F34A] text-[#080A08] hover:bg-[#B6F34A]/90 transition-colors duration-200 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
          >
            <Send size={11} />
            Post
          </motion.button>
        </div>
      </div>
    </motion.div>
  )
}
