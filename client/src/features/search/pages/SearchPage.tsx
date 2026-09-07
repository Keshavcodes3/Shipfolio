import { useState, useCallback, useMemo, useRef } from 'react'
import { useNavigate } from 'react-router'
import SidebarShell from '../../Dashboard/Components/SidebarShell'
import SearchInput from '../components/SearchInput'
import SearchFilters from '../components/SearchFilters'
import SearchResults from '../components/SearchResults'
import SearchSuggestions from '../components/SearchSuggestions'
import SearchEmptyState from '../components/SearchEmptyState'
import SearchLoadingState from '../components/SearchLoadingState'
import SearchErrorState from '../components/SearchErrorState'
import { useSearch } from '../hooks/useSearch'
import { useSearchNavKeyboard } from '../hooks/useSearchKeyboard'

export default function SearchPage() {
  const navigate = useNavigate()
  const {
    query,
    setQuery,
    activeFilter,
    setFilter,
    results,
    totalResults,
    isLoading,
    error,
  } = useSearch()

  const [selectedIndex, setSelectedIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)

  const flatResults = useMemo(() => {
    const items: { id: string; type: string }[] = []
    if (activeFilter === 'all' || activeFilter === 'projects') {
      results.projects.forEach((p) => items.push({ id: p.id, type: 'project' }))
    }
    if (activeFilter === 'all' || activeFilter === 'builders') {
      results.builders.forEach((b) => items.push({ id: b.username, type: 'builder' }))
    }
    if (activeFilter === 'all' || activeFilter === 'technologies') {
      results.technologies.forEach((t) => items.push({ id: t.name, type: 'technology' }))
    }
    return items
  }, [results, activeFilter])

  const handleSelect = useCallback(() => {
    if (flatResults.length === 0) return
    const item = flatResults[selectedIndex]
    if (!item) return

    switch (item.type) {
      case 'project':
        navigate(`/projects/${item.id}`)
        break
      case 'builder':
        navigate(`/profile/${item.id}`)
        break
      case 'technology':
        navigate(`/discover?search=${encodeURIComponent(item.id)}`)
        break
    }
  }, [flatResults, selectedIndex, navigate])

  const handleClose = useCallback(() => {
    navigate(-1)
  }, [navigate])

  const handleKeyDown = useSearchNavKeyboard(
    true,
    flatResults.length,
    selectedIndex,
    setSelectedIndex,
    handleSelect,
    handleClose
  )

  const handleSuggestionSelect = useCallback((term: string) => {
    setQuery(term)
    inputRef.current?.focus()
  }, [setQuery])

  const hasQuery = query.trim().length > 0

  return (
    <SidebarShell>
      <div className="relative z-10 text-[#F5F7F2]">
        <div className="max-w-[720px] mx-auto px-5 md:px-8 py-12 md:py-20">
          <div className="mb-8">
            <h1 className="text-[clamp(1.8rem,4vw,2.5rem)] font-black tracking-[-0.05em] leading-[0.9] text-[#F5F7F2] mb-3">
              Search
            </h1>
            <p className="text-[14px] text-[#555B55]">
              Find projects, builders, and technologies.
            </p>
          </div>

          <div className="mb-6">
            <SearchInput
              ref={inputRef}
              value={query}
              onChange={setQuery}
              onKeyDown={handleKeyDown}
              autoFocus
            />
          </div>

          {hasQuery && (
            <div className="mb-6">
              <SearchFilters
                active={activeFilter}
                onChange={setFilter}
                counts={{
                  projects: results.totals.projects,
                  builders: results.totals.builders,
                  technologies: results.totals.technologies,
                  total: totalResults,
                }}
              />
            </div>
          )}

          {error ? (
            <SearchErrorState onRetry={() => setQuery(query)} />
          ) : isLoading ? (
            <SearchLoadingState />
          ) : hasQuery ? (
            totalResults > 0 ? (
              <SearchResults
                results={results}
                filter={activeFilter}
                query={query}
                selectedIndex={selectedIndex}
              />
            ) : (
              <SearchEmptyState query={query} />
            )
          ) : (
            <SearchSuggestions onSelect={handleSuggestionSelect} />
          )}
        </div>
      </div>
    </SidebarShell>
  )
}
