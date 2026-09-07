import axios, { type AxiosInstance, type AxiosResponse, type InternalAxiosRequestConfig, type AxiosHeaders } from "axios";
import { githubConfig } from "../../config/github.js";
import {
  createGithubError,
  GithubApiError,
  GithubRateLimitError,
  GithubTimeoutError,
  GithubNetworkError,
} from "./github-errors.js";
import type { RawGithubRepo } from "./normalizer.js";

// ---------------------------------------------------------------------------
// Configuration
// ---------------------------------------------------------------------------

const DEFAULT_TIMEOUT_MS = 15_000;
const MAX_RETRIES = 3;
const RETRY_BASE_DELAY_MS = 1_000;
const RETRY_MAX_DELAY_MS = 30_000;

/** HTTP status codes that should trigger an automatic retry. */
const RETRYABLE_STATUS_CODES = new Set([429, 500, 502, 503, 504]);

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type RateLimitInfo = {
  limit: number;
  remaining: number;
  resetsAt: Date | null;
  retryAfter: Date | null;
};

export type RequestMetadata = {
  rateLimit: RateLimitInfo;
  response: AxiosResponse;
};

// ---------------------------------------------------------------------------
// Client
// ---------------------------------------------------------------------------

class GithubClient {
  private api: AxiosInstance;
  private lastRateLimit: RateLimitInfo = { limit: 0, remaining: 0, resetsAt: null, retryAfter: null };

  constructor() {
    this.api = axios.create({
      baseURL: githubConfig.apiBaseUrl,
      headers: {
        Accept: "application/vnd.github.v3+json",
      },
      timeout: DEFAULT_TIMEOUT_MS,
    });
  }

  // -------------------------------------------------------------------------
  // Core request with retry + rate limit handling
  // -------------------------------------------------------------------------

  /**
   * Executes an HTTP request against the GitHub API with automatic retry
   * for transient failures (429, 5xx, network errors, timeouts).
   *
   * Retries use exponential back-off with jitter, capped at
   * {@link RETRY_MAX_DELAY_MS}.
   *
   * @param config - Axios request config (merged with defaults).
   * @returns The raw Axios response.
   * @throws {GithubApiError} (or subclass) on non-retryable errors.
   */
  async request<T = any>(config: InternalAxiosRequestConfig): Promise<AxiosResponse<T>> {
    let lastError: any;

    for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
      try {
        const response = await this.api.request<T>(config);
        this.updateRateLimit(response);
        return response;
      } catch (err: any) {
        lastError = err;

        // Convert to typed error for classification
        const ghError = createGithubError(err);
        this.updateRateLimitFromError(err);

        // Non-retryable – throw immediately
        if (!this.isRetryable(ghError)) {
          throw ghError;
        }

        // Last attempt – don't sleep, just throw
        if (attempt === MAX_RETRIES) {
          throw ghError;
        }

        // Compute delay
        const delay = this.computeRetryDelay(ghError, attempt);
        await this.sleep(delay);
      }
    }

