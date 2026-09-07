import { useState } from 'react'
import { motion } from 'framer-motion'

const ease = [0.22, 1, 0.36, 1] as const

const sections = [
  { id: 'overview', label: 'OVERVIEW' },
  { id: 'story', label: 'STORY' },
  { id: 'stack', label: 'STACK' },
  { id: 'activity', label: 'ACTIVITY' },
  { id: 'builder', label: 'BUILDER' },
]

export default function ProjectNavigation() {
  const [active, setActive] = useState('overview')

  const scrollTo = (id: string) => {
    setActive(id)
    const el = document.getElementById(`project-${id}`)
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <nav className="sticky top-0 z-40 bg-[#080A08]/90 backdrop-blur-sm border-b border-white/[0.06]">
      <div className="flex items-center gap-6 overflow-x-auto scrollbar-none px-5 md:px-8">
        {sections.map((s) => (
          <button
            key={s.id}
            onClick={() => scrollTo(s.id)}
            className="relative shrink-0 py-3"
          >
            <span
              className={`text-[11px] font-mono uppercase tracking-[0.16em] transition-colors duration-200 ${
                active === s.id ? 'text-[#F5F7F2]' : 'text-[#555B55] hover:text-[#8A8F89]'
              }`}
            >
              {s.label}
            </span>
            {active === s.id && (
              <motion.div
                layoutId="project-nav"
                className="absolute bottom-0 left-0 right-0 h-[1px] bg-[#B6F34A]"
                transition={{ duration: 0.25, ease }}
              />
            )}
          </button>
        ))}
      </div>
    </nav>
  )
}
