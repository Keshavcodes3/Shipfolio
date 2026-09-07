import { useMemo } from 'react'
import SidebarShell from '../../Dashboard/Components/SidebarShell'
import MeaningfulActivityItem from '../components/MeaningfulActivityItem'
import { useActivities } from '../../../lib/hooks'
import { normalizeActivity, deduplicateActivities } from '../utils/activityNormalizer'

export default function ActivityFeed() {
  const { data: rawActivities, isLoading, error } = useActivities()

  const activities = useMemo(() => {
    if (!rawActivities) return []
    const normalized = rawActivities.map(normalizeActivity)
    return deduplicateActivities(normalized)
  }, [rawActivities])

  return (
    <SidebarShell>
      <div className="relative z-10 text-[#F5F7F2]">
        <div className="max-w-[680px] mx-auto px-5 md:px-8 py-12 md:py-20">
          <div className="mb-8">
            <h1 className="text-[clamp(1.8rem,4vw,2.5rem)] font-black tracking-[-0.05em] leading-[0.9] text-[#F5F7F2] mb-3">
              Activity
            </h1>
            <p className="text-[14px] text-[#555B55]">
              What people are building and shipping.
            </p>
          </div>

          {isLoading ? (
            <div className="space-y-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="relative pl-8 animate-pulse">
                  <div className="absolute left-[5px] top-3 bottom-0 w-px bg-white/[0.06]" />
                  <div className="absolute left-0 top-1.5 w-[11px] h-[11px] rounded-full bg-white/[0.06]" />
                  <div className="flex items-center gap-2 mb-2">
                    <div className="h-3 w-20 bg-white/[0.06]" />
                    <div className="h-3 w-16 bg-white/[0.04]" />
                    <div className="h-3 w-24 bg-white/[0.06]" />
                  </div>
                  <div className="h-4 w-full bg-white/[0.04] mb-1" />
                  <div className="h-3 w-32 bg-white/[0.03]" />
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-20">
              <p className="text-[13px] text-[#555B55]">Failed to load activity.</p>
            </div>
          ) : activities.length > 0 ? (
            <div>
              {activities.map((activity, i) => (
                <MeaningfulActivityItem key={activity.id} activity={activity} index={i} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="text-[11px] uppercase tracking-[0.25em] text-[#303530] font-mono mb-3">
                NO ACTIVITY YET
              </p>
              <p className="text-[14px] text-[#555B55]">
                Follow builders to see their activity here.
              </p>
            </div>
          )}
        </div>
      </div>
    </SidebarShell>
  )
}
