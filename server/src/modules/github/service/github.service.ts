import {
  BadRequestError,
  ConflictError,
  NotFoundError,
} from "../../../shared/errors/index.js";
import { emitEvent } from "../../../shared/events/eventBus.js";
import { GithubEvents } from "../events/github.events.js";
import { githubRepository } from "../repository/github.repository.js";
import { githubClient } from "../../../infrastructure/github/github.client.js";
import { generateOAuthState, validateOAuthState } from "../utils/csrf.js";
import { toGithubAccountDto, toGithubRepositoryDto } from "../dto/github.dto.js";
import type { SyncResultDto } from "../dto/github.dto.js";
import type { GithubOAuthUser } from "../types/github.types.js";
import { authRepository } from "../../auth/repository/auth.repository.js";
import { normalizeGithubRepos } from "../../../infrastructure/github/normalizer.js";
import {
  GithubAuthError,
  GithubRateLimitError,
  GithubApiError,
} from "../../../infrastructure/github/github-errors.js";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

async function fetchGithubUser(accessToken: string): Promise<GithubOAuthUser> {
  try {
    return await githubClient.getAuthenticatedUser(accessToken);
  } catch (err: any) {
    if (err instanceof GithubAuthError) {
      throw new BadRequestError("GitHub access token has been revoked or is invalid – please re-link your GitHub account");
    }
    if (err instanceof GithubRateLimitError) {
      throw new BadRequestError("GitHub API rate limit exceeded – try again later");
    }
    if (err instanceof GithubApiError) {
      throw new BadRequestError(`GitHub API error: ${err.message}`);
    }
    throw new BadRequestError("Failed to fetch GitHub user profile");
  }
}

async function resolveOrCreateUser(ghUser: GithubOAuthUser) {
  // 1. Existing GitHub account → return that user
  const existingAccount = await githubRepository.findAccountByGithubUserId(String(ghUser.id));
  if (existingAccount) {
    const user = await authRepository.findById(existingAccount.userId);
    if (user) return { user, isNewUser: false };
  }

  // 2. Matching email → link to existing user
  if (ghUser.email) {
    const user = await authRepository.findByEmail(ghUser.email);
    if (user) return { user, isNewUser: false };
  }

  // 3. Create new user
  const username = ghUser.login;
  let uniqueUsername = username;
  let counter = 1;
  while (await authRepository.findByUsername(uniqueUsername)) {
    uniqueUsername = `${username}${counter++}`;
  }

  const user = await authRepository.create({
    email: ghUser.email ?? `${ghUser.login}@github.local`,
    username: uniqueUsername,
    name: ghUser.name ?? undefined,
    avatarUrl: ghUser.avatar_url,
  });

  return { user, isNewUser: true };
}

// ---------------------------------------------------------------------------
// Service
// ---------------------------------------------------------------------------

