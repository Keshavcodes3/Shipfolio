import type { GithubAccountDto, GithubRepositoryDto } from "../types/github.types.js";

// ---------------------------------------------------------------------------
// Account DTOs
// ---------------------------------------------------------------------------

/** Strips tokens and internal fields before returning to the client. */
export const toGithubAccountDto = (account: {
  id: string;
  userId: string;
  githubUserId: string;
  username: string;
  avatarUrl: string | null;
  connectedAt: Date;
  updatedAt: Date;
  accessToken?: string | null;
}): GithubAccountDto => ({
  id: account.id,
  userId: account.userId,
  githubUserId: account.githubUserId,
  username: account.username,
  avatarUrl: account.avatarUrl,
  connectedAt: account.connectedAt,
  updatedAt: account.updatedAt,
  hasAccessToken: !!account.accessToken,
});

// ---------------------------------------------------------------------------
// Repository DTOs
// ---------------------------------------------------------------------------

export const toGithubRepositoryDto = (repo: {
  id: string;
  githubAccountId: string;
  githubRepoId: string;
  name: string;
  fullName: string;
  description: string | null;
  url: string;
  htmlUrl: string;
  primaryLanguage: string | null;
  stars: number;
  forks: number;
  openIssues: number;
  isPrivate: boolean;
  isArchived: boolean;
  isFork: boolean;
  pushedAt: Date | null;
  lastSyncedAt: Date;
  projectId?: string | null;
  project?: { id: string; name: string; slug: string } | null;
}): GithubRepositoryDto => ({
  id: repo.id,
  githubAccountId: repo.githubAccountId,
  githubRepoId: repo.githubRepoId,
  name: repo.name,
  fullName: repo.fullName,
  description: repo.description,
  url: repo.url,
  htmlUrl: repo.htmlUrl,
  primaryLanguage: repo.primaryLanguage,
  stars: repo.stars,
  forks: repo.forks,
  openIssues: repo.openIssues,
  isPrivate: repo.isPrivate,
  isArchived: repo.isArchived,
  isFork: repo.isFork,
  pushedAt: repo.pushedAt,
  lastSyncedAt: repo.lastSyncedAt,
  projectId: repo.projectId ?? repo.project?.id ?? null,
});

// ---------------------------------------------------------------------------
// Sync Response DTO
// ---------------------------------------------------------------------------

export type SyncResultDto = {
  syncedCount: number;
  removedCount: number;
  syncedAt: Date;
};
