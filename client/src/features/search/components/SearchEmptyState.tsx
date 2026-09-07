import { motion } from 'framer-motion'
import { SearchX } from 'lucide-react'

const ease = [0.22, 1, 0.36, 1] as const

interface SearchEmptyStateProps {
  query: string
}

export default function SearchEmptyState({ query }: SearchEmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease }}
      className="text-center py-20"
    >
      <SearchX className="w-12 h-12 text-[#303530] mx-auto mb-6" />
      <p className="text-[11px] uppercase tracking-[0.25em] text-[#303530] font-mono mb-3">
        NO RESULTS FOUND
      </p>
      <p className="text-[15px] text-[#555B55] mb-2 max-w-[320px] mx-auto">
        We couldn't find anything matching "{query}".
      </p>
      <p className="text-[13px] text-[#303530] max-w-[280px] mx-auto">
        Try a different keyword, project name, builder username, or technology.
      </p>
    </motion.div>
  )
}
