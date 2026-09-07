import { motion } from 'framer-motion'
import { Link } from 'react-router'
import type { SearchProject } from '../types/search'

const ease = [0.22, 1, 0.36, 1] as const

interface ProjectSearchCardProps {
  project: SearchProject
  index: number
  isSelected?: boolean
}

export default function ProjectSearchCard({ project, index, isSelected }: ProjectSearchCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.03, duration: 0.3, ease }}
    >
      <Link
        to={`/projects/${project.id}`}
        className={`block border border-white/[0.06] p-5 transition-colors duration-200 ${
          isSelected
            ? 'bg-[#B6F34A]/[0.04] border-[#B6F34A]/20'
            : 'bg-white/[0.015] hover:bg-white/[0.03] hover:border-white/[0.1]'
        }`}
      >
        <div className="flex items-start justify-between mb-2">
          <h4 className="text-[15px] font-bold text-[#F5F7F2] tracking-[-0.02em]">
            {project.name}
          </h4>
          <span className="text-[10px] font-mono uppercase tracking-[0.12em] text-[#303530] shrink-0 ml-3">
            Project
          </span>
        </div>
        <p className="text-[13px] text-[#8A8F89] mb-3 line-clamp-2">{project.description}</p>
        <div className="flex flex-wrap gap-1.5 mb-3">
          {project.technologies.slice(0, 4).map((tech) => (
            <span key={tech} className="text-[10px] text-[#555B55] border border-white/[0.06] px-2 py-0.5 font-mono">
              {tech}
            </span>
          ))}
        </div>
        <div className="flex items-center gap-2 text-[11px] text-[#555B55]">
          <span>@{project.builder.username}</span>
          <span className="text-white/[0.08]">·</span>
          <span>{project.stars} stars</span>
        </div>
      </Link>
    </motion.div>
  )
}
