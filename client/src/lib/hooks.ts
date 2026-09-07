import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from './api'

// ---------------------------------------------------------------------------
// User types
// ---------------------------------------------------------------------------

export interface UserProfile {
  id: string
  username: string
  displayName: string
  email: string
  avatar?: string
  bio?: string
  location?: string
  website?: string
  linkedinUrl?: string | null
  githubUsername?: string
  createdAt: string
}

// ---------------------------------------------------------------------------
// Public profile types (matching backend PublicProfile response)
// ---------------------------------------------------------------------------

export interface PublicProfileProject {
  id: string
  name: string
  slug: string
  description: string | null
  coverImageUrl: string | null
  status: string
  visibility: string
  liveUrl: string | null
  demoUrl: string | null
  isFeatured: boolean
  isCurrentlyBuilding: boolean
  startedAt: string | null
  updatedAt: string
  technologies: { id: string; name: string; slug: string }[]
  githubRepo?: {
    id: string
    name: string
    fullName: string
    htmlUrl: string
    primaryLanguage: string | null
    stars: number
    forks: number
  } | null
}

export interface PublicProfileTechnology {
  id: string
  name: string
  slug: string
  isPrimary: boolean
}

export interface PublicProfileGithubRepo {
  id: string
  name: string
  fullName: string
  description: string | null
  htmlUrl: string
  primaryLanguage: string | null
  stars: number
  forks: number
  isArchived: boolean
}

export interface PublicProfile {
  id: string
  username: string
  name: string | null
  avatarUrl: string | null
  bio: string | null
  location: string | null
  websiteUrl: string | null
  linkedinUrl: string | null
  createdAt: string
  githubUsername: string | null
  currentlyBuilding: PublicProfileProject | null
  featuredProjects: PublicProfileProject[]
  projects: PublicProfileProject[]
  projectStatuses: {
    building: number
    shipped: number
    maintaining: number
    paused: number
    archived: number
    total: number
  }
  technologies: PublicProfileTechnology[]
  technologyStack: {
    id: string
    name: string
    slug: string
    projectCount: number
    isPrimary: boolean
  }[]
  githubRepos: PublicProfileGithubRepo[]
  githubActivity: {
    type: string
    count: number
    latestAt: string | null
  }[]
  buildTimeline: {
    id: string
    name: string
    slug: string
    status: string
    startedAt: string | null
    updatedAt: string
  }[]
  education: ProfileEducationEntry[]
  experience: ProfileExperienceEntry[]
  counts: {
    followers: number
    following: number
    projects: number
  }
  isFollowing?: boolean
  isOwnProfile: boolean
}

export interface ProfileEducationEntry {
  id: string
  institution: string
  degree: string | null
  fieldOfStudy: string | null
  startYear: number
  endYear: number | null
  description: string | null
  sortOrder: number
}

export interface ProfileExperienceEntry {
  id: string
  company: string
  role: string
  startDate: string
  endDate: string | null
  description: string | null
  technologies: string[]
  sortOrder: number
}

// ---------------------------------------------------------------------------
// Technology types
// ---------------------------------------------------------------------------

export interface Technology {
  id: string
  name: string
  slug: string
  category: string | null
}

// ---------------------------------------------------------------------------
// Project types (matching backend ProjectResponse / ProjectDetailResponse)
// ---------------------------------------------------------------------------

export interface ProjectTechnology {
  technology: Technology
  isPrimary: boolean
}

export interface Project {
  id: string
  name: string
  slug: string
  description: string | null
  coverImageUrl: string | null
  status: 'BUILDING' | 'SHIPPED' | 'MAINTAINING' | 'PAUSED' | 'ARCHIVED'
  visibility: 'PUBLIC' | 'PRIVATE'
  liveUrl: string | null
  demoUrl: string | null
  startedAt: string | null
  lastUpdatedAt: string | null
  isFeatured: boolean
  isCurrentlyBuilding: boolean
  createdAt: string
  updatedAt: string
  technologies: ProjectTechnology[]
  user?: {
    id: string
    username: string
    displayName: string | null
    avatarUrl: string | null
  }
  _count?: { activities: number }
}

