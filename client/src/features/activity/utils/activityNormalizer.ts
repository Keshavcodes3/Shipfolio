export type ActivityVerb = 'shipped' | 'updated' | 'started' | 'merged' | 'released' | 'fixed' | 'added' | 'improved' | 'pushed' | 'created'

export interface NormalizedActivity {
  id: string
  projectId: string
  projectName: string
  type: 'commit' | 'pull_request' | 'release' | 'issue' | 'branch' | 'deployment'
  verb: ActivityVerb
  title: string
  description?: string
  actor: { username: string; displayName: string; avatar?: string }
  metadata?: {
    sha?: string
    pullRequestNumber?: number
    branch?: string
    releaseTag?: string
    filesChanged?: number
    additions?: number
    deletions?: number
  }
  source: 'github' | 'manual'
  createdAt: string
}

const COMMIT_PREFIX_MAP: Record<string, ActivityVerb> = {
  feat: 'added',
  fix: 'fixed',
  refactor: 'improved',
  docs: 'updated',
  chore: 'updated',
  test: 'added',
  perf: 'improved',
  build: 'updated',
  ci: 'updated',
  style: 'updated',
}

function normalizeCommitMessage(message: string): { verb: ActivityVerb; title: string } {
  const firstLine = message.split('\n')[0].trim()

  const conventionalMatch = firstLine.match(/^(\w+)(?:\(.+?\))?:\s*(.+)/)
  if (conventionalMatch) {
    const [, prefix, body] = conventionalMatch
    const verb = COMMIT_PREFIX_MAP[prefix?.toLowerCase() ?? ''] ?? 'updated'
    const capitalized = body.charAt(0).toUpperCase() + body.slice(1)
    return { verb, title: capitalized }
  }

  const capitalized = firstLine.charAt(0).toUpperCase() + firstLine.slice(1)
  return { verb: 'updated', title: capitalized }
}

function normalizePRTitle(title: string): { verb: ActivityVerb; title: string } {
  const lower = title.toLowerCase()
  if (lower.startsWith('merge')) {
    return { verb: 'merged', title }
  }
  if (lower.startsWith('fix')) {
    return { verb: 'fixed', title }
  }
  if (lower.startsWith('feat') || lower.startsWith('add')) {
    return { verb: 'added', title }
  }
  return { verb: 'merged', title }
}

export function normalizeActivity(raw: {
  id: string
  type: string
  title: string
  description?: string
  projectId: string
  projectName: string
  actor: { username: string; displayName: string; avatar?: string }
  metadata?: Record<string, unknown>
  createdAt: string
}): NormalizedActivity {
  const base = {
    id: raw.id,
    projectId: raw.projectId,
    projectName: raw.projectName,
    actor: raw.actor,
    source: 'github' as const,
    createdAt: raw.createdAt,
  }

  switch (raw.type) {
    case 'commit': {
      const { verb, title } = normalizeCommitMessage(raw.title)
      return { ...base, type: 'commit', verb, title }
    }
    case 'pull_request': {
      const { verb, title } = normalizePRTitle(raw.title)
      return { ...base, type: 'pull_request', verb, title, metadata: raw.metadata as NormalizedActivity['metadata'] }
    }
    case 'release':
      return { ...base, type: 'release', verb: 'released', title: raw.title }
    case 'issue':
      return { ...base, type: 'issue', verb: 'created', title: raw.title }
    case 'branch':
      return { ...base, type: 'branch', verb: 'created', title: `Created branch ${raw.title}` }
    case 'deployment':
      return { ...base, type: 'deployment', verb: 'shipped', title: raw.title }
    default:
      return { ...base, type: 'commit', verb: 'updated', title: raw.title }
  }
}

export function deduplicateActivities(activities: NormalizedActivity[]): NormalizedActivity[] {
  const seen = new Map<string, NormalizedActivity>()

  for (const activity of activities) {
    const key = `${activity.projectId}:${activity.type}:${activity.title}`
    const existing = seen.get(key)
    if (!existing || new Date(activity.createdAt) > new Date(existing.createdAt)) {
      seen.set(key, activity)
    }
  }

  return Array.from(seen.values()).sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  )
}
