import { useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router'
import { Star, ExternalLink } from 'lucide-react'
import type { DiscoverProject } from '../data/discoverData'
import DiscoverProjectVisual from './DiscoverProjectVisual'

const ease = [0.22, 1, 0.36, 1] as const

interface DiscoverProjectCardProps {
  project: DiscoverProject
  index: number
}

export default function DiscoverProjectCard({ project, index }: DiscoverProjectCardProps) {
  const [hovered, setHovered] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileTap={{ scale: 0.98 }}
      transition={{ delay: index * 0.05, duration: 0.5, ease }}
    >
      <Link
        to={`/projects/${project.id}`}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className="block border border-white/[0.06] relative group overflow-hidden h-full"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-[#B6F34A]/[0.03] via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

        <div className="absolute inset-0 border border-transparent group-hover:border-[#B6F34A]/20 transition-colors duration-500 pointer-events-none" />

        <div className="h-[100px] sm:h-[140px] relative bg-white/[0.01] border-b border-white/[0.04] overflow-hidden">
          <DiscoverProjectVisual type={project.visual} isHovered={hovered} />
        </div>

        <div className="p-5">
          <div className="flex items-start justify-between gap-3 mb-2">
            <h3 className="text-[16px] font-bold tracking-[-0.02em] text-[#F5F7F2] group-hover:text-[#B6F34A] transition-colors duration-300 min-w-0">
              {project.name}
            </h3>
            <span className={`shrink-0 flex items-center gap-1.5 text-[9px] uppercase tracking-[0.15em] font-mono ${project.status === 'BUILDING' ? 'text-[#B6F34A]' : 'text-[#555B55]'}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${project.status === 'BUILDING' ? 'bg-[#B6F34A]' : 'bg-[#555B55]'}`} />
              {project.status}
            </span>
          </div>

          <p className="text-[13px] text-[#8A8F89] leading-relaxed line-clamp-2 mb-3">
            {project.description}
          </p>

          <div className="flex items-center gap-2 text-[11px] text-[#555B55] mb-3">
            <span>@{project.builder.username}</span>
            <span className="text-white/[0.08]">·</span>
            <span className="text-[#303530]">{project.category}</span>
          </div>

          <div className="flex flex-wrap gap-1.5 mb-4">
            {project.technologies.slice(0, 3).map((tech) => (
              <span key={tech} className="text-[10px] font-mono text-[#303530] border border-white/[0.06] px-2 py-0.5">
                {tech}
              </span>
            ))}
            {project.technologies.length > 3 && (
              <span className="text-[10px] font-mono text-[#303530]">+{project.technologies.length - 3}</span>
            )}
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-white/[0.04]">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1 text-[11px] text-[#303530] font-mono">
                <Star className="w-3 h-3" />
                {project.stars}
              </span>
              <span className="text-[10px] text-[#303530] font-mono">{project.updatedAt}</span>
            </div>
            <motion.div
              animate={{ opacity: hovered ? 1 : 0, x: hovered ? 0 : -4 }}
              transition={{ duration: 0.2 }}
            >
              <ExternalLink className="w-3.5 h-3.5 text-[#B6F34A]" />
            </motion.div>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
