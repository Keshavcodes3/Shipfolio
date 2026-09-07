import { Worker, type Job } from "bullmq";
import { redis } from "../../config/redis.js";
import { QUEUE_NAMES } from "../../shared/constants/index.js";
import { createLogger } from "../../shared/logger.js";
import type {
  GithubSyncAllReposJobData,
  GithubSyncSingleRepoJobData,
  GithubRefreshMetadataJobData,
} from "../queue/queues/github.queue.js";

const log = createLogger("github-worker");

// ---------------------------------------------------------------------------
// Idempotency helper
// ---------------------------------------------------------------------------

/**
 * Minimum interval (ms) between syncs for the same user.
 * Prevents thundering-herd when multiple events fire in quick succession.
 */
const SYNC_COOLDOWN_MS = 60_000; // 1 minute
const MAX_MAP_ENTRIES = 10_000;

const lastSyncedAt = new Map<string, number>();

const wasRecentlySynced = (userId: string): boolean => {
  const last = lastSyncedAt.get(userId);
  if (!last) return false;
  if (Date.now() - last >= SYNC_COOLDOWN_MS) {
    lastSyncedAt.delete(userId);
    return false;
  }
  return true;
};

const markSynced = (userId: string): void => {
  // Evict oldest entries when map grows too large
  if (lastSyncedAt.size >= MAX_MAP_ENTRIES) {
    const now = Date.now();
    for (const [key, ts] of lastSyncedAt) {
      if (now - ts >= SYNC_COOLDOWN_MS) lastSyncedAt.delete(key);
      if (lastSyncedAt.size < MAX_MAP_ENTRIES / 2) break;
    }
  }
  lastSyncedAt.set(userId, Date.now());
};

// ---------------------------------------------------------------------------
// Processor — thin, delegates to githubService
// ---------------------------------------------------------------------------

