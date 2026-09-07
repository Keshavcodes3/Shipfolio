import { useState, useCallback, useEffect } from 'react'
import { useSearchParams } from 'react-router'
import { search } from '../services/searchService'
import { useDebounce } from './useDebounce'
import type { SearchResults, SearchFilterType } from '../types/search'

const DEFAULT_RESULTS: SearchResults = {
  projects: [],
  builders: [],
  technologies: [],
  totals: { projects: 0, builders: 0, technologies: 0 },
}

export function useSearch() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [query, setQueryState] = useState(searchParams.get('q') ?? '')
  const [activeFilter, setFilterState] = useState<SearchFilterType>(
    (searchParams.get('type') as SearchFilterType) ?? 'all'
  )

  const [results, setResults] = useState<SearchResults>(DEFAULT_RESULTS)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const debouncedQuery = useDebounce(query, 300)

  const setQuery = useCallback((value: string) => {
    setQueryState(value)
  }, [])

  const setFilter = useCallback((filter: SearchFilterType) => {
    setFilterState(filter)
  }, [])

  useEffect(() => {
    const params = new URLSearchParams()
    if (debouncedQuery) params.set('q', debouncedQuery)
    if (activeFilter !== 'all') params.set('type', activeFilter)
    setSearchParams(params, { replace: true })
  }, [debouncedQuery, activeFilter, setSearchParams])

  useEffect(() => {
    if (!debouncedQuery.trim()) {
      setResults(DEFAULT_RESULTS)
      setError(null)
      setIsLoading(false)
      return
    }

    let cancelled = false
    setIsLoading(true)

    search({ query: debouncedQuery, type: activeFilter === 'all' ? undefined : activeFilter })
      .then((r) => {
        if (!cancelled) {
          setResults(r)
          setError(null)
          setIsLoading(false)
        }
      })
      .catch(() => {
        if (!cancelled) {
          setResults(DEFAULT_RESULTS)
          setError('Something went wrong while searching. Please try again.')
          setIsLoading(false)
        }
      })

    return () => { cancelled = true }
  }, [debouncedQuery, activeFilter])

  const totalResults = results.totals.projects + results.totals.builders + results.totals.technologies

  return {
    query,
    setQuery,
    debouncedQuery,
    activeFilter,
    setFilter,
    results,
    totalResults,
    isLoading,
    error,
  }
}
