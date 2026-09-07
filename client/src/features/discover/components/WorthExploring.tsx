import { motion } from 'framer-motion'
import { Link } from 'react-router'
import { Star } from 'lucide-react'

const ease = [0.22, 1, 0.36, 1] as const

interface WorthExploringProject {
  id: string
  name: string
  description: string
  builder: { username: string; displayName: string }
  technologies: string[]
  stars: number
  rankScore: number
}

interface WorthExploringProps {
  projects: WorthExploringProject[]
}

export default function WorthExploring({ projects }: WorthExploringProps) {
  if (projects.length === 0) return null

  return (
    <section className="py-12 md:py-16 border-b border-white/[0.06]">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease }}
      >
        <div className="flex items-center gap-3 mb-6">
          <span className="text-[10px] uppercase tracking-[0.3em] text-[#B6F34A] font-mono font-medium">
            WORTH EXPLORING
          </span>
          <div className="flex-1 h-[1px] bg-white/[0.04]" />
        </div>

        <p className="text-[13px] text-[#555B55] mb-6">
          Projects that stand out for their quality and craft.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {projects.map((project, i) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.5, ease }}
            >
              <Link
                to={`/projects/${project.id}`}
                className="group block border border-white/[0.06] p-5 hover:border-[#B6F34A]/20 transition-colors duration-300 h-full"
              >
                <div className="flex items-start justify-between mb-2">
                  <h4 className="text-[15px] font-bold text-[#F5F7F2] tracking-[-0.02em] group-hover:text-[#B6F34A] transition-colors">
                    {project.name}
                  </h4>
                  <span className="flex items-center gap-1 text-[11px] text-[#555B55]">
                    <Star className="w-3 h-3" />
                    {project.stars}
                  </span>
                </div>
                <p className="text-[12px] text-[#8A8F89] line-clamp-2 mb-3">
                  {project.description}
                </p>
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {project.technologies.slice(0, 3).map((tech) => (
                    <span key={tech} className="text-[10px] text-[#555B55] border border-white/[0.06] px-2 py-0.5 font-mono">
                      {tech}
                    </span>
                  ))}
                </div>
                <div className="text-[11px] text-[#555B55]">
                  @{project.builder.username}
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  )
}
