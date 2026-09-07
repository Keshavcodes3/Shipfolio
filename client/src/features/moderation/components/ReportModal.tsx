import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Flag } from 'lucide-react'
import { useReport } from '../../../lib/hooks'

const ease = [0.22, 1, 0.36, 1] as const

const reportReasons = [
  { value: 'spam', label: 'Spam' },
  { value: 'harassment', label: 'Harassment' },
  { value: 'impersonation', label: 'Impersonation' },
  { value: 'malicious', label: 'Malicious content' },
  { value: 'copyright', label: 'Copyright infringement' },
  { value: 'other', label: 'Other' },
]

interface ReportModalProps {
  isOpen: boolean
  onClose: () => void
  targetType: 'project' | 'profile'
  targetId: string
  targetName: string
}

export default function ReportModal({ isOpen, onClose, targetType, targetId, targetName }: ReportModalProps) {
  const [reason, setReason] = useState('')
  const [description, setDescription] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const report = useReport()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!reason) return
    try {
      await report.mutateAsync({ targetType, targetId, reason, description })
      setSubmitted(true)
    } catch {
      // Error handled by mutation
    }
  }

  const handleClose = () => {
    setReason('')
    setDescription('')
    setSubmitted(false)
    onClose()
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60"
          onClick={handleClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2, ease }}
            className="w-full max-w-[420px] bg-[#0A0C0A] border border-white/[0.06] p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <Flag className="w-5 h-5 text-[#B6F34A]" />
                <h3 className="text-[16px] font-bold text-[#F5F7F2]">Report {targetType}</h3>
              </div>
              <button onClick={handleClose} className="text-[#555B55] hover:text-[#F5F7F2] transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            {submitted ? (
              <div className="text-center py-8">
                <p className="text-[14px] text-[#B6F34A] mb-2">Report submitted</p>
                <p className="text-[13px] text-[#555B55]">
                  Thank you for helping keep Shipfolio safe.
                </p>
                <button
                  onClick={handleClose}
                  className="mt-6 px-4 py-2 text-[12px] font-mono uppercase tracking-[0.1em] text-[#080A08] bg-[#B6F34A] hover:bg-[#c8ff66] transition-colors"
                >
                  Done
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <p className="text-[13px] text-[#8A8F89]">
                  Reporting {targetName}. Select a reason:
                </p>

                <div className="space-y-2">
                  {reportReasons.map(({ value, label }) => (
                    <label key={value} className="flex items-center gap-3 cursor-pointer group">
                      <input
                        type="radio"
                        name="reason"
                        value={value}
                        checked={reason === value}
                        onChange={(e) => setReason(e.target.value)}
                        className="w-4 h-4 accent-[#B6F34A]"
                      />
                      <span className="text-[13px] text-[#8A8F89] group-hover:text-[#F5F7F2] transition-colors">
                        {label}
                      </span>
                    </label>
                  ))}
                </div>

                <div>
                  <label className="block text-[11px] text-[#555B55] mb-1.5">
                    Additional details (optional)
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={3}
                    placeholder="Provide any additional context..."
                    className="w-full bg-white/[0.03] border border-white/[0.06] px-4 py-2.5 text-[13px] text-[#F5F7F2] placeholder-[#303530] outline-none focus:border-[#B6F34A]/30 transition-colors resize-none"
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="submit"
                    disabled={!reason || report.isPending}
                    className="flex-1 px-4 py-2.5 text-[11px] font-mono uppercase tracking-[0.1em] text-[#080A08] bg-[#B6F34A] hover:bg-[#c8ff66] transition-colors disabled:opacity-50"
                  >
                    {report.isPending ? 'Submitting...' : 'Submit Report'}
                  </button>
                  <button
                    type="button"
                    onClick={handleClose}
                    className="px-4 py-2.5 text-[11px] font-mono uppercase tracking-[0.1em] text-[#555B55] border border-white/[0.06] hover:bg-white/[0.03] transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
