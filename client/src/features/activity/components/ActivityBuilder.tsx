import { Link } from 'react-router'
import FollowBuilderButton from '../../follows/components/FollowBuilderButton'
import type { ActivityEvent } from '../types/activity'

interface ActivityBuilderProps {
  event: ActivityEvent
}

export default function ActivityBuilder({ event }: ActivityBuilderProps) {
  return (
    <div className="flex items-center gap-3 py-3">
      <Link
        to={`/profile/${event.builder.username}`}
        className="flex items-center gap-2.5 group"
      >
        <div className="w-8 h-8 rounded-full bg-white/[0.06] border border-white/[0.08] flex items-center justify-center text-[#8A8F89] font-mono font-bold text-[11px] shrink-0">
          {event.builder.displayName[0]}
        </div>
        <div>
          <p className="text-[13px] font-bold text-[#F5F7F2] group-hover:text-[#B6F34A] transition-colors duration-200">
            @{event.builder.username}
          </p>
          <p className="text-[11px] text-[#303530]">{event.project.name}</p>
        </div>
      </Link>

      <div className="ml-auto">
        <FollowBuilderButton
          username={event.builder.username}
          displayName={event.builder.displayName}
          size="sm"
        />
      </div>
    </div>
  )
}
