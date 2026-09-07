import { motion } from 'framer-motion'
import type { ProfileProject } from '../data/profileData'
import ProfileProjectCard from './ProfileProjectCard'

const ease = [0.22, 1, 0.36, 1] as const

export default function FeaturedProjects({ projects }: { projects: ProfileProject[] }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.6, ease }}
      className="border border-white/[0.06] relative overflow-hidden h-full"
    >
      <div className="p-6 md:p-8">
        <div className="flex items-center gap-3 mb-6">
          <span className="text-[10px] uppercase tracking-[0.25em] text-[#B6F34A] font-mono font-medium">
            SELECTED WORK
          </span>
          <div className="flex-1 h-[1px] bg-white/[0.04]" />
          <span className="text-[10px] text-[#303530] font-mono">{projects.length}</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {projects.map((project, i) => (
            <ProfileProjectCard key={project.name} project={project} index={i} />
          ))}
        </div>
      </div>
    </motion.div>
  )
}
