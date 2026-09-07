import Redis from "ioredis";
import { env } from "./env.js";

let redisFailed = false;

export const redis = new Redis(env.REDIS_URL, {
  maxRetriesPerRequest: null,
  enableReadyCheck: false,
  lazyConnect: true,
  retryStrategy(times) {
    if (times > 3) {
      redisFailed = true;
      return null; // stop retrying
    }
    return Math.min(times * 200, 2000);
  },
  maxAttempts: 4,
});

redis.on("connect", () => {
  if (!redisFailed) console.log("✅ Redis connected");
});
redis.on("error", (err) => {
  if (!redisFailed) {
    console.error("❌ Redis error", err.message);
    redisFailed = true;
  }
});

export const connectRedis = async (): Promise<void> => {
  if (redis.status !== "ready" && redis.status !== "connecting") {
    await redis.connect();
  }
};

export const disconnectRedis = async (): Promise<void> => {
  redis.disconnect();
};

export default redis;
