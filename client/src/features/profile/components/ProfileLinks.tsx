import { motion } from 'framer-motion'
import { ExternalLink } from 'lucide-react'

const ease = [0.22, 1, 0.36, 1] as const

interface ProfileLinksProps {
  links: { label: string; url: string }[]
}

export default function ProfileLinks({ links }: ProfileLinksProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-30px' }}
      transition={{ duration: 0.5, ease }}
      className="border border-white/[0.06] p-6 h-full"
    >
      <span className="text-[10px] uppercase tracking-[0.2em] text-[#B6F34A] font-mono">
        LINKS
      </span>

      <div className="flex flex-col gap-3 mt-4">
        {links.map((link, i) => (
          <motion.a
            key={link.label}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, x: -6 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.05, duration: 0.4, ease }}
            className="flex items-center justify-between text-[13px] text-[#8A8F89] hover:text-[#F5F7F2] transition-colors duration-200 py-1.5 border-b border-white/[0.04] last:border-0"
          >
            <span>{link.label}</span>
            <ExternalLink className="w-3 h-3" />
          </motion.a>
        ))}
      </div>
    </motion.div>
  )
}
