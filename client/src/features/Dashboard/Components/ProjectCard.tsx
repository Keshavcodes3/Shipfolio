import { useState, useRef } from 'react'
import { motion, useMotionValue, useTransform } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router'
import type { Project } from '../data/dashboardData'

const ease = [0.22, 1, 0.36, 1] as const

const statusColors: Record<string, { dot: string; text: string }> = {
  BUILDING: { dot: 'bg-[#B6F34A]', text: 'text-[#B6F34A]' },
  SHIPPED: { dot: 'bg-[#F5F7F2]', text: 'text-[#F5F7F2]' },
  MAINTAINING: { dot: 'bg-[#8A8F89]', text: 'text-[#8A8F89]' },
  PAUSED: { dot: 'bg-[#555B55]', text: 'text-[#555B55]' },
}

function CardVisual({ type, isHovered }: { type: Project['visual']; isHovered: boolean }) {
  if (type === 'orb') {
    return (
      <div className="absolute top-6 right-6 h-16 w-16">
        <svg viewBox="0 0 64 64" className="w-full h-full" aria-hidden="true">
          <motion.circle
            cx="32"
            cy="32"
            r="24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            className="text-white/[0.06]"
            animate={isHovered ? { r: 26, stroke: 'rgba(245,247,242,0.12)' } : { r: 24, stroke: 'rgba(245,247,242,0.06)' }}
            transition={{ duration: 0.4 }}
          />
          <motion.circle
            cx="32"
            cy="32"
            r="6"
            fill="currentColor"
            className="text-white/[0.04]"
            animate={isHovered ? { r: 8, fill: 'rgba(182,243,74,0.15)' } : { r: 6, fill: 'rgba(245,247,242,0.04)' }}
            transition={{ duration: 0.4 }}
          />
        </svg>
      </div>
    )
  }

  if (type === 'bars') {
    return (
      <div className="absolute bottom-6 right-6 flex gap-[2px] items-end h-12">
        {[20, 32, 14, 38, 24, 30, 18, 34, 22, 16, 28, 12].map((h, i) => (
          <motion.div
            key={i}
            className="w-1 bg-white/[0.04]"
            animate={isHovered ? { height: h, backgroundColor: 'rgba(245,247,242,0.1)' } : { height: h * 0.5, backgroundColor: 'rgba(245,247,242,0.04)' }}
            transition={{ duration: 0.4, delay: i * 0.015 }}
          />
        ))}
      </div>
    )
  }

  if (type === 'grid') {
    return (
      <div className="absolute top-6 right-6 grid grid-cols-3 gap-1" aria-hidden="true">
        {Array.from({ length: 9 }).map((_, i) => (
          <motion.div
            key={i}
            className="w-2.5 h-2.5 bg-white/[0.03]"
            animate={isHovered ? { backgroundColor: i % 3 === 0 ? 'rgba(245,247,242,0.08)' : 'rgba(245,247,242,0.04)' } : { backgroundColor: 'rgba(245,247,242,0.03)' }}
            transition={{ duration: 0.3, delay: i * 0.02 }}
          />
        ))}
      </div>
    )
  }

  if (type === 'pulse') {
    return (
      <div className="absolute top-6 right-6 h-12 w-12" aria-hidden="true">
        <motion.div
          className="h-full w-full rounded-full border border-white/[0.06]"
          animate={isHovered ? { scale: [1, 1.15, 1] } : {}}
          transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute inset-2 rounded-full bg-[#B6F34A]/10"
          animate={isHovered ? { scale: [1, 1.3, 1], opacity: [0.1, 0.2, 0.1] } : {}}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>
    )
  }

  // wave
  return (
    <div className="absolute bottom-6 right-6 h-12 w-20" aria-hidden="true">
      <svg viewBox="0 0 80 48" className="w-full h-full" fill="none">
        <motion.path
          d="M0 24 Q20 8 40 24 Q60 40 80 24"
          stroke="currentColor"
          strokeWidth="1"
          className="text-white/[0.06]"
          animate={isHovered ? { d: 'M0 24 Q20 12 40 24 Q60 36 80 24', stroke: 'rgba(245,247,242,0.12)' } : { d: 'M0 24 Q20 8 40 24 Q60 40 80 24', stroke: 'rgba(245,247,242,0.06)' }}
          transition={{ duration: 0.5 }}
        />
      </svg>
    </div>
  )
}

interface ProjectCardProps {
  project: Project
  index: number
}

export default function ProjectCard({ project, index }: ProjectCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  const rotateX = useTransform(mouseY, [0, 1], [1, -1])
  const rotateY = useTransform(mouseX, [0, 1], [-1, 1])

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    mouseX.set((e.clientX - rect.left) / rect.width)
    mouseY.set((e.clientY - rect.top) / rect.height)
  }

  const colors = statusColors[project.status] ?? statusColors.PAUSED

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-5%' }}
      transition={{ duration: 0.6, delay: index * 0.08, ease }}
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
      <CardVisual type={project.visual} isHovered={isHovered} />

      <div className="relative p-5">
        {/* Status */}
        <div className="flex items-center gap-2 mb-3">
          <span className={`h-1.5 w-1.5 rounded-full ${colors.dot}`} />
          <span className={`text-[10px] font-mono tracking-wider ${colors.text}`}>
            {project.status}
          </span>
        </div>

        {/* Name */}
        <h3 className="text-[18px] font-bold tracking-tight text-[#F5F7F2] mb-2">
          {project.name}
        </h3>

        {/* Description */}
        <p className="text-[13px] text-[#8A8F89] leading-relaxed mb-4 line-clamp-2">
          {project.description}
        </p>

        {/* Tech */}
        <div className="flex flex-wrap gap-1 mb-5">
          {project.technologies.map((tech) => (
            <span
              key={tech}
              className="px-2 py-0.5 text-[9px] font-mono text-[#555B55] border border-white/[0.05]"
            >
              {tech}
            </span>
          ))}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-white/[0.06] pt-3">
          <span className="text-[11px] text-[#303530]">{project.updatedAt}</span>
          <motion.div
            animate={isHovered ? { x: 2 } : { x: 0 }}
            transition={{ duration: 0.2 }}
          >
            <ArrowUpRight className="h-3.5 w-3.5 text-[#555B55] group-hover:text-[#F5F7F2] transition-colors duration-200" />
          </motion.div>
        </div>
      </div>
    </motion.div>
  )
}
