import SidebarShell from '../Components/SidebarShell'
import SEO from '../../../components/SEO'
import WelcomeSection from '../Components/WelcomeSection'
import GithubConnectBanner from '../Components/GithubConnectBanner'
import DashboardStats from '../Components/DashboardStats'
import CurrentProject from '../Components/CurrentProject'
import ProjectGrid from '../Components/ProjectGrid'
import GithubReposList from '../Components/GithubReposList'

export default function Dashboard() {
  return (
    <SidebarShell>
      <SEO
        title="Dashboard"
        description="Your ShipFolio dashboard."
        noindex={true}
      />
      <div className="mx-auto w-full max-w-[1100px]">
        <WelcomeSection />
        <GithubConnectBanner />
        <DashboardStats />
        <CurrentProject />
        <ProjectGrid />
        <GithubReposList />
      </div>
    </SidebarShell>
  )
}
