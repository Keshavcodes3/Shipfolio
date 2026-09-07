import { useRef } from 'react'
import { motion, useInView, useScroll, useTransform } from 'framer-motion'
import { ArrowUpRight, GitCommitHorizontal, Rocket, Folder, Star } from 'lucide-react'

const ease = [0.22, 1, 0.36, 1] as const

const timeline = [
  {
    year: '2026',
    project: 'Letterly',
    role: 'Currently building',
    technologies: ['React', 'Node.js', 'PostgreSQL'],
    status: 'BUILDING' as const,
  },
  {
    year: '2025',
    project: 'FounderHQ',
    role: 'Shipped',
    technologies: ['React', 'FastAPI', 'Python'],
    status: 'SHIPPED' as const,
  },
  {
    year: '2025',
    project: 'Perplexity++',
    role: 'Shipped',
    technologies: ['Next.js', 'AI', 'TypeScript'],
    status: 'SHIPPED' as const,
  },
]

const activityEvents = [
  { text: 'shipped Letterly v0.3', time: '2h ago', icon: Rocket },
  { text: 'added GitHub integration', time: '1d ago', icon: GitCommitHorizontal },
  { text: 'launched FounderHQ', time: '3d ago', icon: Folder },
  { text: 'started Shipfolio', time: '1w ago', icon: Star },
]

const technologies = ['TypeScript', 'React', 'Node.js', 'Python', 'PostgreSQL', 'Redis', 'Next.js', 'FastAPI']

const statusColors: Record<string, { dot: string; text: string }> = {
  BUILDING: { dot: 'bg-[#B6F34A]', text: 'text-[#B6F34A]' },
  SHIPPED: { dot: 'bg-[#F5F7F2]', text: 'text-[#F5F7F2]' },
  MAINTAINING: { dot: 'bg-[#B6F34A]', text: 'text-[#B6F34A]' },
}

const stats = [
  { label: 'Projects', value: '4' },
  { label: 'Shipped', value: '2' },
  { label: 'Commits', value: '847' },
  { label: 'Stars', value: '126' },
]

function GithubIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
    </svg>
  )
}

