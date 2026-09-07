export type ProjectNeedType =
  | 'FEEDBACK'
  | 'BETA_TESTERS'
  | 'EARLY_USERS'
  | 'COLLABORATOR'
  | 'DESIGNER'
  | 'DEVELOPER'
  | 'TECHNICAL_ADVICE'
  | 'PRODUCT_ADVICE'
  | 'OPEN_SOURCE_CONTRIBUTORS'
  | 'OTHER'

export interface ProjectNeed {
  id: string
  projectId: string
  type: ProjectNeedType
  note: string | null
  interestCount: number
  createdAt: string
  updatedAt: string
}

export interface NeedInterest {
  id: string
  needId: string
  userId: string
  message: string | null
  createdAt: string
  user: {
    id: string
    username: string
    displayName: string | null
    avatarUrl: string | null
  }
}

export interface ProjectNeedWithInterests extends ProjectNeed {
  interests: NeedInterest[]
}

export interface DiscoverNeedItem {
  need: ProjectNeed
  project: {
    id: string
    name: string
    slug: string
    description: string | null
    coverImageUrl: string | null
    status: string
    technologies: { id: string; name: string; slug: string }[]
  }
  owner: {
    id: string
    username: string
    displayName: string | null
    avatarUrl: string | null
  }
}

export const NEED_TYPE_LABELS: Record<ProjectNeedType, string> = {
  FEEDBACK: 'Feedback',
  BETA_TESTERS: 'Beta Testers',
  EARLY_USERS: 'Early Users',
  COLLABORATOR: 'Collaborator',
  DESIGNER: 'Designer',
  DEVELOPER: 'Developer',
  TECHNICAL_ADVICE: 'Technical Advice',
  PRODUCT_ADVICE: 'Product Advice',
  OPEN_SOURCE_CONTRIBUTORS: 'Open Source Contributors',
  OTHER: 'Other',
}

export const NEED_TYPE_ICONS: Record<ProjectNeedType, string> = {
  FEEDBACK: '💬',
  BETA_TESTERS: '🧪',
  EARLY_USERS: '👤',
  COLLABORATOR: '🤝',
  DESIGNER: '🎨',
  DEVELOPER: '⚡',
  TECHNICAL_ADVICE: '🔧',
  PRODUCT_ADVICE: '💡',
  OPEN_SOURCE_CONTRIBUTORS: '🌐',
  OTHER: '✨',
}

export const ALL_NEED_TYPES: ProjectNeedType[] = [
  'FEEDBACK',
  'BETA_TESTERS',
  'EARLY_USERS',
  'COLLABORATOR',
  'DESIGNER',
  'DEVELOPER',
  'TECHNICAL_ADVICE',
  'PRODUCT_ADVICE',
  'OPEN_SOURCE_CONTRIBUTORS',
  'OTHER',
]
