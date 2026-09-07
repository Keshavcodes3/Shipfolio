import { motion } from 'framer-motion'
import { Link } from 'react-router'
import { Cpu } from 'lucide-react'
import type { SearchTechnology } from '../types/search'

const ease = [0.22, 1, 0.36, 1] as const

interface TechnologySearchCardProps {
  technology: SearchTechnology
  index: number
  isSelected?: boolean
}

export default function TechnologySearchCard({ technology, index, isSelected }: TechnologySearchCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.03, duration: 0.3, ease }}
    >
      <Link
        to={`/discover?search=${encodeURIComponent(technology.name)}`}
        className={`flex items-center gap-4 border border-white/[0.06] p-5 transition-colors duration-200 ${
          isSelected
            ? 'bg-[#B6F34A]/[0.04] border-[#B6F34A]/20'
            : 'bg-white/[0.015] hover:bg-white/[0.03] hover:border-white/[0.1]'
        }`}
      >
        <div className="w-10 h-10 rounded-lg bg-white/[0.04] flex items-center justify-center shrink-0">
          <Cpu className="w-5 h-5 text-[#555B55]" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h4 className="text-[15px] font-bold text-[#F5F7F2] tracking-[-0.02em]">
              {technology.name}
            </h4>
            <span className="text-[10px] font-mono uppercase tracking-[0.12em] text-[#303530] shrink-0 ml-auto">
              Technology
            </span>
          </div>
          <p className="text-[12px] text-[#555B55]">
            Used by {technology.projectCount} projects
          </p>
        </div>
      </Link>
    </motion.div>
  )
}
