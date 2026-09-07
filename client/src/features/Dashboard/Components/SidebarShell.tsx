import { type ReactNode } from 'react'
import DashboardSidebar from './DashboardSidebar'
import MobileDashboardHeader from './MobileDashboardHeader'
import DashboardHeader from './DashboardHeader'

export default function SidebarShell({ children }: { children: ReactNode }) {
  return (
    <div className="h-screen overflow-hidden flex flex-col bg-[#080A08]">
      <DashboardSidebar />
      <MobileDashboardHeader />

      <div className="flex-1 flex flex-col min-h-0 lg:ml-[240px]">
        <DashboardHeader />
        <main className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>
  )
}
