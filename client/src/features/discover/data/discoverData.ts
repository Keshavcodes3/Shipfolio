import type { Project } from '../../../lib/hooks'

export type ProjectVisual = 'orb' | 'bars' | 'grid' | 'pulse' | 'wave'

export type ProjectCategory = 'All' | 'Web' | 'AI' | 'Backend' | 'Open Source' | 'Mobile' | 'Other'

export type DeveloperSpecialty = 'All' | 'Frontend' | 'Backend' | 'Full Stack' | 'AI/ML' | 'DevOps' | 'Other'

export interface Builder {
  username: string
  displayName: string
  avatar: string
  headline: string
  bio: string
  projectCount: number
  currentProject: string | null
  technologies: string[]
  specialty: DeveloperSpecialty
  followers: number
}

export interface DiscoverProject {
  id: string
  name: string
  description: string
  builder: {
    username: string
    displayName: string
  }
  status: 'BUILDING' | 'SHIPPED'
  technologies: string[]
  visual: ProjectVisual
  category: ProjectCategory
  stars: number
  updatedAt: string
  shippedAt?: string
  startedAt?: string
}

export interface Technology {
  name: string
  projectCount: number
}

// ---------------------------------------------------------------------------
// Adapter: API Project → DiscoverProject
// ---------------------------------------------------------------------------

const VISUALS: ProjectVisual[] = ['orb', 'bars', 'grid', 'pulse', 'wave']

function deterministicVisual(id: string): ProjectVisual {
  let hash = 0
  for (let i = 0; i < id.length; i++) {
    hash = ((hash << 5) - hash + id.charCodeAt(i)) | 0
  }
  return VISUALS[Math.abs(hash) % VISUALS.length]
}

function inferCategory(technologies: string[]): ProjectCategory {
  const lower = technologies.map((t) => t.toLowerCase())
  if (lower.some((t) => ['react', 'vue', 'svelte', 'next.js', 'nuxt'].includes(t))) return 'Web'
  if (lower.some((t) => ['python', 'pytorch', 'tensorflow', 'openai'].includes(t))) return 'AI'
  if (lower.some((t) => ['go', 'rust', 'postgres', 'redis', 'docker'].includes(t))) return 'Backend'
  if (lower.some((t) => ['react native', 'flutter', 'swift', 'kotlin'].includes(t))) return 'Mobile'
  if (lower.some((t) => ['typescript', 'node.js', 'deno'].includes(t))) return 'Open Source'
  return 'Other'
}

function formatRelativeTime(dateStr: string): string {
  const now = Date.now()
  const then = new Date(dateStr).getTime()
  const diffMs = now - then
  const diffMin = Math.floor(diffMs / 60000)
  if (diffMin < 1) return 'just now'
  if (diffMin < 60) return `${diffMin}m ago`
  const diffHr = Math.floor(diffMin / 60)
  if (diffHr < 24) return `${diffHr}h ago`
  const diffDay = Math.floor(diffHr / 24)
  if (diffDay < 7) return `${diffDay}d ago`
  const diffWk = Math.floor(diffDay / 7)
  if (diffWk < 4) return `${diffWk}w ago`
  const diffMo = Math.floor(diffDay / 30)
  if (diffMo < 12) return `${diffMo}mo ago`
  return `${Math.floor(diffDay / 365)}y ago`
}

export function toDiscoverProject(project: Project): DiscoverProject {
  const techNames = project.technologies.map((t) => t.technology.name)
  return {
    id: project.id,
    name: project.name,
    description: project.description ?? '',
    builder: {
      username: project.user?.username ?? 'unknown',
      displayName: project.user?.displayName ?? project.user?.username ?? 'Unknown',
    },
    status: project.status === 'BUILDING' ? 'BUILDING' : 'SHIPPED',
    technologies: techNames,
    visual: deterministicVisual(project.id),
    category: inferCategory(techNames),
    stars: (project as any).githubRepo?.stars ?? 0,
    updatedAt: formatRelativeTime(project.updatedAt),
    shippedAt: project.status === 'SHIPPED' ? formatRelativeTime(project.updatedAt) : undefined,
    startedAt: project.startedAt ? formatRelativeTime(project.startedAt) : undefined,
  }
}

