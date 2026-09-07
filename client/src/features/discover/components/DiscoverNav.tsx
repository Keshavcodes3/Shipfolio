import { motion } from 'framer-motion'

const ease = [0.22, 1, 0.36, 1] as const

const categories = [
  { id: 'all', label: 'ALL' },
  { id: 'building', label: 'BUILDING' },
  { id: 'shipped', label: 'SHIPPED' },
  { id: 'projects', label: 'PROJECTS' },
  { id: 'builders', label: 'BUILDERS' },
  { id: 'technologies', label: 'TECHNOLOGIES' },
]

interface DiscoverNavProps {
  active: string
  onChange: (id: string) => void
}

export default function DiscoverNav({ active, onChange }: DiscoverNavProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.5, ease }}
      className="flex items-center gap-6 overflow-x-auto pb-1 scrollbar-none border-b border-white/[0.06] mb-8"
    >
      {categories.map((cat) => (
        <button
          key={cat.id}
          onClick={() => onChange(cat.id)}
          className="relative shrink-0 py-3"
        >
          <span
            className={`text-[11px] font-mono uppercase tracking-[0.16em] transition-colors duration-200 ${
              active === cat.id ? 'text-[#F5F7F2]' : 'text-[#555B55] hover:text-[#8A8F89]'
            }`}
          >
            {cat.label}
          </span>
          {active === cat.id && (
            <motion.div
              layoutId="discover-nav"
              className="absolute bottom-0 left-0 right-0 h-[1px] bg-[#B6F34A]"
              transition={{ duration: 0.25, ease }}
            />
          )}
        </button>
      ))}
    </motion.div>
  )
}
