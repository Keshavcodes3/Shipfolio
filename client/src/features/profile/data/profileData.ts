export type ProjectStatus = 'BUILDING' | 'SHIPPED' | 'MAINTAINING' | 'PAUSED' | 'ARCHIVED'

export type ActivityType =
  | 'PROJECT_CREATED'
  | 'PROJECT_UPDATED'
  | 'PROJECT_SHIPPED'
  | 'PROJECT_STARTED'
  | 'PROJECT_PAUSED'
  | 'POST_PUBLISHED'
  | 'TECHNOLOGY_STARTED'
  | 'PROFILE_UPDATED'

export interface ProfileProject {
  id?: string
  name: string
  description: string
  status: ProjectStatus
  technologies: string[]
  year?: number
  featured?: boolean
  githubUrl?: string
  liveUrl?: string
  started?: string
}

export interface NowData {
  building?: string
  learning?: string
  exploring?: string
  reading?: string
}

export interface ArcEntry {
  year: string
  label: string
  description?: string
}

export interface ActivityEntry {
  type: ActivityType
  title: string
  timestamp: string
}

export interface Belief {
  body: string
}

export interface Writing {
  title: string
  excerpt?: string
  date: string
  url?: string
}

export interface ProfileData {
  username: string
  displayName: string
  headline: string
  bio: string
  about?: string
  location: string
  links: {
    github: string
    twitter: string
    email: string
  }
  stats: {
    projects: number
    shipped: number
    building: number
    followers: number
  }
  currentlyBuilding: ProfileProject
  projects: ProfileProject[]
  now?: NowData
  thinkingAbout?: string[]
  arc?: ArcEntry[]
  technologies: string[]
  currentlyExploring?: string[]
  activity: ActivityEntry[]
  beliefs?: Belief[]
  writing?: Writing[]
}

export const profileData: ProfileData = {
  username: 'keshav',
  displayName: 'Keshav',
  headline: "I BUILD THINGS I'D WANT TO USE.",
  bio: 'I like building things from scratch. Mostly interested in backend systems, AI, and strange little products that solve problems I actually have.',
  about: "I like building things from scratch.\n\nI'm interested in backend systems, AI, distributed systems, and products that feel a little strange.\n\nMost of what I build starts as a question I can't stop thinking about.",
  location: 'Delhi, India',
  links: {
    github: 'https://github.com/keshav',
    twitter: 'https://x.com/keshav',
    email: 'mailto:hello@keshav.dev',
  },
  stats: {
    projects: 12,
    shipped: 4,
    building: 1,
    followers: 238,
  },
  currentlyBuilding: {
    name: 'Letterly',
    description: 'A living space for asynchronous correspondence across the world.',
    status: 'BUILDING',
    technologies: ['TypeScript', 'PostgreSQL', 'Redis'],
    started: '42 days ago',
  },
  projects: [
    {
      name: 'Letterly',
      description: 'A living space for asynchronous correspondence across the world.',
      status: 'BUILDING',
      technologies: ['TypeScript', 'PostgreSQL', 'Redis'],
      year: 2026,
      featured: true,
    },
    {
      name: 'Orbit',
      description: 'A local-first workspace for organizing ideas without losing the thread.',
      status: 'SHIPPED',
      technologies: ['Rust', 'React', 'SQLite'],
      year: 2026,
      featured: true,
    },
    {
      name: 'Relay',
      description: 'A lightweight event-driven communication system.',
      status: 'MAINTAINING',
      technologies: ['Go', 'Redis'],
      year: 2025,
      featured: true,
    },
    {
      name: 'Pentale',
      description: 'A small experiment in collaborative storytelling.',
      status: 'SHIPPED',
      technologies: ['TypeScript', 'PostgreSQL'],
      year: 2025,
      featured: true,
    },
  ],
  now: {
    building: 'Letterly',
    learning: 'distributed systems',
    exploring: 'AI agents',
    reading: 'The Design of Everyday Things',
  },
  thinkingAbout: [
    'What makes a backend system feel alive',
    'Why most AI agents are just loops',
    "Building software that doesn't feel like software",
    'What latency does to human behavior',
  ],
  arc: [
    { year: '2024', label: 'Full-stack projects' },
    { year: '2025', label: 'Backend systems' },
    { year: '2026', label: 'Distributed systems, AI, and products' },
    { year: 'NOW', label: 'Letterly' },
  ],
  technologies: ['TypeScript', 'PostgreSQL', 'Redis', 'React', 'Node', 'Docker', 'Go'],
  currentlyExploring: ['Rust', 'Distributed systems', 'AI agents'],
  activity: [
    { type: 'POST_PUBLISHED', title: 'Published "An LLM is a next-token machine"', timestamp: '2 hours ago' },
    { type: 'PROJECT_STARTED', title: 'Started building Letterly', timestamp: 'Yesterday' },
    { type: 'PROJECT_UPDATED', title: 'Updated Orbit', timestamp: '3 days ago' },
    { type: 'TECHNOLOGY_STARTED', title: 'Started exploring Go', timestamp: '5 days ago' },
  ],
  beliefs: [
    { body: 'Software should feel inevitable after you understand the problem.' },
    { body: 'The best side projects teach you something you couldn\'t learn from a tutorial.' },
    { body: 'A finished ugly project is more valuable than a beautiful README for an unfinished one.' },
  ],
  writing: [
    {
      title: 'An LLM is a next-token machine',
      excerpt: 'A beginner-friendly explanation of what an LLM actually does.',
      date: 'Sep 2026',
      url: '#',
    },
  ],
}
