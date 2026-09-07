import { useState } from 'react'
import { motion } from 'framer-motion'
import { Send } from 'lucide-react'
import type { FeedbackCategory } from '../data/feedbackData'
import FeedbackCategorySelect from './FeedbackCategorySelect'

const ease = [0.22, 1, 0.36, 1] as const

interface FeedbackRequestFormProps {
  projectName: string
  onSubmit: (data: {
    title: string
    description: string
    category: FeedbackCategory
    context: string
  }) => void
  onCancel: () => void
}

export default function FeedbackRequestForm({ projectName, onSubmit, onCancel }: FeedbackRequestFormProps) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState<FeedbackCategory>('UX / Usability')
  const [context, setContext] = useState('')
  const [errors, setErrors] = useState<{ title?: string; category?: string }>({})

  const validate = () => {
    const newErrors: { title?: string; category?: string } = {}
    if (!title.trim()) {
      newErrors.title = 'Please tell people what you would like feedback on.'
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = () => {
    if (!validate()) return
    onSubmit({ title, description, category, context })
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease }}
      className="space-y-8"
    >
      {/* Project context */}
      <div>
        <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#555B55] mb-2">
          PROJECT
        </p>
        <p className="text-[15px] font-semibold text-[#F5F7F2]">{projectName}</p>
      </div>

      {/* What are you working on */}
      <div>
        <label className="block text-[10px] font-mono uppercase tracking-[0.2em] text-[#555B55] mb-2">
          WHAT ARE YOU WORKING ON?
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g., New letter composer"
          className="w-full bg-transparent border border-white/[0.06] p-4 text-[14px] text-[#F5F7F2] placeholder:text-[#303530] focus:outline-none focus:border-[#B6F34A]/30 transition-colors duration-200"
        />
      </div>

      {/* What do you want feedback on */}
      <div>
        <label className="block text-[10px] font-mono uppercase tracking-[0.2em] text-[#555B55] mb-2">
          WHAT DO YOU WANT FEEDBACK ON?
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="e.g., Does the first-time letter writing flow feel intuitive?"
          rows={4}
          className="w-full bg-transparent border border-white/[0.06] p-4 text-[14px] text-[#F5F7F2] placeholder:text-[#303530] focus:outline-none focus:border-[#B6F34A]/30 transition-colors duration-200 resize-none"
        />
        {errors.title && (
          <p className="text-[12px] text-[#FF6B6B] mt-2">{errors.title}</p>
        )}
      </div>

      {/* Category */}
      <FeedbackCategorySelect value={category} onChange={setCategory} error={errors.category} />

      {/* Context */}
      <div>
        <label className="block text-[10px] font-mono uppercase tracking-[0.2em] text-[#555B55] mb-2">
          CONTEXT <span className="text-[#303530]">(optional)</span>
        </label>
        <textarea
          value={context}
          onChange={(e) => setContext(e.target.value)}
          placeholder="What should people know before giving feedback?"
          rows={3}
          className="w-full bg-transparent border border-white/[0.06] p-4 text-[14px] text-[#F5F7F2] placeholder:text-[#303530] focus:outline-none focus:border-[#B6F34A]/30 transition-colors duration-200 resize-none"
        />
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between pt-4">
        <button
          onClick={onCancel}
          className="text-[12px] font-mono uppercase tracking-[0.12em] text-[#555B55] hover:text-[#8A8F89] transition-colors duration-200 cursor-pointer"
        >
          Cancel
        </button>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleSubmit}
          className="flex items-center gap-2 px-6 py-2.5 text-[11px] font-mono uppercase tracking-[0.12em] bg-[#B6F34A] text-[#080A08] hover:bg-[#B6F34A]/90 transition-colors duration-200 cursor-pointer"
        >
          <Send size={12} />
          Ask for Feedback
        </motion.button>
      </div>
    </motion.div>
  )
}
