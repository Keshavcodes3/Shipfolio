import { describe, it, expect, vi, beforeEach } from "vitest";
import { technologiesRepository } from "../../../src/modules/technologies/repository/technologies.repository.js";
import { technologiesService } from "../../../src/modules/technologies/service/technologies.service.js";

vi.mock("../../../src/modules/technologies/repository/technologies.repository.js");
vi.mock("../../../src/modules/projects/repository/projects.repository.js");

const mockRepo = vi.mocked(technologiesRepository);

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const makeTechnology = (overrides = {}) => ({
  id: "tech-1",
  name: "React",
  slug: "react",
  category: "Frontend",
  createdAt: new Date("2024-01-01"),
  ...overrides,
});

const makeUserTechnology = (overrides = {}) => ({
  userId: "user-1",
  technologyId: "tech-1",
  isPrimary: false,
  technology: makeTechnology(),
  ...overrides,
});

const makeProjectTechnology = (overrides = {}) => ({
  projectId: "proj-1",
  technologyId: "tech-1",
  isPrimary: false,
  technology: makeTechnology(),
  ...overrides,
});

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe("technologiesService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // =========================================================================
  // create
  // =========================================================================

  describe("create", () => {
    it("creates a technology with normalized name and slug", async () => {
      mockRepo.findByName.mockResolvedValue(null);
      mockRepo.findBySlug.mockResolvedValue(null);
      mockRepo.create.mockResolvedValue(makeTechnology() as any);

      const result = await technologiesService.create({ name: "react" });

      expect(result.name).toBe("React");
      expect(result.slug).toBe("react");
    });

    it("normalizes name: trims whitespace and title-cases", async () => {
      mockRepo.findByName.mockResolvedValue(null);
      mockRepo.findBySlug.mockResolvedValue(null);
      mockRepo.create.mockResolvedValue(makeTechnology({ name: "Node Js", slug: "nodejs" }) as any);

      const result = await technologiesService.create({ name: "  node js  " });

      expect(result.name).toBe("Node Js");
      expect(result.slug).toBe("nodejs");
    });

    it("prevents duplicate by normalized name", async () => {
      mockRepo.findByName.mockResolvedValue(makeTechnology() as any);

      await expect(
        technologiesService.create({ name: "react" })
      ).rejects.toMatchObject({ statusCode: 409, code: "CONFLICT" });
    });

    it("prevents duplicate by slug collision", async () => {
      mockRepo.findByName.mockResolvedValue(null);
      mockRepo.findBySlug.mockResolvedValue(makeTechnology() as any);

      await expect(
        technologiesService.create({ name: "React" })
      ).rejects.toMatchObject({ statusCode: 409, code: "CONFLICT" });
    });

    it("preserves category when provided", async () => {
      mockRepo.findByName.mockResolvedValue(null);
      mockRepo.findBySlug.mockResolvedValue(null);
      mockRepo.create.mockResolvedValue(makeTechnology({ category: "Frontend" }) as any);

      const result = await technologiesService.create({
        name: "Vue",
        category: "Frontend",
      });

      expect(result.category).toBe("Frontend");
    });
  });

  // =========================================================================
  // findOrCreate
  // =========================================================================

  describe("findOrCreate", () => {
    it("returns existing technology", async () => {
      const existing = makeTechnology();
      mockRepo.findOrCreate.mockResolvedValue(existing as any);

      const result = await technologiesService.findOrCreate("React");

      expect(result.name).toBe("React");
    });

    it("creates new technology if not found", async () => {
      const newTech = makeTechnology({ id: "tech-2", name: "Vue", slug: "vue" });
      mockRepo.findOrCreate.mockResolvedValue(newTech as any);

      const result = await technologiesService.findOrCreate("Vue");

      expect(result.name).toBe("Vue");
    });
  });

  // =========================================================================
  // getById
  // =========================================================================

  describe("getById", () => {
    it("returns technology by ID", async () => {
      mockRepo.findById.mockResolvedValue(makeTechnology() as any);

      const result = await technologiesService.getById("tech-1");

      expect(result.id).toBe("tech-1");
    });

    it("throws NotFoundError for non-existent technology", async () => {
      mockRepo.findById.mockResolvedValue(null);

      await expect(
        technologiesService.getById("nonexistent")
      ).rejects.toMatchObject({ statusCode: 404, code: "NOT_FOUND" });
    });
  });

  // =========================================================================
  // list
  // =========================================================================

  describe("list", () => {
    it("returns paginated technologies", async () => {
      const techs = [makeTechnology(), makeTechnology({ id: "tech-2", name: "Vue" })];
      mockRepo.findAll.mockResolvedValue(techs as any);
      mockRepo.count.mockResolvedValue(2);

      const result = await technologiesService.list({ page: 1, limit: 20 });

      expect(result.data).toHaveLength(2);
      expect(result.pagination.total).toBe(2);
      expect(result.pagination.totalPages).toBe(1);
    });

    it("applies search filter", async () => {
      mockRepo.findAll.mockResolvedValue([]);
      mockRepo.count.mockResolvedValue(0);

      await technologiesService.list({ page: 1, limit: 20, search: "react" });

      const findAllCall = mockRepo.findAll.mock.calls[0][0];
      expect(findAllCall.where).toHaveProperty("OR");
    });

    it("applies category filter", async () => {
      mockRepo.findAll.mockResolvedValue([]);
      mockRepo.count.mockResolvedValue(0);

      await technologiesService.list({ page: 1, limit: 20, category: "Frontend" });

      const findAllCall = mockRepo.findAll.mock.calls[0][0];
      expect(findAllCall.where).toMatchObject({ category: "Frontend" });
    });
  });

  // =========================================================================
  // search
  // =========================================================================

  describe("search", () => {
    it("returns matching technologies", async () => {
      mockRepo.search.mockResolvedValue([makeTechnology()] as any);

      const result = await technologiesService.search("react");

      expect(result).toHaveLength(1);
      expect(result[0].name).toBe("React");
    });
  });

  // =========================================================================
  // update
  // =========================================================================

  describe("update", () => {
    it("updates technology fields", async () => {
      mockRepo.findById.mockResolvedValue(makeTechnology() as any);
      mockRepo.findByName.mockResolvedValue(null);
      mockRepo.update.mockResolvedValue(makeTechnology({ name: "React.js" }) as any);

      const result = await technologiesService.update("tech-1", { name: "React.js" });

      expect(result.name).toBe("React.js");
    });

    it("normalizes updated name", async () => {
      mockRepo.findById.mockResolvedValue(makeTechnology() as any);
      mockRepo.findByName.mockResolvedValue(null);
      mockRepo.update.mockResolvedValue(makeTechnology({ name: "React Js", slug: "reactjs" }) as any);

      const result = await technologiesService.update("tech-1", { name: "  react js  " });

      expect(result.name).toBe("React Js");
    });

    it("prevents duplicate name on update", async () => {
      mockRepo.findById.mockResolvedValue(makeTechnology() as any);
      mockRepo.findByName.mockResolvedValue(makeTechnology({ id: "tech-2" }) as any);

      await expect(
        technologiesService.update("tech-1", { name: "Vue" })
      ).rejects.toMatchObject({ statusCode: 409, code: "CONFLICT" });
    });

    it("allows keeping the same name when other fields change", async () => {
      mockRepo.findById.mockResolvedValue(makeTechnology() as any);
      mockRepo.update.mockResolvedValue(makeTechnology({ category: "Backend" }) as any);

      const result = await technologiesService.update("tech-1", {
        name: "React",
        category: "Backend",
      });

      expect(result.name).toBe("React");
      expect(result.category).toBe("Backend");
    });

    it("throws NotFoundError for non-existent technology", async () => {
      mockRepo.findById.mockResolvedValue(null);

      await expect(
        technologiesService.update("nonexistent", { name: "X" })
      ).rejects.toMatchObject({ statusCode: 404 });
    });

    it("throws BadRequestError when no fields to update", async () => {
      mockRepo.findById.mockResolvedValue(makeTechnology() as any);

      await expect(
        technologiesService.update("tech-1", {})
      ).rejects.toMatchObject({ statusCode: 400 });
    });
  });

  // =========================================================================
  // remove
  // =========================================================================

  describe("remove", () => {
    it("deletes the technology", async () => {
      mockRepo.findById.mockResolvedValue(makeTechnology() as any);
      mockRepo.delete.mockResolvedValue(makeTechnology() as any);

      await technologiesService.remove("tech-1");

      expect(mockRepo.delete).toHaveBeenCalledWith("tech-1");
    });

    it("throws NotFoundError for non-existent technology", async () => {
      mockRepo.findById.mockResolvedValue(null);

      await expect(
        technologiesService.remove("nonexistent")
      ).rejects.toMatchObject({ statusCode: 404 });
    });
  });

  // =========================================================================
  // User–Technology relationships
  // =========================================================================

  describe("getUserTechnologies", () => {
    it("returns user technologies", async () => {
      mockRepo.getUserTechnologies.mockResolvedValue([makeUserTechnology()] as any);

      const result = await technologiesService.getUserTechnologies("user-1");

      expect(result).toHaveLength(1);
      expect(result[0].technology.name).toBe("React");
    });
  });

  describe("attachToUser", () => {
    it("attaches a technology to a user", async () => {
      mockRepo.findById.mockResolvedValue(makeTechnology() as any);
      mockRepo.hasUserTechnology.mockResolvedValue(false);
      mockRepo.addUserTechnology.mockResolvedValue({} as any);
      mockRepo.getUserTechnologies.mockResolvedValue([makeUserTechnology()] as any);

      const result = await technologiesService.attachToUser("user-1", {
        technologyId: "tech-1",
      });

      expect(result.technology.name).toBe("React");
    });

    it("prevents duplicate attachment", async () => {
      mockRepo.findById.mockResolvedValue(makeTechnology() as any);
      mockRepo.hasUserTechnology.mockResolvedValue(true);
      mockRepo.getUserTechnologies.mockResolvedValue([makeUserTechnology()] as any);

      const result = await technologiesService.attachToUser("user-1", {
        technologyId: "tech-1",
      });

      // Should not call add since already attached
      expect(mockRepo.addUserTechnology).not.toHaveBeenCalled();
      expect(result.technology.name).toBe("React");
    });

    it("clears other primary technologies when setting primary", async () => {
      mockRepo.findById.mockResolvedValue(makeTechnology() as any);
      mockRepo.hasUserTechnology.mockResolvedValue(false);
      mockRepo.clearPrimaryUserTechnologies.mockResolvedValue({ count: 1 } as any);
      mockRepo.addUserTechnology.mockResolvedValue({} as any);
      mockRepo.getUserTechnologies.mockResolvedValue([
        makeUserTechnology({ isPrimary: true }),
      ] as any);

      await technologiesService.attachToUser("user-1", {
        technologyId: "tech-1",
        isPrimary: true,
      });

      expect(mockRepo.clearPrimaryUserTechnologies).toHaveBeenCalledWith("user-1");
    });

    it("throws NotFoundError for non-existent technology", async () => {
      mockRepo.findById.mockResolvedValue(null);

      await expect(
        technologiesService.attachToUser("user-1", { technologyId: "nonexistent" })
      ).rejects.toMatchObject({ statusCode: 404 });
    });
  });

  describe("detachFromUser", () => {
    it("removes a technology from a user", async () => {
      mockRepo.hasUserTechnology.mockResolvedValue(true);
      mockRepo.removeUserTechnology.mockResolvedValue({} as any);

      await technologiesService.detachFromUser("user-1", "tech-1");

      expect(mockRepo.removeUserTechnology).toHaveBeenCalledWith("user-1", "tech-1");
    });

    it("throws NotFoundError when not attached", async () => {
      mockRepo.hasUserTechnology.mockResolvedValue(false);

      await expect(
        technologiesService.detachFromUser("user-1", "tech-1")
      ).rejects.toMatchObject({ statusCode: 404 });
    });
  });

  describe("setPrimaryUserTechnology", () => {
    it("sets a technology as primary for a user", async () => {
      mockRepo.hasUserTechnology.mockResolvedValue(true);
      mockRepo.setPrimaryUserTechnology.mockResolvedValue([{}, {}] as any);
      mockRepo.getUserTechnologies.mockResolvedValue([
        makeUserTechnology({ isPrimary: true }),
      ] as any);

      const result = await technologiesService.setPrimaryUserTechnology("user-1", "tech-1");

      expect(result.isPrimary).toBe(true);
    });

    it("throws NotFoundError when technology not attached", async () => {
      mockRepo.hasUserTechnology.mockResolvedValue(false);

      await expect(
        technologiesService.setPrimaryUserTechnology("user-1", "tech-1")
      ).rejects.toMatchObject({ statusCode: 404 });
    });
  });

  // =========================================================================
  // Project–Technology relationships
  // =========================================================================

  describe("getProjectTechnologies", () => {
    it("returns project technologies", async () => {
      mockRepo.getProjectTechnologies.mockResolvedValue([makeProjectTechnology()] as any);

      const result = await technologiesService.getProjectTechnologies("proj-1");

      expect(result).toHaveLength(1);
      expect(result[0].technology.name).toBe("React");
    });
  });

  describe("attachToProject", () => {
    it("attaches a technology to a project", async () => {
      const { projectsRepository } = await import("../../../src/modules/projects/repository/projects.repository.js");
      vi.mocked(projectsRepository.findById).mockResolvedValue({ id: "proj-1", userId: "user-1" } as any);

      mockRepo.findById.mockResolvedValue(makeTechnology() as any);
      mockRepo.hasProjectTechnology.mockResolvedValue(false);
      mockRepo.addProjectTechnology.mockResolvedValue({} as any);
      mockRepo.getProjectTechnologies.mockResolvedValue([makeProjectTechnology()] as any);

      const result = await technologiesService.attachToProject("proj-1", "user-1", {
        technologyId: "tech-1",
      });

      expect(result.technology.name).toBe("React");
    });

    it("prevents duplicate attachment", async () => {
      const { projectsRepository } = await import("../../../src/modules/projects/repository/projects.repository.js");
      vi.mocked(projectsRepository.findById).mockResolvedValue({ id: "proj-1", userId: "user-1" } as any);

      mockRepo.findById.mockResolvedValue(makeTechnology() as any);
      mockRepo.hasProjectTechnology.mockResolvedValue(true);
      mockRepo.getProjectTechnologies.mockResolvedValue([makeProjectTechnology()] as any);

      const result = await technologiesService.attachToProject("proj-1", "user-1", {
        technologyId: "tech-1",
      });

      expect(mockRepo.addProjectTechnology).not.toHaveBeenCalled();
      expect(result.technology.name).toBe("React");
    });

    it("throws ForbiddenError for non-owner", async () => {
      const { projectsRepository } = await import("../../../src/modules/projects/repository/projects.repository.js");
      vi.mocked(projectsRepository.findById).mockResolvedValue({ id: "proj-1", userId: "owner-1" } as any);

      await expect(
        technologiesService.attachToProject("proj-1", "other-user", {
          technologyId: "tech-1",
        })
      ).rejects.toMatchObject({ statusCode: 403, code: "FORBIDDEN" });
    });

    it("throws NotFoundError for non-existent project", async () => {
      const { projectsRepository } = await import("../../../src/modules/projects/repository/projects.repository.js");
      vi.mocked(projectsRepository.findById).mockResolvedValue(null);

      await expect(
        technologiesService.attachToProject("nonexistent", "user-1", {
          technologyId: "tech-1",
        })
      ).rejects.toMatchObject({ statusCode: 404 });
    });

    it("throws NotFoundError for non-existent technology", async () => {
      const { projectsRepository } = await import("../../../src/modules/projects/repository/projects.repository.js");
      vi.mocked(projectsRepository.findById).mockResolvedValue({ id: "proj-1", userId: "user-1" } as any);

      mockRepo.findById.mockResolvedValue(null);

      await expect(
        technologiesService.attachToProject("proj-1", "user-1", {
          technologyId: "nonexistent",
        })
      ).rejects.toMatchObject({ statusCode: 404 });
    });

    it("clears other primary technologies when setting primary", async () => {
      const { projectsRepository } = await import("../../../src/modules/projects/repository/projects.repository.js");
      vi.mocked(projectsRepository.findById).mockResolvedValue({ id: "proj-1", userId: "user-1" } as any);

      mockRepo.findById.mockResolvedValue(makeTechnology() as any);
      mockRepo.hasProjectTechnology.mockResolvedValue(false);
      mockRepo.clearPrimaryProjectTechnologies.mockResolvedValue({ count: 1 } as any);
      mockRepo.addProjectTechnology.mockResolvedValue({} as any);
      mockRepo.getProjectTechnologies.mockResolvedValue([
        makeProjectTechnology({ isPrimary: true }),
      ] as any);

      await technologiesService.attachToProject("proj-1", "user-1", {
        technologyId: "tech-1",
        isPrimary: true,
      });

      expect(mockRepo.clearPrimaryProjectTechnologies).toHaveBeenCalledWith("proj-1");
    });
  });

  describe("detachFromProject", () => {
    it("removes a technology from a project", async () => {
      const { projectsRepository } = await import("../../../src/modules/projects/repository/projects.repository.js");
      vi.mocked(projectsRepository.findById).mockResolvedValue({ id: "proj-1", userId: "user-1" } as any);

      mockRepo.hasProjectTechnology.mockResolvedValue(true);
      mockRepo.removeProjectTechnology.mockResolvedValue({} as any);

      await technologiesService.detachFromProject("proj-1", "user-1", "tech-1");

      expect(mockRepo.removeProjectTechnology).toHaveBeenCalledWith("proj-1", "tech-1");
    });

    it("throws ForbiddenError for non-owner", async () => {
      const { projectsRepository } = await import("../../../src/modules/projects/repository/projects.repository.js");
      vi.mocked(projectsRepository.findById).mockResolvedValue({ id: "proj-1", userId: "owner-1" } as any);

      await expect(
        technologiesService.detachFromProject("proj-1", "other-user", "tech-1")
      ).rejects.toMatchObject({ statusCode: 403 });
    });

    it("throws NotFoundError when not attached", async () => {
      const { projectsRepository } = await import("../../../src/modules/projects/repository/projects.repository.js");
      vi.mocked(projectsRepository.findById).mockResolvedValue({ id: "proj-1", userId: "user-1" } as any);

      mockRepo.hasProjectTechnology.mockResolvedValue(false);

      await expect(
        technologiesService.detachFromProject("proj-1", "user-1", "tech-1")
      ).rejects.toMatchObject({ statusCode: 404 });
    });
  });

  describe("setPrimaryProjectTechnology", () => {
    it("sets a technology as primary for a project", async () => {
      const { projectsRepository } = await import("../../../src/modules/projects/repository/projects.repository.js");
      vi.mocked(projectsRepository.findById).mockResolvedValue({ id: "proj-1", userId: "user-1" } as any);

      mockRepo.hasProjectTechnology.mockResolvedValue(true);
      mockRepo.setPrimaryProjectTechnology.mockResolvedValue([{}, {}] as any);
      mockRepo.getProjectTechnologies.mockResolvedValue([
        makeProjectTechnology({ isPrimary: true }),
      ] as any);

      const result = await technologiesService.setPrimaryProjectTechnology(
        "proj-1",
        "user-1",
        "tech-1",
      );

      expect(result.isPrimary).toBe(true);
    });

    it("throws ForbiddenError for non-owner", async () => {
      const { projectsRepository } = await import("../../../src/modules/projects/repository/projects.repository.js");
      vi.mocked(projectsRepository.findById).mockResolvedValue({ id: "proj-1", userId: "owner-1" } as any);

      await expect(
        technologiesService.setPrimaryProjectTechnology("proj-1", "other-user", "tech-1")
      ).rejects.toMatchObject({ statusCode: 403 });
    });

    it("throws NotFoundError when technology not attached", async () => {
      const { projectsRepository } = await import("../../../src/modules/projects/repository/projects.repository.js");
      vi.mocked(projectsRepository.findById).mockResolvedValue({ id: "proj-1", userId: "user-1" } as any);

      mockRepo.hasProjectTechnology.mockResolvedValue(false);

      await expect(
        technologiesService.setPrimaryProjectTechnology("proj-1", "user-1", "tech-1")
      ).rejects.toMatchObject({ statusCode: 404 });
    });
  });
});
