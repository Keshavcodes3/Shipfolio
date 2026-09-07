import { motion } from 'framer-motion'
import { Link } from 'react-router'
import { Star, ArrowRight } from 'lucide-react'
import type { Project } from '../../../lib/hooks'

const ease = [0.22, 1, 0.36, 1] as const

interface ProjectOfWeekProps {
  project: Project
}

export default function ProjectOfWeek({ project }: ProjectOfWeekProps) {
  return (
    <section className="py-12 md:py-16 border-b border-white/[0.06]">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease }}
      >
        <div className="flex items-center gap-3 mb-3">
          <span className="text-[10px] uppercase tracking-[0.3em] text-[#B6F34A] font-mono font-medium">
            PROJECT OF THE WEEK
          </span>
          <div className="flex-1 h-[1px] bg-white/[0.04]" />
        </div>

        <Link
          to={`/projects/${project.id}`}
          className="group block border border-white/[0.06] p-8 hover:border-[#B6F34A]/20 transition-colors duration-300"
        >
          <div className="flex flex-col lg:flex-row lg:items-center gap-6">
            <div className="flex-1 min-w-0">
              <h3 className="text-[clamp(1.5rem,3vw,2.2rem)] font-black tracking-[-0.04em] leading-[0.9] text-[#F5F7F2] group-hover:text-[#B6F34A] transition-colors duration-300 mb-3">
                {project.name}
              </h3>
              <p className="text-[15px] text-[#8A8F89] leading-relaxed mb-4 max-w-[480px]">
                {project.description}
              </p>
              <div className="flex flex-wrap gap-2 mb-4">
                {project.technologies.slice(0, 4).map((t) => (
                  <span key={t.technology.id} className="text-[11px] text-[#555B55] border border-white/[0.06] px-2.5 py-1 font-mono">
                    {t.technology.name}
                  </span>
                ))}
              </div>
              <div className="flex items-center gap-3 text-[12px] text-[#555B55]">
                <span>@{project.user?.username ?? 'unknown'}</span>
                <span className="text-white/[0.08]">·</span>
                <span className="flex items-center gap-1">
                  <Star className="w-3 h-3" />
                  {(project as any).stars ?? 0}
                </span>
              </div>
            </div>

            <div className="shrink-0">
              <span className="inline-flex items-center gap-2 text-[11px] font-mono uppercase tracking-[0.1em] text-[#B6F34A] group-hover:gap-3 transition-all duration-300">
                Explore Project
                <ArrowRight className="w-4 h-4" />
              </span>
            </div>
          </div>
        </Link>
      </motion.div>
    </section>
  )
}
