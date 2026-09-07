import { describe, it, expect, vi, beforeEach } from "vitest";
import { projectsController } from "../../../src/modules/projects/controller/projects.controller.js";
import { projectsService } from "../../../src/modules/projects/service/projects.service.js";

vi.mock("../../../src/modules/projects/service/projects.service.js");

const mockService = vi.mocked(projectsService);

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const mockReq = (overrides: Record<string, any> = {}): any => ({
  params: {},
  query: {},
  body: {},
  user: undefined,
  ...overrides,
});

const mockRes = () => {
  const res: any = {};
  res.status = vi.fn().mockReturnValue(res);
  res.json = vi.fn().mockReturnValue(res);
  return res;
};

const mockNext = vi.fn();

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe("projectsController", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // =========================================================================
  // list — public projects
  // =========================================================================

  describe("list", () => {
    it("returns paginated public projects", async () => {
      mockService.listPublic.mockResolvedValue({
        data: [{ id: "p1", name: "Project 1" }],
        pagination: { page: 1, limit: 20, total: 1, totalPages: 1 },
      });

      const req = mockReq({ query: { page: 1, limit: 20 } });
      const res = mockRes();

      await projectsController.list(req, res, mockNext);

      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: [{ id: "p1", name: "Project 1" }],
        pagination: { page: 1, limit: 20, total: 1, totalPages: 1 },
      });
    });

    it("calls next on error", async () => {
      mockService.listPublic.mockRejectedValue(new Error("DB error"));

      const req = mockReq({ query: {} });
      const res = mockRes();

      await projectsController.list(req, res, mockNext);

      expect(mockNext).toHaveBeenCalledWith(expect.any(Error));
    });
  });

  // =========================================================================
  // listFeatured
  // =========================================================================

  describe("listFeatured", () => {
    it("returns featured projects for a user", async () => {
      mockService.listFeatured.mockResolvedValue([{ id: "p1", name: "Featured" } as any]);

      const req = mockReq({ params: { userId: "user-1" } });
      const res = mockRes();

      await projectsController.listFeatured(req, res, mockNext);

      expect(mockService.listFeatured).toHaveBeenCalledWith("user-1");
      expect(res.json).toHaveBeenCalled();
    });
  });

  // =========================================================================
  // getCurrentlyBuilding
  // =========================================================================

  describe("getCurrentlyBuilding", () => {
    it("returns the currently-building project", async () => {
      mockService.getCurrentlyBuilding.mockResolvedValue({ id: "p1", isCurrentlyBuilding: true } as any);

      const req = mockReq({ params: { userId: "user-1" } });
      const res = mockRes();

      await projectsController.getCurrentlyBuilding(req, res, mockNext);

      expect(mockService.getCurrentlyBuilding).toHaveBeenCalledWith("user-1");
    });
  });

  // =========================================================================
  // getById
  // =========================================================================

  describe("getById", () => {
    it("returns project detail", async () => {
      mockService.getById.mockResolvedValue({ id: "proj-1", name: "Test" } as any);

      const req = mockReq({ params: { id: "proj-1" }, user: { id: "user-1" } });
      const res = mockRes();

      await projectsController.getById(req, res, mockNext);

      expect(mockService.getById).toHaveBeenCalledWith("proj-1", "user-1");
      expect(res.json).toHaveBeenCalled();
    });

    it("passes undefined userId when not authenticated", async () => {
      mockService.getById.mockResolvedValue({ id: "proj-1" } as any);

      const req = mockReq({ params: { id: "proj-1" } });
      const res = mockRes();

      await projectsController.getById(req, res, mockNext);

      expect(mockService.getById).toHaveBeenCalledWith("proj-1", undefined);
    });
  });

  // =========================================================================
  // listMine
  // =========================================================================

  describe("listMine", () => {
    it("returns the user's own projects", async () => {
      mockService.listOwn.mockResolvedValue({
        data: [{ id: "p1" }],
        pagination: { page: 1, limit: 20, total: 1, totalPages: 1 },
      });

      const req = mockReq({ user: { id: "user-1" }, query: {} });
      const res = mockRes();

      await projectsController.listMine(req, res, mockNext);

      expect(mockService.listOwn).toHaveBeenCalledWith("user-1", {});
    });
  });

  // =========================================================================
  // create
  // =========================================================================

  describe("create", () => {
    it("creates a project and returns 201", async () => {
      mockService.create.mockResolvedValue({ id: "proj-1", name: "New" } as any);

      const req = mockReq({
        user: { id: "user-1" },
        body: { name: "New" },
      });
      const res = mockRes();

      await projectsController.create(req, res, mockNext);

      expect(mockService.create).toHaveBeenCalledWith("user-1", { name: "New" });
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalled();
    });

    it("calls next on error", async () => {
      mockService.create.mockRejectedValue(new Error("Validation error"));

      const req = mockReq({ user: { id: "user-1" }, body: {} });
      const res = mockRes();

      await projectsController.create(req, res, mockNext);

      expect(mockNext).toHaveBeenCalled();
    });
  });

  // =========================================================================
  // update
  // =========================================================================

  describe("update", () => {
    it("updates a project", async () => {
      mockService.update.mockResolvedValue({ id: "proj-1", name: "Updated" } as any);

      const req = mockReq({
        params: { id: "proj-1" },
        user: { id: "user-1" },
        body: { name: "Updated" },
      });
      const res = mockRes();

      await projectsController.update(req, res, mockNext);

      expect(mockService.update).toHaveBeenCalledWith("proj-1", "user-1", { name: "Updated" });
      expect(res.json).toHaveBeenCalled();
    });
  });

  // =========================================================================
  // remove
  // =========================================================================

  describe("remove", () => {
    it("deletes a project", async () => {
      mockService.remove.mockResolvedValue(undefined);

      const req = mockReq({ params: { id: "proj-1" }, user: { id: "user-1" } });
      const res = mockRes();

      await projectsController.remove(req, res, mockNext);

      expect(mockService.remove).toHaveBeenCalledWith("proj-1", "user-1");
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: "Project deleted",
      });
    });
  });
});
