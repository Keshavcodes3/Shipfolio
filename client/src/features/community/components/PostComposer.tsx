import { useState } from 'react'
import { motion } from 'framer-motion'
import { Send } from 'lucide-react'
import type { PostType, PostCategory } from '../types/community'
import { postTypes, postCategories } from '../types/community'

const ease = [0.22, 1, 0.36, 1] as const

interface PostComposerProps {
  onSubmit: (data: {
    type: PostType
    title: string
    content: string
    category: PostCategory
    tags: string[]
  }) => void
  onCancel: () => void
}

export default function PostComposer({ onSubmit, onCancel }: PostComposerProps) {
  const [type, setType] = useState<PostType>('DISCUSSION')
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [category, setCategory] = useState<PostCategory>('Discussion')
  const [tagsInput, setTagsInput] = useState('')
  const [errors, setErrors] = useState<{ title?: string; content?: string }>({})

  const validate = () => {
    const newErrors: { title?: string; content?: string } = {}
    if (!title.trim()) {
      newErrors.title = 'Give your post a title.'
    }
    if (!content.trim()) {
      newErrors.content = 'Write something to share.'
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = () => {
    if (!validate()) return
    const tags = tagsInput
      .split(',')
      .map((t) => t.trim().toLowerCase())
      .filter(Boolean)
    onSubmit({ type, title, content, category, tags })
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease }}
      className="border border-white/[0.06] bg-white/[0.015] p-6 space-y-6"
    >
      <h3 className="text-[11px] font-mono uppercase tracking-[0.3em] text-[#8A8F89]">
        NEW POST
      </h3>

      {/* Post type */}
      <div>
        <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#555B55] mb-3">
          POST TYPE
        </p>
        <div className="flex flex-wrap gap-2">
          {postTypes.map((pt) => (
            <button
              key={pt.value}
              onClick={() => setType(pt.value)}
              className={`text-[11px] font-mono px-3 py-1.5 border transition-colors duration-200 cursor-pointer ${
                type === pt.value
                  ? 'text-[#B6F34A] border-[#B6F34A]/30 bg-[#B6F34A]/[0.06]'
                  : 'text-[#555B55] border-white/[0.06] hover:text-[#8A8F89]'
              }`}
            >
              {pt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Title */}
      <div>
        <label className="block text-[10px] font-mono uppercase tracking-[0.2em] text-[#555B55] mb-2">
          TITLE
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="What do you want to share?"
          className="w-full bg-transparent border border-white/[0.06] p-4 text-[14px] text-[#F5F7F2] placeholder:text-[#303530] focus:outline-none focus:border-[#B6F34A]/30 transition-colors duration-200"
        />
        {errors.title && (
          <p className="text-[12px] text-[#FF6B6B] mt-2">{errors.title}</p>
        )}
      </div>

      {/* Content */}
      <div>
        <label className="block text-[10px] font-mono uppercase tracking-[0.2em] text-[#555B55] mb-2">
          CONTENT
        </label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Share details, context, or questions..."
          rows={6}
          className="w-full bg-transparent border border-white/[0.06] p-4 text-[14px] text-[#F5F7F2] placeholder:text-[#303530] focus:outline-none focus:border-[#B6F34A]/30 transition-colors duration-200 resize-none"
        />
        {errors.content && (
          <p className="text-[12px] text-[#FF6B6B] mt-2">{errors.content}</p>
        )}
      </div>

      {/* Category */}
      <div>
        <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#555B55] mb-3">
          CATEGORY
        </p>
        <div className="flex flex-wrap gap-2">
          {postCategories.map((cat) => (
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

      {/* Tags */}
      <div>
        <label className="block text-[10px] font-mono uppercase tracking-[0.2em] text-[#555B55] mb-2">
          TAGS <span className="text-[#303530]">(comma separated)</span>
        </label>
        <input
          type="text"
          value={tagsInput}
          onChange={(e) => setTagsInput(e.target.value)}
          placeholder="e.g., react, ux, launch"
          className="w-full bg-transparent border border-white/[0.06] p-4 text-[14px] text-[#F5F7F2] placeholder:text-[#303530] focus:outline-none focus:border-[#B6F34A]/30 transition-colors duration-200"
        />
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between pt-4 border-t border-white/[0.04]">
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
          className="flex items-center gap-2 px-5 py-2 text-[11px] font-mono uppercase tracking-[0.12em] bg-[#B6F34A] text-[#080A08] hover:bg-[#B6F34A]/90 transition-colors duration-200 cursor-pointer"
        >
          <Send size={12} />
          Post
        </motion.button>
      </div>
    </motion.div>
  )
}
