import { useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router'
import { ArrowLeft, MoreHorizontal, Pencil } from 'lucide-react'
import FollowBuilderButton from '../../follows/components/FollowBuilderButton'

const ease = [0.22, 1, 0.36, 1] as const

interface ProjectWorkspaceHeaderProps {
  projectName: string
  isOwner: boolean
  projectUsername: string
}

export default function ProjectWorkspaceHeader({ projectName, isOwner, projectUsername }: ProjectWorkspaceHeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <motion.header
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease }}
      className="flex items-center justify-between px-5 py-4 md:px-8 border-b border-white/[0.06] relative z-50"
    >
      <Link
        to="/discover"
        className="group flex items-center gap-2 text-[12px] text-[#555B55] hover:text-[#F5F7F2] transition-colors duration-200"
      >
        <ArrowLeft className="h-3.5 w-3.5 transition-transform duration-200 group-hover:-translate-x-0.5" />
        <span className="uppercase tracking-[0.15em]">Discover</span>
      </Link>

      <span className="text-[13px] font-bold text-[#F5F7F2] hidden md:block">
        {projectName}
      </span>

      <div className="flex items-center gap-3">
        {isOwner ? (
          <>
            <Link
              to={`/projects/${projectName.toLowerCase()}/edit`}
              className="flex items-center gap-2 text-[11px] uppercase tracking-[0.12em] text-[#8A8F89] hover:text-[#F5F7F2] transition-colors duration-200 font-mono"
            >
              <Pencil className="w-3 h-3" />
              Edit project
            </Link>
            <div className="relative">
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="text-[#555B55] hover:text-[#8A8F89] transition-colors"
                aria-label="More options"
              >
                <MoreHorizontal className="w-4 h-4" />
              </button>
            </div>
          </>
        ) : (
          <>
            <Link
              to={`/profile/${projectUsername}`}
              className="text-[11px] uppercase tracking-[0.12em] text-[#555B55] hover:text-[#F5F7F2] transition-colors duration-200 font-mono hidden md:block"
            >
              @{projectUsername}
            </Link>
            <FollowBuilderButton username={projectUsername} size="sm" />
          </>
        )}
      </div>
    </motion.header>
  )
}
