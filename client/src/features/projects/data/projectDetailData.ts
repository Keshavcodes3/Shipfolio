export type ProjectVisual = 'orb' | 'bars' | 'grid' | 'pulse' | 'wave'

export interface ProjectActivity {
  id: string
  type: 'update' | 'shipped' | 'started' | 'milestone'
  text: string
  timestamp: string
}

export interface ProjectDetail {
  id: string
  name: string
  description: string
  about: string
  story: string
  status: 'BUILDING' | 'SHIPPED' | 'MAINTAINING' | 'PAUSED'
  isCurrentlyBuilding: boolean
  visibility: 'PUBLIC' | 'PRIVATE'
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
  repository: {
    name: string
    language: string
    isPublic: boolean
    updatedAt: string
  }
  activity: ProjectActivity[]
  relatedProjects: string[]
  lastUpdated: string
}

export const currentUser = { username: 'keshav' }

export const projects: Record<string, ProjectDetail> = {
  letterly: {
    id: 'letterly',
    name: 'Letterly',
    description: 'Asynchronous correspondence for people who still enjoy waiting for a letter.',
    about: 'Letterly is an asynchronous correspondence platform designed around the idea that not every conversation needs to happen immediately. In a world of instant messaging, Letterly deliberately slows things down.',
    story: 'I wanted to build something that made waiting feel meaningful again.\n\nMost messaging products optimize for immediacy. Letterly deliberately does the opposite.\n\nA letter takes time. That delay becomes part of the experience. You write something, send it off, and wait. The anticipation is the point.\n\nThe technical challenge was interesting too: how do you build a system that intentionally introduces latency while still feeling reliable?',
    status: 'BUILDING',
    isCurrentlyBuilding: true,
    visibility: 'PUBLIC',
    technologies: ['TypeScript', 'PostgreSQL', 'Redis', 'BullMQ', 'React', 'Node.js'],
    visual: 'wave',
    liveUrl: 'https://letterly.app',
    owner: {
      username: 'keshav',
      displayName: 'Keshav',
      bio: 'Building backend systems and small products.',
      avatar: 'K',
      projectCount: 19,
      activeProjectCount: 3,
    },
    repository: {
      name: 'letterly',
      language: 'TypeScript',
      isPublic: false,
      updatedAt: '2 days ago',
    },
    activity: [
      { id: '1', type: 'update', text: 'Added repository sync', timestamp: '2 days ago' },
      { id: '2', type: 'update', text: 'Improved letter delivery flow', timestamp: '5 days ago' },
      { id: '3', type: 'milestone', text: 'Added location-based delivery delay', timestamp: '1 week ago' },
      { id: '4', type: 'started', text: 'Started Letterly', timestamp: '42 days ago' },
    ],
    relatedProjects: ['orbit', 'pentale', 'canvas'],
    lastUpdated: '2 days ago',
  },
  orbit: {
    id: 'orbit',
    name: 'Orbit',
    description: 'A local-first workspace for organizing ideas without losing the thread.',
    about: 'Orbit is a visual workspace that helps you organize thoughts, notes, and ideas in a way that mirrors how your brain actually works — in orbits, not lists.',
    story: `Most note-taking tools force you into linear hierarchies. But ideas don't work that way. They orbit around each other, connect unexpectedly, and evolve over time.\n\nOrbit lets you place ideas in space and watch the connections form naturally.`,
    status: 'SHIPPED',
    isCurrentlyBuilding: false,
    visibility: 'PUBLIC',
    technologies: ['Rust', 'React', 'SQLite', 'Tauri'],
    visual: 'orb',
    owner: {
      username: 'keshav',
      displayName: 'Keshav',
      bio: 'Building backend systems and small products.',
      avatar: 'K',
      projectCount: 19,
      activeProjectCount: 3,
    },
    repository: {
      name: 'orbit',
      language: 'Rust',
      isPublic: true,
      updatedAt: '3 days ago',
    },
    activity: [
      { id: '1', type: 'update', text: 'Refactored rendering pipeline', timestamp: '3 days ago' },
      { id: '2', type: 'shipped', text: 'Shipped v1.0', timestamp: '2 weeks ago' },
      { id: '3', type: 'started', text: 'Started Orbit', timestamp: '3 months ago' },
    ],
    relatedProjects: ['letterly', 'pentale', 'relay'],
    lastUpdated: '3 days ago',
  },
  relay: {
    id: 'relay',
    name: 'Relay',
    description: 'A lightweight event-driven communication system.',
    about: 'Relay is a small event infrastructure toolkit for products that need to move quickly. It handles the plumbing so you can focus on what your product actually does.',
    story: 'Every time I built a new project, I found myself rewriting the same event handling code. Relay is the extraction of that pattern into something reusable.\n\nSimple, fast, and boring in the best possible way.',
    status: 'MAINTAINING',
    isCurrentlyBuilding: false,
    visibility: 'PUBLIC',
    technologies: ['Go', 'Redis', 'PostgreSQL'],
    visual: 'bars',
    owner: {
      username: 'keshav',
      displayName: 'Keshav',
      bio: 'Building backend systems and small products.',
      avatar: 'K',
      projectCount: 19,
      activeProjectCount: 3,
    },
    repository: {
      name: 'relay',
      language: 'Go',
      isPublic: true,
      updatedAt: '1 week ago',
    },
    activity: [
      { id: '1', type: 'update', text: 'Updated documentation', timestamp: '1 week ago' },
      { id: '2', type: 'shipped', text: 'Released v1.2', timestamp: '1 month ago' },
    ],
    relatedProjects: ['letterly', 'orbit', 'pulse'],
    lastUpdated: '1 week ago',
  },
  pentale: {
    id: 'pentale',
    name: 'Pentale',
    description: 'A tiny writing environment that stays out of your way.',
    about: 'Pentale is a minimal writing tool for people who want to think, not format. No toolbars, no distractions. Just your words.',
    story: 'I kept looking for a writing tool that felt like a blank page. Everything had too many features. Pentale is my answer: open it, write, close it. That\'s it.',
    status: 'SHIPPED',
    isCurrentlyBuilding: false,
    visibility: 'PUBLIC',
    technologies: ['Rust', 'Tauri', 'TypeScript'],
    visual: 'wave',
    owner: {
      username: 'keshav',
      displayName: 'Keshav',
      bio: 'Building backend systems and small products.',
      avatar: 'K',
      projectCount: 19,
      activeProjectCount: 3,
    },
    repository: {
      name: 'pentale',
      language: 'Rust',
      isPublic: true,
      updatedAt: '2 weeks ago',
    },
    activity: [
      { id: '1', type: 'shipped', text: 'Shipped Pentale', timestamp: '2 weeks ago' },
    ],
    relatedProjects: ['letterly', 'orbit', 'canvas'],
    lastUpdated: '2 weeks ago',
  },
  canvas: {
    id: 'canvas',
    name: 'Canvas',
    description: 'A collaborative visual workspace for building ideas.',
    about: 'Canvas lets you sketch, wireframe, and collaborate in real-time. Think of it as a whiteboard that actually works.',
    story: 'Every collaboration tool I tried felt either too complex or too limited. Canvas is my attempt at the middle ground.',
    status: 'SHIPPED',
    isCurrentlyBuilding: false,
    visibility: 'PUBLIC',
    technologies: ['React', 'TypeScript', 'WebGL'],
    visual: 'grid',
    owner: {
      username: 'keshav',
      displayName: 'Keshav',
      bio: 'Building backend systems and small products.',
      avatar: 'K',
      projectCount: 19,
      activeProjectCount: 3,
    },
    repository: {
      name: 'canvas',
      language: 'TypeScript',
      isPublic: true,
      updatedAt: '1 week ago',
    },
    activity: [
      { id: '1', type: 'update', text: 'Improved canvas rendering', timestamp: '1 week ago' },
    ],
    relatedProjects: ['letterly', 'orbit', 'pentale'],
    lastUpdated: '1 week ago',
  },
  pulse: {
    id: 'pulse',
    name: 'Pulse',
    description: 'A minimal developer activity tracker.',
    about: 'Pulse tracks what you ship, not what you type. It gives you a quiet record of your building habits.',
    story: 'I wanted to know what I actually shipped each week. Not commits, not lines of code — real work. Pulse is that tool.',
    status: 'SHIPPED',
    isCurrentlyBuilding: false,
    visibility: 'PUBLIC',
    technologies: ['TypeScript', 'PostgreSQL', 'Node.js'],
    visual: 'pulse',
    owner: {
      username: 'keshav',
      displayName: 'Keshav',
      bio: 'Building backend systems and small products.',
      avatar: 'K',
      projectCount: 19,
      activeProjectCount: 3,
    },
    repository: {
      name: 'pulse',
      language: 'TypeScript',
      isPublic: true,
      updatedAt: '3 weeks ago',
    },
    activity: [
      { id: '1', type: 'shipped', text: 'Shipped Pulse v1', timestamp: '3 weeks ago' },
    ],
    relatedProjects: ['letterly', 'relay', 'orbit'],
    lastUpdated: '3 weeks ago',
  },
}
