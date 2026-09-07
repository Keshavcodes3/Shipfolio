import SidebarNavItem from './SidebarNavItem'
import { navigationGroups } from '../data/navigation'

interface SidebarNavigationProps {
  onNavigate?: () => void
}

export default function SidebarNavigation({ onNavigate }: SidebarNavigationProps) {
  return (
    <nav className="flex flex-1 flex-col justify-between px-2 py-2" aria-label="Dashboard navigation">
      <div>
        {navigationGroups.map((group, gi) => (
          <div key={group.title} className={gi > 0 ? 'mt-6' : 'mt-1'}>
            <p className="mb-1.5 px-3 text-[10px] font-medium uppercase tracking-[0.16em] text-[#303530]">
              {group.title}
            </p>
            <div className="flex flex-col gap-0.5">
              {group.items.map((item) => (
                <SidebarNavItem key={item.href} item={item} onClick={onNavigate} />
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-auto px-3 pt-6 pb-2">
        <p className="text-[10px] font-medium uppercase tracking-[0.12em] text-[#B6F34A]/50">
          Keep building.
        </p>
        <p className="mt-1 text-[9px] text-[#303530] font-mono">
          01 / 2026
        </p>
      </div>
    </nav>
  )
}
