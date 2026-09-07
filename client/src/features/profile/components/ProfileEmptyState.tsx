import { motion } from 'framer-motion'

const ease = [0.22, 1, 0.36, 1] as const

export default function ProfileEmptyState({ label, message, actionLabel }: { label: string; message: string; actionLabel?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, ease }}
      className="py-16 text-center"
    >
      <p className="text-[10px] uppercase tracking-[0.25em] text-[#303530] font-mono mb-4">{label}</p>
      <p className="text-[15px] text-[#555B55] leading-relaxed max-w-[320px] mx-auto">{message}</p>
      {actionLabel && (
        <button className="mt-6 text-[11px] uppercase tracking-[0.15em] text-[#B6F34A] font-mono hover:text-[#c8ff66] transition-colors duration-200">
          {actionLabel} →
        </button>
      )}
    </motion.div>
  )
}
