export type SearchEntityType = 'projects' | 'builders' | 'technologies'

export type SearchFilterType = 'all' | SearchEntityType

export interface SearchProject {
  id: string
  name: string
  description: string
  builder: { username: string; displayName: string }
  status: string
  technologies: string[]
  category: string
  stars: number
  updatedAt: string
}

export interface SearchBuilder {
  username: string
  displayName: string
  avatar: string
  headline: string
  bio: string
  technologies: string[]
  specialty: string
  followers: number
  projectCount: number
}

export interface SearchTechnology {
  name: string
  projectCount: number
}

export interface SearchResults {
  projects: SearchProject[]
  builders: SearchBuilder[]
  technologies: SearchTechnology[]
  totals: { projects: number; builders: number; technologies: number }
}

export interface SearchRanking {
  exactMatch: number
  prefixMatch: number
  nameMatch: number
  technologyMatch: number
  descriptionMatch: number
}
