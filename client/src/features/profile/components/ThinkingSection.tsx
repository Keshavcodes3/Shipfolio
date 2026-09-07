import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'

const ease = [0.22, 1, 0.36, 1] as const

export default function ThinkingSection({ thoughts }: { thoughts: string[] }) {
  if (!thoughts || thoughts.length === 0) return null

  return (
    <section className="py-20 md:py-28 border-t border-white/[0.06]">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.7, ease }}
      >
        <div className="flex items-center gap-3 mb-12">
          <span className="text-[10px] uppercase tracking-[0.3em] text-[#B6F34A] font-mono font-medium">
            THINKING ABOUT
          </span>
          <div className="flex-1 h-[1px] bg-white/[0.04]" />
        </div>

        <div className="space-y-0">
          {thoughts.map((thought, i) => (
            <ThoughtRow key={i} thought={thought} index={i} />
          ))}
        </div>
      </motion.div>
    </section>
  )
}

function ThoughtRow({ thought, index }: { thought: string; index: number }) {
  const [hovered, setHovered] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, x: -12 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.06, duration: 0.5, ease }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="flex items-center gap-4 py-5 border-b border-white/[0.04] group cursor-default"
    >
      <motion.div
        initial={{ opacity: 0, x: -4 }}
        animate={{ opacity: hovered ? 1 : 0, x: hovered ? 0 : -4 }}
        transition={{ duration: 0.2 }}
      >
        <ArrowRight className="w-4 h-4 text-[#B6F34A] shrink-0" />
      </motion.div>

      <motion.span
        animate={{ x: hovered ? 4 : 0 }}
        transition={{ duration: 0.3, ease }}
        className="text-[15px] text-[#8A8F89] group-hover:text-[#F5F7F2] transition-colors duration-300"
      >
        {thought}
      </motion.span>
    </motion.div>
  )
}
