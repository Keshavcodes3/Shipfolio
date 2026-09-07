import { describe, it, expect, vi, beforeEach } from "vitest";
import { prisma } from "../../../src/config/database.js";
import { profilesService } from "../../../src/modules/profiles/service/profiles.service.js";
import { followsService } from "../../../src/modules/follows/service/follows.service.js";
import { projectsService } from "../../../src/modules/projects/service/projects.service.js";
import { activityService } from "../../../src/modules/activity/service/activity.service.js";

// ---------------------------------------------------------------------------
// Mocks
// ---------------------------------------------------------------------------

vi.mock("../../../src/shared/cache.js", () => ({
  getCachedProfile: vi.fn().mockResolvedValue(null),
  setCachedProfile: vi.fn().mockResolvedValue(undefined),
  invalidateProfileCache: vi.fn().mockResolvedValue(undefined),
}));

const mockPrisma = vi.mocked(prisma);

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const makePublicUser = (overrides = {}) => ({
  id: "user-1",
  username: "janedoe",
  email: "jane@example.com",
  name: "Jane Doe",
  avatarUrl: "https://avatar.url/jane.jpg",
  bio: "Building cool things",
  location: "London",
  websiteUrl: "https://janedoe.dev",
  createdAt: new Date("2024-01-01"),
  updatedAt: new Date("2024-06-01"),
  projects: [
    {
      id: "proj-public",
      name: "Public App",
      slug: "public-app",
      description: "A public app",
      coverImageUrl: "https://cover.url/img.jpg",
      status: "SHIPPED",
      visibility: "PUBLIC",
      liveUrl: "https://public-app.dev",
      demoUrl: null,
      isFeatured: true,
      isCurrentlyBuilding: false,
      startedAt: new Date("2024-01-15"),
      lastUpdatedAt: null,
      githubRepoId: "repo-1",
      createdAt: new Date(),
      updatedAt: new Date(),
      technologies: [
        { technology: { id: "tech-1", name: "TypeScript", slug: "typescript", category: "Language", createdAt: new Date() } },
      ],
      githubRepo: {
        id: "repo-1",
        name: "public-app",
        fullName: "janedoe/public-app",
        htmlUrl: "https://github.com/janedoe/public-app",
        primaryLanguage: "TypeScript",
        stars: 15,
        forks: 3,
      },
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
    githubUserId: "99999",
    username: "janedoe",
    avatarUrl: "https://avatar.url/github.jpg",
    accessToken: "ghp_SECRET_TOKEN_abc123",
    refreshToken: "ghr_REFRESH_TOKEN_xyz",
    tokenExpiresAt: new Date("2025-01-01"),
    connectedAt: new Date(),
    updatedAt: new Date(),
    // Only public repos are returned by the profile query (isPrivate: false filter)
    repositories: [
      {
        id: "repo-1",
        githubAccountId: "gh-1",
        githubRepoId: "111",
        name: "public-app",
        fullName: "janedoe/public-app",
        description: "My public app",
        url: "https://github.com/janedoe/public-app",
        htmlUrl: "https://github.com/janedoe/public-app",
        primaryLanguage: "TypeScript",
        stars: 15,
        forks: 3,
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
  _count: { followers: 42, following: 7, projects: 3 },
  ...overrides,
});

const makeCurrentlyBuilding = (overrides = {}) => ({
  id: "proj-building",
  name: "Active Build",
  slug: "active-build",
  description: "Currently building this",
  coverImageUrl: null,
  status: "BUILDING",
  visibility: "PUBLIC",
  liveUrl: null,
  demoUrl: null,
  isFeatured: false,
  isCurrentlyBuilding: true,
  startedAt: new Date("2024-06-01"),
  lastUpdatedAt: null,
  githubRepoId: null,
  createdAt: new Date(),
  updatedAt: new Date(),
  technologies: [],
  githubRepo: null,
  ...overrides,
});

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe("Visitor journey — public profile", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockPrisma.project.groupBy.mockResolvedValue([]);
    mockPrisma.projectTechnology.groupBy.mockResolvedValue([]);
    mockPrisma.projectActivity.groupBy.mockResolvedValue([]);
    mockPrisma.project.findFirst.mockResolvedValue(null);
    mockPrisma.project.findMany.mockResolvedValue([]);
    mockPrisma.technology.findMany.mockResolvedValue([]);
    mockPrisma.projectActivity.findMany.mockResolvedValue([]);
  });

  // =========================================================================
  // Step 1: Visitor opens /username — loads profile
  // =========================================================================

  describe("GET /profiles/:username", () => {
    it("returns all expected public profile fields", async () => {
      const user = makePublicUser();
      vi.mocked(mockPrisma.user.findUnique).mockResolvedValue(user as any);
      vi.mocked(mockPrisma.follow.findUnique).mockResolvedValue(null);

      const result = await profilesService.getPublicProfile("janedoe");

      expect(result.id).toBe("user-1");
      expect(result.username).toBe("janedoe");
      expect(result.name).toBe("Jane Doe");
      expect(result.avatarUrl).toBe("https://avatar.url/jane.jpg");
      expect(result.bio).toBe("Building cool things");
      expect(result.location).toBe("London");
      expect(result.websiteUrl).toBe("https://janedoe.dev");
      expect(result.createdAt).toEqual(new Date("2024-01-01"));
    });

    it("does NOT expose email", async () => {
      const user = makePublicUser();
      vi.mocked(mockPrisma.user.findUnique).mockResolvedValue(user as any);

      const result = await profilesService.getPublicProfile("janedoe");

      expect(result).not.toHaveProperty("email");
    });

    it("does NOT expose updatedAt", async () => {
      const user = makePublicUser();
      vi.mocked(mockPrisma.user.findUnique).mockResolvedValue(user as any);

      const result = await profilesService.getPublicProfile("janedoe");

      expect(result).not.toHaveProperty("updatedAt");
    });

    it("does NOT expose recentActivity (private profile field)", async () => {
      const user = makePublicUser();
      vi.mocked(mockPrisma.user.findUnique).mockResolvedValue(user as any);

      const result = await profilesService.getPublicProfile("janedoe");

      expect(result).not.toHaveProperty("recentActivity");
    });

    it("returns follower/following/project counts", async () => {
      const user = makePublicUser();
      vi.mocked(mockPrisma.user.findUnique).mockResolvedValue(user as any);

      const result = await profilesService.getPublicProfile("janedoe");

      expect(result.counts.followers).toBe(42);
      expect(result.counts.following).toBe(7);
      expect(result.counts.projects).toBe(3);
    });

    it("includes technologies", async () => {
      const user = makePublicUser();
      vi.mocked(mockPrisma.user.findUnique).mockResolvedValue(user as any);

      const result = await profilesService.getPublicProfile("janedoe");

      expect(result.technologies).toHaveLength(1);
      expect(result.technologies[0].name).toBe("TypeScript");
    });

    it("includes GitHub repos (public only)", async () => {
      const user = makePublicUser();
      vi.mocked(mockPrisma.user.findUnique).mockResolvedValue(user as any);

      const result = await profilesService.getPublicProfile("janedoe");

      // DB filters isPrivate: false, so only public repos returned
      expect(result.githubRepos).toHaveLength(1);
      expect(result.githubRepos[0].name).toBe("public-app");
      expect(result.githubRepos[0].stars).toBe(15);
    });

    it("does NOT expose GitHub access tokens", async () => {
      const user = makePublicUser();
      vi.mocked(mockPrisma.user.findUnique).mockResolvedValue(user as any);

      const result = await profilesService.getPublicProfile("janedoe");

      const json = JSON.stringify(result);
      expect(json).not.toContain("ghp_SECRET_TOKEN");
      expect(json).not.toContain("ghr_REFRESH_TOKEN");
      expect(json).not.toContain("SECRET_TOKEN_abc123");
      expect(json).not.toContain("REFRESH_TOKEN_xyz");
    });

    it("does NOT include isPrivate in GitHub repo data", async () => {
      const user = makePublicUser();
      vi.mocked(mockPrisma.user.findUnique).mockResolvedValue(user as any);

      const result = await profilesService.getPublicProfile("janedoe");

      expect(result.githubRepos[0]).not.toHaveProperty("isPrivate");
    });
  });

  // =========================================================================
  // Step 2: Currently building project
  // =========================================================================

  describe("currently building", () => {
    it("surfaces the currently-building project", async () => {
      const user = makePublicUser();
      const building = makeCurrentlyBuilding();
      vi.mocked(mockPrisma.user.findUnique).mockResolvedValue(user as any);
      vi.mocked(mockPrisma.project.findFirst).mockResolvedValue(building as any);

      const result = await profilesService.getPublicProfile("janedoe");

      expect(result.currentlyBuilding).not.toBeNull();
      expect(result.currentlyBuilding!.name).toBe("Active Build");
      expect(result.currentlyBuilding!.isCurrentlyBuilding).toBe(true);
    });

    it("returns null when no currently-building project", async () => {
      const user = makePublicUser();
      vi.mocked(mockPrisma.user.findUnique).mockResolvedValue(user as any);
      vi.mocked(mockPrisma.project.findFirst).mockResolvedValue(null);

      const result = await profilesService.getPublicProfile("janedoe");

      expect(result.currentlyBuilding).toBeNull();
    });
  });

  // =========================================================================
  // Step 3: Featured projects
  // =========================================================================

  describe("featured projects", () => {
    it("includes featured projects in profile", async () => {
      const user = makePublicUser();
      vi.mocked(mockPrisma.user.findUnique).mockResolvedValue(user as any);
      vi.mocked(mockPrisma.project.findMany).mockResolvedValue([
        {
          id: "proj-featured",
          name: "Featured App",
          slug: "featured-app",
          description: null,
          coverImageUrl: null,
          status: "SHIPPED",
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
          technologies: [],
          githubRepo: null,
        },
      ] as any);

      const result = await profilesService.getPublicProfile("janedoe");

      expect(result.featuredProjects).toHaveLength(1);
      expect(result.featuredProjects[0].isFeatured).toBe(true);
    });
  });

  // =========================================================================
  // Step 4: Project detail — visibility enforcement
  // =========================================================================

  describe("project visibility", () => {
    it("public visitor can see PUBLIC projects", async () => {
      const project = {
        id: "proj-1",
        name: "Public Project",
        slug: "public-project",
        description: "Visible to all",
        coverImageUrl: null,
        status: "SHIPPED",
        visibility: "PUBLIC",
        liveUrl: null,
        demoUrl: null,
        isFeatured: false,
        isCurrentlyBuilding: false,
        startedAt: null,
        githubRepoId: null,
        userId: "user-1",
        createdAt: new Date(),
        updatedAt: new Date(),
        technologies: [],
        githubRepo: null,
        _count: { activities: 5 },
      };

      vi.mocked(mockPrisma.project.findUnique).mockResolvedValue(project as any);

      const result = await projectsService.getById("proj-1");

      expect(result.name).toBe("Public Project");
    });

    it("public visitor CANNOT see PRIVATE projects", async () => {
      const project = {
        id: "proj-private",
        name: "Private Project",
        slug: "private-project",
        description: "Secret stuff",
        coverImageUrl: null,
        status: "BUILDING",
        visibility: "PRIVATE",
        liveUrl: null,
        demoUrl: null,
        isFeatured: false,
        isCurrentlyBuilding: false,
        startedAt: null,
        githubRepoId: null,
        userId: "user-1",
        createdAt: new Date(),
        updatedAt: new Date(),
        technologies: [],
        githubRepo: null,
        _count: { activities: 0 },
      };

      vi.mocked(mockPrisma.project.findUnique).mockResolvedValue(project as any);

      await expect(projectsService.getById("proj-private")).rejects.toThrow("Project not found");
    });

    it("PRIVATE project cannot leak through project listing", async () => {
      vi.mocked(mockPrisma.project.findMany).mockResolvedValue([]);
      vi.mocked(mockPrisma.project.count).mockResolvedValue(0);

      const result = await projectsService.listPublic({});

      expect(result.data).toHaveLength(0);
      expect(mockPrisma.project.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({ visibility: "PUBLIC" }),
        }),
      );
    });

    it("PRIVATE project cannot leak through featured listing", async () => {
      vi.mocked(mockPrisma.project.findMany).mockResolvedValue([]);

      const result = await projectsService.listFeatured("user-1");

      expect(result).toHaveLength(0);
      expect(mockPrisma.project.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({ visibility: "PUBLIC" }),
        }),
      );
    });

    it("PRIVATE currently-building project is not surfaced", async () => {
      vi.mocked(mockPrisma.project.findFirst).mockResolvedValue(null);

      const result = await projectsService.getCurrentlyBuilding("user-1");

      expect(result).toBeNull();
      expect(mockPrisma.project.findFirst).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({ visibility: "PUBLIC" }),
        }),
      );
    });

    it("owner CAN see their own PRIVATE project", async () => {
      const project = {
        id: "proj-private",
        name: "Private Project",
        slug: "private-project",
        description: "Secret stuff",
        coverImageUrl: null,
        status: "BUILDING",
        visibility: "PRIVATE",
        liveUrl: null,
        demoUrl: null,
        isFeatured: false,
        isCurrentlyBuilding: false,
        startedAt: null,
        githubRepoId: null,
        userId: "user-1",
        createdAt: new Date(),
        updatedAt: new Date(),
        technologies: [],
        githubRepo: null,
        _count: { activities: 0 },
        activities: [],
      };

      vi.mocked(mockPrisma.project.findUnique).mockResolvedValue(project as any);

      const result = await projectsService.getById("proj-private", "user-1");

      expect(result.name).toBe("Private Project");
    });
  });

  // =========================================================================
  // Step 5: Activity routes — no private data leak
  // =========================================================================

  describe("activity privacy", () => {
    it("activity list only returns activities from PUBLIC projects", async () => {
      vi.mocked(mockPrisma.projectActivity.findMany).mockResolvedValue([]);

      const result = await activityService.list({});

      expect(mockPrisma.projectActivity.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            project: { visibility: "PUBLIC" },
          }),
        }),
      );
    });

    it("activity getById rejects activities from PRIVATE projects", async () => {
      vi.mocked(mockPrisma.projectActivity.findUnique).mockResolvedValue({
        id: "act-1",
        projectId: "proj-private",
        type: "COMMIT",
        externalId: "123",
        title: "secret commit",
        description: null,
        url: null,
        occurredAt: new Date(),
        createdAt: new Date(),
      } as any);

      vi.mocked(mockPrisma.project.findUnique).mockResolvedValue({
        visibility: "PRIVATE",
      } as any);

      await expect(activityService.getById("act-1")).rejects.toThrow("Activity not found");
    });

    it("activity getById allows activities from PUBLIC projects", async () => {
      vi.mocked(mockPrisma.projectActivity.findUnique).mockResolvedValue({
        id: "act-1",
        projectId: "proj-public",
        type: "COMMIT",
        externalId: "123",
        title: "public commit",
        description: null,
        url: null,
        occurredAt: new Date(),
        createdAt: new Date(),
      } as any);

      vi.mocked(mockPrisma.project.findUnique).mockResolvedValue({
        visibility: "PUBLIC",
      } as any);

      const result = await activityService.getById("act-1");
      expect(result.title).toBe("public commit");
    });
  });

  // =========================================================================
  // Step 6: Follow/unfollow flow
  // =========================================================================

  describe("follow flow", () => {
    it("visitor can follow a developer", async () => {
      // visitor is user-2, target is user-1 (janedoe)
      vi.mocked(mockPrisma.user.findUnique).mockResolvedValue({ id: "target-user" } as any);
      vi.mocked(mockPrisma.follow.findUnique).mockResolvedValue(null);
      vi.mocked(mockPrisma.follow.create).mockResolvedValue({} as any);
      vi.mocked(mockPrisma.follow.count).mockResolvedValue(43);

      const result = await followsService.follow("visitor-user", "janedoe");

      expect(result.following).toBe(true);
      expect(result.followers).toBe(43);
    });

    it("duplicate follow is idempotent", async () => {
      vi.mocked(mockPrisma.user.findUnique).mockResolvedValue({ id: "target-user" } as any);
      vi.mocked(mockPrisma.follow.findUnique).mockResolvedValue({ followerId: "visitor-user" } as any);
      vi.mocked(mockPrisma.follow.count).mockResolvedValue(42);

      const result = await followsService.follow("visitor-user", "janedoe");

      expect(result.following).toBe(true);
      expect(mockPrisma.follow.create).not.toHaveBeenCalled();
    });

    it("self-follow is rejected", async () => {
      vi.mocked(mockPrisma.user.findUnique).mockResolvedValue({ id: "self-user" } as any);

      await expect(followsService.follow("self-user", "janedoe")).rejects.toThrow(
        "You cannot follow yourself",
      );
    });

    it("unfollow works", async () => {
      vi.mocked(mockPrisma.user.findUnique).mockResolvedValue({ id: "target-user" } as any);
      vi.mocked(mockPrisma.follow.deleteMany).mockResolvedValue({ count: 1 } as any);
      vi.mocked(mockPrisma.follow.count).mockResolvedValue(41);

      const result = await followsService.unfollow("visitor-user", "janedoe");

      expect(result.following).toBe(false);
      expect(result.followers).toBe(41);
    });

    it("unfollow is idempotent when not following", async () => {
      vi.mocked(mockPrisma.user.findUnique).mockResolvedValue({ id: "target-user" } as any);
      vi.mocked(mockPrisma.follow.deleteMany).mockResolvedValue({ count: 0 } as any);
      vi.mocked(mockPrisma.follow.count).mockResolvedValue(42);

      const result = await followsService.unfollow("visitor-user", "janedoe");

      expect(result.following).toBe(false);
      expect(result.followers).toBe(42);
    });

    it("follow on nonexistent user is rejected", async () => {
      vi.mocked(mockPrisma.user.findUnique).mockResolvedValue(null);

      await expect(followsService.follow("visitor-user", "nonexistent")).rejects.toThrow("User not found");
    });
  });

  // =========================================================================
  // Step 7: GitHub activity summary — no private project stats leak
  // =========================================================================

  describe("GitHub activity summary privacy", () => {
    it("only counts activities from PUBLIC projects", async () => {
      const user = makePublicUser();
      vi.mocked(mockPrisma.user.findUnique).mockResolvedValue(user as any);
      vi.mocked(mockPrisma.projectActivity.groupBy).mockResolvedValue([
        { type: "COMMIT", _count: { type: 25 }, _max: { occurredAt: new Date() } },
      ] as any);

      await profilesService.getPublicProfile("janedoe");

      expect(mockPrisma.projectActivity.groupBy).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            project: expect.objectContaining({ visibility: "PUBLIC" }),
          }),
        }),
      );
    });
  });

  // =========================================================================
  // Step 8: Build timeline — no private projects
  // =========================================================================

  describe("build timeline privacy", () => {
    it("only includes PUBLIC projects in timeline", async () => {
      const user = makePublicUser();
      vi.mocked(mockPrisma.user.findUnique).mockResolvedValue(user as any);
      vi.mocked(mockPrisma.project.findMany).mockResolvedValue([
        {
          id: "proj-1",
          name: "Public App",
          slug: "public-app",
          status: "SHIPPED",
          startedAt: new Date("2024-01-15"),
          updatedAt: new Date("2024-06-01"),
          technologies: [],
        },
      ] as any);

      await profilesService.getPublicProfile("janedoe");

      // findMany is called for: timeline, featured, and user projects (via profileInclude)
      // All calls should filter by visibility: PUBLIC
      const calls = mockPrisma.project.findMany.mock.calls;
      for (const call of calls) {
        const where = (call[0] as any)?.where;
        if (where?.userId) {
          expect(where.visibility).toBe("PUBLIC");
        }
      }
    });
  });

  // =========================================================================
  // Step 9: Technology stack
  // =========================================================================

  describe("technology stack", () => {
    it("only counts technologies from PUBLIC projects", async () => {
      const user = makePublicUser();
      vi.mocked(mockPrisma.user.findUnique).mockResolvedValue(user as any);
      vi.mocked(mockPrisma.projectTechnology.groupBy).mockResolvedValue([
        { technologyId: "tech-1", _count: { technologyId: 2 }, _sum: { isPrimary: 1 } },
      ] as any);

      await profilesService.getPublicProfile("janedoe");

      // Verify the groupBy query filters by project visibility
      expect(mockPrisma.projectTechnology.groupBy).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            project: expect.objectContaining({ visibility: "PUBLIC" }),
          }),
        }),
      );
    });
  });

  // =========================================================================
  // Step 10: Profile list — public enumeration
  // =========================================================================

  describe("profile listing", () => {
    it("lists users with public fields only", async () => {
      vi.mocked(mockPrisma.user.findMany).mockResolvedValue([
        { id: "user-1", username: "janedoe", name: "Jane Doe", avatarUrl: null, createdAt: new Date() },
      ] as any);
      vi.mocked(mockPrisma.user.count).mockResolvedValue(1);

      const result = await profilesService.listUsers({});

      expect(result.data).toHaveLength(1);
      expect(result.data[0]).not.toHaveProperty("email");
      expect(result.data[0]).not.toHaveProperty("password");
    });
  });
});
