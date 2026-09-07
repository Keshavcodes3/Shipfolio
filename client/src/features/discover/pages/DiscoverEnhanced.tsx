import { useMemo, useState } from 'react'
import { Link } from 'react-router'
import { motion } from 'framer-motion'
import { Search, Star, ArrowRight, Code2, Sparkles } from 'lucide-react'
import SidebarShell from '../../Dashboard/Components/SidebarShell'
import { useDiscoverProjects, useFeaturedProjects } from '../../../lib/hooks'
import type { Project } from '../../../lib/hooks'

const ease = [0.22, 2, 0.36, 1] as const

function formatTime(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime()
  const min = Math.floor(diff / 60000)
  if (min < 1) return 'now'
  if (min < 60) return `${min}m`
  const hr = Math.floor(min / 60)
  if (hr < 24) return `${hr}h`
  const d = Math.floor(hr / 24)
  if (d < 7) return `${d}d`
  const w = Math.floor(d / 7)
  if (w < 4) return `${w}w`
  return `${Math.floor(d / 30)}mo`
}

const VISUALS = ['orb', 'bars', 'grid', 'pulse', 'wave'] as const
function visualFrom(id: string) {
  let h = 0
  for (let i = 0; i < id.length; i++) h = ((h << 5) - h + id.charCodeAt(i)) | 0
  return VISUALS[Math.abs(h) % VISUALS.length]
}

function ProjectCard({ project, index }: { project: Project; index: number }) {
  const [hovered, setHovered] = useState(false)
  const techs = project.technologies.map((t) => t.technology.name)
  const visual = visualFrom(project.id)
  const stars = (project as any).githubRepo?.stars ?? 0

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04, duration: 0.5, ease }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <Link
        to={`/showcase/${project.id}`}
        className="block border border-white/[0.06] relative group overflow-hidden h-full bg-white/[0.01]"
      >
        {/* Glow */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#B6F34A]/[0.04] via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
        <div className="absolute inset-0 border border-transparent group-hover:border-[#B6F34A]/20 transition-colors duration-500 pointer-events-none" />

        {/* Visual strip */}
        <div className="h-[120px] relative bg-white/[0.015] border-b border-white/[0.04] overflow-hidden flex items-center justify-center">
          <VisualStrip type={visual} active={hovered} />
        </div>

        <div className="p-5">
          <div className="flex items-start justify-between gap-2 mb-2">
            <h3 className="text-[15px] font-bold tracking-[-0.02em] text-[#F5F7F2] group-hover:text-[#B6F34A] transition-colors duration-300 min-w-0 truncate">
              {project.name}
            </h3>
            <span className={`shrink-0 flex items-center gap-1.5 text-[8px] uppercase tracking-[0.15em] font-mono ${project.status === 'BUILDING' ? 'text-[#B6F34A]' : 'text-[#555B55]'}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${project.status === 'BUILDING' ? 'bg-[#B6F34A]' : 'bg-[#555B55]'}`} />
              {project.status === 'BUILDING' ? 'BUILDING' : 'SHIPPED'}
            </span>
          </div>

          <p className="text-[12px] text-[#8A8F89] leading-relaxed line-clamp-2 mb-3">
            {project.description ?? 'No description yet.'}
          </p>

          <div className="flex items-center gap-2 text-[11px] text-[#555B55] mb-3">
            <span className="truncate">@{project.user?.username ?? 'unknown'}</span>
          </div>

          <div className="flex flex-wrap gap-1 mb-3">
            {techs.slice(0, 3).map((t) => (
              <span key={t} className="text-[9px] font-mono text-[#303530] border border-white/[0.06] px-1.5 py-0.5">
                {t}
              </span>
            ))}
            {techs.length > 3 && (
              <span className="text-[9px] font-mono text-[#303530]">+{techs.length - 3}</span>
            )}
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-white/[0.04]">
            <div className="flex items-center gap-3">
              {stars > 0 && (
                <span className="flex items-center gap-1 text-[10px] text-[#303530] font-mono">
                  <Star className="w-3 h-3" />
                  {stars}
                </span>
              )}
              <span className="text-[10px] text-[#303530] font-mono">{formatTime(project.updatedAt)}</span>
            </div>
            <motion.div
              animate={{ opacity: hovered ? 1 : 0, x: hovered ? 0 : -4 }}
              transition={{ duration: 0.2 }}
            >
              <ArrowRight className="w-3.5 h-3.5 text-[#B6F34A]" />
            </motion.div>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}

