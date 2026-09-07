import type { FeedbackCategory } from '../data/feedbackData'
import { feedbackCategories } from '../data/feedbackData'

interface FeedbackCategorySelectProps {
  value: FeedbackCategory
  onChange: (category: FeedbackCategory) => void
  error?: string
}

export default function FeedbackCategorySelect({ value, onChange, error }: FeedbackCategorySelectProps) {
  return (
    <div>
      <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#555B55] mb-3">
        FEEDBACK TYPE
      </p>
      <div className="space-y-2">
        {feedbackCategories.map((cat) => (
          <label
            key={cat}
            onClick={() => onChange(cat)}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div
              className={`w-4 h-4 rounded-full border transition-colors duration-200 flex items-center justify-center ${
                value === cat
                  ? 'border-[#B6F34A] bg-[#B6F34A]/[0.12]'
                  : 'border-white/[0.12] group-hover:border-white/[0.2]'
              }`}
            >
              {value === cat && (
                <div className="w-1.5 h-1.5 rounded-full bg-[#B6F34A]" />
              )}
            </div>
            <span className={`text-[13px] transition-colors duration-200 ${
              value === cat ? 'text-[#F5F7F2]' : 'text-[#8A8F89] group-hover:text-[#C5C8C5]'
            }`}>
              {cat}
            </span>
          </label>
        ))}
      </div>
      {error && (
        <p className="text-[12px] text-[#FF6B6B] mt-2">{error}</p>
      )}
    </div>
  )
}
