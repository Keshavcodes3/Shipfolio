import { useState, useMemo, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router'
import {
  X, Search, Skull, BookOpen, TrendingDown,
  Users, DollarSign, Lightbulb, Target,
  Zap, ChevronRight, Eye, Layers
} from 'lucide-react'
import SidebarShell from '../../Dashboard/Components/SidebarShell'
import Logo from '../../../components/Logo'
import SEO from '../../../components/SEO'
import {
  useGraveyardEntries, useGraveyardStats, useGraveyardCategories,
  useGraveyardSearch,
} from '../../../lib/hooks'
import type { GraveyardEntry } from '../../../lib/hooks'

const ease = [0.22, 1, 0.36, 1] as const

const CATEGORY_META: Record<string, { label: string; icon: any; color: string }> = {
  social: { label: 'Social', icon: Users, color: '#F5C542' },
  health: { label: 'Health', icon: Target, color: '#4AF5E1' },
  education: { label: 'Education', icon: BookOpen, color: '#B6F34A' },
  developer_tools: { label: 'Dev Tools', icon: Zap, color: '#8A8F89' },
}

const DIFFICULTY_META: Record<string, { label: string; color: string }> = {
  hard: { label: 'HARD', color: '#F55B5B' },
  medium: { label: 'MEDIUM', color: '#F5C542' },
  easy: { label: 'EASY', color: '#4AF5E1' },
}

// --- Featured Hero Card (large, 2 cols × 2 rows) ---
function HeroCard({ entry, onClick }: { entry: GraveyardEntry; onClick: () => void }) {
  const catMeta = CATEGORY_META[entry.classification.primary_category] || CATEGORY_META.social
  const CatIcon = catMeta.icon
  const diffMeta = DIFFICULTY_META[entry.graveyard_card.difficulty]

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, ease }}
      onClick={onClick}
      className="group relative col-span-1 sm:col-span-2 row-span-2 border border-white/[0.06] hover:border-white/[0.12] transition-all duration-300 cursor-pointer overflow-hidden flex flex-col"
    >
      {/* Background glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#F55B5B]/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      <div className="relative flex-1 flex flex-col p-6 md:p-8">
        {/* Top badges */}
        <div className="flex items-center gap-2 mb-6">
          <div className="flex items-center gap-1.5 px-2 py-1" style={{ background: `${catMeta.color}12` }}>
            <CatIcon className="w-3.5 h-3.5" style={{ color: catMeta.color }} />
            <span className="text-[10px] font-mono uppercase tracking-[0.1em]" style={{ color: catMeta.color }}>
              {catMeta.label}
            </span>
          </div>
          {diffMeta && (
            <span className="text-[9px] font-mono uppercase tracking-[0.1em] px-2 py-1 border" style={{ color: diffMeta.color, borderColor: `${diffMeta.color}30` }}>
              {diffMeta.label}
            </span>
          )}
          <span className="text-[9px] font-mono text-[#303530] ml-auto">
            {entry.classification.failure_type.replace(/_/g, ' ')}
          </span>
        </div>

        {/* Content */}
        <div className="flex-1">
          <h2 className="text-[clamp(1.5rem,3vw,2.2rem)] font-black tracking-[-0.04em] leading-[0.95] text-[#F5F7F2] group-hover:text-[#B6F34A] transition-colors duration-300 mb-3">
            {entry.name}
          </h2>
          <p className="text-[14px] text-[#8A8F89] leading-relaxed max-w-[400px] mb-6">
            {entry.graveyard_card.headline}
          </p>
        </div>

        {/* Bottom stats */}
        <div className="flex items-end justify-between mt-auto">
          <div className="space-y-1.5">
            <div>
              <p className="text-[9px] font-mono text-[#303530] uppercase tracking-wider mb-0.5">Death Event</p>
              <p className="text-[12px] text-[#555B55] max-w-[280px] line-clamp-1">{entry.failure.death_event}</p>
            </div>
            <div>
              <p className="text-[9px] font-mono text-[#303530] uppercase tracking-wider mb-0.5">Biggest Lesson</p>
              <p className="text-[12px] text-[#B6F34A]/70 max-w-[280px] line-clamp-1">{entry.graveyard_card.biggest_lesson}</p>
            </div>
          </div>
          <motion.div
            whileHover={{ x: 4 }}
            className="text-[#303530] group-hover:text-[#B6F34A] transition-colors shrink-0 ml-4"
          >
            <ChevronRight className="w-5 h-5" />
          </motion.div>
        </div>
      </div>
    </motion.div>
  )
}

