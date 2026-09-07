import { useParams, Link } from 'react-router'
import { motion } from 'framer-motion'
import SidebarShell from '../../Dashboard/Components/SidebarShell'
import ProfileIdentity from '../components/ProfileIdentity'
import ProfileStats from '../components/ProfileStats'
import FollowBuilderButton from '../../follows/components/FollowBuilderButton'
import CurrentlyBuilding from '../components/CurrentlyBuilding'
import FeaturedProjects from '../components/FeaturedProjects'
import ProfileAbout from '../components/ProfileAbout'
import ProfileTechnologies from '../components/ProfileTechnologies'
import ProfileActivity from '../components/ProfileActivity'
import ProfileLinks from '../components/ProfileLinks'
import ProfileFooter from '../components/ProfileFooter'
import ProfileEducation from '../components/ProfileEducation'
import ProfileExperience from '../components/ProfileExperience'
import ProfileNetwork from '../components/ProfileNetwork'
import { usePublicProfile } from '../../../lib/hooks'
import { useAuth } from '../../auth/hooks/useAuth'
import LoadingScreen from '../../../components/LoadingScreen'
import SEO from '../../../components/SEO'
import type { PublicProfile as PublicProfileType, PublicProfileProject } from '../../../lib/hooks'

const ease = [0.22, 1, 0.36, 1] as const

function mapProjectToProfileProject(p: PublicProfileProject) {
  return {
    id: p.id,
    name: p.name,
    description: p.description ?? '',
    status: p.status as any,
    technologies: p.technologies.map((t) => t.name),
    featured: p.isFeatured,
    githubUrl: p.githubRepo?.htmlUrl ?? undefined,
    liveUrl: p.liveUrl ?? undefined,
    started: p.startedAt ?? undefined,
  }
}