export function toFreshShip(project: Project) {
  const techNames = project.technologies.map((t) => t.technology.name)
  return {
    id: project.id,
    name: project.name,
    description: project.description ?? '',
    builder: {
      username: project.user?.username ?? 'unknown',
      displayName: project.user?.displayName ?? project.user?.username ?? 'Unknown',
    },
    technologies: techNames,
    shippedAt: formatRelativeTime(project.updatedAt),
  }
}

export const allProjects: DiscoverProject[] = [
  {
    id: 'letterly',
    name: 'Letterly',
    description: 'Asynchronous correspondence for people who still enjoy waiting for a letter.',
    builder: { username: 'keshav', displayName: 'Keshav' },
    status: 'BUILDING',
    technologies: ['TypeScript', 'Postgres', 'Redis'],
    visual: 'wave',
    category: 'Web',
    stars: 42,
    updatedAt: '2 days ago',
    startedAt: '42 days ago',
  },
  {
    id: 'relay',
    name: 'Relay',
    description: 'A small event infrastructure toolkit for products that need to move quickly.',
    builder: { username: 'maya', displayName: 'Maya' },
    status: 'BUILDING',
    technologies: ['Go', 'Redis', 'Postgres'],
    visual: 'bars',
    category: 'Backend',
    stars: 38,
    updatedAt: '5 days ago',
    startedAt: '18 days ago',
  },
  {
    id: 'orbit',
    name: 'Orbit',
    description: 'A visual playground for exploring orbital mechanics.',
    builder: { username: 'alex', displayName: 'Alex' },
    status: 'BUILDING',
    technologies: ['React', 'TypeScript'],
    visual: 'orb',
    category: 'Web',
    stars: 124,
    updatedAt: '1 day ago',
    startedAt: '7 days ago',
  },
  {
    id: 'atlas',
    name: 'Atlas',
    description: 'A minimal mapping toolkit for developers who hate bloated GIS tools.',
    builder: { username: 'noah', displayName: 'Noah' },
    status: 'BUILDING',
    technologies: ['Rust', 'WebAssembly'],
    visual: 'grid',
    category: 'Open Source',
    stars: 67,
    updatedAt: '3 days ago',
    startedAt: '3 days ago',
  },
  {
    id: 'canvas',
    name: 'Canvas',
    description: 'A collaborative visual workspace for building ideas.',
    builder: { username: 'maya', displayName: 'Maya' },
    status: 'SHIPPED',
    technologies: ['React', 'TypeScript', 'WebGL'],
    visual: 'grid',
    category: 'Web',
    stars: 89,
    updatedAt: '2 days ago',
    shippedAt: '2 days ago',
  },
  {
    id: 'pulse',
    name: 'Pulse',
    description: 'Realtime monitoring for tiny services.',
    builder: { username: 'ravi', displayName: 'Ravi' },
    status: 'SHIPPED',
    technologies: ['Go', 'Postgres'],
    visual: 'pulse',
    category: 'Backend',
    stars: 56,
    updatedAt: '4 days ago',
    shippedAt: '4 days ago',
  },
  {
    id: 'terminal',
    name: 'Terminal',
    description: 'A beautiful terminal emulator for people who care about aesthetics.',
    builder: { username: 'alex', displayName: 'Alex' },
    status: 'SHIPPED',
    technologies: ['Rust', 'Tauri'],
    visual: 'bars',
    category: 'Open Source',
    stars: 203,
    updatedAt: '1 week ago',
    shippedAt: '1 week ago',
  },
  {
    id: 'drift',
    name: 'Drift',
    description: 'A minimal note-taking tool for capturing ideas in motion.',
    builder: { username: 'noah', displayName: 'Noah' },
    status: 'SHIPPED',
    technologies: ['TypeScript', 'SQLite'],
    visual: 'wave',
    category: 'Mobile',
    stars: 31,
    updatedAt: '2 weeks ago',
    shippedAt: '2 weeks ago',
  },
  {
    id: 'stack',
    name: 'Stack',
    description: 'A tiny dependency analyzer for Node.js projects.',
    builder: { username: 'ravi', displayName: 'Ravi' },
    status: 'SHIPPED',
    technologies: ['Node.js', 'TypeScript'],
    visual: 'grid',
    category: 'Open Source',
    stars: 45,
    updatedAt: '3 weeks ago',
    shippedAt: '3 weeks ago',
  },
  {
    id: 'pentale',
    name: 'Pentale',
    description: 'A tiny writing environment that stays out of your way.',
    builder: { username: 'keshav', displayName: 'Keshav' },
    status: 'SHIPPED',
    technologies: ['Rust', 'Tauri'],
    visual: 'wave',
    category: 'Other',
    stars: 78,
    updatedAt: '2 weeks ago',
    shippedAt: '2 weeks ago',
  },
  {
    id: 'grid',
    name: 'Grid',
    description: 'A visual database inspector that actually makes sense.',
    builder: { username: 'maya', displayName: 'Maya' },
    status: 'SHIPPED',
    technologies: ['React', 'TypeScript', 'Postgres'],
    visual: 'grid',
    category: 'Backend',
    stars: 92,
    updatedAt: '1 week ago',
    shippedAt: '1 week ago',
  },
  {
    id: 'wave',
    name: 'Wave',
    description: 'Realtime collaboration without the complexity.',
    builder: { username: 'alex', displayName: 'Alex' },
    status: 'BUILDING',
    technologies: ['Go', 'Redis'],
    visual: 'wave',
    category: 'Backend',
    stars: 34,
    updatedAt: '6 days ago',
    startedAt: '10 days ago',
  },
  {
    id: 'forge',
    name: 'Forge',
    description: 'A CLI tool for generating project scaffolds that actually work.',
    builder: { username: 'ravi', displayName: 'Ravi' },
    status: 'SHIPPED',
    technologies: ['Rust', 'Node.js'],
    visual: 'bars',
    category: 'Open Source',
    stars: 156,
    updatedAt: '2 weeks ago',
    shippedAt: '2 weeks ago',
  },
]

