import { queues } from "../queue.js";
import { createLogger } from "../../../shared/logger.js";

const log = createLogger("repo-metadata-queue");

// ---------------------------------------------------------------------------
// Job data types
// ---------------------------------------------------------------------------

export type RepoMetadataRefreshJobData = {
  /** The local user ID. */
  userId: string;
  /** The GithubRepository.id (internal PK). */
  repoId: string;
  /** The GitHub API repo full_name (e.g. "octocat/hello-world"). */
  fullName?: string;
};

export type RepoMetadataBulkRefreshJobData = {
  /** The local user ID. */
  userId: string;
  /** List of repository IDs to refresh. */
  repoIds: string[];
};

// ---------------------------------------------------------------------------
// Queue handle
// ---------------------------------------------------------------------------

export const repoMetadataQueue = queues.repoMetadata;

// ---------------------------------------------------------------------------
// Enqueue helpers
// ---------------------------------------------------------------------------

/**
 * Enqueue a metadata refresh for a single repository.
 * Deduplicates by repoId to avoid redundant refreshes.
 */
export const enqueueRepoMetadataRefresh = async (data: RepoMetadataRefreshJobData) => {
  const job = await repoMetadataQueue.add("refresh-metadata", data, {
    deduplication: { id: `repo-meta:${data.repoId}` },
  });
  log.info({ jobId: job.id, repoId: data.repoId }, "Enqueued repo metadata refresh");
  return job;
};

/**
 * Enqueue a bulk metadata refresh for multiple repositories.
 * Useful after a full sync to update metadata for all repos.
 */
export const enqueueBulkRepoMetadataRefresh = async (data: RepoMetadataBulkRefreshJobData) => {
  const jobs = await repoMetadataQueue.addBulk(
    data.repoIds.map((repoId) => ({
      name: "refresh-metadata",
      data: { userId: data.userId, repoId },
      opts: {
        deduplication: { id: `repo-meta:${repoId}` },
      },
    })),
  );
  log.info({ count: jobs.length, userId: data.userId }, "Enqueued bulk repo metadata refresh");
  return jobs;
};

export default repoMetadataQueue;
