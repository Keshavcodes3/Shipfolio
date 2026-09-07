import { motion } from 'framer-motion'
import { ExternalLink } from 'lucide-react'

const ease = [0.22, 1, 0.36, 1] as const

interface ProjectLinksProps {
  liveUrl?: string
}

export default function ProjectLinks({ liveUrl }: ProjectLinksProps) {
  if (!liveUrl) return null

  return (
    <section className="py-16 md:py-20 border-b border-white/[0.06]">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease }}
      >
        <span className="text-[10px] uppercase tracking-[0.25em] text-[#B6F34A] font-mono">LINKS</span>
        <div className="mt-6">
          <a
            href={liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-[14px] text-[#8A8F89] hover:text-[#F5F7F2] transition-colors duration-200"
          >
            Live project
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </motion.div>
    </section>
  )
}
