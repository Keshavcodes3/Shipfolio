import { motion } from 'framer-motion'

const ease = [0.22, 1, 0.36, 1] as const

interface GraveyardEmptyStateProps {
  onClearFilters: () => void
}

export default function GraveyardEmptyState({ onClearFilters }: GraveyardEmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease }}
      className="text-center py-24"
    >
      <p className="text-[11px] uppercase tracking-[0.25em] text-[#303530] font-mono mb-4">
        NOTHING HERE YET.
      </p>
      <p className="text-[15px] text-[#555B55] mb-2 max-w-[280px] mx-auto">
        The graveyard is quiet.
      </p>
      <p className="text-[13px] text-[#303530] mb-6">
        Try another filter.
      </p>
      <button
        onClick={onClearFilters}
        className="text-[11px] font-mono uppercase tracking-[0.1em] text-[#B6F34A] hover:text-[#c8ff66] transition-colors"
      >
        Clear filters →
      </button>
    </motion.div>
  )
}
