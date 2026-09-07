import { api } from '../../../lib/api'
import type {
  SearchResults,
  SearchEntityType,
} from '../types/search'

const DEFAULT_RESULTS: SearchResults = {
  projects: [],
  builders: [],
  technologies: [],
  totals: { projects: 0, builders: 0, technologies: 0 },
}

export interface SearchOptions {
  query: string
  type?: SearchEntityType
  limit?: number
}

export async function search({ query, type, limit = 20 }: SearchOptions): Promise<SearchResults> {
  const q = query.trim()
  if (!q) return DEFAULT_RESULTS

  const shouldSearch = (t: SearchEntityType) => !type || type === t

  const promises: Promise<any>[] = []

  if (shouldSearch('projects')) {
    promises.push(
      api.get('/projects', { params: { search: q, limit } })
        .then((r) => (r.data.data ?? r.data).map((p: any) => ({
          id: p.id,
          name: p.name,
          description: p.description ?? '',
          builder: {
            username: p.owner?.username ?? p.user?.username ?? '',
            displayName: p.owner?.displayName ?? p.owner?.name ?? p.user?.name ?? '',
          },
          status: p.status ?? 'BUILDING',
          technologies: (p.technologies ?? []).map((t: any) => t.name ?? t),
          category: '',
          stars: p.stars ?? 0,
          updatedAt: p.updatedAt ?? '',
        })))
        .catch(() => [])
    )
  } else {
    promises.push(Promise.resolve([]))
  }

  if (shouldSearch('builders')) {
    promises.push(
      api.get('/users', { params: { search: q, limit } })
        .then((r) => (r.data.data ?? r.data).map((u: any) => ({
          username: u.username,
          displayName: u.name ?? u.displayName ?? u.username,
          avatar: u.avatarUrl ?? u.avatar ?? '',
          headline: u.bio ?? '',
          bio: u.bio ?? '',
          technologies: (u.technologies ?? []).map((t: any) => t.name ?? t),
          specialty: 'Full Stack',
          followers: u._count?.followers ?? u.followerCount ?? 0,
          projectCount: u._count?.projects ?? u.projectCount ?? 0,
        })))
        .catch(() => [])
    )
  } else {
    promises.push(Promise.resolve([]))
  }

  if (shouldSearch('technologies')) {
    promises.push(
      api.get('/technologies/search', { params: { q, limit } })
        .then((r) => (r.data.data ?? r.data).map((t: any) => ({
          name: t.name,
          projectCount: t._count?.projects ?? t.projectCount ?? 0,
        })))
        .catch(() => [])
    )
  } else {
    promises.push(Promise.resolve([]))
  }

  const [projects, builders, technologies] = await Promise.all(promises)

  return {
    projects,
    builders,
    technologies,
    totals: {
      projects: projects.length,
      builders: builders.length,
      technologies: technologies.length,
    },
  }
}
