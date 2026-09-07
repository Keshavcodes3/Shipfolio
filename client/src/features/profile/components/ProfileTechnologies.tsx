import { motion } from 'framer-motion'

const ease = [0.22, 1, 0.36, 1] as const

interface ProfileTechnologiesProps {
  technologies: string[]
  currentlyExploring?: string[]
}

export default function ProfileTechnologies({ technologies, currentlyExploring }: ProfileTechnologiesProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-30px' }}
      transition={{ duration: 0.5, ease }}
      className="border border-white/[0.06] p-6 h-full"
    >
      <span className="text-[10px] uppercase tracking-[0.2em] text-[#B6F34A] font-mono">
        TOOLS I KEEP REACHING FOR
      </span>

      <div className="flex flex-wrap items-center gap-2 mt-4">
        {technologies.map((tech, i) => (
          <motion.span
            key={tech}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.03, duration: 0.3, ease }}
            className="text-[11px] text-[#8A8F89] border border-white/[0.06] px-2.5 py-1 font-mono hover:border-[#B6F34A]/20 hover:text-[#B6F34A] transition-colors duration-300"
          >
            {tech}
          </motion.span>
        ))}
      </div>

      {currentlyExploring && currentlyExploring.length > 0 && (
        <div className="mt-4 pt-4 border-t border-white/[0.04]">
          <span className="text-[9px] uppercase tracking-[0.15em] text-[#303530] font-mono">
            EXPLORING
          </span>
          <div className="flex flex-wrap items-center gap-2 mt-2">
            {currentlyExploring.map((tech) => (
              <span key={tech} className="text-[10px] text-[#555B55] font-mono italic">
                {tech}
              </span>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  )
}
