// ---------------------------------------------------------------------------
// GitHub OAuth – Type Definitions
// ---------------------------------------------------------------------------

/** Raw GitHub user object returned by GET /user */
export type GithubOAuthUser = {
  id: number;
  login: string;
  avatar_url: string;
  name: string | null;
  email: string | null;
  bio: string | null;
};

/** Raw token response from GitHub OAuth token exchange */
export type GithubTokenResponse = {
  access_token: string;
  scope: string;
  token_type: string;
  refresh_token?: string;
  expires_in?: number;
};

// ---------------------------------------------------------------------------
// GitHub Account
// ---------------------------------------------------------------------------

export type GithubAccountDto = {
  id: string;
  userId: string;
  githubUserId: string;
  username: string;
  avatarUrl: string | null;
  connectedAt: Date;
  updatedAt: Date;
  hasAccessToken: boolean;
};

export type GithubAccountWithTokens = GithubAccountDto & {
  accessToken: string | null;
  refreshToken: string | null;
  tokenExpiresAt: Date | null;
};

// ---------------------------------------------------------------------------
// GitHub Repository
// ---------------------------------------------------------------------------

export type GithubRepositoryDto = {
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
  projectId: string | null;
};

// ---------------------------------------------------------------------------
// OAuth State
// ---------------------------------------------------------------------------

export type OAuthState = {
  /** Random nonce for uniqueness */
  nonce: string;
  /** Unix-ms timestamp of state generation */
  timestamp: number;
  /** Optional redirect path after successful callback */
  redirect?: string;
  /** OAuth flow mode: 'login' (default) or 'link' (link to existing account) */
  mode?: 'login' | 'link';
};

// ---------------------------------------------------------------------------
// Encrypted Token Envelope
// ---------------------------------------------------------------------------

export type EncryptedTokenEnvelope = {
  iv: string;
  tag: string;
  data: string;
};

// ---------------------------------------------------------------------------
// Service Input Types
// ---------------------------------------------------------------------------

export type OAuthInitInput = {
  redirect?: string;
  userId?: string;
};

export type OAuthCallbackInput = {
  code: string;
  state: string;
};

export type LinkAccountInput = {
  userId: string;
  code: string;
};

export type SyncRepositoriesInput = {
  userId: string;
};
