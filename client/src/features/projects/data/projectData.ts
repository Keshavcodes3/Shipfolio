import type { Project, ProjectDetail } from '../../../lib/hooks'

export type ProjectStatus = 'BUILDING' | 'SHIPPED' | 'MAINTAINING' | 'PAUSED' | 'ARCHIVED'

export type ProjectVisual = 'orb' | 'bars' | 'grid' | 'pulse' | 'wave'

export type ProjectVisibility = 'PUBLIC' | 'PRIVATE'

export const projectStatuses: { value: ProjectStatus; label: string }[] = [
  { value: 'BUILDING', label: 'Building' },
  { value: 'SHIPPED', label: 'Shipped' },
  { value: 'MAINTAINING', label: 'Maintaining' },
  { value: 'PAUSED', label: 'Paused' },
]

export const projectVisuals: { value: ProjectVisual; label: string }[] = [
  { value: 'orb', label: 'Orb' },
  { value: 'bars', label: 'Bars' },
  { value: 'grid', label: 'Grid' },
  { value: 'pulse', label: 'Pulse' },
  { value: 'wave', label: 'Wave' },
]

export type FilterStatus = 'ALL' | ProjectStatus

export const filterStatuses: { value: FilterStatus; label: string }[] = [
  { value: 'ALL', label: 'All' },
  { value: 'BUILDING', label: 'Building' },
  { value: 'SHIPPED', label: 'Shipped' },
  { value: 'MAINTAINING', label: 'Maintaining' },
  { value: 'PAUSED', label: 'Paused' },
  { value: 'ARCHIVED', label: 'Archived' },
]

// ---------------------------------------------------------------------------
// MyProject — shape used by the grid cards
// ---------------------------------------------------------------------------

export interface MyProject {
  id: string
  name: string
  description: string
  status: ProjectStatus
  isCurrentlyBuilding: boolean
  visibility: ProjectVisibility
  technologies: string[]
  liveUrl: string
  year: number
  visual: ProjectVisual
  needsCount?: number
  repository?: {
    owner: string
    name: string
    language: string
    stars: number
    forks: number
  }
}

// ---------------------------------------------------------------------------
// Map a backend Project to the MyProject card shape
// ---------------------------------------------------------------------------

const visualCycle: ProjectVisual[] = ['orb', 'bars', 'grid', 'pulse', 'wave']

export function toMyProject(project: Project): MyProject {
  const year = project.startedAt
    ? new Date(project.startedAt).getFullYear()
    : new Date(project.createdAt).getFullYear()

  // Deterministic visual based on project id
  const hash = project.id.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0)
  const visual = visualCycle[hash % visualCycle.length]

  return {
    id: project.id,
    name: project.name,
    description: project.description || '',
    status: project.status as ProjectStatus,
    isCurrentlyBuilding: project.isCurrentlyBuilding,
    visibility: project.visibility as ProjectVisibility,
    technologies: project.technologies.map((t) => t.technology.name),
    liveUrl: project.liveUrl || '',
    year,
    visual,
    needsCount: (project as any)._count?.projectNeeds ?? 0,
    repository: project._count ? undefined : undefined, // GitHub info not in list response
  }
}

// ---------------------------------------------------------------------------
// Map a backend ProjectDetail to the detail page shape
// ---------------------------------------------------------------------------

export interface ProjectDetailDisplay {
  id: string
  name: string
  description: string
  about: string
  story: string
  status: ProjectStatus
  isCurrentlyBuilding: boolean
  visibility: ProjectVisibility
  technologies: string[]
  visual: ProjectVisual
  liveUrl?: string
  owner: {
    username: string
    displayName: string
    bio: string
    avatar: string
    projectCount: number
    activeProjectCount: number
  }
  repository?: {
    name: string
    language: string
    isPublic: boolean
    updatedAt: string
  }
  activity: Array<{
    id: string
    type: string
    text: string
    timestamp: string
  }>
  relatedProjects: string[]
  lastUpdated: string
}

export function toProjectDetailDisplay(
  project: ProjectDetail,
  ownerProfile?: { username: string; displayName: string; bio?: string; avatar?: string }
): ProjectDetailDisplay {
  const hash = project.id.split('').reduce((acc: number, c: string) => acc + c.charCodeAt(0), 0)
  const visual = visualCycle[hash % visualCycle.length]

  const timeAgo = (date: Date) => {
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

  return {
    id: project.id,
    name: project.name,
    description: project.description || '',
    about: project.description || '',
    story: '',
    status: project.status as ProjectStatus,
    isCurrentlyBuilding: project.isCurrentlyBuilding,
    visibility: project.visibility as ProjectVisibility,
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
      : undefined,
    activity: (project.activities || []).map((a) => ({
      id: a.id,
      type: a.type,
      text: a.title || a.description || a.type,
      timestamp: timeAgo(new Date(a.occurredAt)),
    })),
    relatedProjects: [],
    lastUpdated: timeAgo(new Date(project.updatedAt)),
  }
}
