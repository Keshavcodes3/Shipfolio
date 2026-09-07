import { useRef, useEffect } from 'react'
import type { SearchResults as SearchResultsType, SearchFilterType } from '../types/search'
import ProjectSearchCard from './ProjectSearchCard'
import BuilderSearchCard from './BuilderSearchCard'
import TechnologySearchCard from './TechnologySearchCard'

interface SearchResultsProps {
  results: SearchResultsType
  filter: SearchFilterType
  query: string
  selectedIndex: number
}

export default function SearchResults({ results, filter, selectedIndex }: SearchResultsProps) {
  const listRef = useRef<HTMLDivElement>(null)
  let globalIndex = 0

  useEffect(() => {
    if (listRef.current && selectedIndex >= 0) {
      const el = listRef.current.querySelector(`[data-index="${selectedIndex}"]`)
      el?.scrollIntoView({ block: 'nearest' })
    }
  }, [selectedIndex])

  const renderSection = (
    title: string,
    items: { id: string; element: React.ReactNode }[],
    count: number
  ) => {
    if (items.length === 0) return null
    return (
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-3">
          <span className="text-[10px] uppercase tracking-[0.3em] text-[#B6F34A] font-mono font-medium">
            {title}
          </span>
          <span className="text-[10px] text-[#303530] font-mono">{count} results</span>
          <div className="flex-1 h-[1px] bg-white/[0.04]" />
        </div>
        <div className="space-y-2">
          {items.map((item) => item.element)}
        </div>
      </div>
    )
  }

  const hasResults = results.projects.length + results.builders.length + results.technologies.length > 0

  if (!hasResults) return null

  return (
    <div ref={listRef} className="max-h-[calc(100vh-280px)] overflow-y-auto">
      {(filter === 'all' || filter === 'projects') && results.projects.length > 0 && (
        <>
          {renderSection(
            'Projects',
            results.projects.map((project) => {
              const idx = globalIndex++
              return {
                id: project.id,
                element: (
                  <div key={project.id} data-index={idx}>
                    <ProjectSearchCard project={project} index={0} isSelected={selectedIndex === idx} />
                  </div>
                ),
              }
            }),
            results.totals.projects
          )}
        </>
      )}

      {(filter === 'all' || filter === 'builders') && results.builders.length > 0 && (
        <>
          {renderSection(
            'Builders',
            results.builders.map((builder) => {
              const idx = globalIndex++
              return {
                id: builder.username,
                element: (
                  <div key={builder.username} data-index={idx}>
                    <BuilderSearchCard builder={builder} index={0} isSelected={selectedIndex === idx} />
                  </div>
                ),
              }
            }),
            results.totals.builders
          )}
        </>
      )}

      {(filter === 'all' || filter === 'technologies') && results.technologies.length > 0 && (
        <>
          {renderSection(
            'Technologies',
            results.technologies.map((tech) => {
              const idx = globalIndex++
              return {
                id: tech.name,
                element: (
                  <div key={tech.name} data-index={idx}>
                    <TechnologySearchCard technology={tech} index={0} isSelected={selectedIndex === idx} />
                  </div>
                ),
              }
            }),
            results.totals.technologies
          )}
        </>
      )}
    </div>
  )
}
