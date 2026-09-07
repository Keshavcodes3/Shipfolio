import { motion } from 'framer-motion'

const ease = [0.22, 1, 0.36, 1] as const

export default function ProjectTechnologies({ technologies }: { technologies: string[] }) {
  return (
    <section className="py-16 md:py-20 border-b border-white/[0.06]">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease }}
      >
        <span className="text-[10px] uppercase tracking-[0.25em] text-[#B6F34A] font-mono">STACK</span>
        <div className="flex flex-wrap gap-2 mt-6">
          {technologies.map((tech, i) => (
            <motion.span
              key={tech}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.04, duration: 0.3, ease }}
              className="text-[13px] text-[#8A8F89] border border-white/[0.08] px-3 py-1.5 font-mono hover:border-[#B6F34A]/30 hover:text-[#B6F34A] transition-colors duration-300"
            >
              {tech}
            </motion.span>
          ))}
        </div>
      </motion.div>
    </section>
  )
}
