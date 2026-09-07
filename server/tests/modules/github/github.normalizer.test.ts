import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  normalizeGithubRepo,
  normalizeGithubRepos,
} from "../../../src/infrastructure/github/normalizer.js";
import type { RawGithubRepo } from "../../../src/infrastructure/github/normalizer.js";

const makeRawRepo = (overrides: Partial<RawGithubRepo> = {}): RawGithubRepo => ({
  id: 12345,
  name: "my-repo",
  full_name: "testuser/my-repo",
  description: "A test repository",
  html_url: "https://github.com/testuser/my-repo",
  language: "TypeScript",
  stargazers_count: 42,
  forks_count: 7,
  open_issues_count: 3,
  private: false,
  archived: false,
  fork: false,
  pushed_at: "2024-06-15T10:30:00Z",
  ...overrides,
});

describe("normalizeGithubRepo", () => {
  describe("basic normalization", () => {
    it("maps a standard repo correctly", () => {
      const raw = makeRawRepo();
      const result = normalizeGithubRepo(raw);

      expect(result.githubRepoId).toBe("12345");
      expect(result.name).toBe("my-repo");
      expect(result.fullName).toBe("testuser/my-repo");
      expect(result.description).toBe("A test repository");
      expect(result.url).toBe("https://github.com/testuser/my-repo");
      expect(result.htmlUrl).toBe("https://github.com/testuser/my-repo");
      expect(result.primaryLanguage).toBe("TypeScript");
      expect(result.stars).toBe(42);
      expect(result.forks).toBe(7);
      expect(result.openIssues).toBe(3);
      expect(result.isPrivate).toBe(false);
      expect(result.isArchived).toBe(false);
      expect(result.isFork).toBe(false);
      expect(result.pushedAt).toBeInstanceOf(Date);
    });

    it("coerces numeric id to string", () => {
      const raw = makeRawRepo({ id: 999999 });
      const result = normalizeGithubRepo(raw);
      expect(result.githubRepoId).toBe("999999");
    });
  });

  describe("description handling", () => {
    it("returns null for null description", () => {
      const raw = makeRawRepo({ description: null });
      expect(normalizeGithubRepo(raw).description).toBeNull();
    });

    it("returns null for empty string description", () => {
      const raw = makeRawRepo({ description: "" });
      expect(normalizeGithubRepo(raw).description).toBeNull();
    });

    it("trims whitespace from description", () => {
      const raw = makeRawRepo({ description: "  hello world  " });
      expect(normalizeGithubRepo(raw).description).toBe("hello world");
    });

    it("truncates description to 2000 chars", () => {
      const longDesc = "a".repeat(3000);
      const raw = makeRawRepo({ description: longDesc });
      expect(normalizeGithubRepo(raw).description).toHaveLength(2000);
    });

    it("preserves description under 2000 chars", () => {
      const desc = "a".repeat(1999);
      const raw = makeRawRepo({ description: desc });
      expect(normalizeGithubRepo(raw).description).toHaveLength(1999);
    });
  });

  describe("language handling", () => {
    it("returns null for null language", () => {
      const raw = makeRawRepo({ language: null });
      expect(normalizeGithubRepo(raw).primaryLanguage).toBeNull();
    });

    it("returns null for empty string language", () => {
      const raw = makeRawRepo({ language: "" });
      expect(normalizeGithubRepo(raw).primaryLanguage).toBeNull();
    });

    it("trims whitespace from language", () => {
      const raw = makeRawRepo({ language: "  Rust  " });
      expect(normalizeGithubRepo(raw).primaryLanguage).toBe("Rust");
    });

    it("preserves valid language", () => {
      const raw = makeRawRepo({ language: "Go" });
      expect(normalizeGithubRepo(raw).primaryLanguage).toBe("Go");
    });
  });

  describe("counter fields", () => {
    it("defaults null counters to 0", () => {
      const raw = makeRawRepo({
        stargazers_count: null as any,
        forks_count: null as any,
        open_issues_count: null as any,
      });
      const result = normalizeGithubRepo(raw);
      expect(result.stars).toBe(0);
      expect(result.forks).toBe(0);
      expect(result.openIssues).toBe(0);
    });

    it("defaults undefined counters to 0", () => {
      const raw = makeRawRepo({
        stargazers_count: undefined as any,
        forks_count: undefined as any,
        open_issues_count: undefined as any,
      });
      const result = normalizeGithubRepo(raw);
      expect(result.stars).toBe(0);
      expect(result.forks).toBe(0);
      expect(result.openIssues).toBe(0);
    });

    it("floors negative counters to 0", () => {
      const raw = makeRawRepo({
        stargazers_count: -5,
        forks_count: -1,
        open_issues_count: -10,
      });
      const result = normalizeGithubRepo(raw);
      expect(result.stars).toBe(0);
      expect(result.forks).toBe(0);
      expect(result.openIssues).toBe(0);
    });

    it("floors decimal counters", () => {
      const raw = makeRawRepo({
        stargazers_count: 3.7,
        forks_count: 1.2,
      });
      const result = normalizeGithubRepo(raw);
      expect(result.stars).toBe(3);
      expect(result.forks).toBe(1);
    });
  });

  describe("boolean fields", () => {
    it("maps private repos", () => {
      const raw = makeRawRepo({ private: true });
      expect(normalizeGithubRepo(raw).isPrivate).toBe(true);
    });

    it("maps archived repos", () => {
      const raw = makeRawRepo({ archived: true });
      expect(normalizeGithubRepo(raw).isArchived).toBe(true);
    });

    it("maps forked repos", () => {
      const raw = makeRawRepo({ fork: true });
      expect(normalizeGithubRepo(raw).isFork).toBe(true);
    });

    it("treats falsy values as false", () => {
      const raw = makeRawRepo({
        private: 0 as any,
        archived: "" as any,
        fork: null as any,
      });
      const result = normalizeGithubRepo(raw);
      expect(result.isPrivate).toBe(false);
      expect(result.isArchived).toBe(false);
      expect(result.isFork).toBe(false);
    });
  });

  describe("date handling", () => {
    it("parses valid ISO date string", () => {
      const raw = makeRawRepo({ pushed_at: "2024-01-15T12:00:00Z" });
      const result = normalizeGithubRepo(raw);
      expect(result.pushedAt).toBeInstanceOf(Date);
      expect(result.pushedAt!.toISOString()).toBe("2024-01-15T12:00:00.000Z");
    });

    it("returns null for null pushed_at", () => {
      const raw = makeRawRepo({ pushed_at: null });
      expect(normalizeGithubRepo(raw).pushedAt).toBeNull();
    });

    it("returns null for undefined pushed_at", () => {
      const raw = makeRawRepo({ pushed_at: undefined as any });
      expect(normalizeGithubRepo(raw).pushedAt).toBeNull();
    });

    it("returns null for invalid date string", () => {
      const raw = makeRawRepo({ pushed_at: "not-a-date" });
      expect(normalizeGithubRepo(raw).pushedAt).toBeNull();
    });
  });

  describe("name sanitization", () => {
    it("trims leading/trailing whitespace", () => {
      const raw = makeRawRepo({ name: "  my-repo  " });
      expect(normalizeGithubRepo(raw).name).toBe("my-repo");
    });

    it("collapses internal whitespace to hyphens", () => {
      const raw = makeRawRepo({ name: "my  repo  name" });
      expect(normalizeGithubRepo(raw).name).toBe("my-repo-name");
    });

    it("returns 'unknown' for null name", () => {
      const raw = makeRawRepo({ name: null as any });
      expect(normalizeGithubRepo(raw).name).toBe("unknown");
    });

    it("returns 'unknown' for empty name", () => {
      const raw = makeRawRepo({ name: "" });
      expect(normalizeGithubRepo(raw).name).toBe("unknown");
    });

    it("returns 'unknown' for whitespace-only name", () => {
      const raw = makeRawRepo({ name: "   " });
      expect(normalizeGithubRepo(raw).name).toBe("unknown");
    });
  });
});

