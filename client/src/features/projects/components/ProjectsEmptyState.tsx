import { Plus } from 'lucide-react'
import { Link } from 'react-router'
import type { FilterStatus } from '../data/projectData'

const emptyMessages: Record<FilterStatus, { title: string; subtitle: string }> = {
  ALL: { title: 'NOTHING HERE YET.', subtitle: 'Time to build something.' },
  BUILDING: { title: 'NOT BUILDING ANYTHING PUBLIC YET.', subtitle: 'That probably won\'t last.' },
  SHIPPED: { title: 'NOTHING SHIPPED YET.', subtitle: 'The first one is usually the hardest.' },
  MAINTAINING: { title: 'NOTHING MAINTAINING.', subtitle: 'Fresh ships only.' },
  PAUSED: { title: 'NOTHING PAUSED.', subtitle: 'Enjoy the rare moment of momentum.' },
  ARCHIVED: { title: 'NOTHING ARCHIVED.', subtitle: 'Everything is still alive somewhere.' },
}

interface ProjectsEmptyStateProps {
  filter: FilterStatus
}

export default function ProjectsEmptyState({ filter }: ProjectsEmptyStateProps) {
  const msg = emptyMessages[filter]

  return (
    <div className="col-span-full flex flex-col items-center justify-center py-20 text-center">
      <p className="text-[13px] font-mono uppercase tracking-[0.2em] text-[#F5F7F2] mb-2">
        {msg.title}
      </p>
      <p className="text-[13px] text-[#555B55] mb-6">
        {msg.subtitle}
      </p>
      <Link
        to="/projects/new"
        className="relative group inline-flex items-center gap-2 px-5 py-2.5 text-[11px] font-medium uppercase tracking-[0.1em] text-[#080A08] overflow-hidden"
      >
        <div className="absolute inset-0 bg-[#B6F34A] transition-all duration-300 group-hover:bg-[#c8ff66]" />
        <span className="relative z-10 flex items-center gap-2">
          <Plus className="w-3.5 h-3.5" />
          New project
        </span>
      </Link>
    </div>
  )
}
