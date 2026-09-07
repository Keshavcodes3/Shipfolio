import { motion } from 'framer-motion'

const ease = [0.22, 1, 0.36, 1] as const

type ActivityFilter = 'ALL' | 'UPDATES' | 'PROJECTS' | 'FEEDBACK' | 'BUILDERS'

interface ActivityHeaderProps {
  activeFilter: ActivityFilter
  onFilterChange: (filter: ActivityFilter) => void
}

const filters: { value: ActivityFilter; label: string }[] = [
  { value: 'ALL', label: 'ALL' },
  { value: 'UPDATES', label: 'UPDATES' },
  { value: 'PROJECTS', label: 'PROJECTS' },
  { value: 'FEEDBACK', label: 'FEEDBACK' },
  { value: 'BUILDERS', label: 'BUILDERS' },
]

export default function ActivityHeader({ activeFilter, onFilterChange }: ActivityHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease }}
      className="pb-12 md:pb-16"
    >
      <h1 className="text-[clamp(2rem,5vw,3.5rem)] font-black tracking-[-0.06em] leading-[0.9] text-[#F5F7F2] mb-4">
        YOUR FEED
      </h1>
      <p className="text-[16px] text-[#8A8F89] max-w-[400px]">
        What the people you follow are building.
      </p>

      <div className="flex items-center gap-6 mt-8 text-[11px] uppercase tracking-[0.16em] font-mono">
        {filters.map((filter) => (
          <button
            key={filter.value}
            onClick={() => onFilterChange(filter.value)}
            className={`transition-colors duration-200 cursor-pointer ${
              activeFilter === filter.value
                ? 'text-[#B6F34A]'
                : 'text-[#555B55] hover:text-[#8A8F89]'
            }`}
          >
            {filter.label}
          </button>
        ))}
      </div>
    </motion.div>
  )
}
