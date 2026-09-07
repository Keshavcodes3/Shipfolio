import { motion } from 'framer-motion'
import { Link } from 'react-router'
import { Folder, Users } from 'lucide-react'
import type { Builder } from '../data/discoverData'
import FollowBuilderButton from '../../follows/components/FollowBuilderButton'

const ease = [0.22, 1, 0.36, 1] as const

interface DiscoverDeveloperCardProps {
  developer: Builder
  index: number
}

export default function DiscoverDeveloperCard({ developer, index }: DiscoverDeveloperCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.5, ease }}
    >
      <div className="border border-white/[0.06] p-6 relative group h-full">
        <div className="absolute inset-0 bg-gradient-to-br from-[#B6F34A]/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

        <div className="absolute inset-0 border border-transparent group-hover:border-[#B6F34A]/20 transition-colors duration-500 pointer-events-none" />

        <div className="relative">
          <div className="flex items-start gap-4 mb-4">
            <div className="w-14 h-14 rounded-full bg-white/[0.06] border border-white/[0.08] flex items-center justify-center text-[#8A8F89] font-mono font-bold text-[18px] shrink-0 group-hover:border-[#B6F34A]/30 transition-colors duration-300">
              {developer.avatar}
            </div>
            <div className="flex-1 min-w-0">
              <Link to={`/profile/${developer.username}`}>
                <h4 className="text-[15px] font-bold text-[#F5F7F2] group-hover:text-[#B6F34A] transition-colors duration-200 truncate">
                  @{developer.username}
                </h4>
              </Link>
              <p className="text-[13px] text-[#8A8F89] truncate">{developer.displayName}</p>
            </div>
          </div>

          <p className="text-[13px] text-[#555B55] leading-relaxed mb-4 line-clamp-2">
            {developer.headline}
          </p>

          <div className="flex flex-wrap gap-1.5 mb-4">
            {developer.technologies.slice(0, 4).map((tech) => (
              <span key={tech} className="text-[10px] font-mono text-[#303530] border border-white/[0.06] px-2 py-0.5">
                {tech}
              </span>
            ))}
            {developer.technologies.length > 4 && (
              <span className="text-[10px] font-mono text-[#303530]">+{developer.technologies.length - 4}</span>
            )}
          </div>

          <div className="flex items-center gap-4 mb-4 text-[11px] font-mono text-[#555B55]">
            <span className="flex items-center gap-1.5">
              <Folder className="w-3 h-3 text-[#303530]" />
              {developer.projectCount} projects
            </span>
            <span className="flex items-center gap-1.5">
              <Users className="w-3 h-3 text-[#303530]" />
              {developer.followers}
            </span>
          </div>

          {developer.currentProject && (
            <div className="flex items-center gap-2 mb-4 text-[11px]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#B6F34A] animate-pulse" />
              <span className="text-[#555B55]">Building</span>
              <span className="text-[#B6F34A] font-mono">{developer.currentProject}</span>
            </div>
          )}

          <div className="flex items-center gap-3 pt-3 border-t border-white/[0.04]">
            <Link
              to={`/profile/${developer.username}`}
              className="text-[11px] uppercase tracking-[0.12em] text-[#8A8F89] hover:text-[#F5F7F2] transition-colors duration-200 font-mono"
            >
              View profile
            </Link>
            <FollowBuilderButton username={developer.username} displayName={developer.displayName} size="sm" />
          </div>
        </div>
      </div>
    </motion.div>
  )
}
