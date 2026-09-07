import { useState } from 'react'
import { useParams } from 'react-router'
import { motion } from 'framer-motion'
import { User, Eye, Smartphone, AlertTriangle, GitFork, Briefcase } from 'lucide-react'
import SidebarShell from '../../Dashboard/Components/SidebarShell'
import SEO from '../../../components/SEO'
import AccountSettings from '../components/AccountSettings'
import ProfileSettings from '../components/ProfileSettings'
import GitHubSettings from '../components/GitHubSettings'
import PrivacySettings from '../components/PrivacySettings'
import SessionsSettings from '../components/SessionsSettings'
import DangerZoneSettings from '../components/DangerZoneSettings'
import ResumeSettings from '../components/ResumeSettings'

const ease = [0.22, 1, 0.36, 1] as const

type SettingsTab = 'account' | 'profile' | 'resume' | 'github' | 'privacy' | 'sessions' | 'danger'

const tabs: { value: SettingsTab; label: string; icon: typeof User }[] = [
  { value: 'account', label: 'Account', icon: User },
  { value: 'profile', label: 'Profile', icon: User },
  { value: 'resume', label: 'Resume', icon: Briefcase },
  { value: 'github', label: 'GitHub', icon: GitFork },
  { value: 'privacy', label: 'Privacy', icon: Eye },
  { value: 'sessions', label: 'Sessions', icon: Smartphone },
  { value: 'danger', label: 'Danger Zone', icon: AlertTriangle },
]

export default function SettingsPage() {
  const { tab } = useParams<{ tab?: string }>()
  const [activeTab, setActiveTab] = useState<SettingsTab>(
    (tab as SettingsTab) || 'account'
  )

  const handleTabChange = (newTab: SettingsTab) => {
    setActiveTab(newTab)
    window.history.replaceState(null, '', `/settings/${newTab}`)
  }

  return (
    <SidebarShell>
      <SEO
        title="Settings"
        description="Manage your ShipFolio account settings."
        url="/settings"
        noindex={true}
      />
      <div className="relative z-10 text-[#F5F7F2]">
        <div className="max-w-[800px] mx-auto px-5 md:px-8 py-12 md:py-20">
          <div className="mb-8">
            <h1 className="text-[clamp(1.8rem,4vw,2.5rem)] font-black tracking-[-0.05em] leading-[0.9] text-[#F5F7F2] mb-3">
              Settings
            </h1>
            <p className="text-[14px] text-[#555B55]">
              Manage your account and preferences.
            </p>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            <nav className="lg:w-[200px] shrink-0">
              <div className="flex lg:flex-col gap-1 overflow-x-auto scrollbar-none">
                {tabs.map(({ value, label, icon: Icon }) => (
                  <button
                    key={value}
                    onClick={() => handleTabChange(value)}
                    className={`relative flex items-center gap-2 px-3 py-2 text-[13px] whitespace-nowrap transition-colors duration-200 ${
                      activeTab === value
                        ? 'text-[#F5F7F2]'
                        : 'text-[#555B55] hover:text-[#8A8F89]'
                    }`}
                  >
                    {activeTab === value && (
                      <motion.div
                        layoutId="settings-tab"
                        className="absolute inset-0 bg-white/[0.06]"
                        transition={{ duration: 0.2, ease }}
                      />
                    )}
                    <Icon className="w-4 h-4 relative z-10" />
                    <span className="relative z-10">{label}</span>
                  </button>
                ))}
              </div>
            </nav>

            <div className="flex-1 min-w-0">
              {activeTab === 'account' && <AccountSettings />}
              {activeTab === 'profile' && <ProfileSettings />}
              {activeTab === 'resume' && <ResumeSettings />}
              {activeTab === 'github' && <GitHubSettings />}
              {activeTab === 'privacy' && <PrivacySettings />}
              {activeTab === 'sessions' && <SessionsSettings />}
              {activeTab === 'danger' && <DangerZoneSettings />}
            </div>
          </div>
        </div>
      </div>
    </SidebarShell>
  )
}
