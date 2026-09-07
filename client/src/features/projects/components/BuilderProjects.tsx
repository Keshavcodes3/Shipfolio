import { useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router'
import type { ProjectDetail } from '../data/projectDetailData'
import DiscoverProjectVisual from '../../discover/components/DiscoverProjectVisual'

const ease = [0.22, 1, 0.36, 1] as const

interface BuilderProjectsProps {
  projectIds: string[]
  builderUsername: string
  projects: Record<string, ProjectDetail>
}

export default function BuilderProjects({ projectIds, builderUsername, projects }: BuilderProjectsProps) {
  const [hovered, setHovered] = useState<string | null>(null)
  const items = projectIds.map((id) => projects[id]).filter(Boolean)

  if (items.length === 0) return null

  return (
    <section className="py-16 md:py-20 border-b border-white/[0.06]">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease }}
      >
        <span className="text-[10px] uppercase tracking-[0.25em] text-[#B6F34A] font-mono">
          MORE FROM @{builderUsername.toUpperCase()}
        </span>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
          {items.map((project, i) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06, duration: 0.5, ease }}
            >
              <Link
                to={`/projects/${project.id}`}
                onMouseEnter={() => setHovered(project.id)}
                onMouseLeave={() => setHovered(null)}
                className="block border border-white/[0.06] relative group overflow-hidden"
              >
                <div className="h-[100px] relative bg-white/[0.01] border-b border-white/[0.04]">
                  <DiscoverProjectVisual type={project.visual} isHovered={hovered === project.id} />
                </div>
                <div className="p-4">
                  <h4 className="text-[15px] font-bold text-[#F5F7F2] group-hover:text-[#B6F34A] transition-colors duration-300">
                    {project.name}
                  </h4>
                  <p className="text-[12px] text-[#555B55] mt-1 line-clamp-1">{project.description}</p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  )
}