export interface ProjectDetail extends Project {
  userId: string
  githubRepoId: string | null
  githubRepo?: {
    id: string
    name: string
    fullName: string
    htmlUrl: string
    primaryLanguage: string | null
    stars: number
    forks: number
  } | null
  activities?: ProjectActivity[]
}

export interface ProjectActivity {
  id: string
  type: string
  title: string | null
  description: string | null
  url: string | null
  actorUsername: string | null
  actorAvatarUrl: string | null
  occurredAt: string
}

// ---------------------------------------------------------------------------
// GitHub repo types (synced repos from backend)
// ---------------------------------------------------------------------------

export interface GitHubRepo {
  id: string
  githubId: string
  name: string
  fullName: string
  htmlUrl: string
  description: string | null
  primaryLanguage: string | null
  stars: number
  forks: number
  isPrivate: boolean
  topics: string[]
  connectedProjectId?: string | null
}

// ---------------------------------------------------------------------------
// Activity / Session / Settings types
// ---------------------------------------------------------------------------

export interface Activity {
  id: string
  type: string
  title: string
  description?: string
  projectId: string
  projectName: string
  actor: { username: string; displayName: string; avatar?: string }
  metadata?: Record<string, unknown>
  createdAt: string
}

export interface Session {
  id: string
  device: string
  browser: string
  os: string
  location?: string
  lastActive: string
  isCurrent: boolean
}

export interface SettingsData {
  user: UserProfile
  sessions: Session[]
  githubConnected: boolean
  githubUsername?: string
}

// ---------------------------------------------------------------------------
// Helper — unwrap backend { success, data } envelope
// ---------------------------------------------------------------------------

function unwrap<T>(response: { data: any }): T {
  return response.data.data as T
}

function unwrapList<T>(response: { data: any }): T[] {
  return response.data.data as T[]
}

// ---------------------------------------------------------------------------
// User hooks
// ---------------------------------------------------------------------------

export function useUser(username?: string) {
  return useQuery({
    queryKey: ['user', username],
    queryFn: async () => {
      const res = username
        ? await api.get(`/profiles/${username}`)
        : await api.get('/profiles/me')
      return unwrap<UserProfile>(res)
    },
  })
}

export function usePublicProfile(username?: string) {
  return useQuery({
    queryKey: ['profile', username],
    queryFn: async () => {
      const res = await api.get(`/profiles/${username}`)
      return unwrap<PublicProfile>(res)
    },
    enabled: !!username,
  })
}

export function useUpdateProfile() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (updates: Partial<UserProfile>) => {
      const res = await api.patch('/profiles/me', updates)
      return unwrap<UserProfile>(res)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user'] })
    },
  })
}

// ---------------------------------------------------------------------------
// Project hooks
// ---------------------------------------------------------------------------

export function useMyProjects(params?: {
  page?: number
  limit?: number
  status?: string
  search?: string
  sortBy?: string
  order?: 'asc' | 'desc'
}) {
  return useQuery({
    queryKey: ['projects', 'mine', params],
    queryFn: async () => {
      const query = new URLSearchParams()
      if (params?.page) query.set('page', String(params.page))
      if (params?.limit) query.set('limit', String(params.limit))
      if (params?.status) query.set('status', params.status)
      if (params?.search) query.set('search', params.search)
      if (params?.sortBy) query.set('sortBy', params.sortBy)
      if (params?.order) query.set('order', params.order)
      const qs = query.toString()
      const res = await api.get(`/projects/mine${qs ? `?${qs}` : ''}`)
      return unwrapList<Project>(res)
    },
  })
}

export function useProject(id: string) {
  return useQuery({
    queryKey: ['project', id],
    queryFn: async () => {
      const res = await api.get(`/projects/${id}`)
      return unwrap<ProjectDetail>(res)
    },
    enabled: !!id,
  })
}

export function useCreateProject() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (data: {
      name: string
      description?: string | null
      status?: string
      visibility?: string
      liveUrl?: string | null
      demoUrl?: string | null
      githubRepoId?: string | null
      technologyIds?: string[]
      isCurrentlyBuilding?: boolean
      isFeatured?: boolean
    }) => {
      const res = await api.post('/projects', data)
      return unwrap<Project>(res)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects', 'mine'] })
    },
  })
}

