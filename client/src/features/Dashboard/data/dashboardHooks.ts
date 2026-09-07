import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '../../../lib/api'

export interface GithubRepo {
  id: string
  githubRepoId: string
  name: string
  fullName: string
  description: string | null
  url: string
  htmlUrl: string
  primaryLanguage: string | null
  stars: number
  forks: number
  openIssues: number
  isPrivate: boolean
  isArchived: boolean
  isFork: boolean
  pushedAt: string | null
  lastSyncedAt: string
}

export interface GithubAccount {
  id: string
  githubUserId: string
  username: string
  avatarUrl: string | null
  connectedAt: string
  hasAccessToken: boolean
}

export interface DashboardProject {
  id: string
  name: string
  slug: string
  description: string | null
  status: string
  visibility: string
  technologies: { name: string }[]
  isCurrentlyBuilding: boolean
  isFeatured: boolean
  liveUrl: string | null
  githubRepoId: string | null
  createdAt: string
  updatedAt: string
}

export interface DashboardActivity {
  id: string
  type: string
  title: string | null
  description: string | null
  url: string | null
  occurredAt: string
  project: { name: string; slug: string }
}

export function useGithubAccount() {
  return useQuery({
    queryKey: ['github', 'account'],
    queryFn: async () => {
      const { data } = await api.get('/github/account')
      return data.data as GithubAccount | null
    },
    retry: false,
  })
}

export function useGithubRepos() {
  return useQuery({
    queryKey: ['github', 'repos'],
    queryFn: async () => {
      const { data } = await api.get('/github/repos')
      return data.data as GithubRepo[]
    },
    retry: false,
  })
}

export function useSyncGithubRepos() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async () => {
      const { data } = await api.post('/github/repos/sync')
      return data.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['github', 'repos'] })
    },
  })
}

export function useInitGithubOAuth() {
  return useMutation({
    mutationFn: async () => {
      const { data } = await api.post('/github/oauth/init', { mode: 'link' })
      return data.data as { url: string; state: string }
    },
  })
}

export function useMyProjects() {
  return useQuery({
    queryKey: ['projects', 'mine'],
    queryFn: async () => {
      const { data } = await api.get('/projects/mine')
      return data.data as DashboardProject[]
    },
    retry: false,
  })
}

export function useConnectRepo() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ repoId, projectId }: { repoId: string; projectId: string }) => {
      const { data } = await api.post(`/github/repos/${repoId}/connect`, { projectId })
      return data.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] })
      queryClient.invalidateQueries({ queryKey: ['github', 'repos'] })
    },
  })
}

export function useCreateProject() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (input: { name: string; description?: string; status?: string; githubRepoId?: string }) => {
      const { data } = await api.post('/projects', input)
      return data.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] })
    },
  })
}
