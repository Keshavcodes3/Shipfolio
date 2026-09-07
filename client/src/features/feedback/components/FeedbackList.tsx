import type { FeedbackResponse } from '../data/feedbackData'
import FeedbackCard from './FeedbackCard'

interface FeedbackListProps {
  responses: FeedbackResponse[]
  helpfulMap: Record<string, boolean>
  onToggleHelpful: (id: string) => void
}

export default function FeedbackList({ responses, helpfulMap, onToggleHelpful }: FeedbackListProps) {
  if (responses.length === 0) {
    return (
      <div className="py-16 text-center">
        <p className="text-[13px] text-[#555B55]">
          No feedback yet. Be the first to share your perspective.
        </p>
      </div>
    )
  }

  return (
    <div>
      {responses.map((response, i) => (
        <FeedbackCard
          key={response.id}
          response={response}
          index={i}
          isHelpful={helpfulMap[response.id] ?? false}
          onToggleHelpful={onToggleHelpful}
        />
      ))}
    </div>
  )
}
