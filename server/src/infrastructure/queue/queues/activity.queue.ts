import { queues } from "../queue.js";
import { createLogger } from "../../../shared/logger.js";

const log = createLogger("activity-queue");

// ---------------------------------------------------------------------------
// Job data types
// ---------------------------------------------------------------------------

export type ActivityJobData = {
  /** The local user ID. */
  userId: string;
  /** Activity type — maps to Prisma ActivityType enum. */
  type: string;
  /** Optional project to associate the activity with. */
  projectId?: string;
  /** Optional GitHub repository to associate the activity with. */
  githubRepoId?: string;
  /** Freeform metadata (commit message, PR title, etc.). */
  metadata?: Record<string, unknown>;
  /** ISO-8601 timestamp of when the activity actually occurred. */
  occurredAt?: string;
};

// ---------------------------------------------------------------------------
// Queue handle
// ---------------------------------------------------------------------------

export const activityQueue = queues.activity;

// ---------------------------------------------------------------------------
// Enqueue helpers
// ---------------------------------------------------------------------------

/**
 * Enqueue activity creation.
 * Deduplicates by (projectId, type, externalId) when `metadata.externalId`
 * is provided — prevents duplicate activities from repeated webhook deliveries.
 */
export const enqueueActivity = async (data: ActivityJobData) => {
  const deduplicationId =
    data.metadata && typeof data.metadata === "object" && "externalId" in data.metadata
      ? `activity:${data.projectId ?? "none"}:${data.type}:${(data.metadata as any).externalId}`
      : undefined;

  const job = await activityQueue.add("create-activity", data, {
    deduplication: deduplicationId ? { id: deduplicationId } : undefined,
  });
  log.info({ jobId: job.id, type: data.type, userId: data.userId }, "Enqueued activity");
  return job;
};

export default activityQueue;
