import { describe, it, expect, vi, beforeEach } from "vitest";
import bcrypt from "bcryptjs";
import { prisma } from "../../../src/config/database.js";
import { authService } from "../../../src/modules/auth/service/auth.service.js";
import { hashSessionToken } from "../../../src/modules/auth/utils/auth.utils.js";

const mockPrisma = vi.mocked(prisma);

// Pre-hash "password123" for testing
const PASSWORD_HASH = await bcrypt.hash("password123", 10);

const makeUser = (overrides = {}) => ({
  id: "user-1",
  email: "test@example.com",
  username: "testuser",
  password: PASSWORD_HASH,
  name: "Test User",
  avatarUrl: null,
  bio: null,
  location: null,
  websiteUrl: null,
  createdAt: new Date(),
  updatedAt: new Date(),
  ...overrides,
});

describe("authService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("register", () => {
    it("creates a user and returns tokens", async () => {
      const user = makeUser();
      vi.mocked(mockPrisma.user.findUnique).mockResolvedValue(null);
      vi.mocked(mockPrisma.user.create).mockResolvedValue(user as any);
      vi.mocked(mockPrisma.session.create).mockResolvedValue({} as any);

      const result = await authService.register({
        email: "test@example.com",
        username: "testuser",
        password: "password123",
        name: "Test User",
      });

      expect(result.user.id).toBe("user-1");
      expect(result.user.email).toBe("test@example.com");
      expect(result.user.username).toBe("testuser");
      expect(result.token).toBeDefined();
      expect(result.refreshToken).toBeDefined();
      expect(mockPrisma.session.create).toHaveBeenCalled();
    });

    it("throws ConflictError for duplicate email", async () => {
      vi.mocked(mockPrisma.user.findUnique).mockResolvedValue(makeUser() as any);

      await expect(
        authService.register({
          email: "test@example.com",
          username: "other",
          password: "password123",
        })
      ).rejects.toMatchObject({ statusCode: 409, code: "CONFLICT" });
    });

    it("throws ConflictError for duplicate username", async () => {
      vi.mocked(mockPrisma.user.findUnique)
        .mockResolvedValueOnce(null) // email check
        .mockResolvedValueOnce(makeUser() as any); // username check

      await expect(
        authService.register({
          email: "new@example.com",
          username: "testuser",
          password: "password123",
        })
      ).rejects.toMatchObject({ statusCode: 409, code: "CONFLICT" });
    });

    it("does not return password in the user DTO", async () => {
      const user = makeUser();
      vi.mocked(mockPrisma.user.findUnique).mockResolvedValue(null);
      vi.mocked(mockPrisma.user.create).mockResolvedValue(user as any);
      vi.mocked(mockPrisma.session.create).mockResolvedValue({} as any);

      const result = await authService.register({
        email: "test@example.com",
        username: "testuser",
        password: "password123",
      });

      expect(result.user).not.toHaveProperty("password");
    });
  });

  describe("login", () => {
    it("returns tokens for valid credentials", async () => {
      const user = makeUser();
      vi.mocked(mockPrisma.user.findUnique).mockResolvedValue(user as any);
      vi.mocked(mockPrisma.session.create).mockResolvedValue({} as any);

      const result = await authService.login({
        email: "test@example.com",
        password: "password123",
      });

      expect(result.user.id).toBe("user-1");
      expect(result.token).toBeDefined();
      expect(result.refreshToken).toBeDefined();
    });

    it("throws UnauthorizedError for non-existent email", async () => {
      vi.mocked(mockPrisma.user.findUnique).mockResolvedValue(null);

      await expect(
        authService.login({ email: "nope@example.com", password: "password123" })
      ).rejects.toMatchObject({ statusCode: 401, code: "UNAUTHORIZED" });
    });

    it("throws UnauthorizedError for wrong password", async () => {
      const user = makeUser();
      vi.mocked(mockPrisma.user.findUnique).mockResolvedValue(user as any);

      await expect(
        authService.login({ email: "test@example.com", password: "wrongpassword" })
      ).rejects.toMatchObject({ statusCode: 401, code: "UNAUTHORIZED" });
    });

    it("throws UnauthorizedError for user without password (GitHub-only)", async () => {
      const user = makeUser({ password: null });
      vi.mocked(mockPrisma.user.findUnique).mockResolvedValue(user as any);

      await expect(
        authService.login({ email: "test@example.com", password: "password123" })
      ).rejects.toMatchObject({ statusCode: 401, code: "UNAUTHORIZED" });
    });

    it("creates a session on login", async () => {
      const user = makeUser();
      vi.mocked(mockPrisma.user.findUnique).mockResolvedValue(user as any);
      vi.mocked(mockPrisma.session.create).mockResolvedValue({} as any);

      await authService.login({
        email: "test@example.com",
        password: "password123",
      });

      expect(mockPrisma.session.create).toHaveBeenCalledTimes(1);
      const sessionCall = vi.mocked(mockPrisma.session.create).mock.calls[0][0];
      expect(sessionCall.data.userId).toBe("user-1");
      expect(sessionCall.data.tokenHash).toBeDefined();
      expect(sessionCall.data.expiresAt).toBeInstanceOf(Date);
    });
  });

  describe("me", () => {
    it("returns user DTO for valid id", async () => {
      const user = makeUser();
      vi.mocked(mockPrisma.user.findUnique).mockResolvedValue(user as any);

      const result = await authService.me("user-1");

      expect(result.id).toBe("user-1");
      expect(result).not.toHaveProperty("password");
    });

    it("throws UnauthorizedError for non-existent user", async () => {
      vi.mocked(mockPrisma.user.findUnique).mockResolvedValue(null);

      await expect(authService.me("nonexistent")).rejects.toMatchObject({
        statusCode: 401,
        code: "UNAUTHORIZED",
      });
    });
  });

  describe("refresh", () => {
    it("rejects invalid refresh token", async () => {
      await expect(authService.refresh("fake-token")).rejects.toMatchObject({
        statusCode: 401,
        code: "UNAUTHORIZED",
      });
    });
  });

  describe("logout", () => {
    it("deletes session by token hash", async () => {
      vi.mocked(mockPrisma.session.delete).mockResolvedValue({} as any);

      await authService.logout("user-1", "some-token");

      expect(mockPrisma.session.delete).toHaveBeenCalledWith({
        where: { tokenHash: hashSessionToken("some-token") },
      });
    });

    it("does not throw when no session token provided", async () => {
      await expect(authService.logout("user-1")).resolves.not.toThrow();
    });
  });

  describe("logoutAll", () => {
    it("deletes all sessions for user", async () => {
      vi.mocked(mockPrisma.session.deleteMany).mockResolvedValue({ count: 3 } as any);

      await authService.logoutAll("user-1");

      expect(mockPrisma.session.deleteMany).toHaveBeenCalledWith({
        where: { userId: "user-1" },
      });
    });
  });
});
