export type FeedbackCategory =
  | 'UX / Usability'
  | 'Design'
  | 'Product'
  | 'Technical'
  | 'Performance'
  | 'Accessibility'
  | 'Other'

export type FeedbackStatus = 'OPEN' | 'CLOSED'

export interface FeedbackRequest {
  id: string
  projectId: string
  projectName: string
  builder: {
    username: string
    displayName: string
  }
  title: string
  description: string
  context?: string
  category: FeedbackCategory
  status: FeedbackStatus
  createdAt: string
  responses: number
}

export interface FeedbackResponse {
  id: string
  requestId: string
  author: {
    username: string
    displayName: string
  }
  category: FeedbackCategory
  content: string
  helpfulCount: number
  createdAt: string
}

export const feedbackCategories: FeedbackCategory[] = [
  'UX / Usability',
  'Design',
  'Product',
  'Technical',
  'Performance',
  'Accessibility',
  'Other',
]

export const feedbackRequests: FeedbackRequest[] = [
  {
    id: 'fb-1',
    projectId: 'letterly',
    projectName: 'Letterly',
    builder: { username: 'keshav', displayName: 'Keshav' },
    title: 'Does the new letter composer feel intuitive?',
    description:
      "I'm redesigning the first-time letter writing flow and want to know where people might get confused. The goal is for someone to send their first letter within 30 seconds of opening the app.",
    context: 'The composer used to have a subject line, body, and scheduling options all visible at once. I simplified it to a single text area with a delivery date picker.',
    category: 'UX / Usability',
    status: 'OPEN',
    createdAt: '2h ago',
    responses: 8,
  },
  {
    id: 'fb-2',
    projectId: 'orbit',
    projectName: 'Orbit',
    builder: { username: 'alex', displayName: 'Alex' },
    title: 'What feels confusing about the editor layout?',
    description:
      "I'm testing a new editor layout with a sidebar for note clusters. It feels clean to me, but I've been staring at it for weeks. Fresh eyes would help.",
    context: 'The sidebar shows related notes as orbital nodes. Clicking one zooms into it. The main area is the editor.',
    category: 'Design',
    status: 'OPEN',
    createdAt: '5h ago',
    responses: 5,
  },
  {
    id: 'fb-3',
    projectId: 'canvas',
    projectName: 'Canvas',
    builder: { username: 'maya', displayName: 'Maya' },
    title: 'Is the onboarding flow clear enough for first-time users?',
    description:
      "I redesigned the onboarding to walk users through creating their first board. I'm worried step 3 (inviting collaborators) might feel premature.",
    context: 'The onboarding has 4 steps: Name your board → Choose a template → Invite collaborators → Start building.',
    category: 'UX / Usability',
    status: 'OPEN',
    createdAt: '1d ago',
    responses: 12,
  },
  {
    id: 'fb-4',
    projectId: 'relay',
    projectName: 'Relay',
    builder: { username: 'sam', displayName: 'Sam' },
    title: 'Does the API documentation make sense?',
    description:
      "I rewrote the getting-started guide for Relay. The goal is for a developer to send their first event within 5 minutes. Does the flow make sense?",
    context: 'The docs cover: Install → Configure transport → Define schema → Send first event → Listen for events.',
    category: 'Technical',
    status: 'OPEN',
    createdAt: '2d ago',
    responses: 3,
  },
  {
    id: 'fb-5',
    projectId: 'pulse',
    projectName: 'Pulse',
    builder: { username: 'ravi', displayName: 'Ravi' },
    title: 'Is the dashboard overload problem actually solved?',
    description:
      "I'm building a monitoring tool that shows only what matters. The core question: does the simplified view actually help, or does it just hide important information?",
    context: 'The dashboard shows: service health (green/yellow/red), error rate trend, latency p95, and active alerts. That is it.',
    category: 'Product',
    status: 'CLOSED',
    createdAt: '1w ago',
    responses: 15,
  },
]