export function useUpdateProject() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({
      id,
      ...data
    }: {
      id: string
      name?: string
      description?: string | null
      status?: string
      visibility?: string
      liveUrl?: string | null
      demoUrl?: string | null
      githubRepoId?: string | null
      technologyIds?: string[]
      isCurrentlyBuilding?: boolean
      isFeatured?: boolean
    }) => {
      const res = await api.patch(`/projects/${id}`, data)
      return unwrap<Project>(res)
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['projects', 'mine'] })
      queryClient.invalidateQueries({ queryKey: ['project', variables.id] })
    },
  })
}

export function useDeleteProject() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/projects/${id}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects', 'mine'] })
    },
  })
}

// ---------------------------------------------------------------------------
// Technology hooks
// ---------------------------------------------------------------------------

export function useTechnologies(search?: string) {
  return useQuery({
    queryKey: ['technologies', search],
    queryFn: async () => {
      const query = search ? `?search=${encodeURIComponent(search)}&limit=50` : '?limit=50'
      const res = await api.get(`/technologies${query}`)
      return unwrapList<Technology>(res)
    },
  })
}

export function useSearchTechnologies(q: string) {
  return useQuery({
    queryKey: ['technologies', 'search', q],
    queryFn: async () => {
      const res = await api.get(`/technologies/search?q=${encodeURIComponent(q)}&limit=20`)
      return unwrapList<Technology>(res)
    },
    enabled: q.length >= 1,
  })
}

// ---------------------------------------------------------------------------
// GitHub hooks
// ---------------------------------------------------------------------------

export function useConnectGitHub() {
  return useMutation({
    mutationFn: async (mode?: 'login' | 'link') => {
      const res = await api.post('/github/oauth/init', { mode: mode || 'login' })
      return unwrap<{ url: string; state: string }>(res)
    },
  })
}

export function useLinkGitHubAccount() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (code: string) => {
      const res = await api.post('/github/account/link', { code })
      return unwrap<any>(res)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['github'] })
      queryClient.invalidateQueries({ queryKey: ['user'] })
      queryClient.invalidateQueries({ queryKey: ['settings'] })
    },
  })
}

export function useGitHubAccount() {
  return useQuery({
    queryKey: ['github', 'account'],
    queryFn: async () => {
      const res = await api.get('/github/account')
      return unwrap<{ id: string; username: string; avatarUrl: string | null; hasAccessToken: boolean }>(res)
    },
    retry: false,
  })
}

export function useDisconnectGitHub() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async () => {
      await api.delete('/github/account/unlink')
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['settings'] })
    },
  })
}

export function useGitHubRepos(projectId?: string) {
  return useQuery({
    queryKey: ['github', 'repos', projectId],
    queryFn: async () => {
      const qs = projectId ? `?projectId=${projectId}` : ''
      const res = await api.get(`/github/repos${qs}`)
      return unwrapList<GitHubRepo>(res)
    },
  })
}

export function useSyncGitHubRepos() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async () => {
      const res = await api.post('/github/repos/sync')
      return unwrap<{ syncedCount: number; removedCount: number }>(res)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['github', 'repos'] })
    },
  })
}

export function useConnectGitHubRepo() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ repoId, projectId }: { repoId: string; projectId: string }) => {
      const res = await api.post(`/github/repos/${repoId}/connect`, { projectId })
      return unwrap<Project>(res)
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['github', 'repos'] })
      queryClient.invalidateQueries({ queryKey: ['project', variables.projectId] })
      queryClient.invalidateQueries({ queryKey: ['projects', 'mine'] })
    },
  })
}

export function useDisconnectGitHubRepo() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (projectId: string) => {
      await api.delete(`/projects/${projectId}/github`)
    },
    onSuccess: (_, projectId) => {
      queryClient.invalidateQueries({ queryKey: ['github', 'repos'] })
      queryClient.invalidateQueries({ queryKey: ['project', projectId] })
      queryClient.invalidateQueries({ queryKey: ['projects', 'mine'] })
    },
  })
}

// ---------------------------------------------------------------------------
// Activity hooks
// ---------------------------------------------------------------------------

