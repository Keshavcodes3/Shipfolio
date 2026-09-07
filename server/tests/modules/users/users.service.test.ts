import { describe, it, expect, vi, beforeEach } from "vitest";
import { prisma } from "../../../src/config/database.js";
import { usersService } from "../../../src/modules/users/service/users.service.js";

const mockPrisma = vi.mocked(prisma);

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const makeUser = (overrides = {}) => ({
  id: "user-1",
  username: "johndoe",
  email: "john@example.com",
  name: "John Doe",
  avatarUrl: "https://avatar.url/john.jpg",
  bio: "Full-stack dev",
  location: "NYC",
  websiteUrl: "https://johndoe.dev",
  password: "hashed-password",
  createdAt: new Date("2024-01-01"),
  updatedAt: new Date("2024-06-01"),
  ...overrides,
});

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe("usersService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // =========================================================================
  // getById
  // =========================================================================

  describe("getById", () => {
    it("returns user detail with email", async () => {
      const user = makeUser();
      vi.mocked(mockPrisma.user.findUnique).mockResolvedValue(user as any);

      const result = await usersService.getById("user-1");

      expect(result.id).toBe("user-1");
      expect(result.email).toBe("john@example.com");
      expect(result.username).toBe("johndoe");
    });

    it("throws NotFoundError for non-existent user", async () => {
      vi.mocked(mockPrisma.user.findUnique).mockResolvedValue(null);

      await expect(usersService.getById("nonexistent")).rejects.toMatchObject({
        statusCode: 404,
      });
    });
  });

  // =========================================================================
  // updateOwn
  // =========================================================================

  describe("updateOwn", () => {
    it("updates own account fields", async () => {
      const user = makeUser();
      vi.mocked(mockPrisma.user.findUnique).mockResolvedValue(user as any);
      vi.mocked(mockPrisma.user.findFirst).mockResolvedValue(null);
      vi.mocked(mockPrisma.user.update).mockResolvedValue({} as any);

      await usersService.updateOwn("user-1", { name: "Jane Doe" });

      expect(mockPrisma.user.update).toHaveBeenCalledWith({
        where: { id: "user-1" },
        data: { name: "Jane Doe" },
      });
    });

    it("validates username uniqueness when changing", async () => {
      const user = makeUser();
      vi.mocked(mockPrisma.user.findUnique).mockResolvedValue(user as any);
      vi.mocked(mockPrisma.user.findFirst).mockResolvedValue({ id: "other" } as any);

      await expect(
        usersService.updateOwn("user-1", { username: "taken" })
      ).rejects.toMatchObject({ statusCode: 409 });
    });

    it("allows keeping the same username when other fields change", async () => {
      const user = makeUser();
      vi.mocked(mockPrisma.user.findUnique).mockResolvedValue(user as any);
      vi.mocked(mockPrisma.user.findFirst).mockResolvedValue(null);
      vi.mocked(mockPrisma.user.update).mockResolvedValue({} as any);

      await usersService.updateOwn("user-1", { username: "johndoe", name: "Jane" });

      expect(mockPrisma.user.update).toHaveBeenCalled();
    });

    it("validates email uniqueness when changing", async () => {
      const user = makeUser();
      vi.mocked(mockPrisma.user.findUnique).mockResolvedValue(user as any);
      vi.mocked(mockPrisma.user.findFirst).mockResolvedValue({ id: "other" } as any);

      await expect(
        usersService.updateOwn("user-1", { email: "taken@example.com" })
      ).rejects.toMatchObject({ statusCode: 409 });
    });

    it("allows keeping the same email when other fields change", async () => {
      const user = makeUser();
      vi.mocked(mockPrisma.user.findUnique).mockResolvedValue(user as any);
      vi.mocked(mockPrisma.user.findFirst).mockResolvedValue(null);
      vi.mocked(mockPrisma.user.update).mockResolvedValue({} as any);

      await usersService.updateOwn("user-1", { email: "john@example.com", name: "Jane" });

      expect(mockPrisma.user.update).toHaveBeenCalled();
    });

    it("throws BadRequestError when no fields provided", async () => {
      const user = makeUser();
      vi.mocked(mockPrisma.user.findUnique).mockResolvedValue(user as any);

      await expect(
        usersService.updateOwn("user-1", {})
      ).rejects.toMatchObject({ statusCode: 400 });
    });

    it("throws NotFoundError for non-existent user", async () => {
      vi.mocked(mockPrisma.user.findUnique).mockResolvedValue(null);

      await expect(
        usersService.updateOwn("nonexistent", { name: "X" })
      ).rejects.toMatchObject({ statusCode: 404 });
    });
  });

  // =========================================================================
  // deleteOwn
  // =========================================================================

  describe("deleteOwn", () => {
    it("deletes the user account", async () => {
      vi.mocked(mockPrisma.user.deleteMany).mockResolvedValue({ count: 1 } as any);

      await usersService.deleteOwn("user-1");

      expect(mockPrisma.user.deleteMany).toHaveBeenCalledWith({
        where: { id: "user-1" },
      });
    });

    it("throws NotFoundError when user does not exist", async () => {
      vi.mocked(mockPrisma.user.deleteMany).mockResolvedValue({ count: 0 } as any);

      await expect(
        usersService.deleteOwn("nonexistent")
      ).rejects.toMatchObject({ statusCode: 404 });
    });
  });

  // =========================================================================
  // list
  // =========================================================================

  describe("list", () => {
    it("returns paginated users without email", async () => {
      const users = [
        { id: "u1", username: "alice", name: "Alice", avatarUrl: null, createdAt: new Date() },
      ];
      vi.mocked(mockPrisma.user.findMany).mockResolvedValue(users as any);
      vi.mocked(mockPrisma.user.count).mockResolvedValue(1);

      const result = await usersService.list({ page: 1, limit: 20 });

      expect(result.data).toHaveLength(1);
      expect(result.data[0]).not.toHaveProperty("email");
      expect(result.pagination.total).toBe(1);
    });
  });
});
