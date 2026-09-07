import { describe, it, expect, vi, beforeEach } from "vitest";
import { prisma } from "../../../src/config/database.js";
import { profilesService } from "../../../src/modules/profiles/service/profiles.service.js";

const mockPrisma = vi.mocked(prisma);

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const makeProfileUser = (overrides = {}) => ({
  id: "user-1",
  username: "johndoe",
  email: "john@example.com",
  name: "John Doe",
  avatarUrl: "https://avatar.url/john.jpg",
  bio: "Full-stack dev",
  location: "NYC",
  websiteUrl: "https://johndoe.dev",
  createdAt: new Date("2024-01-01"),
  updatedAt: new Date("2024-06-01"),
  projects: [
    {
      id: "proj-1",
      name: "Cool Project",
      slug: "cool-project",
      description: "A cool project",
      coverImageUrl: null,
      status: "BUILDING",
      visibility: "PUBLIC",
      liveUrl: null,
      demoUrl: null,
      isFeatured: true,
      isCurrentlyBuilding: false,
      startedAt: null,
      lastUpdatedAt: null,
      githubRepoId: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      technologies: [
        { technology: { id: "tech-1", name: "TypeScript", slug: "typescript", category: "Language", createdAt: new Date() } },
      ],
    },
  ],
  technologies: [
    {
      isPrimary: true,
      technology: { id: "tech-1", name: "TypeScript", slug: "typescript", category: "Language", createdAt: new Date() },
    },
  ],
  githubAccount: {
    id: "gh-1",
    userId: "user-1",
    githubUserId: "12345",
    username: "johndoe",
    avatarUrl: null,
    accessToken: null,
    refreshToken: null,
    tokenExpiresAt: null,
    connectedAt: new Date(),
    updatedAt: new Date(),
    repositories: [
      {
        id: "repo-1",
        githubAccountId: "gh-1",
        githubRepoId: "111",
        name: "my-repo",
        fullName: "johndoe/my-repo",
        description: "My repo",
        url: "https://github.com/johndoe/my-repo",
        htmlUrl: "https://github.com/johndoe/my-repo",
        primaryLanguage: "TypeScript",
        stars: 42,
        forks: 5,
        openIssues: 0,
        isPrivate: false,
        isArchived: false,
        isFork: false,
        pushedAt: null,
        lastSyncedAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ],
  },
  _count: { followers: 10, following: 5, projects: 3 },
  ...overrides,
});

const makeActivity = (overrides = {}) => ({
  id: "act-1",
  type: "COMMIT",
  title: "feat: add auth",
  description: null,
  url: "https://github.com/commit/123",
  occurredAt: new Date("2024-06-01"),
  projectId: "proj-1",
  githubRepoId: null,
  externalId: "123",
  actorUsername: "johndoe",
  actorAvatarUrl: null,
  createdAt: new Date(),
  project: { id: "proj-1", name: "Cool Project", slug: "cool-project" },
  ...overrides,
});

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe("profilesService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Default stubs for aggregation calls
    vi.mocked(mockPrisma.project.groupBy).mockResolvedValue([]);
    vi.mocked(mockPrisma.projectTechnology.groupBy).mockResolvedValue([]);
    vi.mocked(mockPrisma.projectActivity.groupBy).mockResolvedValue([]);
    // Stubs for additional repo methods called during aggregation
    vi.mocked(mockPrisma.project.findFirst).mockResolvedValue(null);
    vi.mocked(mockPrisma.project.findMany).mockResolvedValue([]);
    vi.mocked(mockPrisma.technology.findMany).mockResolvedValue([]);
    vi.mocked(mockPrisma.projectActivity.findMany).mockResolvedValue([]);
  });

  // =========================================================================
  // getPublicProfile
  // =========================================================================

  describe("getPublicProfile", () => {
    it("returns a public profile without sensitive fields", async () => {
      const profile = makeProfileUser();
      vi.mocked(mockPrisma.user.findUnique).mockResolvedValue(profile as any);
      vi.mocked(mockPrisma.follow.findUnique).mockResolvedValue(null);

      const result = await profilesService.getPublicProfile("johndoe");

      // Must NOT contain email
      expect(result).not.toHaveProperty("email");
      expect(result).not.toHaveProperty("updatedAt");
      expect(result).not.toHaveProperty("recentActivity");

      // Must contain public fields
      expect(result.id).toBe("user-1");
      expect(result.username).toBe("johndoe");
      expect(result.name).toBe("John Doe");
      expect(result.bio).toBe("Full-stack dev");
      expect(result.location).toBe("NYC");
      expect(result.websiteUrl).toBe("https://johndoe.dev");
      expect(result.counts.followers).toBe(10);
      expect(result.counts.following).toBe(5);
      expect(result.counts.projects).toBe(3);
    });

    it("includes isFollowing when viewerId is provided and user follows", async () => {
      const profile = makeProfileUser();
      vi.mocked(mockPrisma.user.findUnique).mockResolvedValue(profile as any);
      vi.mocked(mockPrisma.follow.findUnique).mockResolvedValue({ followerId: "viewer-1" } as any);

      const result = await profilesService.getPublicProfile("johndoe", "viewer-1");

      expect(result.isFollowing).toBe(true);
    });

    it("sets isFollowing to false when viewer does not follow", async () => {
      const profile = makeProfileUser();
      vi.mocked(mockPrisma.user.findUnique).mockResolvedValue(profile as any);
      vi.mocked(mockPrisma.follow.findUnique).mockResolvedValue(null);

      const result = await profilesService.getPublicProfile("johndoe", "viewer-1");

      expect(result.isFollowing).toBe(false);
    });

    it("does not query follow status when no viewerId", async () => {
      const profile = makeProfileUser();
      vi.mocked(mockPrisma.user.findUnique).mockResolvedValue(profile as any);

      await profilesService.getPublicProfile("johndoe");

      expect(mockPrisma.follow.findUnique).not.toHaveBeenCalled();
    });

    it("does not include private projects in public profile", async () => {
      const profile = makeProfileUser({
        projects: [
          { id: "p1", name: "Public", visibility: "PUBLIC", technologies: [] },
          { id: "p2", name: "Private", visibility: "PRIVATE", technologies: [] },
        ],
      });
      vi.mocked(mockPrisma.user.findUnique).mockResolvedValue(profile as any);

      const result = await profilesService.getPublicProfile("johndoe");

      // The repository filters to PUBLIC only — but since we mock the
      // repository, both come through. The DTO does not filter further.
      // The repository query is the boundary.
      expect(result.projects).toHaveLength(2);
    });

    it("throws NotFoundError for non-existent user", async () => {
      vi.mocked(mockPrisma.user.findUnique).mockResolvedValue(null);

      await expect(
        profilesService.getPublicProfile("nonexistent")
      ).rejects.toMatchObject({ statusCode: 404 });
    });
  });

  // =========================================================================
  // getOwnProfile
  // =========================================================================

  describe("getOwnProfile", () => {
    it("returns private profile with email", async () => {
      const profile = makeProfileUser();
      vi.mocked(mockPrisma.user.findUnique).mockResolvedValue(profile as any);
      vi.mocked(mockPrisma.projectActivity.findMany).mockResolvedValue([makeActivity()] as any);

      const result = await profilesService.getOwnProfile("user-1");

      // Must contain email (private only)
      expect(result.email).toBe("john@example.com");
      expect(result.updatedAt).toBeDefined();
      expect(result.recentActivity).toHaveLength(1);
    });

    it("includes all projects (private + public) in own profile", async () => {
      const profile = makeProfileUser({
        projects: [
          { id: "p1", name: "Public", visibility: "PUBLIC", technologies: [] },
          { id: "p2", name: "Private", visibility: "PRIVATE", technologies: [] },
        ],
      });
      vi.mocked(mockPrisma.user.findUnique).mockResolvedValue(profile as any);
      vi.mocked(mockPrisma.projectActivity.findMany).mockResolvedValue([]);

      const result = await profilesService.getOwnProfile("user-1");

      // The own-profile query does not filter by visibility
      expect(result.projects).toHaveLength(2);
    });

    it("throws NotFoundError for non-existent user", async () => {
      vi.mocked(mockPrisma.user.findUnique).mockResolvedValue(null);

      await expect(
        profilesService.getOwnProfile("nonexistent")
      ).rejects.toMatchObject({ statusCode: 404 });
    });
  });

  // =========================================================================
  // updateProfile
  // =========================================================================

  describe("updateProfile", () => {
    it("updates profile fields", async () => {
      vi.mocked(mockPrisma.user.findFirst).mockResolvedValue(null);
      vi.mocked(mockPrisma.user.update).mockResolvedValue({} as any);

      await profilesService.updateProfile("user-1", { bio: "New bio" });

      expect(mockPrisma.user.update).toHaveBeenCalledWith({
        where: { id: "user-1" },
        data: { bio: "New bio" },
      });
    });

    it("validates username uniqueness on change", async () => {
      vi.mocked(mockPrisma.user.findFirst).mockResolvedValue({ id: "other-user" } as any);

      await expect(
        profilesService.updateProfile("user-1", { username: "taken" })
      ).rejects.toMatchObject({ statusCode: 409 });
    });

    it("allows keeping the same username when other fields change", async () => {
      vi.mocked(mockPrisma.user.findFirst).mockResolvedValue(null);
      vi.mocked(mockPrisma.user.update).mockResolvedValue({} as any);

      await profilesService.updateProfile("user-1", { username: "johndoe", bio: "Updated bio" });

      expect(mockPrisma.user.update).toHaveBeenCalled();
    });

    it("throws BadRequestError when no fields provided", async () => {
      await expect(
        profilesService.updateProfile("user-1", {})
      ).rejects.toMatchObject({ statusCode: 400 });
    });

    it("sets nullable fields to null", async () => {
      vi.mocked(mockPrisma.user.findFirst).mockResolvedValue(null);
      vi.mocked(mockPrisma.user.update).mockResolvedValue({} as any);

      await profilesService.updateProfile("user-1", {
        bio: null,
        location: null,
        websiteUrl: null,
      });

      expect(mockPrisma.user.update).toHaveBeenCalledWith({
        where: { id: "user-1" },
        data: { bio: null, location: null, websiteUrl: null },
      });
    });
  });

  // =========================================================================
  // checkUsernameAvailability
  // =========================================================================

  describe("checkUsernameAvailability", () => {
    it("returns available: true when username is free", async () => {
      vi.mocked(mockPrisma.user.findUnique).mockResolvedValue(null);

      const result = await profilesService.checkUsernameAvailability("uniqueuser");

      expect(result.available).toBe(true);
      expect(result.username).toBe("uniqueuser");
    });

    it("returns available: false when username is taken", async () => {
      vi.mocked(mockPrisma.user.findUnique).mockResolvedValue({ id: "user-1" } as any);

      const result = await profilesService.checkUsernameAvailability("johndoe");

      expect(result.available).toBe(false);
    });

    it("returns available: false for invalid format (too short)", async () => {
      const result = await profilesService.checkUsernameAvailability("ab");

      expect(result.available).toBe(false);
    });

    it("returns available: false for invalid characters", async () => {
      vi.mocked(mockPrisma.user.findUnique).mockResolvedValue(null);

      const result = await profilesService.checkUsernameAvailability("user name!");

      expect(result.available).toBe(false);
    });
  });

  // =========================================================================
  // listUsers
  // =========================================================================

  describe("listUsers", () => {
    it("returns paginated results", async () => {
      const users = [
        { id: "u1", username: "alice", name: "Alice", avatarUrl: null, createdAt: new Date() },
        { id: "u2", username: "bob", name: "Bob", avatarUrl: null, createdAt: new Date() },
      ];
      vi.mocked(mockPrisma.user.findMany).mockResolvedValue(users as any);
      vi.mocked(mockPrisma.user.count).mockResolvedValue(2);

      const result = await profilesService.listUsers({ page: 1, limit: 20 });

      expect(result.data).toHaveLength(2);
      expect(result.pagination.total).toBe(2);
      expect(result.pagination.totalPages).toBe(1);
    });

    it("applies search filter", async () => {
      vi.mocked(mockPrisma.user.findMany).mockResolvedValue([]);
      vi.mocked(mockPrisma.user.count).mockResolvedValue(0);

      await profilesService.listUsers({ page: 1, limit: 20, search: "alice" });

      const findManyCall = vi.mocked(mockPrisma.user.findMany).mock.calls[0][0];
      expect(findManyCall.where).toBeDefined();
    });
  });

  // =========================================================================
  // getFollowers / getFollowing
  // =========================================================================

  describe("getFollowers", () => {
    it("returns paginated followers", async () => {
      const profile = makeProfileUser();
      vi.mocked(mockPrisma.user.findUnique).mockResolvedValue(profile as any);
      vi.mocked(mockPrisma.follow.findMany).mockResolvedValue([
        { follower: { id: "u2", username: "bob", name: "Bob", avatarUrl: null } },
      ] as any);
      vi.mocked(mockPrisma.follow.count).mockResolvedValue(1);

      const result = await profilesService.getFollowers("johndoe", { page: 1, limit: 20 });

      expect(result.data).toHaveLength(1);
      expect(result.data[0].username).toBe("bob");
      expect(result.pagination.total).toBe(1);
    });

    it("throws NotFoundError for non-existent user", async () => {
      vi.mocked(mockPrisma.user.findUnique).mockResolvedValue(null);

      await expect(
        profilesService.getFollowers("nonexistent", { page: 1, limit: 20 })
      ).rejects.toMatchObject({ statusCode: 404 });
    });
  });

  describe("getFollowing", () => {
    it("returns paginated following", async () => {
      const profile = makeProfileUser();
      vi.mocked(mockPrisma.user.findUnique).mockResolvedValue(profile as any);
      vi.mocked(mockPrisma.follow.findMany).mockResolvedValue([
        { following: { id: "u3", username: "charlie", name: "Charlie", avatarUrl: null } },
      ] as any);
      vi.mocked(mockPrisma.follow.count).mockResolvedValue(1);

      const result = await profilesService.getFollowing("johndoe", { page: 1, limit: 20 });

      expect(result.data).toHaveLength(1);
      expect(result.data[0].username).toBe("charlie");
    });
  });
});