export function useActivities(projectId?: string) {
  return useQuery({
    queryKey: ['activities', projectId],
    queryFn: async () => {
      const url = projectId ? `/activities?projectId=${projectId}` : '/activities'
      const res = await api.get(url)
      return unwrapList<Activity>(res)
    },
  })
}

// ---------------------------------------------------------------------------
// Settings hooks
// ---------------------------------------------------------------------------

export function useSettings() {
  return useQuery({
    queryKey: ['settings'],
    queryFn: async () => {
      const res = await api.get('/profiles/me')
      return unwrap<SettingsData>(res)
    },
  })
}

export function useUpdateSettings() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (updates: Partial<UserProfile>) => {
      const res = await api.put('/users/me', updates)
      return unwrap<SettingsData>(res)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['settings'] })
      queryClient.invalidateQueries({ queryKey: ['user'] })
    },
  })
}

export function useSessions() {
  return useQuery({
    queryKey: ['sessions'],
    queryFn: async () => {
      const res = await api.get('/auth/sessions')
      return unwrapList<Session>(res)
    },
  })
}

export function useRevokeSession() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (sessionId: string) => {
      await api.delete(`/auth/sessions/${sessionId}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sessions'] })
    },
  })
}

export function useRevokeAllSessions() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async () => {
      await api.delete('/auth/sessions')
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sessions'] })
    },
  })
}

export function useDeleteAccount() {
  return useMutation({
    mutationFn: async () => {
      await api.delete('/users/me')
    },
  })
}

export function useChangePassword() {
  return useMutation({
    mutationFn: async (passwords: { currentPassword: string; newPassword: string }) => {
      await api.put('/auth/change-password', passwords)
    },
  })
}

export function useReport() {
  return useMutation({
    mutationFn: async (report: { targetType: string; targetId: string; reason: string; description?: string }) => {
      const res = await api.post('/reports', report)
      return unwrap<any>(res)
    },
  })
}

export function useBlockUser() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (username: string) => {
      await api.post(`/users/${username}/block`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user'] })
    },
  })
}

export function useUnblockUser() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (username: string) => {
      await api.delete(`/users/${username}/block`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user'] })
    },
  })
}

export function useFeaturedProjects(userId?: string) {
  return useQuery({
    queryKey: ['projects', 'featured', userId],
    queryFn: async () => {
      const url = userId ? `/projects/featured/${userId}` : '/projects/featured'
      const res = await api.get(url)
      return unwrapList<Project>(res)
    },
  })
}

export function useDiscoverProjects(params?: { sort?: string; technology?: string; search?: string }) {
  return useQuery({
    queryKey: ['projects', 'discover', params],
    queryFn: async () => {
      const query = new URLSearchParams()
      if (params?.sort) query.set('sortBy', params.sort)
      if (params?.technology) query.set('technology', params.technology)
      if (params?.search) query.set('search', params.search)
      const qs = query.toString()
      const res = await api.get(`/projects${qs ? `?${qs}` : ''}`)
      return unwrapList<Project>(res)
    },
  })
}

export function useFeaturedBuilders(limit?: number) {
  return useQuery({
    queryKey: ['discover', 'builders', limit],
    queryFn: async () => {
      const qs = limit ? `?limit=${limit}` : ''
      const res = await api.get(`/projects/builders${qs}`)
      return unwrapList<FeaturedBuilder>(res)
    },
  })
}

export interface FeaturedBuilder {
  id: string
  username: string
  displayName: string | null
  avatarUrl: string | null
  bio: string | null
  projectCount: number
  followerCount: number
}

export function useSearchEntities(query: string, type?: string) {
  return useQuery({
    queryKey: ['search', query, type],
    queryFn: async () => {
      const params = new URLSearchParams({ q: query })
      if (type && type !== 'all') params.set('type', type)
      const res = await api.get(`/search?${params.toString()}`)
      return unwrap<any>(res)
    },
    enabled: query.length >= 2,
  })
}

// ---------------------------------------------------------------------------
// Public GitHub proxy hooks (no auth required)
// ---------------------------------------------------------------------------

export function useGithubReadme(fullName?: string) {
  return useQuery({
    queryKey: ['github', 'readme', fullName],
    queryFn: async () => {
      const res = await api.get(`/github/public/repos/${fullName}/readme`)
      return unwrap<{ content: string | null }>(res)
    },
    enabled: !!fullName,
    retry: false,
  })
}

export function useGithubContributors(fullName?: string) {
  return useQuery({
    queryKey: ['github', 'contributors', fullName],
    queryFn: async () => {
      const res = await api.get(`/github/public/repos/${fullName}/contributors`)
      return unwrap<{ login: string; avatarUrl: string; htmlUrl: string; contributions: number }[]>(res)
    },
    enabled: !!fullName,
    retry: false,
  })
}

export function useGithubLanguages(fullName?: string) {
  return useQuery({
    queryKey: ['github', 'languages', fullName],
    queryFn: async () => {
      const res = await api.get(`/github/public/repos/${fullName}/languages`)
      return unwrap<{ name: string; bytes: number }[]>(res)
    },
    enabled: !!fullName,
    retry: false,
  })
}

// ---------------------------------------------------------------------------
// Follows
// ---------------------------------------------------------------------------

export function useFollowStatus(username?: string) {
  return useQuery({
    queryKey: ['follow', 'status', username],
    queryFn: async () => {
      const res = await api.get(`/follows/${username}/status`)
      return unwrap<{ following: boolean; followers: number; followingCount: number }>(res)
    },
    enabled: !!username,
  })
}

export function useFollowers(username?: string, page = 1, limit = 20) {
  return useQuery({
    queryKey: ['follow', 'followers', username, page],
    queryFn: async () => {
      const res = await api.get(`/follows/${username}/followers`, { params: { page, limit } })
      return unwrap<{ items: { id: string; username: string; displayName: string | null; avatarUrl: string | null; isFollowing?: boolean }[]; total: number; page: number; totalPages: number }>(res)
    },
    enabled: !!username,
  })
}

export function useFollowing(username?: string, page = 1, limit = 20) {
  return useQuery({
    queryKey: ['follow', 'following', username, page],
    queryFn: async () => {
      const res = await api.get(`/follows/${username}/following`, { params: { page, limit } })
      return unwrap<{ items: { id: string; username: string; displayName: string | null; avatarUrl: string | null; isFollowing?: boolean }[]; total: number; page: number; totalPages: number }>(res)
    },
    enabled: !!username,
  })
}

export function useToggleFollow(username?: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (following: boolean) => {
      if (following) {
        await api.post(`/follows/${username}/follow`)
      } else {
        await api.delete(`/follows/${username}/follow`)
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['follow'] })
      queryClient.invalidateQueries({ queryKey: ['publicProfile'] })
    },
  })
}

// ---------------------------------------------------------------------------
// Community
// ---------------------------------------------------------------------------

export interface CommunityPost {
  id: string
  type: 'PROJECT_UPDATE' | 'ASK_FOR_REVIEW' | 'DISCUSSION' | 'SHIP'
  title: string
  content: string
  category: string
  tags: string[]
  isPinned: boolean
  upvoteCount: number
  commentCount: number
  createdAt: string
  updatedAt: string
  author: { id: string; username: string; displayName: string | null; avatarUrl: string | null }
  isUpvoted?: boolean
}

export interface CommunityComment {
  id: string
  content: string
  createdAt: string
  updatedAt: string
  author: { id: string; username: string; displayName: string | null; avatarUrl: string | null }
}

export interface CommunityStats {
  totalPosts: number
  totalComments: number
  activeBuilders: number
  postsToday: number
}

export function useCommunityPosts(params: {
  page?: number
  limit?: number
  type?: string
  category?: string
  sort?: 'recent' | 'popular' | 'discussed'
  search?: string
} = {}) {
  return useQuery({
    queryKey: ['community', 'posts', params],
    queryFn: async () => {
      const res = await api.get('/community/posts', { params })
      return unwrap<{ posts: CommunityPost[]; total: number; page: number; totalPages: number }>(res)
    },
  })
}

export function useCommunityPost(id?: string) {
  return useQuery({
    queryKey: ['community', 'post', id],
    queryFn: async () => {
      const res = await api.get(`/community/posts/${id}`)
      return unwrap<CommunityPost>(res)
    },
    enabled: !!id,
  })
}

export function useCommunityStats() {
  return useQuery({
    queryKey: ['community', 'stats'],
    queryFn: async () => {
      const res = await api.get('/community/stats')
      return unwrap<CommunityStats>(res)
    },
  })
}

export function useCommunityCategories() {
  return useQuery({
    queryKey: ['community', 'categories'],
    queryFn: async () => {
      const res = await api.get('/community/categories')
      return unwrap<{ name: string; count: number }[]>(res)
    },
  })
}

export function useCommunityRecentAuthors() {
  return useQuery({
    queryKey: ['community', 'recentAuthors'],
    queryFn: async () => {
      const res = await api.get('/community/recent-authors')
      return unwrap<{ id: string; username: string; name: string | null; avatarUrl: string | null; _count: { communityPosts: number } }[]>(res)
    },
  })
}

export function useCommunityComments(postId?: string, page = 1, limit = 20) {
  return useQuery({
    queryKey: ['community', 'comments', postId, page],
    queryFn: async () => {
      const res = await api.get(`/community/posts/${postId}/comments`, { params: { page, limit } })
      return unwrap<{ comments: CommunityComment[]; total: number; page: number; totalPages: number }>(res)
    },
    enabled: !!postId,
  })
}

export function useCreateCommunityPost() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (data: { title: string; content: string; type?: string; category: string; tags?: string[] }) => {
      const res = await api.post('/community/posts', data)
      return unwrap<CommunityPost>(res)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['community'] })
    },
  })
}

export function useCreateCommunityComment() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ postId, content }: { postId: string; content: string }) => {
      const res = await api.post(`/community/posts/${postId}/comments`, { content })
      return unwrap<CommunityComment>(res)
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['community', 'comments', variables.postId] })
      queryClient.invalidateQueries({ queryKey: ['community', 'posts'] })
    },
  })
}

export function useToggleCommunityUpvote() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (postId: string) => {
      const res = await api.post(`/community/posts/${postId}/upvote`)
      return unwrap<{ upvoted: boolean }>(res)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['community'] })
    },
  })
}

export function useDeleteCommunityPost() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (postId: string) => {
      await api.delete(`/community/posts/${postId}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['community'] })
    },
  })
}

