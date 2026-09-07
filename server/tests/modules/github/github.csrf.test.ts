import { describe, it, expect, vi } from "vitest";
import crypto from "node:crypto";

// We test the REAL csrf module (not mocked). Import directly and bypass the
// global setup mock by using vi.importActual.

let generateOAuthState: typeof import("../../../src/modules/github/utils/csrf.js").generateOAuthState;
let validateOAuthState: typeof import("../../../src/modules/github/utils/csrf.js").validateOAuthState;

beforeAll(async () => {
  vi.resetModules();
  process.env.GITHUB_STATE_SECRET = "test-secret-for-csrf-tests";
  const mod = await vi.importActual<typeof import("../../../src/modules/github/utils/csrf.js")>(
    "../../../src/modules/github/utils/csrf.js",
  );
  generateOAuthState = mod.generateOAuthState;
  validateOAuthState = mod.validateOAuthState;
});

afterAll(() => {
  vi.restoreAllMocks();
});

describe("OAuth CSRF state utilities", () => {
  describe("generateOAuthState", () => {
    it("returns a non-empty string", () => {
      const state = generateOAuthState();
      expect(typeof state).toBe("string");
      expect(state.length).toBeGreaterThan(0);
    });

    it("returns a state with dot separator", () => {
      const state = generateOAuthState();
      expect(state).toContain(".");
    });

    it("includes redirect when provided", () => {
      const state = generateOAuthState("/dashboard");
      const parts = state.split(".");
      const payload = JSON.parse(Buffer.from(parts[0], "base64url").toString("utf8"));
      expect(payload.redirect).toBe("/dashboard");
    });

    it("generates unique states on each call", () => {
      const state1 = generateOAuthState();
      const state2 = generateOAuthState();
      expect(state1).not.toBe(state2);
    });
  });

  describe("validateOAuthState", () => {
    it("validates a correctly signed state", () => {
      const state = generateOAuthState();
      const result = validateOAuthState(state);
      expect(result).toHaveProperty("nonce");
      expect(result).toHaveProperty("timestamp");
      expect(typeof result.nonce).toBe("string");
      expect(typeof result.timestamp).toBe("number");
    });

    it("throws for tampered state", () => {
      const state = generateOAuthState();
      const parts = state.split(".");
      const payload = JSON.parse(Buffer.from(parts[0], "base64url").toString("utf8"));
      payload.nonce = "tampered";
      const tamperedPayload = Buffer.from(JSON.stringify(payload)).toString("base64url");
      const tampered = `${tamperedPayload}.${parts[1]}`;

      expect(() => validateOAuthState(tampered)).toThrow();
    });

    it("throws for tampered signature", () => {
      const state = generateOAuthState();
      const parts = state.split(".");
      const tampered = `${parts[0]}.aaaa${parts[1].slice(4)}`;

      expect(() => validateOAuthState(tampered)).toThrow();
    });

    it("throws for empty input", () => {
      expect(() => validateOAuthState("")).toThrow();
    });

    it("throws for input without dot", () => {
      expect(() => validateOAuthState("nodot")).toThrow();
    });

    it("throws for malformed base64 payload", () => {
      expect(() => validateOAuthState("!!!.!!!")).toThrow();
    });

    it("throws for expired state", () => {
      const oldState = {
        nonce: "test-nonce",
        timestamp: Date.now() - 20 * 60 * 1000,
      };
      const stateB64 = Buffer.from(JSON.stringify(oldState)).toString("base64url");
      const sig = crypto
        .createHmac("sha256", "test-secret-for-csrf-tests")
        .update(stateB64)
        .digest("hex");
      const state = `${stateB64}.${sig}`;

      expect(() => validateOAuthState(state)).toThrow(/expired/i);
    });

    it("validates state with redirect", () => {
      const state = generateOAuthState("/projects");
      const result = validateOAuthState(state);
      expect(result.redirect).toBe("/projects");
    });
  });
});
