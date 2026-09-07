export interface GraveyardProject {
  id: string
  name: string
  slug: string
  builder: {
    username: string
    displayName: string
    avatar?: string
    bio?: string
    otherProjects?: string[]
  }
  description: string
  longDescription: string
  category: string
  technologies: string[]
  abandonedAt: string
  startedAt: string
  duration: string
  reason: string
  reasonLabel: string
  lesson: string
  wouldBuildAgain: boolean
  whatChanged: string
  repository?: string
  liveUrl?: string
  visualType: string
  featured?: boolean
  tags?: string[]
  timeline?: { date: string; event: string }[]
  whatWentWrong?: string[]
  whatWentRight?: string[]
  technicalDecisions?: { decision: string; outcome: string; lesson: string }[]
  advice?: string
  metrics?: { label: string; value: string }[]
  relatedLessons?: string[]
}

export const graveyardProjects: GraveyardProject[] = [
  {
    id: 'letterly',
    name: 'Letterly',
    slug: 'letterly',
    builder: {
      username: 'keshav',
      displayName: 'Keshav',
      avatar: 'K',
      bio: 'Building backend systems and small products.',
      otherProjects: ['Pentale', 'Archive'],
    },
    description: 'Async communication between strangers. A living space for asynchronous correspondence across the world.',
    longDescription: `Letterly was supposed to be the anti-email. A platform where strangers could write letters to each other — long-form, thoughtful, asynchronous communication in a world of instant messages.

The idea came from frustration. Every messaging app optimized for speed. Nobody optimized for depth.

I wanted to build something where you'd write a letter on Monday, and someone across the world would read it on Wednesday. Where the delay was a feature, not a bug.

The architecture was beautiful. PostgreSQL for storage, Redis for pub/sub, a custom letter delivery system with scheduled sends. The code was clean. The tests passed.

Nobody used it.

Not because the product was bad. Because I never validated whether anyone wanted to write letters to strangers. I assumed the problem was real because it was real for me.

Four months of building. Zero months of validating.

The hardest lesson? The code was never the problem.`,
    category: 'STARTUPS',
    technologies: ['TypeScript', 'PostgreSQL', 'Redis', 'React', 'Node.js', 'Docker'],
    abandonedAt: 'May 2026',
    startedAt: 'January 2026',
    duration: '4 months',
    reason: 'Built the wrong thing',
    reasonLabel: 'BUILT THE WRONG THING',
    lesson: "Don't spend three weeks solving infrastructure problems before knowing whether anyone wants the product. Build the landing page first. Get signups. Then build the product.",
    wouldBuildAgain: false,
    whatChanged: 'Realized the problem was validation, not engineering. Now I validate before I build.',
    repository: 'https://github.com/keshav/letterly',
    visualType: 'letters',
    featured: true,
    tags: ['validation', 'product-market-fit', 'async', 'communication'],
    timeline: [
      { date: 'Jan 2026', event: 'Had the idea during a frustrating email exchange' },
      { date: 'Jan 2026', event: 'Designed the database schema and architecture' },
      { date: 'Feb 2026', event: 'Built the letter delivery system' },
      { date: 'Feb 2026', event: 'Implemented Redis pub/sub for real-time updates' },
      { date: 'Mar 2026', event: 'Built the React frontend' },
      { date: 'Mar 2026', event: 'Added user authentication and profiles' },
      { date: 'Apr 2026', event: 'Realized nobody was using it' },
      { date: 'Apr 2026', event: 'Tried marketing. Got 3 signups. None returned.' },
      { date: 'May 2026', event: 'Archived the project' },
    ],
    whatWentWrong: [
      'Never validated the problem before building',
      'Spent 3 weeks on infrastructure before knowing if anyone wanted the product',
      'Built for myself, assumed others had the same problem',
      'No marketing plan — just expected people to find it',
      'The "delay as a feature" was actually a bug for most users',
    ],
    whatWentRight: [
      'The architecture was solid and could scale',
      'The code quality was high',
      'Learned PostgreSQL scheduling patterns',
      'Built a reusable letter delivery system',
      'The experience informed all future projects',
    ],
    technicalDecisions: [
      { decision: 'PostgreSQL for letter scheduling', outcome: 'Worked well, but overkill for the scale', lesson: 'Use simpler tools until you need complexity' },
      { decision: 'Redis pub/sub for real-time', outcome: 'Good performance, but added operational complexity', lesson: 'HTTP polling is fine for MVPs' },
      { decision: 'Custom letter delivery system', outcome: 'Elegant but nobody used it', lesson: 'Build the feature, not the infrastructure' },
    ],
    advice: 'Ship a landing page before you ship a product. If nobody signs up, nobody would have used it.',
    metrics: [
      { label: 'Total signups', value: '7' },
      { label: 'Active users', value: '0' },
      { label: 'Letters sent', value: '2 (both from me)' },
      { label: 'Commits', value: '342' },
      { label: 'Lines of code', value: '14,200' },
      { label: 'Time wasted', value: '4 months' },
    ],
    relatedLessons: [
      'Validate before you build',
      'Landing pages are cheaper than products',
      'Your problem is not everyone\'s problem',
      'Shipping means users, not code',
    ],
  },
  {
    id: 'orbit',
    name: 'Orbit',
    slug: 'orbit',
    builder: {
      username: 'alex',
      displayName: 'Alex',
      avatar: 'A',
      bio: 'Systems programmer building developer tools.',
      otherProjects: ['Terminal', 'Wave'],
    },
    description: 'A local-first workspace for organizing ideas. Circular orbital paths for thought management.',
    longDescription: `Orbit was my attempt at building a note-taking app that thought differently. Instead of folders and tags, ideas would orbit around each other based on relevance.

The concept was inspired by how my brain actually works. Ideas don't live in folders. They cluster, drift apart, and occasionally collide.

The Rust backend was fast. The React frontend was responsive. The orbital visualization was beautiful.

But I kept expanding scope. First it was notes. Then collaboration. Then real-time sync. Then offline support. Then plugins.

By month two, I was building infrastructure for features I hadn't even validated.

The lesson? Ship the smallest thing first, then expand. Don't build the cathedral before you know anyone wants to pray.`,
    category: 'SIDE PROJECTS',
    technologies: ['Rust', 'React', 'SQLite', 'TypeScript'],
    abandonedAt: 'April 2026',
    startedAt: 'February 2026',
    duration: '2 months',
    reason: 'Too ambitious',
    reasonLabel: 'TOO AMBITIOUS',
    lesson: 'Scope creep is real. Ship the smallest thing first, then expand. Don\'t build the cathedral before you know anyone wants to pray.',
    wouldBuildAgain: true,
    whatChanged: 'Learned to define MVPs before building. Now I ship in weeks, not months.',
    repository: 'https://github.com/alex/orbit',
    visualType: 'orbital',
    tags: ['scope-creep', 'mvp', 'rust', 'notes'],
    timeline: [
      { date: 'Feb 2026', event: 'Concept: ideas orbiting based on relevance' },
      { date: 'Feb 2026', event: 'Built Rust backend with SQLite' },
      { date: 'Mar 2026', event: 'Created orbital visualization in React' },
      { date: 'Mar 2026', event: 'Added real-time sync (unnecessary)' },
      { date: 'Mar 2026', event: 'Started building plugin system (way too early)' },
      { date: 'Apr 2026', event: 'Burnout. Realized scope was impossible alone.' },
    ],
    whatWentWrong: [
      'Scope creep — kept adding features before validating core',
      'No MVP definition — everything was priority 1',
      'Built real-time sync before anyone used the basic version',
      'Plugin system for an app with zero users',
      'Perfectionism disguised as engineering',
    ],
    whatWentRight: [
      'Rust backend performed beautifully',
      'The orbital concept was genuinely interesting',
      'Learned Rust patterns that transferred to other projects',
      'SQLite was the right choice for local-first',
    ],
    technicalDecisions: [
      { decision: 'Rust for backend', outcome: 'Fast but slow to develop', lesson: 'Rust is great for systems, not always for MVPs' },
      { decision: 'SQLite for local-first', outcome: 'Perfect choice', lesson: 'Simple databases are underrated' },
      { decision: 'Real-time sync before launch', outcome: 'Added 2 weeks of complexity for a feature nobody needed', lesson: 'Sync is a scaling problem, not a launch problem' },
    ],
    advice: 'Define your MVP in one sentence. If you can\'t, you don\'t have an MVP yet.',
    metrics: [
      { label: 'MVP completed', value: 'No' },
      { label: 'Features built', value: '12' },
      { label: 'Features used', value: '0' },
      { label: 'Scope creep score', value: '∞' },
    ],
    relatedLessons: [
      'Ship the smallest thing',
      'Features don\'t matter if nobody uses the base',
      'Infrastructure is not a product',
      'Perfectionism kills projects',
    ],
  },
  {
    id: 'relay',
    name: 'Relay',
    slug: 'relay',
    builder: {
      username: 'maya',
      displayName: 'Maya',
      avatar: 'M',
      bio: 'Frontend engineer who cares about developer experience.',
      otherProjects: ['Canvas', 'Grid'],
    },
    description: 'A lightweight event-driven communication system for developer tools.',
    longDescription: `Relay started as a solution to a real problem. I was building a dashboard that needed to update in real-time, and every solution was either too heavy (Socket.io) or too complex (Kafka).

I thought: what if there was a lightweight event system that just worked? No configuration, no clusters, no operational overhead.

The Go backend was fast. The Redis transport was reliable. The API was clean.

But somewhere in month two, I realized I was building infrastructure for a problem most developers solve with an HTTP endpoint.

The passion faded. Not because the code was bad, but because the problem wasn't interesting enough to sustain months of work.

Passion matters more than market size. Build what excites you.`,
    category: 'OPEN SOURCE',
    technologies: ['Go', 'Redis', 'gRPC', 'Protocol Buffers'],
    abandonedAt: 'March 2026',
    startedAt: 'December 2025',
    duration: '3 months',
    reason: 'Lost interest',
    reasonLabel: 'LOST INTEREST',
    lesson: 'Passion matters more than market size. Build what excites you, not what seems useful.',
    wouldBuildAgain: false,
    whatChanged: 'Found a different problem worth solving. Learned to follow curiosity, not utility.',
    repository: 'https://github.com/maya/relay',
    liveUrl: 'https://relay.dev',
    visualType: 'nodes',
    tags: ['passion', 'open-source', 'developer-tools', 'go'],
    timeline: [
      { date: 'Dec 2025', event: 'Frustrated by existing real-time solutions' },
      { date: 'Dec 2025', event: 'Designed the event-driven architecture' },
      { date: 'Jan 2026', event: 'Built Go backend with Redis transport' },
      { date: 'Feb 2026', event: 'Added gRPC for high-performance use cases' },
      { date: 'Feb 2026', event: 'Published to GitHub. Got 47 stars.' },
      { date: 'Mar 2026', event: 'Lost interest. The problem wasn\'t exciting enough.' },
    ],
    whatWentWrong: [
      'Built for utility, not passion',
      'The problem was real but not interesting to me',
      'No community — open source needs more than code',
      'Over-engineered for the actual use cases',
    ],
    whatWentRight: [
      'Go backend was genuinely fast and clean',
      'Redis transport worked perfectly',
      'Got real users (47 stars, 3 contributors)',
      'Learned Go patterns that transferred to other projects',
      'Published a real open source project',
    ],
    technicalDecisions: [
      { decision: 'Go for backend', outcome: 'Great choice for this use case', lesson: 'Go is perfect for network services' },
      { decision: 'Redis for transport', outcome: 'Reliable and fast', lesson: 'Redis is more than a cache' },
      { decision: 'gRPC for performance', outcome: 'Added complexity most users didn\'t need', lesson: 'HTTP is fine for 99% of use cases' },
    ],
    advice: 'If you\'re building open source, build something you\'d use yourself. Passion is the only sustainable fuel.',
    metrics: [
      { label: 'GitHub stars', value: '47' },
      { label: 'Contributors', value: '3' },
      { label: 'Issues opened', value: '2' },
      { label: 'Issues resolved', value: '1' },
    ],
    relatedLessons: [
      'Follow passion, not utility',
      'Open source needs community, not just code',
      'Simple solutions are often enough',
      'Go is great for network services',
    ],
  },
  {
    id: 'canvas',
    name: 'Canvas',
    slug: 'canvas',
    builder: {
      username: 'maya',
      displayName: 'Maya',
      avatar: 'M',
      bio: 'Frontend engineer who cares about developer experience.',
      otherProjects: ['Relay', 'Grid'],
    },
    description: 'A collaborative visual workspace for building ideas. Real-time whiteboarding for teams.',
    longDescription: `Canvas was supposed to be the indie alternative to Miro and FigJam. A collaborative whiteboarding tool that was fast, beautiful, and developer-friendly.

The WebGL rendering was smooth. The real-time sync worked. The collaboration features were solid.

But I was one person competing against venture-backed companies with hundreds of engineers.

The market was saturated. Every feature I built already existed somewhere else. Every improvement I made was already better somewhere else.

The lesson? Some markets are too crowded for indie builders. Find a blue ocean, or find a niche nobody else is serving.`,
    category: 'STARTUPS',
    technologies: ['React', 'TypeScript', 'WebGL', 'WebRTC', 'Node.js'],
    abandonedAt: 'February 2026',
    startedAt: 'November 2025',
    duration: '3 months',
    reason: 'Market saturated',
    reasonLabel: 'MARKET SATURATED',
    lesson: 'Competing with Miro and FigJam as a solo developer is not a strategy. Find a niche or find a new market.',
    wouldBuildAgain: false,
    whatChanged: 'Accepted that some markets are too crowded for indie builders. Now I look for blue oceans.',
    repository: 'https://github.com/maya/canvas',
    visualType: 'grid',
    tags: ['market', 'competition', 'indie', 'collaboration'],
    timeline: [
      { date: 'Nov 2025', event: 'Frustrated by Miro\'s performance issues' },
      { date: 'Nov 2025', event: 'Built WebGL rendering engine' },
      { date: 'Dec 2025', event: 'Implemented real-time sync with WebRTC' },
      { date: 'Jan 2026', event: 'Added collaboration features' },
      { date: 'Jan 2026', event: 'Launched beta. Got 12 users.' },
      { date: 'Feb 2026', event: 'Realized competing with Miro is impossible solo' },
    ],
    whatWentWrong: [
      'Competed directly with venture-backed companies',
      'No differentiation — every feature existed elsewhere',
      'Solo developer vs. hundreds of engineers',
      'No distribution strategy',
      'Built for a market, not a niche',
    ],
    whatWentRight: [
      'WebGL rendering was genuinely fast',
      'Real-time sync worked well',
      'Learned WebRTC patterns',
      'The technical execution was solid',
    ],
    technicalDecisions: [
      { decision: 'WebGL for rendering', outcome: 'Fast but complex', lesson: 'WebGL is powerful but has a steep learning curve' },
      { decision: 'WebRTC for sync', outcome: 'Worked well for small groups', lesson: 'WebRTC is great for P2P, not for broadcasting' },
      { decision: 'Compete with Miro', outcome: 'Impossible solo', lesson: 'Don\'t compete with well-funded companies head-on' },
    ],
    advice: 'Before building, ask: "Who will use this that isn\'t already using something else?" If you can\'t answer, find a different market.',
    metrics: [
      { label: 'Beta users', value: '12' },
      { label: 'Retention', value: '0%' },
      { label: 'Revenue', value: '$0' },
      { label: 'Time invested', value: '3 months' },
    ],
    relatedLessons: [
      'Find blue oceans, not red oceans',
      'Indie builders need niches, not markets',
      'Technical excellence doesn\'t guarantee success',
      'Distribution matters more than product',
    ],
  },
  {
    id: 'pulse',
    name: 'Pulse',
    slug: 'pulse',
    builder: {
      username: 'ravi',
      displayName: 'Ravi',
      avatar: 'R',
      bio: 'Backend engineer focused on reliability and observability.',
      otherProjects: ['Stack', 'Forge'],
    },
    description: 'Realtime monitoring for tiny services. Observability without the dashboard overload.',
    longDescription: `Pulse was born from frustration. Every monitoring tool I used was built for enterprises. Grafana dashboards with 50 panels. Datadog bills that cost more than my rent.

I wanted something simple. A tool that told you if your service was healthy, without requiring a PhD in dashboard configuration.

The Go backend was fast. The Prometheus integration was clean. The alerting system worked.

But making monitoring simple is actually really hard. The complexity isn't in the monitoring — it's in the abstraction.

By month three, I realized I was building a simplified version of exactly what already exists.

Technical complexity killed this project. Not because the code was complex, but because the problem was.`,
    category: 'EXPERIMENTS',
    technologies: ['Go', 'PostgreSQL', 'Prometheus', 'Grafana'],
    abandonedAt: 'January 2026',
    startedAt: 'October 2025',
    duration: '3 months',
    reason: 'Technical complexity',
    reasonLabel: 'TECHNICAL COMPLEXITY',
    lesson: 'Monitoring is easy. Making monitoring simple is hard. Understand the difference before you start.',
    wouldBuildAgain: true,
    whatChanged: 'Understood the difference between building and building well. Simplicity is the hardest feature.',
    repository: 'https://github.com/ravi/pulse',
    visualType: 'waveform',
    tags: ['monitoring', 'observability', 'go', 'devops'],
    timeline: [
      { date: 'Oct 2025', event: 'Frustrated by Grafana complexity' },
      { date: 'Oct 2025', event: 'Designed simplified monitoring architecture' },
      { date: 'Nov 2025', event: 'Built Go backend with Prometheus' },
      { date: 'Dec 2025', event: 'Created minimal dashboard UI' },
      { date: 'Dec 2025', event: 'Added alerting system' },
      { date: 'Jan 2026', event: 'Realized simplicity is harder than complexity' },
    ],
    whatWentWrong: [
      'Underestimated the complexity of "simple" abstractions',
      'Prometheus integration was harder than expected',
      'No clear value proposition vs. existing tools',
      'The "simple" dashboard was still complex for most users',
    ],
    whatWentRight: [
      'Go backend performed well under load',
      'Prometheus integration was solid',
      'The alerting system worked reliably',
      'Learned a lot about observability',
    ],
    technicalDecisions: [
      { decision: 'Go for backend', outcome: 'Good choice for performance', lesson: 'Go is great for monitoring tools' },
      { decision: 'Prometheus for metrics', outcome: 'Standard but complex', lesson: 'Prometheus is powerful but has a learning curve' },
      { decision: 'Custom dashboard', outcome: 'Still too complex', lesson: 'Simplicity requires more engineering than complexity' },
    ],
    advice: 'If you\'re building a "simple" version of something complex, ask yourself: "Is it actually simple, or am I just hiding the complexity?"',
    metrics: [
      { label: 'Services monitored', value: '3 (my own)' },
      { label: 'Dashboards created', value: '7' },
      { label: 'Alerts configured', value: '12' },
      { label: 'Times I used it', value: '4' },
    ],
    relatedLessons: [
      'Simplicity is the hardest feature',
      'Hiding complexity is not the same as removing it',
      'Know your enemy before you fight',
      'Observability is a deep rabbit hole',
    ],
  },
  {
    id: 'archive',
    name: 'Archive',
    slug: 'archive',
    builder: {
      username: 'keshav',
      displayName: 'Keshav',
      avatar: 'K',
      bio: 'Building backend systems and small products.',
      otherProjects: ['Letterly', 'Pentale'],
    },
    description: 'An experiment in building a personal digital archive. Save everything, find anything.',
    longDescription: `Archive was a personal project. I wanted to save everything I found interesting — articles, tweets, code snippets, ideas — and find it later.

The concept was simple. The execution was not.

Elasticsearch for search. React for the UI. Node.js for the API. Everything worked. Everything was fast.

But nobody else cared about saving things the way I did.

The lesson? Building for yourself is fine. But don't expect others to care about your peculiarities.`,
    category: 'EXPERIMENTS',
    technologies: ['React', 'Node.js', 'Elasticsearch', 'Docker'],
    abandonedAt: 'December 2025',
    startedAt: 'September 2025',
    duration: '3 months',
    reason: 'No users',
    reasonLabel: 'NO USERS',
    lesson: 'Building for yourself is fine. But don\'t expect others to care about your peculiarities.',
    wouldBuildAgain: true,
    whatChanged: 'Realized personal tools don\'t need to be products. Some things are better as scripts.',
    repository: 'https://github.com/keshav/archive',
    visualType: 'stack',
    tags: ['personal-tools', 'elasticsearch', 'bookmarking', 'indie'],
    timeline: [
      { date: 'Sep 2025', event: 'Wanted to save and find everything' },
      { date: 'Sep 2025', event: 'Set up Elasticsearch cluster' },
      { date: 'Oct 2025', event: 'Built React frontend with search' },
      { date: 'Nov 2025', event: 'Added browser extension for saving' },
      { date: 'Dec 2025', event: 'Used it myself. Nobody else did.' },
    ],
    whatWentWrong: [
      'Built for my own peculiar workflow',
      'Elasticsearch was overkill for the scale',
      'No distribution strategy',
      'The "find anything" promise was too ambitious',
    ],
    whatWentRight: [
      'Elasticsearch search was fast and accurate',
      'The browser extension worked well',
      'I actually used it for 2 months',
      'Learned Elasticsearch patterns',
    ],
    technicalDecisions: [
      { decision: 'Elasticsearch for search', outcome: 'Powerful but overkill', lesson: 'SQLite FTS is enough for personal tools' },
      { decision: 'Browser extension', outcome: 'Worked well but low adoption', lesson: 'Extensions need distribution' },
      { decision: 'Full-text search', outcome: 'Fast but complex to set up', lesson: 'Simple search is usually enough' },
    ],
    advice: 'Personal tools don\'t need to be products. A script that works is better than a platform that doesn\'t.',
    metrics: [
      { label: 'Items saved', value: '847 (all me)' },
      { label: 'Users', value: '1' },
      { label: 'Searches performed', value: '42' },
      { label: 'Elasticsearch cluster cost', value: '$20/month' },
    ],
    relatedLessons: [
      'Personal tools don\'t need to be products',
      'Overkill is the enemy of shipping',
      'Scripts can be better than platforms',
      'Your workflow is not everyone\'s workflow',
    ],
  },
  {
    id: 'terminal',
    name: 'Terminal',
    slug: 'terminal',
    builder: {
      username: 'alex',
      displayName: 'Alex',
      avatar: 'A',
      bio: 'Systems programmer building developer tools.',
      otherProjects: ['Orbit', 'Wave'],
    },
    description: 'A beautiful terminal emulator for people who care about aesthetics.',
    longDescription: `Terminal was a side project born from vanity. I wanted a terminal that looked beautiful. Not just functional — beautiful.

The Tauri shell was lightweight. The Rust backend was fast. The rendering was smooth.

But somewhere in month two, I asked myself: "Am I building something people need, or something I want?"

The answer was the latter. And that's fine. But not for a product.

Not every tool needs to be rebuilt. Sometimes existing tools are enough.`,
    category: 'APPS',
    technologies: ['Rust', 'Tauri', 'TypeScript', 'SQLite'],
    abandonedAt: 'March 2026',
    startedAt: 'January 2026',
    duration: '2 months',
    reason: 'Could not justify the time',
    reasonLabel: 'COULD NOT JUSTIFY THE TIME',
    lesson: 'Not every tool needs to be rebuilt. Sometimes existing tools are enough.',
    wouldBuildAgain: false,
    whatChanged: 'Learned to pick battles wisely. Not every itch needs scratching.',
    repository: 'https://github.com/alex/terminal',
    visualType: 'lines',
    tags: ['vanity', 'terminal', 'tauri', 'rust'],
    timeline: [
      { date: 'Jan 2026', event: 'Wanted a beautiful terminal' },
      { date: 'Jan 2026', event: 'Set up Tauri project with Rust backend' },
      { date: 'Feb 2026', event: 'Built rendering engine' },
      { date: 'Feb 2026', event: 'Added themes and customization' },
      { date: 'Mar 2026', event: 'Asked "why am I building this?"' },
    ],
    whatWentWrong: [
      'Built for vanity, not need',
      'Existing terminals (Alacritty, WezTerm) are already great',
      'No clear differentiation',
      'Time could have been spent on more impactful projects',
    ],
    whatWentRight: [
      'Tauri was lightweight and fast',
      'Rust backend performed well',
      'Learned Tauri patterns',
      'The rendering engine was genuinely smooth',
    ],
    technicalDecisions: [
      { decision: 'Tauri over Electron', outcome: 'Good choice for performance', lesson: 'Tauri is great for lightweight desktop apps' },
      { decision: 'Rust for backend', outcome: 'Fast but overkill', lesson: 'Not every terminal needs Rust' },
      { decision: 'Custom rendering', outcome: 'Smooth but unnecessary', lesson: 'GPU rendering is already good enough' },
    ],
    advice: 'Before rebuilding something that exists, ask: "What will I learn?" If the answer is "nothing," skip it.',
    metrics: [
      { label: 'Features implemented', value: '8' },
      { label: 'Features unique', value: '0' },
      { label: 'Time invested', value: '2 months' },
      { label: 'Lessons learned', value: 'Many' },
    ],
    relatedLessons: [
      'Not everything needs rebuilding',
      'Vanity projects have their place, but call them what they are',
      'Learning is a valid goal, but be honest about it',
      'Pick your battles',
    ],
  },
  {
    id: 'drift',
    name: 'Drift',
    slug: 'drift',
    builder: {
      username: 'noah',
      displayName: 'Noah',
      avatar: 'N',
      bio: 'Independent developer. One project at a time.',
      otherProjects: ['Atlas'],
    },
    description: 'A minimal note-taking tool for capturing ideas in motion.',
    longDescription: `Drift was supposed to be my answer to Apple Notes. A minimal note-taking app that was fast, beautiful, and synced across devices.

The Tauri shell was perfect. The SQLite storage was simple. The sync was elegant.

But life changed. Personal circumstances shifted priorities. The project wasn't abandoned because it was bad — it was abandoned because the timing was wrong.

Sometimes the timing is wrong. The idea might be right.`,
    category: 'APPS',
    technologies: ['TypeScript', 'SQLite', 'Tauri', 'CloudKit'],
    abandonedAt: 'April 2026',
    startedAt: 'March 2026',
    duration: '1 month',
    reason: 'Life changed',
    reasonLabel: 'LIFE CHANGED',
    lesson: 'Sometimes the timing is wrong. The idea might be right. Don\'t delete the code — archive it.',
    wouldBuildAgain: true,
    whatChanged: 'Personal circumstances shifted priorities. The code is archived, not deleted.',
    repository: 'https://github.com/noah/drift',
    visualType: 'dots',
    tags: ['timing', 'life', 'notes', 'tauri'],
    timeline: [
      { date: 'Mar 2026', event: 'Wanted a minimal note-taking app' },
      { date: 'Mar 2026', event: 'Set up Tauri with SQLite' },
      { date: 'Mar 2026', event: 'Built basic editing interface' },
      { date: 'Apr 2026', event: 'Personal circumstances changed' },
      { date: 'Apr 2026', event: 'Archived the project. Code is still there.' },
    ],
    whatWentWrong: [
      'Timing was wrong',
      'Personal circumstances shifted',
      'No fault of the project itself',
    ],
    whatWentRight: [
      'Tauri was the right choice',
      'SQLite was simple and fast',
      'The code is clean and could be revived',
      'Learned when to pause vs. when to quit',
    ],
    technicalDecisions: [
      { decision: 'Tauri for desktop', outcome: 'Perfect choice', lesson: 'Tauri is great for lightweight apps' },
      { decision: 'SQLite for storage', outcome: 'Simple and reliable', lesson: 'SQLite is perfect for local-first apps' },
      { decision: 'CloudKit for sync', outcome: 'Never got to implement', lesson: 'Start with local, add sync later' },
    ],
    advice: 'Not every abandoned project is a failure. Sometimes it\'s just not the right time. Archive it, don\'t delete it.',
    metrics: [
      { label: 'Features completed', value: '3' },
      { label: 'Features planned', value: '12' },
      { label: 'Code quality', value: 'High' },
      { label: 'Revival potential', value: 'High' },
    ],
    relatedLessons: [
      'Timing matters as much as quality',
      'Archive, don\'t delete',
      'Not every pause is a failure',
      'Sometimes life happens',
    ],
  },
  {
    id: 'stack',
    name: 'Stack',
    slug: 'stack',
    builder: {
      username: 'ravi',
      displayName: 'Ravi',
      avatar: 'R',
      bio: 'Backend engineer focused on reliability and observability.',
      otherProjects: ['Pulse', 'Forge'],
    },
    description: 'A tiny dependency analyzer for Node.js projects.',
    longDescription: `Stack was supposed to be a faster, simpler alternative to \`npm audit\`. A tool that analyzed your dependencies and told you what was actually important.

The Node.js implementation was quick. The analysis was accurate. The output was clean.

But developer tools need distribution. GitHub stars don't pay the bills. And the market for dependency analyzers is already crowded.

Open source needs a business model. Without one, it's just a hobby.`,
    category: 'OPEN SOURCE',
    technologies: ['Node.js', 'TypeScript', 'npm'],
    abandonedAt: 'January 2026',
    startedAt: 'December 2025',
    duration: '1 month',
    reason: 'Wrong market',
    reasonLabel: 'WRONG MARKET',
    lesson: 'Developer tools need distribution. GitHub stars don\'t pay the bills. Open source needs a business model.',
    wouldBuildAgain: false,
    whatChanged: 'Understood that open source needs a business model. Stars are vanity, users are sanity.',
    repository: 'https://github.com/ravi/stack',
    visualType: 'stack',
    tags: ['open-source', 'developer-tools', 'npm', 'business-model'],
    timeline: [
      { date: 'Dec 2025', event: 'Frustrated by npm audit output' },
      { date: 'Dec 2025', event: 'Built dependency analyzer in Node.js' },
      { date: 'Dec 2025', event: 'Published to GitHub and npm' },
      { date: 'Jan 2026', event: 'Got 23 stars. 0 active users.' },
      { date: 'Jan 2026', event: 'Realized open source needs distribution' },
    ],
    whatWentWrong: [
      'No distribution strategy',
      'Crowded market with established players',
      'No business model',
      'GitHub stars ≠ users',
      'Built for GitHub, not for people',
    ],
    whatWentRight: [
      'The tool worked correctly',
      'npm package was well-structured',
      'Learned npm publishing',
      'Got some GitHub stars (vanity metric)',
    ],
    technicalDecisions: [
      { decision: 'Node.js for implementation', outcome: 'Quick to build', lesson: 'Node.js is great for CLI tools' },
      { decision: 'npm for distribution', outcome: 'Low adoption', lesson: 'npm discovery is hard' },
      { decision: 'No business model', outcome: 'Unsustainable', lesson: 'Open source needs funding' },
    ],
    advice: 'If you\'re building open source, think about distribution before you think about code. Who will use this? How will they find it?',
    metrics: [
      { label: 'npm installs', value: '47' },
      { label: 'GitHub stars', value: '23' },
      { label: 'Active users', value: '0' },
      { label: 'Revenue', value: '$0' },
    ],
    relatedLessons: [
      'Open source needs distribution',
      'Stars are vanity, users are sanity',
      'Business models matter',
      'npm discovery is a real problem',
    ],
  },
  {
    id: 'grid',
    name: 'Grid',
    slug: 'grid',
    builder: {
      username: 'maya',
      displayName: 'Maya',
      avatar: 'M',
      bio: 'Frontend engineer who cares about developer experience.',
      otherProjects: ['Relay', 'Canvas'],
    },
    description: 'A visual database inspector that actually makes sense.',
    longDescription: `Grid was a tool for developers who wanted to see their database data visually. Not a dashboard — a visual inspector.

The React frontend was clean. The PostgreSQL integration was solid. The visualization was intuitive.

But the problem was real. My motivation was not.

By month two, I realized I was building something I didn't care about. The problem was interesting for about a week. Then it wasn't.

Passion matters. Even for tools.`,
    category: 'TOOLS',
    technologies: ['React', 'TypeScript', 'PostgreSQL', 'D3.js'],
    abandonedAt: 'February 2026',
    startedAt: 'January 2026',
    duration: '1 month',
    reason: 'Lost interest',
    reasonLabel: 'LOST INTEREST',
    lesson: 'The problem was real. My motivation was not. Passion matters, even for tools.',
    wouldBuildAgain: false,
    whatChanged: 'Found a more interesting problem to solve. Learned to follow curiosity.',
    repository: 'https://github.com/maya/grid',
    visualType: 'grid',
    tags: ['database', 'developer-tools', 'passion', 'motivation'],
    timeline: [
      { date: 'Jan 2026', event: 'Wanted better database visualization' },
      { date: 'Jan 2026', event: 'Built React frontend with D3.js' },
      { date: 'Jan 2026', event: 'Integrated PostgreSQL queries' },
      { date: 'Feb 2026', event: 'Lost interest. The problem wasn\'t exciting.' },
    ],
    whatWentWrong: [
      'No sustained passion',
      'The problem was interesting for a week, not a month',
      'Built for a need, not for curiosity',
    ],
    whatWentRight: [
      'React frontend was clean',
      'PostgreSQL integration worked',
      'D3.js visualization was intuitive',
      'Learned when to quit',
    ],
    technicalDecisions: [
      { decision: 'React for frontend', outcome: 'Good choice', lesson: 'React is reliable for data-heavy UIs' },
      { decision: 'D3.js for visualization', outcome: 'Powerful but complex', lesson: 'D3.js has a steep learning curve' },
      { decision: 'PostgreSQL direct queries', outcome: 'Fast but risky', lesson: 'Use an ORM for safety' },
    ],
    advice: 'If you\'re not excited about the problem after a week, you won\'t be excited after a month. Move on.',
    metrics: [
      { label: 'Tables supported', value: '12' },
      { label: 'Queries visualized', value: '8' },
      { label: 'Excitement duration', value: '1 week' },
    ],
    relatedLessons: [
      'Passion matters for tools too',
      'One week of excitement ≠ a project',
      'Follow curiosity, not just need',
      'Learn when to quit',
    ],
  },
  {
    id: 'wave',
    name: 'Wave',
    slug: 'wave',
    builder: {
      username: 'alex',
      displayName: 'Alex',
      avatar: 'A',
      bio: 'Systems programmer building developer tools.',
      otherProjects: ['Orbit', 'Terminal'],
    },
    description: 'Realtime collaboration without the complexity.',
    longDescription: `Wave was supposed to be the simple alternative to Socket.io. A realtime collaboration library that just worked.

The Go backend was fast. The WebSocket handling was clean. The API was simple.

But cool technology is not a business. I had no customers. No use cases. No distribution.

I built a solution to a problem nobody had.

Product-market fit comes before engineering. Always.`,
    category: 'STARTUPS',
    technologies: ['Go', 'Redis', 'WebSocket', 'Protocol Buffers'],
    abandonedAt: 'March 2026',
    startedAt: 'February 2026',
    duration: '1 month',
    reason: 'Business model did not work',
    reasonLabel: 'BUSINESS MODEL DID NOT WORK',
    lesson: 'Cool technology is not a business. Find the customer first, then build the product.',
    wouldBuildAgain: false,
    whatChanged: 'Learned that product-market fit comes before engineering. Customer first, always.',
    repository: 'https://github.com/alex/wave',
    visualType: 'waveform',
    tags: ['business-model', 'realtime', 'websocket', 'product-market-fit'],
    timeline: [
      { date: 'Feb 2026', event: 'Wanted simpler realtime collaboration' },
      { date: 'Feb 2026', event: 'Built Go backend with WebSocket' },
      { date: 'Feb 2026', event: 'Created simple API' },
      { date: 'Mar 2026', event: 'Realized I had no customers' },
      { date: 'Mar 2026', event: 'Archived the project' },
    ],
    whatWentWrong: [
      'No customers before building',
      'No use cases defined',
      'No distribution strategy',
      'Technology-first, not customer-first',
      'No business model',
    ],
    whatWentRight: [
      'Go backend was fast and clean',
      'WebSocket handling was solid',
      'The API was genuinely simple',
      'Learned the importance of validation',
    ],
    technicalDecisions: [
      { decision: 'Go for backend', outcome: 'Fast and reliable', lesson: 'Go is great for network services' },
      { decision: 'WebSocket for realtime', outcome: 'Worked well', lesson: 'WebSocket is solid for realtime' },
      { decision: 'Build first, find customers later', outcome: 'No customers found', lesson: 'Always validate first' },
    ],
    advice: 'Before building, answer: "Who will pay for this?" If you can\'t answer, you don\'t have a business.',
    metrics: [
      { label: 'Customers', value: '0' },
      { label: 'Revenue', value: '$0' },
      { label: 'API calls', value: '0' },
      { label: 'Lessons learned', value: 'Priceless' },
    ],
    relatedLessons: [
      'Customers before code',
      'Product-market fit is not optional',
      'Technology is not a business',
      'Validate before you build',
    ],
  },
  {
    id: 'forge',
    name: 'Forge',
    slug: 'forge',
    builder: {
      username: 'ravi',
      displayName: 'Ravi',
      avatar: 'R',
      bio: 'Backend engineer focused on reliability and observability.',
      otherProjects: ['Pulse', 'Stack'],
    },
    description: 'A CLI tool for generating project scaffolds that actually work.',
    longDescription: `Forge was my attempt at building a better \`create-react-app\`. A CLI tool that generated project scaffolds with best practices baked in.

The Rust implementation was fast. The templates were clean. The output was correct.

But the world doesn't need another scaffolding tool. There are dozens. Most of them are fine.

I spent two months solving a problem that was already solved.

Some problems are already solved. Accept it and move on.`,
    category: 'TOOLS',
    technologies: ['Rust', 'Node.js', 'Template Literals'],
    abandonedAt: 'April 2026',
    startedAt: 'March 2026',
    duration: '1 month',
    reason: 'Too many alternatives',
    reasonLabel: 'TOO MANY ALTERNATIVES',
    lesson: 'The world does not need another scaffolding tool. Some problems are already solved.',
    wouldBuildAgain: false,
    whatChanged: 'Accepted that some problems are already solved. Focus on unsolved problems.',
    repository: 'https://github.com/ravi/forge',
    visualType: 'lines',
    tags: ['cli', 'scaffolding', 'rust', 'solved-problems'],
    timeline: [
      { date: 'Mar 2026', event: 'Wanted better project scaffolding' },
      { date: 'Mar 2026', event: 'Built Rust CLI tool' },
      { date: 'Mar 2026', event: 'Created template system' },
      { date: 'Apr 2026', event: 'Realized there are dozens of alternatives' },
    ],
    whatWentWrong: [
      'Solved an already-solved problem',
      'No differentiation from existing tools',
      'Two months wasted on a solved problem',
      'Didn\'t research existing solutions first',
    ],
    whatWentRight: [
      'Rust CLI was fast',
      'Templates were clean',
      'The tool worked correctly',
      'Learned to research before building',
    ],
    technicalDecisions: [
      { decision: 'Rust for CLI', outcome: 'Fast but overkill', lesson: 'Node.js is fine for CLI tools' },
      { decision: 'Custom template system', outcome: 'Worked but unnecessary', lesson: 'Use existing template engines' },
      { decision: 'No market research', outcome: 'Built a worse version of existing tools', lesson: 'Always research first' },
    ],
    advice: 'Before building, Google it. If there are 10 alternatives, you probably don\'t need an 11th.',
    metrics: [
      { label: 'Alternatives existing', value: '50+' },
      { label: 'Differentiation', value: 'None' },
      { label: 'Users', value: '0' },
      { label: 'Time wasted', value: '1 month' },
    ],
    relatedLessons: [
      'Research before you build',
      'Some problems are already solved',
      'Differentiation is not optional',
      'Don\'t build a worse version of something that exists',
    ],
  },
]

