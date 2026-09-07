import { motion } from 'framer-motion'
import { graveyardFilters, graveyardSorts } from '../data/graveyardData'

const ease = [0.22, 1, 0.36, 1] as const

interface GraveyardFiltersProps {
  activeFilter: string
  activeSort: string
  onFilterChange: (filter: string) => void
  onSortChange: (sort: string) => void
}

export default function GraveyardFilters({
  activeFilter,
  activeSort,
  onFilterChange,
  onSortChange,
}: GraveyardFiltersProps) {
  return (
    <div className="py-8 border-t border-white/[0.06]">
      <div className="flex flex-col md:flex-row md:items-center gap-6">
        <div className="flex items-center gap-1 overflow-x-auto scrollbar-none">
          {graveyardFilters.map((filter) => (
            <button
              key={filter.value}
              onClick={() => onFilterChange(filter.value)}
              className={`relative shrink-0 px-3 py-2 text-[11px] font-mono uppercase tracking-[0.15em] transition-colors duration-200 ${
                activeFilter === filter.value
                  ? 'text-[#F5F7F2]'
                  : 'text-[#555B55] hover:text-[#8A8F89]'
              }`}
            >
              {activeFilter === filter.value && (
                <motion.div
                  layoutId="graveyard-filter"
                  className="absolute inset-0 bg-white/[0.06]"
                  transition={{ duration: 0.2, ease }}
                />
              )}
              <span className="relative z-10">{filter.label}</span>
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 md:ml-auto">
          <span className="text-[10px] text-[#303530] font-mono uppercase tracking-[0.15em]">Sort:</span>
          {graveyardSorts.map((sort) => (
            <button
              key={sort.value}
              onClick={() => onSortChange(sort.value)}
              className={`text-[10px] font-mono uppercase tracking-[0.12em] transition-colors duration-200 ${
                activeSort === sort.value ? 'text-[#B6F34A]' : 'text-[#555B55] hover:text-[#8A8F89]'
              }`}
            >
              {sort.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
