import { describe, it, expect, vi, beforeEach } from "vitest";
import { projectsRepository } from "../../../src/modules/projects/repository/projects.repository.js";
import { projectsService } from "../../../src/modules/projects/service/projects.service.js";

vi.mock("../../../src/modules/projects/repository/projects.repository.js");

const mockRepo = vi.mocked(projectsRepository);

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const makeProject = (overrides = {}) => ({
  id: "proj-1",
  name: "Cool Project",
  slug: "cool-project",
  description: "A cool project",
  coverImageUrl: null,
  status: "BUILDING",
  visibility: "PUBLIC",
  liveUrl: null,
  demoUrl: null,
  githubRepoId: null,
  startedAt: null,
  lastUpdatedAt: null,
  isFeatured: false,
  isCurrentlyBuilding: false,
  createdAt: new Date("2024-01-01"),
  updatedAt: new Date("2024-06-01"),
  userId: "user-1",
  technologies: [
    {
      isPrimary: true,
      technology: { id: "tech-1", name: "TypeScript", slug: "typescript", category: "Language" },
    },
  ],
  githubRepo: null,
  _count: { activities: 5 },
  activities: [],
  ...overrides,
});

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe("projectsService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // =========================================================================
  // create
  // =========================================================================

  describe("create", () => {
    it("creates a project with auto-generated slug", async () => {
      mockRepo.slugExists.mockResolvedValue(false);
      mockRepo.createWithTechnologies.mockResolvedValue(makeProject() as any);

      const result = await projectsService.create("user-1", {
        name: "Cool Project",
        technologyIds: ["tech-1"],
      });

      expect(result.name).toBe("Cool Project");
      expect(result.slug).toBe("cool-project");
      expect(result.userId).toBe("user-1");
    });

    it("appends -2 on slug collision", async () => {
      mockRepo.slugExists
        .mockResolvedValueOnce(true) // first slug taken
        .mockResolvedValueOnce(false); // second slug free
      mockRepo.createWithTechnologies.mockResolvedValue(
        makeProject({ slug: "cool-project-2" }) as any
      );

      const result = await projectsService.create("user-1", {
        name: "Cool Project",
      });

      expect(result.slug).toBe("cool-project-2");
    });

    it("enforces currently-building constraint", async () => {
      mockRepo.slugExists.mockResolvedValue(false);
      mockRepo.setCurrentlyBuilding.mockResolvedValue(
        makeProject({ isCurrentlyBuilding: true }) as any
      );
      mockRepo.createWithTechnologies.mockResolvedValue(
        makeProject({ isCurrentlyBuilding: true }) as any
      );

      await projectsService.create("user-1", {
        name: "New Project",
        isCurrentlyBuilding: true,
      });

      expect(mockRepo.setCurrentlyBuilding).toHaveBeenCalledWith("user-1", "proj-1");
    });

    it("emits CREATED event", async () => {
      const { emitEvent } = await import("../../../src/shared/events/eventBus.js");
      mockRepo.slugExists.mockResolvedValue(false);
      mockRepo.createWithTechnologies.mockResolvedValue(makeProject() as any);

      await projectsService.create("user-1", { name: "Test" });

      expect(emitEvent).toHaveBeenCalledWith(
        expect.stringContaining("project.created"),
        expect.objectContaining({ userId: "user-1" }),
      );
    });
  });

  // =========================================================================
  // getById
  // =========================================================================

  describe("getById", () => {
    it("returns project detail for owner (includes private)", async () => {
      const project = makeProject({ visibility: "PRIVATE" });
      mockRepo.findDetailByIdWithActivities.mockResolvedValue(project as any);

      const result = await projectsService.getById("proj-1", "user-1");

      expect(result.id).toBe("proj-1");
      expect(result.visibility).toBe("PRIVATE");
    });

    it("returns public project for non-owner", async () => {
      const project = makeProject({ visibility: "PUBLIC" });
      // findDetailByIdWithActivities returns it but owner check fails (different userId)
      mockRepo.findDetailByIdWithActivities.mockResolvedValue(project as any);
      // findDetailById is called as fallback
      mockRepo.findDetailById.mockResolvedValue(project as any);

      const result = await projectsService.getById("proj-1", "other-user");

      expect(result.id).toBe("proj-1");
    });

    it("hides private project from non-owner", async () => {
      const project = makeProject({ visibility: "PRIVATE", userId: "user-1" });
      mockRepo.findDetailByIdWithActivities.mockResolvedValue(null);
      mockRepo.findDetailById.mockResolvedValue(project as any);

      await expect(
        projectsService.getById("proj-1", "other-user")
      ).rejects.toMatchObject({ statusCode: 404 });
    });

    it("throws NotFoundError for non-existent project", async () => {
      mockRepo.findDetailByIdWithActivities.mockResolvedValue(null);
      mockRepo.findDetailById.mockResolvedValue(null);

      await expect(
        projectsService.getById("nonexistent")
      ).rejects.toMatchObject({ statusCode: 404 });
    });
  });

  // =========================================================================
  // listPublic
  // =========================================================================

  describe("listPublic", () => {
    it("returns paginated public projects", async () => {
      const projects = [makeProject(), makeProject({ id: "proj-2", name: "Another" })];
      mockRepo.findPublicProjects.mockResolvedValue(projects as any);
      mockRepo.count.mockResolvedValue(2);

      const result = await projectsService.listPublic({ page: 1, limit: 20 });

      expect(result.data).toHaveLength(2);
      expect(result.pagination.total).toBe(2);
      expect(result.pagination.totalPages).toBe(1);
    });

    it("filters by status", async () => {
      mockRepo.findPublicProjects.mockResolvedValue([]);
      mockRepo.count.mockResolvedValue(0);

      await projectsService.listPublic({ page: 1, limit: 20, status: "SHIPPED" });

      const findManyCall = mockRepo.findPublicProjects.mock.calls[0][0];
      expect(findManyCall.where).toMatchObject({ status: "SHIPPED" });
    });

    it("filters by search term", async () => {
      mockRepo.findPublicProjects.mockResolvedValue([]);
      mockRepo.count.mockResolvedValue(0);

      await projectsService.listPublic({ page: 1, limit: 20, search: "typescript" });

      const findManyCall = mockRepo.findPublicProjects.mock.calls[0][0];
      expect(findManyCall.where).toHaveProperty("OR");
    });

    it("always includes visibility=PUBLIC in where clause", async () => {
      mockRepo.findPublicProjects.mockResolvedValue([]);
      mockRepo.count.mockResolvedValue(0);

      await projectsService.listPublic({ page: 1, limit: 20 });

      const findManyCall = mockRepo.findPublicProjects.mock.calls[0][0];
      expect(findManyCall.where).toMatchObject({ visibility: "PUBLIC" });
    });
  });

  // =========================================================================
  // listOwn
  // =========================================================================

  describe("listOwn", () => {
    it("returns all user projects including private", async () => {
      const projects = [
        makeProject({ visibility: "PUBLIC" }),
        makeProject({ id: "proj-2", visibility: "PRIVATE" }),
      ];
      mockRepo.findUserProjects.mockResolvedValue(projects as any);
      mockRepo.countByUserId.mockResolvedValue(2);

      const result = await projectsService.listOwn("user-1", { page: 1, limit: 20 });

      expect(result.data).toHaveLength(2);
    });

    it("scopes to the authenticated user", async () => {
      mockRepo.findUserProjects.mockResolvedValue([]);
      mockRepo.countByUserId.mockResolvedValue(0);

      await projectsService.listOwn("user-1", { page: 1, limit: 20 });

      const findManyCall = mockRepo.findUserProjects.mock.calls[0];
      expect(findManyCall[0]).toBe("user-1");
    });
  });

  // =========================================================================
  // listFeatured
  // =========================================================================

  describe("listFeatured", () => {
    it("returns featured projects", async () => {
      const projects = [makeProject({ isFeatured: true })];
      mockRepo.findFeaturedByUserId.mockResolvedValue(projects as any);

      const result = await projectsService.listFeatured("user-1");

      expect(result).toHaveLength(1);
      expect(result[0].isFeatured).toBe(true);
    });
  });

  // =========================================================================
  // getCurrentlyBuilding
  // =========================================================================

  describe("getCurrentlyBuilding", () => {
    it("returns the currently-building project", async () => {
      const project = makeProject({ isCurrentlyBuilding: true });
      mockRepo.findCurrentlyBuilding.mockResolvedValue(project as any);

      const result = await projectsService.getCurrentlyBuilding("user-1");

      expect(result).not.toBeNull();
      expect(result!.isCurrentlyBuilding).toBe(true);
    });

    it("returns null when no currently-building project", async () => {
      mockRepo.findCurrentlyBuilding.mockResolvedValue(null);

      const result = await projectsService.getCurrentlyBuilding("user-1");

      expect(result).toBeNull();
    });
  });

  // =========================================================================
  // update
  // =========================================================================

  describe("update", () => {
    it("updates project fields", async () => {
      const existing = makeProject();
      mockRepo.findDetailById.mockResolvedValue(existing as any);
      mockRepo.updateWithTechnologies.mockResolvedValue(makeProject({ name: "Updated" }) as any);
      mockRepo.findDetailById.mockResolvedValue(makeProject({ name: "Updated" }) as any);

      const result = await projectsService.update("proj-1", "user-1", { name: "Updated" });

      expect(result.name).toBe("Updated");
    });

    it("regenerates slug when name changes", async () => {
      const existing = makeProject({ slug: "old-name" });
      mockRepo.findDetailById.mockResolvedValue(existing as any);
      mockRepo.slugExistsExcluding.mockResolvedValue(false);
      mockRepo.updateWithTechnologies.mockResolvedValue(makeProject({ slug: "new-name" }) as any);
      mockRepo.findDetailById.mockResolvedValue(makeProject({ slug: "new-name" }) as any);

      await projectsService.update("proj-1", "user-1", { name: "New Name" });

      expect(mockRepo.slugExistsExcluding).toHaveBeenCalled();
    });

    it("throws ForbiddenError for non-owner", async () => {
      const existing = makeProject({ userId: "user-1" });
      mockRepo.findDetailById.mockResolvedValue(existing as any);

      await expect(
        projectsService.update("proj-1", "other-user", { name: "Hacked" })
      ).rejects.toMatchObject({ statusCode: 403 });
    });

    it("throws NotFoundError for non-existent project", async () => {
      mockRepo.findDetailById.mockResolvedValue(null);

      await expect(
        projectsService.update("nonexistent", "user-1", { name: "X" })
      ).rejects.toMatchObject({ statusCode: 404 });
    });

    it("throws BadRequestError when no fields to update", async () => {
      const existing = makeProject();
      mockRepo.findDetailById.mockResolvedValue(existing as any);

      await expect(
        projectsService.update("proj-1", "user-1", {})
      ).rejects.toMatchObject({ statusCode: 400 });
    });

    it("enforces currently-building when enabling on a new project", async () => {
      const existing = makeProject({ isCurrentlyBuilding: false });
      mockRepo.findDetailById
        .mockResolvedValueOnce(existing as any) // first call: ownership check
        .mockResolvedValueOnce(makeProject({ isCurrentlyBuilding: true }) as any); // re-fetch
      mockRepo.setCurrentlyBuilding.mockResolvedValue(
        makeProject({ isCurrentlyBuilding: true }) as any
      );
      mockRepo.updateWithTechnologies.mockResolvedValue(
        makeProject({ isCurrentlyBuilding: false }) as any
      );

      await projectsService.update("proj-1", "user-1", {
        name: "Updated Name",
        isCurrentlyBuilding: true,
      });

      expect(mockRepo.setCurrentlyBuilding).toHaveBeenCalledWith("user-1", "proj-1");
    });
  });

  // =========================================================================
  // remove
  // =========================================================================

  describe("remove", () => {
    it("deletes the project", async () => {
      const existing = makeProject();
      mockRepo.findDetailById.mockResolvedValue(existing as any);
      mockRepo.delete.mockResolvedValue({} as any);

      await projectsService.remove("proj-1", "user-1");

      expect(mockRepo.delete).toHaveBeenCalledWith("proj-1");
    });

    it("throws ForbiddenError for non-owner", async () => {
      const existing = makeProject({ userId: "user-1" });
      mockRepo.findDetailById.mockResolvedValue(existing as any);

      await expect(
        projectsService.remove("proj-1", "other-user")
      ).rejects.toMatchObject({ statusCode: 403 });
    });

    it("throws NotFoundError for non-existent project", async () => {
      mockRepo.findDetailById.mockResolvedValue(null);

      await expect(
        projectsService.remove("nonexistent", "user-1")
      ).rejects.toMatchObject({ statusCode: 404 });
    });

    it("emits DELETED event", async () => {
      const { emitEvent } = await import("../../../src/shared/events/eventBus.js");
      const existing = makeProject();
      mockRepo.findDetailById.mockResolvedValue(existing as any);
      mockRepo.delete.mockResolvedValue({} as any);

      await projectsService.remove("proj-1", "user-1");

      expect(emitEvent).toHaveBeenCalledWith(
        expect.stringContaining("project.deleted"),
        expect.objectContaining({ projectId: "proj-1" }),
      );
    });
  });
});
