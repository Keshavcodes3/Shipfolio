import { motion } from 'framer-motion'
import { MapPin, Mail } from 'lucide-react'

const ease = [0.22, 1, 0.36, 1] as const

interface ProfileIdentityProps {
  username: string
  headline: string
  bio: string
  location: string
  avatarUrl?: string | null
  links: { github: string; twitter: string; email: string }
}

export default function ProfileIdentity({ username, headline, bio, location, avatarUrl, links }: ProfileIdentityProps) {
  return (
    <section className="relative">
      {/* Avatar + Username row */}
      <div className="flex items-center gap-4 mb-5">
        {/* Avatar */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.05, duration: 0.5, ease }}
          className="w-14 h-14 rounded-full overflow-hidden border border-white/[0.08] bg-white/[0.04] shrink-0"
        >
          {avatarUrl ? (
            <img src={avatarUrl} alt={username} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-[20px] font-bold text-[#555B55] font-mono">
              {username.charAt(0).toUpperCase()}
            </div>
          )}
        </motion.div>

        {/* Username badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1, duration: 0.5, ease }}
          className="inline-flex items-center gap-2 border border-[#B6F34A]/20 bg-[#B6F34A]/[0.04] px-3 py-1.5"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#B6F34A] animate-pulse" />
          <span className="text-[10px] uppercase tracking-[0.2em] text-[#B6F34A] font-mono">
            @{username}
          </span>
        </motion.div>
      </div>

      {/* Name */}
      <motion.h1
        initial={{ opacity: 0, y: 16, filter: 'blur(6px)' }}
        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        transition={{ delay: 0.2, duration: 0.7, ease }}
        className="text-[clamp(2rem,6vw,4rem)] font-black tracking-[-0.06em] leading-[0.9] text-[#F5F7F2] mb-4"
      >
        {headline}
      </motion.h1>

      {/* Bio */}
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.6, ease }}
        className="text-[14px] text-[#8A8F89] leading-relaxed max-w-[480px] mb-4"
      >
        {bio}
      </motion.p>

      {/* Location + Links row */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.55, duration: 0.5, ease }}
        className="flex flex-wrap items-center gap-3 text-[11px] text-[#555B55]"
      >
        {location && (
          <span className="flex items-center gap-1.5">
            <MapPin className="w-3 h-3" />
            {location}
          </span>
        )}
        {location && links.github && <span className="text-[#1a1c1c]">·</span>}
        {links.github && (
          <a href={links.github} target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-1.5 hover:text-[#F5F7F2] transition-colors duration-200">
            GitHub
          </a>
        )}
        {links.github && links.email && <span className="text-[#1a1c1c]">·</span>}
        {links.email && (
          <a href={links.email} target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-1.5 hover:text-[#F5F7F2] transition-colors duration-200">
            <Mail className="w-3 h-3" />
            Email
          </a>
        )}
      </motion.div>
    </section>
  )
}
