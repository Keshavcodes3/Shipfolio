import { motion } from 'framer-motion'

const ease = [0.22, 1, 0.36, 1] as const

export default function ProfileAbout({ bio }: { bio: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-30px' }}
      transition={{ duration: 0.5, ease }}
      className="border border-white/[0.06] p-6 h-full"
    >
      <span className="text-[10px] uppercase tracking-[0.2em] text-[#B6F34A] font-mono">
        ABOUT
      </span>
      <p className="text-[13px] text-[#8A8F89] leading-relaxed mt-4">
        {bio}
      </p>
    </motion.div>
  )
}