function VisualStrip({ type, active }: { type: string; active: boolean }) {
  if (type === 'wave') {
    return (
      <svg viewBox="0 0 200 80" className="w-full h-full opacity-30">
        <motion.path
          d="M0 40 Q25 20 50 40 Q75 60 100 40 Q125 20 150 40 Q175 60 200 40"
          fill="none" stroke="currentColor" strokeWidth="0.8" className="text-white/[0.08]"
          animate={active ? { stroke: 'rgba(182,243,74,0.2)' } : {}}
          transition={{ duration: 0.4 }}
        />
        {[40, 80, 120, 160].map((cx) => (
          <motion.circle key={cx} cx={cx} cy="40" r="1.5" fill="currentColor" className="text-white/[0.1]"
            animate={active ? { fill: 'rgba(182,243,74,0.4)', r: 2.5 } : {}}
            transition={{ duration: 0.3 }}
          />
        ))}
      </svg>
    )
  }
  if (type === 'orb') {
    return (
      <svg viewBox="0 0 80 80" className="w-16 h-16">
        <motion.circle cx="40" cy="40" r="30" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-white/[0.06]"
          animate={active ? { r: 33, stroke: 'rgba(182,243,74,0.15)' } : { r: 30 }}
          transition={{ duration: 0.4 }}
        />
        <motion.circle cx="40" cy="40" r="6" fill="currentColor" className="text-white/[0.08]"
          animate={active ? { fill: 'rgba(182,243,74,0.25)', r: 8 } : {}}
          transition={{ duration: 0.3 }}
        />
      </svg>
    )
  }
  if (type === 'bars') {
    return (
      <div className="flex items-end gap-[2px] h-12">
        {[12, 20, 8, 26, 14, 22, 10, 18, 16].map((h, i) => (
          <motion.div key={i} className="w-[3px] rounded-full bg-white/[0.06]"
            animate={active ? { height: h, backgroundColor: 'rgba(182,243,74,0.15)' } : { height: h * 0.4 }}
            transition={{ duration: 0.3, delay: i * 0.02 }}
          />
        ))}
      </div>
    )
  }
  if (type === 'pulse') {
    return (
      <div className="relative w-12 h-12">
        <motion.div className="absolute inset-0 rounded-full border border-white/[0.06]"
          animate={active ? { scale: [1, 1.2, 1] } : {}} transition={{ duration: 1, repeat: Infinity, ease: 'easeInOut' }}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-2 h-2 rounded-full bg-[#B6F34A]/20" />
        </div>
      </div>
    )
  }
  // grid
  return (
    <div className="grid grid-cols-3 gap-1">
      {Array.from({ length: 9 }).map((_, i) => (
        <motion.div key={i} className="w-2 h-2 bg-white/[0.04]"
          animate={active ? { backgroundColor: i % 3 === 0 ? 'rgba(182,243,74,0.15)' : 'rgba(245,247,242,0.06)' } : {}}
          transition={{ duration: 0.2, delay: i * 0.015 }}
        />
      ))}
    </div>
  )
}

function Skeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div key={i} className="border border-white/[0.06] overflow-hidden animate-pulse">
          <div className="h-[120px] bg-white/[0.02]" />
          <div className="p-5">
            <div className="h-4 w-24 bg-white/[0.06] mb-2" />
            <div className="h-3 w-full bg-white/[0.04] mb-1" />
            <div className="h-3 w-3/4 bg-white/[0.04]" />
          </div>
        </div>
      ))}
    </div>
  )
}