export function useDeleteCommunityComment() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ postId, commentId }: { postId: string; commentId: string }) => {
      await api.delete(`/community/posts/${postId}/comments/${commentId}`)
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['community', 'comments', variables.postId] })
      queryClient.invalidateQueries({ queryKey: ['community', 'posts'] })
    },
  })
}

// ---------------------------------------------------------------------------
// Graveyard
// ---------------------------------------------------------------------------

export interface GraveyardEntry {
  id: string
  name: string
  slug: string
  classification: {
    primary_category: string
    secondary_categories: string[]
    business_type: string
    status: string
    failure_type: string
  }
  overview: {
    one_liner: string
    problem: string
    target_users: string[]
    product: string
  }
  idea: {
    what_they_wanted_to_build: string
    why_the_problem_mattered: string
    founder_hypothesis: string
    initial_assumption: string
  }
  product: {
    type: string
    delivery: string
    core_use_case: string
    primary_user: string
    secondary_user: string
    technical_implementation: string | null
    pricing_model: string | null
  }
  building: {
    development_period: string
    team_size: number | null
    technology_stack: string | null
    distribution_strategy: string
  }
  traction: {
    users: string | null
    revenue: string | null
    funding: string | null
    investors: string[]
    product_market_fit: boolean
  }
  failure: {
    status: string
    primary_reason: string
    why_failed: string
    contributing_factors: { factor: string; explanation: string }[]
    death_event: string
    what_did_not_work: string[]
  }
  founder_realization: {
    biggest_realization: string
    core_insight: string
  }
  lessons: { title: string; lesson: string; why_it_matters: string }[]
  graveyard_analysis: {
    failure_pattern: string[]
    the_illusion: string
    the_reality: string
    what_a_founder_should_check_earlier: string[]
  }
  graveyard_card: {
    headline: string
    failure_reason: string
    biggest_lesson: string
    difficulty: string
    founder_stage: string
    worth_studying: boolean
  }
}

