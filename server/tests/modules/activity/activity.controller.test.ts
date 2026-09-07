import { describe, it, expect, vi, beforeEach } from "vitest";
import { activityController } from "../../../src/modules/activity/controller/activity.controller.js";
import { activityService } from "../../../src/modules/activity/service/activity.service.js";

vi.mock("../../../src/modules/activity/service/activity.service.js");

const mockService = vi.mocked(activityService);

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

describe("activityController", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // =========================================================================
  // list
  // =========================================================================

  describe("list", () => {
    it("returns activities with success response", async () => {
      const activities = [{ id: "act-1", type: "COMMIT" }, { id: "act-2", type: "PR" }];
      mockService.list.mockResolvedValue(activities as any);

      const req = mockReq({ query: { page: 1, limit: 10 } });
      const res = mockRes();

      await activityController.list(req, res, mockNext);

      expect(mockService.list).toHaveBeenCalledWith({ page: 1, limit: 10 });
      expect(res.json).toHaveBeenCalledWith({ success: true, data: activities });
    });

    it("calls next on error", async () => {
      mockService.list.mockRejectedValue(new Error("DB error"));

      const req = mockReq({ query: {} });
      const res = mockRes();

      await activityController.list(req, res, mockNext);

      expect(mockNext).toHaveBeenCalledWith(expect.any(Error));
    });
  });

  // =========================================================================
  // getById
  // =========================================================================

  describe("getById", () => {
    it("returns activity with success response", async () => {
      const activity = { id: "act-1", type: "COMMIT" };
      mockService.getById.mockResolvedValue(activity as any);

      const req = mockReq({ params: { id: "act-1" } });
      const res = mockRes();

      await activityController.getById(req, res, mockNext);

      expect(mockService.getById).toHaveBeenCalledWith("act-1");
      expect(res.json).toHaveBeenCalledWith({ success: true, data: activity });
    });

    it("calls next when service throws", async () => {
      mockService.getById.mockRejectedValue(new Error("Not found"));

      const req = mockReq({ params: { id: "nonexistent" } });
      const res = mockRes();

      await activityController.getById(req, res, mockNext);

      expect(mockNext).toHaveBeenCalledWith(expect.any(Error));
    });
  });

  // =========================================================================
  // create
  // =========================================================================

  describe("create", () => {
    it("creates activity and returns 201", async () => {
      const activity = { id: "act-1", type: "COMMIT", title: "feat: add login" };
      mockService.create.mockResolvedValue(activity as any);

      const req = mockReq({ body: { type: "COMMIT", title: "feat: add login", projectId: "proj-1" } });
      const res = mockRes();

      await activityController.create(req, res, mockNext);

      expect(mockService.create).toHaveBeenCalledWith({
        type: "COMMIT",
        title: "feat: add login",
        projectId: "proj-1",
      });
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({ success: true, data: activity });
    });

    it("calls next on error", async () => {
      mockService.create.mockRejectedValue(new Error("Validation error"));

      const req = mockReq({ body: {} });
      const res = mockRes();

      await activityController.create(req, res, mockNext);

      expect(mockNext).toHaveBeenCalledWith(expect.any(Error));
    });
  });

  // =========================================================================
  // update
  // =========================================================================

  describe("update", () => {
    it("updates activity with ownership check and returns success response", async () => {
      const activity = { id: "act-1", type: "COMMIT", title: "Updated" };
      mockService.update.mockResolvedValue(activity as any);

      const req = mockReq({ params: { id: "act-1" }, body: { title: "Updated" }, user: { id: "user-1" } });
      const res = mockRes();

      await activityController.update(req, res, mockNext);

      expect(mockService.update).toHaveBeenCalledWith("act-1", "user-1", { title: "Updated" });
      expect(res.json).toHaveBeenCalledWith({ success: true, data: activity });
    });

    it("calls next when service throws", async () => {
      mockService.update.mockRejectedValue(new Error("Not found"));

      const req = mockReq({ params: { id: "nonexistent" }, body: { title: "X" }, user: { id: "user-1" } });
      const res = mockRes();

      await activityController.update(req, res, mockNext);

      expect(mockNext).toHaveBeenCalledWith(expect.any(Error));
    });
  });

  // =========================================================================
  // remove
  // =========================================================================

  describe("remove", () => {
    it("deletes activity with ownership check and returns success message", async () => {
      mockService.remove.mockResolvedValue(undefined);

      const req = mockReq({ params: { id: "act-1" }, user: { id: "user-1" } });
      const res = mockRes();

      await activityController.remove(req, res, mockNext);

      expect(mockService.remove).toHaveBeenCalledWith("act-1", "user-1");
      expect(res.json).toHaveBeenCalledWith({ success: true, message: "Deleted" });
    });

    it("calls next when service throws", async () => {
      mockService.remove.mockRejectedValue(new Error("Not found"));

      const req = mockReq({ params: { id: "nonexistent" }, user: { id: "user-1" } });
      const res = mockRes();

      await activityController.remove(req, res, mockNext);

      expect(mockNext).toHaveBeenCalledWith(expect.any(Error));
    });
  });
});
