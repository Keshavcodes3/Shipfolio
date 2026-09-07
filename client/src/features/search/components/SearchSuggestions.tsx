import { motion } from 'framer-motion'
import { Clock, TrendingUp } from 'lucide-react'

const ease = [0.22, 1, 0.36, 1] as const

const recentSearches = ['AI agents', 'React', 'Keshav']
const trending = ['AI', 'TypeScript', 'PostgreSQL', 'LangChain', 'Rust']

interface SearchSuggestionsProps {
  onSelect: (query: string) => void
}

export default function SearchSuggestions({ onSelect }: SearchSuggestionsProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease }}
      className="py-8"
    >
      {recentSearches.length > 0 && (
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-3">
            <Clock className="w-3 h-3 text-[#303530]" />
            <span className="text-[10px] uppercase tracking-[0.3em] text-[#303530] font-mono">
              Recent searches
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {recentSearches.map((term) => (
              <button
                key={term}
                onClick={() => onSelect(term)}
                className="text-[13px] text-[#8A8F89] border border-white/[0.06] px-3 py-1.5 hover:bg-white/[0.03] hover:border-white/[0.1] transition-all duration-200"
              >
                {term}
              </button>
            ))}
          </div>
        </div>
      )}

      <div>
        <div className="flex items-center gap-2 mb-3">
          <TrendingUp className="w-3 h-3 text-[#303530]" />
          <span className="text-[10px] uppercase tracking-[0.3em] text-[#303530] font-mono">
            Trending
          </span>
        </div>
        <div className="flex flex-wrap gap-2">
          {trending.map((term) => (
            <button
              key={term}
              onClick={() => onSelect(term)}
              className="text-[13px] text-[#8A8F89] border border-white/[0.06] px-3 py-1.5 hover:bg-white/[0.03] hover:border-white/[0.1] transition-all duration-200"
            >
              {term}
            </button>
          ))}
        </div>
      </div>
    </motion.div>
  )
}