export function useGraveyardEntries() {
  return useQuery({
    queryKey: ['graveyard', 'entries'],
    queryFn: async () => {
      const res = await api.get('/graveyard')
      return unwrapList<GraveyardEntry>(res)
    },
  })
}

export function useGraveyardEntry(slug?: string) {
  return useQuery({
    queryKey: ['graveyard', 'entry', slug],
    queryFn: async () => {
      const res = await api.get(`/graveyard/${slug}`)
      return unwrap<GraveyardEntry>(res)
    },
    enabled: !!slug,
  })
}

export function useGraveyardStats() {
  return useQuery({
    queryKey: ['graveyard', 'stats'],
    queryFn: async () => {
      const res = await api.get('/graveyard/stats')
      return unwrap<{ total: number; categories: number; totalLessons: number; failureTypes: { type: string; count: number }[] }>(res)
    },
  })
}

export function useGraveyardCategories() {
  return useQuery({
    queryKey: ['graveyard', 'categories'],
    queryFn: async () => {
      const res = await api.get('/graveyard/categories')
      return unwrap<{ name: string; count: number }[]>(res)
    },
  })
}

export function useGraveyardFeatured() {
  return useQuery({
    queryKey: ['graveyard', 'featured'],
    queryFn: async () => {
      const res = await api.get('/graveyard/featured')
      return unwrap<GraveyardEntry[]>(res)
    },
  })
}

