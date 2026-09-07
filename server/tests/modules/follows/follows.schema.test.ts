import { describe, it, expect } from "vitest";
import { followQuerySchema } from "../../../../src/modules/follows/schema/follows.schema.js";

describe("followQuerySchema", () => {
  it("applies defaults for empty input", () => {
    const result = followQuerySchema.safeParse({});
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.page).toBe(1);
      expect(result.data.limit).toBe(20);
    }
  });

  it("coerces string numbers", () => {
    const result = followQuerySchema.safeParse({ page: "3", limit: "50" });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.page).toBe(3);
      expect(result.data.limit).toBe(50);
    }
  });

  it("accepts valid page and limit", () => {
    const result = followQuerySchema.safeParse({ page: 5, limit: 30 });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.page).toBe(5);
      expect(result.data.limit).toBe(30);
    }
  });

  it("rejects page < 1", () => {
    const result = followQuerySchema.safeParse({ page: 0 });
    expect(result.success).toBe(false);
  });

  it("rejects negative page", () => {
    const result = followQuerySchema.safeParse({ page: -1 });
    expect(result.success).toBe(false);
  });

  it("enforces max limit of 100", () => {
    const result = followQuerySchema.safeParse({ limit: 101 });
    expect(result.success).toBe(false);
  });

  it("accepts limit at max boundary", () => {
    const result = followQuerySchema.safeParse({ limit: 100 });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.limit).toBe(100);
    }
  });

  it("accepts limit at min boundary", () => {
    const result = followQuerySchema.safeParse({ limit: 1 });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.limit).toBe(1);
    }
  });

  it("rejects limit < 1", () => {
    const result = followQuerySchema.safeParse({ limit: 0 });
    expect(result.success).toBe(false);
  });

  it("rejects non-integer page", () => {
    const result = followQuerySchema.safeParse({ page: 1.5 });
    expect(result.success).toBe(false);
  });

  it("rejects non-integer limit", () => {
    const result = followQuerySchema.safeParse({ limit: 10.5 });
    expect(result.success).toBe(false);
  });

  it("strips unknown keys", () => {
    const result = followQuerySchema.safeParse({ page: 1, limit: 20, sortBy: "createdAt" });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).not.toHaveProperty("sortBy");
    }
  });
});
