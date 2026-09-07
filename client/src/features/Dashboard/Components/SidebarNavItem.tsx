import { Link, useLocation } from 'react-router'
import { motion } from 'framer-motion'
import type { NavItem } from '../data/navigation'

const ease = [0.22, 1, 0.36, 1] as const

interface SidebarNavItemProps {
  item: NavItem
  onClick?: () => void
}

function isActive(href: string, pathname: string): boolean {
  if (href === '/dashboard') return pathname === '/dashboard'
  if (href === '/projects') return pathname === '/projects' || pathname.startsWith('/projects/')
  return pathname === href
}

export default function SidebarNavItem({ item, onClick }: SidebarNavItemProps) {
  const { pathname } = useLocation()
  const active = isActive(item.href, pathname)
  const Icon = item.icon

  return (
    <Link
      to={item.href}
      onClick={onClick}
      className={`group relative flex w-full items-center gap-3 px-3 py-[7px] text-[13px] transition-colors duration-200 ${
        active
          ? 'text-[#F5F7F2] bg-white/[0.06]'
          : 'text-[#555B55] hover:text-[#F5F7F2] hover:bg-white/[0.04]'
      }`}
    >
      {active && (
        <motion.div
          layoutId="sidebar-active"
          className="absolute left-0 top-1/2 h-4 w-[2px] -translate-y-1/2 bg-[#B6F34A]"
          transition={{ duration: 0.25, ease }}
        />
      )}

      <Icon
        className={`h-4 w-4 shrink-0 transition-colors duration-200 ${
          active
            ? 'text-[#B6F34A]'
            : 'text-[#303530] group-hover:text-[#555B55]'
        }`}
      />

      <span>{item.label}</span>

      {item.shortcut && (
        <span className="ml-auto text-[10px] text-[#303530] font-mono">
          {item.shortcut}
        </span>
      )}
    </Link>
  )
}