export function useGraveyardSearch(query: string) {
  return useQuery({
    queryKey: ['graveyard', 'search', query],
    queryFn: async () => {
      const res = await api.get('/graveyard/search', { params: { q: query } })
      return unwrap<GraveyardEntry[]>(res)
    },
    enabled: query.length > 0,
  })
}

// ---------------------------------------------------------------------------
// Education hooks
// ---------------------------------------------------------------------------

export function useEducation() {
  return useQuery({
    queryKey: ['education'],
    queryFn: async () => {
      const res = await api.get('/education')
      return unwrapList<ProfileEducationEntry>(res)
    },
  })
}

export function useCreateEducation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (data: {
      institution: string
      degree?: string | null
      fieldOfStudy?: string | null
      startYear: number
      endYear?: number | null
      description?: string | null
    }) => {
      const res = await api.post('/education', data)
      return unwrap<ProfileEducationEntry>(res)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['education'] })
      queryClient.invalidateQueries({ queryKey: ['profile'] })
    },
  })
}

export function useUpdateEducation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({
      id,
      ...data
    }: {
      id: string
      institution?: string
      degree?: string | null
      fieldOfStudy?: string | null
      startYear?: number
      endYear?: number | null
      description?: string | null
    }) => {
      const res = await api.patch(`/education/${id}`, data)
      return unwrap<ProfileEducationEntry>(res)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['education'] })
      queryClient.invalidateQueries({ queryKey: ['profile'] })
    },
  })
}

export function useDeleteEducation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/education/${id}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['education'] })
      queryClient.invalidateQueries({ queryKey: ['profile'] })
    },
  })
}

export function useReorderEducation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (ids: string[]) => {
      await api.post('/education/reorder', { ids })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['education'] })
      queryClient.invalidateQueries({ queryKey: ['profile'] })
    },
  })
}

// ---------------------------------------------------------------------------
// Experience hooks
// ---------------------------------------------------------------------------

export function useExperience() {
  return useQuery({
    queryKey: ['experience'],
    queryFn: async () => {
      const res = await api.get('/experience')
      return unwrapList<ProfileExperienceEntry>(res)
    },
  })
}

export function useCreateExperience() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (data: {
      company: string
      role: string
      startDate: string
      endDate?: string | null
      description?: string | null
      technologies?: string[]
    }) => {
      const res = await api.post('/experience', data)
      return unwrap<ProfileExperienceEntry>(res)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['experience'] })
      queryClient.invalidateQueries({ queryKey: ['profile'] })
    },
  })
}

export function useUpdateExperience() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({
      id,
      ...data
    }: {
      id: string
      company?: string
      role?: string
      startDate?: string
      endDate?: string | null
      description?: string | null
      technologies?: string[]
    }) => {
      const res = await api.patch(`/experience/${id}`, data)
      return unwrap<ProfileExperienceEntry>(res)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['experience'] })
      queryClient.invalidateQueries({ queryKey: ['profile'] })
    },
  })
}

