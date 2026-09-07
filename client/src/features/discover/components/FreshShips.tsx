import { motion } from 'framer-motion'
import { Link } from 'react-router'
import { Rocket } from 'lucide-react'

const ease = [0.22, 1, 0.36, 1] as const

interface FreshShip {
  id: string
  name: string
  description: string
  builder: { username: string; displayName: string }
  technologies: string[]
  shippedAt: string
}

interface FreshShipsProps {
  projects: FreshShip[]
}

export default function FreshShips({ projects }: FreshShipsProps) {
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
            FRESH SHIPS
          </span>
          <div className="flex-1 h-[1px] bg-white/[0.04]" />
        </div>

        <div className="space-y-0">
          {projects.map((project, i) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, x: -8 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06, duration: 0.4, ease }}
            >
              <Link
                to={`/projects/${project.id}`}
                className="flex items-start gap-4 py-5 border-b border-white/[0.04] last:border-0 group"
              >
                <Rocket className="w-4 h-4 text-[#B6F34A] shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[12px] text-[#555B55]">
                      @{project.builder.username}
                    </span>
                    <span className="text-[12px] text-[#8A8F89]">
                      shipped
                    </span>
                    <span className="text-[13px] font-bold text-[#F5F7F2] group-hover:text-[#B6F34A] transition-colors">
                      {project.name}
                    </span>
                  </div>
                  <p className="text-[12px] text-[#555B55] mt-1 line-clamp-1">
                    {project.description}
                  </p>
                  <div className="flex items-center gap-3 mt-2">
                    <span className="text-[10px] text-[#303530] font-mono">
                      {project.shippedAt}
                    </span>
                    <div className="flex gap-1.5">
                      {project.technologies.slice(0, 3).map((tech) => (
                        <span key={tech} className="text-[10px] text-[#303530] border border-white/[0.04] px-1.5 py-0.5 font-mono">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  )
}
