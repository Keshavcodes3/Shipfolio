import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Check, Loader2, Camera } from 'lucide-react'
import { useAuth } from '../../auth/hooks/useAuth'
import { useUpdateProfile } from '../../../lib/hooks'

const ease = [0.22, 1, 0.36, 1] as const

interface ProfileEditPanelProps {
  open: boolean
  onClose: () => void
}

export default function ProfileEditPanel({ open, onClose }: ProfileEditPanelProps) {
  const { user, refreshUser } = useAuth()
  const updateProfile = useUpdateProfile()

  const [name, setName] = useState('')
  const [username, setUsername] = useState('')
  const [bio, setBio] = useState('')
  const [location, setLocation] = useState('')
  const [websiteUrl, setWebsiteUrl] = useState('')
  const [saved, setSaved] = useState(false)
  const panelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (user && open) {
      setName(user.displayName ?? '')
      setUsername(user.username ?? '')
      setBio(user.bio ?? '')
      setLocation(user.location ?? '')
      setWebsiteUrl(user.website ?? '')
      setSaved(false)
    }
  }, [user, open])

  useEffect(() => {
    if (!open) return
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleEsc)
    return () => window.removeEventListener('keydown', handleEsc)
  }, [open, onClose])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await updateProfile.mutateAsync({
        name,
        username,
        bio: bio || null,
        location: location || null,
        websiteUrl: websiteUrl || null,
      } as any)
      await refreshUser()
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    } catch {
    }
  }

  const displayName = user?.username ?? user?.email?.split('@')[0] ?? 'Builder'
  const initial = displayName.charAt(0).toUpperCase()

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Panel */}
          <motion.div
            ref={panelRef}
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.25, ease }}
            className="fixed inset-y-0 right-0 z-[70] w-full max-w-[420px] bg-[#0C0E0C] border-l border-white/[0.06] overflow-y-auto"
          >
            {/* Header */}
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-white/[0.06] bg-[#0C0E0C]/90 backdrop-blur-md px-6 py-4">
              <span className="text-[11px] uppercase tracking-[0.2em] text-[#555B55] font-mono">Edit Profile</span>
              <button
                onClick={onClose}
                className="p-1.5 text-[#555B55] hover:text-[#F5F7F2] hover:bg-white/[0.04] transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="px-6 py-8">
              {/* Avatar */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.02, duration: 0.2, ease }}
                className="flex flex-col items-center mb-10"
              >
                <div className="relative group mb-4">
                  <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-white/[0.08] bg-white/[0.04]">
                    {user?.avatar ? (
                      <img src={user.avatar} alt={displayName} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[28px] font-bold text-[#B6F34A] font-mono">
                        {initial}
                      </div>
                    )}
                  </div>
                  <div className="absolute inset-0 rounded-full bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center cursor-pointer">
                    <Camera className="w-5 h-5 text-white" />
                  </div>
                </div>
                <p className="text-[13px] text-[#555B55]">Avatar is managed by your sign-in provider</p>
              </motion.div>

              {/* Fields */}
              <div className="space-y-6">
                {/* Name */}
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.03, duration: 0.2, ease }}
                >
                  <label className="block text-[10px] uppercase tracking-[0.2em] text-[#555B55] font-mono mb-2.5">Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-transparent border-b border-white/[0.08] pb-3 pt-1 text-[15px] text-[#F5F7F2] placeholder-[#303530] outline-none transition-colors duration-300 focus:border-[#B6F34A]/40"
                  />
                </motion.div>

                {/* Username */}
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.06, duration: 0.2, ease }}
                >
                  <label className="block text-[10px] uppercase tracking-[0.2em] text-[#555B55] font-mono mb-2.5">Username</label>
                  <div className="relative">
                    <span className="absolute left-0 top-1/2 -translate-y-1/2 text-[15px] text-[#303530] pointer-events-none">@</span>
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, ''))}
                      className="w-full bg-transparent border-b border-white/[0.08] pb-3 pt-1 pl-4 text-[15px] text-[#F5F7F2] placeholder-[#303530] outline-none transition-colors duration-300 focus:border-[#B6F34A]/40"
                    />
                  </div>
                </motion.div>

                {/* Bio */}
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.09, duration: 0.2, ease }}
                >
                  <label className="block text-[10px] uppercase tracking-[0.2em] text-[#555B55] font-mono mb-2.5">
                    Bio <span className="text-[#303530]">({bio.length}/500)</span>
                  </label>
                  <textarea
                    value={bio}
                    onChange={(e) => setBio(e.target.value.slice(0, 500))}
                    rows={3}
                    placeholder="Tell us about yourself..."
                    className="w-full bg-transparent border border-white/[0.06] p-3 text-[14px] text-[#F5F7F2] placeholder-[#303530] outline-none transition-colors duration-300 resize-none leading-relaxed focus:border-[#B6F34A]/20"
                  />
                </motion.div>

                {/* Location */}
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.12, duration: 0.2, ease }}
                >
                  <label className="block text-[10px] uppercase tracking-[0.2em] text-[#555B55] font-mono mb-2.5">Location</label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="City, Country"
                    className="w-full bg-transparent border-b border-white/[0.08] pb-3 pt-1 text-[15px] text-[#F5F7F2] placeholder-[#303530] outline-none transition-colors duration-300 focus:border-[#B6F34A]/40"
                  />
                </motion.div>

                {/* Website */}
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15, duration: 0.2, ease }}
                >
                  <label className="block text-[10px] uppercase tracking-[0.2em] text-[#555B55] font-mono mb-2.5">Website</label>
                  <input
                    type="url"
                    value={websiteUrl}
                    onChange={(e) => setWebsiteUrl(e.target.value)}
                    placeholder="https://yoursite.com"
                    className="w-full bg-transparent border-b border-white/[0.08] pb-3 pt-1 text-[15px] text-[#F5F7F2] placeholder-[#303530] outline-none transition-colors duration-300 focus:border-[#B6F34A]/40"
                  />
                </motion.div>
              </div>

              {/* Save button */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.18, duration: 0.2, ease }}
                className="mt-10"
              >
                <button
                  type="submit"
                  disabled={updateProfile.isPending}
                  className="w-full relative overflow-hidden group"
                >
                  <div className="flex items-center justify-center gap-2 px-6 py-3.5 bg-[#B6F34A] text-[12px] font-bold uppercase tracking-[0.12em] text-[#080A08] hover:bg-[#c8ff66] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed">
                    {updateProfile.isPending ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : saved ? (
                      <>
                        <Check className="w-4 h-4" />
                        Saved
                      </>
                    ) : (
                      'Save Changes'
                    )}
                  </div>
                </button>
              </motion.div>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
