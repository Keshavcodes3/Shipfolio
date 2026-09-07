import { describe, it, expect } from "vitest";
import {
  createActivitySchema,
  updateActivitySchema,
  activityQuerySchema,
} from "../../../src/modules/activity/schema/activity.schema.js";

describe("activity schemas", () => {
  // =========================================================================
  // createActivitySchema
  // =========================================================================

  describe("createActivitySchema", () => {
    it("accepts empty object", () => {
      const result = createActivitySchema.safeParse({});
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual({});
      }
    });
  });

  // =========================================================================
  // updateActivitySchema
  // =========================================================================

  describe("updateActivitySchema", () => {
    it("accepts empty object", () => {
      const result = updateActivitySchema.safeParse({});
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual({});
      }
    });
  });

  // =========================================================================
  // activityQuerySchema
  // =========================================================================

  describe("activityQuerySchema", () => {
    it("accepts empty object (all fields optional)", () => {
      const result = activityQuerySchema.safeParse({});
      expect(result.success).toBe(true);
    });

    it("accepts valid page and limit", () => {
      const result = activityQuerySchema.safeParse({ page: 1, limit: 20 });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.page).toBe(1);
        expect(result.data.limit).toBe(20);
      }
    });

    it("coerces string numbers", () => {
      const result = activityQuerySchema.safeParse({ page: "3", limit: "50" });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.page).toBe(3);
        expect(result.data.limit).toBe(50);
      }
    });

    it("rejects non-numeric page", () => {
      const result = activityQuerySchema.safeParse({ page: "abc" });
      expect(result.success).toBe(false);
    });

    it("rejects non-numeric limit", () => {
      const result = activityQuerySchema.safeParse({ limit: "abc" });
      expect(result.success).toBe(false);
    });
  });
});