export function useDeleteExperience() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/experience/${id}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['experience'] })
      queryClient.invalidateQueries({ queryKey: ['profile'] })
    },
  })
}

export function useReorderExperience() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (ids: string[]) => {
      await api.post('/experience/reorder', { ids })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['experience'] })
      queryClient.invalidateQueries({ queryKey: ['profile'] })
    },
  })
}

// ---------------------------------------------------------------------------
// Project Needs hooks
// ---------------------------------------------------------------------------

import type {
  ProjectNeed,
  ProjectNeedWithInterests,
  DiscoverNeedItem,
  ProjectNeedType,
} from '../features/projects/types/projectNeed'

export function useProjectNeeds(projectId: string | undefined) {
  return useQuery({
    queryKey: ['projectNeeds', projectId],
    queryFn: async () => {
      const res = await api.get(`/projects/${projectId}/needs`)
      return unwrapList<ProjectNeed>(res)
    },
    enabled: !!projectId,
  })
}

export function useProjectNeedDetail(projectId: string | undefined, needId: string | undefined) {
  return useQuery({
    queryKey: ['projectNeed', projectId, needId],
    queryFn: async () => {
      const res = await api.get(`/projects/${projectId}/needs/${needId}`)
      return unwrap<ProjectNeedWithInterests>(res)
    },
    enabled: !!projectId && !!needId,
  })
}

export function useCreateProjectNeed() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ projectId, type, note }: { projectId: string; type: ProjectNeedType; note?: string | null }) => {
      const res = await api.post(`/projects/${projectId}/needs`, { type, note })
      return unwrap<ProjectNeed>(res)
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['projectNeeds', variables.projectId] })
      queryClient.invalidateQueries({ queryKey: ['project', variables.projectId] })
    },
  })
}

export function useUpdateProjectNeed() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ projectId, needId, note }: { projectId: string; needId: string; note?: string | null }) => {
      const res = await api.patch(`/projects/${projectId}/needs/${needId}`, { note })
      return unwrap<ProjectNeed>(res)
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['projectNeeds', variables.projectId] })
      queryClient.invalidateQueries({ queryKey: ['projectNeed', variables.projectId, variables.needId] })
    },
  })
}

export function useDeleteProjectNeed() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ projectId, needId }: { projectId: string; needId: string }) => {
      await api.delete(`/projects/${projectId}/needs/${needId}`)
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['projectNeeds', variables.projectId] })
      queryClient.invalidateQueries({ queryKey: ['project', variables.projectId] })
    },
  })
}

export function useExpressInterest() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ projectId, needId, message }: { projectId: string; needId: string; message?: string | null }) => {
      const res = await api.post(`/projects/${projectId}/needs/${needId}/interest`, { message })
      return unwrap<any>(res)
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['projectNeeds', variables.projectId] })
      queryClient.invalidateQueries({ queryKey: ['projectNeed', variables.projectId, variables.needId] })
    },
  })
}

export function useWithdrawInterest() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ projectId, needId }: { projectId: string; needId: string }) => {
      await api.delete(`/projects/${projectId}/needs/${needId}/interest`)
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['projectNeeds', variables.projectId] })
      queryClient.invalidateQueries({ queryKey: ['projectNeed', variables.projectId, variables.needId] })
    },
  })
}

export function useDiscoverNeeds(params?: { type?: string; technology?: string; search?: string; page?: number; limit?: number }) {
  return useQuery({
    queryKey: ['discover', 'needs', params],
    queryFn: async () => {
      const query = new URLSearchParams()
      if (params?.type) query.set('type', params.type)
      if (params?.technology) query.set('technology', params.technology)
      if (params?.search) query.set('search', params.search)
      if (params?.page) query.set('page', String(params.page))
      if (params?.limit) query.set('limit', String(params.limit))
      const qs = query.toString()
      const res = await api.get(`/projects/discover/needs${qs ? `?${qs}` : ''}`)
      return unwrapList<DiscoverNeedItem>(res)
    },
  })
}
