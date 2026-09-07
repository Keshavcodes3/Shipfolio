import { motion } from 'framer-motion'
import { Link } from 'react-router'
import type { ProfileProject } from '../data/profileData'
import ProjectVisual from './ProjectVisual'

const ease = [0.22, 1, 0.36, 1] as const

export default function CurrentlyBuilding({ project }: { project: ProfileProject }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.6, ease }}
      className="border border-white/[0.06] relative group overflow-hidden h-full"
    >
      {/* Hover glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#B6F34A]/[0.02] via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

      {/* Corner accent */}
      <div className="absolute top-0 right-0 w-16 h-16 pointer-events-none">
        <div className="absolute top-0 right-0 w-[1px] h-10 bg-gradient-to-b from-[#B6F34A]/25 to-transparent" />
        <div className="absolute top-0 right-0 w-10 h-[1px] bg-gradient-to-l from-[#B6F34A]/25 to-transparent" />
      </div>

      <div className="p-6 md:p-8 relative h-full flex flex-col">
        {/* Label */}
        <div className="flex items-center gap-2 mb-5">
          <motion.span animate={{ scale: [1, 1.3, 1] }} transition={{ duration: 2, repeat: Infinity }}
            className="w-2 h-2 rounded-full bg-[#B6F34A]" />
          <span className="text-[10px] uppercase tracking-[0.25em] text-[#B6F34A] font-mono font-medium">
            CURRENTLY BUILDING
          </span>
        </div>

        <div className="flex flex-col md:flex-row gap-6 items-start flex-1">
          <div className="flex-1 min-w-0">
            <h3 className="text-[clamp(1.5rem,4vw,2.5rem)] font-black tracking-[-0.05em] leading-[0.95] text-[#F5F7F2] group-hover:text-[#B6F34A] transition-colors duration-300 mb-3">
              {project.name}
            </h3>
            <p className="text-[13px] text-[#8A8F89] leading-relaxed max-w-[380px] mb-5">
              {project.description}
            </p>

            <div className="flex flex-wrap items-center gap-2 mb-5">
              {project.technologies.map((tech) => (
                <span key={tech} className="text-[9px] uppercase tracking-[0.12em] text-[#555B55] border border-white/[0.06] px-2.5 py-1 font-mono">
                  {tech}
                </span>
              ))}
            </div>

            <Link
              to={project.id ? `/showcase/${project.id}` : '#'}
              className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-[0.12em] text-[#B6F34A] font-mono hover:text-[#c8ff66] transition-colors duration-200"
            >
              Explore project →
            </Link>
          </div>

          {/* Visual */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.6, ease }}
            className="w-full md:w-[200px] h-[140px] shrink-0 flex items-center justify-center relative"
          >
            <div className="absolute inset-0 bg-[#B6F34A]/[0.02] blur-[30px] rounded-full" />
            <ProjectVisual name={project.name} />
          </motion.div>
        </div>
      </div>
    </motion.div>
  )
}
