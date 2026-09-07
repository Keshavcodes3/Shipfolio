import { useState } from 'react'
import { Link } from 'react-router'
import { ArrowRight } from 'lucide-react'
import { useAuth } from '../../auth/hooks/useAuth'
import ProfileEditPanel from './ProfileEditPanel'

export default function SidebarUser() {
  const { user } = useAuth()
  const [editOpen, setEditOpen] = useState(false)

  const displayName = user?.username ?? user?.email?.split('@')[0] ?? 'Builder'
  const initial = displayName.charAt(0).toUpperCase()

  return (
    <>
      <div className="mx-2 mb-3 flex w-[calc(100%-16px)] items-center gap-3 border border-transparent px-3 py-2.5 transition-colors duration-200 hover:border-white/[0.06] hover:bg-white/[0.02]">
        {/* Avatar — clickable to open edit panel */}
        <button
          onClick={() => setEditOpen(true)}
          className="shrink-0 rounded-full outline-none focus:ring-2 focus:ring-[#B6F34A]/30 transition-shadow"
          title="Edit profile"
        >
          {user?.avatar ? (
            <img
              src={user.avatar}
              alt={displayName}
              className="h-8 w-8 rounded-full border border-white/[0.06] object-cover"
            />
          ) : (
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#16200F] border border-white/[0.06] text-[11px] font-semibold text-[#B6F34A]">
              {initial}
            </div>
          )}
        </button>

        {/* Name + email — links to profile */}
        <Link to={`/profile/${displayName}`} className="flex-1 min-w-0 text-left group">
          <p className="text-[12px] font-medium text-[#F5F7F2] truncate group-hover:text-[#B6F34A] transition-colors">
            {displayName}
          </p>
          <p className="text-[10px] text-[#303530] truncate">
            {user?.email ?? 'Builder'}
          </p>
        </Link>

        {/* Arrow — links to profile */}
        <Link
          to={`/profile/${displayName}`}
          className="shrink-0"
        >
          <ArrowRight className="h-3 w-3 text-[#303530] transition-all duration-200 hover:text-[#555B55] hover:translate-x-0.5" />
        </Link>
      </div>

      <ProfileEditPanel open={editOpen} onClose={() => setEditOpen(false)} />
    </>
  )
}
