import { describe, it, expect } from "vitest";
import {
  createProjectSchema,
  updateProjectSchema,
  projectsQuerySchema,
} from "../../../src/modules/projects/schema/projects.schema.js";

describe("projects schemas", () => {
  // =========================================================================
  // createProjectSchema
  // =========================================================================

  describe("createProjectSchema", () => {
    it("accepts valid minimal input", () => {
      const result = createProjectSchema.safeParse({ name: "My Project" });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.name).toBe("My Project");
        expect(result.data.status).toBe("BUILDING");
        expect(result.data.visibility).toBe("PUBLIC");
        expect(result.data.isFeatured).toBe(false);
        expect(result.data.isCurrentlyBuilding).toBe(false);
        expect(result.data.technologyIds).toEqual([]);
      }
    });

    it("accepts full input", () => {
      const result = createProjectSchema.safeParse({
        name: "Full Project",
        description: "A description",
        coverImageUrl: "https://example.com/image.png",
        status: "SHIPPED",
        visibility: "PRIVATE",
        liveUrl: "https://example.com",
        demoUrl: "https://demo.example.com",
        githubRepoId: "repo-1",
        startedAt: "2024-01-01T00:00:00.000Z",
        isFeatured: true,
        isCurrentlyBuilding: true,
        technologyIds: ["tech-1", "tech-2"],
      });
      expect(result.success).toBe(true);
    });

    it("rejects empty name", () => {
      const result = createProjectSchema.safeParse({ name: "" });
      expect(result.success).toBe(false);
    });

    it("rejects name > 100 chars", () => {
      const result = createProjectSchema.safeParse({ name: "x".repeat(101) });
      expect(result.success).toBe(false);
    });

    it("rejects invalid cover image URL", () => {
      const result = createProjectSchema.safeParse({
        name: "Test",
        coverImageUrl: "not-a-url",
      });
      expect(result.success).toBe(false);
    });

    it("accepts null for optional fields", () => {
      const result = createProjectSchema.safeParse({
        name: "Test",
        description: null,
        coverImageUrl: null,
        liveUrl: null,
        demoUrl: null,
      });
      expect(result.success).toBe(true);
    });

    it("rejects invalid status", () => {
      const result = createProjectSchema.safeParse({
        name: "Test",
        status: "INVALID",
      });
      expect(result.success).toBe(false);
    });

    it("rejects > 20 technology IDs", () => {
      const result = createProjectSchema.safeParse({
        name: "Test",
        technologyIds: Array.from({ length: 21 }, (_, i) => `tech-${i}`),
      });
      expect(result.success).toBe(false);
    });
  });

  // =========================================================================
  // updateProjectSchema
  // =========================================================================

  describe("updateProjectSchema", () => {
    it("accepts partial input", () => {
      const result = updateProjectSchema.safeParse({ name: "Updated" });
      expect(result.success).toBe(true);
    });

    it("accepts empty object (no-op, caught by service)", () => {
      const result = updateProjectSchema.safeParse({});
      expect(result.success).toBe(true);
    });

    it("accepts null for nullable fields", () => {
      const result = updateProjectSchema.safeParse({
        description: null,
        liveUrl: null,
        demoUrl: null,
      });
      expect(result.success).toBe(true);
    });

    it("rejects invalid visibility", () => {
      const result = updateProjectSchema.safeParse({ visibility: "HIDDEN" });
      expect(result.success).toBe(false);
    });

    it("rejects invalid status", () => {
      const result = updateProjectSchema.safeParse({ status: "DELETED" });
      expect(result.success).toBe(false);
    });
  });

  // =========================================================================
  // projectsQuerySchema
  // =========================================================================

  describe("projectsQuerySchema", () => {
    it("applies defaults", () => {
      const result = projectsQuerySchema.safeParse({});
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.page).toBe(1);
        expect(result.data.limit).toBe(20);
        expect(result.data.sortBy).toBe("updatedAt");
        expect(result.data.order).toBe("desc");
      }
    });

    it("coerces string numbers", () => {
      const result = projectsQuerySchema.safeParse({ page: "3", limit: "50" });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.page).toBe(3);
        expect(result.data.limit).toBe(50);
      }
    });

    it("rejects limit > 100", () => {
      const result = projectsQuerySchema.safeParse({ limit: 101 });
      expect(result.success).toBe(false);
    });

    it("rejects page < 1", () => {
      const result = projectsQuerySchema.safeParse({ page: 0 });
      expect(result.success).toBe(false);
    });
  });
});
