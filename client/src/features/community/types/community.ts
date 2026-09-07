export type PostType = 'PROJECT_UPDATE' | 'ASK_FOR_REVIEW' | 'DISCUSSION' | 'SHIP'

export type PostCategory =
  | 'Looking for Feedback'
  | 'Show & Tell'
  | 'Question'
  | 'Discussion'
  | 'Looking for Co-founder'
  | 'Hiring'
  | 'Built Something Cool'

export interface PostAuthor {
  username: string
  displayName: string
  avatar?: string
}

export interface PostProject {
  id: string
  name: string
  description: string
  technologies: string[]
}

export interface PostComment {
  id: string
  author: PostAuthor
  content: string
  createdAt: string
  helpfulCount: number
}

export interface CommunityPost {
  id: string
  type: PostType
  author: PostAuthor
  title: string
  content: string
  project?: PostProject
  category: PostCategory
  tags: string[]
  comments: PostComment[]
  upvoteCount: number
  createdAt: string
  isPinned?: boolean
}

export const postTypes: { value: PostType; label: string }[] = [
  { value: 'PROJECT_UPDATE', label: 'Project Update' },
  { value: 'ASK_FOR_REVIEW', label: 'Ask for Review' },
  { value: 'DISCUSSION', label: 'Discussion' },
  { value: 'SHIP', label: 'Ship' },
]

export const postCategories: PostCategory[] = [
  'Looking for Feedback',
  'Show & Tell',
  'Question',
  'Discussion',
  'Looking for Co-founder',
  'Hiring',
  'Built Something Cool',
]