export default function DiscoverEnhanced() {
  const [search, setSearch] = useState('')
  const [sortBy, setSortBy] = useState<'updatedAt' | 'createdAt'>('updatedAt')

  const { data: allProjects, isLoading } = useDiscoverProjects({ sort: sortBy })
  const { data: featuredProjects } = useFeaturedProjects()

  const featured = featuredProjects?.[0]

  const filtered = useMemo(() => {
    if (!allProjects) return []
    if (!search.trim()) return allProjects
    const q = search.toLowerCase()
    return allProjects.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.description?.toLowerCase().includes(q) ||
        p.user?.username.toLowerCase().includes(q) ||
        p.technologies.some((t) => t.technology.name.toLowerCase().includes(q)),
    )
  }, [allProjects, search])

  return (
    <SidebarShell>
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute top-[5%] right-[-5%] w-[500px] h-[500px] rounded-full bg-[#B6F34A]/[0.02] blur-[150px]" />
        <div className="absolute bottom-[10%] left-[-8%] w-[400px] h-[400px] rounded-full bg-[#B6F34A]/[0.015] blur-[120px]" />
      </div>

      <div className="relative z-10 text-[#F5F7F2]">
        <div className="max-w-[1200px] mx-auto px-5 md:px-8">
          {/* Hero */}
          <section className="pt-20 md:pt-28 pb-12 md:pb-16">
            <div className="overflow-hidden">
              {['WHAT PEOPLE', 'ARE BUILDING.'].map((line, i) => (
                <motion.div
                  key={line}
                  initial={{ opacity: 0, y: 40, filter: 'blur(6px)' }}
                  animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  transition={{ delay: 0.1 + i * 0.12, duration: 0.8, ease }}
                >
                  <h1 className="text-[clamp(2.5rem,7vw,4.5rem)] font-black tracking-[-0.06em] leading-[0.9] text-[#F5F7F2]">
                    {line}
                  </h1>
                </motion.div>
              ))}
            </div>
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6, ease }}
              className="text-[15px] text-[#555B55] leading-relaxed mt-6 max-w-[420px]"
            >
              A room full of projects, ideas, and people worth discovering.
            </motion.p>
          </section>

          {/* Featured Project of the Week */}
          {featured && (
            <motion.section
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease }}
              className="py-12 md:py-16 border-b border-white/[0.06]"
            >
              <div className="flex items-center gap-3 mb-3">
                <Sparkles className="w-3.5 h-3.5 text-[#B6F34A]" />
                <span className="text-[10px] uppercase tracking-[0.3em] text-[#B6F34A] font-mono font-medium">
                  PROJECT OF THE WEEK
                </span>
                <div className="flex-1 h-[1px] bg-white/[0.04]" />
              </div>
              <Link
                to={`/showcase/${featured.id}`}
                className="group block border border-white/[0.06] p-8 hover:border-[#B6F34A]/20 transition-colors duration-300"
              >
                <div className="flex flex-col lg:flex-row lg:items-center gap-6">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-[clamp(1.5rem,3vw,2.2rem)] font-black tracking-[-0.04em] leading-[0.9] text-[#F5F7F2] group-hover:text-[#B6F34A] transition-colors duration-300 mb-3">
                      {featured.name}
                    </h3>
                    <p className="text-[15px] text-[#8A8F89] leading-relaxed mb-4 max-w-[480px]">
                      {featured.description}
                    </p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {featured.technologies.slice(0, 4).map((t) => (
                        <span key={t.technology.id} className="text-[11px] text-[#555B55] border border-white/[0.06] px-2.5 py-1 font-mono">
                          {t.technology.name}
                        </span>
                      ))}
                    </div>
                    <div className="flex items-center gap-3 text-[12px] text-[#555B55]">
                      <span>@{featured.user?.username ?? 'unknown'}</span>
                      {(featured as any).githubRepo?.stars > 0 && (
                        <>
                          <span className="text-white/[0.08]">·</span>
                          <span className="flex items-center gap-1">
                            <Star className="w-3 h-3" />
                            {(featured as any).githubRepo.stars}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="shrink-0">
                    <span className="inline-flex items-center gap-2 text-[11px] font-mono uppercase tracking-[0.1em] text-[#B6F34A] group-hover:gap-3 transition-all duration-300">
                      Explore Project <ArrowRight className="w-4 h-4" />
                    </span>
                  </div>
                </div>
              </Link>
            </motion.section>
          )}

          {/* Search + Sort */}
          <section className="py-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="relative flex-1 w-full sm:max-w-[360px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#555B55]" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search projects, builders, tech..."
                  className="w-full bg-white/[0.03] border border-white/[0.06] pl-10 pr-4 py-2.5 text-[13px] text-[#F5F7F2] placeholder:text-[#303530] focus:outline-none focus:border-[#B6F34A]/30 transition-colors"
                />
              </div>
              <div className="flex items-center gap-2">
                {(['updatedAt', 'createdAt'] as const).map((s) => (
                  <button
                    key={s}
                    onClick={() => setSortBy(s)}
                    className={`text-[10px] uppercase tracking-[0.15em] font-mono px-3 py-1.5 border transition-colors ${
                      sortBy === s
                        ? 'border-[#B6F34A]/30 text-[#B6F34A] bg-[#B6F34A]/[0.05]'
                        : 'border-white/[0.06] text-[#555B55] hover:text-[#8A8F89]'
                    }`}
                  >
                    {s === 'updatedAt' ? 'RECENT' : 'NEWEST'}
                  </button>
                ))}
              </div>
            </div>
          </section>

          {/* Projects Grid */}
          <section className="pb-16">
            <div className="flex items-center gap-3 mb-6">
              <Code2 className="w-3.5 h-3.5 text-[#B6F34A]" />
              <span className="text-[10px] uppercase tracking-[0.3em] text-[#B6F34A] font-mono font-medium">
                ALL PROJECTS
              </span>
              <span className="text-[10px] text-[#303530] font-mono">({filtered.length})</span>
              <div className="flex-1 h-[1px] bg-white/[0.04]" />
            </div>

            {isLoading ? (
              <Skeleton />
            ) : filtered.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filtered.map((project, i) => (
                  <ProjectCard key={project.id} project={project} index={i} />
                ))}
              </div>
            ) : (
              <div className="py-20 text-center">
                <p className="text-[14px] text-[#555B55]">
                  {search ? 'No projects match your search.' : 'No projects yet.'}
                </p>
              </div>
            )}
          </section>
        </div>
      </div>
    </SidebarShell>
  )
}
