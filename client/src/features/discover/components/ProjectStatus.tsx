interface ProjectStatusProps {
  status: 'BUILDING' | 'SHIPPED'
  size?: 'sm' | 'md'
}

export default function ProjectStatus({ status, size = 'sm' }: ProjectStatusProps) {
  const isBuilding = status === 'BUILDING'

  return (
    <span className={`flex items-center gap-1.5 text-[${size === 'sm' ? '10px' : '11px'}] uppercase tracking-[0.2em] font-mono`}>
      <span className={`w-1.5 h-1.5 rounded-full ${isBuilding ? 'bg-[#B6F34A]' : 'bg-[#8A8F89]'}`} />
      <span className={isBuilding ? 'text-[#B6F34A]' : 'text-[#555B55]'}>
        {status}
      </span>
    </span>
  )
}
