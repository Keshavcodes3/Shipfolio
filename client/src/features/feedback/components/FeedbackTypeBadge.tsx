import type { FeedbackCategory } from '../data/feedbackData'

const categoryColors: Record<FeedbackCategory, string> = {
  'UX / Usability': '#B6F34A',
  Design: '#B6F34A',
  Product: '#8A8F89',
  Technical: '#8A8F89',
  Performance: '#555B55',
  Accessibility: '#555B55',
  Other: '#303530',
}

interface FeedbackTypeBadgeProps {
  category: FeedbackCategory
  size?: 'sm' | 'md'
}

export default function FeedbackTypeBadge({ category, size = 'sm' }: FeedbackTypeBadgeProps) {
  const color = categoryColors[category] ?? '#555B55'
  const sizeClasses = size === 'sm' ? 'text-[9px] px-2 py-0.5' : 'text-[10px] px-2.5 py-1'

  return (
    <span
      className={`inline-block font-mono uppercase tracking-[0.15em] border border-white/[0.06] ${sizeClasses}`}
      style={{ color, borderColor: `${color}22` }}
    >
      {category}
    </span>
  )
}
