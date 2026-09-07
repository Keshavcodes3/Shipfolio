import type { ComponentType } from 'react'
import {
  LayoutDashboard,
  Boxes,
  Compass,
  Users,
  UserRound,
  Search,
  Archive,
} from 'lucide-react'

export interface NavItem {
  label: string
  href: string
  icon: ComponentType<{ className?: string }>
  shortcut?: string
}

export interface NavigationGroup {
  title: string
  items: NavItem[]
}

export const workspaceNavigation: NavItem[] = [
  { label: 'Overview', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Projects', href: '/projects', icon: Boxes },
  { label: 'Discover', href: '/discover', icon: Compass },
  { label: 'Community', href: '/community', icon: Users },
  { label: 'Profile', href: '/profile/me', icon: UserRound },
]

export const exploreNavigation: NavItem[] = [
  { label: 'Graveyard', href: '/graveyard', icon: Archive },
]

export const utilityNavigation: NavItem[] = [
  { label: 'Search', href: '/search', icon: Search, shortcut: '⌘K' },
]

export const navigationGroups: NavigationGroup[] = [
  { title: 'Workspace', items: workspaceNavigation },
  { title: 'Explore', items: exploreNavigation },
  { title: 'Connect', items: utilityNavigation },
]

export const routeLabels: Record<string, string> = {
  '/dashboard': 'Overview',
  '/projects': 'Projects',
  '/discover': 'Discover',
  '/community': 'Community',
  '/graveyard': 'Graveyard',
  '/search': 'Search',
}
