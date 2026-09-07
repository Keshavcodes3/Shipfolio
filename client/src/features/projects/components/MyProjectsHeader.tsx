import { motion } from 'framer-motion'
import { Plus } from 'lucide-react'
import { Link } from 'react-router'

const ease = [0.22, 1, 0.36, 1] as const

interface MyProjectsHeaderProps {
  count: number
}

export default function MyProjectsHeader({ count }: MyProjectsHeaderProps) {
  return (
    <div className="flex items-start justify-between gap-6">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease }}
      >
        <div className="flex items-center gap-3 mb-3">
          <span className="text-[clamp(1.5rem,3vw,2.2rem)] font-black tracking-[-0.04em] text-[#F5F7F2]">
            PROJECTS
          </span>
          <span className="text-[12px] font-mono text-[#303530]">· {count}</span>
        </div>
        <p className="text-[15px] text-[#555B55] leading-relaxed max-w-[400px]">
          Things I<span className="text-[#B6F34A]">'</span>ve built, shipped,
          <br className="hidden sm:block" /> broken, fixed, and kept going.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1, ease }}
      >
        <Link
          to="/projects/new"
          className="relative group inline-flex items-center gap-2 px-5 py-2.5 text-[11px] font-medium uppercase tracking-[0.1em] text-[#080A08] overflow-hidden shrink-0"
        >
          <div className="absolute inset-0 bg-[#B6F34A] transition-all duration-300 group-hover:bg-[#c8ff66]" />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <span className="relative z-10 flex items-center gap-2">
            <Plus className="w-3.5 h-3.5" />
            New project
          </span>
        </Link>
      </motion.div>
    </div>
  )
}
