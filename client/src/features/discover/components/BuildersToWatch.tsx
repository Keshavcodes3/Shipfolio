import { motion } from 'framer-motion'
import { Link } from 'react-router'

const ease = [0.22, 1, 0.36, 1] as const

interface Builder {
  username: string
  displayName: string
  avatar: string
  headline: string
  technologies: string[]
  projectCount: number
  followers: number
}

interface BuildersToWatchProps {
  builders: Builder[]
}

export default function BuildersToWatch({ builders }: BuildersToWatchProps) {
  if (builders.length === 0) return null

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
            BUILDERS TO WATCH
          </span>
          <div className="flex-1 h-[1px] bg-white/[0.04]" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {builders.map((builder, i) => (
            <motion.div
              key={builder.username}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.5, ease }}
            >
              <Link
                to={`/profile/${builder.username}`}
                className="block border border-white/[0.06] p-5 hover:border-[#B6F34A]/20 transition-colors duration-300"
              >
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-white/[0.06] border border-white/[0.08] flex items-center justify-center text-[#8A8F89] font-mono font-bold text-[16px] shrink-0">
                    {builder.avatar}
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-[14px] font-bold text-[#F5F7F2] tracking-[-0.02em] truncate">
                      {builder.displayName}
                    </h4>
                    <p className="text-[11px] text-[#555B55]">@{builder.username}</p>
                  </div>
                </div>
                <p className="text-[12px] text-[#8A8F89] line-clamp-2 mb-3">
                  {builder.headline}
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {builder.technologies.slice(0, 3).map((tech) => (
                    <span key={tech} className="text-[10px] text-[#303530] border border-white/[0.06] px-2 py-0.5 font-mono">
                      {tech}
                    </span>
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
