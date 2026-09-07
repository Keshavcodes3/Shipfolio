import type { PostCategory } from '../types/community'

const categoryColors: Record<PostCategory, string> = {
  'Looking for Feedback': '#B6F34A',
  'Show & Tell': '#B6F34A',
  Question: '#8A8F89',
  Discussion: '#8A8F89',
  'Looking for Co-founder': '#555B55',
  Hiring: '#555B55',
  'Built Something Cool': '#B6F34A',
}

interface PostCategoryBadgeProps {
  category: PostCategory
  size?: 'sm' | 'md'
}

export default function PostCategoryBadge({ category, size = 'sm' }: PostCategoryBadgeProps) {
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
