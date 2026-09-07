import { useState } from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '../../auth/hooks/useAuth'
import { useChangePassword } from '../../../lib/hooks'

const ease = [0.22, 1, 0.36, 1] as const

export default function AccountSettings() {
  const { user } = useAuth()
  const changePassword = useChangePassword()
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault()
    if (newPassword !== confirmPassword) {
      setMessage({ type: 'error', text: 'Passwords do not match.' })
      return
    }
    try {
      await changePassword.mutateAsync({ currentPassword, newPassword })
      setMessage({ type: 'success', text: 'Password updated successfully.' })
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
    } catch {
      setMessage({ type: 'error', text: 'Failed to update password.' })
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease }}
    >
      <h2 className="text-[18px] font-bold tracking-[-0.03em] text-[#F5F7F2] mb-6">Account</h2>

      <div className="space-y-8">
        <div className="border border-white/[0.06] p-6">
          <h3 className="text-[13px] font-mono uppercase tracking-[0.15em] text-[#8A8F89] mb-4">
            Account Information
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-[11px] text-[#555B55] mb-1.5">Email</label>
              <p className="text-[14px] text-[#F5F7F2]">{user?.email ?? 'Not set'}</p>
            </div>
            <div>
              <label className="block text-[11px] text-[#555B55] mb-1.5">Username</label>
              <p className="text-[14px] text-[#F5F7F2]">@{user?.username ?? 'Not set'}</p>
            </div>
            <div>
              <label className="block text-[11px] text-[#555B55] mb-1.5">Member since</label>
              <p className="text-[14px] text-[#F5F7F2]">
                {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Unknown'}
              </p>
            </div>
          </div>
        </div>

        <div className="border border-white/[0.06] p-6">
          <h3 className="text-[13px] font-mono uppercase tracking-[0.15em] text-[#8A8F89] mb-4">
            Change Password
          </h3>
          <form onSubmit={handlePasswordChange} className="space-y-4">
            <div>
              <label className="block text-[11px] text-[#555B55] mb-1.5">Current Password</label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full bg-white/[0.03] border border-white/[0.06] px-4 py-2.5 text-[14px] text-[#F5F7F2] outline-none focus:border-[#B6F34A]/30 transition-colors"
                required
              />
            </div>
            <div>
              <label className="block text-[11px] text-[#555B55] mb-1.5">New Password</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full bg-white/[0.03] border border-white/[0.06] px-4 py-2.5 text-[14px] text-[#F5F7F2] outline-none focus:border-[#B6F34A]/30 transition-colors"
                required
                minLength={8}
              />
            </div>
            <div>
              <label className="block text-[11px] text-[#555B55] mb-1.5">Confirm Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full bg-white/[0.03] border border-white/[0.06] px-4 py-2.5 text-[14px] text-[#F5F7F2] outline-none focus:border-[#B6F34A]/30 transition-colors"
                required
                minLength={8}
              />
            </div>
            {message && (
              <p className={`text-[13px] ${message.type === 'success' ? 'text-[#B6F34A]' : 'text-red-400'}`}>
                {message.text}
              </p>
            )}
            <motion.button
              type="submit"
              disabled={changePassword.isPending}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-4 py-2 text-[12px] font-mono uppercase tracking-[0.1em] text-[#080A08] bg-[#B6F34A] hover:bg-[#c8ff66] transition-colors disabled:opacity-50"
            >
              {changePassword.isPending ? 'Updating...' : 'Update Password'}
            </motion.button>
          </form>
        </div>
      </div>
    </motion.div>
  )
}
