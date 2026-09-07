import { motion } from 'framer-motion'
import { Link } from 'react-router'
import type { DiscoverProject } from '../data/discoverData'
import ProjectStatus from './ProjectStatus'

const ease = [0.22, 1, 0.36, 1] as const

interface RecentlyShippedSectionProps {
  projects: DiscoverProject[]
}

export default function RecentlyShippedSection({ projects }: RecentlyShippedSectionProps) {
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
            RECENTLY SHIPPED
          </span>
          <div className="flex-1 h-[1px] bg-white/[0.04]" />
        </div>
        <p className="text-[14px] text-[#555B55] mb-10">Freshly finished. Still warm.</p>

        <div className="space-y-0">
          {projects.map((project, i) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, x: -12 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06, duration: 0.5, ease }}
            >
              <Link
                to={`/projects/${project.id}`}
                className="flex items-start gap-6 py-6 border-b border-white/[0.04] group"
              >
                {/* Number */}
                <span className="text-[11px] font-mono text-[#303530] mt-1 shrink-0 w-6">
                  {String(i + 1).padStart(2, '0')}
                </span>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1">
                    <h4 className="text-[18px] font-bold tracking-[-0.03em] text-[#F5F7F2] group-hover:text-[#B6F34A] transition-colors duration-300">
                      {project.name}
                    </h4>
                  </div>
                  <p className="text-[13px] text-[#8A8F89] line-clamp-1 mb-2">{project.description}</p>
                  <div className="flex items-center gap-3 text-[11px] text-[#555B55]">
                    <span>@{project.builder.username}</span>
                    <span className="text-white/[0.08]">·</span>
                    <ProjectStatus status={project.status} />
                    {project.shippedAt && (
                      <>
                        <span className="text-white/[0.08]">·</span>
                        <span className="font-mono uppercase tracking-wider">{project.shippedAt}</span>
                      </>
                    )}
                  </div>
                </div>

                {/* Tech */}
                <div className="hidden md:flex items-center gap-2 shrink-0">
                  {project.technologies.slice(0, 2).map((tech) => (
                    <span key={tech} className="text-[10px] font-mono text-[#303530]">{tech}</span>
                  ))}
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  )
}
