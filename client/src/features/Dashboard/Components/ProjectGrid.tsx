import { motion } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router'
import { useMyProjects } from '../data/dashboardHooks'

const ease = [0.22, 1, 0.36, 1] as const

export default function ProjectGrid() {
  const { data: projects, isLoading } = useMyProjects()

  if (isLoading) {
    return (
      <section className="px-6 pb-10 md:px-8">
        <div className="flex items-center gap-2 mb-5">
          <span className="text-[10px] uppercase tracking-[0.25em] text-[#555B55] font-mono">Loading projects...</span>
        </div>
      </section>
    )
  }

  if (!projects || projects.length === 0) return null

  const statusColors: Record<string, { dot: string; text: string }> = {
    BUILDING: { dot: 'bg-[#B6F34A]', text: 'text-[#B6F34A]' },
    SHIPPED: { dot: 'bg-[#F5F7F2]', text: 'text-[#F5F7F2]' },
    MAINTAINING: { dot: 'bg-[#8A8F89]', text: 'text-[#8A8F89]' },
    PAUSED: { dot: 'bg-[#555B55]', text: 'text-[#555B55]' },
    ARCHIVED: { dot: 'bg-[#303530]', text: 'text-[#303530]' },
  }

  const timeAgo = (date: string) => {
    const diff = Date.now() - new Date(date).getTime()
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    if (days === 0) return 'today'
    if (days === 1) return 'yesterday'
    return `${days}d ago`
  }

  return (
    <section className="px-6 pb-10 md:px-8">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.7, ease }}
        className="flex items-center justify-between mb-5"
      >
        <h2 className="text-[11px] uppercase tracking-[0.25em] text-[#555B55] font-mono">
          Your projects
        </h2>
        <Link
          to="/projects"
          className="group flex items-center gap-1.5 text-[12px] text-[#8A8F89] hover:text-[#F5F7F2] transition-colors duration-200"
        >
          View all
          <ArrowUpRight className="h-3 w-3 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </Link>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {projects.slice(0, 4).map((project, i) => {
          const colors = statusColors[project.status] ?? statusColors.PAUSED

          return (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-5%' }}
              transition={{ duration: 0.6, delay: i * 0.08, ease }}
              className="group relative border border-white/[0.06] bg-white/[0.015] hover:border-white/[0.12] transition-[border-color] duration-300 overflow-hidden"
            >
              <Link
                to={`/projects/${project.id}`}
                className="absolute inset-0 z-10"
              />

              <div className="relative p-5">
                <div className="flex items-center gap-2 mb-3">
                  <span className={`h-1.5 w-1.5 rounded-full ${colors.dot}`} />
                  <span className={`text-[10px] font-mono tracking-wider ${colors.text}`}>
                    {project.status}
                  </span>
                  {project.isCurrentlyBuilding && (
                    <span className="h-1.5 w-1.5 rounded-full bg-[#B6F34A] animate-pulse" />
                  )}
                </div>

                <h3 className="text-[18px] font-bold tracking-tight text-[#F5F7F2] mb-2">
                  {project.name}
                </h3>

                {project.description && (
                  <p className="text-[13px] text-[#8A8F89] leading-relaxed mb-4 line-clamp-2">
                    {project.description}
                  </p>
                )}

                {project.technologies.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-5">
                    {project.technologies.map((tech) => (
                      <span
                        key={tech.name}
                        className="px-2 py-0.5 text-[9px] font-mono text-[#555B55] border border-white/[0.05]"
                      >
                        {tech.name}
                      </span>
                    ))}
                  </div>
                )}

                <div className="flex items-center justify-between border-t border-white/[0.06] pt-3">
                  <span className="text-[11px] text-[#303530]">
                    {timeAgo(project.updatedAt)}
                  </span>
                  <motion.div
                    whileHover={{ x: 2 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ArrowUpRight className="h-3.5 w-3.5 text-[#555B55] group-hover:text-[#F5F7F2] transition-colors duration-200" />
                  </motion.div>
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>
    </section>
  )
}
