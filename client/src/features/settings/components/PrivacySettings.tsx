import { useState } from 'react'
import { motion } from 'framer-motion'
import { useUpdateProfile } from '../../../lib/hooks'
import { useAuth } from '../../auth/hooks/useAuth'

const ease = [0.22, 1, 0.36, 1] as const

interface PrivacyOption {
  key: string
  label: string
  description: string
}

const privacyOptions: PrivacyOption[] = [
  { key: 'profileVisibility', label: 'Profile Visibility', description: 'Control who can see your profile' },
  { key: 'projectVisibility', label: 'Project Visibility', description: 'Default visibility for new projects' },
  { key: 'activityVisibility', label: 'Activity Visibility', description: 'Show your activity on your profile' },
  { key: 'githubVisibility', label: 'GitHub Activity', description: 'Show GitHub activity on your profile' },
]

export default function PrivacySettings() {
  const { refreshUser } = useAuth()
  const updateProfile = useUpdateProfile()
  const [settings, setSettings] = useState({
    profileVisibility: 'PUBLIC',
    projectVisibility: 'PUBLIC',
    activityVisibility: 'SHOW',
    githubVisibility: 'SHOW',
  })
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const handleToggle = async (key: string, value: string) => {
    const newSettings = { ...settings, [key]: value }
    setSettings(newSettings)
    try {
      await updateProfile.mutateAsync({ [key]: value })
      await refreshUser()
      setMessage({ type: 'success', text: 'Privacy settings updated.' })
    } catch {
      setMessage({ type: 'error', text: 'Failed to update settings.' })
      setSettings(settings)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease }}
    >
      <h2 className="text-[18px] font-bold tracking-[-0.03em] text-[#F5F7F2] mb-6">Privacy</h2>

      <div className="space-y-4">
        {privacyOptions.map(({ key, label, description }) => (
          <div key={key} className="border border-white/[0.06] p-5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-[14px] font-bold text-[#F5F7F2]">{label}</h3>
                <p className="text-[12px] text-[#555B55] mt-0.5">{description}</p>
              </div>
              <select
                value={settings[key as keyof typeof settings]}
                onChange={(e) => handleToggle(key, e.target.value)}
                className="bg-white/[0.03] border border-white/[0.06] px-3 py-1.5 text-[13px] text-[#F5F7F2] outline-none focus:border-[#B6F34A]/30 transition-colors cursor-pointer"
              >
                {key === 'profileVisibility' || key === 'projectVisibility' ? (
                  <>
                    <option value="PUBLIC">Public</option>
                    <option value="PRIVATE">Private</option>
                  </>
                ) : (
                  <>
                    <option value="SHOW">Show</option>
                    <option value="HIDE">Hide</option>
                  </>
                )}
              </select>
            </div>
          </div>
        ))}
      </div>

      {message && (
        <p className={`text-[13px] mt-4 ${message.type === 'success' ? 'text-[#B6F34A]' : 'text-red-400'}`}>
          {message.text}
        </p>
      )}

      <div className="mt-8 p-5 border border-white/[0.06] bg-white/[0.01]">
        <h3 className="text-[13px] font-mono uppercase tracking-[0.15em] text-[#8A8F89] mb-2">
          About Privacy
        </h3>
        <p className="text-[13px] text-[#555B55] leading-relaxed">
          Privacy settings are enforced at the server level. Private resources are not returned in API responses to unauthorized users.
          Changing these settings immediately affects what others can see.
        </p>
      </div>
    </motion.div>
  )
}