describe("normalizeGithubRepos", () => {
  it("normalizes an array of repos", () => {
    const rawRepos = [
      makeRawRepo({ id: 1, name: "repo-1" }),
      makeRawRepo({ id: 2, name: "repo-2" }),
      makeRawRepo({ id: 3, name: "repo-3" }),
    ];

    const results = normalizeGithubRepos(rawRepos);
    expect(results).toHaveLength(3);
    expect(results[0].name).toBe("repo-1");
    expect(results[1].name).toBe("repo-2");
    expect(results[2].name).toBe("repo-3");
  });

  it("returns empty array for empty input", () => {
    expect(normalizeGithubRepos([])).toEqual([]);
  });

  it("skips malformed repos gracefully", () => {
    const consoleSpy = vi.spyOn(console, "warn").mockImplementation(() => {});

    const rawRepos = [
      makeRawRepo({ id: 1, name: "good-repo" }),
      null as any,
      makeRawRepo({ id: 3, name: "another-good-repo" }),
    ];

    const results = normalizeGithubRepos(rawRepos);
    expect(results).toHaveLength(2);
    expect(results[0].name).toBe("good-repo");
    expect(results[1].name).toBe("another-good-repo");
    expect(consoleSpy).toHaveBeenCalled();

    consoleSpy.mockRestore();
  });

  it("skips repos that throw during normalization", () => {
    const consoleSpy = vi.spyOn(console, "warn").mockImplementation(() => {});

    const rawRepos = [
      makeRawRepo({ id: 1, name: "good-repo" }),
      { id: "bad", name: 123 } as any, // Will throw when accessing properties
      makeRawRepo({ id: 3, name: "another-good-repo" }),
    ];

    const results = normalizeGithubRepos(rawRepos);
    expect(results).toHaveLength(2);

    consoleSpy.mockRestore();
  });
});
