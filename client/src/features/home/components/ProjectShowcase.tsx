import { useRef, useState } from 'react'
import { motion, useInView, useMotionValue, useTransform } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router'

const ease = [0.22, 1, 0.36, 1] as const

type ProjectStatus = 'BUILDING' | 'SHIPPED' | 'MAINTAINING'

interface Project {
  id: string
  number: string
  name: string
  description: string
  status: ProjectStatus
  technologies: string[]
  year: string
  visual: 'mark' | 'bars' | 'number' | 'grid'
}

const projects: Project[] = [
  {
    id: 'letterly',
    number: '01',
    name: 'Letterly',
    description: 'A slower way to talk to people across the world.',
    status: 'BUILDING',
    technologies: ['React', 'Node.js', 'PostgreSQL'],
    year: '2026',
    visual: 'mark',
  },
  {
    id: 'orbit',
    number: '02',
    name: 'Orbit',
    description: 'A visual workspace for exploring ideas.',
    status: 'SHIPPED',
    technologies: ['TypeScript', 'WebGL', 'React'],
    year: '2026',
    visual: 'bars',
  },
  {
    id: 'pulse',
    number: '03',
    name: 'Pulse',
    description: 'Observability without the dashboard overload.',
    status: 'BUILDING',
    technologies: ['Go', 'PostgreSQL', 'ClickHouse'],
    year: '2026',
    visual: 'number',
  },
  {
    id: 'canvas',
    number: '04',
    name: 'Canvas',
    description: 'Turn rough ideas into structured notes.',
    status: 'MAINTAINING',
    technologies: ['React', 'TypeScript', 'WebGL'],
    year: '2025',
    visual: 'grid',
  },
]

const statusColors: Record<ProjectStatus, string> = {
  BUILDING: '#B6F34A',
  SHIPPED: '#F5F7F2',
  MAINTAINING: '#8A8F89',
}

function ProjectVisual({ type, isHovered }: { type: Project['visual']; isHovered: boolean }) {
  if (type === 'mark') {
    return (
      <div className="absolute top-8 right-8 w-20 h-20 md:w-28 md:h-28">
        <svg viewBox="0 0 100 100" className="w-full h-full" aria-hidden="true">
          <motion.path
            d="M50 10 L90 50 L50 90 L10 50 Z"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            className="text-white/[0.06]"
            animate={isHovered ? { pathLength: 1, stroke: 'rgba(182,243,74,0.3)' } : { pathLength: 0.7, stroke: 'rgba(245,247,242,0.06)' }}
            transition={{ duration: 0.6 }}
          />
          <motion.circle
            cx="50"
            cy="50"
            r="8"
            fill="currentColor"
            className="text-white/[0.04]"
            animate={isHovered ? { r: 12, fill: 'rgba(182,243,74,0.1)' } : { r: 8, fill: 'rgba(245,247,242,0.04)' }}
            transition={{ duration: 0.4 }}
          />
        </svg>
      </div>
    )
  }

  if (type === 'bars') {
    return (
      <div className="absolute bottom-8 right-8 flex gap-[3px] items-end h-16">
        {[28, 40, 18, 52, 32, 44, 22, 48, 36, 26, 42, 16].map((h, i) => (
          <motion.div
            key={i}
            className="w-1 bg-white/[0.06] rounded-full"
            animate={isHovered ? { height: h, backgroundColor: 'rgba(182,243,74,0.2)' } : { height: h * 0.6, backgroundColor: 'rgba(245,247,242,0.06)' }}
            transition={{ duration: 0.4, delay: i * 0.02 }}
          />
        ))}
      </div>
    )
  }

  if (type === 'number') {
    return (
      <motion.span
        className="absolute -top-4 -right-2 md:top-4 md:right-4 text-[8rem] md:text-[12rem] font-bold text-white/[0.03] leading-none select-none pointer-events-none"
        animate={isHovered ? { x: -4, y: -4, color: 'rgba(182,243,74,0.06)' } : { x: 0, y: 0, color: 'rgba(245,247,242,0.03)' }}
        transition={{ duration: 0.5 }}
        aria-hidden="true"
      >
        03
      </motion.span>
    )
  }

  return (
    <div className="absolute top-6 right-6 grid grid-cols-3 gap-1.5" aria-hidden="true">
      {Array.from({ length: 9 }).map((_, i) => (
        <motion.div
          key={i}
          className="w-3 h-3 rounded-sm bg-white/[0.04]"
          animate={isHovered ? { backgroundColor: i % 3 === 0 ? 'rgba(182,243,74,0.15)' : 'rgba(245,247,242,0.06)' } : { backgroundColor: 'rgba(245,247,242,0.04)' }}
          transition={{ duration: 0.3, delay: i * 0.02 }}
        />
      ))}
    </div>
  )
}

