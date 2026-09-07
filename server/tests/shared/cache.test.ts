import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("../../src/config/redis.js", () => ({
  redis: {
    status: "ready",
    get: vi.fn(),
    set: vi.fn(),
    setex: vi.fn(),
    del: vi.fn(),
    keys: vi.fn(),
  },
}));

import {
  cacheGet,
  cacheSet,
  cacheDel,
  cacheDelPattern,
  getCachedProfile,
  setCachedProfile,
  invalidateProfileCache,
  getProfileCacheKey,
} from "../../src/shared/cache.js";
import { redis } from "../../src/config/redis.js";

const mockRedis = vi.mocked(redis);

describe("cache", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (mockRedis as any).status = "ready";
  });

  // =========================================================================
  // cacheGet
  // =========================================================================

  describe("cacheGet", () => {
    it("returns parsed value on cache hit", async () => {
      mockRedis.get.mockResolvedValue(JSON.stringify({ name: "test" }));

      const result = await cacheGet<{ name: string }>("key1");

      expect(result).toEqual({ name: "test" });
      expect(mockRedis.get).toHaveBeenCalledWith("key1");
    });

    it("returns null on cache miss", async () => {
      mockRedis.get.mockResolvedValue(null);

      const result = await cacheGet("key1");

      expect(result).toBeNull();
    });

    it("returns null when Redis is not ready", async () => {
      (mockRedis as any).status = "disconnected";

      const result = await cacheGet("key1");

      expect(result).toBeNull();
      expect(mockRedis.get).not.toHaveBeenCalled();
    });

    it("returns null on Redis error", async () => {
      mockRedis.get.mockRejectedValue(new Error("Redis error"));

      const result = await cacheGet("key1");

      expect(result).toBeNull();
    });
  });

  // =========================================================================
  // cacheSet
  // =========================================================================

  describe("cacheSet", () => {
    it("sets value with TTL using setex", async () => {
      mockRedis.setex.mockResolvedValue("OK");

      await cacheSet("key1", { data: "value" }, 300);

      expect(mockRedis.setex).toHaveBeenCalledWith("key1", 300, JSON.stringify({ data: "value" }));
    });

    it("sets value without TTL using set", async () => {
      mockRedis.set.mockResolvedValue("OK");

      await cacheSet("key1", "value");

      expect(mockRedis.set).toHaveBeenCalledWith("key1", JSON.stringify("value"));
    });

    it("no-ops when Redis is not ready", async () => {
      (mockRedis as any).status = "disconnected";

      await cacheSet("key1", "value", 60);

      expect(mockRedis.setex).not.toHaveBeenCalled();
      expect(mockRedis.set).not.toHaveBeenCalled();
    });

    it("no-ops on Redis error", async () => {
      mockRedis.setex.mockRejectedValue(new Error("Redis error"));

      await cacheSet("key1", "value", 60);

      expect(mockRedis.setex).toHaveBeenCalled();
    });
  });

  // =========================================================================
  // cacheDel
  // =========================================================================

  describe("cacheDel", () => {
    it("deletes specified keys", async () => {
      mockRedis.del.mockResolvedValue(2);

      await cacheDel("key1", "key2");

      expect(mockRedis.del).toHaveBeenCalledWith("key1", "key2");
    });

    it("does not call del when no keys provided", async () => {
      await cacheDel();

      expect(mockRedis.del).not.toHaveBeenCalled();
    });

    it("no-ops when Redis is not ready", async () => {
      (mockRedis as any).status = "disconnected";

      await cacheDel("key1");

      expect(mockRedis.del).not.toHaveBeenCalled();
    });

    it("no-ops on Redis error", async () => {
      mockRedis.del.mockRejectedValue(new Error("Redis error"));

      await cacheDel("key1");

      expect(mockRedis.del).toHaveBeenCalled();
    });
  });

  // =========================================================================
  // cacheDelPattern
  // =========================================================================

  describe("cacheDelPattern", () => {
    it("deletes all matching keys", async () => {
      mockRedis.keys.mockResolvedValue(["profile:user1", "profile:user2"]);
      mockRedis.del.mockResolvedValue(2);

      await cacheDelPattern("profile:*");

      expect(mockRedis.keys).toHaveBeenCalledWith("profile:*");
      expect(mockRedis.del).toHaveBeenCalledWith("profile:user1", "profile:user2");
    });

    it("does not call del when no keys match", async () => {
      mockRedis.keys.mockResolvedValue([]);

      await cacheDelPattern("profile:*");

      expect(mockRedis.keys).toHaveBeenCalledWith("profile:*");
      expect(mockRedis.del).not.toHaveBeenCalled();
    });

    it("no-ops when Redis is not ready", async () => {
      (mockRedis as any).status = "disconnected";

      await cacheDelPattern("profile:*");

      expect(mockRedis.keys).not.toHaveBeenCalled();
    });
  });

  // =========================================================================
  // Profile cache helpers
  // =========================================================================

  describe("getProfileCacheKey", () => {
    it("returns correct key with prefix and lowercase", () => {
      expect(getProfileCacheKey("TestUser")).toBe("profile:testuser");
    });
  });

  describe("getCachedProfile", () => {
    it("uses correct profile cache key", async () => {
      mockRedis.get.mockResolvedValue(JSON.stringify({ id: 1 }));

      const result = await getCachedProfile("TestUser");

      expect(result).toEqual({ id: 1 });
      expect(mockRedis.get).toHaveBeenCalledWith("profile:testuser");
    });
  });

  describe("setCachedProfile", () => {
    it("sets value with profile prefix and 300s TTL", async () => {
      mockRedis.setex.mockResolvedValue("OK");

      await setCachedProfile("TestUser", { id: 1 });

      expect(mockRedis.setex).toHaveBeenCalledWith(
        "profile:testuser",
        300,
        JSON.stringify({ id: 1 }),
      );
    });
  });

  describe("invalidateProfileCache", () => {
    it("deletes profile keys via cacheDel", async () => {
      mockRedis.del.mockResolvedValue(1);

      await invalidateProfileCache("TestUser");

      expect(mockRedis.del).toHaveBeenCalledWith("profile:testuser");
      expect(mockRedis.del).toHaveBeenCalledWith("profile:testuser");
    });

    it("deletes profile keys for lowercase input", async () => {
      mockRedis.del.mockResolvedValue(1);

      await invalidateProfileCache("testuser");

      expect(mockRedis.del).toHaveBeenCalledWith("profile:testuser");
      expect(mockRedis.del).toHaveBeenCalledWith("profile:testuser");
    });
  });
});
