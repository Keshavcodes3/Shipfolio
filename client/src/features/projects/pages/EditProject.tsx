import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence, useInView } from 'framer-motion'
import { ArrowLeft, Star, GitFork, Search, X, Plus } from 'lucide-react'
import LoadingSpinner from '../../../components/LoadingSpinner'
import { FaGithub } from 'react-icons/fa'
import { Link, useNavigate, useParams } from 'react-router'
import {
  useProject,
  useUpdateProject,
  useGitHubRepos,
  useSyncGitHubRepos,
  useConnectGitHubRepo,
  useDisconnectGitHubRepo,
  useGitHubAccount,
  useConnectGitHub,
} from '../../../lib/hooks'
import type { GitHubRepo } from '../../../lib/hooks'
import { projectStatuses } from '../data/projectData'
import ProjectNeedSelector from '../components/ProjectNeedSelector'
import SidebarShell from '../../Dashboard/Components/SidebarShell'
import SEO from '../../../components/SEO'

const ease = [0.22, 1, 0.36, 1] as const

type Phase = 'idle' | 'saving' | 'done'

const saveSteps = [
  'Validating changes...',
  'Updating project...',
  'Syncing repository...',
  'Almost there...',
]

function HandwrittenLine({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true })

  return (
    <motion.span
      ref={ref}
      initial={{ opacity: 0, y: 16, rotate: -2 }}
      animate={inView ? { opacity: 1, y: 0, rotate: -1 } : {}}
      transition={{ delay, duration: 0.8, ease }}
      className="block"
    >
      {children}
    </motion.span>
  )
}

function SaveOverlay({ phase, projectName }: { phase: Phase; projectName: string }) {
  const [step, setStep] = useState(0)
  const navigate = useNavigate()

  useEffect(() => {
    if (phase !== 'saving') return
    const interval = setInterval(() => {
      setStep((prev) => (prev < saveSteps.length - 1 ? prev + 1 : prev))
    }, 600)
    return () => clearInterval(interval)
  }, [phase])

  useEffect(() => {
    if (phase !== 'done') return
    const timer = setTimeout(() => navigate('/dashboard'), 1800)
    return () => clearTimeout(timer)
  }, [phase, navigate])

  if (phase === 'idle') return null

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }} className="fixed inset-0 z-50 flex items-center justify-center bg-[#080A08]">
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        {[0, 1, 2].map((i) => (
          <motion.div key={i} initial={{ scale: 0, opacity: 0.3 }}
            animate={{ scale: [0, 2.5], opacity: [0.15, 0] }}
            transition={{ duration: 3, repeat: phase === 'saving' ? Infinity : 0, delay: i * 1, ease: 'easeOut' }}
            className="absolute w-40 h-40 rounded-full border border-[#B6F34A]/30" />
        ))}
      </div>

      <div className="relative flex flex-col items-center">
        <AnimatePresence mode="wait">
          {phase === 'saving' && (
            <motion.div key="saving" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }} className="flex flex-col items-center">
              <div className="relative w-28 h-28 mb-10">
                <motion.div animate={{ rotate: 360 }} transition={{ duration: 3, repeat: Infinity, ease: 'linear' }} className="absolute inset-0">
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-[#B6F34A] shadow-[0_0_20px_rgba(182,243,74,0.6)]" />
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-[#B6F34A]/40" />
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-[#B6F34A]/30" />
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-[#B6F34A]/30" />
                </motion.div>
                <motion.div animate={{ rotate: -360 }} transition={{ duration: 5, repeat: Infinity, ease: 'linear' }} className="absolute inset-3 rounded-full border border-[#B6F34A]/20" />
                <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: 'linear' }} className="absolute inset-6 rounded-full border-2 border-dashed border-[#B6F34A]/30" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 2, repeat: Infinity }}>
                    <FaGithub className="w-8 h-8 text-[#B6F34A]" />
                  </motion.div>
                </div>
              </div>

              <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                className="text-[clamp(1.5rem,3vw,2.2rem)] font-black tracking-[-0.04em] text-[#F5F7F2] mb-2 text-center">
                {projectName || 'Your project'}
              </motion.p>

              <div className="flex items-center gap-1.5 mb-6">
                {[0, 1, 2, 3].map((i) => (
                  <motion.div key={i} animate={{ scale: step >= i ? [1, 1.4, 1] : 1, backgroundColor: step >= i ? '#B6F34A' : 'rgba(255,255,255,0.1)' }}
                    transition={{ duration: 0.3 }} className="w-2 h-2 rounded-full" />
                ))}
              </div>

              <AnimatePresence mode="wait">
                <motion.p key={step} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.25 }} className="text-[13px] text-[#555B55] font-mono tracking-wide">
                  {saveSteps[step]}
                </motion.p>
              </AnimatePresence>
            </motion.div>
          )}

          {phase === 'done' && (
            <motion.div key="done" initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }}
              transition={{ type: 'spring', stiffness: 200, damping: 15 }} className="flex flex-col items-center">
              <div className="relative mb-10">
                {[...Array(8)].map((_, i) => (
                  <motion.div key={i} initial={{ scaleY: 0, opacity: 0 }} animate={{ scaleY: 1, opacity: [0, 0.6, 0] }}
                    transition={{ delay: 0.2 + i * 0.05, duration: 0.6 }}
                    className="absolute top-1/2 left-1/2 w-[2px] h-16 bg-[#B6F34A]/40 origin-bottom"
                    style={{ transform: `translate(-50%, -100%) rotate(${i * 45}deg)` }} />
                ))}
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20, delay: 0.1 }}
                  className="w-28 h-28 rounded-full bg-[#B6F34A] flex items-center justify-center shadow-[0_0_60px_rgba(182,243,74,0.3)]">
                  <motion.svg initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                    transition={{ delay: 0.4, duration: 0.5, ease: 'easeOut' }}
                    className="w-14 h-14 text-[#080A08]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <motion.path initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                      transition={{ delay: 0.4, duration: 0.5, ease: 'easeOut' }}
                      strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </motion.svg>
                </motion.div>
              </div>
              <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
                className="text-[clamp(1.5rem,3vw,2.2rem)] font-black tracking-[-0.04em] text-[#F5F7F2] mb-2">
                Changes saved<span className="text-[#B6F34A]">.</span>
              </motion.p>
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}
                className="text-[13px] text-[#555B55] font-mono">
                Redirecting to dashboard...
              </motion.p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}

