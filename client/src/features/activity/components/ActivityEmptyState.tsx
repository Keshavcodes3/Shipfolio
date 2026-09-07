import { motion } from 'framer-motion'
import { Link } from 'react-router'

const ease = [0.22, 1, 0.36, 1] as const

export default function ActivityEmptyState() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease }}
      className="text-center py-24"
    >
      <p className="text-[clamp(1.2rem,2.5vw,1.8rem)] font-black tracking-[-0.04em] text-[#F5F7F2] mb-3">
        YOUR FEED IS QUIET.
      </p>
      <p className="text-[14px] text-[#555B55] mb-8 max-w-[320px] mx-auto leading-relaxed">
        Follow a few builders to see what they're building next.
      </p>
      <Link
        to="/discover"
        className="inline-block border border-[#B6F34A]/30 bg-[#B6F34A]/[0.06] px-6 py-2.5 text-[11px] uppercase tracking-[0.15em] text-[#B6F34A] font-mono hover:bg-[#B6F34A]/[0.12] transition-colors duration-200"
      >
        EXPLORE BUILDERS →
      </Link>
    </motion.div>
  )
}
