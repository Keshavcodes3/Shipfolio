import { motion } from 'framer-motion'
import type { SearchFilterType } from '../types/search'

const ease = [0.22, 1, 0.36, 1] as const

interface SearchFiltersProps {
  active: SearchFilterType
  onChange: (filter: SearchFilterType) => void
  counts: { projects: number; builders: number; technologies: number; total: number }
}

const filters: { value: SearchFilterType; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'projects', label: 'Projects' },
  { value: 'builders', label: 'Builders' },
  { value: 'technologies', label: 'Technologies' },
]

export default function SearchFilters({ active, onChange, counts }: SearchFiltersProps) {
  const getCount = (filter: SearchFilterType) => {
    switch (filter) {
      case 'all': return counts.total
      case 'projects': return counts.projects
      case 'builders': return counts.builders
      case 'technologies': return counts.technologies
    }
  }

  return (
    <div className="flex items-center gap-1 border-b border-white/[0.06]">
      {filters.map(({ value, label }) => {
        const count = getCount(value)
        return (
          <button
            key={value}
            onClick={() => onChange(value)}
            className="relative shrink-0 py-3 px-1 mr-4"
          >
            <span
              className={`text-[12px] font-mono uppercase tracking-[0.16em] transition-colors duration-200 ${
                active === value ? 'text-[#F5F7F2]' : 'text-[#555B55] hover:text-[#8A8F89]'
              }`}
            >
              {label}
              {count > 0 && (
                <span className="ml-1.5 text-[10px] text-[#303530]">{count}</span>
              )}
            </span>
            {active === value && (
              <motion.div
                layoutId="search-filter"
                className="absolute bottom-0 left-0 right-0 h-[1px] bg-[#B6F34A]"
                transition={{ duration: 0.25, ease }}
              />
            )}
          </button>
        )
      })}
    </div>
  )
}
