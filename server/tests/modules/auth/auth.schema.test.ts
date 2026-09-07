import { describe, it, expect } from "vitest";
import { registerSchema, loginSchema, changePasswordSchema } from "../../../src/modules/auth/schema/auth.schema.js";

describe("auth schemas", () => {
  describe("registerSchema", () => {
    it("accepts valid input", () => {
      const result = registerSchema.safeParse({
        email: "user@example.com",
        username: "testuser",
        password: "password123",
      });
      expect(result.success).toBe(true);
    });

    it("accepts optional name", () => {
      const result = registerSchema.safeParse({
        email: "user@example.com",
        username: "testuser",
        password: "password123",
        name: "Test User",
      });
      expect(result.success).toBe(true);
    });

    it("rejects invalid email", () => {
      const result = registerSchema.safeParse({
        email: "not-an-email",
        username: "testuser",
        password: "password123",
      });
      expect(result.success).toBe(false);
    });

    it("rejects short username", () => {
      const result = registerSchema.safeParse({
        email: "user@example.com",
        username: "ab",
        password: "password123",
      });
      expect(result.success).toBe(false);
    });

    it("rejects username with special chars", () => {
      const result = registerSchema.safeParse({
        email: "user@example.com",
        username: "test user!",
        password: "password123",
      });
      expect(result.success).toBe(false);
    });

    it("rejects short password", () => {
      const result = registerSchema.safeParse({
        email: "user@example.com",
        username: "testuser",
        password: "short",
      });
      expect(result.success).toBe(false);
    });
  });

  describe("loginSchema", () => {
    it("accepts valid input", () => {
      const result = loginSchema.safeParse({
        email: "user@example.com",
        password: "password123",
      });
      expect(result.success).toBe(true);
    });

    it("rejects empty password", () => {
      const result = loginSchema.safeParse({
        email: "user@example.com",
        password: "",
      });
      expect(result.success).toBe(false);
    });
  });

  describe("changePasswordSchema", () => {
    it("accepts valid input", () => {
      const result = changePasswordSchema.safeParse({
        currentPassword: "oldpassword",
        newPassword: "newpassword123",
      });
      expect(result.success).toBe(true);
    });

    it("rejects short new password", () => {
      const result = changePasswordSchema.safeParse({
        currentPassword: "oldpassword",
        newPassword: "short",
      });
      expect(result.success).toBe(false);
    });
  });
});
