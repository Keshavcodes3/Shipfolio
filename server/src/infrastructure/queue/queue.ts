import { Queue, type JobsOptions } from "bullmq";
import { redis } from "../../config/redis.js";
import { QUEUE_NAMES } from "../../shared/constants/index.js";
import { createLogger } from "../../shared/logger.js";

const log = createLogger("queue");

export type QueueName = (typeof QUEUE_NAMES)[keyof typeof QUEUE_NAMES];

// ---------------------------------------------------------------------------
// Default job options — applied to every job unless overridden
// ---------------------------------------------------------------------------

export const defaultJobOptions: JobsOptions = {
  attempts: 3,
  backoff: { type: "exponential", delay: 5_000 },
  removeOnComplete: { age: 86_400, count: 200 },   // keep 24h or 200 jobs
  removeOnFail: { age: 604_800, count: 500 },       // keep 7d or 500 jobs
};

// ---------------------------------------------------------------------------
// Queue factory
// ---------------------------------------------------------------------------

export const createQueue = <T = any>(name: QueueName) => {
  const getRealQueue = (): Queue<T> => {
    const queue = new Queue<T>(name, {
      connection: redis,
      defaultJobOptions,
    });

    queue.on("error", (err) => {
      log.error({ queue: name, err: err.message }, "Queue error");
    });

    return queue;
  };

  let realQueue: Queue<T> | null = null;

  const ensureQueue = (): Queue<T> => {
    if (!realQueue) {
      realQueue = getRealQueue();
    }
    return realQueue;
  };

  return new Proxy({} as Queue<T>, {
    get(_target, prop, _receiver) {
      if (prop === "close" || prop === "on") {
        if (!realQueue) {
          // For close/on on a queue that was never created, return no-ops
          if (prop === "close") return async () => {};
          if (prop === "on") return () => {};
        }
        return (...args: any[]) => (ensureQueue() as any)[prop](...args);
      }
      return (...args: any[]) => (ensureQueue() as any)[prop](...args);
    },
  });
};

// ---------------------------------------------------------------------------
// Pre-created queues registry
// ---------------------------------------------------------------------------

export const queues = {
  github: createQueue(QUEUE_NAMES.GITHUB),
  activity: createQueue(QUEUE_NAMES.ACTIVITY),
  repoMetadata: createQueue(QUEUE_NAMES.REPO_METADATA),
} as const;

// ---------------------------------------------------------------------------
// Graceful shutdown
// ---------------------------------------------------------------------------

export const closeQueues = async (): Promise<void> => {
  log.info("Closing all queues");
  await Promise.all(Object.values(queues).map((q) => q.close()));
  log.info("All queues closed");
};

export default queues;