// --- Stats Card (1×1) ---
function StatsCard({ stats }: { stats: { total: number; categories: number; totalLessons: number } }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1, duration: 0.5, ease }}
      className="col-span-1 row-span-1 border border-white/[0.06] p-5 flex flex-col justify-between bg-[#B6F34A]/[0.02]"
    >
      <Skull className="w-5 h-5 text-[#F55B5B] mb-4" />
      <div>
        <p className="text-[clamp(2rem,4vw,3rem)] font-black font-mono text-[#F55B5B] leading-none mb-1">
          {stats.total}
        </p>
        <p className="text-[9px] font-mono uppercase tracking-[0.15em] text-[#303530]">TOTAL KILLED</p>
      </div>
      <div className="flex items-center gap-3 mt-4 pt-3 border-t border-white/[0.04]">
        <span className="text-[10px] text-[#555B55] font-mono">{stats.categories} sectors</span>
        <span className="text-[#1a1c1c]">·</span>
        <span className="text-[10px] text-[#555B55] font-mono">{stats.totalLessons} lessons</span>
      </div>
    </motion.div>
  )
}

// --- Regular Card (1×1) ---
function BentoCard({ entry, index, onClick }: { entry: GraveyardEntry; index: number; onClick: () => void }) {
  const catMeta = CATEGORY_META[entry.classification.primary_category] || CATEGORY_META.social
  const CatIcon = catMeta.icon
  const diffMeta = DIFFICULTY_META[entry.graveyard_card.difficulty]

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.05 * index, duration: 0.5, ease }}
      onClick={onClick}
      className="group relative col-span-1 row-span-1 border border-white/[0.05] hover:border-white/[0.12] transition-all duration-300 cursor-pointer overflow-hidden flex flex-col"
    >
      {/* Top accent */}
      <div className="h-[2px] w-full" style={{ background: `linear-gradient(90deg, ${catMeta.color}30, transparent)` }} />

      <div className="flex-1 flex flex-col p-4">
        {/* Badges */}
        <div className="flex items-center gap-1.5 mb-3">
          <CatIcon className="w-3 h-3" style={{ color: catMeta.color }} />
          <span className="text-[9px] font-mono uppercase tracking-[0.1em]" style={{ color: catMeta.color }}>
            {catMeta.label}
          </span>
          {diffMeta && (
            <span className="text-[8px] font-mono uppercase tracking-[0.1em] px-1.5 py-0.5 border ml-auto"
              style={{ color: diffMeta.color, borderColor: `${diffMeta.color}25` }}>
              {diffMeta.label}
            </span>
          )}
        </div>

        {/* Name */}
        <h3 className="text-[15px] font-bold tracking-[-0.02em] text-[#F5F7F2] group-hover:text-[#B6F34A] transition-colors duration-300 mb-1">
          {entry.name}
        </h3>

        {/* Headline */}
        <p className="text-[11px] text-[#555B55] leading-relaxed line-clamp-2 mb-auto">
          {entry.graveyard_card.headline}
        </p>

        {/* Bottom */}
        <div className="flex items-center justify-between mt-4 pt-3 border-t border-white/[0.04]">
          <span className="text-[9px] font-mono text-[#303530] truncate max-w-[120px]">
            {entry.failure.primary_reason}
          </span>
          <ChevronRight className="w-3.5 h-3.5 text-[#303530] group-hover:text-[#B6F34A] transition-colors shrink-0" />
        </div>
      </div>
    </motion.div>
  )
}

