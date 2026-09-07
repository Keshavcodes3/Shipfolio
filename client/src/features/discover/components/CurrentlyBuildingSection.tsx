import { useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router'
import type { DiscoverProject } from '../data/discoverData'
import DiscoverProjectVisual from './DiscoverProjectVisual'
import ProjectStatus from './ProjectStatus'

const ease = [0.22, 1, 0.36, 1] as const

interface CurrentlyBuildingSectionProps {
  projects: DiscoverProject[]
}

export default function CurrentlyBuildingSection({ projects }: CurrentlyBuildingSectionProps) {
  const [hovered, setHovered] = useState(false)
  const [hoveredSecondary, setHoveredSecondary] = useState<string | null>(null)
  const featured = projects[0]
  const secondary = projects.slice(1, 3)

  if (!featured) return null

  return (
    <section className="py-16 md:py-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.7, ease }}
      >
        <div className="flex items-center gap-3 mb-3">
          <span className="text-[10px] uppercase tracking-[0.3em] text-[#B6F34A] font-mono font-medium">
            CURRENTLY BUILDING
          </span>
          <div className="flex-1 h-[1px] bg-white/[0.04]" />
        </div>
        <p className="text-[14px] text-[#555B55] mb-10">Things that are still becoming.</p>

        {/* Featured card */}
        <Link
          to={`/projects/${featured.id}`}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          className="block border border-white/[0.06] relative group overflow-hidden mb-4"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-[#B6F34A]/[0.02] via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

          {/* Visual */}
          <div className="h-[200px] md:h-[280px] relative bg-white/[0.01] border-b border-white/[0.04]">
            <DiscoverProjectVisual type={featured.visual} isHovered={hovered} />
          </div>

          <div className="p-6 md:p-8">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-[clamp(1.5rem,3vw,2.5rem)] font-black tracking-[-0.04em] text-[#F5F7F2]">
                    {featured.name}
                  </h3>
                  <ProjectStatus status={featured.status} />
                </div>
                <p className="text-[14px] text-[#8A8F89] leading-relaxed max-w-[480px] mb-4">
                  {featured.description}
                </p>
                <div className="flex items-center gap-3 text-[11px] text-[#555B55]">
                  <span>@{featured.builder.username}</span>
                  <span className="text-white/[0.08]">·</span>
                  <span className="font-mono">{featured.technologies.slice(0, 3).join(' · ')}</span>
                </div>
              </div>
            </div>
          </div>
        </Link>

        {/* Secondary cards */}
        {secondary.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {secondary.map((project) => (
              <Link
                key={project.id}
                to={`/projects/${project.id}`}
                onMouseEnter={() => setHoveredSecondary(project.id)}
                onMouseLeave={() => setHoveredSecondary(null)}
                className="border border-white/[0.06] relative group overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-[#B6F34A]/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                <div className="h-[120px] relative bg-white/[0.01] border-b border-white/[0.04]">
                  <DiscoverProjectVisual type={project.visual} isHovered={hoveredSecondary === project.id} />
                </div>

                <div className="p-5">
                  <div className="flex items-center justify-between mb-1.5">
                    <h4 className="text-[18px] font-bold tracking-[-0.03em] text-[#F5F7F2]">
                      {project.name}
                    </h4>
                    <ProjectStatus status={project.status} />
                  </div>
                  <p className="text-[13px] text-[#8A8F89] line-clamp-1 mb-3">{project.description}</p>
                  <div className="flex items-center gap-2 text-[11px] text-[#555B55]">
                    <span>@{project.builder.username}</span>
                    <span className="text-white/[0.08]">·</span>
                    <span className="font-mono">{project.technologies.slice(0, 2).join(' · ')}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </motion.div>
    </section>
  )
}
