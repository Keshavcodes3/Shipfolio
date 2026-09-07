import { useLocation, Link } from 'react-router'
import { ChevronRight } from 'lucide-react'
import { useAuth } from '../../auth/hooks/useAuth'
import { routeLabels } from '../data/navigation'
import NotificationButton from '../../notifications/components/NotificationButton'

export default function DashboardHeader() {
  const { pathname } = useLocation()
  const { user } = useAuth()
  const label = routeLabels[pathname] ?? 'Overview'

  const displayName = user?.username ?? user?.email?.split('@')[0] ?? 'Builder'
  const initial = displayName.charAt(0).toUpperCase()

  return (
    <header className="hidden lg:flex items-center justify-between border-b border-white/[0.06] px-8 py-4">
      <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-[#555B55]">
        <span>Workspace</span>
        <ChevronRight className="h-3 w-3 text-[#303530]" />
        <span className="text-[#8A8F89]">{label}</span>
      </div>

      <div className="flex items-center gap-4">
        <NotificationButton />

        <Link to={`/profile/${displayName}`} className="flex items-center gap-2.5">
          {user?.avatar ? (
            <img
              src={user.avatar}
              alt={displayName}
              className="h-7 w-7 rounded-full border border-white/[0.06] object-cover"
            />
          ) : (
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#16200F] border border-white/[0.06] text-[10px] font-medium text-[#B6F34A]">
              {initial}
            </div>
          )}
          <span className="text-[12px] text-[#8A8F89]">{displayName}</span>
        </Link>
      </div>
    </header>
  )
}