// --- Wide Card (2×1) ---
function WideCard({ entry, index, onClick }: { entry: GraveyardEntry; index: number; onClick: () => void }) {
  const catMeta = CATEGORY_META[entry.classification.primary_category] || CATEGORY_META.social
  const CatIcon = catMeta.icon

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.05 * index, duration: 0.5, ease }}
      onClick={onClick}
      className="group relative col-span-1 sm:col-span-2 row-span-1 border border-white/[0.05] hover:border-white/[0.12] transition-all duration-300 cursor-pointer overflow-hidden"
    >
      <div className="flex items-stretch h-full">
        {/* Left accent bar */}
        <div className="w-[3px] shrink-0" style={{ background: catMeta.color }} />

        <div className="flex-1 flex items-center justify-between p-4 md:p-5">
          <div className="flex items-center gap-4 min-w-0">
            <div className="flex items-center gap-1.5 px-2 py-1 shrink-0" style={{ background: `${catMeta.color}10` }}>
              <CatIcon className="w-3 h-3" style={{ color: catMeta.color }} />
              <span className="text-[9px] font-mono uppercase tracking-[0.1em]" style={{ color: catMeta.color }}>
                {catMeta.label}
              </span>
            </div>
            <div className="min-w-0">
              <h3 className="text-[14px] font-bold tracking-[-0.02em] text-[#F5F7F2] group-hover:text-[#B6F34A] transition-colors truncate">
                {entry.name}
              </h3>
              <p className="text-[11px] text-[#555B55] truncate">{entry.graveyard_card.headline}</p>
            </div>
          </div>
          <div className="flex items-center gap-4 shrink-0 ml-4">
            {entry.traction.funding && (
              <span className="text-[10px] font-mono text-[#303530] hidden md:block">
                <DollarSign className="w-3 h-3 inline -mt-0.5" /> {entry.traction.funding}
              </span>
            )}
            <ChevronRight className="w-4 h-4 text-[#303530] group-hover:text-[#B6F34A] transition-colors" />
          </div>
        </div>
      </div>
    </motion.div>
  )
}

