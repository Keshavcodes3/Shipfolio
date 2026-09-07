import { createApp } from "./app.js";
import { env } from "./config/env.js";
import { connectDatabase, disconnectDatabase } from "./config/database.js";
import { connectRedis, disconnectRedis } from "./config/redis.js";
import { createLogger } from "./shared/logger.js";

const log = createLogger("server");
const app = createApp();

const start = async () => {
  try {
    // ---- Infrastructure ----
    try {
      await connectDatabase();
      log.info("Database connected");
    } catch (e) {
      log.warn({ err: e }, "Database not connected — continuing without DB");
    }

    try {
      await connectRedis();
      log.info("Redis connected");
    } catch (e) {
      log.warn({ err: e }, "Redis not connected — queues will be disabled");
    }

    // ---- Workers (only if Redis is available) ----
    const { redis } = await import("./config/redis.js");
    if (redis.status === "ready" || redis.status === "connecting") {
      const { startWorkers } = await import("./infrastructure/workers/index.js");
      await startWorkers();
    }

    // ---- Event listeners ----
    await import("./modules/auth/events/auth.listeners.js").catch(() => {});
    await import("./modules/projects/events/projects.listeners.js").catch(() => {});
    await import("./modules/github/events/github.listeners.js").catch(() => {});
    await import("./modules/follows/events/follows.listeners.js").catch(() => {});
    await import("./modules/activity/events/activity.listeners.js").catch(() => {});
    // ---- Start HTTP server ----
    const server = app.listen(env.PORT, () => {
      log.info(`ShipFolio server running on http://localhost:${env.PORT}${env.API_PREFIX}`);
    });

    // ---- Graceful shutdown ----
    const shutdown = async (signal: string) => {
      log.info(`${signal} received — shutting down…`);

      server.close(async () => {
        // 1. Stop accepting new requests
        // 2. Drain workers (finish in-progress jobs)
        try {
          const { stopWorkers } = await import("./infrastructure/workers/index.js");
          await stopWorkers();
        } catch { /* workers may not have started */ }

        // 3. Close queues
        try {
          const { closeQueues } = await import("./infrastructure/queue/queue.js");
          await closeQueues();
        } catch { /* queues may not have started */ }

        // 4. Disconnect Redis
        await disconnectRedis().catch(() => {});

        // 5. Disconnect database
        await disconnectDatabase().catch(() => {});

        log.info("Shutdown complete");
        process.exit(0);
      });

      // Force-kill after 10s if graceful shutdown stalls
      setTimeout(() => {
        log.error("Forced shutdown after timeout");
        process.exit(1);
      }, 10_000).unref();
    };

    process.on("SIGINT", () => shutdown("SIGINT"));
    process.on("SIGTERM", () => shutdown("SIGTERM"));
  } catch (err) {
    log.error({ err }, "Failed to start server");
    process.exit(1);
  }
};

start();
