import { describe, it, expect, vi, beforeAll, afterAll } from "vitest";

// Test the REAL token-encryption module (not mocked).

let encryptToken: typeof import("../../../src/modules/github/utils/token-encryption.js").encryptToken;
let decryptToken: typeof import("../../../src/modules/github/utils/token-encryption.js").decryptToken;
let isEncryptedToken: typeof import("../../../src/modules/github/utils/token-encryption.js").isEncryptedToken;

beforeAll(async () => {
  vi.resetModules();
  process.env.TOKEN_ENCRYPTION_KEY = "test-encryption-key-for-unit-tests-32b";
  const mod = await vi.importActual<typeof import("../../../src/modules/github/utils/token-encryption.js")>(
    "../../../src/modules/github/utils/token-encryption.js",
  );
  encryptToken = mod.encryptToken;
  decryptToken = mod.decryptToken;
  isEncryptedToken = mod.isEncryptedToken;
});

afterAll(() => {
  vi.restoreAllMocks();
});

describe("Token encryption utilities", () => {
  describe("encryptToken", () => {
    it("returns a string starting with enc:", () => {
      const result = encryptToken("my-secret-token");
      expect(result).toMatch(/^enc:/);
    });

    it("produces different ciphertext for the same plaintext (random IV)", () => {
      const a = encryptToken("same-token");
      const b = encryptToken("same-token");
      expect(a).not.toBe(b);
    });

    it("produces a string with three colon-separated parts after enc:", () => {
      const result = encryptToken("test-token");
      const payload = result.slice(4);
      const parts = payload.split(":");
      expect(parts).toHaveLength(3);
    });
  });

  describe("decryptToken", () => {
    it("decrypts an encrypted token back to the original", () => {
      const original = "ghp_abc123secret";
      const encrypted = encryptToken(original);
      const decrypted = decryptToken(encrypted);
      expect(decrypted).toBe(original);
    });

    it("returns plain text as-is (backwards compatibility)", () => {
      const plain = "plain-access-token";
      expect(decryptToken(plain)).toBe(plain);
    });

    it("throws for malformed enc: tokens", () => {
      expect(() => decryptToken("enc:bad")).toThrow();
    });

    it("round-trips through multiple encrypt/decrypt cycles", () => {
      const original = "token-value-12345";
      const encrypted = encryptToken(original);
      const decrypted = decryptToken(encrypted);
      const reEncrypted = encryptToken(decrypted);
      const reDecrypted = decryptToken(reEncrypted);
      expect(reDecrypted).toBe(original);
    });
  });

  describe("isEncryptedToken", () => {
    it("returns true for enc: prefixed strings", () => {
      expect(isEncryptedToken("enc:abc:def:ghi")).toBe(true);
    });

    it("returns false for plain text", () => {
      expect(isEncryptedToken("plain-token")).toBe(false);
    });

    it("returns false for empty string", () => {
      expect(isEncryptedToken("")).toBe(false);
    });

    it("returns false for non-string input", () => {
      expect(isEncryptedToken(null as any)).toBe(false);
      expect(isEncryptedToken(undefined as any)).toBe(false);
    });
  });
});
