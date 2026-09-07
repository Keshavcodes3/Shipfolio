import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Heart, X } from 'lucide-react'
import { useExpressInterest, useWithdrawInterest } from '../../../lib/hooks'
import type { ProjectNeed, NeedInterest } from '../types/projectNeed'
import { NEED_TYPE_LABELS } from '../types/projectNeed'

interface NeedInterestButtonProps {
  need: ProjectNeed & { interests?: NeedInterest[] }
  projectId: string
  currentUserId?: string
  isOwner: boolean
}

export default function NeedInterestButton({ need, projectId, currentUserId, isOwner }: NeedInterestButtonProps) {
  const expressInterest = useExpressInterest()
  const withdrawInterest = useWithdrawInterest()

  const [showForm, setShowForm] = useState(false)
  const [message, setMessage] = useState('')

  const hasExpressedInterest = need.interests?.some((i) => i.userId === currentUserId)

  const handleExpress = async () => {
    await expressInterest.mutateAsync({
      projectId,
      needId: need.id,
      message: message.trim() || null,
    })
    setMessage('')
    setShowForm(false)
  }

  const handleWithdraw = async () => {
    await withdrawInterest.mutateAsync({ projectId, needId: need.id })
  }

  // Owner can't express interest in their own need
  if (isOwner) return null

  // Not logged in
  if (!currentUserId) return null

  return (
    <div className="relative">
      {hasExpressedInterest ? (
        <motion.button
          onClick={handleWithdraw}
          disabled={withdrawInterest.isPending}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex items-center gap-2 px-4 py-2 text-[11px] font-medium uppercase tracking-[0.1em] text-[#B6F34A] border border-[#B6F34A]/30 bg-[#B6F34A]/[0.05] hover:bg-[#B6F34A]/[0.1] transition-all duration-200"
        >
          <Heart className="w-3.5 h-3.5 fill-current" />
          {withdrawInterest.isPending ? 'Withdrawing...' : 'Interested'}
        </motion.button>
      ) : (
        <>
          <motion.button
            onClick={() => setShowForm(!showForm)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center gap-2 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.1em] text-[#080A08] bg-[#B6F34A] hover:bg-[#c8ff66] transition-all duration-200"
          >
            <Heart className="w-3.5 h-3.5" />
            I CAN HELP
          </motion.button>

          <AnimatePresence>
            {showForm && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.95 }}
                className="absolute top-full left-0 mt-2 w-72 border border-[#B6F34A]/20 bg-[#080A08] p-4 shadow-xl z-20"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[11px] font-mono uppercase tracking-[0.12em] text-[#B6F34A]">
                    Express Interest
                  </span>
                  <button onClick={() => setShowForm(false)} className="text-[#555B55] hover:text-[#8A8F89]">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
                <p className="text-[12px] text-[#555B55] mb-3">
                  Offer to help with <span className="text-[#F5F7F2]">{NEED_TYPE_LABELS[need.type]}</span> on this project?
                </p>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value.slice(0, 280))}
                  rows={2}
                  className="w-full bg-transparent border border-white/[0.08] p-2 text-[12px] text-[#F5F7F2] placeholder-[#303530] outline-none resize-none focus:border-[#B6F34A]/30 transition-colors mb-3"
                  placeholder="Optional message..."
                />
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => setShowForm(false)}
                    className="text-[10px] uppercase tracking-wider text-[#555B55] hover:text-[#8A8F89]"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleExpress}
                    disabled={expressInterest.isPending}
                    className="px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.1em] text-[#080A08] bg-[#B6F34A] hover:bg-[#c8ff66] transition-colors disabled:opacity-30"
                  >
                    {expressInterest.isPending ? 'Sending...' : 'Send'}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}
    </div>
  )
}
