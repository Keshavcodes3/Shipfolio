// ---------------------------------------------------------------------------
// GitHub domain events
// ---------------------------------------------------------------------------

export const GithubEvents = {
  // Account lifecycle
  ACCOUNT_LINKED: "github.account.linked",
  ACCOUNT_UNLINKED: "github.account.unlinked",
  OAUTH_COMPLETED: "github.oauth.completed",

  // Repository sync
  REPOS_SYNC_REQUESTED: "github.repository.sync.requested",
  REPOS_SYNCED: "github.repository.synced",
  REPO_SYNC_REQUESTED: "github.repository.single_sync.requested",
  REPO_UPDATED: "github.repository.updated",
  REPO_METADATA_REFRESH_REQUESTED: "github.repository.metadata_refresh.requested",

  // Token lifecycle
  TOKEN_REFRESHED: "github.token.refreshed",
  TOKEN_REFRESH_FAILED: "github.token.refresh_failed",

  // Activity
  ACTIVITY_RECEIVED: "github.activity.received",
} as const;

// ---------------------------------------------------------------------------
// Payload types
// ---------------------------------------------------------------------------

export type GithubAccountLinkedPayload = {
  userId: string;
  githubUserId: string;
  username: string;
};

export type GithubAccountUnlinkedPayload = {
  userId: string;
  githubUserId: string;
};

export type GithubOAuthCompletedPayload = {
  userId: string;
  githubUserId: string;
  username: string;
  isNewUser: boolean;
};

/** Full repo sync requested for a user. */
export type GithubReposSyncRequestedPayload = {
  userId: string;
  force?: boolean;
};

export type GithubReposSyncedPayload = {
  userId: string;
  syncedCount: number;
  removedCount: number;
};

/** Single repo sync requested. */
export type GithubRepoSyncRequestedPayload = {
  userId: string;
  repoId: string;
};

/** A single repo was updated (after sync). */
export type GithubRepoUpdatedPayload = {
  userId: string;
  repoId: string;
  githubRepoId: string;
};

/** Metadata refresh requested for a repo. */
export type GithubRepoMetadataRefreshRequestedPayload = {
  userId: string;
  repoId: string;
  fullName?: string;
};

export type GithubTokenRefreshedPayload = {
  userId: string;
  githubUserId: string;
};

export type GithubTokenRefreshFailedPayload = {
  userId: string;
  githubUserId: string;
  reason: string;
};

/** Raw activity received from GitHub (webhook, poll, etc.). */
export type GithubActivityReceivedPayload = {
  userId: string;
  projectId?: string;
  githubRepoId?: string;
  type: string;
  externalId: string;
  title?: string;
  description?: string;
  url?: string;
  actorUsername?: string;
  actorAvatarUrl?: string;
  occurredAt: string;
};
