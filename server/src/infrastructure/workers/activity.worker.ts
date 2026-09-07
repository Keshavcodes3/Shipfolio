import { Worker, type Job } from "bullmq";
import { redis } from "../../config/redis.js";
import { QUEUE_NAMES } from "../../shared/constants/index.js";
import { createLogger } from "../../shared/logger.js";
import type { ActivityJobData } from "../queue/queues/activity.queue.js";

const log = createLogger("activity-worker");

// ---------------------------------------------------------------------------
// Processor — thin, delegates to activityService
// ---------------------------------------------------------------------------

const processor = async (job: Job<ActivityJobData>) => {
  const ctx = { jobId: job.id, jobName: job.name, attempt: job.attemptsMade + 1 };
  const { userId, type, projectId, githubRepoId, metadata, occurredAt } = job.data;

  log.info({ ...ctx, userId, type, projectId }, "Processing activity");

  // Lazy-import to avoid circular dependency issues at module load time
  const { activityService } = await import("../../modules/activity/service/activity.service.js");

  const activity = await activityService.create({
    projectId: projectId ?? undefined,
    githubRepoId: githubRepoId ?? undefined,
    type,
    externalId: metadata != null && typeof metadata === "object" && "externalId" in metadata
      ? (metadata as any).externalId
      : undefined,
    title: metadata != null && typeof metadata === "object" && "title" in metadata
      ? (metadata as any).title
      : undefined,
    description: metadata != null && typeof metadata === "object" && "description" in metadata
      ? (metadata as any).description
      : undefined,
    url: metadata != null && typeof metadata === "object" && "url" in metadata
      ? (metadata as any).url
      : undefined,
    actorUsername: metadata != null && typeof metadata === "object" && "actorUsername" in metadata
      ? (metadata as any).actorUsername
      : undefined,
    actorAvatarUrl: metadata != null && typeof metadata === "object" && "actorAvatarUrl" in metadata
      ? (metadata as any).actorAvatarUrl
      : undefined,
    occurredAt: occurredAt ? new Date(occurredAt) : new Date(),
  });

  log.info({ ...ctx, activityId: activity.id }, "Activity created");
  return { activityId: activity.id };
};

// ---------------------------------------------------------------------------
// Worker
// ---------------------------------------------------------------------------

export const activityWorker = new Worker(QUEUE_NAMES.ACTIVITY, processor, {
  connection: redis,
  concurrency: 10,
});

// ---------------------------------------------------------------------------
// Event handlers
// ---------------------------------------------------------------------------

activityWorker.on("completed", (job) => {
  log.info({ jobId: job.id, name: job.name }, "Job completed");
});

activityWorker.on("failed", (job, err) => {
  log.error(
    { jobId: job?.id, name: job?.name, attempt: job?.attemptsMade, err },
    "Job failed",
  );
});

activityWorker.on("error", (err) => {
  log.error({ err }, "Worker error");
});

export default activityWorker;
