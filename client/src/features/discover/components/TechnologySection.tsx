import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import type { Technology } from '../data/discoverData'

const ease = [0.22, 1, 0.36, 1] as const

interface TechnologySectionProps {
  technologies: Technology[]
}

export default function TechnologySection({ technologies }: TechnologySectionProps) {
  const [hovered, setHovered] = useState<string | null>(null)

  return (
    <section className="py-16 md:py-24 border-t border-white/[0.06]">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.7, ease }}
      >
        <div className="flex items-center gap-3 mb-3">
          <span className="text-[10px] uppercase tracking-[0.3em] text-[#B6F34A] font-mono font-medium">
            BY TECHNOLOGY
          </span>
          <div className="flex-1 h-[1px] bg-white/[0.04]" />
        </div>
        <p className="text-[14px] text-[#555B55] mb-10">Follow the rabbit hole.</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-0">
          {technologies.map((tech, i) => (
            <motion.div
              key={tech.name}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.04, duration: 0.4, ease }}
            >
              <button
                onMouseEnter={() => setHovered(tech.name)}
                onMouseLeave={() => setHovered(null)}
                className="w-full text-left py-5 px-4 border-b border-white/[0.04] group relative"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className={`text-[15px] font-mono font-bold transition-colors duration-200 ${
                      hovered === tech.name ? 'text-[#B6F34A]' : 'text-[#F5F7F2]'
                    }`}>
                      {tech.name}
                    </p>
                    <p className="text-[11px] text-[#303530] font-mono mt-1">
                      {tech.projectCount} PROJECTS
                    </p>
                  </div>
                  <motion.div
                    animate={{ opacity: hovered === tech.name ? 1 : 0, x: hovered === tech.name ? 0 : -4 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ArrowUpRight className="w-4 h-4 text-[#B6F34A]" />
                  </motion.div>
                </div>
              </button>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  )
}
