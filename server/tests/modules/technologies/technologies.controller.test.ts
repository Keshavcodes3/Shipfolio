import { describe, it, expect, vi, beforeEach } from "vitest";
import { technologiesController } from "../../../src/modules/technologies/controller/technologies.controller.js";
import { technologiesService } from "../../../src/modules/technologies/service/technologies.service.js";

vi.mock("../../../src/modules/technologies/service/technologies.service.js");

const mockService = vi.mocked(technologiesService);

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

describe("technologiesController", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // =========================================================================
  // list
  // =========================================================================

  describe("list", () => {
    it("returns paginated technologies", async () => {
      mockService.list.mockResolvedValue({
        data: [{ id: "t1", name: "React" }],
        pagination: { page: 1, limit: 20, total: 1, totalPages: 1 },
      });

      const req = mockReq({ query: { page: 1, limit: 20 } });
      const res = mockRes();

      await technologiesController.list(req, res, mockNext);

      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: [{ id: "t1", name: "React" }],
        pagination: { page: 1, limit: 20, total: 1, totalPages: 1 },
      });
    });

    it("calls next on error", async () => {
      mockService.list.mockRejectedValue(new Error("DB error"));

      const req = mockReq({ query: {} });
      const res = mockRes();

      await technologiesController.list(req, res, mockNext);

      expect(mockNext).toHaveBeenCalledWith(expect.any(Error));
    });
  });

  // =========================================================================
  // search
  // =========================================================================

  describe("search", () => {
    it("returns matching technologies", async () => {
      mockService.search.mockResolvedValue([{ id: "t1", name: "React" }] as any);

      const req = mockReq({ query: { q: "react", limit: 10 } });
      const res = mockRes();

      await technologiesController.search(req, res, mockNext);

      expect(mockService.search).toHaveBeenCalledWith("react", 10);
    });
  });

  // =========================================================================
  // getById
  // =========================================================================

  describe("getById", () => {
    it("returns technology by ID", async () => {
      mockService.getById.mockResolvedValue({ id: "t1", name: "React" } as any);

      const req = mockReq({ params: { id: "t1" } });
      const res = mockRes();

      await technologiesController.getById(req, res, mockNext);

      expect(res.json).toHaveBeenCalled();
    });
  });

  // =========================================================================
  // create
  // =========================================================================

  describe("create", () => {
    it("creates a technology and returns 201", async () => {
      mockService.create.mockResolvedValue({ id: "t1", name: "React" } as any);

      const req = mockReq({ body: { name: "React" } });
      const res = mockRes();

      await technologiesController.create(req, res, mockNext);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalled();
    });
  });

  // =========================================================================
  // update
  // =========================================================================

  describe("update", () => {
    it("updates a technology", async () => {
      mockService.update.mockResolvedValue({ id: "t1", name: "React.js" } as any);

      const req = mockReq({ params: { id: "t1" }, body: { name: "React.js" } });
      const res = mockRes();

      await technologiesController.update(req, res, mockNext);

      expect(res.json).toHaveBeenCalled();
    });
  });

  // =========================================================================
  // remove
  // =========================================================================

  describe("remove", () => {
    it("deletes a technology", async () => {
      mockService.remove.mockResolvedValue(undefined);

      const req = mockReq({ params: { id: "t1" } });
      const res = mockRes();

      await technologiesController.remove(req, res, mockNext);

      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: "Technology deleted",
      });
    });
  });

  // =========================================================================
  // getUserTechnologies
  // =========================================================================

  describe("getUserTechnologies", () => {
    it("returns user technologies", async () => {
      mockService.getUserTechnologies.mockResolvedValue([
        { technology: { id: "t1", name: "React" }, isPrimary: true },
      ] as any);

      const req = mockReq({ params: { userId: "user-1" } });
      const res = mockRes();

      await technologiesController.getUserTechnologies(req, res, mockNext);

      expect(mockService.getUserTechnologies).toHaveBeenCalledWith("user-1");
    });
  });

  // =========================================================================
  // attachToUser
  // =========================================================================

  describe("attachToUser", () => {
    it("attaches technology to authenticated user", async () => {
      mockService.attachToUser.mockResolvedValue({
        technology: { id: "t1", name: "React" },
        isPrimary: false,
      } as any);

      const req = mockReq({
        user: { id: "user-1" },
        body: { technologyId: "t1" },
      });
      const res = mockRes();

      await technologiesController.attachToUser(req, res, mockNext);

      expect(mockService.attachToUser).toHaveBeenCalledWith("user-1", { technologyId: "t1" });
      expect(res.status).toHaveBeenCalledWith(201);
    });
  });

  // =========================================================================
  // detachFromUser
  // =========================================================================

  describe("detachFromUser", () => {
    it("removes technology from user", async () => {
      mockService.detachFromUser.mockResolvedValue(undefined);

      const req = mockReq({
        user: { id: "user-1" },
        params: { technologyId: "t1" },
      });
      const res = mockRes();

      await technologiesController.detachFromUser(req, res, mockNext);

      expect(mockService.detachFromUser).toHaveBeenCalledWith("user-1", "t1");
    });
  });

  // =========================================================================
  // setPrimaryUserTechnology
  // =========================================================================

  describe("setPrimaryUserTechnology", () => {
    it("sets primary for user", async () => {
      mockService.setPrimaryUserTechnology.mockResolvedValue({
        technology: { id: "t1", name: "React" },
        isPrimary: true,
      } as any);

      const req = mockReq({
        user: { id: "user-1" },
        params: { technologyId: "t1" },
      });
      const res = mockRes();

      await technologiesController.setPrimaryUserTechnology(req, res, mockNext);

      expect(mockService.setPrimaryUserTechnology).toHaveBeenCalledWith("user-1", "t1");
    });
  });

  // =========================================================================
  // getProjectTechnologies
  // =========================================================================

  describe("getProjectTechnologies", () => {
    it("returns project technologies", async () => {
      mockService.getProjectTechnologies.mockResolvedValue([
        { technology: { id: "t1", name: "React" }, isPrimary: true },
      ] as any);

      const req = mockReq({ params: { projectId: "proj-1" } });
      const res = mockRes();

      await technologiesController.getProjectTechnologies(req, res, mockNext);

      expect(mockService.getProjectTechnologies).toHaveBeenCalledWith("proj-1");
    });
  });

  // =========================================================================
  // attachToProject
  // =========================================================================

  describe("attachToProject", () => {
    it("attaches technology to project", async () => {
      mockService.attachToProject.mockResolvedValue({
        technology: { id: "t1", name: "React" },
        isPrimary: false,
      } as any);

      const req = mockReq({
        params: { projectId: "proj-1" },
        user: { id: "user-1" },
        body: { technologyId: "t1" },
      });
      const res = mockRes();

      await technologiesController.attachToProject(req, res, mockNext);

      expect(mockService.attachToProject).toHaveBeenCalledWith("proj-1", "user-1", {
        technologyId: "t1",
      });
      expect(res.status).toHaveBeenCalledWith(201);
    });
  });

  // =========================================================================
  // detachFromProject
  // =========================================================================

  describe("detachFromProject", () => {
    it("removes technology from project", async () => {
      mockService.detachFromProject.mockResolvedValue(undefined);

      const req = mockReq({
        params: { projectId: "proj-1", technologyId: "t1" },
        user: { id: "user-1" },
      });
      const res = mockRes();

      await technologiesController.detachFromProject(req, res, mockNext);

      expect(mockService.detachFromProject).toHaveBeenCalledWith("proj-1", "user-1", "t1");
    });
  });

  // =========================================================================
  // setPrimaryProjectTechnology
  // =========================================================================

  describe("setPrimaryProjectTechnology", () => {
    it("sets primary for project", async () => {
      mockService.setPrimaryProjectTechnology.mockResolvedValue({
        technology: { id: "t1", name: "React" },
        isPrimary: true,
      } as any);

      const req = mockReq({
        params: { projectId: "proj-1", technologyId: "t1" },
        user: { id: "user-1" },
      });
      const res = mockRes();

      await technologiesController.setPrimaryProjectTechnology(req, res, mockNext);

      expect(mockService.setPrimaryProjectTechnology).toHaveBeenCalledWith(
        "proj-1",
        "user-1",
        "t1",
      );
    });
  });
});
