import { useEffect, useState, useRef } from 'react'
import { motion, useMotionValue } from 'framer-motion'
import { ArrowRight, ArrowUpRight, Building2, Ship, Eye, RotateCcw } from 'lucide-react'
import { Link } from 'react-router'

const ease = [0.22, 1, 0.36, 1] as const

const stages = [
  { icon: Building2, label: 'BUILD', color: '#B6F34A' },
  { icon: Ship, label: 'SHIP', color: '#F5F7F2' },
  { icon: Eye, label: 'SHOW', color: '#B6F34A' },
  { icon: RotateCcw, label: 'REPEAT', color: '#8A8F89' },
]

const floatingProjects = [
  { name: 'Letterly', status: 'BUILDING', x: 10, y: 15, delay: 0 },
  { name: 'Orbit', status: 'SHIPPED', x: 75, y: 10, delay: 0.2 },
  { name: 'Pulse', status: 'BUILDING', x: 85, y: 55, delay: 0.4 },
  { name: 'Canvas', status: 'MAINTAINING', x: 5, y: 65, delay: 0.6 },
  { name: 'Relay', status: 'SHIPPED', x: 60, y: 70, delay: 0.8 },
]

function FloatingCard({ project, index }: { project: typeof floatingProjects[0]; index: number }) {
  const statusColors: Record<string, string> = {
    BUILDING: '#B6F34A',
    SHIPPED: '#F5F7F2',
    MAINTAINING: '#8A8F89',
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ delay: 1.2 + project.delay, duration: 0.8, ease }}
      className="absolute hidden lg:block"
      style={{ left: `${project.x}%`, top: `${project.y}%` }}
    >
      <motion.div
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 4 + index * 0.5, repeat: Infinity, ease: 'easeInOut' }}
        className="bg-[#0C0F0C] border border-white/[0.06] rounded-lg px-4 py-3 min-w-[140px]"
      >
        <div className="flex items-center gap-2 mb-2">
          <div
            className="w-1.5 h-1.5 rounded-full"
            style={{ backgroundColor: statusColors[project.status] }}
          />
          <span className="text-[12px] font-medium text-[#F5F7F2]">{project.name}</span>
        </div>
        <span className="text-[9px] font-mono tracking-[0.15em]" style={{ color: statusColors[project.status] }}>
          {project.status}
        </span>
      </motion.div>
    </motion.div>
  )
}

function StageIndicator() {
  const [active, setActive] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setActive((prev) => (prev + 1) % stages.length)
    }, 2500)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="flex items-center gap-3">
      {stages.map((stage, i) => {
        const Icon = stage.icon
        const isActive = i === active
        return (
          <motion.div
            key={stage.label}
            animate={{
              opacity: isActive ? 1 : 0.3,
              scale: isActive ? 1 : 0.9,
            }}
            transition={{ duration: 0.3 }}
            className="flex items-center gap-2"
          >
            <Icon size={14} style={{ color: isActive ? stage.color : '#555B55' }} />
            <span
              className="text-[10px] font-mono tracking-[0.2em] transition-colors duration-300"
              style={{ color: isActive ? stage.color : '#555B55' }}
            >
              {stage.label}
            </span>
          </motion.div>
        )
      })}
    </div>
  )
}

function GlowOrb() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <motion.div
        animate={{
          x: [0, 100, -50, 0],
          y: [0, -80, 60, 0],
          scale: [1, 1.2, 0.9, 1],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-1/4 right-1/4 w-[600px] h-[600px] rounded-full bg-[#B6F34A]/[0.03] blur-[200px]"
      />
      <motion.div
        animate={{
          x: [0, -80, 50, 0],
          y: [0, 60, -40, 0],
          scale: [1, 0.9, 1.1, 1],
        }}
        transition={{ duration: 25, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute bottom-1/4 left-1/4 w-[500px] h-[500px] rounded-full bg-[#B6F34A]/[0.02] blur-[180px]"
      />
    </div>
  )
}

function GridPattern() {
  return (
    <div className="absolute inset-0 pointer-events-none opacity-[0.015]">
      <div
        className="w-full h-full"
        style={{
          backgroundImage:
            'linear-gradient(rgba(245,247,242,1) 1px, transparent 1px), linear-gradient(90deg, rgba(245,247,242,1) 1px, transparent 1px)',
          backgroundSize: '80px 80px',
        }}
      />
    </div>
  )
}

export default function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null)
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    mouseX.set((e.clientX - rect.left) / rect.width)
    mouseY.set((e.clientY - rect.top) / rect.height)
  }

  return (
    <section
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="relative min-h-screen flex items-center overflow-hidden bg-[#080A08]"
    >
      <GridPattern />
      <GlowOrb />

      {/* Floating project cards */}
      {floatingProjects.map((project, i) => (
        <FloatingCard key={project.name} project={project} index={i} />
      ))}

      <div className="relative z-10 mx-auto w-full max-w-[1400px] px-6 md:px-10 py-32 md:py-0">
        <div className="max-w-[800px]">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3, ease }}
            className="mb-8"
          >
            <div className="inline-flex items-center gap-2 border border-white/[0.06] rounded-full px-4 py-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-[#B6F34A] animate-pulse" />
              <span className="text-[11px] font-mono tracking-[0.2em] text-[#8A8F89]">
                FOR BUILDERS WHO SHIP
              </span>
            </div>
          </motion.div>

          {/* Main headline */}
          <div className="mb-8">
            {['STOP HIDING', 'BEHIND', 'YOUR COMMITS.'].map((line, i) => (
              <motion.div
                key={line}
                initial={{ y: 80, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 + i * 0.12, duration: 0.8, ease }}
                className="overflow-hidden"
              >
                <h1
                  className={`leading-[0.88] tracking-[-0.04em] ${
                    i === 1
                      ? 'text-[clamp(2rem,5vw,4rem)] font-light text-[#555B55]'
                      : 'text-[clamp(3rem,8vw,7.5rem)] font-bold text-[#F5F7F2]'
                  }`}
                >
                  {line}
                </h1>
              </motion.div>
            ))}
          </div>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.9, ease }}
            className="text-[clamp(1rem,1.8vw,1.25rem)] text-[#8A8F89] leading-relaxed mb-12 max-w-[500px]"
          >
            Your code is not your story. Your portfolio should show the craft,
            the decisions, and the things you are proud of.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 1.1, ease }}
            className="flex flex-wrap items-center gap-4 mb-16"
          >
            <Link
              to="/register"
              className="group inline-flex items-center gap-2 bg-[#B6F34A] text-[#080A08] px-7 py-3.5 text-[13px] font-semibold rounded-md hover:bg-[#B6F34A]/90 transition-all duration-200"
            >
              Start building
              <ArrowRight size={15} className="transition-transform duration-200 group-hover:translate-x-0.5" />
            </Link>
            <Link
              to="/discover"
              className="group inline-flex items-center gap-2 border border-white/[0.08] text-[#8A8F89] px-7 py-3.5 text-[13px] rounded-md hover:border-white/[0.15] hover:text-[#F5F7F2] transition-all duration-200"
            >
              Explore builders
              <ArrowUpRight size={15} className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </motion.div>

          {/* Stage indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 1.4 }}
          >
            <StageIndicator />
          </motion.div>
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#080A08] to-transparent" />
    </section>
  )
}
