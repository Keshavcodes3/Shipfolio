/**
 * Typed error classes for GitHub API interactions.
 *
 * These are infrastructure-level errors thrown by {@link GithubClient}. They
 * carry the HTTP status code and a machine-readable `code` so that callers
 * (the github module service layer) can translate them into domain-level
 * application errors without parsing raw Axios error objects.
 */

// ---------------------------------------------------------------------------
// Base
// ---------------------------------------------------------------------------

export class GithubApiError extends Error {
  public readonly status: number;
  public readonly code: GithubErrorCode;
  public readonly headers: Record<string, string> | undefined;

  constructor(
    message: string,
    status: number,
    code: GithubErrorCode,
    headers?: Record<string, string>,
  ) {
    super(message);
    this.name = "GithubApiError";
    this.status = status;
    this.code = code;
    this.headers = headers;
  }
}

// ---------------------------------------------------------------------------
// Specific error types
// ---------------------------------------------------------------------------

/** 401 – Token revoked or invalid. */
export class GithubAuthError extends GithubApiError {
  constructor(message = "GitHub access token is invalid or has been revoked", headers?: Record<string, string>) {
    super(message, 401, "AUTH_ERROR", headers);
    this.name = "GithubAuthError";
  }
}

/** 403 – Rate limit exceeded or insufficient permissions. */
export class GithubRateLimitError extends GithubApiError {
  public readonly retryAfter: Date | undefined;
  public readonly remaining: number;
  public readonly limit: number;
  public readonly resetsAt: Date | undefined;

  constructor(
    message = "GitHub API rate limit exceeded",
    headers?: Record<string, string>,
  ) {
    super(message, 403, "RATE_LIMITED", headers);
    this.name = "GithubRateLimitError";
    this.remaining = Number(headers?.["x-ratelimit-remaining"] ?? 0);
    this.limit = Number(headers?.["x-ratelimit-limit"] ?? 0);

    const resetsAtRaw = headers?.["x-ratelimit-reset"];
    this.resetsAt = resetsAtRaw ? new Date(Number(resetsAtRaw) * 1000) : undefined;
    this.retryAfter = this.resetsAt;
  }
}

/** 404 – Resource not found. */
export class GithubNotFoundError extends GithubApiError {
  constructor(message = "GitHub resource not found", headers?: Record<string, string>) {
    super(message, 404, "NOT_FOUND", headers);
    this.name = "GithubNotFoundError";
  }
}

/** 422 – Validation failed (e.g. invalid query parameter). */
export class GithubValidationError extends GithubApiError {
  public readonly errors: unknown;

  constructor(message = "GitHub validation error", errors?: unknown, headers?: Record<string, string>) {
    super(message, 422, "VALIDATION_ERROR", headers);
    this.name = "GithubValidationError";
    this.errors = errors;
  }
}

/** 5xx – GitHub server error. */
export class GithubServerError extends GithubApiError {
  constructor(status: number, message = "GitHub server error", headers?: Record<string, string>) {
    super(message, status, "SERVER_ERROR", headers);
    this.name = "GithubServerError";
  }
}

/** Network / timeout / DNS errors – not an HTTP response. */
export class GithubNetworkError extends GithubApiError {
  public readonly cause: Error | undefined;

  constructor(message = "GitHub API request failed", cause?: Error, code: GithubErrorCode = "NETWORK_ERROR") {
    super(message, 0, code);
    this.name = "GithubNetworkError";
    this.cause = cause;
  }
}

/** Request was aborted (timeout). */
export class GithubTimeoutError extends GithubNetworkError {
  constructor(message = "GitHub API request timed out") {
    super(message, undefined, "TIMEOUT");
    this.name = "GithubTimeoutError";
  }
}

// ---------------------------------------------------------------------------
// Error code union
// ---------------------------------------------------------------------------

export type GithubErrorCode =
  | "AUTH_ERROR"
  | "RATE_LIMITED"
  | "NOT_FOUND"
  | "VALIDATION_ERROR"
  | "SERVER_ERROR"
  | "NETWORK_ERROR"
  | "TIMEOUT"
  | "UNKNOWN";

// ---------------------------------------------------------------------------
// Factory – converts Axios errors into typed GithubApiError subclasses
// ---------------------------------------------------------------------------

export function createGithubError(err: any): GithubApiError {
  // Timeout (Axios sets `code` to `ECONNABORTED`)
  if (err?.code === "ECONNABORTED" || err?.message?.includes("timeout")) {
    return new GithubTimeoutError();
  }

  // Network errors (no response received)
  if (!err?.response) {
    return new GithubNetworkError(err?.message, err);
  }

  const { status, headers, data } = err.response;
  const msg = data?.message ?? err.message ?? "Unknown GitHub API error";
  const hdrs: Record<string, string> = {};

  if (headers) {
    for (const key of [
      "x-ratelimit-limit",
      "x-ratelimit-remaining",
      "x-ratelimit-reset",
      "retry-after",
    ]) {
      if (headers[key] !== undefined) hdrs[key] = String(headers[key]);
    }
  }

  switch (status) {
    case 401:
      return new GithubAuthError(msg, hdrs);
    case 403:
      // Distinguish rate limit from forbidden
      if (
        hdrs["x-ratelimit-remaining"] === "0" ||
        msg.toLowerCase().includes("rate limit")
      ) {
        return new GithubRateLimitError(msg, hdrs);
      }
      return new GithubApiError(msg, status, "AUTH_ERROR", hdrs);
    case 404:
      return new GithubNotFoundError(msg, hdrs);
    case 422:
      return new GithubValidationError(msg, data?.errors, hdrs);
    default:
      if (status >= 500) {
        return new GithubServerError(status, msg, hdrs);
      }
      return new GithubApiError(msg, status, "UNKNOWN", hdrs);
  }
}
