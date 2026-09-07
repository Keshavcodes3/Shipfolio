import { motion } from 'framer-motion'
import { Plus } from 'lucide-react'
import { Link } from 'react-router'
import { useAuth } from '../../auth/hooks/useAuth'

const ease = [0.22, 1, 0.36, 1] as const

function getGreeting(): string {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning.'
  if (hour < 18) return 'Good afternoon.'
  return 'Good evening.'
}

export default function WelcomeSection() {
  const { user } = useAuth()
  const displayName = user?.displayName || user?.username || user?.email?.split('@')[0] || 'Builder'

  return (
    <section className="relative px-6 pt-10 pb-8 md:px-8 md:pt-14 md:pb-10">
      {/* Greeting */}
      <motion.p
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1, ease }}
        className="text-[11px] uppercase tracking-[0.25em] text-[#555B55] font-mono mb-4"
      >
        {getGreeting()}
      </motion.p>

      {/* Main headline */}
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.2, ease }}
        className="text-[clamp(2rem,5vw,3.5rem)] font-bold tracking-[-0.05em] leading-[1.05] text-[#F5F7F2] mb-3"
      >
        What are you
        <br />
        building<span className="text-[#B6F34A]">?</span>
      </motion.h1>

      {/* Supporting text */}
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.35, ease }}
        className="text-[14px] text-[#8A8F89] max-w-md mb-8"
      >
        Keep your projects, progress and shipped work close, {displayName}.
      </motion.p>

      {/* CTA */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.45, ease }}
      >
        <Link
          to="/projects/new"
          className="group inline-flex items-center gap-2 bg-[#F5F7F2] px-5 py-2.5 text-[12px] font-medium uppercase tracking-[0.1em] text-[#080A08] transition-colors duration-200 hover:bg-[#E5E8DF]"
        >
          <Plus className="h-3.5 w-3.5" />
          New project
        </Link>
      </motion.div>
    </section>
  )
}
