import { Worker, type Job } from "bullmq";
import { redis } from "../../config/redis.js";
import { QUEUE_NAMES } from "../../shared/constants/index.js";
import { createLogger } from "../../shared/logger.js";
import type { RepoMetadataRefreshJobData } from "../queue/queues/repo-metadata.queue.js";

const log = createLogger("repo-metadata-worker");

// ---------------------------------------------------------------------------
// Processor — delegates to githubClient + repository
// ---------------------------------------------------------------------------

const processor = async (job: Job<RepoMetadataRefreshJobData>) => {
  const ctx = { jobId: job.id, jobName: job.name, attempt: job.attemptsMade + 1 };
  const { userId, repoId, fullName } = job.data;

  log.info({ ...ctx, userId, repoId, fullName }, "Refreshing repo metadata");

  // Lazy-import to avoid circular dependency issues at module load time
  const { githubRepository } = await import("../../modules/github/repository/github.repository.js");
  const { githubClient } = await import("../../infrastructure/github/github.client.js");

  // Verify the repo belongs to this user
  const repo = await githubRepository.findRepoByIdForUser(repoId, userId);
  if (!repo) {
    log.warn({ ...ctx, repoId }, "Repo not found or not owned by user — skipping");
    return { skipped: true, reason: "not_found" };
  }

  const account = await githubRepository.findAccountByUserId(userId);
  if (!account?.accessToken) {
    log.warn({ ...ctx, userId }, "No access token — skipping metadata refresh");
    return { skipped: true, reason: "no_token" };
  }

  const targetFullName = fullName ?? repo.fullName;

  try {
    const { data: rawRepo } = await githubClient.getRepo(targetFullName, account.accessToken);

    // Stale data protection: only update if the incoming data is newer
    // than what we already have. Prevents a slow/retried refresh from
    // overwriting a more recent sync.
    const incomingPushedAt = rawRepo.pushed_at ? new Date(rawRepo.pushed_at) : null;
    if (incomingPushedAt && repo.pushedAt && incomingPushedAt < repo.pushedAt) {
      log.info({ ...ctx, repoId }, "Skipping update — incoming data is older than current");
      return { skipped: true, reason: "stale_data" };
    }

    await githubRepository.updateRepository(repoId, {
      stars: rawRepo.stargazers_count ?? 0,
      forks: rawRepo.forks_count ?? 0,
      openIssues: rawRepo.open_issues_count ?? 0,
      primaryLanguage: rawRepo.language,
      description: rawRepo.description,
      isArchived: rawRepo.archived ?? false,
      pushedAt: incomingPushedAt,
      lastSyncedAt: new Date(),
    });

    log.info({ ...ctx, repoId, stars: rawRepo.stargazers_count }, "Metadata refresh complete");
    return { repoId, refreshedAt: new Date().toISOString() };
  } catch (err: any) {
    // 404 = repo was deleted/renamed on GitHub
    if (err?.status === 404) {
      log.warn({ ...ctx, repoId, fullName: targetFullName }, "Repo not found on GitHub — marking as archived");
      await githubRepository.updateRepository(repoId, {
        isArchived: true,
        lastSyncedAt: new Date(),
      });
      return { repoId, archived: true };
    }
    throw err; // retry on transient errors
  }
};

// ---------------------------------------------------------------------------
// Worker
// ---------------------------------------------------------------------------

export const repoMetadataWorker = new Worker(QUEUE_NAMES.REPO_METADATA, processor, {
  connection: redis,
  concurrency: 15,
  limiter: { max: 30, duration: 1_000 },
});

// ---------------------------------------------------------------------------
// Event handlers
// ---------------------------------------------------------------------------

repoMetadataWorker.on("completed", (job) => {
  log.info({ jobId: job.id, name: job.name }, "Job completed");
});

repoMetadataWorker.on("failed", (job, err) => {
  log.error(
    { jobId: job?.id, name: job?.name, attempt: job?.attemptsMade, err },
    "Job failed",
  );
});

repoMetadataWorker.on("error", (err) => {
  log.error({ err }, "Worker error");
});

export default repoMetadataWorker;
