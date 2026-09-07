import { useState } from 'react'
import { motion } from 'framer-motion'
import { AlertTriangle, Trash2 } from 'lucide-react'
import { useAuth } from '../../auth/hooks/useAuth'
import { useDeleteAccount } from '../../../lib/hooks'

const ease = [0.22, 1, 0.36, 1] as const

export default function DangerZoneSettings() {
  const { logout } = useAuth()
  const deleteAccount = useDeleteAccount()
  const [confirmText, setConfirmText] = useState('')
  const [step, setStep] = useState<'initial' | 'confirm'>('initial')

  const handleDelete = async () => {
    if (confirmText !== 'DELETE') return
    try {
      await deleteAccount.mutateAsync()
      await logout()
    } catch {
      // Error handled by mutation
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease }}
    >
      <h2 className="text-[18px] font-bold tracking-[-0.03em] text-[#F5F7F2] mb-6">Danger Zone</h2>

      <div className="border border-red-400/20 p-6">
        <div className="flex items-start gap-4">
          <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
          <div className="flex-1">
            <h3 className="text-[15px] font-bold text-[#F5F7F2] mb-2">Delete Account</h3>
            <p className="text-[13px] text-[#555B55] mb-4">
              Permanently delete your account and all associated data. This action cannot be undone.
            </p>

            {step === 'initial' ? (
              <motion.button
                onClick={() => setStep('confirm')}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center gap-2 px-4 py-2 text-[11px] font-mono uppercase tracking-[0.1em] text-red-400 border border-red-400/20 hover:bg-red-400/5 transition-colors"
              >
                <Trash2 className="w-3 h-3" />
                Delete Account
              </motion.button>
            ) : (
              <div className="space-y-4">
                <p className="text-[13px] text-[#8A8F89]">
                  Type <span className="font-mono text-red-400">DELETE</span> to confirm:
                </p>
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="text"
                    value={confirmText}
                    onChange={(e) => setConfirmText(e.target.value)}
                    placeholder="DELETE"
                    className="flex-1 sm:max-w-[200px] bg-white/[0.03] border border-red-400/20 px-4 py-2 text-[14px] text-[#F5F7F2] placeholder-[#303530] outline-none focus:border-red-400/40 transition-colors"
                  />
                  <motion.button
                    onClick={handleDelete}
                    disabled={confirmText !== 'DELETE' || deleteAccount.isPending}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                    className="px-4 py-2 text-[11px] font-mono uppercase tracking-[0.1em] text-white bg-red-500 hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {deleteAccount.isPending ? 'Deleting...' : 'Confirm Delete'}
                  </motion.button>
                  <motion.button
                    onClick={() => { setStep('initial'); setConfirmText('') }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                    className="px-4 py-2 text-[11px] font-mono uppercase tracking-[0.1em] text-[#555B55] border border-white/[0.06] hover:bg-white/[0.03] transition-colors"
                  >
                    Cancel
                  </motion.button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  )
}
