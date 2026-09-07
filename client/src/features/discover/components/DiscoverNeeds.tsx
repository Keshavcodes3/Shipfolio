import { useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router'
import { Search, ArrowRight, HelpCircle } from 'lucide-react'
import { useDiscoverNeeds } from '../../../lib/hooks'
import type { DiscoverNeedItem, ProjectNeedType } from '../../projects/types/projectNeed'
import { NEED_TYPE_LABELS, ALL_NEED_TYPES } from '../../projects/types/projectNeed'

const ease = [0.22, 2, 0.36, 1] as const

function NeedCard({ item, index }: { item: DiscoverNeedItem; index: number }) {
  const [hovered, setHovered] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04, duration: 0.5, ease }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <Link
        to={`/projects/${item.project.id}`}
        className="block border border-white/[0.06] relative group overflow-hidden bg-white/[0.01] hover:border-[#B6F34A]/20 transition-colors duration-300"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-[#B6F34A]/[0.04] via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

        <div className="p-5">
          {/* Need type badge */}
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-mono uppercase tracking-[0.15em] text-[#B6F34A] border border-[#B6F34A]/20 px-2 py-0.5">
              {NEED_TYPE_LABELS[item.need.type]}
            </span>
            {item.need.interestCount > 0 && (
              <span className="text-[10px] font-mono text-[#555B55]">
                {item.need.interestCount} {item.need.interestCount === 1 ? 'person' : 'people'} interested
              </span>
            )}
          </div>

          {/* Note */}
          {item.need.note && (
            <p className="text-[13px] text-[#8A8F89] leading-relaxed mb-3 line-clamp-2">
              {item.need.note}
            </p>
          )}

          {/* Project info */}
          <div className="flex items-center gap-2 mb-3 pt-3 border-t border-white/[0.04]">
            <span className="text-[12px] text-[#F5F7F2] font-medium truncate">{item.project.name}</span>
            <span className="text-[10px] text-[#555B55] font-mono">
              {item.project.status === 'BUILDING' ? 'building' : 'shipped'}
            </span>
          </div>

          {/* Tech stack */}
          <div className="flex flex-wrap gap-1 mb-3">
            {item.project.technologies.slice(0, 3).map((t) => (
              <span key={t.id} className="text-[9px] font-mono text-[#303530] border border-white/[0.06] px-1.5 py-0.5">
                {t.name}
              </span>
            ))}
            {item.project.technologies.length > 3 && (
              <span className="text-[9px] font-mono text-[#303530]">+{item.project.technologies.length - 3}</span>
            )}
          </div>

          {/* Owner */}
          <div className="flex items-center justify-between pt-3 border-t border-white/[0.04]">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-full bg-white/[0.06] flex items-center justify-center text-[8px] text-[#8A8F89] font-mono font-bold">
                {item.owner.username[0].toUpperCase()}
              </div>
              <span className="text-[11px] text-[#555B55]">@{item.owner.username}</span>
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

function Skeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div key={i} className="border border-white/[0.06] p-5 animate-pulse">
          <div className="h-4 w-20 bg-white/[0.06] mb-3" />
          <div className="h-3 w-full bg-white/[0.04] mb-1" />
          <div className="h-3 w-3/4 bg-white/[0.04] mb-3" />
          <div className="h-3 w-1/2 bg-white/[0.04]" />
        </div>
      ))}
    </div>
  )
}

export default function DiscoverNeeds() {
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState<ProjectNeedType | ''>('')

  const { data: needs = [], isLoading } = useDiscoverNeeds({
    type: typeFilter || undefined,
    search: search || undefined,
  })

  return (
    <div>
      {/* Section header */}
      <div className="flex items-center gap-3 mb-6">
        <HelpCircle className="w-3.5 h-3.5 text-[#B6F34A]" />
        <span className="text-[10px] uppercase tracking-[0.3em] text-[#B6F34A] font-mono font-medium">PROJECT NEEDS</span>
        <span className="text-[10px] text-[#303530] font-mono">({needs.length})</span>
        <div className="flex-1 h-[1px] bg-white/[0.04]" />
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1 max-w-[360px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#555B55]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search projects, needs..."
            className="w-full bg-white/[0.03] border border-white/[0.06] pl-10 pr-4 py-2.5 text-[13px] text-[#F5F7F2] placeholder:text-[#303530] focus:outline-none focus:border-[#B6F34A]/30 transition-colors"
          />
        </div>

        <div className="flex flex-wrap gap-1.5">
          <button
            onClick={() => setTypeFilter('')}
            className={`px-3 py-1.5 text-[10px] font-mono uppercase tracking-[0.12em] border transition-colors ${
              typeFilter === ''
                ? 'border-[#B6F34A]/30 text-[#B6F34A] bg-[#B6F34A]/[0.05]'
                : 'border-white/[0.06] text-[#555B55] hover:text-[#8A8F89]'
            }`}
          >
            All
          </button>
          {ALL_NEED_TYPES.slice(0, 6).map((type) => (
            <button
              key={type}
              onClick={() => setTypeFilter(type === typeFilter ? '' : type)}
              className={`px-3 py-1.5 text-[10px] font-mono uppercase tracking-[0.12em] border transition-colors ${
                typeFilter === type
                  ? 'border-[#B6F34A]/30 text-[#B6F34A] bg-[#B6F34A]/[0.05]'
                  : 'border-white/[0.06] text-[#555B55] hover:text-[#8A8F89]'
              }`}
            >
              {NEED_TYPE_LABELS[type]}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      {isLoading ? (
        <Skeleton />
      ) : needs.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {needs.map((item, i) => (
            <NeedCard key={item.need.id} item={item} index={i} />
          ))}
        </div>
      ) : (
        <div className="py-20 text-center">
          <p className="text-[14px] text-[#555B55]">
            {search || typeFilter ? 'No needs match your filters.' : 'No project needs yet.'}
          </p>
          <p className="text-[12px] text-[#303530] mt-2">
            Builders post what they need help with here.
          </p>
        </div>
      )}
    </div>
  )
}
