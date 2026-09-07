import { motion } from 'framer-motion'
import { ExternalLink } from 'lucide-react'

const ease = [0.22, 1, 0.36, 1] as const

interface ProjectRepositoryProps {
  repository: { name: string; language: string; isPublic: boolean; updatedAt: string }
  liveUrl?: string
}

export default function ProjectRepository({ repository, liveUrl }: ProjectRepositoryProps) {
  return (
    <section className="py-16 md:py-20 border-b border-white/[0.06]">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease }}
      >
        <span className="text-[10px] uppercase tracking-[0.25em] text-[#B6F34A] font-mono">SOURCE</span>
        <div className="mt-6 flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="flex-1 min-w-0">
            <p className="text-[14px] text-[#F5F7F2] font-mono">{repository.name}</p>
            <div className="flex items-center gap-3 mt-2 text-[11px] text-[#555B55] font-mono">
              <span>{repository.language}</span>
              <span className="text-white/[0.08]">·</span>
              <span>{repository.isPublic ? 'Public' : 'Private'}</span>
              <span className="text-white/[0.08]">·</span>
              <span>Updated {repository.updatedAt}</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {liveUrl && (
              <a
                href={liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-[11px] uppercase tracking-[0.12em] text-[#8A8F89] hover:text-[#F5F7F2] transition-colors duration-200 font-mono"
              >
                Live project
                <ExternalLink className="w-3 h-3" />
              </a>
            )}
            <a
              href="#"
              className="flex items-center gap-1.5 text-[11px] uppercase tracking-[0.12em] text-[#8A8F89] hover:text-[#F5F7F2] transition-colors duration-200 font-mono"
            >
              View source
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </motion.div>
    </section>
  )
}
