import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  GithubAuthError,
  GithubRateLimitError,
  GithubNotFoundError,
  GithubValidationError,
  GithubServerError,
  GithubNetworkError,
  GithubTimeoutError,
  createGithubError,
} from "../../../src/infrastructure/github/github-errors.js";

describe("GitHub error classes", () => {
  describe("GithubAuthError", () => {
    it("has status 401 and code AUTH_ERROR", () => {
      const err = new GithubAuthError();
      expect(err.status).toBe(401);
      expect(err.code).toBe("AUTH_ERROR");
      expect(err.name).toBe("GithubAuthError");
      expect(err.message).toContain("invalid or has been revoked");
    });

    it("accepts custom message", () => {
      const err = new GithubAuthError("custom message");
      expect(err.message).toBe("custom message");
    });

    it("preserves response headers", () => {
      const err = new GithubAuthError("msg", { "x-ratelimit-limit": "5000" });
      expect(err.headers).toEqual({ "x-ratelimit-limit": "5000" });
    });
  });

  describe("GithubRateLimitError", () => {
    it("has status 403 and code RATE_LIMITED", () => {
      const err = new GithubRateLimitError();
      expect(err.status).toBe(403);
      expect(err.code).toBe("RATE_LIMITED");
      expect(err.name).toBe("GithubRateLimitError");
    });

    it("parses rate limit headers", () => {
      const resetsAt = Math.floor(Date.now() / 1000) + 3600;
      const err = new GithubRateLimitError("rate limited", {
        "x-ratelimit-limit": "5000",
        "x-ratelimit-remaining": "0",
        "x-ratelimit-reset": String(resetsAt),
      });
      expect(err.limit).toBe(5000);
      expect(err.remaining).toBe(0);
      expect(err.resetsAt).toBeInstanceOf(Date);
      expect(err.retryAfter).toBeInstanceOf(Date);
    });

    it("handles missing headers gracefully", () => {
      const err = new GithubRateLimitError();
      expect(err.limit).toBe(0);
      expect(err.remaining).toBe(0);
      expect(err.resetsAt == null).toBe(true);
      expect(err.retryAfter == null).toBe(true);
    });
  });

  describe("GithubNotFoundError", () => {
    it("has status 404 and code NOT_FOUND", () => {
      const err = new GithubNotFoundError();
      expect(err.status).toBe(404);
      expect(err.code).toBe("NOT_FOUND");
      expect(err.name).toBe("GithubNotFoundError");
    });
  });

  describe("GithubValidationError", () => {
    it("has status 422 and code VALIDATION_ERROR", () => {
      const err = new GithubValidationError();
      expect(err.status).toBe(422);
      expect(err.code).toBe("VALIDATION_ERROR");
      expect(err.name).toBe("GithubValidationError");
    });

    it("stores validation errors", () => {
      const errors = [{ field: "name", message: "required" }];
      const err = new GithubValidationError("validation failed", errors);
      expect(err.errors).toEqual(errors);
    });
  });

  describe("GithubServerError", () => {
    it("has the provided status and code SERVER_ERROR", () => {
      const err = new GithubServerError(502);
      expect(err.status).toBe(502);
      expect(err.code).toBe("SERVER_ERROR");
      expect(err.name).toBe("GithubServerError");
    });
  });

  describe("GithubNetworkError", () => {
    it("has status 0 and code NETWORK_ERROR", () => {
      const err = new GithubNetworkError();
      expect(err.status).toBe(0);
      expect(err.code).toBe("NETWORK_ERROR");
      expect(err.name).toBe("GithubNetworkError");
    });

    it("stores the original cause", () => {
      const cause = new Error("ECONNREFUSED");
      const err = new GithubNetworkError("network error", cause);
      expect(err.cause).toBe(cause);
    });
  });

  describe("GithubTimeoutError", () => {
    it("has code TIMEOUT", () => {
      const err = new GithubTimeoutError();
      expect(err.code).toBe("TIMEOUT");
      expect(err.name).toBe("GithubTimeoutError");
      expect(err.status).toBe(0);
    });
  });
});

