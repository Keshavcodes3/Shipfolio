import { describe, it, expect, vi, beforeEach } from "vitest";
import type { Request, Response, NextFunction } from "express";
import { usersController } from "../../../src/modules/users/controller/users.controller.js";

vi.mock("../../../src/modules/users/service/users.service.js", () => ({
  usersService: {
    list: vi.fn(),
    getById: vi.fn(),
    updateOwn: vi.fn(),
    deleteOwn: vi.fn(),
  },
}));

import { usersService } from "../../../src/modules/users/service/users.service.js";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const mockService = vi.mocked(usersService);

const makeReq = (overrides: Partial<Request> = {}) =>
  ({
    query: {},
    params: {},
    body: {},
    ...overrides,
  }) as unknown as Request;

const makeRes = () => {
  const res = {
    json: vi.fn(),
    status: vi.fn().mockReturnThis(),
  } as unknown as Response;
  return res;
};

const next = vi.fn() as unknown as NextFunction;

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe("usersController", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // =========================================================================
  // list
  // =========================================================================

  describe("list", () => {
    it("returns paginated users with 200", async () => {
      const paginationResult = {
        data: [{ id: "u1", username: "alice", name: "Alice", avatarUrl: null, createdAt: new Date() }],
        pagination: { page: 1, limit: 20, total: 1, totalPages: 1 },
      };
      mockService.list.mockResolvedValue(paginationResult as any);

      const req = makeReq({ query: { page: "1", limit: "20" } });
      const res = makeRes();

      await usersController.list(req, res, next);

      expect(mockService.list).toHaveBeenCalledWith(req.query);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: paginationResult.data,
        pagination: paginationResult.pagination,
      });
    });

    it("calls next on error", async () => {
      const error = new Error("Database error");
      mockService.list.mockRejectedValue(error);

      const req = makeReq({ query: {} });
      const res = makeRes();

      await usersController.list(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
      expect(res.json).not.toHaveBeenCalled();
    });
  });

  // =========================================================================
  // getById
  // =========================================================================

  describe("getById", () => {
    it("returns user detail with 200", async () => {
      const userDetail = {
        id: "user-1",
        username: "johndoe",
        email: "john@example.com",
        name: "John Doe",
        avatarUrl: null,
        bio: null,
        location: null,
        websiteUrl: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      mockService.getById.mockResolvedValue(userDetail as any);

      const req = makeReq({ params: { id: "user-1" } });
      const res = makeRes();

      await usersController.getById(req, res, next);

      expect(mockService.getById).toHaveBeenCalledWith("user-1");
      expect(res.json).toHaveBeenCalledWith({ success: true, data: userDetail });
    });

    it("handles array params.id", async () => {
      mockService.getById.mockResolvedValue({ id: "u1" } as any);

      const req = makeReq({ params: { id: ["u1"] as any } });
      const res = makeRes();

      await usersController.getById(req, res, next);

      expect(mockService.getById).toHaveBeenCalledWith("u1");
    });

    it("calls next on error", async () => {
      const error = new Error("Not found");
      mockService.getById.mockRejectedValue(error);

      const req = makeReq({ params: { id: "nonexistent" } });
      const res = makeRes();

      await usersController.getById(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
      expect(res.json).not.toHaveBeenCalled();
    });
  });

  // =========================================================================
  // update
  // =========================================================================

  describe("update", () => {
    it("updates user and returns success message", async () => {
      mockService.updateOwn.mockResolvedValue(undefined);

      const req = makeReq({
        params: { id: "user-1" },
        body: { name: "Jane Doe" },
      });
      const res = makeRes();

      await usersController.update(req, res, next);

      expect(mockService.updateOwn).toHaveBeenCalledWith("user-1", req.body);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: "Account updated",
      });
    });

    it("handles array params.id", async () => {
      mockService.updateOwn.mockResolvedValue(undefined);

      const req = makeReq({ params: { id: ["u1"] as any }, body: {} });
      const res = makeRes();

      await usersController.update(req, res, next);

      expect(mockService.updateOwn).toHaveBeenCalledWith("u1", {});
    });

    it("calls next on error", async () => {
      const error = new Error("Conflict");
      mockService.updateOwn.mockRejectedValue(error);

      const req = makeReq({ params: { id: "user-1" }, body: {} });
      const res = makeRes();

      await usersController.update(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
      expect(res.json).not.toHaveBeenCalled();
    });
  });

  // =========================================================================
  // remove
  // =========================================================================

  describe("remove", () => {
    it("deletes user and returns success message", async () => {
      mockService.deleteOwn.mockResolvedValue(undefined);

      const req = makeReq({ params: { id: "user-1" } });
      const res = makeRes();

      await usersController.remove(req, res, next);

      expect(mockService.deleteOwn).toHaveBeenCalledWith("user-1");
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: "Account deleted",
      });
    });

    it("handles array params.id", async () => {
      mockService.deleteOwn.mockResolvedValue(undefined);

      const req = makeReq({ params: { id: ["u1"] as any } });
      const res = makeRes();

      await usersController.remove(req, res, next);

      expect(mockService.deleteOwn).toHaveBeenCalledWith("u1");
    });

    it("calls next on error", async () => {
      const error = new Error("Not found");
      mockService.deleteOwn.mockRejectedValue(error);

      const req = makeReq({ params: { id: "nonexistent" } });
      const res = makeRes();

      await usersController.remove(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
      expect(res.json).not.toHaveBeenCalled();
    });
  });
});
