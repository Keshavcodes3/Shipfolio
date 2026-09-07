export const currentUser = { username: 'keshav' }

export interface BuilderProfile {
  username: string
  displayName: string
  avatar: string
  headline: string
  bio: string
  about: string
  location: string
  website: string
  links: { github: string; twitter: string; email: string }
  stats: {
    projects: number
    active: number
    shipped: number
  }
  currentlyBuilding: string | null
  projects: string[]
  technologies: string[]
  currentlyExploring: string[]
  activity: {
    id: string
    text: string
    timestamp: string
    projectId: string
  }[]
  thinkingAbout: string[]
  beliefs: { body: string }[]
}

export const builderProfiles: Record<string, BuilderProfile> = {
  keshav: {
    username: 'keshav',
    displayName: 'Keshav',
    avatar: 'K',
    headline: 'BUILDING THINGS WORTH KEEPING.',
    bio: 'Building backend systems, small products, and strange ideas.',
    about: "I'm interested in software systems, the strange corners of the internet, and building products that feel a little more human.\n\nCurrently exploring backend architecture, distributed systems, and AI.",
    location: 'Delhi, India',
    website: 'keshav.dev',
    links: {
      github: 'https://github.com/keshav',
      twitter: 'https://x.com/keshav',
      email: 'mailto:hello@keshav.dev',
    },
    stats: { projects: 19, active: 3, shipped: 12 },
    currentlyBuilding: 'letterly',
    projects: ['letterly', 'orbit', 'pentale', 'canvas', 'relay', 'pulse'],
    technologies: ['TypeScript', 'Go', 'Rust', 'Python', 'PostgreSQL', 'Redis', 'React', 'Node.js'],
    currentlyExploring: ['Rust', 'AI', 'Distributed Systems'],
    activity: [
      { id: '1', text: 'Added repository sync to Letterly', timestamp: '2 days ago', projectId: 'letterly' },
      { id: '2', text: "Improved Orbit's simulation engine", timestamp: '5 days ago', projectId: 'orbit' },
      { id: '3', text: 'Started Pentale', timestamp: '1 week ago', projectId: 'pentale' },
      { id: '4', text: 'Shipped Pulse v1', timestamp: '3 weeks ago', projectId: 'pulse' },
    ],
    thinkingAbout: [
      'What makes a backend system feel alive',
      'Why most AI agents are just loops',
      "Building software that doesn't feel like software",
    ],
    beliefs: [
      { body: 'Software should feel inevitable after you understand the problem.' },
      { body: 'The best side projects teach you something you could not learn from a tutorial.' },
    ],
  },
  maya: {
    username: 'maya',
    displayName: 'Maya',
    avatar: 'M',
    headline: 'CRAFTING INTERFACES THAT RESPECT YOUR TIME.',
    bio: 'Frontend engineer who cares about developer experience.',
    about: "I build tools and interfaces that feel natural. Most of my work lives at the intersection of design and engineering.\n\nCurrently focused on developer tools and real-time collaboration.",
    location: 'San Francisco, CA',
    website: 'maya.dev',
    links: {
      github: 'https://github.com/maya',
      twitter: 'https://x.com/maya',
      email: 'mailto:hello@maya.dev',
    },
    stats: { projects: 8, active: 2, shipped: 6 },
    currentlyBuilding: 'relay',
    projects: ['relay', 'canvas', 'grid'],
    technologies: ['React', 'TypeScript', 'Go', 'Figma', 'WebGL'],
    currentlyExploring: ['WebAssembly', 'Rust'],
    activity: [
      { id: '1', text: 'Updated Relay UI components', timestamp: '1 day ago', projectId: 'relay' },
      { id: '2', text: 'Shipped Canvas v2', timestamp: '3 days ago', projectId: 'canvas' },
    ],
    thinkingAbout: ['Why most design tools feel heavy', 'Building for developers who care about aesthetics'],
    beliefs: [{ body: 'Good interface design is invisible.' }],
  },
  alex: {
    username: 'alex',
    displayName: 'Alex',
    avatar: 'A',
    headline: 'RUST ENTHUSIAST. BUILDING TOOLS THAT RESPECT YOUR TIME.',
    bio: 'Systems programmer building developer tools.',
    about: "I write Rust because I like knowing exactly what my computer is doing. Most of my projects are tools that other developers use daily.",
    location: 'Berlin, Germany',
    website: 'alex.dev',
    links: {
      github: 'https://github.com/alex',
      twitter: 'https://x.com/alex',
      email: 'mailto:hello@alex.dev',
    },
    stats: { projects: 6, active: 1, shipped: 5 },
    currentlyBuilding: 'orbit',
    projects: ['orbit', 'terminal'],
    technologies: ['Rust', 'Go', 'Tauri', 'SQLite', 'WebAssembly'],
    currentlyExploring: ['Zig', 'Graphics programming'],
    activity: [
      { id: '1', text: 'Optimized Orbit rendering', timestamp: '3 days ago', projectId: 'orbit' },
      { id: '2', text: 'Shipped Terminal v1.1', timestamp: '1 week ago', projectId: 'terminal' },
    ],
    thinkingAbout: ['What makes a terminal feel fast', 'Why Rust is worth the learning curve'],
    beliefs: [{ body: 'Fast tools make you a faster thinker.' }],
  },
  ravi: {
    username: 'ravi',
    displayName: 'Ravi',
    avatar: 'R',
    headline: 'INFRASTRUCTURE NERD. MONITORING EVERYTHING.',
    bio: 'Backend engineer focused on reliability and observability.',
    about: "I build systems that watch other systems. Most of my work is in infrastructure, monitoring, and making sure things don't break silently.",
    location: 'Bangalore, India',
    website: 'ravi.dev',
    links: {
      github: 'https://github.com/ravi',
      twitter: 'https://x.com/ravi',
      email: 'mailto:hello@ravi.dev',
    },
    stats: { projects: 5, active: 1, shipped: 4 },
    currentlyBuilding: null,
    projects: ['pulse', 'stack'],
    technologies: ['Go', 'PostgreSQL', 'Docker', 'Prometheus', 'Grafana'],
    currentlyExploring: ['OpenTelemetry', 'eBPF'],
    activity: [
      { id: '1', text: 'Updated Pulse dashboards', timestamp: '3 weeks ago', projectId: 'pulse' },
    ],
    thinkingAbout: ['Why monitoring is harder than it looks', 'The hidden cost of observability'],
    beliefs: [{ body: 'If you can not measure it, you can not improve it.' }],
  },
  noah: {
    username: 'noah',
    displayName: 'Noah',
    avatar: 'N',
    headline: 'BUILDING FOR THE LOVE OF IT.',
    bio: 'Independent developer. One project at a time.',
    about: "I build things because I enjoy it. No grand strategy, no exit plan. Just curiosity and a keyboard.",
    location: 'Portland, OR',
    website: 'noah.dev',
    links: {
      github: 'https://github.com/noah',
      twitter: 'https://x.com/noah',
      email: 'mailto:hello@noah.dev',
    },
    stats: { projects: 4, active: 1, shipped: 3 },
    currentlyBuilding: 'atlas',
    projects: ['atlas', 'drift'],
    technologies: ['Rust', 'WebAssembly', 'TypeScript', 'SQLite'],
    currentlyExploring: ['Game engines', 'Compilers'],
    activity: [
      { id: '1', text: 'Started Atlas', timestamp: '3 days ago', projectId: 'atlas' },
    ],
    thinkingAbout: ['Why side projects are the best teachers', 'Building software that feels alive'],
    beliefs: [{ body: 'A finished ugly project beats a beautiful README.' }],
  },
}
