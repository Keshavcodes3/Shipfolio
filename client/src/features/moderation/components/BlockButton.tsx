import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { UserX, UserCheck, X } from 'lucide-react'
import { useBlockUser, useUnblockUser } from '../../../lib/hooks'

const ease = [0.22, 1, 0.36, 1] as const

interface BlockButtonProps {
  username: string
  isBlocked?: boolean
  onBlocked?: () => void
}

export default function BlockButton({ username, isBlocked = false, onBlocked }: BlockButtonProps) {
  const [showConfirm, setShowConfirm] = useState(false)
  const blockUser = useBlockUser()
  const unblockUser = useUnblockUser()

  const handleBlock = async () => {
    try {
      await blockUser.mutateAsync(username)
      setShowConfirm(false)
      onBlocked?.()
    } catch {
      // Error handled by mutation
    }
  }

  const handleUnblock = async () => {
    try {
      await unblockUser.mutateAsync(username)
      onBlocked?.()
    } catch {
      // Error handled by mutation
    }
  }

  if (isBlocked) {
    return (
      <button
        onClick={handleUnblock}
        disabled={unblockUser.isPending}
        className="flex items-center gap-2 px-3 py-1.5 text-[11px] font-mono uppercase tracking-[0.1em] text-[#8A8F89] border border-white/[0.06] hover:bg-white/[0.03] transition-colors"
      >
        <UserCheck className="w-3 h-3" />
        {unblockUser.isPending ? 'Unblocking...' : 'Unblock'}
      </button>
    )
  }

  return (
    <>
      <button
        onClick={() => setShowConfirm(true)}
        className="flex items-center gap-2 px-3 py-1.5 text-[11px] font-mono uppercase tracking-[0.1em] text-[#555B55] border border-white/[0.06] hover:bg-white/[0.03] transition-colors"
      >
        <UserX className="w-3 h-3" />
        Block
      </button>

      <AnimatePresence>
        {showConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60"
            onClick={() => setShowConfirm(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2, ease }}
              className="w-full max-w-[360px] bg-[#0A0C0A] border border-white/[0.06] p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-[16px] font-bold text-[#F5F7F2]">Block @{username}?</h3>
                <button onClick={() => setShowConfirm(false)} className="text-[#555B55] hover:text-[#F5F7F2] transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <p className="text-[13px] text-[#8A8F89] mb-6">
                They won't be able to interact with you, and you won't see their activity.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={handleBlock}
                  disabled={blockUser.isPending}
                  className="flex-1 px-4 py-2.5 text-[11px] font-mono uppercase tracking-[0.1em] text-white bg-red-500 hover:bg-red-600 transition-colors disabled:opacity-50"
                >
                  {blockUser.isPending ? 'Blocking...' : 'Block User'}
                </button>
                <button
                  onClick={() => setShowConfirm(false)}
                  className="px-4 py-2.5 text-[11px] font-mono uppercase tracking-[0.1em] text-[#555B55] border border-white/[0.06] hover:bg-white/[0.03] transition-colors"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
