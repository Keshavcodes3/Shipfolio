import type { CommunityPost } from '../types/community'

export const communityPosts: CommunityPost[] = [
  {
    id: 'post-1',
    type: 'ASK_FOR_REVIEW',
    author: { username: 'keshav', displayName: 'Keshav', avatar: 'K' },
    title: 'Does the new letter composer feel intuitive?',
    content: `I just redesigned the first-time letter writing flow for Letterly. The old version had a subject line, body, and scheduling options all visible at once. I simplified it to a single text area with a delivery date picker.

The goal: someone sends their first letter within 30 seconds of opening the app.

I tested it with 5 people and 3 of them got stuck on the "Who are you writing to?" step. If the recipient is already determined by context (they signed up from a shared link), should I skip that step?

What do you think?`,
    project: {
      id: 'letterly',
      name: 'Letterly',
      description: 'Async communication between strangers.',
      technologies: ['TypeScript', 'PostgreSQL', 'Redis'],
    },
    category: 'Looking for Feedback',
    tags: ['ux', 'onboarding', 'async'],
    comments: [
      {
        id: 'c1',
        author: { username: 'maya', displayName: 'Maya' },
        content: 'The single text area is a good call. One thing: the delivery date picker feels disconnected from the composer. Maybe position it directly below the text area with a label like "Deliver in 3 days" so the relationship is obvious.',
        createdAt: '1h ago',
        helpfulCount: 4,
      },
      {
        id: 'c2',
        author: { username: 'alex', displayName: 'Alex' },
        content: 'I was not immediately sure what would happen after pressing Send Letter. Would a tooltip or a subtle confirmation animation help? Something like "Letter scheduled for Thursday" would close the mental loop.',
        createdAt: '2h ago',
        helpfulCount: 2,
      },
      {
        id: 'c3',
        author: { username: 'ravi', displayName: 'Ravi' },
        content: 'The 30-second goal is ambitious. I tested it and got stuck on the "Who are you writing to?" step. If the recipient is already determined by context, skip that step entirely.',
        createdAt: '3h ago',
        helpfulCount: 6,
      },
    ],
    upvoteCount: 12,
    createdAt: '2h ago',
  },
  {
    id: 'post-2',
    type: 'SHIP',
    author: { username: 'alex', displayName: 'Alex', avatar: 'A' },
    title: 'Orbit v1.0 is now live',
    content: `After 3 months of building, Orbit is finally live.

Orbit is a visual workspace for exploring ideas. Instead of folders and tags, ideas orbit around each other based on relevance.

Key features:
- Orbital visualization for idea clustering
- Real-time sync across devices
- Markdown support with live preview
- Keyboard-first navigation

Built with React, TypeScript, and a custom WebGL renderer.

Try it out and let me know what you think.`,
    project: {
      id: 'orbit',
      name: 'Orbit',
      description: 'A visual workspace for exploring ideas.',
      technologies: ['React', 'TypeScript', 'WebGL'],
    },
    category: 'Show & Tell',
    tags: ['launch', 'react', 'webgl'],
    comments: [
      {
        id: 'c4',
        author: { username: 'maya', displayName: 'Maya' },
        content: 'The orbital visualization is beautiful. How did you handle performance with lots of nodes? I imagine WebGL helps a lot there.',
        createdAt: '3h ago',
        helpfulCount: 3,
      },
      {
        id: 'c5',
        author: { username: 'noah', displayName: 'Noah' },
        content: 'This is exactly what I was looking for. The keyboard navigation is a game changer. Any plans for an API?',
        createdAt: '5h ago',
        helpfulCount: 1,
      },
    ],
    upvoteCount: 24,
    createdAt: '4h ago',
    isPinned: true,
  },
  {
    id: 'post-3',
    type: 'DISCUSSION',
    author: { username: 'maya', displayName: 'Maya', avatar: 'M' },
    title: 'How do you handle scope creep on side projects?',
    content: `I just killed Canvas after 3 months. The code was good, the architecture was solid, but I kept expanding scope. First it was notes, then collaboration, then real-time sync, then offline support, then plugins.

By month two, I was building infrastructure for features I hadn't even validated.

How do you all handle this? Do you define strict MVPs before building? Or do you let scope evolve naturally?

I'm genuinely curious because this has killed 3 of my projects now.`,
    category: 'Discussion',
    tags: ['scope-creep', 'productivity', 'side-projects'],
    comments: [
      {
        id: 'c6',
        author: { username: 'keshav', displayName: 'Keshav' },
        content: 'I have the exact same problem. What worked for me: write down the ONE thing your product does in one sentence. If a feature doesn\'t directly serve that sentence, it doesn\'t go in the MVP.',
        createdAt: '6h ago',
        helpfulCount: 8,
      },
      {
        id: 'c7',
        author: { username: 'alex', displayName: 'Alex' },
        content: 'Time-boxing helps me. I give myself 2 weeks to build the core feature. If it\'s not done, I cut scope instead of extending time.',
        createdAt: '8h ago',
        helpfulCount: 5,
      },
      {
        id: 'c8',
        author: { username: 'ravi', displayName: 'Ravi' },
        content: 'The best advice I ever got: "Your MVP should embarrass you." If you\'re not slightly embarrassed by how simple it is, you\'ve over-built.',
        createdAt: '1d ago',
        helpfulCount: 12,
      },
    ],
    upvoteCount: 31,
    createdAt: '1d ago',
  },
  {
    id: 'post-4',
    type: 'PROJECT_UPDATE',
    author: { username: 'ravi', displayName: 'Ravi', avatar: 'R' },
    title: 'Pulse now supports custom dashboards',
    content: `Quick update on Pulse: I just added custom dashboard support.

You can now:
- Create custom dashboards with drag-and-drop
- Add any metric as a widget
- Share dashboards with your team
- Export dashboard configs as JSON

The goal was to make monitoring flexible without being overwhelming. Let me know if the UI feels intuitive.`,
    project: {
      id: 'pulse',
      name: 'Pulse',
      description: 'Observability without the dashboard overload.',
      technologies: ['Go', 'React', 'ClickHouse'],
    },
    category: 'Built Something Cool',
    tags: ['monitoring', 'dashboards', 'update'],
    comments: [
      {
        id: 'c9',
        author: { username: 'sam', displayName: 'Sam' },
        content: 'The drag-and-drop is smooth. One suggestion: allow saving dashboard templates so teams can start from a shared base.',
        createdAt: '12h ago',
        helpfulCount: 3,
      },
    ],
    upvoteCount: 15,
    createdAt: '12h ago',
  },
  {
    id: 'post-5',
    type: 'ASK_FOR_REVIEW',
    author: { username: 'noah', displayName: 'Noah', avatar: 'N' },
    title: 'Is this landing page copy clear enough?',
    content: `I'm rewriting the Atlas landing page. The current copy is:

"Atlas is a geographic data visualization toolkit. Build interactive maps, analyze spatial data, and create beautiful geographic visualizations."

I think it's too dry. I want something that makes people feel the power of the tool, not just understand what it does.

New draft:

"Turn raw location data into stories. Atlas makes it easy to build interactive maps that reveal patterns, connections, and insights hiding in your geographic data."

Which version communicates the value better? Or should I take a completely different approach?`,
    project: {
      id: 'atlas',
      name: 'Atlas',
      description: 'A geographic data visualization toolkit.',
      technologies: ['Rust', 'WebAssembly', 'TypeScript'],
    },
    category: 'Looking for Feedback',
    tags: ['copywriting', 'landing-page', 'branding'],
    comments: [
      {
        id: 'c10',
        author: { username: 'keshav', displayName: 'Keshav' },
        content: 'The new version is much better. "Turn raw location data into stories" is compelling. But I\'d cut "that reveal patterns, connections, and insights hiding in your geographic data" — it\'s redundant.',
        createdAt: '1d ago',
        helpfulCount: 4,
      },
      {
        id: 'c11',
        author: { username: 'maya', displayName: 'Maya' },
        content: 'I like the direction. Consider: "Build maps that tell stories." Short, memorable, and captures the essence.',
        createdAt: '1d ago',
        helpfulCount: 7,
      },
    ],
    upvoteCount: 18,
    createdAt: '1d ago',
  },
  {
    id: 'post-6',
    type: 'DISCUSSION',
    author: { username: 'sam', displayName: 'Sam', avatar: 'S' },
    title: 'What\'s your tech stack for new projects in 2026?',
    content: `Curious what everyone is reaching for these days.

For me:
- Frontend: React + TypeScript (still)
- Backend: Go or Rust depending on the use case
- Database: PostgreSQL always
- Hosting: Railway or Fly.io
- Auth: Clerk or custom

I\'m starting a new project and wondering if I should try something different. What are you all using?

Specifically interested in:
1. Are you still using React or have you moved to something else?
2. What\'s your go-to backend language?
3. Do you use ORMs or write raw SQL?`,
    category: 'Discussion',
    tags: ['tech-stack', 'architecture', 'tools'],
    comments: [
      {
        id: 'c12',
        author: { username: 'alex', displayName: 'Alex' },
        content: 'React + TypeScript frontend, Go backend, PostgreSQL, raw SQL (no ORM). I\'ve tried switching to Svelte but keep coming back to React for the ecosystem.',
        createdAt: '2d ago',
        helpfulCount: 2,
      },
      {
        id: 'c13',
        author: { username: 'ravi', displayName: 'Ravi' },
        content: 'I\'ve been using Bun + Hono for new projects. The DX is incredible and performance is solid. PostgreSQL with Drizzle ORM.',
        createdAt: '2d ago',
        helpfulCount: 3,
      },
      {
        id: 'c14',
        author: { username: 'maya', displayName: 'Maya' },
        content: 'SvelteKit for frontend, Rust for anything performance-critical, TypeScript for everything else. Postgres with Prisma.',
        createdAt: '3d ago',
        helpfulCount: 1,
      },
    ],
    upvoteCount: 22,
    createdAt: '2d ago',
  },
  {
    id: 'post-7',
    type: 'PROJECT_UPDATE',
    author: { username: 'maya', displayName: 'Maya', avatar: 'M' },
    title: 'Canvas redesign: simplified onboarding',
    content: `I just shipped a simplified onboarding flow for Canvas.

Old flow: 4 steps (Name → Template → Invite → Build)
New flow: 2 steps (Name → Build)

I removed the template selection and collaborator invite from onboarding. Templates are now available after the first board is created. Invites are in the board settings.

The goal: get users to their first "aha moment" faster.

Test results: 80% of new users created their first board within 2 minutes (up from 45%).`,
    project: {
      id: 'canvas',
      name: 'Canvas',
      description: 'A lightweight space for turning rough ideas into structured notes.',
      technologies: ['React', 'TypeScript', 'WebGL'],
    },
    category: 'Built Something Cool',
    tags: ['onboarding', 'ux', 'metrics'],
    comments: [
      {
        id: 'c15',
        author: { username: 'keshav', displayName: 'Keshav' },
        content: 'The metrics are impressive. Removing the template step was smart — it reduces decision fatigue. How did you decide which templates to make default?',
        createdAt: '3d ago',
        helpfulCount: 2,
      },
    ],
    upvoteCount: 19,
    createdAt: '3d ago',
  },
  {
    id: 'post-8',
    type: 'ASK_FOR_REVIEW',
    author: { username: 'alex', displayName: 'Alex', avatar: 'A' },
    title: 'Should Orbit have a mobile app?',
    content: `Orbit has been desktop-only since launch. I've been getting requests for a mobile version, but I'm not sure it makes sense.

The core experience is:
- Visual exploration of idea clusters
- Quick capture of new thoughts
- Keyboard-first navigation

Mobile would mean:
- Touch-based navigation (different UX)
- Simplified capture (no keyboard shortcuts)
- Read-only exploration (limited screen real estate)

Is it worth building a mobile app, or should I focus on making the desktop experience better?

What would you use on mobile vs desktop?`,
    category: 'Looking for Feedback',
    tags: ['mobile', 'product-decision', 'ux'],
    comments: [
      {
        id: 'c16',
        author: { username: 'noah', displayName: 'Noah' },
        content: 'I\'d use mobile for quick capture (brain dumps on the go) but desktop for actual exploration. Maybe a mobile app that\'s just a capture tool, with a sync to desktop?',
        createdAt: '3d ago',
        helpfulCount: 5,
      },
      {
        id: 'c17',
        author: { username: 'ravi', displayName: 'Ravi' },
        content: 'Don\'t build a mobile app. Build a Progressive Web App instead. You get the best of both worlds: installable, works offline, but you don\'t need to deal with app stores.',
        createdAt: '4d ago',
        helpfulCount: 8,
      },
    ],
    upvoteCount: 16,
    createdAt: '3d ago',
  },
]

export const communityStats = {
  postsToday: 12,
  activeBuilders: 847,
  feedbackGiven: 2341,
}
