import { motion } from 'framer-motion'

const ease = [0.22, 1, 0.36, 1] as const

interface DiscoverFiltersProps {
  filters: readonly string[]
  active: string
  onChange: (filter: string) => void
}

export default function DiscoverFilters({ filters, active, onChange }: DiscoverFiltersProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.5, ease }}
      className="flex items-center gap-2 overflow-x-auto scrollbar-none pb-1"
    >
      {filters.map((filter) => (
        <button
          key={filter}
          onClick={() => onChange(filter)}
          className="relative shrink-0 px-3 py-1.5"
        >
          <span
            className={`text-[11px] font-mono uppercase tracking-[0.12em] transition-colors duration-200 ${
              active === filter ? 'text-[#F5F7F2]' : 'text-[#555B55] hover:text-[#8A8F89]'
            }`}
          >
            {filter}
          </span>
          {active === filter && (
            <motion.div
              layoutId="discover-filters"
              className="absolute bottom-0 left-0 right-0 h-[1px] bg-[#B6F34A]"
              transition={{ duration: 0.25, ease }}
            />
          )}
        </button>
      ))}
    </motion.div>
  )
}
