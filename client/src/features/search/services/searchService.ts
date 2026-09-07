import type {
  SearchResults,
  SearchProject,
  SearchBuilder,
  SearchTechnology,
  SearchEntityType,
} from '../types/search'
import { allProjects, allBuilders, technologies } from '../../discover/data/discoverData'

const WEIGHTS = {
  exactMatch: 100,
  prefixMatch: 80,
  startsWithWord: 60,
  containsName: 40,
  technologyMatch: 30,
  descriptionMatch: 10,
} as const

function normalize(text: string): string {
  return text.toLowerCase().trim()
}

function scoreText(query: string, target: string): number {
  const q = normalize(query)
  const t = normalize(target)

  if (q === t) return WEIGHTS.exactMatch
  if (t.startsWith(q)) return WEIGHTS.prefixMatch
  if (t.split(/\s+/).some((word) => word.startsWith(q))) return WEIGHTS.startsWithWord
  if (t.includes(q)) return WEIGHTS.containsName
  return 0
}

function scoreProject(query: string, project: SearchProject): number {
  let score = 0
  score = Math.max(score, scoreText(query, project.name))
  score = Math.max(score, scoreText(query, project.builder.username))
  score = Math.max(score, scoreText(query, project.builder.displayName))

  if (project.technologies.some((t) => normalize(t).includes(normalize(query)))) {
    score = Math.max(score, WEIGHTS.technologyMatch)
  }

  if (normalize(project.description).includes(normalize(query))) {
    score = Math.max(score, WEIGHTS.descriptionMatch)
  }

  if (normalize(project.category).includes(normalize(query))) {
    score = Math.max(score, WEIGHTS.descriptionMatch)
  }

  return score
}

function scoreBuilder(query: string, builder: SearchBuilder): number {
  let score = 0
  score = Math.max(score, scoreText(query, builder.username))
  score = Math.max(score, scoreText(query, builder.displayName))
  score = Math.max(score, scoreText(query, builder.headline))

  if (builder.technologies.some((t) => normalize(t).includes(normalize(query)))) {
    score = Math.max(score, WEIGHTS.technologyMatch)
  }

  if (normalize(builder.bio).includes(normalize(query))) {
    score = Math.max(score, WEIGHTS.descriptionMatch)
  }

  if (normalize(builder.specialty).includes(normalize(query))) {
    score = Math.max(score, WEIGHTS.descriptionMatch)
  }

  return score
}

function scoreTechnology(query: string, tech: SearchTechnology): number {
  return scoreText(query, tech.name)
}

function searchProjects(query: string): SearchProject[] {
  if (!query.trim()) return []

  const scored = allProjects
    .map((p) => ({ project: p, score: scoreProject(query, p) }))
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score || b.project.stars - a.project.stars)

  return scored.map(({ project }) => ({
    id: project.id,
    name: project.name,
    description: project.description,
    builder: project.builder,
    status: project.status,
    technologies: project.technologies,
    category: project.category,
    stars: project.stars,
    updatedAt: project.updatedAt,
  }))
}

function searchBuilders(query: string): SearchBuilder[] {
  if (!query.trim()) return []

  const scored = allBuilders
    .map((b) => ({ builder: b, score: scoreBuilder(query, b) }))
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score || b.builder.followers - a.builder.followers)

  return scored.map(({ builder }) => ({
    username: builder.username,
    displayName: builder.displayName,
    avatar: builder.avatar,
    headline: builder.headline,
    bio: builder.bio,
    technologies: builder.technologies,
    specialty: builder.specialty,
    followers: builder.followers,
    projectCount: builder.projectCount,
  }))
}

function searchTechnologies(query: string): SearchTechnology[] {
  if (!query.trim()) return []

  const scored = technologies
    .map((t) => ({ technology: t, score: scoreTechnology(query, t) }))
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score || b.technology.projectCount - a.technology.projectCount)

  return scored.map(({ technology }) => ({
    name: technology.name,
    projectCount: technology.projectCount,
  }))
}

export interface SearchOptions {
  query: string
  type?: SearchEntityType
  limit?: number
}

export function search({ query, type, limit = 20 }: SearchOptions): SearchResults {
  const q = query.trim()

  const projects = type === 'builders' || type === 'technologies' ? [] : searchProjects(q)
  const builders = type === 'projects' || type === 'technologies' ? [] : searchBuilders(q)
  const techs = type === 'projects' || type === 'builders' ? [] : searchTechnologies(q)

  return {
    projects: projects.slice(0, limit),
    builders: builders.slice(0, limit),
    technologies: techs.slice(0, limit),
    totals: {
      projects: projects.length,
      builders: builders.length,
      technologies: techs.length,
    },
  }
}
