import { useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageCircle, HelpCircle, Trash2, X } from 'lucide-react'
import { useProject, useUser, useDeleteProject } from '../../../lib/hooks'
import type { ProjectDetail } from '../../../lib/hooks'
import SidebarShell from '../../Dashboard/Components/SidebarShell'
import SEO from '../../../components/SEO'
import ProjectHero from '../components/ProjectHero'
import ProjectMeta from '../components/ProjectMeta'
import ProjectOverview from '../components/ProjectOverview'
import ProjectStory from '../components/ProjectStory'
import ProjectTechnologies from '../components/ProjectTechnologies'
import ProjectRepository from '../components/ProjectRepository'
import ProjectActivitySection from '../components/ProjectActivitySection'
import ProjectLinks from '../components/ProjectLinks'
import ProjectBuilder from '../components/ProjectBuilder'
import ProjectNavigation from '../components/ProjectNavigation'
import FollowBuilderButton from '../../follows/components/FollowBuilderButton'
import ProjectNeedSelector from '../components/ProjectNeedSelector'
import NeedInterestButton from '../components/NeedInterestButton'
import { useProjectNeeds } from '../../../lib/hooks'
import type { ProjectDetail as DetailType } from '../data/projectDetailData'

const ease = [0.22, 1, 0.36, 1] as const

type ProjectVisual = 'orb' | 'bars' | 'grid' | 'pulse' | 'wave'
const visualCycle: ProjectVisual[] = ['orb', 'bars', 'grid', 'pulse', 'wave']

function LoadingOverlay() {
  return (
    <div className="fixed inset-0 z-50 bg-[#080A08] flex items-center justify-center">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center">
        <motion.div
          className="w-8 h-8 rounded-full border border-[#B6F34A]/30 mx-auto mb-4"
          animate={{ rotate: 360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
        >
          <div className="w-2 h-2 rounded-full bg-[#B6F34A]/60 absolute top-0 left-1/2 -translate-x-1/2" />
        </motion.div>
        <p className="text-[11px] uppercase tracking-[0.2em] text-[#555B55] font-mono">Loading project</p>
      </motion.div>
    </div>
  )
}

function timeAgo(date: Date): string {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000)
  if (seconds < 60) return 'just now'
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  if (days < 30) return `${days}d ago`
  const months = Math.floor(days / 30)
  return `${months}mo ago`
}

function mapBackendToDisplay(
  project: ProjectDetail,
  ownerProfile?: { username: string; displayName: string; bio?: string; avatar?: string }
): DetailType {
  const hash = project.id.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0)
  const visual = visualCycle[hash % visualCycle.length]

  return {
    id: project.id,
    name: project.name,
    description: project.description || '',
    about: project.description || 'No description provided.',
    story: '',
    status: project.status as DetailType['status'],
    isCurrentlyBuilding: project.isCurrentlyBuilding,
    visibility: project.visibility as DetailType['visibility'],
    technologies: project.technologies.map((t) => t.technology.name),
    visual,
    liveUrl: project.liveUrl || undefined,
    owner: {
      username: ownerProfile?.username || '',
      displayName: ownerProfile?.displayName || '',
      bio: ownerProfile?.bio || '',
      avatar: ownerProfile?.avatar || '',
      projectCount: 0,
      activeProjectCount: 0,
    },
    repository: project.githubRepo
      ? {
          name: project.githubRepo.name,
          language: project.githubRepo.primaryLanguage || '',
          isPublic: true,
          updatedAt: timeAgo(new Date(project.updatedAt)),
        }
      : { name: '', language: '', isPublic: true, updatedAt: timeAgo(new Date(project.updatedAt)) },
    activity: (project.activities || []).map((a) => ({
      id: a.id,
      type: a.type as DetailType['activity'][number]['type'],
      text: a.title || a.description || a.type,
      timestamp: timeAgo(new Date(a.occurredAt)),
    })),
    relatedProjects: [],
    lastUpdated: timeAgo(new Date(project.updatedAt)),
  }
}

