import { redis } from "../config/redis.js";
import { createLogger } from "./logger.js";

const log = createLogger("cache");

// ---------------------------------------------------------------------------
// Cache configuration
// ---------------------------------------------------------------------------

const PROFILE_CACHE_TTL = 300; // 5 minutes
const PROFILE_CACHE_PREFIX = "profile:";

// ---------------------------------------------------------------------------
// Cache helpers
// ---------------------------------------------------------------------------

/**
 * Get a cached value by key. Returns null on miss or if Redis is unavailable.
 */
export const cacheGet = async <T>(key: string): Promise<T | null> => {
  try {
    if (redis.status !== "ready") return null;
    const raw = await redis.get(key);
    if (!raw) return null;
    return JSON.parse(raw) as T;
  } catch (err) {
    log.debug({ key, err }, "Cache get error");
    return null;
  }
};

/**
 * Set a cached value with TTL. No-op if Redis is unavailable.
 */
export const cacheSet = async (key: string, value: unknown, ttlSeconds?: number): Promise<void> => {
  try {
    if (redis.status !== "ready") return;
    const serialized = JSON.stringify(value);
    if (ttlSeconds) {
      await redis.setex(key, ttlSeconds, serialized);
    } else {
      await redis.set(key, serialized);
    }
  } catch (err) {
    log.debug({ key, err }, "Cache set error");
  }
};

/**
 * Delete one or more cache keys. No-op if Redis is unavailable.
 */
export const cacheDel = async (...keys: string[]): Promise<void> => {
  try {
    if (redis.status !== "ready") return;
    if (keys.length > 0) {
      await redis.del(...keys);
    }
  } catch (err) {
    log.debug({ keys, err }, "Cache delete error");
  }
};

/**
 * Delete all keys matching a pattern. No-op if Redis is unavailable.
 * Uses SCAN instead of KEYS to avoid blocking the Redis event loop.
 */
export const cacheDelPattern = async (pattern: string): Promise<void> => {
  try {
    if (redis.status !== "ready") return;
    let cursor = "0";
    do {
      const [nextCursor, keys] = await redis.scan(cursor, "MATCH", pattern, "COUNT", 100);
      cursor = nextCursor;
      if (keys.length > 0) {
        await redis.del(...keys);
      }
    } while (cursor !== "0");
  } catch (err) {
    log.debug({ pattern, err }, "Cache delete pattern error");
  }
};

// ---------------------------------------------------------------------------
// Profile-specific cache helpers
// ---------------------------------------------------------------------------

export const getProfileCacheKey = (username: string) =>
  `${PROFILE_CACHE_PREFIX}${username.toLowerCase()}`;

export const getCachedProfile = async <T>(username: string): Promise<T | null> => {
  return cacheGet<T>(getProfileCacheKey(username));
};

export const setCachedProfile = async (username: string, profile: unknown): Promise<void> => {
  await cacheSet(getProfileCacheKey(username), profile, PROFILE_CACHE_TTL);
};

/**
 * Invalidate profile cache by username and user ID.
 * Called when a profile is updated, or when projects/follows change.
 * Uses SCAN-based pattern deletion to handle userId-based keys.
 */
export const invalidateProfileCache = async (userIdOrUsername: string): Promise<void> => {
  // Delete by exact key
  await cacheDel(getProfileCacheKey(userIdOrUsername));
  await cacheDel(getProfileCacheKey(userIdOrUsername.toLowerCase()));
  // Also scan for any userId-based keys (userId is a cuid, starts with "c")
  // Profile cache keys are profile:<username>, so if input is a userId we need pattern delete
  if (/^c[a-z0-9]{20,}$/.test(userIdOrUsername)) {
    // Looks like a cuid userId — scan all profile keys and find any that match
    // This is expensive, so we use a more targeted approach: the profile page
    // is cached with username, so we need to find the username for this userId.
    // Since we don't have the username here, we accept this inefficiency.
    await cacheDelPattern(`${PROFILE_CACHE_PREFIX}*`);
  }
};

/**
 * Invalidate profile caches for both a userId and a username.
 * Use this when you have both identifiers available.
 */
export const invalidateProfileCacheByIdAndUsername = async (
  userId: string,
  username: string,
): Promise<void> => {
  await cacheDel(
    getProfileCacheKey(username),
    getProfileCacheKey(username.toLowerCase()),
    getProfileCacheKey(userId),
  );
};

/**
 * Invalidate all profile caches. Useful for admin operations.
 */
export const invalidateAllProfileCaches = async (): Promise<void> => {
  await cacheDelPattern(`${PROFILE_CACHE_PREFIX}*`);
};
