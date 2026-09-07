import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const ease = [0.22, 1, 0.36, 1] as const

export default function FollowButton() {
  const [following, setFollowing] = useState(false)

  return (
    <motion.button
      onClick={() => setFollowing((p) => !p)}
      whileTap={{ scale: 0.96 }}
      className="relative overflow-hidden"
    >
      <AnimatePresence mode="wait">
        {following ? (
          <motion.div
            key="following"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2, ease }}
            className="flex items-center gap-2 border border-[#B6F34A]/30 bg-[#B6F34A]/[0.06] px-5 py-2 text-[11px] uppercase tracking-[0.15em] text-[#B6F34A] font-mono"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#B6F34A] animate-pulse" />
            FOLLOWING
          </motion.div>
        ) : (
          <motion.div
            key="follow"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2, ease }}
            className="flex items-center border border-white/[0.12] px-5 py-2 text-[11px] uppercase tracking-[0.15em] text-[#8A8F89] hover:text-[#F5F7F2] hover:border-white/[0.25] transition-all duration-200 font-mono"
          >
            FOLLOW
          </motion.div>
        )}
      </AnimatePresence>
    </motion.button>
  )
}
