import { useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router'
import type { DiscoverProject } from '../data/discoverData'
import DiscoverProjectVisual from './DiscoverProjectVisual'
import ProjectStatus from './ProjectStatus'

const ease = [0.22, 1, 0.36, 1] as const

interface InterestingProjectsSectionProps {
  projects: DiscoverProject[]
}

export default function InterestingProjectsSection({ projects }: InterestingProjectsSectionProps) {
  const [hovered, setHovered] = useState<string | null>(null)

  return (
    <section className="py-16 md:py-24 border-t border-white/[0.06]">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.7, ease }}
      >
        <div className="flex items-center gap-3 mb-3">
          <span className="text-[10px] uppercase tracking-[0.3em] text-[#B6F34A] font-mono font-medium">
            INTERESTING PROJECTS
          </span>
          <div className="flex-1 h-[1px] bg-white/[0.04]" />
        </div>
        <p className="text-[14px] text-[#555B55] mb-10">A few projects that made us stop scrolling.</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {projects.map((project, i) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.6, ease }}
            >
              <Link
                to={`/projects/${project.id}`}
                onMouseEnter={() => setHovered(project.id)}
                onMouseLeave={() => setHovered(null)}
                className="block border border-white/[0.06] relative group overflow-hidden h-full"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-[#B6F34A]/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                {/* Visual */}
                <div className="h-[160px] relative bg-white/[0.01] border-b border-white/[0.04]">
                  <DiscoverProjectVisual type={project.visual} isHovered={hovered === project.id} />
                </div>

                <div className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-[18px] font-bold tracking-[-0.03em] text-[#F5F7F2] group-hover:text-[#B6F34A] transition-colors duration-300">
                      {project.name}
                    </h4>
                    <ProjectStatus status={project.status} />
                  </div>
                  <p className="text-[13px] text-[#8A8F89] leading-relaxed line-clamp-2 mb-4">
                    {project.description}
                  </p>
                  <div className="flex items-center justify-between pt-3 border-t border-white/[0.04]">
                    <span className="text-[11px] text-[#555B55]">@{project.builder.username}</span>
                    <div className="flex items-center gap-2">
                      {project.technologies.slice(0, 2).map((tech) => (
                        <span key={tech} className="text-[10px] font-mono text-[#303530]">{tech}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  )
}