const processor = async (job: Job) => {
  const ctx = { jobId: job.id, jobName: job.name, attempt: job.attemptsMade + 1 };

  // Lazy-import service so the worker module can load even if the service
  // graph has circular dependencies at import time.
  const { githubService } = await import("../../modules/github/service/github.service.js");

  switch (job.name) {
    // -------------------------------------------------------------------
    // sync-all-repos: full user repo sync
    // -------------------------------------------------------------------
    case "sync-all-repos": {
      const { userId, force } = job.data as GithubSyncAllReposJobData;

      if (!force && wasRecentlySynced(userId)) {
        log.info({ ...ctx, userId }, "Skipping — user synced recently");
        return { skipped: true, reason: "cooldown" };
      }

      log.info({ ...ctx, userId }, "Starting full repo sync");
      const result = await githubService.syncRepositories(userId);
      markSynced(userId);

      log.info({ ...ctx, userId, synced: result.syncedCount, removed: result.removedCount }, "Sync complete");
      return result;
    }

    // -------------------------------------------------------------------
    // sync-single-repo: refresh one repo from GitHub API
    // -------------------------------------------------------------------
    case "sync-single-repo": {
      const { userId, repoId } = job.data as GithubSyncSingleRepoJobData;

      log.info({ ...ctx, userId, repoId }, "Starting single repo sync");

      // Use getRepository to verify access, then sync to pull latest data
      const repo = await githubService.getRepository(userId, repoId);
      log.debug({ ...ctx, repoId, fullName: repo.fullName }, "Repo access verified");

      // The actual sync happens via the full sync; for single repo we
      // re-fetch and update just this repo's metadata.
      const { githubRepository } = await import("../../modules/github/repository/github.repository.js");
      const { githubClient } = await import("../../infrastructure/github/github.client.js");

      const account = await githubRepository.findAccountByUserId(userId);
      if (!account?.accessToken) {
        log.warn({ ...ctx, userId }, "No access token — skipping single repo sync");
        return { skipped: true, reason: "no_token" };
      }

      const { data: rawRepo } = await githubClient.getRepo(repo.fullName, account.accessToken);
      await githubRepository.upsertRepository(repo.githubRepoId, {
        githubAccount: { connect: { id: account.id } },
        githubRepoId: repo.githubRepoId,
        name: rawRepo.name,
        fullName: rawRepo.full_name,
        description: rawRepo.description,
        url: rawRepo.html_url,
        htmlUrl: rawRepo.html_url,
        primaryLanguage: rawRepo.language,
        stars: rawRepo.stargazers_count ?? 0,
        forks: rawRepo.forks_count ?? 0,
        openIssues: rawRepo.open_issues_count ?? 0,
        isPrivate: rawRepo.private ?? false,
        isArchived: rawRepo.archived ?? false,
        isFork: rawRepo.fork ?? false,
        pushedAt: rawRepo.pushed_at ? new Date(rawRepo.pushed_at) : null,
      });

      log.info({ ...ctx, repoId }, "Single repo sync complete");
      return { repoId, syncedAt: new Date().toISOString() };
    }

    // -------------------------------------------------------------------
    // refresh-metadata: update stars, forks, etc. from GitHub API
    // -------------------------------------------------------------------
    case "refresh-metadata": {
      const { userId, repoId } = job.data as GithubRefreshMetadataJobData;

      log.info({ ...ctx, userId, repoId }, "Starting metadata refresh");

      const repo = await githubService.getRepository(userId, repoId);
      const { githubRepository } = await import("../../modules/github/repository/github.repository.js");
      const { githubClient } = await import("../../infrastructure/github/github.client.js");

      const account = await githubRepository.findAccountByUserId(userId);
      if (!account?.accessToken) {
        log.warn({ ...ctx, userId }, "No access token — skipping metadata refresh");
        return { skipped: true, reason: "no_token" };
      }

      try {
        const { data: rawRepo } = await githubClient.getRepo(repo.fullName, account.accessToken);
        await githubRepository.updateRepository(repoId, {
          stars: rawRepo.stargazers_count ?? 0,
          forks: rawRepo.forks_count ?? 0,
          openIssues: rawRepo.open_issues_count ?? 0,
          primaryLanguage: rawRepo.language,
          description: rawRepo.description,
          isArchived: rawRepo.archived ?? false,
          pushedAt: rawRepo.pushed_at ? new Date(rawRepo.pushed_at) : null,
          lastSyncedAt: new Date(),
        });

        log.info({ ...ctx, repoId }, "Metadata refresh complete");
        return { repoId, refreshedAt: new Date().toISOString() };
      } catch (err: any) {
        // 404 = repo was deleted/renamed on GitHub — not a retryable error
        if (err?.status === 404) {
          log.warn({ ...ctx, repoId }, "Repo not found on GitHub — marking as archived");
          await githubRepository.updateRepository(repoId, { isArchived: true, lastSyncedAt: new Date() });
          return { repoId, archived: true };
        }
        throw err; // retry on transient errors
      }
    }

    default:
      throw new Error(`Unknown job name: ${job.name}`);
  }
};

// ---------------------------------------------------------------------------
// Worker
// ---------------------------------------------------------------------------

export const githubWorker = new Worker(QUEUE_NAMES.GITHUB, processor, {
  connection: redis,
  concurrency: 5,
  limiter: { max: 10, duration: 1_000 },
});

// ---------------------------------------------------------------------------
// Event handlers — structured logging
// ---------------------------------------------------------------------------

githubWorker.on("completed", (job) => {
  log.info({ jobId: job.id, name: job.name, result: job.returnvalue }, "Job completed");
});

githubWorker.on("failed", (job, err) => {
  log.error(
    { jobId: job?.id, name: job?.name, attempt: job?.attemptsMade, err },
    "Job failed",
  );
});

githubWorker.on("error", (err) => {
  log.error({ err }, "Worker error");
});

export default githubWorker;