const langColor: Record<string, string> = {
  TypeScript: '#3178c6', JavaScript: '#f1e05a', Python: '#3572A5', Go: '#00ADD8',
  Rust: '#dea584', Java: '#b07219', 'C++': '#f34b7d', C: '#555555', Ruby: '#701516',
  PHP: '#4F5D95', Swift: '#F05138', Kotlin: '#A97BFF', Dart: '#00B4AB', Shell: '#89e051',
}

export default function EditProject() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const { data: project, isLoading: projectLoading } = useProject(id || '')
  const updateProject = useUpdateProject()
  const connectRepo = useConnectGitHubRepo()
  const disconnectRepo = useDisconnectGitHubRepo()
  const syncRepos = useSyncGitHubRepos()
  const connectGitHub = useConnectGitHub()
  const { data: githubAccount, isLoading: githubLoading } = useGitHubAccount()
  const { data: syncedRepos, isLoading: reposLoading } = useGitHubRepos(githubAccount ? id : undefined)

  const isGitHubConnected = !!githubAccount

  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [status, setStatus] = useState<string>('BUILDING')
  const [visibility, setVisibility] = useState<string>('PUBLIC')
  const [liveUrl, setLiveUrl] = useState('')
  const [selectedRepo, setSelectedRepo] = useState<GitHubRepo | null>(null)
  const [search, setSearch] = useState('')
  const [focused, setFocused] = useState<string | null>(null)
  const [phase, setPhase] = useState<Phase>('idle')
  const [error, setError] = useState('')

  // Populate form when project loads
  useEffect(() => {
    if (!project) return
    setName(project.name)
    setDescription(project.description || '')
    setStatus(project.status)
    setVisibility(project.visibility)
    setLiveUrl(project.liveUrl || '')
    // Set connected repo if exists
    if (project.githubRepo) {
      setSelectedRepo({
        id: project.githubRepo.id,
        githubId: project.githubRepo.id,
        name: project.githubRepo.name,
        fullName: project.githubRepo.fullName,
        htmlUrl: project.githubRepo.htmlUrl,
        description: null,
        primaryLanguage: project.githubRepo.primaryLanguage,
        stars: project.githubRepo.stars,
        forks: project.githubRepo.forks,
        isPrivate: false,
        topics: [],
        connectedProjectId: id,
      })
    }
  }, [project, id])

  const canSubmit = name.trim().length > 0 && phase === 'idle' && !updateProject.isPending && !projectLoading

  const filteredRepos = (syncedRepos || []).filter(
    (r) =>
      (r.connectedProjectId === id || !r.connectedProjectId) &&
      (r.name.toLowerCase().includes(search.toLowerCase()) ||
        (r.description && r.description.toLowerCase().includes(search.toLowerCase())))
  )

  const handleSyncAndRefresh = async () => {
    try {
      await syncRepos.mutateAsync()
    } catch {
      // sync failed
    }
  }

  const handleLinkGitHub = async () => {
    try {
      sessionStorage.setItem('github_link_return', `/projects/${id}/edit`)
      const { url, state } = await connectGitHub.mutateAsync('link')
      sessionStorage.setItem('github_oauth_state', state)
      window.location.href = url
    } catch {
      // error handled by mutation
    }
  }

  const handleSubmit = async () => {
    if (!canSubmit || !id) return
    setPhase('saving')
    setError('')

    try {
      await updateProject.mutateAsync({
        id,
        name: name.trim(),
        description: description.trim() || null,
        status,
        visibility,
        liveUrl: liveUrl.trim() || null,
        isCurrentlyBuilding: status === 'BUILDING',
      })

      // Handle repo connection/disconnection
      if (selectedRepo && selectedRepo.id !== project?.githubRepoId) {
        try {
          await connectRepo.mutateAsync({ repoId: selectedRepo.id, projectId: id })
        } catch {
          // repo connection failed
        }
      } else if (!selectedRepo && project?.githubRepoId) {
        try {
          await disconnectRepo.mutateAsync(id)
        } catch {
          // repo disconnect failed
        }
      }

      setPhase('done')
    } catch (err: any) {
      setPhase('idle')
      setError(err?.response?.data?.message || 'Failed to save changes. Please try again.')
    }
  }

  if (projectLoading) {
    return (
      <SidebarShell>
        <div className="min-h-screen flex items-center justify-center">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center">
            <LoadingSpinner size={32} className="mb-4" />
            <p className="text-[13px] text-[#555B55] font-mono">Loading project...</p>
          </motion.div>
        </div>
      </SidebarShell>
    )
  }

  if (!project) {
    return (
      <SidebarShell>
        <div className="flex items-center justify-center px-5 py-32">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease }} className="text-center">
            <p className="text-[clamp(1.5rem,3vw,2.2rem)] font-black tracking-[-0.04em] text-[#F5F7F2] mb-3">
              PROJECT NOT FOUND
            </p>
            <Link to="/dashboard"
              className="text-[12px] uppercase tracking-[0.12em] text-[#8A8F89] hover:text-[#F5F7F2] transition-colors duration-200">
              ← BACK TO DASHBOARD
            </Link>
          </motion.div>
        </div>
      </SidebarShell>
    )
  }

  return (
    <SidebarShell>
      <SEO
        title="Edit Project"
        description="Edit your project on ShipFolio."
        noindex={true}
      />
      <div className="flex flex-col relative overflow-x-hidden h-full">
        <AnimatePresence>
          {phase !== 'idle' && <SaveOverlay phase={phase} projectName={name} />}
        </AnimatePresence>

        <div className="pointer-events-none absolute inset-0">
          <div className="absolute top-[-30%] left-[-10%] w-[500px] h-[500px] rounded-full bg-[#B6F34A]/[0.03] blur-[120px]" />
          <div className="absolute bottom-[-20%] right-[-5%] w-[400px] h-[400px] rounded-full bg-[#B6F34A]/[0.02] blur-[100px]" />
        </div>

        <motion.header initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease }}
          className="relative z-10 flex items-center justify-between border-b border-white/[0.06] px-5 py-4 md:px-8">
          <Link to="/dashboard"
            className="group flex items-center gap-2 text-[12px] text-[#555B55] hover:text-[#F5F7F2] transition-colors duration-200">
            <ArrowLeft className="h-3.5 w-3.5 transition-transform duration-200 group-hover:-translate-x-0.5" />
            <span className="uppercase tracking-[0.15em]">Dashboard</span>
          </Link>
          <span className="text-[12px] uppercase tracking-[0.15em] text-[#8A8F89]">Edit project</span>
        </motion.header>

        <div className="relative z-10 flex-1 flex flex-col lg:flex-row min-h-0">
          {/* ─── LEFT: Form ─── */}
          <div className="lg:w-[45%] flex flex-col justify-center px-6 py-10 lg:px-14 lg:py-0 border-b lg:border-b-0 lg:border-r border-white/[0.06] overflow-y-auto min-h-0">
            <div className="w-full max-w-[420px] mx-auto py-10 lg:py-0">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.7, ease }} className="mb-10">
                <span className="text-[10px] uppercase tracking-[0.25em] text-[#B6F34A] font-mono">01 — Details</span>
                <h1 className="text-[clamp(1.5rem,3vw,2.2rem)] font-bold tracking-[-0.04em] leading-[1.1] text-[#F5F7F2] mt-3">
                  Edit your<br />project<span className="text-[#B6F34A]">.</span>
                </h1>
              </motion.div>

              {/* Project name */}
              <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5, ease }} className="mb-7">
                <label className="block text-[10px] uppercase tracking-[0.2em] text-[#555B55] font-mono mb-3">Project name *</label>
                <div className="relative">
                  <input type="text" value={name} onChange={(e) => setName(e.target.value)}
                    onFocus={() => setFocused('name')} onBlur={() => setFocused(null)}
                    placeholder="my-awesome-project"
                    className="w-full bg-transparent border-b border-white/[0.08] pb-3 pt-1 text-[18px] text-[#F5F7F2] placeholder-[#303530] outline-none transition-colors duration-300"
                    style={{ borderColor: focused === 'name' ? 'rgba(182,243,74,0.4)' : undefined }} />
                  <motion.div className="absolute bottom-0 left-0 h-[1px] bg-[#B6F34A]"
                    initial={{ width: '0%' }} animate={{ width: focused === 'name' ? '100%' : '0%' }}
                    transition={{ duration: 0.3, ease }} />
                </div>
              </motion.div>

              {/* Description */}
              <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5, ease }} className="mb-7">
                <label className="block text-[10px] uppercase tracking-[0.2em] text-[#555B55] font-mono mb-3">Description</label>
                <textarea value={description} onChange={(e) => setDescription(e.target.value.slice(0, 500))}
                  onFocus={() => setFocused('desc')} onBlur={() => setFocused(null)}
                  placeholder="What are you building?" rows={3}
                  className="w-full bg-transparent border p-4 text-[14px] text-[#F5F7F2] placeholder-[#303530] outline-none transition-colors duration-300 resize-none leading-relaxed"
                  style={{ borderColor: focused === 'desc' ? 'rgba(182,243,74,0.2)' : 'rgba(255,255,255,0.06)' }} />
                <p className="mt-2 text-right text-[11px] text-[#303530] font-mono">{description.length} / 500</p>
              </motion.div>

              {/* Status */}
              <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35, duration: 0.5, ease }} className="mb-7">
                <label className="block text-[10px] uppercase tracking-[0.2em] text-[#555B55] font-mono mb-3">Status</label>
                <div className="grid grid-cols-2 gap-2">
                  {projectStatuses.map((s) => (
                    <button key={s.value} onClick={() => setStatus(s.value)}
                      className={`px-4 py-3 text-[13px] font-medium border-2 transition-all duration-300 ${
                        status === s.value
                          ? 'border-[#B6F34A]/50 bg-[#B6F34A]/[0.06] text-[#F5F7F2]'
                          : 'border-white/[0.06] text-[#8A8F89] hover:border-white/[0.12] hover:bg-white/[0.02]'
                      }`}>
                      {s.label}
                    </button>
                  ))}
                </div>
              </motion.div>

              {/* Visibility */}
              <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.5, ease }} className="mb-7">
                <label className="block text-[10px] uppercase tracking-[0.2em] text-[#555B55] font-mono mb-3">Visibility</label>
                <div className="grid grid-cols-2 gap-2">
                  {[{ value: 'PUBLIC', label: 'Public' }, { value: 'PRIVATE', label: 'Private' }].map((v) => (
                    <button key={v.value} onClick={() => setVisibility(v.value)}
                      className={`px-4 py-3 text-[13px] font-medium border-2 transition-all duration-300 ${
                        visibility === v.value
                          ? 'border-[#B6F34A]/50 bg-[#B6F34A]/[0.06] text-[#F5F7F2]'
                          : 'border-white/[0.06] text-[#8A8F89] hover:border-white/[0.12] hover:bg-white/[0.02]'
                      }`}>
                      {v.label}
                    </button>
                  ))}
                </div>
              </motion.div>

              {/* Live URL */}
              <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.45, duration: 0.5, ease }} className="mb-8">
                <label className="block text-[10px] uppercase tracking-[0.2em] text-[#555B55] font-mono mb-3">Live URL</label>
                <div className="relative">
                  <input type="url" value={liveUrl} onChange={(e) => setLiveUrl(e.target.value)}
                    onFocus={() => setFocused('url')} onBlur={() => setFocused(null)}
                    placeholder="https://myproject.com"
                    className="w-full bg-transparent border-b border-white/[0.08] pb-3 pt-1 text-[14px] text-[#F5F7F2] placeholder-[#303530] outline-none transition-colors duration-300"
                    style={{ borderColor: focused === 'url' ? 'rgba(182,243,74,0.4)' : undefined }} />
                  <motion.div className="absolute bottom-0 left-0 h-[1px] bg-[#B6F34A]"
                    initial={{ width: '0%' }} animate={{ width: focused === 'url' ? '100%' : '0%' }}
                    transition={{ duration: 0.3, ease }} />
                </div>
              </motion.div>

              {/* Selected repo preview */}
              <AnimatePresence>
                {selectedRepo && (
                  <motion.div initial={{ opacity: 0, y: 10, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -6, scale: 0.97 }} transition={{ duration: 0.3, ease }}
                    className="mb-8 p-4 border border-[#B6F34A]/15 bg-[#B6F34A]/[0.02]">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-8 h-8 rounded-full bg-[#B6F34A]/10 flex items-center justify-center shrink-0">
                          <FaGithub className="w-4 h-4 text-[#B6F34A]" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-[13px] text-[#F5F7F2] font-medium truncate">{selectedRepo.fullName}</p>
                          <div className="flex items-center gap-2 mt-1 text-[11px] text-[#555B55] font-mono">
                            {selectedRepo.primaryLanguage && <span>{selectedRepo.primaryLanguage}</span>}
                            <span>★ {selectedRepo.stars}</span>
                          </div>
                        </div>
                      </div>
                      <button onClick={() => setSelectedRepo(null)}
                        className="text-[11px] uppercase tracking-wider text-[#555B55] hover:text-red-400 transition-colors">
                        Remove
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Error */}
              <AnimatePresence>
                {error && (
                  <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }} className="text-[13px] font-medium text-red-400 mb-4 overflow-hidden">
                    {error}
                  </motion.p>
                )}
              </AnimatePresence>

              {/* Project Needs */}
              {id && (
                <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.45, duration: 0.5, ease }} className="mb-7">
                  <label className="block text-[10px] uppercase tracking-[0.2em] text-[#555B55] font-mono mb-3">
                    Project needs
                  </label>
                  <p className="text-[12px] text-[#303530] mb-3">
                    What are you looking for help with? Others can offer to help.
                  </p>
                  <ProjectNeedSelector projectId={id} isOwner={true} mode="edit" />
                </motion.div>
              )}

              <motion.div initial={{ opacity: 0, scaleX: 0 }} animate={{ opacity: 1, scaleX: 1 }}
                transition={{ delay: 0.5, duration: 0.6, ease }}
                className="h-[1px] bg-gradient-to-r from-transparent via-white/[0.08] to-transparent mb-7" />

              <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.5, ease }} className="flex items-center justify-between">
                <Link to="/dashboard"
                  className="text-[12px] uppercase tracking-[0.12em] text-[#555B55] hover:text-[#8A8F89] transition-colors duration-200">
                  Cancel
                </Link>
                <motion.button onClick={handleSubmit} disabled={!canSubmit}
                  whileHover={canSubmit ? { scale: 1.02 } : undefined}
                  whileTap={canSubmit ? { scale: 0.98 } : undefined}
                  className="relative group flex items-center gap-2.5 px-7 py-3 text-[12px] font-medium uppercase tracking-[0.1em] text-[#080A08] transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed overflow-hidden">
                  <div className="absolute inset-0 bg-[#B6F34A] transition-all duration-300 group-hover:bg-[#c8ff66] group-disabled:bg-[#F5F7F2]" />
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <span className="relative z-10 flex items-center gap-2">
                     {updateProject.isPending ? <LoadingSpinner size={14} /> : null}
                    Save changes
                  </span>
                </motion.button>
              </motion.div>
            </div>
          </div>

          {/* ─── RIGHT: GitHub repos ─── */}
          <div className="lg:w-[55%] flex flex-col relative min-h-0 overflow-y-auto">
            <div className="absolute top-0 left-0 w-[3px] h-full bg-gradient-to-b from-[#B6F34A]/0 via-[#B6F34A]/40 to-[#B6F34A]/0 hidden lg:block" />

            <div className="flex-1 flex flex-col px-6 py-10 lg:px-14 lg:py-8">
              <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.8, ease }} className="mb-8">
                <span className="text-[10px] uppercase tracking-[0.25em] text-[#B6F34A] font-mono">02 — Repository</span>
                <div className="mt-4 mb-6">
                  <div className="text-[clamp(2rem,5vw,3.5rem)] font-black tracking-[-0.05em] leading-[0.95] text-[#F5F7F2]">
                    <HandwrittenLine delay={0.4}>Change your</HandwrittenLine>
                    <HandwrittenLine delay={0.55}><span className="text-[#B6F34A]">repo.</span></HandwrittenLine>
                  </div>
                  <motion.p initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8, duration: 0.5 }}
                    className="mt-5 text-[15px] text-[#555B55] leading-relaxed max-w-[380px]">
                    We{'\''}ll keep the existing data. You can swap to a different repo anytime.
                  </motion.p>
                </div>
              </motion.div>

              {/* Not connected state */}
              {githubLoading ? (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  className="flex flex-col items-center justify-center py-16">
                  <div className="relative mb-4 w-12 h-12">
                    <motion.div
                      className="absolute inset-0 rounded-full border border-[#B6F34A]/15"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
                    />
                    <motion.div
                      className="absolute inset-1.5 rounded-full border border-dashed border-[#B6F34A]/10"
                      animate={{ rotate: -360 }}
                      transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
                    />
                    <motion.div
                      className="absolute top-0 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#B6F34A]"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 2.5, repeat: Infinity, ease: 'linear' }}
                      style={{ transformOrigin: '0px 24px' }}
                    />
                    <LoadingSpinner size={16} className="absolute inset-0 m-auto" />
                  </div>
                  <p className="text-[13px] text-[#555B55] font-mono">Checking GitHub...</p>
                </motion.div>
              ) : !isGitHubConnected ? (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.6, ease }}
                  className="flex flex-col items-center justify-center py-12">
                  <motion.div animate={{ y: [0, -8, 0] }} transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                    className="w-20 h-20 rounded-2xl border-2 border-dashed border-[#B6F34A]/20 flex items-center justify-center mb-6 relative">
                    <FaGithub className="w-8 h-8 text-[#555B55]" />
                    {/* Orbiting dots */}
                    <motion.div
                      className="absolute w-1.5 h-1.5 rounded-full bg-[#B6F34A]/50"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
                      style={{ transformOrigin: '0px -44px', top: '50%', left: '50%' }}
                    />
                    <motion.div
                      className="absolute w-1 h-1 rounded-full bg-[#B6F34A]/30"
                      animate={{ rotate: -360 }}
                      transition={{ duration: 5, repeat: Infinity, ease: 'linear' }}
                      style={{ transformOrigin: '0px -36px', top: '50%', left: '50%' }}
                    />
                    <motion.div
                      className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-[#B6F34A]/40"
                      animate={{ scale: [1, 1.3, 1], opacity: [0.4, 0.7, 0.4] }}
                      transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                    />
                  </motion.div>
                  <p className="text-[15px] text-[#F5F7F2] font-medium text-center mb-2">
                    Connect your GitHub account
                  </p>
                  <p className="text-[13px] text-[#555B55] text-center mb-6 max-w-[280px] leading-relaxed">
                    Link your GitHub to swap repositories on this project.
                  </p>
                  <motion.button onClick={handleLinkGitHub}
                    disabled={connectGitHub.isPending}
                    whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                    className="flex items-center gap-2 px-6 py-3 bg-[#B6F34A] text-[12px] font-bold uppercase tracking-[0.12em] text-[#080A08] hover:bg-[#c8ff66] transition-all duration-200 disabled:opacity-30">
                    {connectGitHub.isPending ? (
                           <LoadingSpinner size={16} />
                    ) : (
                      <>
                        <FaGithub className="w-4 h-4" />
                        Connect GitHub
                      </>
                    )}
                  </motion.button>
                </motion.div>
              ) : (
                <>
                  {/* Connected — sync button */}
                  <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6, duration: 0.5, ease }} className="mb-6">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="flex items-center gap-2 text-[11px] text-[#B6F34A] font-mono">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#B6F34A]" />
                        Connected as @{githubAccount?.username}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <motion.button onClick={handleSyncAndRefresh}
                        disabled={syncRepos.isPending}
                        whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                        className="flex-1 px-6 py-3 bg-[#B6F34A] text-[12px] font-bold uppercase tracking-[0.12em] text-[#080A08] hover:bg-[#c8ff66] transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                        {syncRepos.isPending ? (
                               <LoadingSpinner size={16} />
                        ) : (
                          <>
                            <FaGithub className="w-4 h-4" />
                            Sync Repos
                          </>
                        )}
                      </motion.button>
                    </div>
                  </motion.div>

                  {/* Search filter */}
                  {syncedRepos && syncedRepos.length > 0 && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-4">
                      <div className="flex items-center gap-2 border border-white/[0.06] px-3 py-2">
                        <Search className="w-3 h-3 text-[#555B55] shrink-0" />
                        <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
                          placeholder="Filter repositories"
                          className="flex-1 bg-transparent text-[12px] text-[#F5F7F2] placeholder-[#303530] outline-none" />
                        {search && (
                          <button onClick={() => setSearch('')} className="text-[#555B55] hover:text-[#8A8F89]">
                            <X className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    </motion.div>
                  )}

                  {/* Repo list */}
                  <div className="flex-1 overflow-hidden">
                    <AnimatePresence mode="popLayout">
                      {syncedRepos && syncedRepos.length > 0 && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
                          <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.05 }} className="flex items-center justify-between mb-4">
                            <span className="text-[11px] uppercase tracking-[0.2em] text-[#555B55] font-mono">
                              {filteredRepos.length} repositories
                            </span>
                          </motion.div>

                          <div className="space-y-2.5">
                            {filteredRepos.map((repo, i) => (
                              <motion.button key={repo.id}
                                initial={{ opacity: 0, x: 30, scale: 0.95 }}
                                animate={{ opacity: 1, x: 0, scale: 1 }}
                                transition={{ delay: i * 0.05, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                                onClick={() => setSelectedRepo(repo)}
                                className={`w-full text-left p-5 border-2 transition-all duration-300 group relative overflow-hidden ${
                                  selectedRepo?.id === repo.id
                                    ? 'border-[#B6F34A]/50 bg-[#B6F34A]/[0.06]'
                                    : 'border-white/[0.04] hover:border-white/[0.12] bg-transparent hover:bg-white/[0.02]'
                                }`}>
                                <div className="absolute inset-0 bg-gradient-to-r from-[#B6F34A]/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                                <div className="relative flex items-start justify-between gap-3">
                                  <div className="min-w-0 flex-1">
                                    <div className="flex items-center gap-2.5">
                                      <span className="text-[15px] text-[#F5F7F2] font-bold truncate">{repo.name}</span>
                                      {repo.isPrivate && (
                                        <span className="text-[9px] uppercase tracking-wider text-[#8A8F89] border border-white/[0.1] px-1.5 py-0.5 font-mono">private</span>
                                      )}
                                      {repo.connectedProjectId === id && (
                                        <span className="text-[9px] uppercase tracking-wider text-[#B6F34A] border border-[#B6F34A]/20 px-1.5 py-0.5 font-mono">current</span>
                                      )}
                                    </div>
                                    {repo.description && (
                                      <p className="text-[12px] text-[#555B55] mt-1.5 line-clamp-1 leading-relaxed">{repo.description}</p>
                                    )}
                                    <div className="flex items-center gap-4 mt-3">
                                      {repo.primaryLanguage && (
                                        <span className="flex items-center gap-1.5 text-[11px] text-[#8A8F89] font-mono font-medium">
                                          <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: langColor[repo.primaryLanguage] || '#888' }} />
                                          {repo.primaryLanguage}
                                        </span>
                                      )}
                                      <span className="flex items-center gap-1 text-[11px] text-[#555B55] font-mono">
                                        <Star className="w-3.5 h-3.5" /> {repo.stars}
                                      </span>
                                      <span className="flex items-center gap-1 text-[11px] text-[#555B55] font-mono">
                                        <GitFork className="w-3.5 h-3.5" /> {repo.forks}
                                      </span>
                                    </div>
                                  </div>
                                  <div className="shrink-0 mt-1">
                                    {selectedRepo?.id === repo.id ? (
                                      <motion.div initial={{ scale: 0, rotate: -90 }} animate={{ scale: 1, rotate: 0 }}
                                        transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                                        className="w-7 h-7 rounded-full bg-[#B6F34A] flex items-center justify-center">
                                        <svg className="w-4 h-4 text-[#080A08]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                        </svg>
                                      </motion.div>
                                    ) : (
                                      <div className="w-7 h-7 rounded-full border-2 border-white/[0.08] group-hover:border-white/[0.2] transition-colors duration-300" />
                                    )}
                                  </div>
                                </div>
                              </motion.button>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {syncedRepos && syncedRepos.length === 0 && !reposLoading && (
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                        className="flex flex-col items-center justify-center py-16">
                        <motion.div animate={{ y: [0, -8, 0] }} transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                          className="w-20 h-20 rounded-2xl border-2 border-dashed border-white/[0.08] flex items-center justify-center mb-6 relative">
                          <FaGithub className="w-8 h-8 text-[#303530]" />
                          {/* Orbiting dots */}
                          <motion.div
                            className="absolute w-1.5 h-1.5 rounded-full bg-[#B6F34A]/50"
                            animate={{ rotate: 360 }}
                            transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
                            style={{ transformOrigin: '0px -44px', top: '50%', left: '50%' }}
                          />
                          <motion.div
                            className="absolute w-1 h-1 rounded-full bg-[#B6F34A]/30"
                            animate={{ rotate: -360 }}
                            transition={{ duration: 5, repeat: Infinity, ease: 'linear' }}
                            style={{ transformOrigin: '0px -36px', top: '50%', left: '50%' }}
                          />
                          <motion.div
                            className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-[#B6F34A]/40"
                            animate={{ scale: [1, 1.3, 1], opacity: [0.4, 0.7, 0.4] }}
                            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                          />
                        </motion.div>
                        <p className="text-[14px] text-[#555B55] font-medium text-center leading-relaxed">
                          No synced repositories yet.<br />
                          Click <span className="text-[#B6F34A]">Sync Repos</span> to fetch from GitHub.
                        </p>
                      </motion.div>
                    )}

                    {reposLoading && (
                      <div className="flex flex-col items-center justify-center py-16">
                        <div className="relative mb-3 w-12 h-12">
                          <motion.div
                            className="absolute inset-0 rounded-full border border-[#B6F34A]/15"
                            animate={{ rotate: 360 }}
                            transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
                          />
                          <motion.div
                            className="absolute top-0 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#B6F34A]"
                            animate={{ rotate: 360 }}
                            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                            style={{ transformOrigin: '0px 24px' }}
                          />
                          <LoadingSpinner size={16} className="absolute inset-0 m-auto" />
                        </div>
                        <p className="text-[13px] text-[#555B55] font-mono">Loading repositories...</p>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </SidebarShell>
  )
}