export const githubService = {
  // ----- OAuth initiation --------------------------------------------------

  initiateOAuth(redirect?: string, mode?: 'login' | 'link') {
    const state = generateOAuthState(redirect, mode);
    const url =
      `https://github.com/login/oauth/authorize` +
      `?client_id=${process.env.GITHUB_CLIENT_ID ?? ""}` +
      `&scope=read:user user:email repo` +
      `&state=${encodeURIComponent(state)}`;
    return { url, state };
  },

  // ----- OAuth callback (unauthenticated) -----------------------------------
  // Validates CSRF state, then delegates to processOAuthCode.

  async handleOAuthCallback(code: string, state: string) {
    validateOAuthState(state);
    return this.processOAuthCode(code);
  },

  // ----- Core OAuth logic (no state validation) ----------------------------
  // Used by both the github controller (with state) and the auth controller
  // (without state — the auth callback URL is server-controlled).

  async processOAuthCode(code: string) {
    // 1. Exchange code for token
    const tokenRes = await githubClient.exchangeCodeForToken(code);
    const accessToken = tokenRes.access_token;
    if (!accessToken) {
      throw new BadRequestError("Failed to obtain GitHub access token");
    }

    // 2. Fetch GitHub user profile
    const ghUser = await fetchGithubUser(accessToken);

    // 3. Resolve or create local user
    const { user, isNewUser } = await resolveOrCreateUser(ghUser);

    // 4. Upsert GitHub account
    await githubRepository.upsertAccount(user.id, {
      githubUserId: String(ghUser.id),
      username: ghUser.login,
      avatarUrl: ghUser.avatar_url,
      accessToken,
      refreshToken: tokenRes.refresh_token ?? undefined,
      tokenExpiresAt: tokenRes.expires_in
        ? new Date(Date.now() + tokenRes.expires_in * 1000)
        : undefined,
    });

    emitEvent(GithubEvents.OAUTH_COMPLETED, {
      userId: user.id,
      githubUserId: String(ghUser.id),
      username: ghUser.login,
      isNewUser,
    });

    return { user: toGithubAccountDto(await githubRepository.findAccountByUserId(user.id) as any), isNewUser };
  },

  // ----- Account linking (authenticated) ------------------------------------

  async linkAccount(userId: string, code: string) {
    // 1. Check if user already has a linked account
    const existing = await githubRepository.findAccountByUserId(userId);

    // 2. Exchange code for token
    const tokenRes = await githubClient.exchangeCodeForToken(code);
    const accessToken = tokenRes.access_token;
    if (!accessToken) {
      throw new BadRequestError("Failed to obtain GitHub access token");
    }

    // 3. Fetch GitHub user
    const ghUser = await fetchGithubUser(accessToken);

    // 4. Ensure this GitHub account isn't linked to another user
    const existingByGithub = await githubRepository.findAccountByGithubUserId(String(ghUser.id));
    if (existingByGithub && existingByGithub.userId !== userId) {
      throw new ConflictError("This GitHub account is already linked to another user");
    }

    // 5. Create or update account link
    let account;
    if (existing) {
      // Update existing account (e.g. from Clerk sync with no token)
      account = await githubRepository.updateAccount(userId, {
        githubUserId: String(ghUser.id),
        username: ghUser.login,
        avatarUrl: ghUser.avatar_url,
        accessToken,
        refreshToken: tokenRes.refresh_token ?? undefined,
        tokenExpiresAt: tokenRes.expires_in
          ? new Date(Date.now() + tokenRes.expires_in * 1000)
          : undefined,
      });
    } else {
      account = await githubRepository.createAccount({
        userId,
        githubUserId: String(ghUser.id),
        username: ghUser.login,
        avatarUrl: ghUser.avatar_url,
        accessToken,
        refreshToken: tokenRes.refresh_token ?? undefined,
        tokenExpiresAt: tokenRes.expires_in
          ? new Date(Date.now() + tokenRes.expires_in * 1000)
          : undefined,
      });
    }

    emitEvent(GithubEvents.ACCOUNT_LINKED, {
      userId,
      githubUserId: String(ghUser.id),
      username: ghUser.login,
    });

    return toGithubAccountDto(account);
  },

  // ----- Account unlinking -------------------------------------------------

  async unlinkAccount(userId: string) {
    const account = await githubRepository.findAccountByUserId(userId);
    if (!account) {
      throw new NotFoundError("No GitHub account linked");
    }

    await githubRepository.deleteAccount(userId);

    emitEvent(GithubEvents.ACCOUNT_UNLINKED, {
      userId,
      githubUserId: account.githubUserId,
    });

    return { message: "GitHub account unlinked successfully" };
  },

  // ----- Get linked account ------------------------------------------------

  async getLinkedAccount(userId: string) {
    const account = await githubRepository.findAccountByUserId(userId);
    if (!account) {
      throw new NotFoundError("No GitHub account linked");
    }
    return toGithubAccountDto(account);
  },

  // ----- Repository sync ---------------------------------------------------

  async syncRepositories(userId: string): Promise<SyncResultDto> {
    const account = await githubRepository.findAccountByUserId(userId);
    if (!account) {
      throw new NotFoundError("No GitHub account linked");
    }

    let accessToken = account.accessToken;
    if (!accessToken) {
      throw new BadRequestError("No GitHub access token available – please re-link your GitHub account");
    }

    // Check token expiry and attempt refresh if needed
    if (account.tokenExpiresAt && new Date() > account.tokenExpiresAt) {
      if (account.refreshToken) {
        accessToken = await this.refreshAccessToken(userId, account.refreshToken);
      } else {
        throw new BadRequestError("GitHub access token expired – please re-link your GitHub account");
      }
    }

    // Verify token is still valid with a test API call
    try {
      await githubClient.getAuthenticatedUser(accessToken!);
    } catch (err: any) {
      if (err instanceof GithubAuthError) {
        // Token revoked – try refresh
        if (account.refreshToken) {
          accessToken = await this.refreshAccessToken(userId, account.refreshToken);
        } else {
          throw new BadRequestError("GitHub access token has been revoked – please re-link your GitHub account");
        }
      } else {
        throw err;
      }
    }

    // Fetch ALL repos from GitHub (handles pagination automatically)
    let rawRepos: any[];
    try {
      rawRepos = await githubClient.getAllUserRepos(accessToken!);
    } catch (err: any) {
      if (err instanceof GithubAuthError) {
        throw new BadRequestError("GitHub access token is no longer valid – please re-link your GitHub account");
      }
      if (err instanceof GithubRateLimitError) {
        throw new BadRequestError("GitHub API rate limit exceeded – please try again later");
      }
      throw new BadRequestError("Failed to fetch repositories from GitHub");
    }

    // Normalize raw GitHub API data into DB-ready records
    const repos = normalizeGithubRepos(rawRepos);

    const { results, deletedCount } = await githubRepository.syncRepositories(
      account.id,
      repos,
    );

    emitEvent(GithubEvents.REPOS_SYNCED, {
      userId,
      syncedCount: results.length,
      removedCount: deletedCount,
    });

    return {
      syncedCount: results.length,
      removedCount: deletedCount,
      syncedAt: new Date(),
    };
  },

  // ----- Token refresh -----------------------------------------------------

  async refreshAccessToken(userId: string, refreshToken: string): Promise<string> {
    try {
      const { data } = await (
        await import("axios")
      ).default.post(
        "https://github.com/login/oauth/access_token",
        {
          client_id: process.env.GITHUB_CLIENT_ID,
          client_secret: process.env.GITHUB_CLIENT_SECRET,
          grant_type: "refresh_token",
          refresh_token: refreshToken,
        },
        { headers: { Accept: "application/json" } },
      );

      if (!data.access_token) {
        throw new Error("No access_token in refresh response");
      }

      await githubRepository.updateAccount(userId, {
        accessToken: data.access_token,
        refreshToken: data.refresh_token ?? refreshToken,
        tokenExpiresAt: data.expires_in
          ? new Date(Date.now() + data.expires_in * 1000)
          : undefined,
      });

      emitEvent(GithubEvents.TOKEN_REFRESHED, {
        userId,
        githubUserId: "",
      });

      return data.access_token;
    } catch (err: any) {
      emitEvent(GithubEvents.TOKEN_REFRESH_FAILED, {
        userId,
        githubUserId: "",
        reason: err?.message ?? "Unknown error",
      });
      throw new BadRequestError("Failed to refresh GitHub token – please re-link your GitHub account");
    }
  },

  // ----- Repositories (read) -----------------------------------------------

  async getRepositories(userId: string, projectId?: string) {
    const account = await githubRepository.findAccountByUserId(userId);
    if (!account) {
      throw new NotFoundError("No GitHub account linked");
    }

    const repos = await githubRepository.findRepositoriesByAccountId(account.id, {
      include: { project: { select: { id: true, name: true, slug: true } } },
      orderBy: { updatedAt: "desc" },
    });

    const result = (repos as any[]).map((r) => {
      const dto = toGithubRepositoryDto(r);
      // If filtering by projectId, only return repos connected to that project
      if (projectId) {
        return r.project?.id === projectId ? dto : null;
      }
      return dto;
    });

    return result.filter((r) => r !== null);
  },

  // ----- Single repository (read) ------------------------------------------

  async getRepository(userId: string, repoId: string) {
    const account = await githubRepository.findAccountByUserId(userId);
    if (!account) {
      throw new NotFoundError("No GitHub account linked");
    }

    const repo = await githubRepository.findRepoByIdForUser(repoId, userId);
    if (!repo) {
      throw new NotFoundError("Repository not found");
    }

    return toGithubRepositoryDto(repo as any);
  },

  // ----- Connect repository to project -------------------------------------

  async connectRepo(userId: string, repoId: string, projectId: string) {
    const result = await githubRepository.connectRepoToProject(repoId, projectId, userId);

    if ("error" in result) {
      switch (result.error) {
        case "REPO_NOT_FOUND":
          throw new NotFoundError("Repository not found or not linked to your GitHub account");
        case "PROJECT_NOT_FOUND":
          throw new NotFoundError("Project not found");
        case "REPO_ALREADY_CONNECTED":
          throw new ConflictError(
            `This repository is already connected to another project`,
          );
        case "PROJECT_ALREADY_HAS_REPO":
          throw new ConflictError(
            "This project is already connected to a different repository. Disconnect it first.",
          );
      }
    }

    return result.project;
  },

  // ----- Disconnect repository from project --------------------------------

  async disconnectRepo(userId: string, projectId: string) {
    const result = await githubRepository.disconnectProjectGithub(projectId, userId);

    if ("error" in result) {
      switch (result.error) {
        case "PROJECT_NOT_FOUND":
          throw new NotFoundError("Project not found");
        case "NO_GITHUB_REPO":
          throw new BadRequestError("This project has no GitHub repository connected");
      }
    }

    return { message: "GitHub repository disconnected successfully" };
  },

  // ----- Account helpers ---------------------------------------------------

  isAccountLinked: (userId: string) =>
    githubRepository.findAccountByUserId(userId).then((a) => a !== null),
};

export default githubService;
