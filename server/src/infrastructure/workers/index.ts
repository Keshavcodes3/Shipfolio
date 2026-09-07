import { redis } from "../../config/redis.js";
import { QUEUE_NAMES } from "../../shared/constants/index.js";
import { createLogger } from "../../shared/logger.js";
import type { Job } from "bullmq";

const log = createLogger("workers");

// ---------------------------------------------------------------------------
// Lazy-loaded workers — only instantiated when Redis is available
// ---------------------------------------------------------------------------

let _githubWorker: any = null;
let _activityWorker: any = null;
let _repoMetadataWorker: any = null;

export const startWorkers = async () => {
  if (redis.status !== "ready" && redis.status !== "connecting") {
    log.warn("Redis not available — skipping worker startup");
    return;
  }

  try {
    const githubMod = await import("./github.worker.js");
    _githubWorker = githubMod.default;
    log.info({ queue: QUEUE_NAMES.GITHUB }, "Worker started");
  } catch (err) {
    log.error({ queue: QUEUE_NAMES.GITHUB, err }, "Failed to start worker");
  }

  try {
    const activityMod = await import("./activity.worker.js");
    _activityWorker = activityMod.default;
    log.info({ queue: QUEUE_NAMES.ACTIVITY }, "Worker started");
  } catch (err) {
    log.error({ queue: QUEUE_NAMES.ACTIVITY, err }, "Failed to start worker");
  }

  try {
    const repoMetaMod = await import("./repo-metadata.worker.js");
    _repoMetadataWorker = repoMetaMod.default;
    log.info({ queue: QUEUE_NAMES.REPO_METADATA }, "Worker started");
  } catch (err) {
    log.error({ queue: QUEUE_NAMES.REPO_METADATA, err }, "Failed to start worker");
  }
};

// ---------------------------------------------------------------------------
// Graceful shutdown — drain in-progress jobs, then close
// ---------------------------------------------------------------------------

export const stopWorkers = async (): Promise<void> => {
  log.info("Stopping workers…");

  const workers = [_githubWorker, _activityWorker, _repoMetadataWorker].filter(Boolean);

  await Promise.all(
    workers.map(async (w) => {
      try {
        await w!.close();
      } catch (err) {
        log.error({ err }, "Error closing worker");
      }
    }),
  );

  _githubWorker = null;
  _activityWorker = null;
  _repoMetadataWorker = null;

  log.info("All workers stopped");
};

export default { startWorkers, stopWorkers };
