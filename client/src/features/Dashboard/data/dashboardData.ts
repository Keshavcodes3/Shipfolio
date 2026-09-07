export type ProjectStatus = 'BUILDING' | 'SHIPPED' | 'MAINTAINING' | 'PAUSED'

export interface Project {
  id: string
  name: string
  description: string
  status: ProjectStatus
  technologies: string[]
  updatedAt: string
  startedAt: string
  visual: 'orb' | 'bars' | 'grid' | 'pulse' | 'wave'
}

export interface ActivityEvent {
  id: string
  action: string
  detail: string
  project: string
  time: string
  important: boolean
}

export interface DashboardStats {
  projects: number
  shipped: number
  building: number
  profileViews: number
}

export const stats: DashboardStats = {
  projects: 12,
  shipped: 4,
  building: 1,
  profileViews: 248,
}

export const currentProject: Project = {
  id: 'orbit',
  name: 'Orbit',
  description:
    'Realtime collaboration infrastructure for small teams. Built for the way developers actually work together.',
  status: 'BUILDING',
  technologies: ['React', 'TypeScript', 'Node.js', 'Redis'],
  updatedAt: '2 hours ago',
  startedAt: 'Started 18 days ago',
  visual: 'orb',
}

export const projects: Project[] = [
  {
    id: 'relay',
    name: 'Relay',
    description:
      'A lightweight event pipeline for developer tools.',
    status: 'SHIPPED',
    technologies: ['Go', 'PostgreSQL', 'Docker'],
    updatedAt: '3 days ago',
    startedAt: 'Started 4 months ago',
    visual: 'bars',
  },
  {
    id: 'canvas',
    name: 'Canvas',
    description:
      'An experimental visual workspace for building ideas.',
    status: 'MAINTAINING',
    technologies: ['TypeScript', 'React', 'WebGL'],
    updatedAt: '1 week ago',
    startedAt: 'Started 2 months ago',
    visual: 'grid',
  },
  {
    id: 'pulse',
    name: 'Pulse',
    description:
      'Observability without the dashboard overload.',
    status: 'BUILDING',
    technologies: ['Python', 'FastAPI', 'ClickHouse'],
    updatedAt: '5 hours ago',
    startedAt: 'Started 6 days ago',
    visual: 'pulse',
  },
  {
    id: 'drift',
    name: 'Drift',
    description:
      'A minimal note-taking tool for capturing ideas in motion.',
    status: 'PAUSED',
    technologies: ['Rust', 'SQLite', 'Tauri'],
    updatedAt: '2 weeks ago',
    startedAt: 'Started 1 month ago',
    visual: 'wave',
  },
]

export const activityEvents: ActivityEvent[] = [
  {
    id: 'a1',
    action: 'Updated',
    detail: 'Added realtime sync layer',
    project: 'Orbit',
    time: '2 hours ago',
    important: true,
  },
  {
    id: 'a2',
    action: 'Shipped',
    detail: 'v1.0 is live',
    project: 'Relay',
    time: 'Yesterday',
    important: false,
  },
  {
    id: 'a3',
    action: 'Updated',
    detail: 'Added PostgreSQL integration',
    project: 'Pulse',
    time: '2 days ago',
    important: false,
  },
  {
    id: 'a4',
    action: 'Started',
    detail: 'Project created',
    project: 'Drift',
    time: '4 days ago',
    important: false,
  },
  {
    id: 'a5',
    action: 'Updated',
    detail: 'Refactored rendering pipeline',
    project: 'Canvas',
    time: '1 week ago',
    important: false,
  },
]
