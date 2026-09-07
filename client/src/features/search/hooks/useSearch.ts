import { useState, useCallback, useMemo, useEffect } from 'react'
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

  const searchResult = useMemo(() => {
    if (!debouncedQuery.trim()) return { results: DEFAULT_RESULTS, error: null }

    try {
      const searchType = activeFilter === 'all' ? undefined : activeFilter
      const r = search({ query: debouncedQuery, type: searchType })
      return { results: r, error: null }
    } catch {
      return { results: DEFAULT_RESULTS, error: 'Something went wrong while searching. Please try again.' }
    }
  }, [debouncedQuery, activeFilter])

  const results = searchResult.results
  const error = searchResult.error
  const isLoading = query.trim() !== debouncedQuery

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
