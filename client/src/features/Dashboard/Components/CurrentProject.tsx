import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router'
import { useMyProjects } from '../data/dashboardHooks'

const ease = [0.22, 1, 0.36, 1] as const

function ProjectVisual() {
  const barHeights = useMemo(
    () => Array.from({ length: 24 }, (_, i) => 6 + ((i * 5 + 11) % 20)),
    [],
  )

  return (
    <div className="relative h-[140px] w-full overflow-hidden">
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(245,247,242,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(245,247,242,0.5) 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }}
      />

      <div className="absolute bottom-0 left-0 right-0 flex gap-[3px] items-end h-20 px-4">
        {barHeights.map((h, i) => (
          <motion.div
            key={i}
            className="flex-1 bg-white/[0.04]"
            initial={{ height: 2 }}
            animate={{ height: h }}
            transition={{ duration: 0.6, delay: 0.6 + i * 0.02, ease }}
          />
        ))}
      </div>

      <motion.div
        initial={{ width: 0 }}
        animate={{ width: '60%' }}
        transition={{ duration: 1.2, delay: 1, ease }}
        className="absolute bottom-0 left-0 h-[2px] bg-[#B6F34A]/40"
      />

      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 1.2, ease }}
        className="absolute right-8 top-6"
      >
        <motion.div
          animate={{ y: [0, -3, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          className="h-2 w-2 rounded-full bg-[#B6F34A]"
        />
      </motion.div>
    </div>
  )
}

export default function CurrentProject() {
  const { data: projects } = useMyProjects()
  const currentProject = projects?.find((p) => p.isCurrentlyBuilding)

  if (!currentProject) {
    return (
      <section className="px-6 pb-8 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5, ease }}
        >
          <div className="flex items-center gap-2 mb-5">
            <span className="text-[10px] uppercase tracking-[0.25em] text-[#555B55] font-mono">
              No project in progress
            </span>
          </div>
          <div className="border border-dashed border-white/[0.06] bg-white/[0.015] p-8 text-center">
            <p className="text-[13px] text-[#8A8F89] mb-4">
              Start a new project to see it here.
            </p>
            <Link
              to="/projects/new"
              className="inline-flex items-center gap-2 text-[12px] text-[#B6F34A] hover:text-[#B6F34A]/80 transition-colors"
            >
              Create project →
            </Link>
          </div>
        </motion.div>
      </section>
    )
  }

  const timeAgo = (date: string) => {
    const diff = Date.now() - new Date(date).getTime()
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    if (days === 0) return 'today'
    if (days === 1) return 'yesterday'
    return `${days} days ago`
  }

  return (
    <section className="px-6 pb-8 md:px-8">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.5, ease }}
      >
        <div className="flex items-center gap-2 mb-5">
          <span className="h-1.5 w-1.5 rounded-full bg-[#B6F34A] animate-pulse" />
          <span className="text-[10px] uppercase tracking-[0.25em] text-[#555B55] font-mono">
            Currently building
          </span>
        </div>

        <div className="group border border-white/[0.06] bg-white/[0.015] hover:border-white/[0.1] transition-colors duration-300">
          <ProjectVisual />

          <div className="p-6">
            <div className="flex items-start justify-between mb-3">
              <h3 className="text-[22px] font-bold tracking-tight text-[#F5F7F2]">
                {currentProject.name}
              </h3>
              <span className="text-[10px] font-mono tracking-wider text-[#B6F34A] mt-1.5">
                {currentProject.status}
              </span>
            </div>

            {currentProject.description && (
              <p className="text-[14px] text-[#8A8F89] leading-relaxed mb-5 max-w-lg">
                {currentProject.description}
              </p>
            )}

            {currentProject.technologies.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mb-5">
                {currentProject.technologies.map((tech) => (
                  <span
                    key={tech.name}
                    className="px-2.5 py-1 text-[10px] font-mono text-[#8A8F89] border border-white/[0.06] bg-white/[0.02]"
                  >
                    {tech.name}
                  </span>
                ))}
              </div>
            )}

            <div className="flex items-center justify-between border-t border-white/[0.06] pt-4">
              <div className="flex items-center gap-4">
                <span className="text-[11px] text-[#555B55]">
                  Started {timeAgo(currentProject.createdAt)}
                </span>
                <span className="text-[11px] text-[#303530]">·</span>
                <span className="text-[11px] text-[#555B55]">
                  Updated {timeAgo(currentProject.updatedAt)}
                </span>
              </div>

              <Link
                to={`/projects/${currentProject.id}`}
                className="group/btn flex items-center gap-1.5 text-[12px] text-[#8A8F89] hover:text-[#F5F7F2] transition-colors duration-200"
              >
                View project
                <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
              </Link>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  )
}
