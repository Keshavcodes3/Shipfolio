import { motion } from 'framer-motion'
import { Link } from 'react-router'
import type { ProjectDetail } from '../data/projectDetailData'
import FollowBuilderButton from '../../follows/components/FollowBuilderButton'

const ease = [0.22, 1, 0.36, 1] as const

interface ProjectBuilderProps {
  project: ProjectDetail
  isOwner: boolean
}

export default function ProjectBuilder({ project, isOwner }: ProjectBuilderProps) {
  const { owner } = project

  return (
    <section className="py-16 md:py-20 border-b border-white/[0.06]">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease }}
      >
        <span className="text-[10px] uppercase tracking-[0.25em] text-[#B6F34A] font-mono">BUILT BY</span>

        <div className="mt-8 border border-white/[0.06] p-6 md:p-8 relative group">
          <div className="absolute inset-0 bg-gradient-to-br from-[#B6F34A]/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

          <div className="relative flex items-start gap-5">
            <div className="w-14 h-14 rounded-full bg-white/[0.06] border border-white/[0.08] flex items-center justify-center text-[#8A8F89] font-mono font-bold text-[16px] shrink-0">
              {owner.avatar}
            </div>

            <div className="flex-1 min-w-0">
              <Link to={`/profile/${owner.username}`} className="text-[16px] font-bold text-[#F5F7F2] hover:text-[#B6F34A] transition-colors duration-200">
                @{owner.username}
              </Link>
              <p className="text-[13px] text-[#8A8F89] mt-1 leading-relaxed">
                {owner.bio}
              </p>

              <div className="flex items-center gap-4 mt-4 text-[11px] font-mono text-[#555B55]">
                <span>{owner.projectCount} PROJECTS</span>
                <span className="text-white/[0.08]">·</span>
                <span>{owner.activeProjectCount} ACTIVE</span>
              </div>

              <div className="flex items-center gap-4 mt-5">
                <Link
                  to={`/profile/${owner.username}`}
                  className="text-[11px] uppercase tracking-[0.12em] text-[#8A8F89] hover:text-[#F5F7F2] transition-colors duration-200 font-mono"
                >
                  View profile →
                </Link>

                {!isOwner && (
                  <FollowBuilderButton username={owner.username} displayName={owner.displayName} size="sm" />
                )}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  )
}
