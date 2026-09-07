export type NotificationType =
  | 'FOLLOWED_YOU'
  | 'PROJECT_SHIPPED'
  | 'PROJECT_INTERACTION'

export interface Notification {
  id: string
  type: NotificationType
  builder?: {
    username: string
    displayName: string
  }
  project?: {
    id: string
    name: string
  }
  text: string
  timestamp: string
  isRead: boolean
  href: string
}
