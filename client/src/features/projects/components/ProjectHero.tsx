import { motion } from 'framer-motion'
import type { ProjectDetail } from '../data/projectDetailData'
import DiscoverProjectVisual from '../../discover/components/DiscoverProjectVisual'

const ease = [0.22, 1, 0.36, 1] as const

interface ProjectHeroProps {
  project: ProjectDetail
}

export default function ProjectHero({ project }: ProjectHeroProps) {
  const isBuilding = project.status === 'BUILDING'

  return (
    <section className="pt-16 md:pt-24 pb-12 md:pb-16 relative">
      <div className="flex flex-col lg:flex-row gap-12 items-start">
        <div className="flex-1 min-w-0">
          {/* Name */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.7, ease }}
            className="text-[clamp(2.5rem,7vw,5rem)] font-black tracking-[-0.06em] leading-[0.9] text-[#F5F7F2] mb-6"
          >
            {project.name}
          </motion.h1>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.6, ease }}
            className="text-[16px] text-[#8A8F89] leading-relaxed max-w-[480px] mb-8"
          >
            {project.description}
          </motion.p>

          {/* Status + Builder */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5, ease }}
            className="flex items-center gap-4"
          >
            <span className="flex items-center gap-2 text-[11px] font-mono">
              <span className={`w-2 h-2 rounded-full ${isBuilding ? 'bg-[#B6F34A]' : 'bg-[#8A8F89]'}`} />
              <span className={isBuilding ? 'text-[#B6F34A]' : 'text-[#555B55]'}>
                {project.status}
              </span>
            </span>
            <span className="text-white/[0.08]">·</span>
            <a
              href={`/profile/${project.owner.username}`}
              className="text-[12px] text-[#555B55] hover:text-[#F5F7F2] transition-colors duration-200 font-mono"
            >
              @{project.owner.username}
            </a>
          </motion.div>
        </div>

        {/* Visual */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.8, ease }}
          className="w-full lg:w-[320px] h-[240px] relative border border-white/[0.06] bg-white/[0.01] shrink-0"
        >
          <DiscoverProjectVisual type={project.visual} />
        </motion.div>
      </div>
    </section>
  )
}
