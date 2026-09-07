import { motion } from 'framer-motion'
import { Check } from 'lucide-react'

interface FeedbackHelpfulButtonProps {
  helpfulCount: number
  isHelpful: boolean
  onToggle: () => void
}

export default function FeedbackHelpfulButton({ helpfulCount, isHelpful, onToggle }: FeedbackHelpfulButtonProps) {
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onToggle}
      className={`flex items-center gap-2 px-3 py-1.5 text-[12px] font-mono transition-colors duration-200 cursor-pointer border ${
        isHelpful
          ? 'text-[#B6F34A] border-[#B6F34A]/20 bg-[#B6F34A]/[0.06]'
          : 'text-[#555B55] border-white/[0.06] hover:text-[#8A8F89] hover:border-white/[0.1]'
      }`}
    >
      {isHelpful ? (
        <Check size={12} className="text-[#B6F34A]" />
      ) : (
        <span className="text-[14px] leading-none">+</span>
      )}
      <span>{isHelpful ? 'Helpful' : 'Helpful'}</span>
      {helpfulCount > 0 && (
        <span className="text-[10px] text-[#303530]">· {helpfulCount}</span>
      )}
    </motion.button>
  )
}