export const feedbackResponses: FeedbackResponse[] = [
  // Responses for fb-1 (Letterly composer)
  {
    id: 'resp-1',
    requestId: 'fb-1',
    author: { username: 'maya', displayName: 'Maya' },
    category: 'UX / Usability',
    content:
      'The composer looks clean, but I was not immediately sure what would happen after pressing Send Letter. Would a tooltip or a subtle confirmation animation help? Something like "Letter scheduled for Thursday" would close the mental loop.',
    helpfulCount: 4,
    createdAt: '1h ago',
  },
  {
    id: 'resp-2',
    requestId: 'fb-1',
    author: { username: 'alex', displayName: 'Alex' },
    category: 'Design',
    content:
      'The single text area is a good call. One thing: the delivery date picker feels disconnected from the composer. Maybe position it directly below the text area with a label like "Deliver in 3 days" so the relationship is obvious.',
    helpfulCount: 2,
    createdAt: '2h ago',
  },
  {
    id: 'resp-3',
    requestId: 'fb-1',
    author: { username: 'ravi', displayName: 'Ravi' },
    category: 'Product',
    content:
      'The 30-second goal is ambitious. I tested it and got stuck on the "Who are you writing to?" step. If the recipient is already determined by context (e.g., they signed up from a shared link), skip that step entirely.',
    helpfulCount: 6,
    createdAt: '3h ago',
  },
  {
    id: 'resp-4',
    requestId: 'fb-1',
    author: { username: 'noah', displayName: 'Noah' },
    category: 'UX / Usability',
    content:
      'The placeholder text in the composer says "Write something meaningful." That feels like pressure for a first-time user. Try "Start writing" or "What is on your mind?" — lower the bar.',
    helpfulCount: 3,
    createdAt: '4h ago',
  },
  {
    id: 'resp-5',
    requestId: 'fb-1',
    author: { username: 'sam', displayName: 'Sam' },
    category: 'Technical',
    content:
      'On mobile, the date picker overlaps with the keyboard when it opens. You might need to scroll the composer up or use a bottom sheet for the date picker on smaller screens.',
    helpfulCount: 5,
    createdAt: '5h ago',
  },
  // Responses for fb-2 (Orbit editor)
  {
    id: 'resp-6',
    requestId: 'fb-2',
    author: { username: 'keshav', displayName: 'Keshav' },
    category: 'Design',
    content:
      'The orbital sidebar is visually interesting but I had to discover that clicking a node zooms into it. A subtle hint on first load (like a pulsing node or a "Click to explore" label) would reduce the learning curve.',
    helpfulCount: 3,
    createdAt: '4h ago',
  },
  {
    id: 'resp-7',
    requestId: 'fb-2',
    author: { username: 'maya', displayName: 'Maya' },
    category: 'UX / Usability',
    content:
      'The editor itself is great. My confusion was with the relationship between the sidebar and the main editor. When I type in the editor, does it affect the node? A brief explanation of the data model would help.',
    helpfulCount: 2,
    createdAt: '6h ago',
  },
  {
    id: 'resp-8',
    requestId: 'fb-2',
    author: { username: 'ravi', displayName: 'Ravi' },
    category: 'Product',
    content:
      'The orbital metaphor works for exploration but feels forced for editing. Consider keeping the orbital view as a navigation mode and switching to a standard editor when the user is writing.',
    helpfulCount: 4,
    createdAt: '8h ago',
  },
  // Responses for fb-3 (Canvas onboarding)
  {
    id: 'resp-9',
    requestId: 'fb-3',
    author: { username: 'alex', displayName: 'Alex' },
    category: 'UX / Usability',
    content:
      'Step 3 (invite collaborators) is definitely premature. I do not even know what the board looks like yet. Move it to after the first board is created. Let me fall in love with the tool before I share it.',
    helpfulCount: 8,
    createdAt: '20h ago',
  },
  {
    id: 'resp-10',
    requestId: 'fb-3',
    author: { username: 'keshav', displayName: 'Keshav' },
    category: 'Product',
    content:
      'The template selection is overwhelming. 12 templates on step 2 is too many choices. Show 3 curated defaults and hide the rest behind "Show more templates." Reduce decision fatigue.',
    helpfulCount: 5,
    createdAt: '22h ago',
  },
  {
    id: 'resp-11',
    requestId: 'fb-3',
    author: { username: 'ravi', displayName: 'Ravi' },
    category: 'Design',
    content:
      'The progress indicator at the top is helpful but the steps feel uneven. Step 1 (name) takes 2 seconds. Step 2 (template) takes 30 seconds. Step 3 (invite) takes 0 seconds because I skip it. Consider making the steps feel more balanced.',
    helpfulCount: 3,
    createdAt: '1d ago',
  },
  // Responses for fb-4 (Relay docs)
  {
    id: 'resp-12',
    requestId: 'fb-4',
    author: { username: 'maya', displayName: 'Maya' },
    category: 'Technical',
    content:
      'The flow makes sense but the "Define schema" step is where I got lost. A concrete example with actual code (not pseudocode) would help. Show me a working example I can copy-paste and modify.',
    helpfulCount: 2,
    createdAt: '1d ago',
  },
  {
    id: 'resp-13',
    requestId: 'fb-4',
    author: { username: 'alex', displayName: 'Alex' },
    category: 'Technical',
    content:
      'The "Send first event" step assumes I have a running server. Could you provide a Docker command or a local setup script so I can test without configuring anything?',
    helpfulCount: 1,
    createdAt: '2d ago',
  },
  // Responses for fb-5 (Pulse dashboard)
  {
    id: 'resp-14',
    requestId: 'fb-5',
    author: { username: 'maya', displayName: 'Maya' },
    category: 'Product',
    content:
      'The simplified view helps for quick checks. But when something goes wrong, I need more context. Consider a "drill-down" mode that reveals detailed metrics on demand without cluttering the default view.',
    helpfulCount: 7,
    createdAt: '5d ago',
  },
  {
    id: 'resp-15',
    requestId: 'fb-5',
    author: { username: 'alex', displayName: 'Alex' },
    category: 'UX / Usability',
    content:
      'The red/yellow/green status is instantly readable. My only concern: what happens when a service flaps between states? A "last 5 minutes" smoothing would prevent alert fatigue.',
    helpfulCount: 4,
    createdAt: '6d ago',
  },
  {
    id: 'resp-16',
    requestId: 'fb-5',
    author: { username: 'keshav', displayName: 'Keshav' },
    category: 'Technical',
    content:
      'The latency p95 metric is useful but I would also want p99. For user-facing services, the tail latency matters more than the average. Add p99 as an optional metric.',
    helpfulCount: 3,
    createdAt: '1w ago',
  },
]

export const feedbackLessons = [
  {
    title: 'Good feedback is specific.',
    body: '"This is confusing" is not feedback. "I did not know what happens after I click Send" is feedback.',
  },
  {
    title: 'Ask for observation, not opinion.',
    body: '"What would you change?" is weaker than "Where did you get stuck?"',
  },
  {
    title: 'Close the loop.',
    body: 'When you change something based on feedback, tell the people who helped. It makes them want to help again.',
  },
]