describe("createGithubError", () => {
  it("creates GithubTimeoutError for ECONNABORTED", () => {
    const err = createGithubError({ code: "ECONNABORTED", message: "timeout" });
    expect(err).toBeInstanceOf(GithubTimeoutError);
    expect(err.code).toBe("TIMEOUT");
  });

  it("creates GithubTimeoutError for timeout message", () => {
    const err = createGithubError({ message: "timeout of 10000ms exceeded" });
    expect(err).toBeInstanceOf(GithubTimeoutError);
  });

  it("creates GithubNetworkError when no response", () => {
    const err = createGithubError({ message: "ECONNREFUSED" });
    expect(err).toBeInstanceOf(GithubNetworkError);
    expect(err.status).toBe(0);
  });

  it("creates GithubAuthError for 401", () => {
    const err = createGithubError({
      response: { status: 401, headers: {}, data: { message: "Bad credentials" } },
    });
    expect(err).toBeInstanceOf(GithubAuthError);
    expect(err.status).toBe(401);
  });

  it("creates GithubRateLimitError for 403 with rate limit header", () => {
    const err = createGithubError({
      response: {
        status: 403,
        headers: { "x-ratelimit-remaining": "0", "x-ratelimit-limit": "5000" },
        data: { message: "API rate limit exceeded" },
      },
    });
    expect(err).toBeInstanceOf(GithubRateLimitError);
  });

  it("creates GithubRateLimitError for 403 with rate limit message", () => {
    const err = createGithubError({
      response: {
        status: 403,
        headers: {},
        data: { message: "You have exceeded a secondary rate limit" },
      },
    });
    expect(err).toBeInstanceOf(GithubRateLimitError);
  });

  it("creates GithubApiError for 403 without rate limit", () => {
    const err = createGithubError({
      response: {
        status: 403,
        headers: {},
        data: { message: "Forbidden" },
      },
    });
    expect(err.status).toBe(403);
    expect(err.code).toBe("AUTH_ERROR");
  });

  it("creates GithubNotFoundError for 404", () => {
    const err = createGithubError({
      response: { status: 404, headers: {}, data: { message: "Not Found" } },
    });
    expect(err).toBeInstanceOf(GithubNotFoundError);
  });

  it("creates GithubValidationError for 422", () => {
    const err = createGithubError({
      response: {
        status: 422,
        headers: {},
        data: { message: "Validation Failed", errors: [{ field: "q" }] },
      },
    });
    expect(err).toBeInstanceOf(GithubValidationError);
  });

  it("creates GithubServerError for 500", () => {
    const err = createGithubError({
      response: { status: 500, headers: {}, data: { message: "Internal Server Error" } },
    });
    expect(err).toBeInstanceOf(GithubServerError);
    expect(err.status).toBe(500);
  });

  it("creates GithubServerError for 502", () => {
    const err = createGithubError({
      response: { status: 502, headers: {}, data: { message: "Bad Gateway" } },
    });
    expect(err).toBeInstanceOf(GithubServerError);
    expect(err.status).toBe(502);
  });

  it("creates GithubServerError for 503", () => {
    const err = createGithubError({
      response: { status: 503, headers: {}, data: { message: "Service Unavailable" } },
    });
    expect(err).toBeInstanceOf(GithubServerError);
    expect(err.status).toBe(503);
  });

  it("creates GithubApiError with UNKNOWN code for unexpected status", () => {
    const err = createGithubError({
      response: { status: 418, headers: {}, data: { message: "I'm a teapot" } },
    });
    expect(err.status).toBe(418);
    expect(err.code).toBe("UNKNOWN");
  });

  it("extracts rate limit headers into the error", () => {
    const err = createGithubError({
      response: {
        status: 500,
        headers: {
          "x-ratelimit-limit": "5000",
          "x-ratelimit-remaining": "4999",
          "x-ratelimit-reset": "1700000000",
        },
        data: { message: "Server Error" },
      },
    });
    expect(err.headers?.["x-ratelimit-limit"]).toBe("5000");
    expect(err.headers?.["x-ratelimit-remaining"]).toBe("4999");
  });
});
