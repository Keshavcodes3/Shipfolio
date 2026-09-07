import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router'
import type { ProfileProject } from '../data/profileData'
import ProjectVisual from './ProjectVisual'

const ease = [0.22, 1, 0.36, 1] as const

export default function ProfileProjectCard({ project, index }: { project: ProfileProject; index: number }) {
  const [hovered, setHovered] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-30px' }}
      transition={{ delay: index * 0.08, duration: 0.5, ease }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="border border-white/[0.05] hover:border-white/[0.1] relative group overflow-hidden transition-colors duration-300"
    >
      <Link
        to={project.id ? `/showcase/${project.id}` : '#'}
        className="absolute inset-0 z-10"
      />

      {/* Hover glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#B6F34A]/[0.02] via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

      {/* Visual */}
      <div className="h-[100px] flex items-center justify-center border-b border-white/[0.04] bg-white/[0.01] relative overflow-hidden">
        <motion.div animate={{ scale: hovered ? 1.05 : 1 }} transition={{ duration: 0.4, ease }} className="w-[120px] h-[90px]">
          <ProjectVisual name={project.name} />
        </motion.div>
      </div>

      <div className="p-4">
        {/* Status + Arrow */}
        <div className="flex items-center justify-between mb-2">
          <span className="flex items-center gap-1.5 text-[9px] uppercase tracking-[0.15em] font-mono">
            <motion.span animate={project.status === 'BUILDING' ? { opacity: [1, 0.4, 1] } : {}} transition={{ duration: 1.5, repeat: Infinity }}
              className={`w-1.5 h-1.5 rounded-full ${project.status === 'BUILDING' ? 'bg-[#B6F34A]' : project.status === 'SHIPPED' ? 'bg-[#8A8F89]' : 'bg-[#555B55]'}`} />
            <span className={project.status === 'BUILDING' ? 'text-[#B6F34A]' : 'text-[#555B55]'}>{project.status}</span>
          </span>
          <motion.div initial={{ opacity: 0, x: -4 }} animate={{ opacity: hovered ? 1 : 0, x: hovered ? 0 : -4 }} transition={{ duration: 0.2 }}>
            <ArrowUpRight className="w-3.5 h-3.5 text-[#B6F34A]" />
          </motion.div>
        </div>

        {/* Name */}
        <h4 className="text-[15px] font-bold tracking-[-0.02em] text-[#F5F7F2] group-hover:text-[#B6F34A] transition-colors duration-300 mb-1">
          {project.name}
        </h4>

        {/* Description */}
        <p className="text-[11px] text-[#555B55] leading-relaxed line-clamp-2 mb-3">{project.description}</p>

        {/* Tech */}
        <div className="flex items-center gap-2">
          {project.technologies.slice(0, 3).map(tech => (
            <span key={tech} className="text-[9px] text-[#303530] font-mono">{tech}</span>
          ))}
        </div>
      </div>
    </motion.div>
  )
}
