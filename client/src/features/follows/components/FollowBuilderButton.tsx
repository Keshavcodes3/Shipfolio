import { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useFollowStatus, useToggleFollow } from '../../../lib/hooks'

const ease = [0.22, 1, 0.36, 1] as const

interface FollowBuilderButtonProps {
  username: string
  displayName?: string
  size?: 'sm' | 'md'
}

export default function FollowBuilderButton({ username, displayName: _displayName, size = 'md' }: FollowBuilderButtonProps) {
  const { data: followData } = useFollowStatus(username)
  const toggleFollow = useToggleFollow(username)
  const isFollowed = followData?.following ?? false
  const [toast, setToast] = useState<string | null>(null)
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    return () => { if (toastTimer.current) clearTimeout(toastTimer.current) }
  }, [])

  const showToast = useCallback((msg: string) => {
    if (toastTimer.current) clearTimeout(toastTimer.current)
    setToast(msg)
    toastTimer.current = setTimeout(() => { setToast(null); toastTimer.current = null }, 2400)
  }, [])

  const handleToggle = () => {
    const willFollow = !isFollowed
    toggleFollow.mutate(willFollow, {
      onSuccess: () => {
        if (willFollow) {
          showToast(`FOLLOWING @${username}`)
        } else {
          showToast(`UNFOLLOWED @${username}`)
        }
      },
      onError: () => {
        showToast(`FAILED — TRY AGAIN`)
      },
    })
  }

  const sm = size === 'sm'

  return (
    <div className="relative">
      <motion.button
        onClick={handleToggle}
        whileTap={{ scale: 0.96 }}
        disabled={toggleFollow.isPending}
        aria-pressed={isFollowed}
        aria-label={isFollowed ? `Unfollow ${username}` : `Follow ${username}`}
        className={`relative overflow-hidden ${sm ? 'text-[10px] px-3 py-1.5' : 'text-[11px] px-5 py-2'}`}
      >
        <AnimatePresence mode="wait">
          {isFollowed ? (
            <motion.span
              key="following"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2, ease }}
              className="flex items-center gap-1.5 border border-[#B6F34A]/30 bg-[#B6F34A]/[0.06] px-4 py-1.5 uppercase tracking-[0.15em] text-[#B6F34A] font-mono"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#B6F34A] animate-pulse" />
              FOLLOWING
            </motion.span>
          ) : (
            <motion.span
              key="follow"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2, ease }}
              className="flex items-center border border-white/[0.12] px-4 py-1.5 uppercase tracking-[0.15em] text-[#8A8F89] hover:text-[#F5F7F2] hover:border-white/[0.25] transition-all duration-200 font-mono"
            >
              FOLLOW
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>

      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 8, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: -4, x: '-50%' }}
            transition={{ duration: 0.25, ease }}
            className="absolute top-full left-1/2 mt-2 z-50 whitespace-nowrap bg-[#16200F] border border-[#B6F34A]/20 px-4 py-2.5 text-[11px] text-[#B6F34A] font-mono shadow-lg"
          >
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
