import type { ProjectStatus as StatusType } from '../data/projectData'

const statusStyles: Record<StatusType, { dot: string; text: string; label: string }> = {
  BUILDING: { dot: 'bg-[#B6F34A]', text: 'text-[#B6F34A]', label: 'BUILDING' },
  SHIPPED: { dot: 'bg-[#F5F7F2]', text: 'text-[#F5F7F2]', label: 'SHIPPED' },
  MAINTAINING: { dot: 'bg-[#8A8F89]', text: 'text-[#8A8F89]', label: 'MAINTAINING' },
  PAUSED: { dot: 'bg-[#555B55]', text: 'text-[#555B55]', label: 'PAUSED' },
  ARCHIVED: { dot: 'bg-[#303530]', text: 'text-[#303530]', label: 'ARCHIVED' },
}

interface ProjectStatusProps {
  status: StatusType
  isCurrentlyBuilding?: boolean
}

export default function ProjectStatus({ status, isCurrentlyBuilding }: ProjectStatusProps) {
  const style = statusStyles[status]

  return (
    <div className="flex items-center gap-2">
      <span className={`h-1.5 w-1.5 rounded-full ${style.dot}`} />
      <span className={`text-[10px] font-mono tracking-wider uppercase ${style.text}`}>
        {style.label}
      </span>
      {isCurrentlyBuilding && (
        <span className="text-[9px] font-mono tracking-wider text-[#B6F34A]/60 ml-1">
          CURRENTLY BUILDING
        </span>
      )}
    </div>
  )
}