export const graveyardStats = {
  projectsArchived: 128,
  builders: 47,
  lessonsShared: 312,
  categories: 18,
}

export const graveyardFilters = [
  { value: 'ALL', label: 'All' },
  { value: 'STARTUPS', label: 'Startups' },
  { value: 'SIDE PROJECTS', label: 'Side Projects' },
  { value: 'EXPERIMENTS', label: 'Experiments' },
  { value: 'OPEN SOURCE', label: 'Open Source' },
  { value: 'APPS', label: 'Apps' },
  { value: 'TOOLS', label: 'Tools' },
]

export const graveyardSorts = [
  { value: 'recent', label: 'Recently Abandoned' },
  { value: 'discussed', label: 'Most Discussed' },
  { value: 'learned', label: 'Most Learned From' },
  { value: 'oldest', label: 'Oldest' },
]

export const graveyardLessons = [
  {
    number: '01',
    title: 'BUILD LESS BEFORE YOU KNOW MORE.',
    body: 'Most abandoned projects were not technical failures. They were validation failures.',
  },
  {
    number: '02',
    title: 'COMPLEXITY IS NOT PROGRESS.',
    body: 'A beautiful architecture can still solve the wrong problem.',
  },
  {
    number: '03',
    title: 'QUITTING CAN BE A DECISION.',
    body: 'Stopping a project can sometimes be the clearest form of learning.',
  },
]

export const featuredStory = {
  title: 'WHY I STOPPED BUILDING LETTERLY',
  builder: { username: 'keshav', displayName: 'Keshav', avatar: 'K' },
  excerpt: `I thought the hardest part would be building the infrastructure.

It was not.

The hardest part was figuring out whether people actually wanted the experience.

I spent four months building a beautiful async communication platform. The code was clean. The architecture was solid. The database design was elegant.

Nobody used it.

Not because it was bad. Because I never asked anyone if they wanted it.

The lesson? Build the landing page first. Get signups. Then build the product.`,
  readTime: '4 min read',
}