export const allBuilders: Builder[] = [
  {
    username: 'keshav',
    displayName: 'Keshav',
    avatar: 'K',
    headline: 'Building backend systems, small products, and strange ideas.',
    bio: 'Building backend systems and small products.',
    projectCount: 12,
    currentProject: 'Letterly',
    technologies: ['TypeScript', 'Go', 'Rust', 'Python', 'PostgreSQL', 'Redis', 'React', 'Node.js'],
    specialty: 'Full Stack',
    followers: 240,
  },
  {
    username: 'maya',
    displayName: 'Maya',
    avatar: 'M',
    headline: 'Frontend engineer who cares about developer experience.',
    bio: 'Frontend engineer who cares about developer experience.',
    projectCount: 8,
    currentProject: 'Relay',
    technologies: ['React', 'TypeScript', 'Go', 'Figma', 'WebGL'],
    specialty: 'Frontend',
    followers: 186,
  },
  {
    username: 'alex',
    displayName: 'Alex',
    avatar: 'A',
    headline: 'Rust enthusiast. Building tools that respect your time.',
    bio: 'Systems programmer building developer tools.',
    projectCount: 6,
    currentProject: 'Orbit',
    technologies: ['Rust', 'Go', 'Tauri', 'SQLite', 'WebAssembly'],
    specialty: 'Backend',
    followers: 312,
  },
  {
    username: 'ravi',
    displayName: 'Ravi',
    avatar: 'R',
    headline: 'Infrastructure nerd. Monitoring everything, missing nothing.',
    bio: 'Backend engineer focused on reliability and observability.',
    projectCount: 5,
    currentProject: null,
    technologies: ['Go', 'PostgreSQL', 'Docker', 'Prometheus', 'Grafana'],
    specialty: 'DevOps',
    followers: 98,
  },
  {
    username: 'noah',
    displayName: 'Noah',
    avatar: 'N',
    headline: 'Building for the love of it. One project at a time.',
    bio: 'Independent developer. One project at a time.',
    projectCount: 4,
    currentProject: 'Atlas',
    technologies: ['Rust', 'WebAssembly', 'TypeScript', 'SQLite'],
    specialty: 'Full Stack',
    followers: 134,
  },
]

export const technologies: Technology[] = [
  { name: 'React', projectCount: 124 },
  { name: 'TypeScript', projectCount: 98 },
  { name: 'Go', projectCount: 41 },
  { name: 'Rust', projectCount: 27 },
  { name: 'Python', projectCount: 83 },
  { name: 'Postgres', projectCount: 76 },
  { name: 'Redis', projectCount: 32 },
  { name: 'AI', projectCount: 112 },
  { name: 'Next.js', projectCount: 64 },
  { name: 'Node.js', projectCount: 89 },
]
