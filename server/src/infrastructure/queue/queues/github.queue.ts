import { queues } from "../queue.js";
import { createLogger } from "../../../shared/logger.js";

const log = createLogger("github-queue");

// ---------------------------------------------------------------------------
// Job data types
// ---------------------------------------------------------------------------

export type GithubSyncAllReposJobData = {
  /** The local user ID whose repos should be synced. */
  userId: string;
  /** When true, force a full re-sync even if one was recently completed. */
  force?: boolean;
};

export type GithubSyncSingleRepoJobData = {
  /** The local user ID. */
  userId: string;
  /** The GithubRepository.id (internal PK). */
  repoId: string;
};

export type GithubRefreshMetadataJobData = {
  /** The local user ID. */
  userId: string;
  /** The GithubRepository.id (internal PK). */
  repoId: string;
  /** Optional repo full name for display purposes. */
  fullName?: string;
};

// ---------------------------------------------------------------------------
// Queue handle
// ---------------------------------------------------------------------------

export const githubQueue = queues.github;

// ---------------------------------------------------------------------------
// Enqueue helpers
// ---------------------------------------------------------------------------

/**
 * Enqueue a full repo-sync for a user.
 * Deduplicates per-user: if a sync is already pending for this user the
 * existing job is returned (unless `force` is set).
 */
export const enqueueGithubSyncAllRepos = async (
  data: GithubSyncAllReposJobData,
  opts?: { delay?: number },
) => {
  const jobId = data.force ? undefined : `github-sync-all:${data.userId}`;
  const job = await githubQueue.add("sync-all-repos", data, {
    jobId,
    delay: opts?.delay,
    deduplication: { id: `sync-all:${data.userId}` },
  });
  log.info({ jobId: job.id, userId: data.userId, force: data.force }, "Enqueued sync-all-repos");
  return job;
};

/**
 * Enqueue a single-repo sync.
 */
export const enqueueGithubSyncSingleRepo = async (
  data: GithubSyncSingleRepoJobData,
) => {
  const job = await githubQueue.add("sync-single-repo", data, {
    deduplication: { id: `sync-repo:${data.repoId}` },
  });
  log.info({ jobId: job.id, repoId: data.repoId }, "Enqueued sync-single-repo");
  return job;
};

/**
 * Enqueue a metadata refresh for a single repo.
 */
export const enqueueGithubRefreshMetadata = async (
  data: GithubRefreshMetadataJobData,
) => {
  const job = await githubQueue.add("refresh-metadata", data, {
    deduplication: { id: `refresh-meta:${data.repoId}` },
  });
  log.info({ jobId: job.id, repoId: data.repoId }, "Enqueued refresh-metadata");
  return job;
};

export default githubQueue;
