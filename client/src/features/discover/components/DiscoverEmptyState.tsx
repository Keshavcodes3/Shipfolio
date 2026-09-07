import { motion } from 'framer-motion'

const ease = [0.22, 1, 0.36, 1] as const

interface DiscoverEmptyStateProps {
  label: string
  message: string
}

export default function DiscoverEmptyState({ label, message }: DiscoverEmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, ease }}
      className="py-16 text-center"
    >
      <p className="text-[10px] uppercase tracking-[0.25em] text-[#303530] font-mono mb-3">{label}</p>
      <p className="text-[14px] text-[#555B55]">{message}</p>
    </motion.div>
  )
}
