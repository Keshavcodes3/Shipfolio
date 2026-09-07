import { motion } from 'framer-motion'
import type { FilterStatus } from '../data/projectData'
import { filterStatuses } from '../data/projectData'

const ease = [0.22, 1, 0.36, 1] as const

interface ProjectFiltersProps {
  active: FilterStatus
  onChange: (filter: FilterStatus) => void
}

export default function ProjectFilters({ active, onChange }: ProjectFiltersProps) {
  return (
    <div className="flex items-center gap-6 overflow-x-auto pb-1 scrollbar-none">
      {filterStatuses.map((f) => (
        <button
          key={f.value}
          onClick={() => onChange(f.value)}
          className="relative shrink-0"
        >
          <span
            className={`text-[11px] font-mono uppercase tracking-[0.16em] transition-colors duration-200 ${
              active === f.value ? 'text-[#F5F7F2]' : 'text-[#555B55] hover:text-[#8A8F89]'
            }`}
          >
            {f.label}
          </span>
          {active === f.value && (
            <motion.div
              layoutId="project-filter"
              className="absolute -bottom-1 left-0 right-0 h-[1px] bg-[#B6F34A]"
              transition={{ duration: 0.25, ease }}
            />
          )}
        </button>
      ))}
    </div>
  )
}