function ProfileContent({ profile }: { profile: PublicProfileType }) {
  const { user } = useAuth()
  const isOwner = user?.username === profile.username || user?.backendId === profile.id

  const currentlyBuilding = profile.currentlyBuilding
    ? mapProjectToProfileProject(profile.currentlyBuilding)
    : null

  const featuredProjects = profile.projects
    .filter((p) => p.isFeatured && !p.isCurrentlyBuilding)
    .map(mapProjectToProfileProject)

  const techNames = profile.technologies.map((t) => t.name)

  const activityEntries = profile.buildTimeline.map((item) => ({
    type: 'PROJECT_UPDATED' as const,
    title: `${item.name} — ${item.status}`,
    timestamp: item.updatedAt,
  }))

  const links = [
    profile.githubUsername
      ? { label: 'GitHub', url: `https://github.com/${profile.githubUsername}` }
      : null,
    profile.websiteUrl ? { label: 'Website', url: profile.websiteUrl } : null,
    profile.linkedinUrl ? { label: 'LinkedIn', url: profile.linkedinUrl } : null,
  ].filter(Boolean) as { label: string; url: string }[]

  const footerLinks = {
    github: profile.githubUsername ? `https://github.com/${profile.githubUsername}` : '',
    twitter: '',
    email: '',
  }

  return (
    <SidebarShell>
      <SEO
        title={`${profile?.displayName || 'Builder'} (@${profile?.username || ''})`}
        description={profile?.bio || `Check out ${profile?.displayName}'s projects on ShipFolio.`}
        url={`/profile/${username}`}
        type="profile"
      />
      <div className="text-[#F5F7F2] relative overflow-hidden min-h-screen">
        {/* Background */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute top-[8%] right-[-8%] w-[500px] h-[500px] rounded-full bg-[#B6F34A]/[0.025] blur-[160px]" />
          <div className="absolute bottom-[15%] left-[-10%] w-[400px] h-[400px] rounded-full bg-[#B6F34A]/[0.015] blur-[130px]" />
        </div>

        <div className="relative z-10">
          <main className="max-w-[860px] mx-auto px-5 md:px-8 pt-10 md:pt-16">

            {/* === HERO === */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.7, ease }}
              className="pb-8"
            >
              <ProfileIdentity
                username={profile.username}
                headline={profile.name ?? profile.username}
                bio={profile.bio ?? ''}
                location={profile.location ?? ''}
                avatarUrl={profile.avatarUrl}
                links={{
                  github: profile.githubUsername ? `https://github.com/${profile.githubUsername}` : '',
                  twitter: '',
                  email: '',
                }}
              />
            </motion.section>

            {/* === STATS + FOLLOW BAR === */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="flex items-center justify-between py-4 mb-8 border-y border-white/[0.06]"
            >
              <ProfileStats
                stats={{
                  projects: profile.counts.projects,
                  shipped: profile.projectStatuses.shipped,
                  building: profile.projectStatuses.building,
                  followers: profile.counts.followers,
                }}
              />
              {isOwner ? (
                <Link
                  to="/dashboard"
                  className="text-[10px] uppercase tracking-[0.12em] text-[#555B55] hover:text-[#F5F7F2] transition-colors duration-200 font-mono shrink-0"
                >
                  ← Dashboard
                </Link>
              ) : (
                <FollowBuilderButton username={profile.username} displayName={profile.name ?? profile.username} />
              )}
            </motion.div>

            {/* === BENTO GRID === */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pb-16">
              {/* Currently Building — spans full width */}
              {currentlyBuilding && (
                <div className="md:col-span-2">
                  <CurrentlyBuilding project={currentlyBuilding} />
                </div>
              )}

              {/* Featured Projects — spans full width */}
              {featuredProjects.length > 0 && (
                <div className="md:col-span-2">
                  <FeaturedProjects projects={featuredProjects} />
                </div>
              )}

              {/* About */}
              {profile.bio && (
                <div className="md:col-span-1">
                  <ProfileAbout bio={profile.bio} />
                </div>
              )}

              {/* Tech */}
              {techNames.length > 0 && (
                <div className="md:col-span-1">
                  <ProfileTechnologies technologies={techNames} />
                </div>
              )}

              {/* Activity */}
              {activityEntries.length > 0 && (
                <div className="md:col-span-1">
                  <ProfileActivity activity={activityEntries} />
                </div>
              )}

              {/* Links */}
              {links.length > 0 && (
                <div className="md:col-span-1">
                  <ProfileLinks links={links} />
                </div>
              )}

              {/* Education */}
              {(profile.education ?? []).length > 0 && (
                <div className="md:col-span-1">
                  <ProfileEducation entries={profile.education!} />
                </div>
              )}

              {/* Experience */}
              {(profile.experience ?? []).length > 0 && (
                <div className="md:col-span-1">
                  <ProfileExperience entries={profile.experience!} />
                </div>
              )}

              {/* Network — followers/following */}
              <div className="md:col-span-2">
                <ProfileNetwork
                  username={profile.username}
                  counts={profile.counts}
                  isOwnProfile={profile.isOwnProfile}
                />
              </div>
            </div>
          </main>

          <ProfileFooter username={profile.username} links={footerLinks} />
        </div>
      </div>
    </SidebarShell>
  )
}

export default function PublicProfile() {
  const { username } = useParams<{ username: string }>()
  const { data: profile, isLoading, error } = usePublicProfile(username)

  if (isLoading) {
    return <LoadingScreen />
  }

  if (error || !profile) {
    return (
      <SidebarShell>
        <div className="flex items-center justify-center px-5 py-32">
          <div className="text-center">
            <p className="text-[clamp(1.5rem,3vw,2.2rem)] font-black tracking-[-0.04em] text-[#F5F7F2] mb-3">
              PROFILE NOT FOUND
            </p>
            <p className="text-[14px] text-[#555B55] mb-8">
              This builder hasn<span className="text-[#B6F34A]">'</span>t arrived here yet.
            </p>
            <Link
              to="/discover"
              className="text-[12px] uppercase tracking-[0.12em] text-[#8A8F89] hover:text-[#F5F7F2] transition-colors duration-200"
            >
              ← BACK TO DISCOVER
            </Link>
          </div>
        </div>
      </SidebarShell>
    )
  }

  return <ProfileContent profile={profile} />
}
