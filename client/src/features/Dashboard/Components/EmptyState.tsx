import { motion } from 'framer-motion'
import { Plus } from 'lucide-react'

const ease = [0.22, 1, 0.36, 1] as const

interface EmptyStateProps {
  title?: string
  description?: string
  actionLabel?: string
}

export default function EmptyState({
  title = 'No projects yet.',
  description = 'The best part of building is having something to show.',
  actionLabel = 'Create your first project',
}: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.4, ease }}
      className="flex flex-col items-center justify-center py-24 px-6 text-center"
    >
      <h3 className="text-[clamp(1.5rem,3vw,2.2rem)] font-bold tracking-[-0.04em] text-[#F5F7F2] mb-3">
        {title}
      </h3>
      <p className="text-[14px] text-[#8A8F89] max-w-sm mb-8">
        {description}
      </p>
      <button className="group inline-flex items-center gap-2 bg-[#F5F7F2] px-5 py-2.5 text-[12px] font-medium uppercase tracking-[0.1em] text-[#080A08] transition-colors duration-200 hover:bg-[#E5E8DF]">
        <Plus className="h-3.5 w-3.5" />
        {actionLabel}
      </button>
    </motion.div>
  )
}