export default function ProjectWorkspace() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { data: project, isLoading, error } = useProject(id || '')
  const { data: currentUser } = useUser()
  const { data: projectNeeds = [] } = useProjectNeeds(id)
  const deleteProject = useDeleteProject()
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  const handleDelete = async () => {
    if (!id) return
    try {
      await deleteProject.mutateAsync(id)
      setShowDeleteConfirm(false)
      navigate('/dashboard')
    } catch {
      // Error handled by mutation
    }
  }

  if (isLoading) return <LoadingOverlay />

  if (error || !project) {
    return (
      <SidebarShell>
        <div className="flex items-center justify-center px-5 py-32">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease }} className="text-center">
            <p className="text-[clamp(1.5rem,3vw,2.2rem)] font-black tracking-[-0.04em] text-[#F5F7F2] mb-3">
              PROJECT NOT FOUND
            </p>
            <p className="text-[14px] text-[#555B55] mb-8">
              This project hasn{'\''}t been built yet.
            </p>
            <Link to="/discover"
              className="text-[12px] uppercase tracking-[0.12em] text-[#8A8F89] hover:text-[#F5F7F2] transition-colors duration-200">
              ← BACK TO DISCOVER
            </Link>
          </motion.div>
        </div>
      </SidebarShell>
    )
  }

  const displayProject = mapBackendToDisplay(project, currentUser ? {
    username: currentUser.username,
    displayName: currentUser.displayName,
    bio: currentUser.bio,
    avatar: currentUser.avatar,
  } : undefined)

  const isOwner = currentUser && project.userId === currentUser.id

  return (
    <SidebarShell>
      <SEO
        title={project?.name || 'Project'}
        description={project?.description || 'A project on ShipFolio.'}
        url={`/projects/${id}`}
        type="article"
      />
      <div className="relative text-[#F5F7F2] overflow-x-hidden">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute top-[5%] right-[-8%] w-[500px] h-[500px] rounded-full bg-[#B6F34A]/[0.03] blur-[150px]" />
          <div className="absolute bottom-[15%] left-[-5%] w-[400px] h-[400px] rounded-full bg-[#B6F34A]/[0.02] blur-[120px]" />
        </div>

        <div className="relative z-10">
          <div className="max-w-[860px] mx-auto px-5 md:px-8">
            <div className="flex items-center justify-between py-6 border-b border-white/[0.06]">
              <div>
                <h1 className="text-[clamp(2rem,5vw,3.5rem)] font-black tracking-[-0.06em] leading-[0.9] text-[#F5F7F2]">
                  {project.name}
                </h1>
                <p className="text-[14px] text-[#8A8F89] mt-2">{project.description}</p>
              </div>
              <div className="flex items-center gap-3 shrink-0 ml-6">
                {isOwner ? (
                  <>
                    <Link
                      to={`/projects/${project.id}/edit`}
                      className="text-[11px] uppercase tracking-[0.12em] text-[#8A8F89] hover:text-[#F5F7F2] transition-colors duration-200 font-mono border border-white/[0.12] px-4 py-1.5"
                    >
                      Edit project
                    </Link>
                    <button
                      onClick={() => setShowDeleteConfirm(true)}
                      className="text-[11px] uppercase tracking-[0.12em] text-[#555B55] hover:text-red-400 transition-colors duration-200 font-mono border border-white/[0.12] px-4 py-1.5 flex items-center gap-2"
                    >
                      <Trash2 className="w-3 h-3" />
                      Delete
                    </button>
                  </>
                ) : currentUser && displayProject.owner.username ? (
                  <FollowBuilderButton
                    username={displayProject.owner.username}
                    displayName={displayProject.owner.displayName}
                    size="sm"
                  />
                ) : null}
              </div>
            </div>

            <ProjectHero project={displayProject} />
            <ProjectMeta project={displayProject} />
            <ProjectNavigation />

            <div id="project-overview">
              <ProjectOverview about={displayProject.about} />
            </div>

            {displayProject.story && (
              <div id="project-story">
                <ProjectStory story={displayProject.story} />
              </div>
            )}

            <div id="project-stack">
              <ProjectTechnologies technologies={displayProject.technologies} />
            </div>

            {/* Currently Looking For / Needs */}
            {(projectNeeds.length > 0 || isOwner) && (
              <div className="py-10 border-t border-white/[0.06]">
                <div className="flex items-center gap-2 mb-4">
                  <HelpCircle size={14} className="text-[#8A8F89]" />
                  <h3 className="text-[11px] font-mono uppercase tracking-[0.3em] text-[#8A8F89]">CURRENTLY LOOKING FOR</h3>
                </div>
                {projectNeeds.length > 0 ? (
                  <div className="space-y-3">
                    {projectNeeds.map((need) => (
                      <div key={need.id} className="flex items-start justify-between gap-4 border border-white/[0.06] bg-white/[0.02] p-4">
                        <div className="flex-1 min-w-0">
                          <span className="text-[11px] font-mono uppercase tracking-[0.12em] text-[#B6F34A]">
                            {need.type.replace(/_/g, ' ')}
                          </span>
                          {need.note && (
                            <p className="text-[13px] text-[#8A8F89] mt-1 leading-relaxed">{need.note}</p>
                          )}
                        </div>
                        <NeedInterestButton
                          need={need}
                          projectId={id!}
                          currentUserId={currentUser?.id}
                          isOwner={!!isOwner}
                        />
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-[14px] text-[#555B55]">No active needs posted.</p>
                )}
                {isOwner && (
                  <div className="mt-4">
                    <ProjectNeedSelector projectId={id!} isOwner={true} />
                  </div>
                )}
              </div>
            )}

            <div id="project-activity">
              <ProjectActivitySection activity={displayProject.activity} />
            </div>

            {/* Feedback Section */}
            <div className="py-10 border-t border-white/[0.06]">
              <div className="flex items-center gap-2 mb-4">
                <MessageCircle size={14} className="text-[#8A8F89]" />
                <h3 className="text-[11px] font-mono uppercase tracking-[0.3em] text-[#8A8F89]">FEEDBACK</h3>
              </div>
              {isOwner ? (
                <div>
                  <p className="text-[14px] text-[#555B55] mb-4">Have an opinion about this project?</p>
                  <Link to={`/projects/${project.id}/feedback/new`}
                    className="inline-flex items-center gap-2 text-[11px] font-mono uppercase tracking-[0.12em] text-[#B6F34A] hover:text-[#B6F34A]/80 transition-colors duration-200">
                    Ask for Feedback →
                  </Link>
                </div>
              ) : (
                <p className="text-[14px] text-[#555B55]">No active feedback requests for this project.</p>
              )}
            </div>

            <div id="project-links">
              <ProjectLinks liveUrl={displayProject.liveUrl} />
            </div>

            <ProjectRepository repository={displayProject.repository} liveUrl={displayProject.liveUrl} />

            <div id="project-builder">
              <ProjectBuilder project={displayProject} isOwner={!!isOwner} />
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showDeleteConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60"
            onClick={() => setShowDeleteConfirm(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2, ease }}
              className="w-full max-w-[360px] bg-[#0A0C0A] border border-white/[0.06] p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-[16px] font-bold text-[#F5F7F2]">Delete project?</h3>
                <button onClick={() => setShowDeleteConfirm(false)} className="text-[#555B55] hover:text-[#F5F7F2] transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <p className="text-[13px] text-[#8A8F89] mb-6">
                This will permanently delete <span className="text-[#F5F7F2] font-medium">{project.name}</span> and all its data. This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={handleDelete}
                  disabled={deleteProject.isPending}
                  className="flex-1 px-4 py-2.5 text-[11px] font-mono uppercase tracking-[0.1em] text-white bg-red-500 hover:bg-red-600 transition-colors disabled:opacity-50"
                >
                  {deleteProject.isPending ? 'Deleting...' : 'Delete Project'}
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="px-4 py-2.5 text-[11px] font-mono uppercase tracking-[0.1em] text-[#555B55] border border-white/[0.06] hover:bg-white/[0.03] transition-colors"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </SidebarShell>
  )
}
