import { describe, it, expect } from "vitest";
import {
  createTechnologySchema,
  updateTechnologySchema,
  attachUserTechnologySchema,
  attachProjectTechnologySchema,
  technologiesQuerySchema,
  technologySearchSchema,
} from "../../../src/modules/technologies/schema/technologies.schema.js";

describe("technologies schemas", () => {
  // =========================================================================
  // createTechnologySchema
  // =========================================================================

  describe("createTechnologySchema", () => {
    it("accepts valid input", () => {
      const result = createTechnologySchema.safeParse({ name: "React" });
      expect(result.success).toBe(true);
    });

    it("accepts with category", () => {
      const result = createTechnologySchema.safeParse({
        name: "React",
        category: "Frontend",
      });
      expect(result.success).toBe(true);
    });

    it("rejects empty name", () => {
      const result = createTechnologySchema.safeParse({ name: "" });
      expect(result.success).toBe(false);
    });

    it("rejects name > 50 chars", () => {
      const result = createTechnologySchema.safeParse({ name: "x".repeat(51) });
      expect(result.success).toBe(false);
    });

    it("trims name", () => {
      const result = createTechnologySchema.safeParse({ name: "  React  " });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.name).toBe("React");
      }
    });

    it("accepts null category", () => {
      const result = createTechnologySchema.safeParse({
        name: "React",
        category: null,
      });
      expect(result.success).toBe(true);
    });
  });

  // =========================================================================
  // updateTechnologySchema
  // =========================================================================

  describe("updateTechnologySchema", () => {
    it("accepts partial input", () => {
      const result = updateTechnologySchema.safeParse({ name: "Updated" });
      expect(result.success).toBe(true);
    });

    it("accepts empty object", () => {
      const result = updateTechnologySchema.safeParse({});
      expect(result.success).toBe(true);
    });

    it("accepts null category", () => {
      const result = updateTechnologySchema.safeParse({ category: null });
      expect(result.success).toBe(true);
    });

    it("rejects name > 50 chars", () => {
      const result = updateTechnologySchema.safeParse({ name: "x".repeat(51) });
      expect(result.success).toBe(false);
    });
  });

  // =========================================================================
  // attachUserTechnologySchema
  // =========================================================================

  describe("attachUserTechnologySchema", () => {
    it("accepts valid input", () => {
      const result = attachUserTechnologySchema.safeParse({ technologyId: "t1" });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.isPrimary).toBe(false);
      }
    });

    it("accepts isPrimary: true", () => {
      const result = attachUserTechnologySchema.safeParse({
        technologyId: "t1",
        isPrimary: true,
      });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.isPrimary).toBe(true);
      }
    });

    it("rejects empty technologyId", () => {
      const result = attachUserTechnologySchema.safeParse({ technologyId: "" });
      expect(result.success).toBe(false);
    });
  });

  // =========================================================================
  // attachProjectTechnologySchema
  // =========================================================================

  describe("attachProjectTechnologySchema", () => {
    it("accepts valid input", () => {
      const result = attachProjectTechnologySchema.safeParse({ technologyId: "t1" });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.isPrimary).toBe(false);
      }
    });

    it("accepts isPrimary: true", () => {
      const result = attachProjectTechnologySchema.safeParse({
        technologyId: "t1",
        isPrimary: true,
      });
      expect(result.success).toBe(true);
    });

    it("rejects empty technologyId", () => {
      const result = attachProjectTechnologySchema.safeParse({ technologyId: "" });
      expect(result.success).toBe(false);
    });
  });

  // =========================================================================
  // technologiesQuerySchema
  // =========================================================================

  describe("technologiesQuerySchema", () => {
    it("applies defaults", () => {
      const result = technologiesQuerySchema.safeParse({});
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.page).toBe(1);
        expect(result.data.limit).toBe(20);
        expect(result.data.sortBy).toBe("name");
        expect(result.data.order).toBe("asc");
      }
    });

    it("coerces string numbers", () => {
      const result = technologiesQuerySchema.safeParse({ page: "3", limit: "50" });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.page).toBe(3);
        expect(result.data.limit).toBe(50);
      }
    });

    it("rejects limit > 100", () => {
      const result = technologiesQuerySchema.safeParse({ limit: 101 });
      expect(result.success).toBe(false);
    });

    it("rejects page < 1", () => {
      const result = technologiesQuerySchema.safeParse({ page: 0 });
      expect(result.success).toBe(false);
    });
  });

  // =========================================================================
  // technologySearchSchema
  // =========================================================================

  describe("technologySearchSchema", () => {
    it("accepts valid search", () => {
      const result = technologySearchSchema.safeParse({ q: "react" });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.limit).toBe(20);
      }
    });

    it("rejects empty query", () => {
      const result = technologySearchSchema.safeParse({ q: "" });
      expect(result.success).toBe(false);
    });

    it("rejects limit > 50", () => {
      const result = technologySearchSchema.safeParse({ q: "react", limit: 51 });
      expect(result.success).toBe(false);
    });
  });
});
