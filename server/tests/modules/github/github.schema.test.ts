import { describe, it, expect } from "vitest";
import {
  oauthInitSchema,
  oauthCallbackSchema,
  linkAccountSchema,
  connectRepoSchema,
  repoListQuerySchema,
} from "../../../src/modules/github/schema/github.schema.js";

describe("github schemas", () => {
  // =========================================================================
  // oauthInitSchema
  // =========================================================================

  describe("oauthInitSchema", () => {
    it("accepts empty body", () => {
      const result = oauthInitSchema.safeParse({});
      expect(result.success).toBe(true);
    });

    it("accepts redirect", () => {
      const result = oauthInitSchema.safeParse({ redirect: "/dashboard" });
      expect(result.success).toBe(true);
    });

    it("rejects redirect > 500 chars", () => {
      const result = oauthInitSchema.safeParse({ redirect: "x".repeat(501) });
      expect(result.success).toBe(false);
    });
  });

  // =========================================================================
  // oauthCallbackSchema
  // =========================================================================

  describe("oauthCallbackSchema", () => {
    it("accepts valid input", () => {
      const result = oauthCallbackSchema.safeParse({
        code: "abc-123",
        state: "signed-state",
      });
      expect(result.success).toBe(true);
    });

    it("rejects empty code", () => {
      const result = oauthCallbackSchema.safeParse({ code: "", state: "state" });
      expect(result.success).toBe(false);
    });

    it("rejects empty state", () => {
      const result = oauthCallbackSchema.safeParse({ code: "code", state: "" });
      expect(result.success).toBe(false);
    });

    it("rejects missing fields", () => {
      const result = oauthCallbackSchema.safeParse({});
      expect(result.success).toBe(false);
    });
  });

  // =========================================================================
  // linkAccountSchema
  // =========================================================================

  describe("linkAccountSchema", () => {
    it("accepts valid code", () => {
      const result = linkAccountSchema.safeParse({ code: "auth-code-xyz" });
      expect(result.success).toBe(true);
    });

    it("rejects empty code", () => {
      const result = linkAccountSchema.safeParse({ code: "" });
      expect(result.success).toBe(false);
    });
  });

  // =========================================================================
  // connectRepoSchema
  // =========================================================================

  describe("connectRepoSchema", () => {
    it("accepts valid projectId", () => {
      const result = connectRepoSchema.safeParse({ projectId: "proj-123" });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.projectId).toBe("proj-123");
      }
    });

    it("rejects empty projectId", () => {
      const result = connectRepoSchema.safeParse({ projectId: "" });
      expect(result.success).toBe(false);
    });

    it("rejects missing projectId", () => {
      const result = connectRepoSchema.safeParse({});
      expect(result.success).toBe(false);
    });
  });

  // =========================================================================
  // repoListQuerySchema
  // =========================================================================

  describe("repoListQuerySchema", () => {
    it("accepts empty query", () => {
      const result = repoListQuerySchema.safeParse({});
      expect(result.success).toBe(true);
    });

    it("accepts projectId filter", () => {
      const result = repoListQuerySchema.safeParse({ projectId: "proj-1" });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.projectId).toBe("proj-1");
      }
    });

    it("strips unknown fields", () => {
      const result = repoListQuerySchema.safeParse({ projectId: "proj-1", unknown: "field" });
      expect(result.success).toBe(true);
    });
  });
});
