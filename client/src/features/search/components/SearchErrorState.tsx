import { motion } from 'framer-motion'
import { AlertTriangle } from 'lucide-react'

const ease = [0.22, 1, 0.36, 1] as const

interface SearchErrorStateProps {
  onRetry?: () => void
}

export default function SearchErrorState({ onRetry }: SearchErrorStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease }}
      className="text-center py-20"
    >
      <AlertTriangle className="w-12 h-12 text-[#303530] mx-auto mb-6" />
      <p className="text-[11px] uppercase tracking-[0.25em] text-[#303530] font-mono mb-3">
        SEARCH UNAVAILABLE
      </p>
      <p className="text-[15px] text-[#555B55] mb-4 max-w-[320px] mx-auto">
        Something went wrong while searching. Please try again.
      </p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="text-[11px] font-mono uppercase tracking-[0.1em] text-[#B6F34A] hover:text-[#c8ff66] transition-colors"
        >
          Retry
        </button>
      )}
    </motion.div>
  )
}
