import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import type { Writing } from '../data/profileData'

const ease = [0.22, 1, 0.36, 1] as const

export default function ProfileWriting({ writing }: { writing: Writing[] }) {
  if (!writing || writing.length === 0) return null

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
            WRITING
          </span>
          <div className="flex-1 h-[1px] bg-white/[0.04]" />
        </div>

        <div className="space-y-0">
          {writing.map((piece, i) => (
            <WritingRow key={i} piece={piece} index={i} />
          ))}
        </div>
      </motion.div>
    </section>
  )
}

function WritingRow({ piece, index }: { piece: Writing; index: number }) {
  const [hovered, setHovered] = useState(false)

  return (
    <motion.a
      href={piece.url || '#'}
      target={piece.url ? '_blank' : undefined}
      rel={piece.url ? 'noopener noreferrer' : undefined}
      initial={{ opacity: 0, x: -10 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.06, duration: 0.5, ease }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="flex items-start justify-between gap-6 py-6 border-b border-white/[0.04] group"
    >
      <div className="min-w-0">
        <h4 className="text-[16px] text-[#F5F7F2] font-medium group-hover:text-[#B6F34A] transition-colors duration-300">
          {piece.title}
        </h4>
        {piece.excerpt && (
          <p className="text-[13px] text-[#555B55] mt-1.5 line-clamp-1">{piece.excerpt}</p>
        )}
        <span className="text-[11px] text-[#303530] font-mono mt-2 block">{piece.date}</span>
      </div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: hovered ? 1 : 0 }} transition={{ duration: 0.2 }} className="shrink-0 mt-1">
        <ArrowUpRight className="w-4 h-4 text-[#B6F34A]" />
      </motion.div>
    </motion.a>
  )
}
