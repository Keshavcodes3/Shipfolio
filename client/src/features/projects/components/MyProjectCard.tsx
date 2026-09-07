import { useState, useRef } from 'react'
import { motion, useMotionValue, useTransform } from 'framer-motion'
import { ArrowUpRight, HelpCircle } from 'lucide-react'
import { Link } from 'react-router'
import type { MyProject } from '../data/projectData'
import ProjectVisual from './ProjectVisual'
import ProjectStatus from './ProjectStatus'

const ease = [0.22, 1, 0.36, 1] as const

interface MyProjectCardProps {
  project: MyProject
  index: number
}

export default function MyProjectCard({ project, index }: MyProjectCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  const rotateX = useTransform(mouseY, [0, 1], [0.5, -0.5])
  const rotateY = useTransform(mouseX, [0, 1], [-0.5, 0.5])

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    mouseX.set((e.clientX - rect.left) / rect.width)
    mouseY.set((e.clientY - rect.top) / rect.height)
  }

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.5, delay: index * 0.06, ease }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ rotateX, rotateY, transformPerspective: 1200 }}
      className="group relative border border-white/[0.06] bg-white/[0.015] hover:border-white/[0.12] transition-[border-color] duration-300 overflow-hidden"
    >
      <Link
        to={`/projects/${project.id}`}
        className="absolute inset-0 z-10"
      />

      {/* Visual area */}
      <div className="relative h-[180px] border-b border-white/[0.04]">
        <ProjectVisual type={project.visual} isHovered={isHovered} />

        {/* Private badge */}
        {project.visibility === 'PRIVATE' && (
          <div className="absolute top-4 right-4 z-20">
            <span className="text-[9px] font-mono uppercase tracking-wider text-[#555B55] border border-white/[0.08] px-2 py-0.5">
              PRIVATE
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="relative p-5">
        {/* Name + Status row */}
        <div className="flex items-start justify-between gap-3 mb-2.5">
          <h3 className="text-[16px] font-bold tracking-tight text-[#F5F7F2] leading-tight">
            {project.name}
          </h3>
          <div className="shrink-0 mt-0.5">
            <ProjectStatus
              status={project.status}
              isCurrentlyBuilding={project.isCurrentlyBuilding}
            />
          </div>
        </div>

        {/* Description */}
        <p className="text-[13px] text-[#8A8F89] leading-relaxed mb-4 line-clamp-2">
          {project.description}
        </p>

        {/* Metadata: tech + year + needs + arrow */}
        <div className="flex items-center justify-between">
          <div className="flex flex-wrap gap-1.5 items-center">
            {project.technologies.map((tech) => (
              <span
                key={tech}
                className="px-2 py-0.5 text-[9px] font-mono text-[#555B55] border border-white/[0.05]"
              >
                {tech}
              </span>
            ))}
            {(project.needsCount ?? 0) > 0 && (
              <span className="flex items-center gap-1 px-2 py-0.5 text-[9px] font-mono text-[#B6F34A] border border-[#B6F34A]/20">
                <HelpCircle className="w-2.5 h-2.5" />
                {project.needsCount} needs
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 shrink-0 ml-3">
            <span className="text-[11px] text-[#303530] font-mono">{project.year}</span>
            <motion.div
              animate={isHovered ? { x: 3 } : { x: 0 }}
              transition={{ duration: 0.2, ease }}
            >
              <ArrowUpRight className="h-3.5 w-3.5 text-[#303530] group-hover:text-[#8A8F89] transition-colors duration-200" />
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