function ProjectCard({ project, index }: { project: Project; index: number }) {
  const [isHovered, setIsHovered] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  const rotateX = useTransform(mouseY, [0, 1], [1.5, -1.5])
  const rotateY = useTransform(mouseX, [0, 1], [-1.5, 1.5])

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    mouseX.set((e.clientX - rect.left) / rect.width)
    mouseY.set((e.clientY - rect.top) / rect.height)
  }

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-8%' }}
      transition={{ duration: 0.7, delay: index * 0.12, ease }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ rotateX, rotateY, transformPerspective: 1200 }}
      className="group relative border border-white/[0.06] rounded-xl p-8 md:p-10 cursor-default overflow-hidden transition-[border-color] duration-300 hover:border-[#B6F34A]/20 bg-white/[0.01]"
    >
      {/* Hover glow */}
      <motion.div
        animate={isHovered ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="absolute inset-0 bg-gradient-to-br from-[#B6F34A]/[0.03] to-transparent pointer-events-none"
      />

      {/* Top row */}
      <div className="flex items-center justify-between mb-10 md:mb-14">
        <motion.span
          className="text-[11px] font-mono text-[#555B55] tracking-wider"
          animate={isHovered ? { x: 3, color: '#B6F34A' } : { x: 0, color: '#555B55' }}
          transition={{ duration: 0.3 }}
        >
          {project.number}
        </motion.span>
        <span className="text-[11px] font-mono text-[#555B55]">{project.year}</span>
      </div>

      {/* Visual */}
      <ProjectVisual type={project.visual} isHovered={isHovered} />

      {/* Name */}
      <motion.h3
        className="text-2xl md:text-3xl lg:text-4xl font-bold text-[#F5F7F2] tracking-tight mb-4 relative z-10"
        animate={isHovered ? { x: 2 } : { x: 0 }}
        transition={{ duration: 0.3 }}
      >
        {project.name}
      </motion.h3>

      {/* Description */}
      <motion.p
        className="text-sm md:text-[15px] text-[#8A8F89] leading-relaxed mb-8 max-w-[280px] relative z-10"
        animate={isHovered ? { color: '#C5C8C5' } : { color: '#8A8F89' }}
        transition={{ duration: 0.3 }}
      >
        {project.description}
      </motion.p>

      <div className="flex-1 min-h-[40px]" />

      {/* Bottom */}
      <div className="flex items-end justify-between relative z-10">
        <div className="flex flex-wrap gap-1.5">
          {project.technologies.map((tech, i) => (
            <motion.span
              key={tech}
              className="px-2.5 py-1 text-[10px] font-mono text-[#555B55] border border-white/[0.06] rounded-md"
              animate={isHovered ? { y: -2, borderColor: 'rgba(182,243,74,0.15)' } : { y: 0, borderColor: 'rgba(245,247,242,0.06)' }}
              transition={{ duration: 0.3, delay: i * 0.02 }}
            >
              {tech}
            </motion.span>
          ))}
        </div>

        <div className="flex items-center gap-3 ml-4 shrink-0">
          <div className="flex items-center gap-2">
            <motion.div
              className="w-1.5 h-1.5 rounded-full"
              style={{ backgroundColor: statusColors[project.status] }}
              animate={project.status === 'BUILDING' ? { opacity: [1, 0.3, 1] } : {}}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            />
            <span className="text-[10px] font-mono tracking-wider" style={{ color: statusColors[project.status] }}>
              {project.status}
            </span>
          </div>
          <motion.div
            animate={isHovered ? { x: 3, y: -3 } : { x: 0, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <ArrowUpRight className="w-4 h-4 text-[#555B55] group-hover:text-[#B6F34A] transition-colors duration-200" />
          </motion.div>
        </div>
      </div>
    </motion.div>
  )
}

export default function ProjectShowcase() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-8%' })

  return (
    <section className="relative py-32 md:py-44" id="builders">
      <div className="absolute top-0 left-0 right-0 h-px bg-white/[0.06]" />

      <div ref={ref} className="mx-auto max-w-[1400px] px-6 md:px-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease }}
          className="mb-16 md:mb-24 max-w-2xl"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-[1px] bg-[#B6F34A]/40" />
            <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-[#B6F34A]/70">
              FEATURED PROJECTS
            </span>
          </div>
          <h2 className="text-[clamp(2.2rem,5vw,3.8rem)] font-bold text-[#F5F7F2] tracking-tight leading-[1.05] mb-6">
            Not repositories.
            <br />
            <span className="text-[#555B55]">Projects.</span>
          </h2>
          <p className="text-[clamp(0.9rem,1.5vw,1.1rem)] text-[#8A8F89] leading-relaxed">
            Repositories are where code lives.
            <br />
            Projects are where the work gets a story.
          </p>
        </motion.div>

        {/* 2x2 Grid */}
        <div className="grid md:grid-cols-2 gap-4 md:gap-5">
          {projects.map((project, i) => (
            <ProjectCard key={project.id} project={project} index={i} />
          ))}
        </div>

        {/* Bottom */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-16 md:mt-20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6"
        >
          <p className="text-sm text-[#555B55]">
            <span className="text-[#F5F7F2] font-medium">04</span> projects.{' '}
            <span className="text-[#303530]">&infin; things being built.</span>
          </p>
          <Link
            to="/discover"
            className="group inline-flex items-center gap-2 text-sm text-[#8A8F89] hover:text-[#B6F34A] transition-colors duration-200"
          >
            Explore all projects
            <motion.span
              animate={{ x: [0, 3, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
            >
              <ArrowUpRight className="w-4 h-4" />
            </motion.span>
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
