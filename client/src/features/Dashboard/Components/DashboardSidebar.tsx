import SidebarLogo from './SidebarLogo'
import SidebarNavigation from './SidebarNavigation'
import SidebarUser from './SidebarUser'

export default function DashboardSidebar() {
  return (
    <aside className="hidden lg:flex fixed inset-y-0 left-0 z-40 w-[240px] flex-col border-r border-white/[0.06] bg-[#080A08]">
      <SidebarLogo />
      <SidebarNavigation />
      <SidebarUser />
    </aside>
  )
}
