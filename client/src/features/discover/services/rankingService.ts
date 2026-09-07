export interface RankableProject {
  id: string
  name: string
  description: string
  status: string
  technologies: string[]
  stars: number
  createdAt: string
  updatedAt: string
  activityCount?: number
  viewCount?: number
  followerCount?: number
}

export interface RankingWeights {
  freshness: number
  activity: number
  engagement: number
  quality: number
  consistency: number
}

const DEFAULT_WEIGHTS: RankingWeights = {
  freshness: 0.30,
  activity: 0.25,
  engagement: 0.20,
  quality: 0.15,
  consistency: 0.10,
}

function freshnessScore(updatedAt: string): number {
  const now = Date.now()
  const updated = new Date(updatedAt).getTime()
  const ageInDays = (now - updated) / (1000 * 60 * 60 * 24)
  return Math.exp(-0.05 * ageInDays)
}

function activityScore(project: RankableProject): number {
  const count = project.activityCount ?? 0
  return Math.min(count / 20, 1)
}

function engagementScore(project: RankableProject): number {
  const stars = project.stars ?? 0
  const views = project.viewCount ?? 0
  const followers = project.followerCount ?? 0
  const starScore = Math.min(stars / 100, 0.5)
  const viewScore = Math.min(views / 1000, 0.3)
  const followerScore = Math.min(followers / 50, 0.2)
  return starScore + viewScore + followerScore
}

function qualityScore(project: RankableProject): number {
  const hasDescription = project.description.length > 50 ? 0.3 : 0.1
  const techCount = Math.min(project.technologies.length / 5, 0.3)
  const statusBonus = project.status === 'SHIPPED' ? 0.4 : project.status === 'BUILDING' ? 0.2 : 0
  return hasDescription + techCount + statusBonus
}

function consistencyScore(project: RankableProject): number {
  const now = Date.now()
  const created = new Date(project.createdAt).getTime()
  const ageInDays = (now - created) / (1000 * 60 * 60 * 24)
  if (ageInDays < 7) return 0.2
  if (ageInDays < 30) return 0.5
  if (ageInDays < 90) return 0.8
  return 1
}

export function rankProject(
  project: RankableProject,
  weights: RankingWeights = DEFAULT_WEIGHTS
): number {
  return (
    freshnessScore(project.updatedAt) * weights.freshness +
    activityScore(project) * weights.activity +
    engagementScore(project) * weights.engagement +
    qualityScore(project) * weights.quality +
    consistencyScore(project) * weights.consistency
  )
}

export function rankProjects(
  projects: RankableProject[],
  weights: RankingWeights = DEFAULT_WEIGHTS
): (RankableProject & { rankScore: number })[] {
  return projects
    .map((p) => ({ ...p, rankScore: rankProject(p, weights) }))
    .sort((a, b) => b.rankScore - a.rankScore)
}

export function diversifyByTechnology(
  projects: (RankableProject & { rankScore: number })[],
  maxConsecutive: number = 2
): (RankableProject & { rankScore: number })[] {
  const result: (RankableProject & { rankScore: number })[] = []
  const techCounts = new Map<string, number>()

  for (const project of projects) {
    const primaryTech = project.technologies[0] ?? 'unknown'
    const consecutiveCount = techCounts.get(primaryTech) ?? 0

    if (consecutiveCount < maxConsecutive) {
      result.push(project)
      techCounts.set(primaryTech, consecutiveCount + 1)
    } else {
      const nextDifferent = projects.find(
        (p) =>
          !result.some((r) => r.id === p.id) &&
          (p.technologies[0] ?? 'unknown') !== primaryTech
      )
      if (nextDifferent) {
        result.push(nextDifferent)
        techCounts.set(nextDifferent.technologies[0] ?? 'unknown', 1)
        techCounts.set(primaryTech, 0)
      }
    }
  }

  return result
}