export default function ProfilePreview() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const profileRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(sectionRef, { once: true, margin: '-10%' })
  const profileInView = useInView(profileRef, { once: true, margin: '-5%' })

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  })

  const profileRotateX = useTransform(scrollYProgress, [0.1, 0.4], [6, 0])
  const profileOpacity = useTransform(scrollYProgress, [0.1, 0.3], [0.5, 1])
  const profileScale = useTransform(scrollYProgress, [0.1, 0.4], [0.96, 1])

  return (
    <section ref={sectionRef} className="relative py-32 md:py-48 overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-px bg-white/[0.06]" />

      <div className="mx-auto max-w-[900px] px-6 md:px-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease }}
          className="text-center mb-16 md:mb-20"
        >
          <p className="text-[11px] tracking-[0.25em] uppercase text-neutral-600 font-mono mb-6">
            Your profile
          </p>
          <h2 className="text-[clamp(2rem,5vw,3.2rem)] font-bold text-white tracking-tight leading-[1.1] mb-5">
            Make your work
            <br />
            <span className="text-neutral-500">recognizable.</span>
          </h2>
          <p className="text-[clamp(0.9rem,1.5vw,1.05rem)] text-neutral-500 leading-relaxed max-w-md mx-auto">
            Not a resume. Not a GitHub profile. A record of what you actually build.
          </p>
        </motion.div>

        {/* Profile Card */}
        <motion.div
          ref={profileRef}
          style={{
            rotateX: profileRotateX,
            opacity: profileOpacity,
            scale: profileScale,
            transformPerspective: 1200,
          }}
          className="relative"
        >
          <div className="relative rounded-2xl overflow-hidden border border-white/[0.08] bg-[#080A08]">
            {/* Window chrome */}
            <div className="flex items-center gap-2 px-4 py-2.5 border-b border-white/[0.04]">
              <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-white/[0.06]" />
                <div className="w-2.5 h-2.5 rounded-full bg-white/[0.06]" />
                <div className="w-2.5 h-2.5 rounded-full bg-white/[0.06]" />
              </div>
              <div className="flex-1 flex justify-center">
                <span className="text-[10px] font-mono text-neutral-600">shipfolio.dev/keshav</span>
              </div>
              <GithubIcon className="w-3.5 h-3.5 text-neutral-600" />
            </div>

            {/* Profile Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={profileInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.3, ease }}
              className="p-6 md:p-8"
            >
              <div className="flex items-center gap-4 mb-6">
                {/* Avatar */}
                <div className="relative shrink-0">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-white/[0.1] to-white/[0.02] border border-white/[0.1] flex items-center justify-center text-white font-bold text-lg">
                    K
                  </div>
                  <motion.div
                    className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-[#B6F34A] border-2 border-[#080A08]"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                  />
                </div>
                <div>
                  <p className="text-[12px] font-mono text-neutral-500">@keshav</p>
                  <p className="text-white font-medium text-[14px] leading-snug mt-0.5">
                    Building things that probably shouldn&apos;t exist yet.
                  </p>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-4 gap-3">
                {stats.map((stat, i) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 8 }}
                    animate={profileInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.4, delay: 0.5 + i * 0.06, ease }}
                    className="text-center py-2 rounded-lg bg-white/[0.02]"
                  >
                    <p className="text-base font-bold text-white">{stat.value}</p>
                    <p className="text-[9px] font-mono text-neutral-600 uppercase tracking-wider">{stat.label}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Currently Building */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={profileInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.6, ease }}
              className="px-6 md:px-8 py-5 border-t border-white/[0.04]"
            >
              <p className="text-[9px] tracking-[0.2em] uppercase text-neutral-600 font-mono mb-2.5">
                Currently building
              </p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="relative">
                    <motion.div
                      className="w-2 h-2 rounded-full bg-[#B6F34A]"
                      animate={{ opacity: [1, 0.3, 1] }}
                      transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                    />
                    <motion.div
                      className="absolute inset-0 rounded-full bg-[#B6F34A]/30"
                      animate={{ scale: [1, 2.5, 1], opacity: [0.5, 0, 0.5] }}
                      transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                    />
                  </div>
                  <span className="text-white font-semibold text-[14px]">Letterly</span>
                  <span className="text-[#B6F34A] text-[10px] font-mono">BUILDING</span>
                </div>
                <ArrowUpRight className="w-4 h-4 text-neutral-600" />
              </div>
              <p className="text-[12px] text-neutral-500 mt-2 ml-4.5">
                An asynchronous letter platform for slower conversations.
              </p>
            </motion.div>

            {/* Timeline */}
            <div className="px-6 md:px-8 py-5 border-t border-white/[0.04]">
              <p className="text-[9px] tracking-[0.2em] uppercase text-neutral-600 font-mono mb-4">
                Timeline
              </p>
              <div className="relative">
                <motion.div
                  className="absolute left-[4px] top-1 bottom-1 w-px bg-white/[0.06]"
                  style={{ transformOrigin: 'top' }}
                  initial={{ scaleY: 0 }}
                  animate={profileInView ? { scaleY: 1 } : {}}
                  transition={{ duration: 1, delay: 0.8, ease }}
                />

                <div className="space-y-4">
                  {timeline.map((item, i) => {
                    const colors = statusColors[item.status]
                    return (
                      <motion.div
                        key={item.project}
                        initial={{ opacity: 0, x: -8 }}
                        animate={profileInView ? { opacity: 1, x: 0 } : {}}
                        transition={{ duration: 0.4, delay: 0.9 + i * 0.12, ease }}
                        className="flex gap-3.5 group"
                      >
                        <div className="relative z-10 mt-[7px]">
                          <div className={`w-2 h-2 rounded-full border-[1.5px] border-[#080A08] ${colors.dot}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <span className="text-[13px] text-white font-medium">{item.project}</span>
                            <span className="text-[10px] font-mono text-neutral-600">{item.year}</span>
                          </div>
                          <p className={`text-[11px] font-mono ${colors.text} mt-0.5`}>{item.role}</p>
                          <div className="flex flex-wrap gap-1 mt-1.5">
                            {item.technologies.map((tech) => (
                              <span key={tech} className="px-1.5 py-0.5 text-[9px] font-mono text-neutral-500 bg-white/[0.04] rounded">
                                {tech}
                              </span>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    )
                  })}
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="px-6 md:px-8 py-5 border-t border-white/[0.04]">
              <p className="text-[9px] tracking-[0.2em] uppercase text-neutral-600 font-mono mb-3">
                Recent activity
              </p>
              <div className="space-y-1">
                {activityEvents.map((event, i) => {
                  const Icon = event.icon
                  return (
                    <motion.div
                      key={event.text}
                      initial={{ opacity: 0, x: -6 }}
                      animate={profileInView ? { opacity: 1, x: 0 } : {}}
                      transition={{ duration: 0.35, delay: 1.2 + i * 0.08, ease }}
                      className="flex items-center gap-2.5 py-1.5 group"
                    >
                      <Icon className="w-3 h-3 text-neutral-600 shrink-0" />
                      <span className="text-[12px] text-neutral-400 flex-1">{event.text}</span>
                      <span className="text-[10px] font-mono text-neutral-600 shrink-0">{event.time}</span>
                    </motion.div>
                  )
                })}
              </div>
            </div>

            {/* Technologies */}
            <div className="px-6 md:px-8 py-5 border-t border-white/[0.04]">
              <p className="text-[9px] tracking-[0.2em] uppercase text-neutral-600 font-mono mb-3">
                Technologies
              </p>
              <div className="flex flex-wrap gap-1.5">
                {technologies.map((tech, i) => (
                  <motion.span
                    key={tech}
                    initial={{ opacity: 0, y: 4 }}
                    animate={profileInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.3, delay: 1.4 + i * 0.03, ease }}
                    className="px-2 py-1 text-[10px] font-mono text-neutral-500 border border-white/[0.05] rounded"
                  >
                    {tech}
                  </motion.span>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