// --- Story Sidebar ---
function StorySidebar({ entry, onClose }: { entry: GraveyardEntry; onClose: () => void }) {
  const catMeta = CATEGORY_META[entry.classification.primary_category] || CATEGORY_META.social
  const CatIcon = catMeta.icon

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [onClose])

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 z-40 lg:hidden"
        onClick={onClose}
      />

      <motion.aside
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
        className="fixed top-0 right-0 bottom-0 w-full max-w-[520px] bg-[#0A0C0A] border-l border-white/[0.08] z-50 flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.06] shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="flex items-center gap-1.5 px-2 py-0.5" style={{ background: `${catMeta.color}10` }}>
              <CatIcon className="w-3 h-3" style={{ color: catMeta.color }} />
              <span className="text-[9px] font-mono uppercase tracking-[0.1em]" style={{ color: catMeta.color }}>
                {catMeta.label}
              </span>
            </div>
            <span className="text-[10px] text-[#303530] font-mono">{entry.classification.failure_type.replace(/_/g, ' ')}</span>
          </div>
          <button onClick={onClose} className="text-[#555B55] hover:text-[#F5F7F2] transition-colors p-1.5 hover:bg-white/[0.04]">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable */}
        <div className="flex-1 overflow-y-auto">
          {/* Title block */}
          <div className="px-6 py-6 border-b border-white/[0.04]">
            <div className="flex items-center gap-2 mb-3">
              <Skull className="w-4 h-4 text-[#F55B5B]" />
              <span className="text-[10px] font-mono uppercase tracking-[0.15em] text-[#F55B5B]">CASE FILE</span>
            </div>
            <h1 className="text-[24px] font-black tracking-[-0.03em] text-[#F5F7F2] mb-2">{entry.name}</h1>
            <p className="text-[14px] text-[#8A8F89] leading-relaxed">{entry.overview.one_liner}</p>
          </div>

          {/* The Idea */}
          <SidebarSection title="THE IDEA" icon={Lightbulb}>
            <p className="text-[13px] text-[#B0B4B0] leading-relaxed mb-3">{entry.idea.what_they_wanted_to_build}</p>
            <p className="text-[12px] text-[#8A8F89] leading-relaxed italic">"{entry.overview.problem}"</p>
          </SidebarSection>

          {/* Traction */}
          {(entry.traction.users || entry.traction.funding || entry.traction.revenue) && (
            <SidebarSection title="TRACTION" icon={TrendingDown}>
              <div className="grid grid-cols-2 gap-3">
                {entry.traction.users && (
                  <div className="bg-white/[0.02] border border-white/[0.04] p-3">
                    <p className="text-[9px] font-mono text-[#303530] uppercase tracking-wider mb-1">Users</p>
                    <p className="text-[14px] font-bold text-[#F5F7F2]">{entry.traction.users}</p>
                  </div>
                )}
                {entry.traction.funding && (
                  <div className="bg-white/[0.02] border border-white/[0.04] p-3">
                    <p className="text-[9px] font-mono text-[#303530] uppercase tracking-wider mb-1">Funding</p>
                    <p className="text-[14px] font-bold text-[#F5F7F2]">{entry.traction.funding}</p>
                  </div>
                )}
                {entry.traction.revenue && (
                  <div className="bg-white/[0.02] border border-white/[0.04] p-3">
                    <p className="text-[9px] font-mono text-[#303530] uppercase tracking-wider mb-1">Revenue</p>
                    <p className="text-[14px] font-bold text-[#F5F7F2]">{entry.traction.revenue}</p>
                  </div>
                )}
                {entry.traction.investors.length > 0 && (
                  <div className="bg-white/[0.02] border border-white/[0.04] p-3">
                    <p className="text-[9px] font-mono text-[#303530] uppercase tracking-wider mb-1">Investors</p>
                    <p className="text-[11px] text-[#C8CCC8]">{entry.traction.investors.join(', ')}</p>
                  </div>
                )}
              </div>
            </SidebarSection>
          )}

          {/* How It Died */}
          <SidebarSection title="HOW IT DIED" icon={Skull}>
            <div className="bg-[#F55B5B]/[0.04] border border-[#F55B5B]/10 p-4 mb-4">
              <p className="text-[12px] text-[#F55B5B] font-mono font-bold mb-1">DEATH EVENT</p>
              <p className="text-[13px] text-[#B0B4B0] leading-relaxed">{entry.failure.death_event}</p>
            </div>
            <p className="text-[13px] text-[#B0B4B0] leading-relaxed mb-4">{entry.failure.why_failed}</p>
            {entry.failure.contributing_factors.length > 0 && (
              <div className="space-y-2">
                <p className="text-[10px] font-mono text-[#555B55] uppercase tracking-wider">Contributing Factors</p>
                {entry.failure.contributing_factors.map((f, i) => (
                  <div key={i} className="flex gap-2 text-[12px]">
                    <span className="text-[#F55B5B] mt-0.5">·</span>
                    <div>
                      <span className="text-[#C8CCC8] font-medium">{f.factor}:</span>{' '}
                      <span className="text-[#8A8F89]">{f.explanation}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </SidebarSection>

          {/* The Realization */}
          <SidebarSection title="THE REALIZATION" icon={Eye}>
            <div className="bg-[#B6F34A]/[0.03] border border-[#B6F34A]/10 p-4">
              <p className="text-[14px] text-[#F5F7F2] font-bold leading-relaxed mb-2">
                "{entry.founder_realization.biggest_realization}"
              </p>
              <p className="text-[12px] text-[#8A8F89] leading-relaxed">
                {entry.founder_realization.core_insight}
              </p>
            </div>
          </SidebarSection>

          {/* Lessons */}
          {entry.lessons.length > 0 && (
            <SidebarSection title="LESSONS" icon={BookOpen}>
              <div className="space-y-4">
                {entry.lessons.map((lesson, i) => (
                  <div key={i} className="border-l-2 border-[#B6F34A]/20 pl-4">
                    <p className="text-[13px] text-[#F5F7F2] font-bold mb-1">{lesson.title}</p>
                    <p className="text-[12px] text-[#B0B4B0] leading-relaxed mb-1">{lesson.lesson}</p>
                    <p className="text-[11px] text-[#555B55] italic">{lesson.why_it_matters}</p>
                  </div>
                ))}
              </div>
            </SidebarSection>
          )}

          {/* Graveyard Analysis */}
          <SidebarSection title="ANALYSIS" icon={Layers}>
            <div className="space-y-3">
              <div>
                <p className="text-[10px] font-mono text-[#555B55] uppercase tracking-wider mb-1">The Illusion</p>
                <p className="text-[13px] text-[#B0B4B0] leading-relaxed">{entry.graveyard_analysis.the_illusion}</p>
              </div>
              <div>
                <p className="text-[10px] font-mono text-[#555B55] uppercase tracking-wider mb-1">The Reality</p>
                <p className="text-[13px] text-[#B0B4B0] leading-relaxed">{entry.graveyard_analysis.the_reality}</p>
              </div>
              {entry.graveyard_analysis.what_a_founder_should_check_earlier.length > 0 && (
                <div>
                  <p className="text-[10px] font-mono text-[#555B55] uppercase tracking-wider mb-2">Check Earlier</p>
                  <div className="space-y-1.5">
                    {entry.graveyard_analysis.what_a_founder_should_check_earlier.map((item, i) => (
                      <div key={i} className="flex items-start gap-2 text-[12px]">
                        <span className="text-[#B6F34A] mt-0.5">→</span>
                        <span className="text-[#8A8F89]">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </SidebarSection>

          <div className="h-12" />
        </div>
      </motion.aside>
    </>
  )
}

// --- Sidebar Section wrapper ---
function SidebarSection({ title, icon: Icon, children }: { title: string; icon: any; children: React.ReactNode }) {
  return (
    <div className="px-6 py-5 border-b border-white/[0.04]">
      <div className="flex items-center gap-2 mb-3">
        <Icon className="w-3.5 h-3.5 text-[#B6F34A]" />
        <span className="text-[10px] font-mono uppercase tracking-[0.15em] text-[#B6F34A]">{title}</span>
      </div>
      {children}
    </div>
  )
}

// --- Skeleton ---
function BentoSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 auto-rows-[180px]">
      <div className="col-span-1 sm:col-span-2 row-span-2 border border-white/[0.06] animate-pulse p-6">
        <div className="h-4 w-24 bg-white/[0.06] mb-6" />
        <div className="h-8 w-48 bg-white/[0.06] mb-3" />
        <div className="h-4 w-64 bg-white/[0.04]" />
      </div>
      <div className="col-span-1 row-span-1 border border-white/[0.06] animate-pulse p-5">
        <div className="h-5 w-5 bg-white/[0.06] mb-4" />
        <div className="h-10 w-20 bg-white/[0.06] mb-1" />
        <div className="h-3 w-24 bg-white/[0.04]" />
      </div>
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="col-span-1 row-span-1 border border-white/[0.06] animate-pulse p-4">
          <div className="h-3 w-16 bg-white/[0.06] mb-3" />
          <div className="h-4 w-28 bg-white/[0.06] mb-2" />
          <div className="h-3 w-full bg-white/[0.04]" />
        </div>
      ))}
    </div>
  )
}

// --- Main Page ---
type CategoryFilter = 'all' | string

export default function Graveyard() {
  const [filter, setFilter] = useState<CategoryFilter>('all')
  const [search, setSearch] = useState('')
  const [selectedEntry, setSelectedEntry] = useState<GraveyardEntry | null>(null)

  const { data: allEntries, isLoading } = useGraveyardEntries()
  const { data: stats } = useGraveyardStats()
  const { data: categories } = useGraveyardCategories()
  const { data: searchResults } = useGraveyardSearch(search)

  const entries = useMemo(() => {
    const base = search.trim() ? (searchResults ?? []) : (allEntries ?? [])
    if (filter === 'all') return base
    return base.filter((e) => e.classification.primary_category === filter)
  }, [allEntries, searchResults, search, filter])

  const featuredEntry = useMemo(() => entries[0], [entries])
  const gridEntries = useMemo(() => entries.slice(1), [entries])

  return (
    <SidebarShell>
      <SEO
        title="Graveyard"
        description="Projects that didn't make it. Learn from postmortems and understand why some projects fail."
        url="/graveyard"
      />
      {/* Background */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute top-[5%] right-[-8%] w-[600px] h-[600px] rounded-full bg-[#F55B5B]/[0.012] blur-[180px]" />
        <div className="absolute bottom-[5%] left-[-5%] w-[500px] h-[500px] rounded-full bg-[#B6F34A]/[0.008] blur-[150px]" />
      </div>

      <div className="relative z-10 text-[#F5F7F2]">
        <div className="max-w-[1200px] mx-auto px-5 md:px-8">

          {/* === HERO === */}
          <section className="pt-12 md:pt-20 pb-6 md:pb-8">
            <motion.div
              initial={{ opacity: 0, y: 30, filter: 'blur(8px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              transition={{ duration: 0.8, ease }}
            >
              <div className="flex items-center gap-3 mb-4">
                <Skull className="w-5 h-5 text-[#F55B5B]" />
                <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#F55B5B]">THE GRAVEYARD</span>
              </div>
              <h1 className="text-[clamp(2rem,6vw,4rem)] font-black tracking-[-0.06em] leading-[0.88] text-[#F5F7F2]">
                NOT EVERYTHING
                <br />
                <span className="text-[#555B55]">WORTH BUILDING</span>
                <br />
                GETS FINISHED.
              </h1>
            </motion.div>
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6, ease }}
              className="text-[13px] text-[#555B55] mt-5 max-w-[420px] leading-relaxed"
            >
              A collection of failed startups and dead products. Study the patterns.
              Learn from the bones. Don't repeat history.
            </motion.p>
          </section>

          {/* === FILTERS ROW === */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="flex flex-col sm:flex-row sm:items-center gap-4 py-4 mb-6 border-y border-white/[0.04]"
          >
            {/* Categories */}
            <div className="flex items-center gap-1.5 flex-wrap">
              <button
                onClick={() => setFilter('all')}
                className={`text-[10px] font-mono uppercase tracking-[0.12em] px-3 py-1.5 border transition-colors ${filter === 'all' ? 'border-[#B6F34A]/30 text-[#B6F34A] bg-[#B6F34A]/[0.05]' : 'border-white/[0.06] text-[#555B55] hover:text-[#8A8F89]'}`}
              >
                ALL
              </button>
              {categories?.map((cat) => {
                const meta = CATEGORY_META[cat.name]
                return (
                  <button
                    key={cat.name}
                    onClick={() => setFilter(cat.name)}
                    className={`text-[10px] font-mono uppercase tracking-[0.12em] px-3 py-1.5 border transition-colors ${filter === cat.name ? 'text-[#B6F34A] bg-[#B6F34A]/[0.05]' : 'text-[#555B55] hover:text-[#8A8F89]'}`}
                    style={filter === cat.name ? { borderColor: `${meta?.color}40` } : { borderColor: 'rgba(255,255,255,0.06)' }}
                  >
                    {meta?.label ?? cat.name}
                    <span className="ml-1 opacity-50">{cat.count}</span>
                  </button>
                )
              })}
            </div>

            {/* Search */}
            <div className="relative sm:ml-auto max-w-[260px] w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#303530]" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search failures..."
                className="w-full bg-white/[0.03] border border-white/[0.06] pl-9 pr-4 py-2 text-[12px] text-[#F5F7F2] placeholder:text-[#303530] focus:outline-none focus:border-[#B6F34A]/30 transition-colors"
              />
            </div>
          </motion.div>

          {/* === BENTO GRID === */}
          <section className="pb-12">
            {isLoading ? (
              <BentoSkeleton />
            ) : entries.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 auto-rows-[180px]">
                {/* Featured hero card */}
                {featuredEntry && (
                  <HeroCard entry={featuredEntry} onClick={() => setSelectedEntry(featuredEntry)} />
                )}

                {/* Stats card */}
                {stats && <StatsCard stats={stats} />}

                {/* Regular + wide cards */}
                {gridEntries.map((entry, i) => {
                  const isWide = i % 5 === 0 && i > 0
                  if (isWide) {
                    return <WideCard key={entry.id} entry={entry} index={i} onClick={() => setSelectedEntry(entry)} />
                  }
                  return <BentoCard key={entry.id} entry={entry} index={i} onClick={() => setSelectedEntry(entry)} />
                })}
              </div>
            ) : (
              <div className="py-24 text-center border border-white/[0.06]">
                <Skull className="w-8 h-8 text-[#303530] mx-auto mb-3" />
                <p className="text-[14px] text-[#555B55] mb-1">
                  {search ? 'Nothing matches.' : 'No entries yet.'}
                </p>
                <p className="text-[11px] text-[#303530]">The graveyard awaits.</p>
              </div>
            )}
          </section>

          {/* === CTA === */}
          <section className="py-14 border-t border-white/[0.06]">
            <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, ease }} className="text-center">
              <p className="text-[10px] uppercase tracking-[0.25em] text-[#303530] font-mono mb-2">DON'T BE NEXT</p>
              <p className="text-[clamp(1rem,2vw,1.4rem)] font-bold tracking-[-0.02em] text-[#F5F7F2] mb-1">Study the patterns.</p>
              <p className="text-[13px] text-[#555B55] mb-6 max-w-[340px] mx-auto">
                Every dead startup teaches something. Learn from their bones before building yours.
              </p>
              <Link
                to="/discover"
                className="relative group inline-flex items-center gap-2 px-6 py-3 text-[11px] font-medium uppercase tracking-[0.1em] text-[#080A08] overflow-hidden"
              >
                <div className="absolute inset-0 bg-[#B6F34A] transition-all duration-300 group-hover:bg-[#c8ff66]" />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <span className="relative z-10">See What's Alive →</span>
              </Link>
            </motion.div>
          </section>
        </div>

        <footer className="border-t border-white/[0.06] py-8 px-5 md:px-8">
          <div className="max-w-[1200px] mx-auto flex items-center justify-between">
            <Logo size="sm" animate={false} />
            <span className="text-[10px] text-[#303530] font-mono">© 2026</span>
          </div>
        </footer>
      </div>

      {/* Story Sidebar */}
      <AnimatePresence>
        {selectedEntry && (
          <StorySidebar entry={selectedEntry} onClose={() => setSelectedEntry(null)} />
        )}
      </AnimatePresence>
    </SidebarShell>
  )
}
