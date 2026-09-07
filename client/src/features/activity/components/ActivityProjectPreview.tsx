import { Link } from 'react-router'
import type { ActivityProject } from '../types/activity'
import DiscoverProjectVisual from '../../discover/components/DiscoverProjectVisual'

interface ActivityProjectPreviewProps {
  project: ActivityProject
}

const statusColors: Record<string, string> = {
  SHIPPED: 'text-[#B6F34A]',
  BUILDING: 'text-[#B6F34A]',
  MAINTAINING: 'text-[#8A8F89]',
  PAUSED: 'text-[#555B55]',
}

export default function ActivityProjectPreview({ project }: ActivityProjectPreviewProps) {
  return (
    <Link
      to={`/projects/${project.id}`}
      className="block border border-white/[0.06] bg-white/[0.015] group hover:border-[#B6F34A]/20 transition-colors duration-300"
    >
      <div className="h-[80px] relative bg-white/[0.01] border-b border-white/[0.04]">
        <DiscoverProjectVisual type={project.visual} />
      </div>
      <div className="p-4">
        <div className="flex items-center justify-between mb-1">
          <h4 className="text-[14px] font-bold text-[#F5F7F2] group-hover:text-[#B6F34A] transition-colors duration-200">
            {project.name}
          </h4>
          <span className={`text-[10px] font-mono uppercase tracking-[0.12em] ${statusColors[project.status] ?? 'text-[#555B55]'}`}>
            {project.status}
          </span>
        </div>
        <p className="text-[12px] text-[#555B55] line-clamp-1 mb-2">{project.description}</p>
        <div className="flex flex-wrap gap-1.5">
          {project.technologies.map((tech) => (
            <span key={tech} className="text-[10px] text-[#303530] border border-white/[0.06] px-2 py-0.5 font-mono">
              {tech}
            </span>
          ))}
        </div>
      </div>
    </Link>
  )
}