    // Should never reach here, but TypeScript needs it
    throw createGithubError(lastError);
  }

  // -------------------------------------------------------------------------
  // Authenticated request helper
  // -------------------------------------------------------------------------

  /**
   * Convenience wrapper that attaches a Bearer token and calls
   * {@link request}.
   */
  async authenticatedRequest<T = any>(
    token: string,
    config: Omit<InternalAxiosRequestConfig, "headers"> & {
      headers?: Record<string, string>;
    },
  ): Promise<AxiosResponse<T>> {
    return this.request<T>({
      ...config,
      headers: {
        ...(config.headers as any),
        Authorization: `Bearer ${token}`,
      },
    } as InternalAxiosRequestConfig);
  }

  // -------------------------------------------------------------------------
  // GitHub-specific API methods
  // -------------------------------------------------------------------------

  /**
   * Fetch the authenticated GitHub user profile.
   *
   * @throws {GithubApiError} on 401 (revoked token), 403 (rate limit), etc.
   */
  async getAuthenticatedUser(token: string) {
    const { data } = await this.authenticatedRequest<{
      id: number;
      login: string;
      avatar_url: string;
      name: string | null;
      email: string | null;
      bio: string | null;
    }>(token, { method: "GET", url: "/user" });
    return data;
  }

  /**
   * Fetch a single page of the authenticated user's repositories.
   *
   * For automatic full pagination use {@link getAllUserRepos}.
   */
  async getUserRepos(token: string, page = 1, perPage = 100): Promise<RawGithubRepo[]> {
    const { data } = await this.authenticatedRequest<RawGithubRepo[]>(token, {
      method: "GET",
      url: "/user/repos",
      params: { page, per_page: perPage, sort: "updated", direction: "desc" },
    });
    return data;
  }

  /**
   * Fetch ALL repositories for the authenticated user, handling pagination
   * automatically.
   *
   * Makes multiple requests as needed to walk through every page. Respects
   * rate limits – if a 429 / 403 (rate limit) is received mid-pagination
   * the client retries with back-off.
   *
   * @param token  - GitHub access token.
   * @param maxPages - Safety cap to prevent runaway pagination (default 20
   *                   = 2,000 repos at 100/page).
   * @returns The full list of repositories.
   */
  async getAllUserRepos(token: string, maxPages = 20): Promise<RawGithubRepo[]> {
    const allRepos: RawGithubRepo[] = [];
    let page = 1;

    while (page <= maxPages) {
      const repos = await this.getUserRepos(token, page);
      if (repos.length === 0) break;

      allRepos.push(...repos);

      // GitHub returns fewer than requested when on the last page
      if (repos.length < 100) break;

      page++;
    }

    return allRepos;
  }

  /**
   * Fetch a single repository by full name (e.g. "owner/repo").
   */
  async getRepo(repoFullName: string, token?: string) {
    if (token) {
      return this.authenticatedRequest(token, { method: "GET", url: `/repos/${repoFullName}` });
    }
    return this.request({ method: "GET", url: `/repos/${repoFullName}` } as InternalAxiosRequestConfig);
  }

  /**
   * Fetch the README content for a repository (base64 encoded).
   */
  async getReadme(repoFullName: string, token?: string) {
    if (token) {
      return this.authenticatedRequest(token, {
        method: "GET",
        url: `/repos/${repoFullName}/readme`,
        headers: { Accept: "application/vnd.github.v3.raw" },
      });
    }
    return this.request({
      method: "GET",
      url: `/repos/${repoFullName}/readme`,
      headers: { Accept: "application/vnd.github.v3.raw" },
    } as InternalAxiosRequestConfig);
  }

  /**
   * Fetch contributors for a repository.
   */
  async getContributors(repoFullName: string, token?: string) {
    if (token) {
      return this.authenticatedRequest<{
        login: string;
        avatar_url: string;
        html_url: string;
        contributions: number;
      }[]>(token, {
        method: "GET",
        url: `/repos/${repoFullName}/contributors`,
        params: { per_page: 20 },
      });
    }
    return this.request<{
      login: string;
      avatar_url: string;
      html_url: string;
      contributions: number;
    }[]>({
      method: "GET",
      url: `/repos/${repoFullName}/contributors`,
      params: { per_page: 20 },
    } as InternalAxiosRequestConfig);
  }

  /**
   * Fetch languages used in a repository.
   * Returns an object like { TypeScript: 12345, JavaScript: 6789 } (bytes per language).
   */
  async getLanguages(repoFullName: string, token?: string) {
    if (token) {
      return this.authenticatedRequest<Record<string, number>>(token, {
        method: "GET",
        url: `/repos/${repoFullName}/languages`,
      });
    }
    return this.request<Record<string, number>>({
      method: "GET",
      url: `/repos/${repoFullName}/languages`,
    } as InternalAxiosRequestConfig);
  }

  /**
   * Exchange an OAuth authorization code for an access token.
   *
   * This hits a different endpoint and does NOT use the retry wrapper
   * because the token exchange is idempotent and should not be retried
   * on failure.
   */
  async exchangeCodeForToken(code: string) {
    const { data } = await axios.post(
      githubConfig.oauthTokenUrl,
      {
        client_id: githubConfig.clientId,
        client_secret: githubConfig.clientSecret,
        code,
      },
      { headers: { Accept: "application/json" }, timeout: DEFAULT_TIMEOUT_MS },
    );
    return data as {
      access_token: string;
      scope: string;
      token_type: string;
      refresh_token?: string;
      expires_in?: number;
    };
  }

  // -------------------------------------------------------------------------
  // Rate limit info
  // -------------------------------------------------------------------------

  /** Returns the most recent rate limit info from any request. */
  getRateLimit(): RateLimitInfo {
    return { ...this.lastRateLimit };
  }

  // -------------------------------------------------------------------------
  // Private helpers
  // -------------------------------------------------------------------------

  private updateRateLimit(response: AxiosResponse): void {
    const h = response.headers;
    if (!h) return;

    this.lastRateLimit = {
      limit: Number(h["x-ratelimit-limit"] ?? 0),
      remaining: Number(h["x-ratelimit-remaining"] ?? 0),
      resetsAt: h["x-ratelimit-reset"]
        ? new Date(Number(h["x-ratelimit-reset"]) * 1000)
        : null,
      retryAfter: h["retry-after"]
        ? new Date(Date.now() + Number(h["retry-after"]) * 1000)
        : null,
    };
  }

  private updateRateLimitFromError(err: any): void {
    const h = err?.response?.headers;
    if (!h) return;

    this.lastRateLimit = {
      limit: Number(h["x-ratelimit-limit"] ?? this.lastRateLimit.limit),
      remaining: Number(h["x-ratelimit-remaining"] ?? this.lastRateLimit.remaining),
      resetsAt: h["x-ratelimit-reset"]
        ? new Date(Number(h["x-ratelimit-reset"]) * 1000)
        : this.lastRateLimit.resetsAt,
      retryAfter: h["retry-after"]
        ? new Date(Date.now() + Number(h["retry-after"]) * 1000)
        : this.lastRateLimit.retryAfter,
    };
  }

  private isRetryable(err: GithubApiError): boolean {
    if (err instanceof GithubRateLimitError) return true;
    if (err instanceof GithubTimeoutError) return true;
    if (err instanceof GithubNetworkError) return true;
    if (RETRYABLE_STATUS_CODES.has(err.status)) return true;
    return false;
  }

  private computeRetryDelay(err: GithubApiError, attempt: number): number {
    // If the server tells us when to retry, honour it
    if (err instanceof GithubRateLimitError && err.retryAfter) {
      const waitMs = err.retryAfter.getTime() - Date.now();
      if (waitMs > 0 && waitMs <= RETRY_MAX_DELAY_MS) return waitMs;
    }

    if (err instanceof GithubRateLimitError && err.resetsAt) {
      const waitMs = err.resetsAt.getTime() - Date.now();
      if (waitMs > 0 && waitMs <= RETRY_MAX_DELAY_MS) return waitMs;
    }

    // Exponential back-off with jitter
    const base = Math.min(RETRY_BASE_DELAY_MS * 2 ** attempt, RETRY_MAX_DELAY_MS);
    const jitter = Math.random() * RETRY_BASE_DELAY_MS;
    return Math.min(base + jitter, RETRY_MAX_DELAY_MS);
  }

  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

export const githubClient = new GithubClient();
export default githubClient;
