import { useState } from 'react'
import { motion } from 'framer-motion'
import type { GraveyardProject } from '../data/graveyardData'
import GraveyardProjectVisual from './GraveyardProjectVisual'

const ease = [0.22, 1, 0.36, 1] as const

interface GraveyardCardProps {
  project: GraveyardProject
  index: number
  onSelect: (project: GraveyardProject) => void
}

export default function GraveyardCard({ project, index, onSelect }: GraveyardCardProps) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-20px' }}
      transition={{ delay: index * 0.05, duration: 0.5, ease }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onSelect(project)}
      className="group relative cursor-pointer"
    >
      {/* Card */}
      <motion.div
        animate={{
          y: isHovered ? -4 : 0,
          borderColor: isHovered ? 'rgba(245,247,242,0.12)' : 'rgba(245,247,242,0.06)',
        }}
        transition={{ duration: 0.3, ease }}
        className="border bg-white/[0.015] overflow-hidden"
      >
        {/* Visual area */}
        <div className="relative h-[180px] bg-gradient-to-b from-white/[0.03] to-transparent overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center p-4">
            <GraveyardProjectVisual type={project.visualType} isHovered={isHovered} />
          </div>

          {/* Reason badge - top right */}
          <div className="absolute top-4 right-4">
            <motion.span
              animate={{ opacity: isHovered ? 1 : 0.6 }}
              className="text-[9px] font-mono uppercase tracking-[0.15em] text-[#B6F34A] bg-[#080A08]/80 px-2 py-1 backdrop-blur-sm"
            >
              {project.reasonLabel}
            </motion.span>
          </div>

          {/* Duration - bottom left */}
          <div className="absolute bottom-4 left-4">
            <span className="text-[10px] font-mono text-[#303530]">
              {project.duration}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-5">
          {/* Builder line */}
          <div className="flex items-center gap-2 mb-2">
            <span className="w-4 h-4 rounded-full bg-white/[0.06] flex items-center justify-center text-[7px] font-mono text-[#8A8F89]">
              {project.builder.avatar}
            </span>
            <span className="text-[11px] text-[#555B55]">@{project.builder.username}</span>
          </div>

          {/* Name */}
          <h3 className="text-[18px] font-black tracking-[-0.03em] text-[#F5F7F2] mb-1.5 group-hover:text-[#B6F34A] transition-colors duration-300">
            {project.name}
          </h3>

          {/* Short description */}
          <p className="text-[12px] text-[#8A8F89] line-clamp-2 mb-4 leading-relaxed">
            {project.description}
          </p>

          {/* Tech tags */}
          <div className="flex flex-wrap gap-1 mb-4">
            {project.technologies.slice(0, 3).map((tech) => (
              <span key={tech} className="text-[9px] text-[#303530] border border-white/[0.04] px-1.5 py-0.5 font-mono">
                {tech}
              </span>
            ))}
            {project.technologies.length > 3 && (
              <span className="text-[9px] text-[#303530] px-1">
                +{project.technologies.length - 3}
              </span>
            )}
          </div>

          {/* Bottom line */}
          <div className="flex items-center justify-between pt-3 border-t border-white/[0.04]">
            <span className="text-[10px] text-[#303530] font-mono">
              {project.abandonedAt}
            </span>
            <motion.span
              animate={{ x: isHovered ? 4 : 0, color: isHovered ? '#B6F34A' : '#555B55' }}
              transition={{ duration: 0.2, ease }}
              className="text-[10px] font-mono uppercase tracking-[0.1em]"
            >
              Explore →
            </motion.span>
          </div>
        </div>
      </motion.div>
    </motion.article>
  )
}
