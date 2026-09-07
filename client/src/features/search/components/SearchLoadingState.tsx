import { motion } from 'framer-motion'

const ease = [0.22, 1, 0.36, 1] as const

export default function SearchLoadingState() {
  return (
    <div className="space-y-8">
      {[1, 2, 3].map((section) => (
        <div key={section}>
          <div className="flex items-center gap-3 mb-3">
            <div className="h-3 w-20 bg-white/[0.06] animate-pulse" />
            <div className="h-3 w-12 bg-white/[0.04] animate-pulse" />
            <div className="flex-1 h-[1px] bg-white/[0.04]" />
          </div>
          <div className="space-y-2">
            {[1, 2].map((card) => (
              <motion.div
                key={card}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: card * 0.05, duration: 0.3, ease }}
                className="border border-white/[0.06] bg-white/[0.015] p-5"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="h-4 w-32 bg-white/[0.06] animate-pulse" />
                  <div className="h-3 w-14 bg-white/[0.04] animate-pulse" />
                </div>
                <div className="h-3 w-full bg-white/[0.04] animate-pulse mb-2" />
                <div className="h-3 w-3/4 bg-white/[0.04] animate-pulse mb-3" />
                <div className="flex gap-1.5">
                  <div className="h-5 w-14 bg-white/[0.04] animate-pulse" />
                  <div className="h-5 w-14 bg-white/[0.04] animate-pulse" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
