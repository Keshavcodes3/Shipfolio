import { describe, it, expect, vi, beforeEach } from "vitest";
import { authController } from "../../../src/modules/auth/controller/auth.controller.js";
import { authService } from "../../../src/modules/auth/service/auth.service.js";

vi.mock("../../../src/modules/auth/service/auth.service.js", () => ({
  authService: {
    register: vi.fn(),
    login: vi.fn(),
    me: vi.fn(),
    refresh: vi.fn(),
    logout: vi.fn(),
    logoutAll: vi.fn(),
    changePassword: vi.fn(),
    githubCallback: vi.fn(),
  },
}));

const mockAuthService = vi.mocked(authService);

const mockReq = (overrides: Record<string, any> = {}) =>
  ({
    body: {},
    params: {},
    query: {},
    cookies: {},
    user: undefined,
    ...overrides,
  }) as any;

const mockRes = () => {
  const res: any = {
    status: vi.fn().mockReturnThis(),
    json: vi.fn().mockReturnThis(),
    cookie: vi.fn().mockReturnThis(),
    clearCookie: vi.fn().mockReturnThis(),
  };
  return res;
};

const mockNext = vi.fn();

describe("authController", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("register", () => {
    it("returns 201 with user and token", async () => {
      const user = { id: "1", email: "a@b.com", username: "a", name: null, avatarUrl: null };
      mockAuthService.register.mockResolvedValue({
        user,
        token: "access-token",
        refreshToken: "session-token",
      });

      const req = mockReq({ body: { email: "a@b.com", username: "a", password: "password123" } });
      const res = mockRes();

      await authController.register(req, res, mockNext);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          data: expect.objectContaining({ user, token: "access-token" }),
        })
      );
      expect(res.cookie).toHaveBeenCalledWith(
        "refreshToken",
        "session-token",
        expect.objectContaining({ httpOnly: true })
      );
    });

    it("calls next on error", async () => {
      mockAuthService.register.mockRejectedValue(new Error("fail"));
      const req = mockReq({ body: {} });
      const res = mockRes();

      await authController.register(req, res, mockNext);

      expect(mockNext).toHaveBeenCalledWith(expect.any(Error));
    });
  });

  describe("login", () => {
    it("returns 200 with user and token", async () => {
      const user = { id: "1", email: "a@b.com", username: "a", name: null, avatarUrl: null };
      mockAuthService.login.mockResolvedValue({
        user,
        token: "access-token",
        refreshToken: "session-token",
      });

      const req = mockReq({ body: { email: "a@b.com", password: "password123" } });
      const res = mockRes();

      await authController.login(req, res, mockNext);

      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ success: true })
      );
    });
  });

  describe("me", () => {
    it("returns current user", async () => {
      const user = { id: "1", email: "a@b.com", username: "a", name: null, avatarUrl: null };
      mockAuthService.me.mockResolvedValue(user);

      const req = mockReq({ user: { id: "1", email: "a@b.com", username: "a" } });
      const res = mockRes();

      await authController.me(req, res, mockNext);

      expect(res.json).toHaveBeenCalledWith({ success: true, data: user });
    });
  });

  describe("refresh", () => {
    it("returns new tokens", async () => {
      const user = { id: "1", email: "a@b.com", username: "a", name: null, avatarUrl: null };
      mockAuthService.refresh.mockResolvedValue({
        user,
        token: "new-access",
        refreshToken: "new-session",
      });

      const req = mockReq({ cookies: { refreshToken: "old-session-token" } });
      const res = mockRes();

      await authController.refresh(req, res, mockNext);

      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ success: true })
      );
      expect(res.cookie).toHaveBeenCalledWith(
        "refreshToken",
        "new-session",
        expect.anything()
      );
    });
  });

  describe("logout", () => {
    it("clears cookie and returns success", async () => {
      mockAuthService.logout.mockResolvedValue(undefined);

      const req = mockReq({
        user: { id: "1", email: "a@b.com", username: "a" },
        cookies: { refreshToken: "session-token" },
      });
      const res = mockRes();

      await authController.logout(req, res, mockNext);

      expect(res.clearCookie).toHaveBeenCalledWith("refreshToken", expect.anything());
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: "Logged out",
      });
    });
  });

  describe("logoutAll", () => {
    it("clears cookie and returns success", async () => {
      mockAuthService.logoutAll.mockResolvedValue(undefined);

      const req = mockReq({ user: { id: "1", email: "a@b.com", username: "a" } });
      const res = mockRes();

      await authController.logoutAll(req, res, mockNext);

      expect(res.clearCookie).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: "Logged out from all devices",
      });
    });
  });

  describe("changePassword", () => {
    it("clears sessions and returns success", async () => {
      mockAuthService.changePassword.mockResolvedValue(undefined);

      const req = mockReq({
        user: { id: "1", email: "a@b.com", username: "a" },
        body: { currentPassword: "old", newPassword: "newpassword123" },
      });
      const res = mockRes();

      await authController.changePassword(req, res, mockNext);

      expect(res.clearCookie).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ success: true })
      );
    });
  });
});
