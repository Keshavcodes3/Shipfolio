import { Users } from 'lucide-react'
import { Link } from 'react-router'

interface ProfileNetworkProps {
  username: string
  counts: {
    followers: number
    following: number
    projects: number
  }
  isOwnProfile: boolean
}

export default function ProfileNetwork({ username, counts, isOwnProfile }: ProfileNetworkProps) {
  return (
    <div className="border border-white/[0.06] p-6">
      <div className="flex items-center gap-2 mb-5">
        <Users className="w-4 h-4 text-[#555B55]" />
        <h3 className="text-[11px] font-mono uppercase tracking-[0.15em] text-[#555B55]">
          Network
        </h3>
      </div>

      <div className="flex items-center gap-8">
        <Link
          to={`/profile/${username}/followers`}
          className="group"
        >
          <p className="text-[24px] font-black tracking-[-0.03em] text-[#F5F7F2] group-hover:text-[#B6F34A] transition-colors">
            {counts.followers}
          </p>
          <p className="text-[10px] uppercase tracking-[0.12em] text-[#555B55] font-mono">
            Followers
          </p>
        </Link>

        <Link
          to={`/profile/${username}/following`}
          className="group"
        >
          <p className="text-[24px] font-black tracking-[-0.03em] text-[#F5F7F2] group-hover:text-[#B6F34A] transition-colors">
            {counts.following}
          </p>
          <p className="text-[10px] uppercase tracking-[0.12em] text-[#555B55] font-mono">
            Following
          </p>
        </Link>

        {isOwnProfile && (
          <Link
            to="/settings"
            className="ml-auto text-[10px] uppercase tracking-[0.12em] text-[#555B55] hover:text-[#F5F7F2] transition-colors font-mono"
          >
            Edit Profile →
          </Link>
        )}
      </div>
    </div>
  )
}
