import { useParams, Link } from 'react-router'
import { ArrowLeft } from 'lucide-react'
import SidebarShell from '../../../features/Dashboard/Components/SidebarShell'
import { useFollowing } from '../../../lib/hooks'

export default function FollowingPage() {
  const { username } = useParams<{ username: string }>()
  const { data, isLoading } = useFollowing(username!, 1, 50)

  const following = data?.items ?? []

  return (
    <SidebarShell>
      <div className="text-[#F5F7F2] relative overflow-hidden min-h-screen">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute top-[8%] right-[-8%] w-[500px] h-[500px] rounded-full bg-[#B6F34A]/[0.025] blur-[160px]" />
        </div>

        <div className="relative z-10 max-w-[600px] mx-auto px-5 md:px-8 pt-10 md:pt-16">
          <Link
            to={`/profile/${username}`}
            className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-[0.12em] text-[#555B55] hover:text-[#F5F7F2] transition-colors font-mono mb-8"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to profile
          </Link>

          <div>
            <h1 className="text-[clamp(1.5rem,3vw,2.2rem)] font-black tracking-[-0.04em] text-[#F5F7F2] mb-1">
              Following
            </h1>
            <p className="text-[13px] text-[#555B55] mb-8">
              {isLoading ? (
                'Loading...'
              ) : (
                <>
                  <span className="text-[#B6F34A]">@{username}</span> is following{' '}
                  {following.length} {following.length === 1 ? 'person' : 'people'}
                </>
              )}
            </p>

            {isLoading ? (
              <div className="space-y-2">
                {[1, 2, 3].map((n) => (
                  <div key={n} className="flex items-center gap-3 p-3 border border-white/[0.06]">
                    <div className="w-9 h-9 rounded-full bg-white/[0.06] animate-pulse" />
                    <div className="flex-1 space-y-2">
                      <div className="h-3 bg-white/[0.06] rounded w-24" />
                      <div className="h-2.5 bg-white/[0.04] rounded w-16" />
                    </div>
                  </div>
                ))}
              </div>
            ) : following.length === 0 ? (
              <p className="text-[14px] text-[#303530]">Not following anyone yet.</p>
            ) : (
              <div className="space-y-2">
                {following.map((user: any) => (
                  <Link
                    key={user.username}
                    to={`/profile/${user.username}`}
                    className="flex items-center gap-3 p-3 border border-white/[0.06] hover:border-white/[0.12] transition-colors group"
                  >
                    {user.avatarUrl ? (
                      <img
                        src={user.avatarUrl}
                        alt={user.displayName}
                        className="w-9 h-9 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-9 h-9 rounded-full bg-white/[0.06] flex items-center justify-center text-[14px] font-bold text-[#555B55]">
                        {(user.displayName ?? user.username)[0]?.toUpperCase()}
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] font-bold text-[#F5F7F2] group-hover:text-[#B6F34A] transition-colors truncate">
                        {user.displayName ?? user.username}
                      </p>
                      <p className="text-[11px] text-[#555B55] font-mono truncate">
                        @{user.username}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </SidebarShell>
  )
}
