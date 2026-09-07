export type ActivityType =
  | 'PROJECT_STARTED'
  | 'PROJECT_SHIPPED'
  | 'PROJECT_UPDATED'
  | 'PROJECT_STATUS_CHANGED'
  | 'PROJECT_FEATURED'
  | 'FEEDBACK_REQUEST'

export interface ActivityBuilder {
  username: string
  displayName: string
}

export interface ActivityProject {
  id: string
  name: string
  description: string
  status: string
  technologies: string[]
  visual: 'orb' | 'bars' | 'grid' | 'pulse' | 'wave'
}

export interface ActivityEvent {
  id: string
  type: ActivityType
  builder: ActivityBuilder
  project: ActivityProject
  text: string
  detail?: string
  timestamp: string
}
