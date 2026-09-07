import { motion } from 'framer-motion'

const ease = [0.22, 1, 0.36, 1] as const

interface DiscoverSkeletonProps {
  count?: number
  type?: 'project' | 'developer'
}

export default function DiscoverSkeleton({ count = 6, type = 'project' }: DiscoverSkeletonProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: i * 0.05, duration: 0.4, ease }}
          className="border border-white/[0.06] overflow-hidden"
        >
          {type === 'project' ? (
            <>
              <div className="h-[140px] bg-white/[0.02] animate-pulse" />
              <div className="p-5">
                <div className="flex items-center justify-between mb-2">
                  <div className="h-5 w-24 bg-white/[0.06] animate-pulse" />
                  <div className="h-3 w-16 bg-white/[0.04] animate-pulse" />
                </div>
                <div className="h-3 w-full bg-white/[0.04] animate-pulse mb-2" />
                <div className="h-3 w-3/4 bg-white/[0.04] animate-pulse mb-3" />
                <div className="flex gap-2 mb-3">
                  <div className="h-3 w-12 bg-white/[0.04] animate-pulse" />
                  <div className="h-3 w-12 bg-white/[0.04] animate-pulse" />
                </div>
                <div className="flex gap-1.5 mb-4">
                  <div className="h-5 w-14 bg-white/[0.04] animate-pulse" />
                  <div className="h-5 w-14 bg-white/[0.04] animate-pulse" />
                </div>
                <div className="pt-3 border-t border-white/[0.04]">
                  <div className="h-3 w-20 bg-white/[0.04] animate-pulse" />
                </div>
              </div>
            </>
          ) : (
            <div className="p-6">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-14 h-14 rounded-full bg-white/[0.06] animate-pulse shrink-0" />
                <div className="flex-1">
                  <div className="h-4 w-24 bg-white/[0.06] animate-pulse mb-2" />
                  <div className="h-3 w-16 bg-white/[0.04] animate-pulse" />
                </div>
              </div>
              <div className="h-3 w-full bg-white/[0.04] animate-pulse mb-2" />
              <div className="h-3 w-3/4 bg-white/[0.04] animate-pulse mb-4" />
              <div className="flex gap-1.5 mb-4">
                <div className="h-5 w-14 bg-white/[0.04] animate-pulse" />
                <div className="h-5 w-14 bg-white/[0.04] animate-pulse" />
                <div className="h-5 w-14 bg-white/[0.04] animate-pulse" />
              </div>
              <div className="flex gap-4 mb-4">
                <div className="h-3 w-20 bg-white/[0.04] animate-pulse" />
                <div className="h-3 w-16 bg-white/[0.04] animate-pulse" />
              </div>
              <div className="pt-3 border-t border-white/[0.04]">
                <div className="h-3 w-24 bg-white/[0.04] animate-pulse" />
              </div>
            </div>
          )}
        </motion.div>
      ))}
    </div>
  )
}
