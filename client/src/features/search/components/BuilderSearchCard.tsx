import { motion } from 'framer-motion'
import { Link } from 'react-router'
import type { SearchBuilder } from '../types/search'

const ease = [0.22, 1, 0.36, 1] as const

interface BuilderSearchCardProps {
  builder: SearchBuilder
  index: number
  isSelected?: boolean
}

export default function BuilderSearchCard({ builder, index, isSelected }: BuilderSearchCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.03, duration: 0.3, ease }}
    >
      <Link
        to={`/profile/${builder.username}`}
        className={`block border border-white/[0.06] p-5 transition-colors duration-200 ${
          isSelected
            ? 'bg-[#B6F34A]/[0.04] border-[#B6F34A]/20'
            : 'bg-white/[0.015] hover:bg-white/[0.03] hover:border-white/[0.1]'
        }`}
      >
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-full bg-white/[0.06] border border-white/[0.08] flex items-center justify-center text-[#8A8F89] font-mono font-bold text-[20px] shrink-0">
            {builder.avatar}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h4 className="text-[15px] font-bold text-[#F5F7F2] tracking-[-0.02em]">
                {builder.displayName}
              </h4>
              <span className="text-[11px] text-[#555B55]">@{builder.username}</span>
              <span className="text-[10px] font-mono uppercase tracking-[0.12em] text-[#303530] shrink-0 ml-auto">
                Builder
              </span>
            </div>
            <p className="text-[13px] text-[#8A8F89] mb-2 line-clamp-1">{builder.headline}</p>
            <div className="flex flex-wrap gap-1.5">
              {builder.technologies.slice(0, 4).map((tech) => (
                <span key={tech} className="text-[10px] text-[#555B55] border border-white/[0.06] px-2 py-0.5 font-mono">
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
