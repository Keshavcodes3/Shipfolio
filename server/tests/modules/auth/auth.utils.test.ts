import { describe, it, expect } from "vitest";
import {
  hashPassword,
  comparePassword,
  signToken,
  signRefreshToken,
  verifyToken,
  verifyRefreshToken,
  generateSessionToken,
  hashSessionToken,
  compareSessionToken,
} from "../../../src/modules/auth/utils/auth.utils.js";

describe("auth.utils", () => {
  describe("password hashing", () => {
    it("hashes a password", async () => {
      const hash = await hashPassword("mypassword");
      expect(hash).toBeDefined();
      expect(hash).not.toBe("mypassword");
      expect(hash.length).toBeGreaterThan(20);
    });

    it("verifies a correct password", async () => {
      const hash = await hashPassword("mypassword");
      const result = await comparePassword("mypassword", hash);
      expect(result).toBe(true);
    });

    it("rejects an incorrect password", async () => {
      const hash = await hashPassword("mypassword");
      const result = await comparePassword("wrongpassword", hash);
      expect(result).toBe(false);
    });
  });

  describe("JWT tokens", () => {
    const payload = { id: "user-1", email: "test@example.com", username: "testuser" };

    it("signs and verifies an access token", () => {
      const token = signToken(payload);
      const decoded = verifyToken(token);
      expect(decoded.id).toBe("user-1");
      expect(decoded.email).toBe("test@example.com");
    });

    it("signs and verifies a refresh token", () => {
      const token = signRefreshToken(payload);
      const decoded = verifyRefreshToken(token);
      expect(decoded.id).toBe("user-1");
    });

    it("throws on invalid token", () => {
      expect(() => verifyToken("invalid-token")).toThrow();
    });
  });

  describe("session tokens", () => {
    it("generates a random session token", () => {
      const token = generateSessionToken();
      expect(token).toBeDefined();
      expect(token.length).toBe(64); // 32 bytes = 64 hex chars
    });

    it("generates unique tokens", () => {
      const t1 = generateSessionToken();
      const t2 = generateSessionToken();
      expect(t1).not.toBe(t2);
    });

    it("hashes and verifies a session token", async () => {
      const token = generateSessionToken();
      const hash = await hashSessionToken(token);
      expect(hash).not.toBe(token);

      const valid = await compareSessionToken(token, hash);
      expect(valid).toBe(true);
    });

    it("rejects wrong session token", async () => {
      const token = generateSessionToken();
      const hash = await hashSessionToken(token);

      const valid = await compareSessionToken("wrong-token", hash);
      expect(valid).toBe(false);
    });
  });
});
