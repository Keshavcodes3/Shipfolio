import { useState, useEffect, useMemo } from 'react'
import { activityEvents } from '../data/activityData'
import { useFollows } from '../../follows/hooks/useFollow'
import SidebarShell from '../../Dashboard/Components/SidebarShell'
import ActivityHeader from '../components/ActivityHeader'
import ActivityItem from '../components/ActivityItem'
import ActivityEmptyState from '../components/ActivityEmptyState'

type ActivityFilter = 'ALL' | 'UPDATES' | 'PROJECTS' | 'FEEDBACK' | 'BUILDERS'

export default function Activity() {
  const { following } = useFollows()
  const [loading, setLoading] = useState(true)
  const [activeFilter, setActiveFilter] = useState<ActivityFilter>('ALL')

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 500)
    return () => clearTimeout(t)
  }, [])

  const feed = useMemo(() => {
    let result = following.length === 0
      ? []
      : activityEvents.filter((e) => following.includes(e.builder.username))

    switch (activeFilter) {
      case 'UPDATES':
        result = result.filter((e) =>
          e.type === 'PROJECT_UPDATED' || e.type === 'PROJECT_STATUS_CHANGED'
        )
        break
      case 'PROJECTS':
        result = result.filter((e) =>
          e.type === 'PROJECT_SHIPPED' || e.type === 'PROJECT_STARTED' || e.type === 'PROJECT_FEATURED'
        )
        break
      case 'FEEDBACK':
        result = result.filter((e) => e.type === 'FEEDBACK_REQUEST')
        break
      case 'BUILDERS':
        result = result.filter((e) =>
          e.type === 'PROJECT_STARTED' || e.type === 'PROJECT_FEATURED'
        )
        break
      case 'ALL':
      default:
        break
    }

    return result
  }, [following, activeFilter])

  return (
    <SidebarShell>
      <div className="text-[#F5F7F2] overflow-hidden relative">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute top-[5%] right-[-8%] w-[500px] h-[500px] rounded-full bg-[#B6F34A]/[0.03] blur-[150px]" />
        </div>

        <div className="relative z-10 max-w-[680px] mx-auto px-5 md:px-8 py-12 md:py-20">
          <ActivityHeader activeFilter={activeFilter} onFilterChange={setActiveFilter} />

          {loading ? (
            <div className="space-y-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="relative animate-pulse pl-8">
                  <div className="absolute left-0 top-1.5 w-[11px] h-[11px] rounded-full bg-white/[0.06]" />
                  <div className="h-4 w-48 bg-white/[0.06] mb-3" />
                  <div className="h-3 w-32 bg-white/[0.04] mb-4" />
                  <div className="h-[80px] bg-white/[0.03] border border-white/[0.06]" />
                </div>
              ))}
            </div>
          ) : following.length === 0 ? (
            <ActivityEmptyState />
          ) : feed.length === 0 ? (
            <ActivityEmptyState />
          ) : (
            <div>
              {feed.map((event, i) => (
                <ActivityItem key={event.id} event={event} index={i} />
              ))}
            </div>
          )}
        </div>
      </div>
    </SidebarShell>
  )
}
