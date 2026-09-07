import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '../../auth/hooks/useAuth'
import { useUpdateProfile } from '../../../lib/hooks'

const ease = [0.22, 1, 0.36, 1] as const

const commonTech = [
  'React', 'TypeScript', 'Go', 'Rust', 'Python', 'Node.js',
  'PostgreSQL', 'Redis', 'Docker', 'AWS', 'Next.js', 'Tailwind',
]

export default function ProfileSettings() {
  const { user, refreshUser } = useAuth()
  const updateProfile = useUpdateProfile()
  const [displayName, setDisplayName] = useState('')
  const [bio, setBio] = useState('')
  const [location, setLocation] = useState('')
  const [website, setWebsite] = useState('')
  const [technologies, setTechnologies] = useState<string[]>([])
  const [techInput, setTechInput] = useState('')
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  useEffect(() => {
    if (user) {
      setDisplayName(user.displayName ?? '')
      setBio(user.bio ?? '')
      setLocation(user.location ?? '')
      setWebsite(user.website ?? '')
    }
  }, [user])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await updateProfile.mutateAsync({
        displayName,
        bio,
        location,
        website,
      } as any)
      await refreshUser()
      setMessage({ type: 'success', text: 'Profile updated successfully.' })
    } catch {
      setMessage({ type: 'error', text: 'Failed to update profile.' })
    }
  }

  const addTechnology = (tech: string) => {
    const trimmed = tech.trim()
    if (trimmed && !technologies.includes(trimmed)) {
      setTechnologies([...technologies, trimmed])
    }
    setTechInput('')
  }

  const removeTechnology = (tech: string) => {
    setTechnologies(technologies.filter((t) => t !== tech))
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease }}
    >
      <h2 className="text-[18px] font-bold tracking-[-0.03em] text-[#F5F7F2] mb-6">Profile</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="border border-white/[0.06] p-6 space-y-4">
          <h3 className="text-[13px] font-mono uppercase tracking-[0.15em] text-[#8A8F89] mb-4">
            Basic Information
          </h3>
          <div>
            <label className="block text-[11px] text-[#555B55] mb-1.5">Display Name</label>
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="w-full bg-white/[0.03] border border-white/[0.06] px-4 py-2.5 text-[14px] text-[#F5F7F2] outline-none focus:border-[#B6F34A]/30 transition-colors"
            />
          </div>
          <div>
            <label className="block text-[11px] text-[#555B55] mb-1.5">Bio</label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={3}
              className="w-full bg-white/[0.03] border border-white/[0.06] px-4 py-2.5 text-[14px] text-[#F5F7F2] outline-none focus:border-[#B6F34A]/30 transition-colors resize-none"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] text-[#555B55] mb-1.5">Location</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="City, Country"
                className="w-full bg-white/[0.03] border border-white/[0.06] px-4 py-2.5 text-[14px] text-[#F5F7F2] placeholder-[#303530] outline-none focus:border-[#B6F34A]/30 transition-colors"
              />
            </div>
            <div>
              <label className="block text-[11px] text-[#555B55] mb-1.5">Website</label>
              <input
                type="url"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                placeholder="https://..."
                className="w-full bg-white/[0.03] border border-white/[0.06] px-4 py-2.5 text-[14px] text-[#F5F7F2] placeholder-[#303530] outline-none focus:border-[#B6F34A]/30 transition-colors"
              />
            </div>
          </div>
        </div>

        <div className="border border-white/[0.06] p-6">
          <h3 className="text-[13px] font-mono uppercase tracking-[0.15em] text-[#8A8F89] mb-4">
            Technologies
          </h3>
          <div className="flex flex-wrap gap-2 mb-4">
            {technologies.map((tech) => (
              <span
                key={tech}
                className="flex items-center gap-1.5 text-[12px] text-[#B6F34A] border border-[#B6F34A]/20 px-2.5 py-1"
              >
                {tech}
                <button
                  type="button"
                  onClick={() => removeTechnology(tech)}
                  className="text-[#B6F34A]/50 hover:text-[#B6F34A]"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={techInput}
              onChange={(e) => setTechInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  addTechnology(techInput)
                }
              }}
              placeholder="Add technology..."
              className="flex-1 bg-white/[0.03] border border-white/[0.06] px-4 py-2 text-[13px] text-[#F5F7F2] placeholder-[#303530] outline-none focus:border-[#B6F34A]/30 transition-colors"
            />
            <motion.button
              type="button"
              onClick={() => addTechnology(techInput)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              className="px-3 py-2 text-[11px] font-mono uppercase tracking-[0.1em] text-[#555B55] border border-white/[0.06] hover:bg-white/[0.03] transition-colors"
            >
              Add
            </motion.button>
          </div>
          <div className="flex flex-wrap gap-1.5 mt-3">
            {commonTech
              .filter((t) => !technologies.includes(t))
              .slice(0, 8)
              .map((tech) => (
                <motion.button
                  key={tech}
                  type="button"
                  onClick={() => addTechnology(tech)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="text-[11px] text-[#303530] border border-white/[0.04] px-2 py-0.5 hover:text-[#555B55] hover:border-white/[0.08] transition-colors"
                >
                  + {tech}
                </motion.button>
              ))}
          </div>
        </div>

        {message && (
          <p className={`text-[13px] ${message.type === 'success' ? 'text-[#B6F34A]' : 'text-red-400'}`}>
            {message.text}
          </p>
        )}

        <motion.button
          type="submit"
          disabled={updateProfile.isPending}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="px-5 py-2.5 text-[12px] font-mono uppercase tracking-[0.1em] text-[#080A08] bg-[#B6F34A] hover:bg-[#c8ff66] transition-colors disabled:opacity-50"
        >
          {updateProfile.isPending ? 'Saving...' : 'Save Changes'}
        </motion.button>
      </form>
    </motion.div>
  )
}
