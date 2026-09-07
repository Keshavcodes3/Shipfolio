/**
 * Normalizes raw GitHub API repository objects into the shape expected by the
 * database layer.
 *
 * Every field is explicitly handled – missing / null values are coerced to
 * sensible defaults so the database row is always well-formed.
 */

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/** Shape returned by GitHub's REST API for a repository. */
export type RawGithubRepo = {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  open_issues_count: number;
  private: boolean;
  archived: boolean;
  fork: boolean;
  pushed_at: string | null;
  created_at?: string;
  updated_at?: string;
  owner?: { login: string; id: number };
  [key: string]: unknown;
};

/** Normalized repository record ready for DB upsert. */
export type NormalizedGithubRepo = {
  githubRepoId: string;
  name: string;
  fullName: string;
  description: string | null;
  url: string;
  htmlUrl: string;
  primaryLanguage: string | null;
  stars: number;
  forks: number;
  openIssues: number;
  isPrivate: boolean;
  isArchived: boolean;
  isFork: boolean;
  pushedAt: Date | null;
};

// ---------------------------------------------------------------------------
// Normalizer
// ---------------------------------------------------------------------------

/**
 * Normalizes a single raw GitHub repository object.
 *
 * Handles:
 *  - Null / undefined descriptions
 *  - Zeroed counters when GitHub omits them
 *  - Missing `pushed_at`
 *  - Language stored as empty string vs null
 *  - `id` coerced to string for the `githubRepoId` field
 */
export function normalizeGithubRepo(raw: RawGithubRepo): NormalizedGithubRepo {
  return {
    githubRepoId: String(raw.id),
    name: sanitizeName(raw.name),
    fullName: raw.full_name,
    description: sanitizeDescription(raw.description),
    url: raw.html_url,
    htmlUrl: raw.html_url,
    primaryLanguage: normalizeLanguage(raw.language),
    stars: clampNonNegative(raw.stargazers_count),
    forks: clampNonNegative(raw.forks_count),
    openIssues: clampNonNegative(raw.open_issues_count),
    isPrivate: Boolean(raw.private),
    isArchived: Boolean(raw.archived),
    isFork: Boolean(raw.fork),
    pushedAt: parseDate(raw.pushed_at),
  };
}

/**
 * Normalizes an array of raw GitHub repository objects.
 *
 * Repositories that fail normalization are silently skipped (logged to stderr)
 * so that a single malformed record does not abort the entire sync.
 */
export function normalizeGithubRepos(rawRepos: RawGithubRepo[]): NormalizedGithubRepo[] {
  const results: NormalizedGithubRepo[] = [];

  for (const raw of rawRepos) {
    try {
      results.push(normalizeGithubRepo(raw));
    } catch {
      // Skip malformed repo – log for observability
      console.warn(`[github-normalizer] Skipping malformed repo: ${raw?.full_name ?? raw?.id ?? "unknown"}`);
    }
  }

  return results;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Strips leading/trailing whitespace and collapses internal whitespace.
 * Falls back to "unknown" if the result is empty.
 */
function sanitizeName(name: string | null | undefined): string {
  const cleaned = (name ?? "unknown").trim().replace(/\s+/g, "-");
  return cleaned.length > 0 ? cleaned : "unknown";
}

/**
 * Trims description and truncates to 2000 chars (DB column limit safety).
 */
function sanitizeDescription(desc: string | null | undefined): string | null {
  if (desc == null) return null;
  const trimmed = desc.trim();
  if (trimmed.length === 0) return null;
  return trimmed.length > 2000 ? trimmed.slice(0, 2000) : trimmed;
}

/**
 * Normalizes language – empty strings become null.
 */
function normalizeLanguage(lang: string | null | undefined): string | null {
  if (lang == null) return null;
  const trimmed = lang.trim();
  return trimmed.length === 0 ? null : trimmed;
}

/**
 * Clamps to a non-negative integer.
 */
function clampNonNegative(value: number | null | undefined): number {
  const n = Number(value);
  return Number.isFinite(n) && n >= 0 ? Math.floor(n) : 0;
}

/**
 * Parses an ISO-8601 date string into a Date, returning null for
 * missing / invalid values.
 */
function parseDate(value: string | null | undefined): Date | null {
  if (value == null) return null;
  const d = new Date(value);
  return Number.isFinite(d.getTime()) ? d : null;
}
