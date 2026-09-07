import { prisma } from "../../../config/database.js";
import type { Prisma } from "@prisma/client";
import { encryptToken, decryptToken } from "../utils/token-encryption.js";

// ---------------------------------------------------------------------------
// Helpers – transparent encrypt / decrypt for token fields
// ---------------------------------------------------------------------------

function encryptAccountTokens(data: {
  accessToken?: string | null;
  refreshToken?: string | null;
}): {
  accessToken?: string | null;
  refreshToken?: string | null;
} {
  return {
    accessToken: data.accessToken != null ? encryptToken(data.accessToken) : data.accessToken,
    refreshToken: data.refreshToken != null ? encryptToken(data.refreshToken) : data.refreshToken,
  };
}

function decryptAccountTokens<T extends { accessToken: string | null; refreshToken: string | null }>(
  account: T,
): T {
  return {
    ...account,
    accessToken: account.accessToken ? decryptToken(account.accessToken) : null,
    refreshToken: account.refreshToken ? decryptToken(account.refreshToken) : null,
  };
}

// ---------------------------------------------------------------------------
// Repository
// ---------------------------------------------------------------------------

export const githubRepository = {
  // ----- Account -----------------------------------------------------------

  findAccountByUserId: async (userId: string) => {
    const account = await prisma.githubAccount.findUnique({ where: { userId } });
    return account ? decryptAccountTokens(account) : null;
  },

  findAccountByGithubUserId: async (githubUserId: string) => {
    const account = await prisma.githubAccount.findUnique({ where: { githubUserId } });
    return account ? decryptAccountTokens(account) : null;
  },

  createAccount: async (data: {
    userId: string;
    githubUserId: string;
    username: string;
    avatarUrl?: string;
    accessToken?: string;
    refreshToken?: string;
    tokenExpiresAt?: Date;
  }) => {
    const encrypted = encryptAccountTokens(data);
    const account = await prisma.githubAccount.create({
      data: {
        userId: data.userId,
        githubUserId: data.githubUserId,
        username: data.username,
        avatarUrl: data.avatarUrl,
        accessToken: encrypted.accessToken,
        refreshToken: encrypted.refreshToken,
        tokenExpiresAt: data.tokenExpiresAt,
      },
    });
    return decryptAccountTokens(account);
  },

  updateAccount: async (userId: string, data: {
    githubUserId?: string;
    username?: string;
    avatarUrl?: string;
    accessToken?: string;
    refreshToken?: string;
    tokenExpiresAt?: Date;
  }) => {
    const encrypted = encryptAccountTokens(data);
    const account = await prisma.githubAccount.update({
      where: { userId },
      data: {
        ...encrypted,
        githubUserId: data.githubUserId,
        username: data.username,
        avatarUrl: data.avatarUrl,
        tokenExpiresAt: data.tokenExpiresAt,
      },
    });
    return decryptAccountTokens(account);
  },

  upsertAccount: async (userId: string, data: {
    githubUserId: string;
    username: string;
    avatarUrl?: string;
    accessToken?: string;
    refreshToken?: string;
    tokenExpiresAt?: Date;
  }) => {
    const encrypted = encryptAccountTokens(data);
    const account = await prisma.githubAccount.upsert({
      where: { userId },
      create: {
        userId,
        githubUserId: data.githubUserId,
        username: data.username,
        avatarUrl: data.avatarUrl,
        accessToken: encrypted.accessToken,
        refreshToken: encrypted.refreshToken,
        tokenExpiresAt: data.tokenExpiresAt,
      },
      update: {
        githubUserId: data.githubUserId,
        username: data.username,
        avatarUrl: data.avatarUrl,
        accessToken: encrypted.accessToken,
        refreshToken: encrypted.refreshToken,
        tokenExpiresAt: data.tokenExpiresAt,
      },
    });
    return decryptAccountTokens(account);
  },

  deleteAccount: (userId: string) =>
    prisma.githubAccount.delete({ where: { userId } }),

  // ----- Repository --------------------------------------------------------

  findRepositoryByGithubRepoId: (githubRepoId: string) =>
    prisma.githubRepository.findUnique({ where: { githubRepoId } }),

  findRepositoriesByAccountId: (githubAccountId: string, args?: Prisma.GithubRepositoryFindManyArgs) =>
    prisma.githubRepository.findMany({
      where: { githubAccountId },
      ...args,
    }),

  findRepositoriesByUserId: (userId: string, args?: Prisma.GithubRepositoryFindManyArgs) =>
    prisma.githubRepository.findMany({
      where: { githubAccount: { userId } },
      ...args,
    }),

  /**
   * Find a single repository by ID, scoped to the user's GitHub account.
   * Returns null if the repo doesn't exist or doesn't belong to the user.
   */
  findRepoByIdForUser: async (repoId: string, userId: string) => {
    const repo = await prisma.githubRepository.findFirst({
      where: { id: repoId, githubAccount: { userId } },
      include: { project: { select: { id: true, name: true, slug: true } } },
    });
    return repo;
  },

  /**
   * Connect a GitHub repository to a project in a transaction.
   * Verifies repo ownership and project ownership atomically.
   */
  connectRepoToProject: async (repoId: string, projectId: string, userId: string) => {
    return prisma.$transaction(
      async (tx) => {
        // Verify repo belongs to the user's GitHub account
        const repo = await tx.githubRepository.findFirst({
          where: { id: repoId, githubAccount: { userId } },
          include: { project: { select: { id: true } } },
        });
        if (!repo) return { error: "REPO_NOT_FOUND" as const };

        // Verify project belongs to the user
        const project = await tx.project.findFirst({
          where: { id: projectId, userId },
          select: { id: true, githubRepoId: true },
        });
        if (!project) return { error: "PROJECT_NOT_FOUND" as const };

        // If repo is already connected to a different project
        if (repo.project && repo.project.id !== projectId) {
          return { error: "REPO_ALREADY_CONNECTED" as const, connectedProjectId: repo.project.id };
        }

        // If project already has a different repo connected
        if (project.githubRepoId && project.githubRepoId !== repoId) {
          return { error: "PROJECT_ALREADY_HAS_REPO" as const };
        }

        // Connect
        const updated = await tx.project.update({
          where: { id: projectId },
          data: { githubRepo: { connect: { id: repoId } } },
          include: {
            githubRepo: {
              select: {
                id: true,
                name: true,
                fullName: true,
                htmlUrl: true,
                primaryLanguage: true,
                stars: true,
                forks: true,
              },
            },
          },
        });

        return { project: updated };
      },
      { maxWait: 10000, timeout: 15000 },
    );
  },

  /**
   * Disconnect a GitHub repository from a project.
   * Only the project owner can disconnect.
   */
  disconnectProjectGithub: async (projectId: string, userId: string) => {
    return prisma.$transaction(
      async (tx) => {
        const project = await tx.project.findFirst({
          where: { id: projectId, userId },
          select: { id: true, githubRepoId: true },
        });
        if (!project) return { error: "PROJECT_NOT_FOUND" as const };
        if (!project.githubRepoId) return { error: "NO_GITHUB_REPO" as const };

        const updated = await tx.project.update({
          where: { id: projectId },
          data: { githubRepo: { disconnect: true } },
          select: { id: true, githubRepoId: true },
        });

        return { project: updated };
      },
      { maxWait: 10000, timeout: 15000 },
    );
  },

  createRepository: (data: Prisma.GithubRepositoryCreateInput) =>
    prisma.githubRepository.create({ data }),

  upsertRepository: (githubRepoId: string, data: Prisma.GithubRepositoryCreateInput) =>
    prisma.githubRepository.upsert({
      where: { githubRepoId },
      create: data,
      update: {
        name: data.name,
        fullName: data.fullName,
        description: data.description,
        url: data.url,
        htmlUrl: data.htmlUrl,
        primaryLanguage: data.primaryLanguage,
        stars: data.stars,
        forks: data.forks,
        openIssues: data.openIssues,
        isPrivate: data.isPrivate,
        isArchived: data.isArchived,
        isFork: data.isFork,
        pushedAt: data.pushedAt,
        lastSyncedAt: new Date(),
      },
    }),

  updateRepository: (id: string, data: Prisma.GithubRepositoryUpdateInput) =>
    prisma.githubRepository.update({ where: { id }, data }),

  deleteRepository: (id: string) =>
    prisma.githubRepository.delete({ where: { id } }),

  syncRepositories: async (
    githubAccountId: string,
    repositories: {
      githubRepoId: string;
      name: string;
      fullName: string;
      description?: string | null;
      url: string;
      htmlUrl: string;
      primaryLanguage?: string | null;
      stars?: number;
      forks?: number;
      openIssues?: number;
      isPrivate?: boolean;
      isArchived?: boolean;
      isFork?: boolean;
      pushedAt?: Date | null;
    }[],
  ) => {
    const existing = await prisma.githubRepository.findMany({
      where: { githubAccountId },
      select: { githubRepoId: true },
    });
    const incomingIds = new Set(repositories.map((r) => r.githubRepoId));

    const toDelete = existing.filter((r) => !incomingIds.has(r.githubRepoId));
    if (toDelete.length > 0) {
      await prisma.githubRepository.deleteMany({
        where: { githubRepoId: { in: toDelete.map((r) => r.githubRepoId) } },
      });
    }

    const results = await Promise.all(
      repositories.map((repo) =>
        prisma.githubRepository.upsert({
          where: { githubRepoId: repo.githubRepoId },
          create: {
            githubAccountId,
            githubRepoId: repo.githubRepoId,
            name: repo.name,
            fullName: repo.fullName,
            description: repo.description,
            url: repo.url,
            htmlUrl: repo.htmlUrl,
            primaryLanguage: repo.primaryLanguage,
            stars: repo.stars ?? 0,
            forks: repo.forks ?? 0,
            openIssues: repo.openIssues ?? 0,
            isPrivate: repo.isPrivate ?? false,
            isArchived: repo.isArchived ?? false,
            isFork: repo.isFork ?? false,
            pushedAt: repo.pushedAt,
          },
          update: {
            name: repo.name,
            fullName: repo.fullName,
            description: repo.description,
            url: repo.url,
            htmlUrl: repo.htmlUrl,
            primaryLanguage: repo.primaryLanguage,
            stars: repo.stars ?? 0,
            forks: repo.forks ?? 0,
            openIssues: repo.openIssues ?? 0,
            isPrivate: repo.isPrivate ?? false,
            isArchived: repo.isArchived ?? false,
            isFork: repo.isFork ?? false,
            pushedAt: repo.pushedAt,
            lastSyncedAt: new Date(),
          },
        }),
      ),
    );

    return { results, deletedCount: toDelete.length };
  },

  countByAccount: (githubAccountId: string) =>
    prisma.githubRepository.count({ where: { githubAccountId } }),
};

export default githubRepository;
